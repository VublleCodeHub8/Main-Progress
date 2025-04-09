import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { MapPin, Briefcase, Github, Twitter, Linkedin, Globe, Send, HelpCircle, CheckCircle } from 'lucide-react';
import Popup from '@/components/Popup';
const AdditionalInfo = () => {
  const token = useSelector((state) => state.misc.token);
  const user = useSelector((state) => state.user.user);

  const [formData, setFormData] = useState({
    location: '',
    occupation: '',
    socialLinks: {
      github: '',
      twitter: '',
      linkedin: '',
      website: ''
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social-')) {
      const platform = name.replace('social-', '');
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [platform]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:3000/user/updateadditionalinfo', {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.token}`,
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update additional information');
      }

      setPopupMessage("Additional information updated successfully!");
      setPopupType("success");
      setPopupVisible(true);
      
      // Reset form after successful submission
      setFormData({
        location: '',
        occupation: '',
        socialLinks: {
          github: '',
          twitter: '',
          linkedin: '',
          website: ''
        }
      });
    } catch (error) {
      setPopupMessage("Failed to update information. Please try again.");
      setPopupType("error");
      setPopupVisible(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-black py-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-xl bg-white/10 flex items-center justify-center">
              <HelpCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white text-center">Additional Information</h1>
          <p className="text-gray-300 text-center mt-4 max-w-xl mx-auto">
            Complete your profile by adding additional information and social links.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Location Field */}
              <div className="space-y-2">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                           transition duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Enter your location"
                />
              </div>

              {/* Occupation Field */}
              <div className="space-y-2">
                <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Occupation
                </label>
                <input
                  type="text"
                  id="occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                           transition duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Enter your occupation"
                />
              </div>

              {/* Social Links Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Social Links</h3>
                
                {/* GitHub */}
                <div className="space-y-2">
                  <label htmlFor="social-github" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    GitHub Profile
                  </label>
                  <input
                    type="url"
                    id="social-github"
                    name="social-github"
                    value={formData.socialLinks.github}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                             transition duration-200 bg-gray-50 hover:bg-white"
                    placeholder="https://github.com/username"
                  />
                </div>

                {/* Twitter */}
                <div className="space-y-2">
                  <label htmlFor="social-twitter" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Twitter className="h-4 w-4" />
                    Twitter Profile
                  </label>
                  <input
                    type="url"
                    id="social-twitter"
                    name="social-twitter"
                    value={formData.socialLinks.twitter}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                             transition duration-200 bg-gray-50 hover:bg-white"
                    placeholder="https://twitter.com/username"
                  />
                </div>

                {/* LinkedIn */}
                <div className="space-y-2">
                  <label htmlFor="social-linkedin" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    id="social-linkedin"
                    name="social-linkedin"
                    value={formData.socialLinks.linkedin}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                             transition duration-200 bg-gray-50 hover:bg-white"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                {/* Personal Website */}
                <div className="space-y-2">
                  <label htmlFor="social-website" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Personal Website
                  </label>
                  <input
                    type="url"
                    id="social-website"
                    name="social-website"
                    value={formData.socialLinks.website}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                             transition duration-200 bg-gray-50 hover:bg-white"
                    placeholder="https://your-website.com"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-black text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2
                  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'} 
                  transition duration-200 shadow-sm hover:shadow`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating Information...
                  </span>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Update Information
                  </>
                )}
              </button>
            </form>

            {/* Guidelines */}
            <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Tips for your profile:
              </h3>
              <ul className="text-sm text-gray-600 space-y-3">
                {[
                  'Add your current location to help with networking',
                  'Include your current occupation or role',
                  'Link your professional social profiles',
                  'Make sure all URLs are complete and valid',
                  'Keep your information up to date'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Component */}
      <Popup
        visible={popupVisible}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
        type={popupType}
      />
    </div>
  );
};

export default AdditionalInfo;