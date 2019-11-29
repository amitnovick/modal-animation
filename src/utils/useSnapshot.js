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
        componentDidUpdate(props, state, snapshot) {
          myArgs.current.layoutEffect(snapshot);
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
