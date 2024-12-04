import { Logo, LocationIcon, PhoneIcon, EmailIcon } from "../assets";
import { IconContext } from "react-icons";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import "./Footer.css";

function Footer() {
  return (
    <footer>
      <a href="#" className="FooterLogo" aria-label="fylo">
        <img src={Logo} alt="fylo" />
      </a>

      <div className="FooterWrapper">
        <address>
          <div>
            <img src={LocationIcon} alt="" />
            <p>
              IIIT Sricity
            </p>
          </div>
        </address>
        <address>
          <div>
            <img src={PhoneIcon} alt="" />
            <p>+69-54-69-43211</p>
          </div>
          <div>
            <img src={EmailIcon} alt="" />
            <p>cloudeide@development.in</p>
          </div>
        </address>
        <ul>
          <li className="FooterWrapper-Link">
            <a href="#">about us</a>
          </li>
          <li className="FooterWrapper-Link">
            <a href="#">jobs</a>
          </li>
          <li className="FooterWrapper-Link">
            <a href="#">press</a>
          </li>
          <li className="FooterWrapper-Link">
            <a href="#">blog</a>
          </li>
        </ul>
        <ul>
          <li className="FooterWrapper-Link">
            <a href="#">contact us</a>
          </li>
          <li className="FooterWrapper-Link">
            <a href="#">terms</a>
          </li>
          <li className="FooterWrapper-Link">
            <a href="#">privacy</a>
          </li>
        </ul>
        <ul className="FooterWrapper-SocialIcons">
          <li className="FooterWrapper-SocialIcons-Link">
            <a href="#" aria-label="facebook">
              <IconContext.Provider value={{ className: "socialIcon" }}>
                <div>
                  <FaFacebookF />
                </div>
              </IconContext.Provider>
            </a>
          </li>
          <li className="FooterWrapper-SocialIcons-Link">
            <a href="#" aria-label="twitter">
              <IconContext.Provider value={{ className: "socialIcon" }}>
                <div>
                  <FaTwitter />
                </div>
              </IconContext.Provider>
            </a>
          </li>
          <li className="FooterWrapper-SocialIcons-Link">
            <a href="#" aria-label="instagram">
              <IconContext.Provider value={{ className: "socialIcon" }}>
                <div>
                  <FaInstagram />
                </div>
              </IconContext.Provider>
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
export default Footer;
