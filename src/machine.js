import { Machine } from "xstate";

const machine = Machine({
  initial: "closed",
  states: {
    closed: {
      on: {
        OPEN_MODAL: "opened"
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
