import { Machine } from "xstate";

const machine = Machine({
  initial: "closed",
  id: "modal-machine",
  states: {
    closed: {
      on: {
        OPEN_MODAL: "closed->opened"
      }
    },
    "closed->opened": {
      on: {
        FINISHED_SLIDE_IN_ANIMATION: "opened",
        CLOSE_MODAL: "opened->closed"
      }
    },
    opened: {
      on: {
        CLOSE_MODAL: "opened->closed"
      },
      initial: "transparentControls",
      states: {
        transparentControls: {
          exit: ["removeImageElement", "cancelOpacityAnimation"],
          on: {
            FINISH_OPACITY_ANIMATION: "opaqueControls"
          }
        },
        opaqueControls: {}
      }
    },
    "opened->closed": {
      on: {
        FINISHED_SLIDE_OUT_ANIMATION: "closed"
      }
    }
  }
});

export default machine;
