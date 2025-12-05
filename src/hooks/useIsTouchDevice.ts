import { useEffect, useState } from "react";

const useIsTouchDevice = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check for 'ontouchstart' in window for basic touch detection
    const hasOntouchstart = "ontouchstart" in window;

    // Use media queries for more advanced detection
    const mediaQueryList = window.matchMedia("(any-pointer: coarse) and (any-hover: none)");

    const updateTouchDeviceStatus = () => {
      // If 'ontouchstart' exists or the media query indicates a touch device
      setIsTouchDevice(hasOntouchstart || mediaQueryList.matches);
    };

    // Initial check
    updateTouchDeviceStatus();

    // Listen for changes in media query (e.g., if a device changes orientation or input method)
    mediaQueryList.addListener(updateTouchDeviceStatus);

    // Clean up event listener on unmount
    return () => {
      mediaQueryList.removeListener(updateTouchDeviceStatus);
    };
  }, []);

  return isTouchDevice;
};

export default useIsTouchDevice;
