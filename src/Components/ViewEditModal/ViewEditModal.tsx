import { useState, useCallback } from "react";
import "./ConfirmModal.styles.css";

export const useEditViewModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [resolvePromise, setResolvePromise] = useState(null);

  //   const show = useCallback(() => {
  //     setIsOpen(true);
  //     return new Promise((resolve) => {
  //       setResolvePromise(() => resolve);
  //     });
  //   }, []);

  //   const confirm = useCallback(() => {
  //     if (resolvePromise) {
  //       resolvePromise(true);
  //       setResolvePromise(null);
  //     }
  //     setIsOpen(false);
  //   }, [resolvePromise]);

  //   const cancel = useCallback(() => {
  //     if (resolvePromise) {
  //       resolvePromise(false);
  //       setResolvePromise(null);
  //     }
  //     setIsOpen(false);
  //   }, [resolvePromise]);

  const ConfirmModal = ({ caption }) =>
    isOpen ? (
      <div className="modal">
        <div className="modal-content">
          <h2>Confirm Action</h2>
          <p>{caption}</p>
          <button
            className="confirm-modal-button"
            style={{ backgroundColor: "#5ba86a" }}
            onClick={confirm}
          >
            Confirm
          </button>
          <button
            className="confirm-modal-button"
            style={{ backgroundColor: "#ff3a2c" }}
            onClick={cancel}
          >
            Cancel
          </button>
        </div>
      </div>
    ) : null;

  return { show, ConfirmModal };
};
