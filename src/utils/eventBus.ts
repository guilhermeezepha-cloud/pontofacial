type Listener = (payload?: any) => void;

const listeners: Record<string, Set<Listener>> = {};

export const on = (event: string, fn: Listener) => {
  if (!listeners[event]) listeners[event] = new Set();
  listeners[event].add(fn);
  return () => listeners[event]?.delete(fn);
};

export const emit = (event: string, payload?: any) => {
  listeners[event]?.forEach(fn => {
    try {
      fn(payload);
    } catch {}
  });
};
