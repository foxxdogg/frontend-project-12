import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'
import useLogout from '../hooks/useLogout'

const NotFound = () => {
  const { t } = useTranslation()
  const handleLogout = useLogout()
  return (
    <>
      <Header handleLogout={handleLogout} />
      <div className="container-fluid p-5 d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="card p-5 bg-white shadow rounded text-center">
          <h1 className="card-title">404</h1>
          <p>{t('notFound')}</p>
          <Link to="/">{t('toMainPage')}</Link>
        </div>
      </div>
    </>
  )
}

export default NotFound
