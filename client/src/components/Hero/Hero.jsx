import React from "react";
import styled from 'styled-components';
import "./Hero.css";
import { useNavigate } from "react-router-dom";

// Import background image
import teamBgImage from "/src/assets/img/pv_team_cropped_bg.png";

// Import icons
import ongoingStartupthonIcon from "/src/assets/icons/ongoing_startupthon.png";
import startupthonGuideIcon from "/src/assets/icons/startupthon_guide.png";
import pastStartupthonsIcon from "/src/assets/icons/past_startupthons.png";
import mentorNetworkIcon from "/src/assets/icons/mentor_network.png";
import competitiveSalaryIcon from "/src/assets/icons/competitive_salary.png";
import companyFundingIcon from "/src/assets/icons/company_funding.png";
import founderEquityIcon from "/src/assets/icons/founder_equity.png";
import awsIcon from "/src/assets/icons/aws.png";
import chatgptIcon from "/src/assets/icons/chatgpt.png";
import ibmIcon from "/src/assets/icons/ibm.png";
import twilioIcon from "/src/assets/icons/twilio.png";
import airtablesIcon from "/src/assets/icons/airtables_credit.png";

const Hero = ({ scrollToSection }) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="outer-container">
        <div className="container">
          <img
            src={teamBgImage} 
            alt="Team" 
            className="grayscale"
          />
        </div>
      </div>

      <section className="bg-[#0A0111] text-white py-16 px-4">
      {/* Title & Subtitle */}
      <div className="max-w-4xl mx-auto text-center mb-5 montserrat mt-5">
        <h1 className="max-[375px]:text-4xl text-5xl min-[460px]:text-6xl sm:text-[80px] md:text-[80px] font-bold h1-highlight">
          Startupathon
        </h1>
        <p className="text-2xl md:text-2xl  syne justify-center flex">
          <h3 className="font-semibold tracking-wide w-[75vw]">Your Chance to Build, Lead, and Succeed as a Founder</h3>
        </p>
      </div>

      <div className="loom-video max-w-3xl mx-auto mb-12 border-purple-700 border-1 rounded-lg overflow-hidden px-3 py-6">
        <iframe 
          src="https://www.loom.com/embed/996f59a2e5c34fd38b86544833c23dde?sid=88685d22-3152-4c67-9dbb-42e981093099" 
          frameBorder="0"
          webkitallowfullscreen="true"
          mozallowfullscreen="true"
          allowFullScreen
          style={{ width: '100%', height: '500px' }}
          title="Loom Video Player"
        ></iframe>
      </div>

      {/* Buttons (Ongoing, Past, Next, etc.) */}
      <div className="w-[80%] mx-auto mb-12 montserrat">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Button 1 */}
        <div className="glow-on-hover w-full flex bg-[#422d78] hover:bg-[#6041AE] transition-colors duration-100 items-center justify-center py-3 px-6 border border-[#976effdc] rounded-lg cursor-pointer">
          <button 
            className="text-white font-medium cursor-pointer"
            onClick={(e) => { 
              e.preventDefault(); 
              scrollToSection("ongoingStartupthonRef"); 
            }}
          >
            Ongoing Startupathon
          </button>
          <img
            src={ongoingStartupthonIcon}
            alt="Ongoing Startupathon Icon"
            className="ml-2 w-6 h-6"
          />
        </div>

        {/* Button 2 */}
        <div className="glow-on-hover w-full flex bg-[#422d78] hover:bg-[#6041AE] transition-colors duration-100 items-center justify-center py-3 px-6 border border-[#976effdc] rounded-lg cursor-pointer">
          <button 
            className="text-white font-medium cursor-pointer"
            onClick={(e) => { 
              e.preventDefault(); 
              scrollToSection("startupthonGuideRef"); 
            }}
          >
            Startupathon Guide
          </button>
          <img
            src={startupthonGuideIcon}
            alt="Startupathon Guide Icon"
            className="ml-2 w-6 h-6"
          />
        </div>

        {/* Button 3 */}
        <div className="glow-on-hover w-full flex bg-[#422d78] hover:bg-[#6041AE] transition-colors duration-100 items-center justify-center py-3 px-6 border border-[#976effdc] rounded-lg cursor-pointer">
          <button 
            className="text-white font-medium cursor-pointer"
            onClick={(e) => { 
              e.preventDefault(); 
              scrollToSection("completedStartupthonRef"); 
            }}
          >
            Past Startupathon
          </button>
          <img
            src={pastStartupthonsIcon}
            alt="Past Startupathon Icon"
            className="ml-2 w-6 h-6"
          />
        </div>

        {/* Button 4 */}
        <div className="glow-on-hover w-full flex bg-[#422d78] hover:bg-[#6041AE] transition-colors duration-100 items-center justify-center py-3 px-6 border border-[#976effdc] rounded-lg cursor-pointer">
          <button className="text-white font-medium cursor-pointer">
            Mentor Network
          </button>
          <img
            src={mentorNetworkIcon}
            alt="Mentor Network Icon"
            className="ml-2 w-6 h-6"
          />
        </div>
      </div>
    </div>

      {/* rewards Section */}
      <div className="max-w-6xl mx-auto text-center ">
        <h2 className="hidden md:block text-2xl md:text-3xl font-bold  montserrat ">
          Startupathon Success Comes with Extraordinary Rewards
        </h2>
        
        {/* Example icons with labels (grid) */}
        <div className="hidden md:grid grid-cols-5 lg:grid-cols-5 mx-10 place-items-center ">
          {/* Item 1 */}
          <div className="rewards flex flex-col items-center justify-center mt-8 size-37 lg:size-42 max-[906px]:w-30 text-sm lg:text-[16px]">
            <img
              src={competitiveSalaryIcon}
              alt="Competitive Salary Icon"
              className="mb-2 size-14"
            />
            <p className="w-32 max-[906px]:w-26">Competitive Salary</p>
          </div>
          
          {/* Item 2 */}
          <div className="rewards flex flex-col items-center justify-center mt-8 size-37 lg:size-42 max-[906px]:w-30 text-sm lg:text-[16px]">
            <img
              src={companyFundingIcon}
              alt="AWS Icon"
              className="mb-2 size-14"
            />
            <p className="w-32 max-[906px]:w-26">≥ $10,000 USD in Company Funding</p>
          </div>
          
          {/* Item 3 */}
          <div className="rewards flex flex-col items-center justify-center mt-8 size-37 lg:size-42 max-[906px]:w-30 text-sm lg:text-[16px]">
            <img
              src={founderEquityIcon}
              alt="Cash Prize Icon"
              className="mb-2 size-14"
            />
            <p className="w-32  max-[906px]:w-26">≥ 10% Founder Equity</p>
          </div>
          
          {/* Item 4 */}
          <div className="rewards flex flex-col items-center justify-center mt-8 size-37 lg:size-42 max-[906px]:w-30 text-sm lg:text-[16px]">
            <img
              src={awsIcon}
              alt="Mentorship Icon"
              className="mb-2 size-14"
            />
            <p className="w-32  max-[906px]:w-26">≥ $100,000 USD AWS Credits</p>
          </div>

          {/* Item 5 */}
          <div className="rewards flex flex-col items-center justify-center mt-8 size-37 lg:size-42 max-[906px]:w-30 text-sm lg:text-[16px]">
            <img
              src={chatgptIcon}
              alt="Mentorship Icon"
              className="mb-2 size-14"
            /> 
            <p className="w-32 max-[906px]:w-26">$1,000 OpenAI Credits</p>
          </div>

          {/* Item 6 */}
          <div className="rewards flex flex-col items-center justify-center mt-8 size-37 lg:size-42 max-[906px]:w-30 text-sm lg:text-[16px] md:col-start-2">
            <img
              src={ibmIcon}
              alt="Mentorship Icon"
              className="mb-2 size-14"
            />
            <p className="w-32 max-[906px]:w-26">$120,000 USD IBM Cloud Credits</p>
          </div>

          {/* Item 7 */}
          <div className="rewards flex flex-col items-center justify-center mt-8 size-37 lg:size-42 max-[906px]:w-30  text-sm lg:text-[16px]">
            <img
              src={twilioIcon}
              alt="Mentorship Icon"
              className="mb-2 size-14"
            />
            <p className="w-32 max-[906px]:w-26">$2,500 Twilio Credits</p>
          </div>

          {/* Item 8 */}
          <div className="rewards flex flex-col items-center justify-center mt-8 size-37 lg:size-42 max-[906px]:w-30 text-sm lg:text-[16px]">
            <img
              src={airtablesIcon}
              alt="Mentorship Icon"
              className="mb-2 size-14"
            />
            <p className="w-32 max-[906px]:w-26">$2,000 Airtable Credits</p>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default Hero;
