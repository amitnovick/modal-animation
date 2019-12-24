import React from "react";
import { createPortal } from "react-dom";

function usePortal() {
  const portalElRef = React.useRef(document.createElement("div"));

  React.useEffect(() => {
    document.body.appendChild(portalElRef.current);

    return () => {
      if (portalElRef.current) {
        document.body.removeChild(portalElRef.current);
      }
    };
  }, [portalElRef]);

  const Portal = React.useCallback(
    ({ children }) => {
      if (portalElRef.current != null)
        return createPortal(children, portalElRef.current);
      return null;
    },
    [portalElRef]
  );

  return [Portal, portalElRef];
}

export default usePortal;
