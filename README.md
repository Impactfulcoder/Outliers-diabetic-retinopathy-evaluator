# RetinaCare AI

An AI-assisted diabetic retinopathy (DR) screening and retinal image analysis
prototype. Upload a fundus image, watch a simulated AI pipeline run, and
review an explainable, clinician-reviewable screening report.

> **This is a prototype demonstration.** All predictions, segmentation masks,
> Grad-CAM heatmaps and confidence scores are simulated on the frontend.
> Nothing here should be used for real clinical diagnosis or treatment
> decisions.

---

## 1. Project Overview

RetinaCare AI walks through a complete screening workflow:

```
Landing Page → Upload Image → Image Quality → Analysis Pipeline (animated)
→ Prediction Results → Retinal Structures → DR Severity → Confidence
→ Explainability (Grad-CAM) → Human-in-the-loop Review → Automated Report
```

A tiny Flask backend exposes a single `/api/health` endpoint so the frontend
can display a live "Backend Connected" / "Demo Mode" indicator — but the app
is fully usable even if the backend is never started.

## 2. Features

- Premium, editorial landing page with animated hero and trust/stat sections
- Drag-and-drop fundus image upload with validation and local preview
- Animated multi-stage AI analysis pipeline (Framer Motion)
- Image quality assessment with GOOD / BORDERLINE / UNGRADABLE states and
  simulated enhancement (CLAHE, illumination normalization, denoising)
- Retinal structure viewer with tabs (Original / Vessel Map / Lesion Map /
  Optic Disc / Grad-CAM)
- ICDR DR severity scale (0–4) with a highlighted predicted grade
- Probability distribution chart (Recharts) with a "demo prediction" disclaimer
- Explainability module with a simulated Grad-CAM heatmap and per-lesion
  evidence cards
- Human-in-the-loop clinical review panel (approve / request review / flag /
  add note)
- Automated report preview with a printable "Download Report" action
- Reports history page (table on desktop, cards on mobile)
- Screening Network Simulation page modeling deployment capacity/throughput
  with animated counters and charts
- Fully responsive (desktop / tablet / mobile), no horizontal overflow
- Graceful "Demo Mode" fallback if the Flask backend isn't running

## 3. Tech Stack

**Frontend:** React (Create React App), React Router, Bootstrap 5 /
React-Bootstrap, Framer Motion, Lucide React, Recharts, Axios.

**Backend:** Python, Flask, Flask-CORS.

## 4. Folder Structure

```
retinal-ai/
├── backend/
│   ├── app.py                # Flask health endpoint
│   └── requirements.txt
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── StatCard.jsx
│   │   ├── PipelineCard.jsx
│   │   ├── UploadZone.jsx
│   │   ├── ImagePreview.jsx
│   │   ├── AnalysisProgress.jsx
│   │   ├── QualityAssessment.jsx
│   │   ├── RetinalAnalysis.jsx
│   │   ├── SeverityScale.jsx
│   │   ├── ConfidenceChart.jsx
│   │   ├── ExplainabilityViewer.jsx
│   │   ├── EvidenceCard.jsx
│   │   ├── ClinicalReview.jsx
│   │   ├── ReportPreview.jsx
│   │   ├── BackendStatus.jsx
│   │   ├── SimulationCard.jsx
│   │   └── RetinalGraphic.jsx   # generated SVG fundus illustration
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Screening.jsx
│   │   ├── Results.jsx
│   │   ├── Reports.jsx
│   │   ├── Simulation.jsx
│   │   └── About.jsx
│   ├── data/
│   │   ├── mockResults.js     # multiple simulated ML scenarios
│   │   ├── mockReports.js
│   │   └── simulationData.js
│   ├── services/
│   │   └── api.js             # health check + future /api/analyze contract
│   ├── App.js
│   ├── index.js
│   └── styles.css             # design tokens / theme
├── package.json
└── README.md
```

## 5. Frontend Setup

If starting from scratch (this repo already contains the generated project,
so you can skip step 1 and go straight to `npm install`):

```bash
npx create-react-app retinal-ai
cd retinal-ai
npm install react-router-dom axios bootstrap react-bootstrap framer-motion lucide-react recharts
```

From this project folder:

```bash
npm install
```

## 6. Backend Setup

```bash
cd backend
pip install -r requirements.txt
# or: pip install flask flask-cors
```

## 7. Running the Frontend (CRA)

```bash
npm start
```

Runs on `http://localhost:3000`. This uses **react-scripts (Create React
App)** — do not run this with Vite commands.

## 8. Running the Backend (Flask)

```bash
cd backend
python app.py
```

Runs on `http://localhost:5000`. The frontend polls this on load and shows
"Backend Connected" in the navbar; if it's not running, the app shows "Demo
Mode" and continues to work fully on local mock data.

## 9. API Endpoint

```
GET /api/health

Response:
{
  "status": "ok",
  "service": "Retinal AI Screening Backend",
  "version": "1.0.0"
}
```

## 10. Mock ML Architecture

All "AI" output in this build comes from `src/data/mockResults.js`, which
defines several realistic scenarios (No DR, Mild, Moderate, Severe/borderline
quality) covering image quality metrics, DR grade + confidence, class
probabilities, retinal structure detections, and per-lesion evidence. The
Screening page picks one at random and "reveals" it through a timed,
animated pipeline (`AnalysisProgress.jsx`) rather than an instant result.

## 11. Future MATLAB Integration

The intended real pipeline would replace the mock scenario picker with a
call to a MATLAB-backed service (e.g. exposed through Flask) that runs image
quality assessment, vessel/lesion segmentation, and DR classification on the
uploaded fundus image, returning the same JSON shape currently mocked in
`mockResults.js`.

## 12. Future Simulink Integration

The `/simulation` page's throughput, bandwidth and review-capacity figures
are placeholders for a MATLAB/Simulink model of the *deployment* — how many
images per day a screening network could ingest and route to reviewers —
which is a separate concern from the per-image ML classification above.

## 13. Connecting a Real Backend Later

`src/services/api.js` documents the intended future contract:

```
POST /api/analyze          (multipart/form-data, field: image)
→ { quality, enhancement, structures, prediction, explainability, report }
```

Swapping the mock pipeline for this real call only requires changes inside
`Screening.jsx` and `services/api.js` — no other component needs to change,
since every result-rendering component already consumes the same JSON shape
used by the mock data.

---

**Disclaimer:** This application is a prototype demonstration and does not
provide medical diagnosis. Results are simulated and must not be used for
clinical diagnosis or treatment decisions.
