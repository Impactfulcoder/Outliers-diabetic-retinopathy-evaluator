import { motion } from 'framer-motion';
import { X, FileImage, Sparkles } from 'lucide-react';

// used to show the size of img to user
function formatBytes(bytes) {
  if (!bytes) return '0 KB';
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

// props from screening
export default function ImagePreview({ file, previewUrl, onRemove, onAnalyze, analyzing }) {
  return (
    <motion.div
      className="card-surface"
      style={{ borderRadius: 'var(--radius-lg)', padding: 20, overflow: 'hidden' }}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        <div
          style={{
            flex: '1 1 260px',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            background: '#111',
            minHeight: 260,
            position: 'relative',
          }}
        >
          <img
            src={previewUrl}
            alt="Uploaded fundus preview"
            style={{ width: '100%', height: '100%', minHeight: 260, objectFit: 'cover', display: 'block' }}
          />
          <button
            onClick={onRemove}
            aria-label="Remove image"
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: 'rgba(0,0,0,0.55)',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={16} color="#fff" />
          </button>
        </div>

        <div style={{ flex: '1 1 220px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'var(--color-lavender)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* //icons */}
                <FileImage size={17} color="var(--color-primary)" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14.5, wordBreak: 'break-all' }}>{file?.name}</div>
                <div className="text-muted-custom" style={{ fontSize: 12.5 }}>
                  {/* //iamge size to client */}
                  {formatBytes(file?.size)}
                </div>
              </div>
            </div>
            {/* jhoooth , ikdum jhooth */}
            <p className="text-muted-custom" style={{ fontSize: 14, lineHeight: 1.6 }}>
              Your image stays in your browser for this demo — nothing is uploaded to a server.
              Ready to run the simulated AI pipeline?
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 18, flexWrap: 'wrap' }}>
            <button
              className="btn-pill btn-primary-pill"
              // {/* to show the analysis / progress as of now its fake */}
              onClick={onAnalyze}
              disabled={analyzing}
              style={{ opacity: analyzing ? 0.7 : 1 }}
            >
              <Sparkles size={16} />
              {analyzing ? 'Analyzing…' : 'Run AI Analysis'}
            </button>
            <button className="btn-pill btn-outline-pill" onClick={onRemove} disabled={analyzing}>
              Remove
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
