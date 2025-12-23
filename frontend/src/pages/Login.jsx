import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { login } from '../store/slices/authSlice'

import Header from '../components/Header'
import Focus from '../components/Focus'
import useLogout from '../hooks/useLogout'

function Login() {
  const { t } = useTranslation()
  const handleLogout = useLogout()
  const loginSchema = Yup.object({
    username: Yup.string().required(t('required')),
    password: Yup.string().required(t('required')),
  })
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleSubmit = async (values, { setSubmitting, setErrors, setStatus }) => {
    setStatus(null)
    setSubmitting(true)
    try {
      const response = await axios.post('/api/v1/login', values)
      const { token } = response.data
      const user = { username: values.username }
      dispatch(login({ token, user }))
      navigate('/')
    }
    catch (error) {
      if (error.response && error.response.status === 401) {
        setErrors({
          username: t('userOrPasswordError'),
        })
      }
      else {
        setStatus(t('serverError'))
      }
    }
    finally {
      setSubmitting(false)
    }
  }
  return (
    <>
      <Header handleLogout={handleLogout} />
      <div className="container-fluid p-5 d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="card bg-white shadow rounded col-3">
          <div className="card-body">
            <h2 className="card-title  text-center">{t('login')}</h2>
            <Formik
              initialValues={{ username: '', password: '' }}
              onSubmit={handleSubmit}
              validationSchema={loginSchema}
            >
              {({ isSubmitting, status }) => (
                <Form>
                  {status && <div className="alert alert-danger mb-3">{status}</div>}
                  <Focus />
                  <div className="form-group mb-3">
                    <label htmlFor="username">{t('yourUsername')}</label>
                    <Field type="text" name="username" className="form-control" id="username" />
                    <div style={{ minHeight: '30px', color: 'red' }}>
                      <ErrorMessage name="username" component="div" style={{ color: 'red' }} />
                    </div>
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="password">{t('password')}</label>
                    <Field type="password" name="password" className="form-control" id="password" />
                    <div style={{ minHeight: '30px', color: 'red' }}>
                      <ErrorMessage name="password" component="div" style={{ color: 'red' }} />
                    </div>
                  </div>
                  <div className="d-grid mt-4">
                    <button type="submit" className="btn btn-outline-primary">
                      {isSubmitting ? t('submitting') : t('submit')}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
          <div className="card-footer mt-5 bg-light text-muted">
            <p className="m-0 py-2">
              {t('noAccount')}
              &nbsp;
              <Link to="/signup">{t('signUp')}</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
