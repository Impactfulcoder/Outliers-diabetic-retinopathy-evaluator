import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
// import { RectangleButtons } from "@designcodeio/threeui/components/RectangleButtons";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <>
      <section className="section" style={{ paddingTop: 56 }}>
        <div className="container-wide">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 48,
              alignItems: "center",
            }}
          >
            <motion.div
              style={{ flex: "1 1 460px" }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* <span className="eyebrow">AI-assisted screening prototype</span> */}
              <h1
                className="section-title"
                style={{ marginTop: 20, fontSize: "clamp(36px, 5vw, 58px)" }}
              >
                Smarter retinal screening,
                <br />
                built for{" "}
                <span className="italic-serif">earlier detection.</span>
              </h1>
              <p
                className="text-muted-custom"
                style={{
                  fontSize: 18,
                  marginTop: 22,
                  maxWidth: 480,
                  lineHeight: 1.6,
                }}
              >
                Moody blends AI-assisted retinal image analysis with clinician
                oversight for faster, explainable diabetic retinopathy screening
                — designed to support, not replace, the ophthalmologist.
              </p>
              <div
                className="hero-cta"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginTop: 32,
                  flexWrap: "wrap",
                }}
              >
                {/* threeui RectangleButtons — lumen CTA (light mode) */}
                {/* <RectangleButtons
                  variant="lumen-cta"
                  mode="light"
                  label="Start Screening"
                  onClick={() => navigate("/screen")}
                  style={{ width: "auto", height: "auto" }}
                /> */}
                <div
                  className="d-none d-lg-flex"
                  style={{ alignItems: "center", gap: 14 }}
                >
                  {/* <BackendStatus /> */}
                  <button
                    className="btn-pill btn-primary-pill"
                    onClick={() => navigate("/screen")}
                  >
                    Start Screening
                  </button>
                </div>
                <button
                  className="btn-pill btn-outline-pill"
                  onClick={() => navigate("#")}
                >
                  Explore the Pipeline <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
            <div></div>

            {/* // commented the unnecessary block for eye */}
            {/* <motion.div
            style={{ flex: '1 1 380px', position: 'relative' }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            {/* threeui ConstellationField (topo-field variant) in a shader frame */}
            {/* <div
              className="shader-frame"
              style={{ aspectRatio: '1 / 1', borderRadius: 'var(--radius-lg)' }}
            >
              <div className="shader-frame__inner">
                <ConstellationField
                  variant="topo-field"
                  mode="dark"
                  speed={0.85}
                  density={1.05}
                  length={1.1}
                />
              </div>
              <span className="shader-frame__badge" style={{ top: 16, left: 16 }}>
                <span className="dot dot-green" /> Topography scan · live
              </span>
              <span className="shader-frame__badge" style={{ bottom: 16, right: 16 }}>
                Moody · retinal AI
              </span>
            </div>

            <motion.div
              className="card-surface"
              style={{ ...heroFloat, top: -14, left: -14 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span className="dot dot-green" /> Image Quality: Good
            </motion.div>

            <motion.div
              className="card-surface"
              style={{ ...heroFloat, bottom: 46, right: -18 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65 }}
            >
              AI Confidence: 94%
            </motion.div>

            <motion.div
              className="card-surface"
              style={{
                ...heroFloat,
                bottom: -16,
                left: 24,
                background: 'var(--color-primary)',
                color: '#fff',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              DR Grade: Moderate
            </motion.div>
        </div> */}
          </div>

          <div
            className="text-muted-custom"
            style={{ marginTop: 56, fontSize: 12.5, textAlign: "center" }}
          >
            Simulated demo output shown above. This prototype does not provide
            medical diagnosis.
          </div>
        </div>
      </section>
    </>
  );
}
