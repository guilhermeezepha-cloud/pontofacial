import {Middleware} from '@reduxjs/toolkit';

import React from 'react';

import BasicToast from '../../components/custom-toast/BasicToast';
import {showGlobalToast} from '../../components/custom-toast/ToastBus';

const TYPE_ERROR = '@@APP_GLOBAL_ERROR';
const TYPE_INFO = '@@APP_GLOBAL_INFO';
const TYPE_SUCCESS = '@@APP_GLOBAL_SUCCESS';

function toMessage(payload: unknown): string {
  if (!payload) return 'Ocorreu um erro.';
  if (typeof payload === 'string') return payload;

  // axios-friendly
  const msg =
    (payload as any)?.response?.data?.message ??
    (payload as any)?.response?.data?.error ??
    (payload as any)?.message ??
    (payload as any)?.error;
  if (typeof msg === 'string') return msg;

  try {
    return JSON.stringify(payload);
  } catch {
    return String(payload);
  }
}

// type guard para a action esperada
function isGlobalNotifyAction(
  action: unknown,
): action is {type: string; payload?: unknown; meta?: {toast?: boolean}} {
  return (
    !!action &&
    typeof (action as any).type === 'string' &&
    [TYPE_ERROR, TYPE_INFO, TYPE_SUCCESS].includes((action as any).type)
  );
}

export const globalToastMiddleware: Middleware = () => next => action => {
  if (isGlobalNotifyAction(action)) {
    // opcional: silenciar via meta.toast === false
    if (action.meta?.toast === false) return next(action);

    const msg = toMessage(action.payload);
    const type: 'error' | 'success' | 'processing' =
      action.type === TYPE_ERROR
        ? 'error'
        : action.type === TYPE_SUCCESS
        ? 'success'
        : 'processing';

    showGlobalToast(<BasicToast message={msg} type={type} />);
  }
  return next(action);
};
