import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="container-fluid p-5 d-flex justify-content-center align-items-center min-vh-100 bg-light">
    <div className="card p-5 bg-white shadow rounded text-center">
      <h1 className="card-title">404</h1>
      <p>Page not found</p>
      <Link to="/login">Go to Login</Link>
    </div>
  </div>
);

export default NotFound;
