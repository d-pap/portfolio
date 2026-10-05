type HoverIntentOptions<T> = {
  open: (id: T) => void;
  close: () => void;
  isOpen: () => boolean;
  openDelay?: number;
  closeDelay?: number;
};

/** A short delay before opening, a grace period before closing, instant switching once open. */
export function createHoverIntent<T>({ open, close, isOpen, openDelay = 90, closeDelay = 220 }: HoverIntentOptions<T>) {
  let openTimer: ReturnType<typeof setTimeout> | undefined;
  let closeTimer: ReturnType<typeof setTimeout> | undefined;
  const clear = () => {
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
  };
  return {
    enter(id: T) {
      clear();
      if (isOpen()) open(id);
      else openTimer = setTimeout(() => open(id), openDelay);
    },
    leave() {
      clear();
      closeTimer = setTimeout(close, closeDelay);
    },
    now(id: T) {
      clear();
      open(id);
    },
    shut() {
      clear();
      close();
    },
    dispose: clear,
  };
}
