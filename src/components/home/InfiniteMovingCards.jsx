import React from 'react';
import { ScanEye, MapPin, ShieldCheck, Activity, Layers, Flame, FileDown } from 'lucide-react';

// const CARDS = [
//   {
//     icon: ScanEye,
//     title: 'Automated lesion detection',
//     subtitle: 'Microaneurysms & hemorrhages',
//     quote:
//       'The pipeline flags candidate lesions directly on the fundus image, with each detection paired to a confidence score a clinician can verify in seconds.',
//     tag: 'Evidence type 01',
//   },
//   {
//     icon: MapPin,
//     title: 'Spatial confidence metrics',
//     subtitle: 'Optic disc & fovea localization',
//     quote:
//       'Anatomical landmarks are localized with per-structure confidence, so reviewers can see exactly how much the model trusts its own coordinates.',
//     tag: 'Evidence type 02',
//   },
//   {
//     icon: Layers,
//     title: 'ICDR severity classification',
//     subtitle: '5-level grading validation',
//     quote:
//       'Every grade on the international severity scale is backed by validation against reference standards, keeping the output auditable end to end.',
//     tag: 'Evidence type 03',
//   },
//   {
//     icon: Flame,
//     title: 'Grad-CAM diagnostic mapping',
//     subtitle: 'Explainability first',
//     quote:
//       'Activation maps highlight the regions that drove each prediction — no black-box outputs, only visible, debatable evidence.',
//     tag: 'Evidence type 04',
//   },
//   {
//     icon: FileDown,
//     title: 'Multi-format clinical export',
//     subtitle: 'EHR compatibility',
//     quote:
//       'Reports export to PDF, JSON and HL7-friendly structures so findings drop straight into existing record systems without friction.',
//     tag: 'Evidence type 05',
//   },
// ];

const CARDS = [
  {
    icon: ScanEye,
    title: 'Image quality assessment',
    subtitle: 'Brightness, contrast & coverage',
    quote:
      'The pipeline evaluates the retinal image for brightness, contrast, fundus coverage and potential quality issues before interpreting the model output.',
    tag: 'Analysis type 01',
  },

  {
    icon: Layers,
    title: 'Retinal image preprocessing',
    subtitle: '224×224 normalization',
    quote:
      'The uploaded fundus image is resized to 224×224 pixels and normalized using the same preprocessing configuration used during model inference.',
    tag: 'Analysis type 02',
  },

  {
    icon: Activity,
    title: 'Referable DR screening',
    subtitle: 'Binary ResNet-18 prediction',
    quote:
      'The ResNet-18 model estimates the probability of referable diabetic retinopathy and uses that probability for the screening decision.',
    tag: 'Analysis type 03',
  },

  {
    icon: Flame,
    title: 'Grad-CAM explainability',
    subtitle: 'Prediction activation mapping',
    quote:
      'Grad-CAM highlights image regions that contributed to the model prediction, providing a visual explanation alongside the screening result.',
    tag: 'Analysis type 04',
  },

  {
    icon: ShieldCheck,
    title: 'Review & uncertainty assessment',
    subtitle: 'Quality flags & prediction confidence',
    quote:
      'The system combines image-quality flags and prediction uncertainty to identify cases that may require additional manual review.',
    tag: 'Analysis type 05',
  },
];


function Card({ card }) {
  return (
    <div className="infinite-card">
      <p className="infinite-card__quote">{card.quote}</p>
      <div className="infinite-card__source">
        <span className="infinite-card__avatar">
          <card.icon size={17} strokeWidth={2.1} />
        </span>
        <div>
          <div className="infinite-card__title">{card.title}</div>
          <div className="infinite-card__subtitle">{card.subtitle}</div>
        </div>
        {/* <span className="hiw-badge" style={{ marginLeft: 'auto' }}>{card.tag}</span> */}
      </div>
    </div>
  );
}

/**
 * Aceternity UI — Infinite Moving Cards.
 * Renders the card list twice for a seamless -50% loop; pauses on hover
 * and respects prefers-reduced-motion (handled in CSS).
 */
export default function InfiniteMovingCards({ reverse = false }) {
  return (
    <div
      className="infinite-scroll-container"
      role="region"
      aria-label="Clinical evidence highlights"
    >
      <div className="infinite-scroll-track" data-reverse={reverse ? 'true' : 'false'}>
        {CARDS.map((card) => (
          <Card key={`a-${card.title}`} card={card} />
        ))}
        {CARDS.map((card) => (
          <Card key={`b-${card.title}`} card={card} aria-hidden="true" />
        ))}
      </div>
    </div>
  );
}
