import React from 'react';

type Show = (content: React.ReactNode | null) => void;
type Hide = () => void;

let showRef: Show | null = null;
let hideRef: Hide | null = null;

export function registerToast(show: Show, hide: Hide) {
  showRef = show;
  hideRef = hide;
}
export function unregisterToast() {
  showRef = null;
  hideRef = null;
}

export function showGlobalToast(node: React.ReactNode | null) {
  showRef?.(node);
}
export function hideGlobalToast() {
  hideRef?.();
}
