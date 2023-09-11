import "../styling/navbar.css";
import turnersLogo from "../images/turnersLogo.png";

export default function Navbar() {
  return (
    <nav className="navigation">
      <img src={turnersLogo} alt="TurnersLogo" className="logo" href="/" />

      <div className="navigation-menu">
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="https://www.turners.co.nz/Company/About-Us/Overview/">
              About
            </a>
          </li>
          <li>
            <a href="https://www.turners.co.nz/Company/Contact-Us/">
              Contact Us
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
