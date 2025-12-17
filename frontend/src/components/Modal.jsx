/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  Formik, Form, ErrorMessage,
} from 'formik';
import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Modal = ({
  title,
  initialValues,
  validationSchema,
  submitText,
  onClose,
  onSubmit,
  isSubmitting,
  error,
  children,
}) => {
  const isDragging = useRef(false);
  const removeBtnRef = useRef(null);
  const { t } = useTranslation();

  const handleMouseDown = () => {
    isDragging.current = false;
  };

  const handleMouseMove = () => {
    isDragging.current = true;
  };

  const handleBackgroundMouseUp = (e) => {
    if (!isDragging.current && e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    if (submitText === 'Remove' && removeBtnRef.current) {
      removeBtnRef.current.focus();
    }
  }, [submitText]);

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      tabIndex="-1"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleBackgroundMouseUp}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema || null}
              onSubmit={onSubmit}
              validateOnMount={false}
              validateOnBlur={false}
              validateOnChange={false}
            >
              {(formik) => (
                <Form>
                  {children}
                  <div style={{ minHeight: '60px' }}>
                    {error && (
                    <div className="alert alert-danger py-2">{error}</div>
                    )}
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="alert alert-danger py-2"
                    />
                  </div>

                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        formik.resetForm();
                        onClose();
                      }}
                    >
                      {t('cancel')}
                    </button>

                    <button
                      type="submit"
                      ref={submitText === t('delete') ? removeBtnRef : null}
                      className={`btn btn-primary ${submitText === t('delete') ? 'btn-danger' : 'btn-primary'}`}
                      disabled={isSubmitting}
                    >
                      {submitText}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>

        </div>
      </div>
    </div>
  );
};
export default Modal;
