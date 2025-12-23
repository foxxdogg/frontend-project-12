import { Field } from 'formik'
import { useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from './Modal'
import { getSchema } from '../validationSchemas'

function RenameChannelModal({
  channels,
  handleRename,
  onClose,
  placeholder,
  channelName,
  isSubmitting,
}) {
  const { t } = useTranslation()
  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [])

  const schema = getSchema(t, channels)

  const onSubmit = async (values, helpers) => {
    try {
      await handleRename(values.name)
      helpers.resetForm()
      onClose()
    }
    catch (e) {
      console.log(e)
      helpers.setFieldError('name', t('renameChannelFailure'))
    }
  }

  return (
    <Modal
      title={t('renameChannel')}
      initialValues={{ name: channelName }}
      validationSchema={schema}
      submitText={t('send')}
      onClose={onClose}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    >
      <Field
        name="name"
        className="form-control mb-3"
        aria-label={t('channelName')}
        placeholder={placeholder}
        innerRef={inputRef}
      />
    </Modal>
  )
}

export default RenameChannelModal
