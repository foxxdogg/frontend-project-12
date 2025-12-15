import { Link } from 'react-router-dom';

const Header = ({ children }) => (
  <div className="navbar bg-white">
    <div className="container">
      <Link to="/" className="navbar-brand">
        Hexlet Chat
      </Link>
      {children}
    </div>
  </div>
);

export default Header;
