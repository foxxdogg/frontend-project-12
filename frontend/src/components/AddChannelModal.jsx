import * as yup from 'yup';
import { Field } from 'formik';
import { useTranslation } from 'react-i18next';
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
          return !channels.some(
            (c) => c.name.trim().toLowerCase() === value.trim().toLowerCase(),
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
      submitText={t('add')}
      onClose={onClose}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      error={error}
    >
      <Field
        name="name"
        className="form-control mb-3"
        placeholder={t('addChannel')}
        autoFocus
      />
    </Modal>
  );
};

export default AddChannelModal;
