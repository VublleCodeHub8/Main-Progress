import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Loader2, Mail, Phone, Clock, MapPin, Send, 
  Github, Linkedin, Twitter, Globe, MessageSquare
} from 'lucide-react';
import Popup from '@/components/Popup';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");
  
  // Get the auth token from Redux store
  const token = useSelector((state) => state.misc.token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/user/addcontactus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      // Clear form and show success popup
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      setPopupMessage("Message sent successfully!");
      setPopupType("success");
      setPopupVisible(true);

    } catch (error) {
      setPopupMessage(error.message);
      setPopupType("error");
      setPopupVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Enhanced Hero Section */}
      <div className="bg-black py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
        <div className="container mx-auto px-6 relative">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold text-white tracking-tight">
              Get in Touch
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Have questions about our services? We're here to help and answer any question you might have.
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Contact Form Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Enhanced Contact Information */}
            <div className="space-y-8">
              <div className="space-y-6">
                {/* Office Location */}
                <div className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-black p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Our Office</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Room no. 501<br />
                      BH3 Hostel, IIIT Sri City<br />
                      Andhra Pradesh, India
                    </p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-black p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Contact Info</h3>
                    <a href="mailto:info@terminus.com" className="text-gray-600 hover:text-black transition-colors block">
                      info@terminus.com
                    </a>
                    <a href="tel:+91-9301420421" className="text-gray-600 hover:text-black transition-colors block">
                      +91-9301420421
                    </a>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-black p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Business Hours</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday - Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-6 border-t">
                <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                    <Github className="h-5 w-5" />
                  </a>
                  <a href="#" className="p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a href="#" className="p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                    <Globe className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Enhanced Contact Form */}
            <div className="bg-white p-8 rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all">
              <div className="flex items-center gap-3 mb-8">
                <MessageSquare className="h-6 w-6 text-black" />
                <h2 className="text-2xl font-bold">Send us a Message</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 
                               focus:ring-2 focus:ring-black focus:border-transparent
                               transition-all duration-200"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 
                               focus:ring-2 focus:ring-black focus:border-transparent
                               transition-all duration-200"
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 
                               focus:ring-2 focus:ring-black focus:border-transparent
                               transition-all duration-200"
                      placeholder="How can we help?"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 
                               focus:ring-2 focus:ring-black focus:border-transparent
                               transition-all duration-200 resize-none"
                      placeholder="Your message here..."
                      required
                    ></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-black text-white 
                           py-3 px-6 rounded-lg hover:bg-gray-800 transition-all duration-200
                           disabled:opacity-70 disabled:cursor-not-allowed text-lg font-medium"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
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

export default ContactUs;