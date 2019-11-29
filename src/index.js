import React from "react";
import ReactDOM from "react-dom";
import "normalize.css";
import "./index.scss";
import ItemModal from "./ItemModal/ItemModal";
import useSnapshot from "./utils/useSnapshot";
import machine from "./machine";
import { useMachine } from "@xstate/react";

const initialItems = {
  FvVO3o6Gw8g: {
    imageUrl:
      "https://images.unsplash.com/photo-1574797914072-46cc7da9b5aa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
    imageDescription: "brown grass photo",
    artistName: "Jessica Fadel",
    artistId: "@jessicalfadel",
    artistImage:
      "https://images.unsplash.com/photo-1574797914072-46cc7da9b5aa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80"
  },
  sVqrUN9RZIo: {
    imageUrl:
      "https://images.unsplash.com/photo-1488810050923-3897e8aa9037?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
    imageDescription: "snow covered brown and gray mountain photo",
    artistName: "MR WONG",
    artistId: "@mrwong",
    artistImage:
      "https://images.unsplash.com/profile-1493107212406-6bb991c88c50?dpr=2&auto=format&fit=crop&w=32&h=32&q=60&crop=faces&bg=fff"
  },
  "1AwGus3QVE4": {
    imageUrl:
      "https://images.unsplash.com/photo-1560331470-74c11f1c2ccc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",

    imageDescription: "selective focus photography of green grass photo",
    artistName: "Tisma Jrdl",
    artistId: "@tisma",
    artistImage:
      "https://images.unsplash.com/profile-fb-1487182403-063ac21af7d6.jpg?dpr=2&auto=format&fit=crop&w=32&h=32&q=60&crop=faces&bg=fff"
  },
  NDuPLKYRXQU: {
    imageUrl:
      "https://images.unsplash.com/photo-1431512284068-4c4002298068?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=752&q=80",
    imageDescription: "bird's-eye view of mountain rang photo",
    artistName: "Elena Prokofyeva",
    artistId: "@leni_eleni",
    artistImage:
      "https://images.unsplash.com/profile-1474569303338-12538796d50b?dpr=2&auto=format&fit=crop&w=32&h=32&q=60&crop=faces&bg=fff"
  },
  sMQiL_2v4vs: {
    imageUrl:
      "https://images.unsplash.com/photo-1453791052107-5c843da62d97?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",

    imageDescription: "large tree in middle of forest during daytime photo",
    artistName: "veeterzy",
    artistId: "@veeterzy",
    artistImage:
      "https://images.unsplash.com/profile-1506670759095-e8bab484cbc5?dpr=2&auto=format&fit=crop&w=32&h=32&q=60&crop=faces&bg=fff"
  },
  "01_igFr7hd4": {
    imageUrl:
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=840&q=80",
    imageDescription: "bird's eye photograph of green mountains photo",
    artistName: "Qingbao Meng",
    artistId: "@ideasboom",
    artistImage:
      "https://images.unsplash.com/profile-1536207867484-ee3f39fa0ee9?dpr=2&auto=format&fit=crop&w=32&h=32&q=60&crop=faces&bg=fff"
  },
  pQMM63GE7fo: {
    imageUrl:
      "https://images.unsplash.com/photo-1442850473887-0fb77cd0b337?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
    imageDescription:
      "landscape photo of waterfalls flowing into river during daytime photo",
    artistName: "Milada Vigerova",
    artistId: "@mili_vigerova",
    artistImage:
      "https://images.unsplash.com/profile-1478097671033-99cc86c22f38?dpr=2&auto=format&fit=crop&w=32&h=32&q=60&crop=faces&bg=fff"
  },
  "3Eqc3Ph4oRg": {
    imageUrl:
      "https://images.unsplash.com/photo-1529832393073-e362750f78b3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",

    imageDescription: "photo of clouds photo",
    artistName: "Dominik Dancs",
    artistId: "@dodancs",
    artistImage:
      "https://images.unsplash.com/profile-1547587995842-12c50c01581e?dpr=2&auto=format&fit=crop&w=32&h=32&q=60&crop=faces&bg=fff"
  },
  nKNm_75lH4g: {
    imageUrl:
      "https://images.unsplash.com/photo-1522684487319-f574cd5937cf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",

    imageDescription: "landscape photo of sand photo",
    artistName: "Hasan Almasi",
    artistId: "@hasanalmasi",
    artistImage:
      "https://images.unsplash.com/profile-1574743414193-d9280295ec96image?dpr=2&auto=format&fit=crop&w=32&h=32&q=60&crop=faces&bg=fff"
  }
};

