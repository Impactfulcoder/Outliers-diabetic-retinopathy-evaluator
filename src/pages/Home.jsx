import React from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/home/Hero";
import StatCard from "../components/home/StatCard";
import HowItWorks from "../components/home/HowItWorks";
import InfiniteMovingCards from "../components/home/InfiniteMovingCards";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ position: "relative" }}>
      {/* Aceternity skew-lines background behind hero + stats */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div className="skew-lines-bg" aria-hidden="true" />
        <div style={{ position: "relative" }}>
          <Hero />

          <section className="section" style={{ paddingTop: 0 }}>
            <div className="container-wide">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 18,
                }}
              >
                {/* cards below hero  */}
                <StatCard
                  value="5"
                  label="AI pipeline stages"
                  tint="lavender"
                />

                <StatCard
                  value="224 x 224 px"
                  label="Model input resolution"
                  tint="mint"
                />

                <StatCard
                  value="1"
                  label="Binary screening output"
                  tint="blue"
                />

                <StatCard
                  value="Grad-CAM"
                  label="Visual explanation"
                  tint="lavender"
                />
              
              </div>
            </div>
          </section>
        </div>
      </div>
      {/* 21st.dev connected workflow */}
      {/* complete workflow section */}
      <section
        className="section"
        style={{ background: "var(--color-lavender-2)" }}
      >
        <div className="container-wide">
          <HowItWorks />
        </div>
      </section>
      {/* Aceternity infinite moving evidence cards */}
      <section className="section">
        <div className="container-wide">
          <div style={{ marginBottom: 32, maxWidth: 640 }}>
            <span className="eyebrow">Clinical evidence</span>
            <h2 className="section-title" style={{ marginTop: 16 }}>
              Every prediction ships with{" "}
              <span className="italic-serif">visible proof</span>
            </h2>
          </div>
        </div>
        <InfiniteMovingCards />
      </section>
      {/* CTA banner */}
      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container-wide">
          <div
            style={{
              background: "linear-gradient(135deg, #5B3DF5 0%, #7C5CFA 100%)",
              borderRadius: "var(--radius-lg)",
              padding: "56px 40px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
              color: "#fff",
            }}
          >
            <div style={{ maxWidth: 480 }}>
              <h2 style={{ fontSize: "clamp(24px, 3vw, 32px)", color: "#fff" }}>
                Ready to see the screening pipeline in action?
              </h2>
              <p style={{ opacity: 0.85, marginTop: 12, fontSize: 15.5 }}>
                Upload a fundus image and watch the full simulated AI workflow —
                from quality check to explainable results — in under a minute.
              </p>
            </div>

            <div
              className="d-none d-lg-flex"
              style={{ alignItems: "center", gap: 14 }}
            >
              <button
                className="btn-pill btn-outline-pill-special"
                onClick={() => navigate("/screen")}
              >
                Start Screening
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
