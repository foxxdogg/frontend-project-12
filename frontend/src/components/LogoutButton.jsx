const LogoutButton = ({ logout }) => (
  <button
    type="button"
    className="btn btn-primary"
    onClick={logout}
  >
    Logout
  </button>
);

export default LogoutButton;
