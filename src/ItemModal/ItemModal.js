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
            visibility: modalState.matches("closed->opened")
              ? "hidden"
              : undefined
          }
        }}
      >
        <button className={styles["close-button"]} onClick={closeModal}>
          ×
        </button>

        <img
          ref={modalImageRef}
          // style={{
          //   visibility: modalState.matches("closed->opened")
          //     ? "visible"
          //     : undefined,
          //   position: modalState.matches("closed->opened")
          //     ? "absolute"
          //     : undefined
          // }}
          className={styles["image"]}
          src={item !== null ? item.image.src : undefined}
          alt="artwork"
        />
      </Modal>
    );
  }
}

ItemModal.propTypes = {
  modalState: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired,
  modalImageRef: PropTypes.any
};

export default ItemModal;