function preloadImage(url) {
  return new Promise(resolve => {
    const image = new Image();
    image.src = url;
    image.onload = () => resolve(image);
  });
}

const App = () => {
  const [state, send] = useMachine(machine, { devTools: true });
  const [extendedState, setExtendedState] = React.useState({
    items: initialItems,
    chosenItemId: null,
    hasFinishedLoading: false
  });

  const gridImgageRef = React.useRef();
  const modalImageRef = React.useRef();

  const UseSnapshot = useSnapshot(
    {
      getSnapshot: ({ prevProps, props }) => {
        if (
          prevProps.shouldFlip !== props.shouldFlip &&
          state.matches("opened")
        ) {
          const firstImageRect = gridImgageRef.current.getBoundingClientRect();
          console.log("firstImageRect:", firstImageRect);
          return { firstImageRect };
        } else {
          return { firstImageRect: null };
        }
      },
      layoutEffect: ({ firstImageRect }) => {
        if (firstImageRect === null) {
          return;
        } else {
          console.log("pollo");

          console.log("modalImageRef.current:", modalImageRef.current);

          // const lastImageRect = modalImageRef.current.getBoundingClientRect();
          // const deltaX = firstImageRect.left - lastImageRect.left;
          // const deltaY = firstImageRect.top - lastImageRect.top;
          // const deltaW = firstImageRect.width / lastImageRect.width;
          // const deltaH = firstImageRect.height / lastImageRect.height;

          // const imageAnimation = gridImgageRef.current.animate(
          //   [
          //     {
          //       transformOrigin: "top left",
          //       transform: `
          //       scale(${deltaW}, ${deltaH})
          //       translate(${deltaX}, ${deltaY})
          //     `
          //     },
          //     { transformOrigin: "top left", transform: "none" }
          //   ],
          //   {
          //     // timing options
          //     duration: 600,
          //     easing: "ease-in-out",
          //     fill: "both"
          //   }
          // );

          // imageAnimation.onfinish = () => this.setState({});
        }
      }
    },
    []
  );

  const fetchImages = async () => {
    const preloadedImages = await Promise.all(
      Object.entries(extendedState.items).map(([itemId, { imageUrl }]) =>
        preloadImage(imageUrl).then(image => [itemId, image])
      )
    );

    const imagesByItemId = preloadedImages.reduce(
      (accumulated, [itemId, image]) => {
        return {
          ...accumulated,
          [itemId]: image
        };
      },
      {}
    );

    const itemsWithImages = Object.entries(extendedState.items).reduce(
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

    setExtendedState(prev => ({
      ...prev,
      items: itemsWithImages,
      hasFinishedLoading: true
    }));
  };

  React.useEffect(() => {
    fetchImages();
  }, []);

  const { items, chosenItemId, hasFinishedLoading } = extendedState;

  const isModalOpen = state.matches("opened");

  console.log("extendedState:", extendedState);

  console.log("state.value:", state.value);

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
              <UseSnapshot key={itemId} shouldFlip={isModalOpen}>
                <img
                  key={itemId}
                  ref={gridImgageRef}
                  className="image"
                  src={imageSrc}
                  alt={imageDescription}
                  onClick={() => {
                    send("OPEN_MODAL");
                    console.log("sent open modal");
                    setExtendedState(previous => ({
                      ...previous,
                      chosenItemId: itemId
                    }));
                  }}
                />
              </UseSnapshot>
            )
          )}
        </div>
        <ItemModal
          isModalOpen={isModalOpen}
          closeModal={() => {
            send("CLOSE_MODAL");
          }}
          modalImageRef={modalImageRef}
        />
      </>
    );
  }
};

if (module.hot) {
  module.hot.accept();
}

ReactDOM.render(<App />, document.getElementById("root"));
