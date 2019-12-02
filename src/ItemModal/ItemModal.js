import React from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTimes } from "@fortawesome/free-solid-svg-icons";

import styles from "./styles.module.scss";

Modal.setAppElement("#root");

const ItemModal = React.memo(
  ({ modalState, item, closeModal, modalImageRef }) => {
    return (
      <Modal
        isOpen={true}
        onRequestClose={closeModal}
        overlayClassName={styles["modal-overlay"]}
        className={styles["modal-content"]}
        style={{
          overlay: {
            display: modalState.matches("closed") ? "none" : undefined,
            opacity: modalState.matches("closed->opened") ? 0 : undefined,
            visibility: modalState.matches("opened->closed")
              ? "hidden"
              : undefined
          }
        }}
      >
        <div className={styles["modal-top-bar"]}>
          <button className={styles["left-arrow-button"]} onClick={closeModal}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button className={styles["back-button"]} onClick={closeModal}>
            Back
          </button>

          {item !== null ? (
            <div className={styles["artist-bar-large-screen"]}>
              <img
                className={styles["artist-image"]}
                src={item.artistImage}
                alt="arist-avatar"
              />
              <div className={styles["artist-identity-container"]}>
                <span className={styles["artist-name"]}>{item.artistName}</span>
                <span className={styles["artist-id"]}>{item.artistId}</span>
              </div>
            </div>
          ) : null}
          <button className={styles["close-button"]} onClick={closeModal}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        {item !== null ? (
          <div className={styles["artist-bar-small-screen"]}>
            <img
              className={styles["artist-image"]}
              src={item.artistImage}
              alt="arist-avatar"
            />
            <div className={styles["artist-identity-container"]}>
              <span className={styles["artist-name"]}>{item.artistName}</span>
              <span className={styles["artist-id"]}>{item.artistId}</span>
            </div>
          </div>
        ) : null}
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
);

ItemModal.propTypes = {
  modalState: PropTypes.object.isRequired,
  item: PropTypes.object,
  closeModal: PropTypes.func.isRequired,
  modalImageRef: PropTypes.any
};

export default ItemModal;
