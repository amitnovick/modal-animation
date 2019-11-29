import { Machine } from "xstate";

const machine = Machine({
  initial: "closed",
  states: {
    closed: {
      on: {
        OPEN_MODAL: "beforeOpened"
      }
    },
    beforeOpened: {
      on: {
        MODAL_COMPLETED_OPENING: "opened"
      }
    },
    opened: {
      initial: "entering",
      states: {
        entering: {},
        settled: {}
      },
      on: {
        CLOSE_MODAL: "closed"
      }
    }
  }
});

export default machine;
