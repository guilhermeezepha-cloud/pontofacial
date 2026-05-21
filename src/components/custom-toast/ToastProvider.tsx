import React, {
  createContext,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';

import CustomToast from './';
import {registerToast, unregisterToast} from './ToastBus';

interface ToastContextType {
  showToast: (content: React.ReactNode | null) => void;
  hideToast: () => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined,
);

export const ToastProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [toastContent, setToastContent] = useState<React.ReactNode | null>(
    null,
  );

  const showToast = useCallback(
    (content: React.ReactNode | null) => setToastContent(content),
    [],
  );
  const hideToast = useCallback(() => setToastContent(null), []);

  useLayoutEffect(() => {
    registerToast(showToast, hideToast);
    return unregisterToast;
  }, [showToast, hideToast]);

  const value = useMemo(() => ({showToast, hideToast}), [showToast, hideToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toastContent && (
        <CustomToast onHide={() => setToastContent(null)}>
          {toastContent}
        </CustomToast>
      )}
    </ToastContext.Provider>
  );
};
