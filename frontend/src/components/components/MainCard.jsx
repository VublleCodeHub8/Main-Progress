import { featuresData } from "../featuresData";
import { StayProductiveIllustration } from "../assets";
import { reviewsData } from "../reviewsData";
import FeaturesCard from "./FeaturesCard";
import "./MainCard.css";
import ReviewCard from "./ReviewCard";
import { useState } from "react";

function MainCard() {
  const [email, setEmail] = useState("");
  const [isError, setIsError] = useState(false);

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleClick = () => {
    if (!emailRegex.test(email)) {
      setIsError(true);
    } else {
      setIsError(false);
    }
  };
  return (
    <main>
      <div className="FeaturesWrapper">
        {featuresData.map((el, i) => (
          <FeaturesCard key={i} {...el} />
        ))}
      </div>
      <div className="StayProductiveCard">
        <div className="StayProductiveCard-ImgBox">
          <img src={StayProductiveIllustration} alt="" />
        </div>
        <div className="StayProductiveCard-TxtBox">
          <h1 className="StayProductiveCard-TxtBox-Title">
            Stay productive, wherever you are
          </h1>
          <p className="StayProductiveCard-TxtBox-Para">
            Never let location be an issue when accessing your files. Cloud IDE has
            you covered for all of your file development needs.
          </p>
          <p className="StayProductiveCard-TxtBox-Para">
            Code on the go with Cloud IDE. Take your development environment with 
            you anywhere you go.
          </p>
          
        </div>
      </div>
      <div className="ReviewsWrapper">
        {reviewsData.map((el, i) => (
          <ReviewCard key={i} {...el} />
        ))}
      </div>

      <div className="AccessWrapper">
        <h1 className="AccessWrapper-Title">Get early access today</h1>
        <p className="AccessWrapper-Para">
          It only takes a minute to sign up and our free starter tier is
          extremely generous. If you have any questions, our support team would
          be happy to help you.
        </p>
        <div className="AccessWrapper-Form">
          <label htmlFor="email" className="AccessWrapper-Form-Label">
            <input
              type="email"
              name="email"
              id="email"
              required
              value={email}
              onChange={handleChange}
              placeholder="email@example.com"
              className="AccessWrapper-Form-Input"
            />
            {isError && (
              <p className="error">Please enter a valid email address</p>
            )}
          </label>
          <button className="AccessWrapper-Form-Btn" onClick={handleClick}>
            get started for free
          </button>
        </div>
      </div>
    </main>
  );
}
export { MainCard };
