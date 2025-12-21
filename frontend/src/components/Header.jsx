import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import LogoutButton from './LogoutButton'

function Header({ handleLogout }) {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn)
  return (
    <div className="navbar bg-white">
      <div className="container">
        <Link to="/" className="navbar-brand">
          Hexlet Chat
        </Link>
        {isLoggedIn && <LogoutButton logout={handleLogout} />}
      </div>
    </div>
  )
}

export default Header
