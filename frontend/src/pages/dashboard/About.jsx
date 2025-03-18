import React from "react";
import "./AboutUs.css";
import { Mail } from 'lucide-react';
import HimanshuPhoto from '../../assets/Him.png';
import AdarshPhoto from '../../assets/adarsh.jpeg';

const AboutUs = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-800 to-black py-20">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">
              Welcome to Terminus
            </h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Your Ultimate Container Management Platform
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 text-white" viewBox="0 0 1440 48" fill="currentColor" preserveAspectRatio="none">
            <path d="M0,48 L1440,48 L1440,0 C1440,0 1140,48 720,48 C300,48 0,0 0,0 L0,48 Z"></path>
          </svg>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-8">
              Terminus is dedicated to revolutionizing container management by providing a powerful, 
              user-friendly platform that enables developers and organizations to deploy, manage, 
              and scale their containerized applications with unprecedented ease and efficiency.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose Terminus</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-black mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Simplified Management</h3>
              <p className="text-gray-600">
                Intuitive interface for managing containers, making deployment and scaling effortless.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-black mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Advanced Security</h3>
              <p className="text-gray-600">
                Enterprise-grade security features to protect your containers and applications.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-black mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Real-time Monitoring</h3>
              <p className="text-gray-600">
                Comprehensive monitoring and analytics for your containerized applications.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Benefits Section */}
      <div className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Key Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">For Developers</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-black mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Streamlined deployment process
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-black mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Automated scaling capabilities
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-black mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Integrated development tools
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">For Organizations</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-black mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Cost-effective scaling
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-black mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Enhanced security controls
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-black mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Comprehensive monitoring
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Team Member 1 */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-48 h-48 rounded-full overflow-hidden mb-4 border-4 border-gray-200 shadow-lg 
                              transform transition-transform duration-300 group-hover:scale-105">
                  <img 
                    src={HimanshuPhoto}
                    alt="Himanshu Saraswat"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=Himanshu+Saraswat&background=random&size=200`;
                    }}
                  />
                </div>
                <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-10 
                              transition-opacity duration-300"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Himanshu Saraswat</h3>
              <p className="text-gray-600 mb-3">Full Stack Developer</p>
              <a 
                href="mailto:himanshu.saraswat@example.com" // Replace with actual email
                className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors duration-200"
              >
                <Mail className="h-4 w-4" />
                himanshu.s22@iiits.in
              </a>
            </div>

            {/* Team Member 2 */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-48 h-48 rounded-full overflow-hidden mb-4 border-4 border-gray-200 shadow-lg 
                              transform transition-transform duration-300 group-hover:scale-105">
                  <img 
                    src={AdarshPhoto}
                    alt="Adarsh Singh"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=Adarsh+Singh&background=random&size=200`;
                    }}
                  />
                </div>
                <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-10 
                              transition-opacity duration-300"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Adarsh Singh</h3>
              <p className="text-gray-600 mb-3">Full Stack Developer</p>
              <a 
                href="mailto:adarsh.singh@example.com" // Replace with actual email
                className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors duration-200"
              >
                <Mail className="h-4 w-4" />
                adarsh.s22@iiits.in
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Start Your Journey with Terminus</h2>
            <p className="text-lg text-gray-600 mb-8">
              Ready to transform your container management experience? Get in touch with our team today.
            </p>
            <div className="space-x-4">
              <a 
                href="/contact" 
                className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition duration-300"
              >
                Contact Us
              </a>
              <a 
                href="/documentation" 
                className="inline-block bg-white text-black border border-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
              >
                View Documentation
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;