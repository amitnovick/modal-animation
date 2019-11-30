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
    const {
      modalState,
      item,
      closeModal,
      modalImageRef,
      modalImageProperties
    } = this.props;

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
            ...customStyles.content,
            height: modalState.matches("opened->closed") ? "100%" : undefined,
            width: modalState.matches("opened->closed") ? "100%" : undefined
          }
        }}
      >
        <button className={styles["close-button"]} onClick={closeModal}>
          ×
        </button>

        <img
          {...{
            style: modalState.matches("opened->closed")
              ? {
                  visibility: "visible",
                  position: "absolute",
                  top: modalImageProperties.top,
                  left: modalImageProperties.left,
                  width: modalImageProperties.width,
                  height: modalImageProperties.height
                }
              : {}
          }}
          ref={modalImageRef}
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
  item: PropTypes.object,
  closeModal: PropTypes.func.isRequired,
  modalImageRef: PropTypes.any,
  modalImageProperties: PropTypes.object
};

export default ItemModal;
