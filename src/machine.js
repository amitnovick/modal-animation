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
        CLOSE_MODAL: {
          target: "opened->closed",
          actions: "updatePropertiesUsingGridImage"
        }
      }
    },
    opened: {
      on: {
        CLOSE_MODAL: {
          target: "opened->closed",
          actions: "updatePropertiesUsingGridImage"
        }
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
