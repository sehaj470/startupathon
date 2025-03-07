import React, { useState, useRef, useEffect } from 'react'
import './App.css'

import { Routes, Route } from 'react-router-dom';
import AdminLayout from './pages/Admin/AdminLayout';
import Login from './pages/Admin/Login';
import HomeChallenges from './pages/HomeChallenges';
import HomeCompleters from './pages/HomeCompleters';
import GuideSection from './components/Guide/GuideSection';
import Banner from './components/Banner/Banner';
import Footer from './components/Footer/Footer';
import FellowshipApplicationForm from "./components/FellowshipApplicationForm/FellowshipApplicationForm";
import CompleterDetails from './pages/CompleterDetails';
import NavbarGROK from './components/Navbar/NavbarGROK'
import Hero from './components/Hero/Hero'
import { checkDatabaseConnection, checkServerHealth } from './utils/dbCheck';

function App() {
  const [count, setCount] = useState(0)
  const [dbStatus, setDbStatus] = useState(null);
  const [serverStatus, setServerStatus] = useState(null);

  // refs for all sections
  const sectionRefs = {
    ongoingStartupthonRef: useRef(null),
    completedStartupthonRef: useRef(null),
    startupthonGuideRef: useRef(null)
  };

  // Check database and server status on load
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const health = await checkServerHealth();
        setServerStatus(health);
        
        const db = await checkDatabaseConnection();
        setDbStatus(db);
      } catch (error) {
        console.error('Error checking status:', error);
      }
    };
    
    checkStatus();
  }, []);

  // scroll function that takes a section key
  const scrollToSection = (section) => {
    const ref = sectionRefs[section];
    if (ref && ref.current) {
      const navbarHeight = 80; // Adjust to match your navbar's height
      const elementPosition = ref.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
    
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={
        <>
          <NavbarGROK 
            scrollToSection={scrollToSection}
          />
          <Hero 
            scrollToSection={scrollToSection}
          />

          <div ref={sectionRefs.ongoingStartupthonRef}>
            <HomeChallenges />
          </div>

          <div ref={sectionRefs.startupthonGuideRef}>
            <GuideSection
              videoUrl="https://www.youtube.com/embed/pn_HoowYNTQ?si=WWtnjlJs51zL0D0F"
              mainHeading="Work Smart, Win Big: Pro Tips from Swapnil Sharma, CTO of Ovadrive (A Startupathon Success)"
              // subHeading="Maximize your Webapp's Potential with V0, Herenci, and Claude"
            />
          </div>

          <GuideSection
            videoUrl="https://www.loom.com/embed/0847b9257f144fd0830a8536dfbc8e81?t=0"
            mainHeading="Our Hiring Process: Shared Through Candidate Stories"
            // subHeading="Maximize your Webapp's Potential with V0, Herenci, and Claude"
          />

          <Banner
            titleText="Got an idea of your own?"
            subTitleText="We are always on the lookout for visionaries with great startup ideas, ready to become successful founders. If that's you, apply below for our Fellowship program."
            // inputPlaceholder="g"
            buttonText="Apply For Fellowship"
          />

          <div ref={sectionRefs.completedStartupthonRef}>
            <HomeCompleters />
          </div>

          <Banner
            titleText="Sign up to get notified first about new Startupathon projects"
            subTitleText="And receive updates through our newsletter."
            inputPlaceholder="Enter your email ID"
            buttonText="Subscribe"
          />

          <Footer />
        </>
      } />

      {/* Route for the application form */}
      <Route path="/apply" element={<FellowshipApplicationForm />} />

      {/* Route for completer details */}
      <Route path="/completers/:id" element={<CompleterDetails />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/*" element={<AdminLayout />} />
    </Routes>
  )
}

export default App
