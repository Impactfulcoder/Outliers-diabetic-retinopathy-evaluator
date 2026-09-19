import React from "react";
import { motion } from "framer-motion";
import { ScanEye, Layers, Activity, Sparkles, FileText } from "lucide-react";

//Complete Workflow section
// const STAGES = [
//   {
//     stage: "01",
//     title: "Image Quality Assessment",
//     text: "Checks focus, illumination and field definition before any analysis begins.",
//     icon: ScanEye,
//     badge: "Input gate",
//   },
//   {
//     stage: "02",
//     title: "Retinal Anatomical Localization",
//     text: "Segments the optic disc, fovea and vascular network across the fundus.",
//     icon: Layers,
//     badge: "Segmentation",
//   },
//   {
//     stage: "03",
//     title: "DR Severity Grading",
//     text: "Scores diabetic retinopathy on the international 5-level ICDR scale.",
//     icon: Activity,
//     badge: "ICDR scale",
//   },
//   {
//     stage: "04",
//     title: "Clinical Explainability & Lesion Maps",
//     text: "Surfaces the microaneurysms and hemorrhages driving each prediction.",
//     icon: Sparkles,
//     badge: "Grad-CAM",
//   },
//   {
//     stage: "05",
//     title: "Clinician Report Compilation",
//     text: "Assembles a structured, shareable summary ready for ophthalmologist review.",
//     icon: FileText,
//     badge: "Human review",
//   },
// ];

const STAGES = [
  {
    stage: "01",
    title: "Image Quality Assessment",
    text: "Checks brightness, contrast, fundus coverage and potential image-quality issues before screening.",
    icon: ScanEye,
    badge: "Quality check",
  },

  {
    stage: "02",
    title: "Retinal Image Preprocessing",
    text: "Resizes the retinal image to 224×224 pixels and applies the same normalization used during model training.",
    icon: Layers,
    badge: "Preprocessing",
  },

  {
    stage: "03",
    title: "Referable DR Screening",
    text: "ResNet-18 estimates the probability that the retinal image shows referable diabetic retinopathy.",
    icon: Activity,
    badge: "Binary screening",
  },

  {
    stage: "04",
    title: "Screening Threshold Evaluation",
    text: "Compares the predicted DR probability against the validation-selected screening threshold to determine the screening result.",
    icon: Sparkles,
    badge: "Decision",
  },

  {
    stage: "05",
    title: "Grad-CAM Explainability",
    text: "Generates a Grad-CAM visualization from a late ResNet-18 convolutional layer to highlight image regions influencing the prediction.",
    icon: FileText,
    badge: "Grad-CAM",
  },
];

/**
 * 21st.dev-style connected workflow: five pipeline stages joined by a
 * dashed flow line, with stage pills, badges and hover states.
 */
export default function HowItWorks() {
  return (
    <div>
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ maxWidth: 640, marginBottom: 44 }}
      >
        <span className="eyebrow">Complete workflow</span>
        <h2 className="section-title" style={{ marginTop: 16 }}>
          From retinal image <br />
          to <span className="italic-serif">clinical insight</span>
        </h2>
      </motion.div>

      <div className="hiw-grid">
         {/* line between the cards indicating the flow */}
        {/* <div className="hiw-connector" aria-hidden="true" /> */}
        {STAGES.map((stage, index) => (
          <motion.div
            key={stage.stage}
            className="hiw-card"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
          >
            <div className="hiw-stage">
              <stage.icon size={20} strokeWidth={2.1} />
            </div>
            <h3>
              {/* stage number and title */}
              {/* <span style={{ color: "var(--color-primary)", marginRight: 8 }}>
                {stage.stage}
              </span> */}
              {stage.title}
            </h3>
            <p>{stage.text}</p>
            <span className="hiw-badge">{stage.badge}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
