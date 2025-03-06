import React from 'react';

const GuideSection = ({
  videoUrl,
  mainHeading,
  subHeading,
}) => {
  return (
    <div className="bg-black py-4 text-white font-sans">
      <div className="max-w-6xl mx-auto px-4 text-center">
        {/* Main Heading (only if passed) */}
        {mainHeading && (
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {mainHeading}
          </h2>
        )}

        {/* Subheading (optional) */}
        {subHeading && (
          <p className="text-gray-300 italic mb-8">
            {subHeading}
          </p>
        )}

        {/* Responsive Video Embed */}
        <div className="relative w-full overflow-hidden pb-[3%] flex justify-center">
          <iframe
            src={videoUrl}
            title="YouTube video player"
            frameBorder="0"
            allowFullScreen
            className="top-0 left-0 w-3xl h-[433px] rounded-md border-1 border-[#8d3cef]"
          />
        </div>
      </div>
    </div>
  );
};

export default GuideSection;
