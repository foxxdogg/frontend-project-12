/* eslint-disable jsx-a11y/label-has-associated-control */
import { Formik, Form, Field } from 'formik';
import { Link } from 'react-router-dom';

const Login = () => (
  <div className="container-fluid p-5 d-flex justify-content-center align-items-center min-vh-100 bg-light">
    <div className="card bg-white shadow rounded">
      <div className="card-body">
        <h2 className="card-title  text-center">Login</h2>
        <Formik
          initialValues={{ username: '', password: '' }}
          onSubmit={(values, { setSubmitting }) => {
            console.log('Form submitted', values);
            setSubmitting(false);
          }}
        >
          {() => (
            <Form>
              <div className="form-group mb-3">
                <label htmlFor="username">Username</label>
                <Field
                  type="text"
                  name="username"
                  className="form-control"
                  id="username"
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="password">Password</label>
                <Field
                  type="password"
                  name="password"
                  className="form-control"
                  id="password"
                />
              </div>
              <div className="d-grid mt-4">
                <button type="submit" className="btn btn-outline-primary">Submit</button>
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

export default Login;
