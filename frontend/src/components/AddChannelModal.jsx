import * as yup from 'yup';
import { Field } from 'formik';
import Modal from './Modal';

const AddChannelModal = ({
  channels, handleAdd, onClose, error, isSubmitting,
}) => {
  const schema = yup.object({
    name: yup
      .string()
      .min(3)
      .max(20)
      .required()
      .test(
        'unique',
        'A channel with this name already exists',

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
      helpers.setFieldError('name', 'Failed to create the channel');
    }
  };

  return (
    <Modal
      title="Add Channel"
      initialValues={{ name: '' }}
      validationSchema={schema}
      submitText="Add"
      onClose={onClose}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      error={error}
    >
      <Field
        name="name"
        className="form-control mb-3"
        placeholder="Add channel"
        autoFocus
      />
    </Modal>
  );
};

export default AddChannelModal;
