import React from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";

import styles from "./styles.module.scss";

Modal.setAppElement("#root");

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "8px",
    padding: "0px"
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)"
  }
};

class ItemModal extends React.PureComponent {
  render() {
    const { modalState, item, closeModal, modalImageRef } = this.props;

    return (
      <Modal
        isOpen={true}
        onRequestClose={closeModal}
        style={{
          ...customStyles,
          overlay: {
            ...customStyles.overlay,
            display: modalState.matches("closed") ? "none" : undefined,
            opacity: modalState.matches("closed->opened") ? 0 : undefined,
            visibility: modalState.matches("opened->closed")
              ? "hidden"
              : undefined
          },
          content: {
            ...customStyles.content
          }
        }}
      >
        <div className={styles["modal-top-bar"]}>
          <h2 className={styles["modal-title"]}>Photo</h2>
          <button className={styles["close-button"]} onClick={closeModal}>
            ×
          </button>
        </div>

        <div className={styles["image-container"]}>
          <img
            ref={modalImageRef}
            className={styles["image"]}
            src={item !== null ? item.image.src : undefined}
            alt="artwork"
          />
        </div>
      </Modal>
    );
  }
}

ItemModal.propTypes = {
  modalState: PropTypes.object.isRequired,
  item: PropTypes.object,
  closeModal: PropTypes.func.isRequired,
  modalImageRef: PropTypes.any
};

export default ItemModal;
