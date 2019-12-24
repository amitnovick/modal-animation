import React from "react";
import "normalize.css";
import { useMachine } from "@xstate/react";

import "./index.scss";
import Modal from "./Modal/Modal";
import machine from "./machine";
import usePortal from "../utils/usePortal";
import usePrevious from "../utils/usePrevious";
import initialItems from "../items";

function preloadImage(url) {
  return new Promise(resolve => {
    const image = new Image();
    image.src = url;
    image.onload = () => resolve(image);
  });
}

const fetchAndPreloadImages = async items => {
  const preloadedImages = await Promise.all(
    Object.entries(items).map(([itemId, { imageUrl }]) =>
      preloadImage(imageUrl).then(image => [itemId, image])
    )
  );

  return preloadedImages;
};

const normalizeImagesIntoItems = (preloadedImages, items) => {
  const imagesByItemId = preloadedImages.reduce(
    (accumulated, [itemId, image]) => {
      return {
        ...accumulated,
        [itemId]: image
      };
    },
    {}
  );

  const itemsWithImages = Object.entries(items).reduce(
    (accumulated, [itemId, itemData]) => {
      return {
        ...accumulated,
        [itemId]: {
          ...itemData,
          image: imagesByItemId[itemId]
        }
      };
    },
    {}
  );

  return itemsWithImages;
};

const applyStyles = ({ element, styles }) => {
  return Object.assign(element.style, styles);
};

const performLastInvertPlay = ({ element, last, first, duration }) => {
  const deltaX = first.left - last.left;
  const deltaY = first.top - last.top;
  const deltaW = last.width === 0 ? 0 : first.width / last.width; // working around a bug that occurs when switching between responsive layout and normal layout in devtools
  const deltaH = last.height === 0 ? 0 : first.height / last.height; // working around a bug that occurs when switching between responsive layout and normal layout in devtools

  const animation = element.animate(
    [
      {
        transformOrigin: "top left",
        transform: `
        translate(${deltaX}px, ${deltaY}px)
        scale(${deltaW}, ${deltaH})
      `
      },
      {
        transformOrigin: "top left",
        transform: "none"
      }
    ],
    {
      // timing options
      duration: duration,
      easing: "linear"
    }
  );

  return animation;
};

const performCustomEasingCounterScaleTransition = ({
  element,
  firstImageRect,
  lastImageRect,
  firstScaledImage,
  lastScaledImage,
  duration
}) => {
  const imageTransitionScaleFactor =
    firstScaledImage.height / lastScaledImage.height;

  const scaleX = firstImageRect.width / lastImageRect.width;
  const scaleY = firstImageRect.height / lastImageRect.height;

  const firstLeft = -(firstScaledImage.width - firstImageRect.width) / 2;
  const lastLeft = -(lastScaledImage.width - lastImageRect.width) / 2;
  const firstTop = -(firstScaledImage.height - firstImageRect.height) / 2;
  const lastTop = -(lastScaledImage.height - lastImageRect.height) / 2;

  const keyframes = Array(101)
    .fill(0)
    .map((_, i) => i)
    .map(i => {
      const step = i / 100;
      const end = 1;
      const startW = scaleX;
      const startH = scaleY;

      const scale = (start, end, step) => start - (start - end) * step;
      const scaleW = scale(startW, end, step);
      const scaleH = scale(startH, end, step);
      const invScaleW = 1 / scaleW;
      const invScaleH = 1 / scaleH;

      const imageScale = scale(imageTransitionScaleFactor, 1, step);

      const scaleDeltaX = scale(firstLeft, lastLeft, step);
      const scaleDeltaY = scale(firstTop, lastTop, step);

      return {
        transformOrigin: "top left",
        transform: `
        scale(${invScaleW}, ${invScaleH})
        translate(${scaleDeltaX}px, ${scaleDeltaY}px)
        scale(${imageScale}, ${imageScale})
    `
      };
    });

  const animation = element.animate(keyframes, {
    // timing options
    duration: duration,
    easing: "linear"
  });

  return animation;
};

