import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";

import styles from "./styles.module.scss";

const Modal = React.memo(
  ({
    modalState,
    item,
    closeModal,
    modalImageRef,
    modalOverlayRef,
    modalContentRef
  }) => {
    const history = useHistory();

    const isOpen = modalState.matches("opened");

    React.useEffect(() => {
      if (isOpen) {
        const listener = ({ target }) => {
          if (!modalContentRef.current.contains(target)) {
            closeModal();
          }
        };

        window.addEventListener("mousedown", listener);

        return () => window.removeEventListener("mousedown", listener);
      }
    }, [isOpen]);

    React.useEffect(() => {
      const unlisten = history.listen((_, action) => {
        if (isOpen && action === "POP") {
          closeModal();
        }
      });

      return () => unlisten();
    }, [isOpen]);

    return (
      <>
        {item === null ? null : (
          <div
            className={styles["modal-overlay"]}
            ref={modalOverlayRef}
            style={{
              display: modalState.matches("closed") ? "none" : undefined
            }}
          >
            <div
              className={styles["modal-content"]}
              ref={modalContentRef}
              style={{
                visibility:
                  modalState.matches("opened->closed") ||
                  modalState.matches("closed->opened")
                    ? "hidden"
                    : undefined
              }}
            >
              <div className={styles["modal-top-bar"]}>
                <button
                  className={styles["left-arrow-button"]}
                  onClick={closeModal}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <button className={styles["back-button"]} onClick={closeModal}>
                  Back
                </button>

                <div className={styles["artist-bar-large-screen"]}>
                  <img
                    className={styles["artist-image"]}
                    src={item.artistImage}
                    alt="arist-avatar"
                  />
                  <div className={styles["artist-identity-container"]}>
                    <span className={styles["artist-name"]}>
                      {item.artistName}
                    </span>
                    <span className={styles["artist-id"]}>{item.artistId}</span>
                  </div>
                </div>
                <button className={styles["close-button"]} onClick={closeModal}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <div className={styles["artist-bar-small-screen"]}>
                <img
                  className={styles["artist-image"]}
                  src={item.artistImage}
                  alt="arist-avatar"
                />
                <div className={styles["artist-identity-container"]}>
                  <span className={styles["artist-name"]}>
                    {item.artistName}
                  </span>
                  <span className={styles["artist-id"]}>{item.artistId}</span>
                </div>
              </div>
              <div className={styles["image-container"]}>
                <img
                  ref={modalImageRef}
                  className={styles["image"]}
                  src={item.image.src}
                  alt="artwork"
                />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
);

Modal.propTypes = {
  modalState: PropTypes.object.isRequired,
  item: PropTypes.object,
  closeModal: PropTypes.func.isRequired,
  modalImageRef: PropTypes.any
};

export default Modal;
