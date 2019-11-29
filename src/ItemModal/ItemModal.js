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
    borderRadius: "8px"
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)"
  }
};

class ItemModal extends React.PureComponent {
  render() {
    const { isModalOpen, closeModal, modalImageRef } = this.props;

    return (
      <Modal
        isOpen={true}
        onRequestClose={closeModal}
        style={{
          ...customStyles,
          overlay: {
            ...customStyles.overlay,
            display: isModalOpen ? "initial" : "none"
          }
        }}
      >
        <button className={styles["close-button"]} onClick={closeModal}>
          ×
        </button>

        <div
          ref={modalImageRef}
          style={{ width: 100, height: 100, backgroundColor: "purple" }}
        />
      </Modal>
    );
  }
}

ItemModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  modalImageRef: PropTypes.any
};

export default ItemModal;
