import React from "react";

function useSnapshot({ getSnapshot, layoutEffect }) {
  const myArgs = React.useRef();
  myArgs.current = { getSnapshot, layoutEffect };

  const UseSnapshot = React.useMemo(
    () =>
      class UseSnapshot extends React.Component {
        getSnapshotBeforeUpdate(prevProps) {
          return myArgs.current.getSnapshot({ prevProps, props: this.props });
        }
        componentDidUpdate(prevProps, prevState, snapshot) {
          myArgs.current.layoutEffect({ prevProps, snapshot });
        }
        render() {
          return this.props.children;
        }
      },
    []
  );

  return UseSnapshot;
}

export default useSnapshot;