const performLastInvertPlayWithBorderRadius = ({
  element,
  last,
  first,
  duration
}) => {
  const deltaX = first.left - last.left;
  const deltaY = first.top - last.top;
  const deltaW = last.width === 0 ? 1 : first.width / last.width; // working around a bug that occurs when switching between responsive layout and normal layout in devtools
  const deltaH = last.height === 0 ? 1 : first.height / last.height; // working around a bug that occurs when switching between responsive layout and normal layout in devtools

  const MODAL_CONTNT_BORDER_RADIUS_PX = 8;

  const firstBorderValueXpx = MODAL_CONTNT_BORDER_RADIUS_PX * (1 / deltaW);
  const firstBorderValueYpx = MODAL_CONTNT_BORDER_RADIUS_PX * (1 / deltaH);

  const firstBorderValue = `${firstBorderValueXpx}px ${firstBorderValueYpx}px`;

  const animation = element.animate(
    [
      {
        transformOrigin: "top left",
        transform: `
        translate(${deltaX}px, ${deltaY}px)
        scale(${deltaW}, ${deltaH})
      `,
        borderTopLeftRadius: firstBorderValue,
        borderTopRightRadius: firstBorderValue,
        borderBottomLeftRadius: firstBorderValue,
        borderBottomRightRadius: firstBorderValue
      },
      {
        borderRadius: `${MODAL_CONTNT_BORDER_RADIUS_PX}px`,
        transformOrigin: "top left",
        transform: "none"
      }
    ],
    {
      duration: duration,
      easing: "linear"
    }
  );

  return animation;
};

const getDuration = () => {
  return window.matchMedia("(max-width: 767px)").matches ? 2000 : 1500;
};

const applyStylesPx = ({ element, styles }) => {
  const stylesPx = Object.entries(styles).reduce(
    (accumulated, [property, value]) => {
      return {
        ...accumulated,
        [property]: value + "px"
      };
    },
    {}
  );
  return Object.assign(element.style, stylesPx);
};

const fitObjectCover = ({ imageIntrinsicDimensions, rectangleDimensions }) => {
  const heightRatio =
    imageIntrinsicDimensions.height / rectangleDimensions.height;
  const dimensionsFitByHeight = {
    width: imageIntrinsicDimensions.width / heightRatio,
    height: rectangleDimensions.height
  };
  if (dimensionsFitByHeight.width >= rectangleDimensions.width) {
    return dimensionsFitByHeight;
  } else {
    const widthRatio =
      imageIntrinsicDimensions.width / rectangleDimensions.width;
    const dimensionsFitByWidth = {
      width: rectangleDimensions.width,
      height: imageIntrinsicDimensions.height / widthRatio
    };
    if (dimensionsFitByHeight.height >= rectangleDimensions.height) {
      return dimensionsFitByWidth;
    } else {
      const largerDimension = Math.max(
        rectangleDimensions.width,
        rectangleDimensions.height
      );
      return {
        width: largerDimension,
        height: largerDimension
      };
    }
  }
};

