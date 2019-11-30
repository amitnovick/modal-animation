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
      initial: "mountingModal",
      states: {
        mountingModal: {
          on: {
            MOUNTED_MODAL: {
              actions: "updatePropertiesUsingModalImage",
              target: "slidingIn"
            }
          }
        },
        slidingIn: {
          on: {
            FINISHED_SLIDE_IN_ANIMATION: "#modal-machine.opened"
          }
        }
      }
    },
    opened: {
      on: {
        CLOSE_MODAL: "opened->closed"
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
