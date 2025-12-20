import { useTranslation } from 'react-i18next'

const LogoutButton = ({ logout }) => {
  const { t } = useTranslation()
  return (
    <button type="button" className="btn btn-primary" onClick={logout}>
      {t('logout')}
    </button>
  )
}

export default LogoutButton
