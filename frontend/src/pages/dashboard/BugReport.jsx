import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { AlertTriangle, Bug, Send, AlertCircle, CheckCircle, X, HelpCircle } from 'lucide-react';
import Popup from '@/components/Popup';

const BugReport = () => {
  const token = useSelector((state) => state.misc.token);

  const [formData, setFormData] = useState({
    name: '',
    email: token.email,
    type: '',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");

  // Bug type options
  const bugTypes = [
    { value: 'functional', label: 'Functional Bug', icon: <Bug className="h-4 w-4" /> },
    { value: 'performance', label: 'Performance Issue', icon: <AlertCircle className="h-4 w-4" /> },
    { value: 'ui', label: 'UI/UX Issue', icon: <HelpCircle className="h-4 w-4" /> },
    { value: 'security', label: 'Security Vulnerability', icon: <AlertTriangle className="h-4 w-4" /> },
    { value: 'crash', label: 'System Crash', icon: <X className="h-4 w-4" /> },
    { value: 'other', label: 'Other', icon: <CheckCircle className="h-4 w-4" /> }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:3000/user/addbugreport', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.token}`,
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit bug report');
      }

      setFormData({
        name: '',
        type: '',
        email: token.email,
        description: ''
      });

      setPopupMessage("Bug report submitted successfully!");
      setPopupType("success");
      setPopupVisible(true);
    } catch (error) {
      setPopupMessage("Failed to submit bug report. Please try again.");
      setPopupType("error");
      setPopupVisible(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Enhanced Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-black py-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-xl bg-white/10 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white text-center">Report a Bug</h1>
          <p className="text-gray-300 text-center mt-4 max-w-xl mx-auto">
            Help us improve by reporting any issues you encounter. Your feedback is valuable in making our system better.
          </p>
        </div>
      </div>

      {/* Enhanced Form Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                           transition duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Enter your name"
                />
              </div>

              {/* Enhanced Bug Type Field */}
              <div className="space-y-2">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Bug Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                           transition duration-200 bg-gray-50 hover:bg-white"
                >
                  <option value="">Select a bug type</option>
                  {bugTypes.map((type) => (
                    <option key={type.value} value={type.value} className="py-2">
                      {type.label}
                    </option>
                  ))}
                </select>
                {formData.type && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg flex items-center gap-2">
                    {bugTypes.find(t => t.value === formData.type)?.icon}
                    <span className="text-sm text-gray-600">
                      {bugTypes.find(t => t.value === formData.type)?.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Enhanced Description Field */}
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                           transition duration-200 bg-gray-50 hover:bg-white resize-none"
                  placeholder="Please describe the bug in detail. Include steps to reproduce if possible."
                ></textarea>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <HelpCircle className="h-3 w-3" />
                  <span>Be as specific as possible</span>
                </div>
              </div>

              {/* Enhanced Submit Button */}
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
                    Submitting Report...
                  </span>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Submit Bug Report
                  </>
                )}
              </button>
            </form>

            {/* Enhanced Guidelines */}
            <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Guidelines for submitting a bug report:
              </h3>
              <ul className="text-sm text-gray-600 space-y-3">
                {[
                  'Be as specific as possible in your description',
                  'Include steps to reproduce the bug',
                  'Mention any error messages you encountered',
                  'Describe the expected behavior vs actual behavior',
                  'Include your browser and operating system information if relevant'
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

export default BugReport;