import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

const BugReport = () => {
  const token = useSelector((state) => state.misc.token);

  const [formData, setFormData] = useState({
    name: '',
    email: token.email,
    type: '',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bug type options
  const bugTypes = [
    { value: 'functional', label: 'Functional Bug' },
    { value: 'performance', label: 'Performance Issue' },
    { value: 'ui', label: 'UI/UX Issue' },
    { value: 'security', label: 'Security Vulnerability' },
    { value: 'crash', label: 'System Crash' },
    { value: 'other', label: 'Other' }
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
    console.log(formData);
    try {
      const response = await fetch('http://localhost:3000/user/addbugreport', {
        method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.token}`,
          },
        body: JSON.stringify(formData)
      });
      console.log(response);
      if (!response.ok) {
        throw new Error('Failed to submit bug report');
      }

      setFormData({
        name: '',
        type: '',
        email: token.email,
        description: ''
      });

      toast.success('Bug report submitted successfully!');
    } catch (error) {
      // console.error('Error submitting bug report:', error);
      toast.error('Failed to submit bug report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-black py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold text-white text-center">Report a Bug</h1>
          <p className="text-gray-300 text-center mt-4">
            Help us improve by reporting any issues you encounter
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition duration-200"
                  placeholder="Enter your name"
                />
              </div>

              {/* Bug Type Field */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Bug Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition duration-200"
                >
                  <option value="">Select a bug type</option>
                  {bugTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description Field */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition duration-200"
                  placeholder="Please describe the bug in detail. Include steps to reproduce if possible."
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-black text-white py-3 rounded-md font-medium 
                  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'} 
                  transition duration-200`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : 'Submit Bug Report'}
              </button>
            </form>

            {/* Guidelines */}
            <div className="mt-8 p-4 bg-gray-50 rounded-md">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Guidelines for submitting a bug report:</h3>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>Be as specific as possible in your description</li>
                <li>Include steps to reproduce the bug</li>
                <li>Mention any error messages you encountered</li>
                <li>Describe the expected behavior vs actual behavior</li>
                <li>Include your browser and operating system information if relevant</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BugReport;