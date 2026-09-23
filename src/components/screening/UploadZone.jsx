import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, ImagePlus } from 'lucide-react';

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_SIZE_MB = 15;

//props are from the Screening as handleFileAccepted and onError
export default function UploadZone({ onFileAccepted, onError }) {
  const inputRef = useRef(null);
  // check if img uploaded / not
  const [dragging, setDragging] = useState(false);

  // Client site validation for image
  const validateAndAccept = (file) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      // onError callback is passed from the parent function
      onError && onError('Unsupported file type. Please upload a JPG or PNG fundus image.');
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      onError && onError(`File is too large. Please upload an image under ${MAX_SIZE_MB} MB.`);
      return;
    }
    //if no error , function to run
    onFileAccepted(file);
  };

  return (
    // option 1 image drag option , using the use state hook for the dragging state
    <motion.div
      className="card-surface"
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      // when the drag is left set the dragging state to false
      onDragLeave={() => setDragging(false)}
      // when the drag is dropped and validate function for dropped img
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        validateAndAccept(file);
      }}

      // option 2 click img to upload
      onClick={() => inputRef.current?.click()}
      style={{
        borderRadius: 'var(--radius-lg)',
        border: dragging ? '2px dashed var(--color-primary)' : '2px dashed var(--color-border)',
        background: dragging ? 'var(--color-lavender-2)' : 'var(--color-card)',
        padding: '64px 24px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      whileHover={{ scale: 1.005 }}
    >

      {/* //CORE functionality for the page */}
      {/* file input element */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        style={{ display: 'none' }}
        // allowing only 1 file to upload
        onChange={(e) => validateAndAccept(e.target.files?.[0])}
      />


      <div
        style={{
          width: 68,
          height: 68,
          borderRadius: 20,
          background: 'var(--color-lavender)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
        }}
      >
        {/* Using lucide-react icons : cloud for not uploaded / image for uploaded */}
        {dragging ? (
          <ImagePlus size={30} color="var(--color-primary)" />
        ) : (
          <UploadCloud size={30} color="var(--color-primary)" />
        )}
      </div>

      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>
        {dragging ? 'Drop your fundus image' : 'Drag & drop a fundus image'}
      </div>
      <div className="text-muted-custom" style={{ fontSize: 14.5, marginBottom: 18 }}>
        or click to browse — JPG or PNG, up to {MAX_SIZE_MB}MB
      </div>
      <span className="btn-pill btn-ghost-pill">Choose Image</span>
    </motion.div>
  );
}
