import { toast } from 'react-toastify';

export const formatDate = (inputDate) => {
  // Add one day to compensate for timezone
  const date = new Date(inputDate);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0];
};

export const showToast = {
  success: (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  },
  error: (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
};