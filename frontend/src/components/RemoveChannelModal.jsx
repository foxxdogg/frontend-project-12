import Modal from './Modal';

const RemoveChannelModal = ({
  onClose, onSubmit, isSubmitting, error,
}) => (
  <Modal
    title="Remove Channel?"
    initialValues={{}}
    validationSchema={null}
    submitText="Remove"
    onClose={onClose}
    onSubmit={onSubmit}
    isSubmitting={isSubmitting}
    error={error}
  >
    <p className="modal-body p-0">Are U Sure?</p>
  </Modal>
);

export default RemoveChannelModal;
