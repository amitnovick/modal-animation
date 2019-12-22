import React from "react";
import { createPortal } from "react-dom";

function usePortal() {
  const portal = React.useRef(document.createElement("div"));

  const elToMountTo = React.useMemo(() => {
    return document.body;
  }, []);

  React.useEffect(() => {
    elToMountTo.appendChild(portal.current);

    return () => document.removeChild(portal.current);
  }, [portal, elToMountTo]);

  const Portal = React.useCallback(
    ({ children }) => {
      if (portal.current != null) return createPortal(children, portal.current);
      return null;
    },
    [portal]
  );

  return Portal;
}

export default usePortal;
