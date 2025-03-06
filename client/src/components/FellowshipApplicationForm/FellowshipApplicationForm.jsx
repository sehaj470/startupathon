import React from "react";
import bgImage from "../../assets/img/pv_team_cropped_bg.png";

function FellowshipApplicationForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-center bg-no-repeat bg-[#0A0111]"
    //   style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover" }}
    >
      {/* (Optional) Dark overlay to make text easier to read */}
      {/* <div className="absolute inset-0 bg-black bg-opacity-30"></div> */}

      {/* Container for glass effect + form */}
      <div className="relative  w-[90%] max-w-7xl my-8 ">
        {/* Glass layer behind the form */}
        <div className="absolute inset-0 bg-[#0A0111] bg-opacity-20 backdrop-blur-md rounded-md  " />

        {/* The actual form content (not blurred) */}
        <form className="relative p-8 text-white top-[88px] rounded-lg border-[#d093ff] border-1 mb-[88px]">
          <h2 className="text-3xl font-bold mb-2">
            Are you ready to transform your vision into reality?
          </h2>
          <p className="mb-6">
            Persist's fellowship is where we help dreamers dream, by giving them a salary
            and tons of support to follow their highest goals and mission. Share your vision
            for the world with us!
          </p>

          {/* Full Name */}
          <div className="mb-4">
            <label htmlFor="fullName" className="block mb-1 text-white">
              Your Full Name
            </label>
            <input
              type="text"
              id="fullName"
              placeholder="Full Name"
              className="w-full p-3 border border-white rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="xyz@gmail.com"
              className="w-full p-3 border border-white rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Links */}
          <div className="mb-4">
            <label htmlFor="links" className="block mb-1 text-white">
              Your links (LinkedIn, YouTube, Facebook, GitHub, Pinterest, or your site) (If any)
            </label>
            <input
              type="text"
              id="links"
              placeholder="www.linkedin.com/in/..."
              className="w-full p-3 border border-white rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Idea Description */}
          <div className="mb-4">
            <label htmlFor="idea" className="block mb-1 text-white">
              Please provide a concise description of your idea.
            </label>
            <textarea
              id="idea"
              rows={4}
              placeholder="Describe your idea here..."
              className="w-full p-3 border border-white rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Prototype Link */}
          <div className="mb-4">
            <label htmlFor="prototype" className="block mb-1 text-white">
              Deployed Link to Your Prototype (if any)
            </label>
            <input
              type="url"
              id="prototype"
              placeholder="https://myprototype.com"
              className="w-full p-3 border border-white rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Additional Files */}
          <div className="mb-4">
            <label htmlFor="additionalFiles" className="block mb-1 text-white">
              Link to Additional Files (if any)
            </label>
            <input
              type="url"
              id="additionalFiles"
              placeholder="https://drive.google.com/..."
              className="w-full p-3 border border-white rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Team Info */}
          <div className="mb-4">
            <label htmlFor="teamInfo" className="block mb-1 text-white">
              Are you working independently or as part of a team? If you're part of a team,
              how many members are there?
            </label>
            <input
              type="text"
              id="teamInfo"
              placeholder="e.g., Independent or Team of 3"
              className="w-full p-3 border border-white rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Loom Video */}
          <div className="mb-4">
            <label htmlFor="loomVideo" className="block mb-1 text-white">
              Kindly share a Loom video link introducing yourself and your idea.
            </label>
            <input
              type="url"
              id="loomVideo"
              placeholder="https://www.loom.com/share/..."
              className="w-full p-3 border border-white rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 px-4 py-3 w-full bg-purple-600 hover:bg-purple-700 text-white rounded-md font-semibold"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}

export default FellowshipApplicationForm;
