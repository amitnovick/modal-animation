import React from "react";
import styles from "./styles.module.scss";
import items from "../items";

function Details({ itemId }) {
  const item = items[itemId];

  const { imageUrl, artistName, artistId, artistImage } = item;
  return (
    <>
      <h1>Details page</h1>
      <div className={styles["artist-bar-large-screen"]}>
        <img
          className={styles["artist-image"]}
          src={artistImage}
          alt="arist-avatar"
        />
        <div className={styles["artist-identity-container"]}>
          <span className={styles["artist-name"]}>{artistName}</span>
          <span className={styles["artist-id"]}>{artistId}</span>
        </div>
      </div>

      <div className={styles["artist-bar-small-screen"]}>
        <img
          className={styles["artist-image"]}
          src={artistImage}
          alt="arist-avatar"
        />
        <div className={styles["artist-identity-container"]}>
          <span className={styles["artist-name"]}>{artistName}</span>
          <span className={styles["artist-id"]}>{artistId}</span>
        </div>
      </div>
      <div className={styles["image-container"]}>
        <img className={styles["image"]} src={imageUrl} alt="artwork" />
      </div>
    </>
  );
}

export default Details;
