import { motion } from 'framer-motion';

// just below hero section 
export function StatCard({ value, label, tint = 'lavender' }) {
  return (
    <motion.div
      className={`card-surface card-lift tint-${tint}`}
      style={{ padding: '28px 24px', borderRadius: 'var(--radius-md)' }}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.02em' }}>{value}</div>
      <div className="text-muted-custom" style={{ fontSize: 14.5, marginTop: 6 }}>
        {label}
      </div>
    </motion.div>
  );
}

export default StatCard;