const Gallery = () => {
  const [extendedState, setExtendedState] = React.useState({
    items: initialItems,
    chosenItemId: null,
    hasFinishedLoading: false
  });

  const { items, chosenItemId, hasFinishedLoading } = extendedState;

  const TransitionElementPortal = usePortal();
  const ModalPortal = usePortal();

  const portalImageRef = React.useRef();
  const portalCropDivRef = React.useRef();
  const portalModalCardRef = React.useRef();

  const cropDivAnimationRef = React.useRef();
  const imageAnimationRef = React.useRef();
  const modalCardAnimationRef = React.useRef();
  const modalContentOpacityAnimationRef = React.useRef();

  const modalOverlayAnimationRef = React.useRef();
  const modalCardRef = React.useRef();
  const modalContentRef = React.useRef();

  const imageCloneElRef = React.useRef();

  const gridImagesRef = React.useRef(
    Object.keys(extendedState.items).reduce(
      (accumulated, itemId) => ({
        ...accumulated,
        [itemId]: React.createRef()
      }),
      {}
    )
  );

  const modalOverlayRef = React.useRef();
  const modalImageRef = React.useRef();

  const [state, send] = useMachine(machine, {
    devTools: true,
    actions: {
      removeImageElement: () => {
        if (imageCloneElRef.current && modalCardRef.current) {
          document.body.removeChild(imageCloneElRef.current);
        }
      },
      cancelOpacityAnimation: () => {
        modalContentOpacityAnimationRef.current.cancel();
      }
    }
  });

  const previousState = usePrevious(state);

  React.useLayoutEffect(() => {
    if (previousState) {
      if (state.matches("opening") && previousState.matches("closed")) {
        const lastImageRect = modalImageRef.current.getBoundingClientRect();

        portalImageRef.current.style.position = "absolute";

        /*** <cropDivRef> ***/
        applyStylesPx({
          element: portalCropDivRef.current,
          styles: {
            top: lastImageRect.top,
            left: lastImageRect.left,
            width: lastImageRect.width,
            height: lastImageRect.height
          }
        });

        applyStyles({
          element: portalCropDivRef.current,
          styles: {
            display: "initial"
          }
        });
        /*** </cropDivRef> ***/

        const duration = getDuration();

        const firstImageRect = gridImagesRef.current[
          chosenItemId
        ].current.getBoundingClientRect();

        const animation = performLastInvertPlay({
          element: portalCropDivRef.current,
          first: firstImageRect,
          last: lastImageRect,
          duration: duration
        });
        animation.onfinish = () => send("FINISHED_SLIDE_IN_ANIMATION");
        cropDivAnimationRef.current = animation;

        /*** <portalModalCardRef> ***/
        const lastModalContentRect = modalCardRef.current.getBoundingClientRect();

        applyStylesPx({
          element: portalModalCardRef.current,
          styles: {
            top: lastModalContentRect.top,
            left: lastModalContentRect.left,
            width: lastModalContentRect.width,
            height: lastModalContentRect.height
          }
        });

        modalCardAnimationRef.current = performLastInvertPlay({
          element: portalModalCardRef.current,
          first: firstImageRect,
          last: lastModalContentRect,
          duration: duration
        });

        /*** </portalModalCardRef> ***/

        /*** <portalImageRef> ***/
        const preloadedImage = items[chosenItemId].image;

        const lastScaledImage = fitObjectCover({
          imageIntrinsicDimensions: {
            width: preloadedImage.width,
            height: preloadedImage.height
          },
          rectangleDimensions: {
            width: lastImageRect.width,
            height: lastImageRect.height
          }
        });

        const firstScaledImage = fitObjectCover({
          imageIntrinsicDimensions: {
            width: preloadedImage.width,
            height: preloadedImage.height
          },
          rectangleDimensions: {
            width: firstImageRect.width,
            height: firstImageRect.height
          }
        });

        applyStylesPx({
          element: portalImageRef.current,
          styles: {
            width: lastScaledImage.width,
            height: lastScaledImage.height
          }
        });

        imageAnimationRef.current = performCustomEasingCounterScaleTransition({
          element: portalImageRef.current,
          firstImageRect: firstImageRect,
          lastImageRect: lastImageRect,
          firstScaledImage: firstScaledImage,
          lastScaledImage: lastScaledImage,
          duration: duration
        });
        /*** </portalImageRef> ***/

        modalOverlayAnimationRef.current = modalOverlayRef.current.animate(
          [
            {
              opacity: 0
            },
            { opacity: 1 }
          ],
          {
            duration: duration,
            easing: "linear"
          }
        );
      } else if (state.matches("closing") && previousState.matches("opening")) {
        cropDivAnimationRef.current.onfinish = () =>
          send("FINISHED_SLIDE_OUT_ANIMATION");
        cropDivAnimationRef.current.reverse();
        imageAnimationRef.current.reverse();

        modalOverlayAnimationRef.current.reverse();
        modalCardAnimationRef.current.reverse();
      } else if (state.matches("closing") && previousState.matches("opened")) {
        const lastImageRect = gridImagesRef.current[
          chosenItemId
        ].current.getBoundingClientRect();

        /*** <cropDivRef> ***/
        applyStylesPx({
          element: portalCropDivRef.current,
          styles: {
            top: lastImageRect.top,
            left: lastImageRect.left,
            width: lastImageRect.width,
            height: lastImageRect.height
          }
        });

        applyStyles({
          element: portalCropDivRef.current,
          styles: {
            display: "initial"
          }
        });
        /*** </cropDivRef> ***/

        const modalImageRect = modalImageRef.current.getBoundingClientRect();
        const firstImageRect = modalImageRect;

        const duration = getDuration();
        const animation = performLastInvertPlay({
          element: portalCropDivRef.current,
          first: firstImageRect,
          last: lastImageRect,
          duration: duration
        });

        animation.onfinish = () => send("FINISHED_SLIDE_OUT_ANIMATION");

        applyStylesPx({
          element: portalModalCardRef.current,
          styles: {
            top: lastImageRect.top,
            left: lastImageRect.left,
            width: lastImageRect.width,
            height: lastImageRect.height
          }
        });

        performLastInvertPlayWithBorderRadius({
          element: portalModalCardRef.current,
          first: modalCardRef.current.getBoundingClientRect(),
          last: lastImageRect,
          duration: duration
        });

        /*** <portalImageRef> ***/
        const preloadedImage = items[chosenItemId].image;

        const lastScaledImage = fitObjectCover({
          imageIntrinsicDimensions: {
            width: preloadedImage.width,
            height: preloadedImage.height
          },
          rectangleDimensions: {
            width: lastImageRect.width,
            height: lastImageRect.height
          }
        });

        const firstScaledImage = fitObjectCover({
          imageIntrinsicDimensions: {
            width: preloadedImage.width,
            height: preloadedImage.height
          },
          rectangleDimensions: {
            width: firstImageRect.width,
            height: firstImageRect.height
          }
        });

        applyStylesPx({
          element: portalImageRef.current,
          styles: {
            width: lastScaledImage.width,
            height: lastScaledImage.height
          }
        });

        performCustomEasingCounterScaleTransition({
          element: portalImageRef.current,
          firstImageRect: firstImageRect,
          lastImageRect: lastImageRect,
          firstScaledImage: firstScaledImage,
          lastScaledImage: lastScaledImage,
          duration: duration
        });
        /*** </portalImageRef> ***/

        modalOverlayRef.current.animate(
          [
            {
              opacity: 1
            },
            { opacity: 0 }
          ],
          {
            duration: duration,
            easing: "linear"
          }
        );
      } else if (
        state.matches("opened.transparentControls") &&
        previousState.matches("opening")
      ) {
        if (modalCardRef.current) {
          const imageCloneEl = modalImageRef.current.cloneNode(false);
          imageCloneEl.style.position = "fixed";
          const modalImageRect = modalImageRef.current.getBoundingClientRect();
          applyStylesPx({
            element: imageCloneEl,
            styles: {
              top: modalImageRect.top,
              left: modalImageRect.left,
              width: modalImageRect.width,
              height: modalImageRect.height
            }
          });
          imageCloneElRef.current = imageCloneEl;
          document.body.appendChild(imageCloneEl);
        }
        const modalContentOpacityAnimation = modalContentRef.current.animate(
          [
            {
              opacity: 0
            },
            { opacity: 1 }
          ],
          {
            duration: 150,
            easing: "linear"
          }
        );

        modalContentOpacityAnimation.onfinish = () => {
          send("FINISH_OPACITY_ANIMATION");
        };

        modalContentOpacityAnimationRef.current = modalContentOpacityAnimation;
      }
    }
  }, [state.value]);

  const updateItems = async () => {
    const preloadedImages = await fetchAndPreloadImages(extendedState.items);
    const itemsWithImages = normalizeImagesIntoItems(
      preloadedImages,
      extendedState.items
    );
    setExtendedState(prev => ({
      ...prev,
      items: itemsWithImages,
      hasFinishedLoading: true
    }));
  };

  React.useEffect(() => {
    updateItems();
  }, []);

  React.useEffect(() => {
    const listener = ({ key }) => {
      if (key === "Escape") {
        send("CLOSE_MODAL");
      }
    };
    window.addEventListener("keydown", listener);

    return () => window.removeEventListener("keydown", listener);
  }, []);

  const isOpeningModal = state.matches("opening");

  React.useEffect(() => {
    if (isOpeningModal) {
      const listener = () => {
        send("CLOSE_MODAL");
      };

      window.addEventListener("mousedown", listener);

      return () => window.removeEventListener("mousedown", listener);
    }
  }, [isOpeningModal]);

  console.log("*** <App RENDER> ***");
  console.log("extendedState:", extendedState);
  console.log("state.value:", state.value);
  console.log(
    "previous state.value:",
    previousState ? previousState.value : undefined
  );
  console.log("*** </App RENDER> ***");

  const shouldDisplayPortalImage =
    state.matches("opening") || state.matches("closing");

  if (!hasFinishedLoading) {
    return <h2> Loading... </h2>;
  } else {
    return (
      <>
        <div className="grid">
          {Object.entries(items).map(
            ([
              itemId,
              {
                image: { src: imageSrc },
                imageDescription
              }
            ]) => (
              <button
                to={`/details/${itemId}`}
                key={itemId}
                className="details-button"
                onClick={event => {
                  event.preventDefault(); // prevent default navigation
                  if (state.matches("closed")) {
                    setExtendedState(previous => ({
                      ...previous,
                      chosenItemId: itemId
                    }));
                    send("OPEN_MODAL");
                  }
                }}
              >
                <div className="image-container">
                  <img
                    key={itemId}
                    ref={gridImagesRef.current[itemId]}
                    className="image"
                    src={imageSrc}
                    alt={imageDescription}
                  />
                </div>
              </button>
            )
          )}
        </div>
        <ModalPortal>
          <Modal
            item={state.matches("closed") ? null : items[chosenItemId]}
            modalState={state}
            closeModal={() => send("CLOSE_MODAL")}
            modalImageRef={modalImageRef}
            modalOverlayRef={modalOverlayRef}
            modalCardRef={modalCardRef}
            modalContentRef={modalContentRef}
          />
        </ModalPortal>
        <TransitionElementPortal>
          {shouldDisplayPortalImage ? (
            <>
              <div
                ref={portalCropDivRef}
                className="portal-crop-div"
                style={{ position: "fixed", zIndex: 1001 }} // zIndex must be greater than `portal-modal-card`
              >
                <div className="portal-image-wrapper">
                  <img
                    className="image"
                    ref={portalImageRef}
                    src={items[chosenItemId].image.src}
                    alt=""
                  />
                </div>
              </div>
              <div
                className="portal-modal-card"
                ref={portalModalCardRef}
                style={{ zIndex: 1000 }}
              />
            </>
          ) : null}
        </TransitionElementPortal>
      </>
    );
  }
};

export default Gallery;
