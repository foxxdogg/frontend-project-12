/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import Header from '../components/Header';
import Focus from '../components/Focus';

const Signup = () => {
  const schema = yup.object({
    username: yup
      .string()
      .min(3, 'Minimum 3 characters')
      .max(20, 'Maximum 20 characters')
      .required('Required'),
    password: yup.string().min(6, 'Minimum 6 characters').required('Required'),
    confirmation: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Required'),
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = async (values, { setSubmitting, setErrors, setStatus }) => {
    setSubmitting(true);
    try {
      const response = await axios.post('/api/v1/signup', {
        username: values.username,
        password: values.password,
      });
      const { token } = response.data;
      const user = { username: values.username };
      dispatch(login({ token, user }));
      navigate('/');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          setErrors({ username: 'User already exists' }); // ошибка конкретного поля
        } else if (error.response.data && error.response.data.message) {
          setStatus(error.response.data.message); // глобальная ошибка
        } else {
          setStatus('Server error. Please try again.'); // глобальная ошибка
        }
      } else {
        setStatus('Network error. Please try again.'); // глобальная ошибка
      }
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <Header />
      <div className="container-fluid p-5 d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="card bg-white shadow rounded">
          <div className="card-body">
            <h2 className="card-title  text-center">Registration</h2>
            <Formik
              initialValues={{ username: '', password: '', confirmation: '' }}
              onSubmit={handleSubmit}
              validationSchema={schema}
            >
              {({ isSubmitting, status }) => (
                <Form>
                  <Focus />
                  {status && <div className="alert alert-danger mb-3">{status}</div>}
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
                  <div className="form-group mb-3">
                    <label htmlFor="confirmation">Password Confirmation</label>
                    <Field
                      type="password"
                      name="confirmation"
                      className="form-control"
                      id="confirmation"
                    />
                    <div style={{ minHeight: '30px', color: 'red' }}>
                      <ErrorMessage
                        name="confirmation"
                        component="div"
                        style={{ color: 'red' }}
                      />
                    </div>
                  </div>
                  <div className="d-grid mt-4">
                    <button type="submit" className="btn btn-outline-primary">
                      {isSubmitting ? 'Registering...' : 'Register'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
