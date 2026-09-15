import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Eye, Users, Cpu } from 'lucide-react';

const VALUES = [
  { icon: ShieldCheck, title: 'Trust', text: 'Every prediction is paired with visible evidence, never presented as a final diagnosis.' },
  { icon: Cpu, title: 'Clinical intelligence', text: 'A structured pipeline mirrors how a clinician actually assesses a fundus image.' },
  { icon: Eye, title: 'Early detection', text: 'Designed to support screening at scale, catching disease before symptoms appear.' },
  { icon: Users, title: 'Human-in-the-loop', text: 'The ophthalmologist always has the final word — AI assists, it does not decide.' },
];

export default function About() {
  return (
    <div className="section">
      <div className="container-wide" style={{ maxWidth: 900 }}>
        <div style={{ marginBottom: 40 }}>
          <span className="eyebrow">About the prototype</span>
          <h1 className="section-title" style={{ marginTop: 16 }}>
            Built for accessible, <span className="italic-serif">explainable</span> screening
          </h1>
          <p className="text-muted-custom" style={{ fontSize: 16, marginTop: 16, lineHeight: 1.7 }}>
            moody is a demonstration platform exploring what an AI-assisted diabetic
            retinopathy screening workflow could look like end-to-end — from image capture to a
            clinician-reviewed report. Every prediction, segmentation mask and confidence score in
            this build is simulated for demonstration purposes.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginBottom: 48 }}>
          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              className="card-surface card-lift"
              style={{ padding: 24, borderRadius: 'var(--radius-md)' }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: 'var(--color-lavender)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 14,
                }}
              >
                <v.icon size={19} color="var(--color-primary)" />
              </div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>{v.title}</div>
              <div className="text-muted-custom" style={{ fontSize: 13.5, lineHeight: 1.55 }}>{v.text}</div>
            </motion.div>
          ))}
        </div>

        <div className="card-surface" style={{ borderRadius: 'var(--radius-lg)', padding: 28 }}>
          <h3 style={{ fontSize: 19, marginBottom: 12 }}>Why this exists</h3>
          <p className="text-muted-custom" style={{ fontSize: 14.5, lineHeight: 1.7 }}>
            Diabetic retinopathy is a leading cause of preventable blindness, and manual screening
            does not scale to the number of people who need annual eye exams. This prototype
            explores how a well-designed AI pipeline — paired with transparent evidence and a
            clinician review step — could make screening faster without sacrificing safety. The
            interface intentionally avoids the word "diagnosis": every result here is an
            AI-assisted screening signal meant to prioritize cases for human review.
          </p>
        </div>

        <p className="text-muted-custom" style={{ fontSize: 12.5, marginTop: 24, textAlign: 'center' }}>
          Prototype only. Results are simulated and must not be used for clinical diagnosis or treatment decisions.
        </p>
      </div>
    </div>
  );
}
