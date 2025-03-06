import React, { useState } from 'react';
import axios from 'axios';

const Banner = ({
  titleText,
  subTitleText,
  inputPlaceholder,
  buttonText,
}) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      // Validate email
      if (!email || !email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        setMessage({ 
          type: 'error', 
          text: 'Please enter a valid email address' 
        });
        return;
      }
  
      const res = await axios.post('http://localhost:5000/api/subscribers', { email });
      setMessage({ 
        type: 'success', 
        text: 'Successfully subscribed! Thank you for joining us.' 
      });
      setEmail('');
    } catch (err) {
      console.error('Subscription error:', err);
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.error || 'Failed to subscribe. Please try again.' 
      });
    }
  };

  return (
    <div className="bg-black w-full py-8 px-4 flex justify-center">
      <div className="max-w-7xl w-full bg-gradient-to-r from-[#19052D] to-[#6440be] rounded-2xl p-16 text-white">
        {/* Title */}
        {titleText && (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {titleText}
          </h2>
        )}

        {/* Subtitle */}
        {subTitleText && (
          <p className="text-lg text-center text-gray-200 mb-8 max-w-2xl mx-auto">
            {subTitleText}
          </p>
        )}

        {!inputPlaceholder &&  buttonText && (
          <form className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
            

            <button
            type="submit"
          className="bg-[#7F5ED5] text-white rounded-md px-4 py-2 apply-fellowship-btn transition-colors duration-200 hover:bg-[#855DEF] h-[48px] flex items-center justify-center"
        >
          {buttonText}
        </button>
          </form>
        )}
        
        {inputPlaceholder && buttonText && (
          <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={inputPlaceholder}
              className="flex-1 px-4 py-2 rounded-md border border-gray-300 text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />

            <button
            type="submit"
          className="bg-[#7F5ED5] text-white rounded-md px-4 py-2 apply-fellowship-btn transition-colors duration-200 hover:bg-[#855DEF] h-[48px] flex items-center justify-center"
        >
          {buttonText}
        </button>
          </form>
        )}

        {/* Message Display */}
        {message.text && (
          <div className={`mt-4 text-center ${
            message.type === 'success' ? 'text-green-400' : 'text-red-400'
          }`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default Banner;