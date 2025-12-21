import { useTranslation } from 'react-i18next'
import Modal from './Modal'

function RemoveChannelModal({
  onClose, onSubmit, isSubmitting, error,
}) {
  const { t } = useTranslation()
  return (
    <Modal
      title={`${t('removeChannel')}?`}
      initialValues={{}}
      validationSchema={null}
      submitText={t('delete')}
      onClose={onClose}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      error={error}
    >
      <p className="modal-body p-0">{t('sure')}</p>
    </Modal>
  )
}

export default RemoveChannelModal
