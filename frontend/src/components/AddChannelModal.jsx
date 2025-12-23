import * as yup from 'yup'
import { Field } from 'formik'
import { useTranslation } from 'react-i18next'
import { getSchema } from '../validationSchemas'
import Modal from './Modal'

function AddChannelModal({ channels, handleAdd, onClose, error, isSubmitting }) {
  const { t } = useTranslation()
  const schema = getSchema(t, channels)

  const onSubmit = async (values, helpers) => {
    try {
      await handleAdd(values.name)
      helpers.resetForm()
      onClose()
    }
    catch (e) {
      helpers.setFieldError('name', t('addChannelFailure'))
      console.log(e)
    }
  }

  return (
    <Modal
      title={t('channelName')}
      initialValues={{ name: '' }}
      validationSchema={schema}
      submitText={t('send')}
      onClose={onClose}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      error={error}
    >
      <Field
        name="name"
        className="form-control mb-3"
        aria-label={t('channelName')}
        placeholder={t('channelName')}
        autoFocus
      />
    </Modal>
  )
}

export default AddChannelModal
