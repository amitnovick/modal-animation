import React from "react";
import "normalize.css";
import { useMachine } from "@xstate/react";
import { Link } from "react-router-dom";

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

const applyStyles = (element, stylesOptions) => {
  Object.assign(element.style, stylesOptions);
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
      easing: "ease-in-out",
      fill: "both"
    }
  );

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
      easing: "ease-in-out",
      fill: "both"
    }
  );

  return animation;
};

const getDuration = () => {
  return window.matchMedia("(max-width: 767px)").matches ? 3000 : 2000;
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
  const portalModalContentRef = React.useRef();

  const imageAnimationRef = React.useRef();
  const modalContentAnimationRef = React.useRef();

  const modalOverlayAnimationRef = React.useRef();
  const modalContentRef = React.useRef();

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
      updateUrlToDetailsPage: () => {
        window.history.pushState({}, "Details", `/details/${chosenItemId}`);
      },
      updateUrlToGalleryPage: () => {
        window.history.pushState({}, "Gallery", `/`);
      }
    }
  });

  const previousState = usePrevious(state);

  React.useLayoutEffect(() => {
    if (previousState) {
      if (state.matches("closed->opened") && previousState.matches("closed")) {
        const lastImageRect = modalImageRef.current.getBoundingClientRect();
        applyStyles(portalImageRef.current, {
          top: lastImageRect.top + "px",
          left: lastImageRect.left + "px",
          width: lastImageRect.width + "px",
          height: lastImageRect.height + "px"
        });

        const duration = getDuration();

        const firstImageRect = gridImagesRef.current[
          chosenItemId
        ].current.getBoundingClientRect();

        console.log("last:", lastImageRect);

        const animation = performLastInvertPlay({
          element: portalImageRef.current,
          first: firstImageRect,
          last: lastImageRect,
          duration: duration
        });
        animation.onfinish = () => send("FINISHED_SLIDE_IN_ANIMATION");
        imageAnimationRef.current = animation;

        const lastModalContentRect = modalContentRef.current.getBoundingClientRect();

        applyStyles(portalModalContentRef.current, {
          top: lastModalContentRect.top + "px",
          left: lastModalContentRect.left + "px",
          width: lastModalContentRect.width + "px",
          height: lastModalContentRect.height + "px"
        });

        modalContentAnimationRef.current = performLastInvertPlay({
          element: portalModalContentRef.current,
          first: firstImageRect,
          last: lastModalContentRect,
          duration: duration
        });

        modalOverlayAnimationRef.current = modalOverlayRef.current.animate(
          [
            {
              opacity: 0
            },
            { opacity: 1 }
          ],
          {
            duration: duration,
            easing: "ease-in-out",
            fill: "both"
          }
        );
      } else if (
        state.matches("opened->closed") &&
        previousState.matches("closed->opened")
      ) {
        imageAnimationRef.current.onfinish = () =>
          send("FINISHED_SLIDE_OUT_ANIMATION");
        imageAnimationRef.current.reverse();

        modalOverlayAnimationRef.current.reverse();
        modalContentAnimationRef.current.reverse();
      } else if (
        state.matches("opened->closed") &&
        previousState.matches("opened")
      ) {
        const gridImageRect = gridImagesRef.current[
          chosenItemId
        ].current.getBoundingClientRect();
        applyStyles(portalImageRef.current, {
          top: gridImageRect.top + "px",
          left: gridImageRect.left + "px",
          width: gridImageRect.width + "px",
          height: gridImageRect.height + "px"
        });
        const modalImageRect = modalImageRef.current.getBoundingClientRect();
        const duration = getDuration();
        const animation = performLastInvertPlay({
          element: portalImageRef.current,
          first: modalImageRect,
          last: gridImageRect,
          duration: duration
        });
        animation.onfinish = () => send("FINISHED_SLIDE_OUT_ANIMATION");

        applyStyles(portalModalContentRef.current, {
          top: gridImageRect.top + "px",
          left: gridImageRect.left + "px",
          width: gridImageRect.width + "px",
          height: gridImageRect.height + "px"
        });

        performLastInvertPlayWithBorderRadius({
          element: portalModalContentRef.current,
          first: modalContentRef.current.getBoundingClientRect(),
          last: gridImageRect,
          duration: duration
        });

        modalOverlayRef.current.animate(
          [
            {
              opacity: 1
            },
            { opacity: 0 }
          ],
          {
            duration: duration,
            easing: "ease-in-out",
            fill: "both"
          }
        );
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

  const isOpeningModal = state.matches("closed->opened");

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
    state.matches("closed->opened") || state.matches("opened->closed");

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
              <Link to={`/details/${itemId}`} key={itemId}>
                <div className="image-container">
                  <img
                    key={itemId}
                    ref={gridImagesRef.current[itemId]}
                    className="image"
                    src={imageSrc}
                    alt={imageDescription}
                    onClick={event => {
                      event.preventDefault(); // prevent default navigation
                      if (state.matches("closed")) {
                        send("OPEN_MODAL");
                        setExtendedState(previous => ({
                          ...previous,
                          chosenItemId: itemId
                        }));
                      }
                    }}
                  />
                </div>
              </Link>
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
            modalContentRef={modalContentRef}
          />
        </ModalPortal>
        <TransitionElementPortal>
          {shouldDisplayPortalImage ? (
            <>
              <img
                className="image"
                ref={portalImageRef}
                src={items[chosenItemId].image.src}
                style={{ position: "fixed", zIndex: 1001 }} // zIndex must be greater than `portal-modal-content`
                alt=""
              />
              <div
                className="portal-modal-content"
                ref={portalModalContentRef}
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
