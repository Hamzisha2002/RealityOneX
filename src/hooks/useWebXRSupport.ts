import { useEffect, useState } from 'react';

export const useWebXRSupport = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const checkSupport = async () => {
      try {
        const xr = navigator.xr;
        const supported = xr ? await xr.isSessionSupported('immersive-vr') : false;
        if (!cancelled) {
          setIsSupported(Boolean(supported));
        }
      } catch {
        if (!cancelled) {
          setIsSupported(false);
        }
      } finally {
        if (!cancelled) {
          setIsChecking(false);
        }
      }
    };

    void checkSupport();

    return () => {
      cancelled = true;
    };
  }, []);

  return { isChecking, isSupported };
};
