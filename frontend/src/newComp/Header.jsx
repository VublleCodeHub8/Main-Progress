import { IntroIllustration } from "../assets";
import "./Header.css";
import Navbar from "./Navbar";

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
          <button className="HeaderWrapper-TxtBox-Btn">Get Started</button>
        </div>
      </div>
    </header>
  );
}
export default Header;
