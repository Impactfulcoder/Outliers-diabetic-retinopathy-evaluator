/**
 * Vendored from @designcodeio/threeui (MIT License)
 * Source: lib-dist/shaders/animated-top-dock/topDockController.js
 *
 * Attaches macOS-style dock physics to a nav element. Any child marked
 * [data-dock-item] grows in width/height as the pointer (or keyboard focus)
 * approaches, with spring smoothing. Respects prefers-reduced-motion and
 * touch-only pointers by going static.
 *
 * Usage:
 *   useEffect(() => createTopDockController(navRef.current, getOptions), []);
 *
 * Options (read fresh on every frame via getOptions):
 *   axis          'x' | 'y'            growth axis (default 'x')
 *   proximity     number (px)          falloff radius (default 120)
 *   spring        number               spring stiffness (default 0.19)
 *   damping       number               spring damping (default 0.7)
 *   widthGrowth   number (px)          max width added (default 16)
 *   heightGrowth  number (px)          max height added (default 14)
 *   drop          number (px)          translateY at full growth (default 3.5)
 *   distribute    boolean              proportional widths instead of growth
 *   lockTrack     boolean              lock container width after measuring
 */

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const smoothstep = (t) => t * t * (3 - 2 * t);

export function createTopDockController(nav, getOptions) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  const items = Array.from(nav.querySelectorAll('[data-dock-item]')).map((element) => ({
    element,
    baseWidth: 0,
    baseHeight: 0,
    value: 0,
    velocity: 0,
    target: 0,
  }));

  let active = false;
  let pointerInside = false;
  let needsUpdate = false;
  let rafId = 0;

  const isEnabled = () =>
    typeof window !== 'undefined' &&
    !reducedMotion.matches &&
    nav.clientWidth > 0 &&
    window.innerWidth > 600 &&
    finePointer.matches;

  // Clear transient styles and (re)measure base sizes of every item.
  const measure = () => {
    active = isEnabled();
    if (getOptions().lockTrack) nav.style.width = '';
    for (const item of items) {
      item.element.style.width = '';
      item.element.style.height = '';
      item.element.style.transform = '';
      item.element.dataset.dockNear = 'false';
    }
    for (const item of items) {
      const rect = item.element.getBoundingClientRect();
      item.baseWidth = rect.width;
      item.baseHeight = rect.height;
      item.value = 0;
      item.velocity = 0;
      item.target = 0;
    }
    pointerInside = false;
    needsUpdate = false;
    if (getOptions().distribute) distributeWidths();
    if (getOptions().lockTrack) {
      nav.style.width = `${nav.getBoundingClientRect().width.toFixed(2)}px`;
    }
    nav.dataset.dockState = active ? 'idle' : 'static';
    nav.dataset.dockMax = '0.00';
  };

  const applyTransforms = () => {
    const options = getOptions();
    if (options.distribute && options.axis !== 'y') {
      distributeWidths();
      return;
    }
    for (const item of items) {
      const value = clamp(item.value, 0, 1.08);
      if (options.axis === 'y') {
        item.element.style.width = '';
        item.element.style.height = `${(item.baseHeight + options.heightGrowth * value).toFixed(2)}px`;
        item.element.style.transform = `translateX(${(value * options.drop).toFixed(2)}px)`;
        continue;
      }
      const isLogo = item.element.hasAttribute('data-dock-logo');
      const widthDelta = isLogo
        ? options.widthGrowth * (14 / 17)
        : Math.min(options.widthGrowth, item.baseWidth * 0.24);
      const heightDelta = isLogo ? options.heightGrowth * (14 / 16) : options.heightGrowth;
      item.element.style.width = `${(item.baseWidth + widthDelta * value).toFixed(2)}px`;
      item.element.style.height = `${(item.baseHeight + heightDelta * value).toFixed(2)}px`;
      item.element.style.transform = `translateY(${(value * options.drop).toFixed(2)}px)`;
    }
  };

  const distributeWidths = () => {
    const options = getOptions();
    if (!(options.distribute && options.axis !== 'y')) return;
    const widths = items.map(
      (item) => item.baseWidth + options.widthGrowth * clamp(item.value, 0, 1.08)
    );
    const total = widths.reduce((sum, w) => sum + w, 0);
    const baseTotal = items.reduce((sum, item) => sum + item.baseWidth, 0);
    const available = nav.clientWidth >= baseTotal ? nav.clientWidth : 0;
    items.forEach((item, index) => {
      item.element.style.width = available ? `${((available * widths[index]) / total).toFixed(2)}px` : '';
      item.element.style.height = '';
      item.element.style.transform = '';
    });
  };

  // Pointer proximity along the dock axis.
  const handlePointerMove = (clientX, clientY) => {
    if (!active) return;
    const options = getOptions();
    const along = options.axis === 'y' ? clientY : clientX;
    const rects = items.map((item) => item.element.getBoundingClientRect());
    for (let i = 0; i < items.length; i += 1) {
      const rect = rects[i];
      const center = options.axis === 'y' ? rect.top + rect.height * 0.5 : rect.left + rect.width * 0.5;
      const raw = clamp(1 - Math.abs(along - center) / Math.max(1, options.proximity), 0, 1);
      items[i].target = smoothstep(raw);
      items[i].element.dataset.dockNear = items[i].target > 0.08 ? 'true' : 'false';
    }
    pointerInside = true;
    needsUpdate = true;
    nav.dataset.dockState = 'active';
  };

  // Keyboard focus: focused item grows, neighbours get a small nudge.
  const handleFocus = (element) => {
    if (!active) return;
    const index = items.findIndex((item) => item.element === element);
    if (index < 0) return;
    items.forEach((item, i) => {
      item.target = i === index ? 1 : Math.abs(i - index) === 1 ? 0.24 : 0;
      item.element.dataset.dockNear = item.target > 0.08 ? 'true' : 'false';
    });
    pointerInside = false;
    needsUpdate = true;
    nav.dataset.dockState = 'focus';
  };

  const release = () => {
    pointerInside = false;
    needsUpdate = true;
    for (const item of items) {
      item.target = 0;
      item.element.dataset.dockNear = 'false';
    }
  };

  // Spring integration loop.
  const tick = () => {
    if (active && needsUpdate) {
      const options = getOptions();
      let stillMoving = false;
      let maxValue = 0;
      for (const item of items) {
        item.velocity += (item.target - item.value) * options.spring;
        item.velocity *= options.damping;
        item.value += item.velocity;
        if (
          Math.abs(item.target - item.value) < 0.001 &&
          Math.abs(item.velocity) < 0.001
        ) {
          item.value = item.target;
          item.velocity = 0;
        } else {
          stillMoving = true;
        }
        maxValue = Math.max(maxValue, clamp(item.value, 0, 1.08));
      }
      applyTransforms();
      nav.dataset.dockMax = maxValue.toFixed(2);
      if (!stillMoving) {
        needsUpdate = false;
        if (items.every((item) => item.target === 0)) {
          nav.dataset.dockState = 'idle';
        }
      }
    }
    rafId = requestAnimationFrame(tick);
  };

  const onPointerMove = (event) => handlePointerMove(event.clientX, event.clientY);

  // When the pointer has left the dock bounds, release growth.
  const onWindowPointerMove = (event) => {
    if (!mounted || !pointerInside || typeof window === 'undefined') return;
    const navRect = nav.getBoundingClientRect();
    const rects = items.map((item) => item.element.getBoundingClientRect());
    const bottom = Math.max(navRect.bottom, ...rects.map((rect) => rect.bottom));
    const outside =
      event.clientX < navRect.left ||
      event.clientX > navRect.right ||
      event.clientY < navRect.top ||
      event.clientY > bottom;
    if (outside) release();
  };

  const onFocusIn = (event) => {
    const element = event.target?.closest('[data-dock-item]');
    if (element) handleFocus(element);
  };

  const onFocusOut = () =>
    requestAnimationFrame(() => {
      if (!nav.contains(document.activeElement)) release();
    });

  const onKeyDown = (event) => {
    const element = event.target?.closest('[data-dock-item]');
    if (element && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      element.click();
    }
  };

  const onClick = () => release();

  let measuredOnce = false;
  const measureOnce = () => {
    if (!measuredOnce) measure();
  };
  if (document.fonts?.ready) document.fonts.ready.then(measureOnce);

  let resizeObserver = null;
  let mounted = true;

  const attach = () => {
    // Defer measure() out of the observer callback: it resets inline styles
    // (layout mutation), which would otherwise trigger benign
    // "ResizeObserver loop completed with undelivered notifications" warnings.
    resizeObserver = new ResizeObserver(() => requestAnimationFrame(measure));
    resizeObserver.observe(nav.closest('[data-dock-frame]') ?? nav.parentElement ?? nav);

    nav.addEventListener('pointermove', onPointerMove);
    nav.addEventListener('pointerleave', release);
    nav.addEventListener('focusin', onFocusIn);
    nav.addEventListener('focusout', onFocusOut);
    nav.addEventListener('keydown', onKeyDown);
    nav.addEventListener('click', onClick);
    window.addEventListener('pointermove', onWindowPointerMove, { passive: true });
    reducedMotion.addEventListener('change', measure);
    finePointer.addEventListener('change', measure);
  };

  attach();

  measure();
  rafId = requestAnimationFrame(tick);

  return () => {
    mounted = false;
    measuredOnce = true;
    nav.style.width = '';
    cancelAnimationFrame(rafId);
    if (resizeObserver) {
      try { resizeObserver.disconnect(); } catch (e) {
        /* ignore teardown noise in StrictMode / fast remounts */
      }
    }
    try { nav.removeEventListener('pointermove', onPointerMove); } catch (e) {}
    try { nav.removeEventListener('pointerleave', release); } catch (e) {}
    try { nav.removeEventListener('focusin', onFocusIn); } catch (e) {}
    try { nav.removeEventListener('focusout', onFocusOut); } catch (e) {}
    try { nav.removeEventListener('keydown', onKeyDown); } catch (e) {}
    try { nav.removeEventListener('click', onClick); } catch (e) {}
    try { window.removeEventListener('pointermove', onWindowPointerMove); } catch (e) {}
    try { reducedMotion.removeEventListener('change', measure); } catch (e) {}
    try { finePointer.removeEventListener('change', measure); } catch (e) {}
  };
}
