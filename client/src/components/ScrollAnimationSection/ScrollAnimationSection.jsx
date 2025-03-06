import React from "react";
import { motion } from "framer-motion";
import "./ScrollAnimationSection.css"; // optional CSS file for layout

// Parent container animation variants
const containerVariants = {
  hidden: { opacity: 1 }, // keep parent visible so we can see child animations
  show: {
    opacity: 1,
    transition: {
      // Stagger each child element by 0.3s
      staggerChildren: 0.3,
    },
  },
};

// Child element animation variants
// (starts slightly above, fully transparent)
const itemVariants = {
  hidden: { opacity: 0, y: -30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8, // how long each item takes to animate
      ease: "easeOut",
    },
  },
};

function ScrollAnimationSection() {
  return (
    <motion.section
      className="scroll-animation-section"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      // once: false means animation can re-trigger if user scrolls away and back
      viewport={{ once: false, amount: 0.2 }}
      /*
        `amount: 0.2` means the animation triggers when 20% of this element
        is visible in the viewport. Increase/decrease this as needed
        to control how far the user must scroll before it starts.
      */
    >
      {/* TITLE / HEADER */}
      <motion.h2 className="main-title" variants={itemVariants}>
        Found an idea that matches your skills?
      </motion.h2>
      <motion.p className="sub-text" variants={itemVariants}>
        Here’s a simple guide on how the Startupathon process works once you find
        a project idea that suits your skills.
      </motion.p>

      {/* VERTICAL TIMELINE OR DIVIDER */}
      <motion.div className="vertical-divider" variants={itemVariants}>
        {/* You can style this as a vertical line in CSS */}
      </motion.div>

      {/* ICON + TITLE #1 */}
      <motion.div className="animated-row" variants={itemVariants}>
        <img
          src="/icons/idea.png"  // your local icon path
          alt="Idea Icon"
          className="animated-icon"
        />
        <div>
          <h3>Dive into the Challenge Details Video</h3>
          <p>Short description or instructions here...</p>
        </div>
      </motion.div>

      {/* ICON + TITLE #2 */}
      <motion.div className="animated-row" variants={itemVariants}>
        <img
          src="/icons/submit.png" // your local icon path
          alt="Submit Icon"
          className="animated-icon"
        />
        <div>
          <h3>Build, Submit &amp; Shine</h3>
          <p>Another short description or instructions here...</p>
        </div>
      </motion.div>

      {/* Add more rows or icons as needed */}
    </motion.section>
  );
}

export default ScrollAnimationSection;
