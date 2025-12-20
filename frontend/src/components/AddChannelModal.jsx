import * as yup from 'yup';
import { Field } from 'formik';
import { useTranslation } from 'react-i18next';
import leoProfanity from 'leo-profanity';
import Modal from './Modal';

const AddChannelModal = ({
  channels, handleAdd, onClose, error, isSubmitting,
}) => {
  const { t } = useTranslation();
  const schema = yup.object({
    name: yup
      .string()
      .min(3, t('range'))
      .max(20, t('range'))
      .required(t('required'))
      .test(
        'unique',
        t('notUniq'),

        (value) => {
          if (!value) return false;
          const cleanValue = leoProfanity.clean(value).trim().toLowerCase();
          return !channels.some(
            (c) => leoProfanity.clean(c.name).trim().toLowerCase() === cleanValue,
          );
        },
      ),
  });

  const onSubmit = async (values, helpers) => {
    try {
      await handleAdd(values.name);
      helpers.resetForm();
      onClose();
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      helpers.setFieldError('name', t('addChannelFailure'));
    }
  };

  return (
    <Modal
      title={t('addChannel')}
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
        aria-label="Имя канала"
        placeholder={t('addChannel')}
        autoFocus
      />
    </Modal>
  );
};

export default AddChannelModal;
