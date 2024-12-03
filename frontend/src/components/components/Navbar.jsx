import { Logo } from "../assets";
import "./Navbar.css";

function Navbar() {
  return (
    <nav>
      <a href="#" className="Logo" aria-label="fylo">
        <img src={Logo} alt="fylo" />
      </a>

      <ul className="NavLinks">
        <li className="NavLinks-Link">
          <a href="/admin">Admin</a>
        </li>
        <li className="NavLinks-Link">
          <a href="/dev">Dev</a>
        </li>
        <li className="NavLinks-Link">
          <a href="/auth">sign in</a>
        </li>
      </ul>
    </nav>
  );
}
export default Navbar;
