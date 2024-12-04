import { IntroIllustration } from "../assets";
import "./Header.css";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header>
      <Navbar />
      <div className="HeaderWrapper">
        <div className="HeaderWrapper-ImgBox">
          <img src={IntroIllustration} alt="" />
        </div>
        <div className="HeaderWrapper-TxtBox">
          <h1 className="HeaderWrapper-TxtBox-Title">
            Code on the go with Cloud IDE
          </h1>
          <p className="HeaderWrapper-TxtBox-Para">
            Take your development environment with you anywhere with Cloud IDE. Manage your code, collaborate on projects, and deploy your apps from anywhere in the world.
          </p>
          <Link to="/auth">
            <button className="HeaderWrapper-TxtBox-Btn">Get Started</button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export { Header  };
