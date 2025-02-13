import { useRef } from 'react';
import { Toast } from 'primereact/toast';

export const useToast = () => {
  const toast = useRef(null);

  const showSuccess = (summary, detail = '') => {
    toast.current.show({
      severity: 'success',
      summary: summary,
      detail: detail,
      life: 3000
    });
  };

  const showError = (summary, detail = '') => {
    toast.current.show({
      severity: 'error',
      summary: summary,
      detail: detail,
      life: 5000
    });
  };

  const showWarning = (summary, detail = '') => {
    toast.current.show({
      severity: 'warn',
      summary: summary,
      detail: detail,
      life: 4000
    });
  };

  const showInfo = (summary, detail = '') => {
    toast.current.show({
      severity: 'info',
      summary: summary,
      detail: detail,
      life: 3000
    });
  };

  const ToastComponent = () => <Toast ref={toast} position="top-right" />;

  return {
    ToastComponent,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};
