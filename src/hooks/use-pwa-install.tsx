import { useState, useEffect } from "react";

export const usePWAInstall = () => {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is running in standalone mode (installed as PWA)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;
    
    setIsInstalled(isStandalone || isIOSStandalone);
  }, []);

  return isInstalled;
};
