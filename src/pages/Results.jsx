import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Image as ImageIcon,
  Activity,
  ShieldCheck,
  ScanEye,
} from 'lucide-react';

function Results() {
  const navigate = useNavigate();
  const location = useLocation();

  /*
   * Data is received from Screening.jsx after api.js
   * finishes the backend request.
   *
   * navigate('/results', {
   *   state: {
   *     result: backendResult,
   *     originalImage: previewUrl
   *   }
   * });
   */
  const result = location.state?.result;
  const originalImage = location.state?.originalImage;

  // Prevent direct /results access without analysis data.
  if (!result) {
    return (
      <div className="container py-5">
        <div
          className="card border-0 shadow-sm mx-auto"
          style={{ maxWidth: '600px' }}
        >
          <div className="card-body text-center p-5">
            <AlertTriangle size={48} className="text-warning mb-3" />

            <h3>No Analysis Available</h3>

            <p className="text-muted mb-4">
              Upload and analyze a retinal image before viewing results.
            </p>

            <button
              className="btn btn-primary"
              onClick={() => navigate('/screening')}
            >
              <ArrowLeft size={18} className="me-2" />
              Back to Screening
            </button>
          </div>
        </div>
      </div>
    );
  }

  const prediction = result.prediction || {};
  const quality = result.image_quality || {};
  const gradcam = result.gradcam || {};

  const drProbability = Number(
    prediction.dr_probability ?? 0
  );

  const confidence = Number(
    prediction.confidence ?? 0
  );

  const probabilityPercent =
    (drProbability * 100).toFixed(1);

  const confidencePercent =
    (confidence * 100).toFixed(1);

  const isReferable =
    prediction.screening_result === 'refer_for_review';

  const needsManualReview =
    Boolean(prediction.needs_manual_review);

  const qualityFlags =
    Array.isArray(quality.quality_flags)
      ? quality.quality_flags
      : [];

  return (
    <div className="container py-4 py-lg-5">

      {/* =========================================================
          HEADER
      ========================================================= */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            Retinal Screening Result
          </h2>

          <p className="text-muted mb-0">
            AI-assisted diabetic retinopathy screening
          </p>
        </div>

        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate('/screening')}
        >
          <ArrowLeft size={17} className="me-2" />
          New Screening
        </button>
      </div>


      {/* =========================================================
          PRIMARY RESULT
      ========================================================= */}
      <div
        className={`card shadow-sm mb-4 ${
          isReferable
            ? 'border-danger'
            : 'border-success'
        }`}
      >
        <div className="card-body p-4">
          <div className="row align-items-center g-4">

            <div className="col-md-7">
              <div className="d-flex align-items-center gap-3">

                <div>
                  {isReferable ? (
                    <AlertTriangle
                      size={42}
                      className="text-danger"
                    />
                  ) : (
                    <CheckCircle2
                      size={42}
                      className="text-success"
                    />
                  )}
                </div>

                <div>
                  <p className="text-muted small mb-1">
                    SCREENING RESULT
                  </p>

                  <h3
                    className={`fw-bold mb-1 ${
                      isReferable
                        ? 'text-danger'
                        : 'text-success'
                    }`}
                  >
                    {isReferable
                      ? 'Refer for Review'
                      : 'Screen Negative'}
                  </h3>

                  <p className="text-muted mb-0">
                    {isReferable
                      ? 'The model detected findings that meet the screening referral threshold.'
                      : 'The model output is below the screening referral threshold.'}
                  </p>
                </div>

              </div>
            </div>


            <div className="col-md-5">
              <div className="row g-3">

                <div className="col-6">
                  <MetricCard
                    icon={<Activity size={19} />}
                    label="DR Probability"
                    value={`${probabilityPercent}%`}
                  />
                </div>

                <div className="col-6">
                  <MetricCard
                    icon={<ShieldCheck size={19} />}
                    label="Confidence"
                    value={`${confidencePercent}%`}
                  />
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>


      {/* =========================================================
          ORIGINAL + GRAD-CAM
      ========================================================= */}
      <div className="mb-4">
        <div className="mb-3">
          <h4 className="fw-semibold mb-1">
            Explainability
          </h4>

          <p className="text-muted mb-0">
            Compare the uploaded retinal image with the
            model-generated Grad-CAM visualization.
          </p>
        </div>

        <div className="row g-4">

          {/* Original */}
          <div className="col-lg-6">
            <ImageCard
              title="Original Image"
              description="Retinal image submitted for screening."
              image={originalImage}
              icon={<ImageIcon size={20} />}
            />
          </div>


          {/* Grad-CAM */}
          <div className="col-lg-6">
            <ImageCard
              title="Grad-CAM"
              description="Regions that contributed strongly to the model output."
              image={gradcam.image}
              icon={<ScanEye size={20} />}
            />
          </div>

        </div>
      </div>


      {/* =========================================================
          MODEL DETAILS
      ========================================================= */}
      <div className="row g-4 mb-4">

        <div className="col-lg-6">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body p-4">

              <div className="d-flex align-items-center gap-2 mb-4">
                <Activity
                  size={22}
                  className="text-primary"
                />

                <h5 className="fw-semibold mb-0">
                  Prediction Details
                </h5>
              </div>

              <DetailRow
                label="DR Probability"
                value={`${probabilityPercent}%`}
              />

              <DetailRow
                label="Model Confidence"
                value={`${confidencePercent}%`}
              />

              <DetailRow
                label="Screening Decision"
                value={
                  isReferable
                    ? 'Refer for Review'
                    : 'Screen Negative'
                }
              />

              <DetailRow
                label="Manual Review"
                value={
                  needsManualReview
                    ? 'Required'
                    : 'Not Flagged'
                }
                last
              />

            </div>
          </div>
        </div>


        {/* =======================================================
            IMAGE QUALITY
        ======================================================= */}
        <div className="col-lg-6">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body p-4">

              <div className="d-flex align-items-center gap-2 mb-4">
                <Eye
                  size={22}
                  className="text-primary"
                />

                <h5 className="fw-semibold mb-0">
                  Image Quality
                </h5>
              </div>

              <QualityRow
                label="Brightness"
                value={quality.brightness}
              />

              <QualityRow
                label="Contrast"
                value={quality.contrast}
              />

              <QualityRow
                label="Fundus Coverage"
                value={quality.coverage}
              />

            </div>
          </div>
        </div>

      </div>


      {/* =========================================================
          QUALITY FLAGS
      ========================================================= */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-4">

          <h5 className="fw-semibold mb-3">
            Quality Assessment
          </h5>

          {qualityFlags.length === 0 ? (
            <div className="d-flex align-items-center gap-2 text-success">
              <CheckCircle2 size={20} />

              <span>
                No image quality flags were detected.
              </span>
            </div>
          ) : (
            <div>
              <div className="d-flex align-items-center gap-2 text-warning mb-3">
                <AlertTriangle size={20} />

                <span>
                  The following image quality issues were detected:
                </span>
              </div>

              <div className="d-flex flex-wrap gap-2">
                {qualityFlags.map((flag) => (
                  <span
                    key={flag}
                    className="badge text-bg-warning p-2"
                  >
                    {formatQualityFlag(flag)}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>


      {/* =========================================================
          DISCLAIMER
      ========================================================= */}
      <div className="alert alert-light border mb-0">
        <div className="d-flex gap-3">
          <ShieldCheck
            size={22}
            className="text-secondary flex-shrink-0 mt-1"
          />

          <div>
            <strong>Screening support only</strong>

            <p className="small text-muted mb-0 mt-1">
              This output is generated by an AI screening model
              and should not be treated as a clinical diagnosis.
              Refer flagged or uncertain cases for appropriate
              clinical evaluation.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}


/* ===============================================================
   INTERNAL COMPONENTS
   Everything stays inside Results.jsx as requested.
================================================================ */

function MetricCard({ icon, label, value }) {
  return (
    <div className="border rounded-3 p-3 h-100">
      <div className="d-flex align-items-center gap-2 text-muted mb-2">
        {icon}

        <span className="small">
          {label}
        </span>
      </div>

      <h4 className="fw-bold mb-0">
        {value}
      </h4>
    </div>
  );
}


function ImageCard({
  title,
  description,
  image,
  icon,
}) {
  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body p-3">

        <div className="d-flex align-items-center gap-2 mb-1">
          {icon}

          <h5 className="fw-semibold mb-0">
            {title}
          </h5>
        </div>

        <p className="small text-muted mb-3">
          {description}
        </p>

        <div
          className="bg-dark rounded-3 overflow-hidden d-flex align-items-center justify-content-center"
          style={{
            minHeight: '320px',
          }}
        >
          {image ? (
            <img
              src={image}
              alt={title}
              className="img-fluid"
              style={{
                width: '100%',
                height: '360px',
                objectFit: 'contain',
              }}
            />
          ) : (
            <div className="text-white-50 text-center p-5">
              <ImageIcon size={36} className="mb-2" />

              <div>
                Image unavailable
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}


function DetailRow({
  label,
  value,
  last = false,
}) {
  return (
    <div
      className={`d-flex justify-content-between align-items-center py-3 ${
        last ? '' : 'border-bottom'
      }`}
    >
      <span className="text-muted">
        {label}
      </span>

      <span className="fw-semibold text-end">
        {value}
      </span>
    </div>
  );
}


function QualityRow({
  label,
  value,
}) {
  const numericValue = Number(value ?? 0);

  const percentage =
    Math.max(
      0,
      Math.min(100, numericValue * 100)
    );

  return (
    <div className="mb-4">

      <div className="d-flex justify-content-between mb-2">
        <span className="text-muted">
          {label}
        </span>

        <span className="fw-semibold">
          {numericValue.toFixed(3)}
        </span>
      </div>

      <div
        className="progress"
        style={{
          height: '7px',
        }}
      >
        <div
          className="progress-bar"
          role="progressbar"
          style={{
            width: `${percentage}%`,
          }}
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>

    </div>
  );
}


function formatQualityFlag(flag) {
  return flag
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

export default Results;