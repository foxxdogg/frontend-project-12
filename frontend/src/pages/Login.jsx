/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  Formik, Form, Field, ErrorMessage,

} from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    try {
      const response = await axios.post('/api/v1/login', values);
      const { token } = response.data;
      const user = { username: values.username };
      dispatch(login({ token, user }));
      navigate('/');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrors({ username: error.response.data.message });
      } else {
        setErrors({ username: 'Server error. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="container-fluid p-5 d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card bg-white shadow rounded">
        <div className="card-body">
          <h2 className="card-title  text-center">Login</h2>
          <Formik
            initialValues={{ username: '', password: '' }}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="form-group mb-3">
                  <label htmlFor="username">Username</label>
                  <Field
                    type="text"
                    name="username"
                    className="form-control"
                    id="username"
                  />
                  <div style={{ minHeight: '30px', color: 'red' }}>
                    <ErrorMessage
                      name="username"
                      component="div"
                      style={{ color: 'red' }}
                    />
                  </div>
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="password">Password</label>
                  <Field
                    type="password"
                    name="password"
                    className="form-control"
                    id="password"
                  />
                  <div style={{ minHeight: '30px', color: 'red' }}>
                    <ErrorMessage
                      name="password"
                      component="div"
                      style={{ color: 'red' }}
                    />
                  </div>
                </div>
                <div className="d-grid mt-4">
                  <button type="submit" className="btn btn-outline-primary">{isSubmitting ? 'Submitting...' : 'Submit'}</button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <div className="card-footer mt-5 bg-light text-muted">
          <p className="m-0 py-2">
            No account?&nbsp;
            <Link to="/register">Registration</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
