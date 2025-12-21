import * as yup from 'yup'
import { Field } from 'formik'
import { useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import leoProfanity from 'leo-profanity'
import Modal from './Modal'

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

  const schema = yup.object({
    name: yup
      .string()
      .min(3, t('range'))
      .max(20, t('range'))
      .required(t('required'))
      .test(
        'unique',
        t('notUniq'),

        value => {
          if (!value) return false
          const cleanValue = leoProfanity.clean(value).trim().toLowerCase()
          return !channels.some(
            c => leoProfanity.clean(c.name).trim().toLowerCase() === cleanValue,
          )
        },
      ),
  })

  const onSubmit = async (values, helpers) => {
    try {
      await handleRename(values.name)
      helpers.resetForm()
      onClose()
    } catch (e) {
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
