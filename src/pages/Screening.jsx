import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react'; // rarely used (say img > 15mb)

import UploadZone from '../components/screening/UploadZone';
import ImagePreview from '../components/screening/ImagePreview';
import { analyzeImage } from '../services/api';

export default function Screening() {
  const navigate = useNavigate();
  // check if file set or not
  const [file, setFile] = useState(null);
  // url to preview the file
  const [previewUrl, setPreviewUrl] = useState(null);
  // check for error
  const [error, setError] = useState(null);
  // check if analyzing / not
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    return () => {
      // cleanup function when component unmount (img)
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileAccepted = (f) => {
    setError(null);
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleRemove = () => {
    // remove button for image if exist
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setError(null);
  };

  
const runAnalysis = async () => {
  if (!file) return;

  try {
    setAnalyzing(true);

    const result = await analyzeImage(file);

    navigate('/results', {
      state: {
        result,
        originalImage: previewUrl,
      },
    });
  } catch (error) {
    console.error(error);

    setError(
      error.message ||
      'Unable to analyze image.'
    );
  } finally {
    setAnalyzing(false);
  }
};

  return (
    <div className="section">
      <div className="container-wide" style={{ maxWidth: 820 }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 36, textAlign: 'center' }}
        >
          <span className="eyebrow">Screening workflow</span>
          <h1 className="section-title" style={{ marginTop: 16 }}>Retinal Image Screening</h1>
          <p className="text-muted-custom" style={{ fontSize: 16, marginTop: 12 }}>
            Upload a fundus image to run the retinal analysis pipeline.
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: '#FDE8E8',
              color: '#C23434',
              borderRadius: 'var(--radius-sm)',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 20,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {/* // imported from lucide will appear above the uplaod section danger with error */}
            <AlertCircle size={18} /> {error} 
          </motion.div>
        )}

        <AnimatePresence mode="wait"> 

          {!analyzing && !file && (
            <motion.div key="upload" exit={{ opacity: 0 }}>
              <UploadZone onFileAccepted={handleFileAccepted} onError={setError} />
            </motion.div>
          )}

          {!analyzing && file && (
            <motion.div key="preview" exit={{ opacity: 0 }}>
              <ImagePreview
                file={file}
                previewUrl={previewUrl}
                onRemove={handleRemove}
                onAnalyze={runAnalysis}
                analyzing={analyzing}
              />
            </motion.div>
          )}

        </AnimatePresence>

        <p className="text-muted-custom" style={{ fontSize: 12.5, textAlign: 'center', marginTop: 28 }}>
          Prototype only. Results are simulated and must not be used for clinical diagnosis or treatment decisions.
        </p>
      </div>
    </div>
  );
}
