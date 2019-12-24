const checkIsWebAnimationsSupported = () =>
  "animate" in document.createElement("div");

export default checkIsWebAnimationsSupported;
