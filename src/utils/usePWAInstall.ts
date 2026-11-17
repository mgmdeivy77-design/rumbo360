import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

let cachedPrompt: BeforeInstallPromptEvent | null = null;
let cachedInstalled = false;
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

if (typeof window !== "undefined") {
  cachedInstalled =
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true;

  window.addEventListener("beforeinstallprompt", (e: Event) => {
    e.preventDefault();
    cachedPrompt = e as BeforeInstallPromptEvent;
    notifyListeners();
  });

  window.addEventListener("appinstalled", () => {
    cachedInstalled = true;
    cachedPrompt = null;
    notifyListeners();
  });
}

export function usePWAInstall() {
  const [, setTick] = useState(0);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const update = () => setTick((n) => n + 1);
    listeners.add(update);

    const ua = window.navigator.userAgent.toLowerCase();
    const isIOSDevice =
      /iphone|ipad|ipod/.test(ua) ||
      (window.navigator.platform === "MacIntel" &&
        window.navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);

    const mq = window.matchMedia("(display-mode: standalone)");
    const onModeChange = () => {
      if (mq.matches) {
        cachedInstalled = true;
        cachedPrompt = null;
        notifyListeners();
      }
    };
    mq.addEventListener?.("change", onModeChange);

    return () => {
      listeners.delete(update);
      mq.removeEventListener?.("change", onModeChange);
    };
  }, []);

  const install = async (): Promise<boolean> => {
    if (!cachedPrompt) return false;
    await cachedPrompt.prompt();
    const { outcome } = await cachedPrompt.userChoice;
    if (outcome === "accepted") {
      cachedInstalled = true;
      cachedPrompt = null;
      notifyListeners();
      return true;
    }
    return false;
  };

  return {
    isInstallable: Boolean(cachedPrompt),
    isInstalled: cachedInstalled,
    isIOS,
    install,
  };
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}
