import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/navbar-footer/Navbar';
import Footer from './components/navbar-footer/Footer';
import Home from './pages/Home';
import Screening from './pages/Screening';
import Results from './pages/Results';

import About from './pages/About';

// scroll to top whenever the route changes coz default doesn't [OP but good for looks]
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter
      // Opt in to React Router v7 behavior early (silences future-flag warnings)
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ScrollToTop />
      <Navbar />
      {/* main was unnecessary so commented  */}
      {/* <main style={{ minHeight: '70vh' }}> */} 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/screen" element={<Screening />} />
          <Route path="/results" element={<Results />} />
          <Route path="/about" element={<About />} />
          {/* default for unknown route */}
          <Route path="*" element={<Home />} />
        </Routes>
      {/* </main> */}
      <Footer />
    </BrowserRouter>
  );
}
