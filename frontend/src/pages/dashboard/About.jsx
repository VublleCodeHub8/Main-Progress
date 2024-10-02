import React from "react";
import "./AboutUs.css"; // Import the CSS file for styling
import teamImage1 from "../images/team1.jpg"; // Import the first image
import teamImage2 from "../images/team2.jpg"; // Import the second image
import teamImage3 from "../images/team3.jpg"; // Import the third image

const About = () => {
  return (
    <div className="about-container">
      <h1>About Us</h1>
      <p>We are passionate about technology and innovation.</p>

      {/* Add the image gallery */}
      <div className="image-gallery">
        <img src={teamImage1} alt="Team Member 1" className="team-image" />
        <img src={teamImage2} alt="Team Member 2" className="team-image" />
        <img src={teamImage3} alt="Team Member 3" className="team-image" />
      </div>

      <h2>Our Mission</h2>
      <p>
        To empower users with cutting-edge technological solutions and create
        lasting value for our community.
      </p>
    </div>
  );
};

export default About;
