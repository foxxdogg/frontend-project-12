import * as yup from 'yup';
import { Field } from 'formik';
import { useRef, useEffect } from 'react';
import Modal from './Modal';

const RenameChannelModal = ({
  channels, handleRename, onClose, placeholder, channelName, isSubmitting,
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

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
      await handleRename(values.name);
      helpers.resetForm();
      onClose();
    } catch (e) {
      console.log(e);
      helpers.setFieldError('name', 'Failed to rename the channel');
    }
  };

  return (
    <Modal
      title="Rename Channel"
      initialValues={{ name: channelName }}
      validationSchema={schema}
      submitText="Rename"
      onClose={onClose}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    >
      <Field
        name="name"
        className="form-control mb-3"
        placeholder={placeholder}
        innerRef={inputRef}
      />
    </Modal>
  );
};

export default RenameChannelModal;
