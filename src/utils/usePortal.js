import React from "react";
import { createPortal } from "react-dom";

function usePortal() {
  const portalRef = React.useRef(document.createElement("div"));

  const elToMountTo = React.useMemo(() => {
    return document.body;
  }, []);

  React.useEffect(() => {
    elToMountTo.appendChild(portalRef.current);

    return () => {
      if (portalRef.current) {
        elToMountTo.removeChild(portalRef.current);
      }
    };
  }, [portalRef, elToMountTo]);

  const Portal = React.useCallback(
    ({ children }) => {
      if (portalRef.current != null)
        return createPortal(children, portalRef.current);
      return null;
    },
    [portalRef]
  );

  return Portal;
}

export default usePortal;
