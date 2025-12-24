import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { getSignupSchema } from '../validationSchemas'
import { login } from '../store/slices/authSlice'
import Header from '../components/Header'
import Focus from '../components/Focus'
import useLogout from '../hooks/useLogout'

function Signup() {
  const { t } = useTranslation()
  const handleLogout = useLogout()
  const signupSchema = getSignupSchema(t)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleSubmit = async (values, { setSubmitting, setErrors, setStatus }) => {
    setSubmitting(true)
    try {
      const response = await axios.post('/api/v1/signup', {
        username: values.username,
        password: values.password,
      })
      const { token } = response.data
      const user = { username: values.username }
      dispatch(login({ token, user }))
      navigate('/')
    }
    catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          setErrors({ username: t('exists') })
        }
        else if (error.response.data && error.response.data.message) {
          setStatus(t('anyError'))
        }
        else {
          setStatus(t('serverError'))
        }
      }
      else {
        setStatus(t('networkError'))
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
            <h2 className="card-title  text-center">{t('signUp')}</h2>
            <Formik
              initialValues={{ username: '', password: '', confirmation: '' }}
              onSubmit={handleSubmit}
              validationSchema={signupSchema}
            >
              {({ isSubmitting, status }) => (
                <Form>
                  <Focus />
                  {status && <div className="alert alert-danger mb-3">{status}</div>}
                  <div className="form-group mb-3">
                    <label htmlFor="username">{t('username')}</label>
                    <Field type="text" name="username" className="form-control" id="username" autoComplete="off"/>
                    <div style={{ minHeight: '30px', color: 'red' }}>
                      <ErrorMessage name="username" component="div" style={{ color: 'red' }} />
                    </div>
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="password">{t('password')}</label>
                    <Field type="password" name="password" className="form-control" id="password" autoComplete="off"/>
                    <div style={{ minHeight: '30px', color: 'red' }}>
                      <ErrorMessage name="password" component="div" style={{ color: 'red' }} />
                    </div>
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="confirmation">{t('confirmation')}</label>
                    <Field
                      type="password"
                      name="confirmation"
                      className="form-control"
                      id="confirmation"
                      autoComplete="off"
                    />
                    <div style={{ minHeight: '30px', color: 'red' }}>
                      <ErrorMessage name="confirmation" component="div" style={{ color: 'red' }} />
                    </div>
                  </div>
                  <div className="d-grid mt-4">
                    <button type="submit" className="btn btn-outline-primary">
                      {isSubmitting ? t('registering') : t('register')}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup
