import { Machine } from "xstate";

const machine = Machine({
  initial: "closed",
  id: "modal-machine",
  states: {
    closed: {
      on: {
        OPEN_MODAL: "opening"
      }
    },
    opening: {
      on: {
        FINISHED_SLIDE_IN_ANIMATION: "opened",
        CLOSE_MODAL: "closing"
      }
    },
    opened: {
      on: {
        CLOSE_MODAL: "closing"
      },
      initial: "controlsFadingIn",
      states: {
        controlsFadingIn: {
          exit: "cancelOpacityAnimation",
          on: {
            FINISH_OPACITY_ANIMATION: "controlsSettled"
          }
        },
        controlsSettled: {}
      }
    },
    closing: {
      on: {
        FINISHED_SLIDE_OUT_ANIMATION: "closed"
      }
    }
  }
});

export default machine;
