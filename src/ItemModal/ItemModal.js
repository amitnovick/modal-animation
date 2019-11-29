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
    const { isModalOpen, closeModal, item, modalImageRef } = this.props;

    console.log("*** <ItemModal> ***");
    console.log("ItemModal rendered");
    console.log("item:", item);
    console.log("modalImageRef:", modalImageRef);
    console.log("*** </ItemModal> ***");
    return (
      <div
        ref={modalImageRef}
        style={{ width: 100, height: 100, backgroundColor: "purple" }}
      />
    );
    // return (
    //   <Modal
    //     isOpen={true} /* isModalOpen */
    //     onRequestClose={closeModal}
    //     style={customStyles}
    //     contentLabel="Example Modal"
    //   >
    //     <button className={styles["close-button"]} onClick={closeModal}>
    //       ×
    //     </button>

    //     <div
    //       ref={modalImageRef}
    //       style={{ width: 100, height: 100, backgroundColor: "purple" }}
    //     />

    //     {/* {isModalOpen ? (
    //       <img
    //         ref={modalImageRef}
    //         className={styles["track-image"]}
    //         src={item.image.src}
    //         alt="artwork"
    //       />
    //     ) : (
    //       <img ref={modalImageRef} alt="artwork" />
    //     )} */}
    //   </Modal>
    // );
  }
}

ItemModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  item: PropTypes.object,
  modalImageRef: PropTypes.any
};

export default ItemModal;
