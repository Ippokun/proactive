// components/Toast.tsx
import React, { useEffect, useState } from 'react';
import styles from './style/Toast.module.css';

interface ToastProps {
  message: string;
  duration?: number; 
  onClose: () => void; 
}

const Toast: React.FC<ToastProps> = ({ message, duration = 3000, onClose }) => {
  const [showToast, setShowToast] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(false);
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    showToast && (
      <div className={styles.toast}>
        <p>{message}</p>
      </div>
    )
  );
};

export default Toast;
