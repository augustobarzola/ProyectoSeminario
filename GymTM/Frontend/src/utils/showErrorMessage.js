import { toast } from 'react-hot-toast';

const showErrorMessage = (defaultMessage, error) => {
  const mensaje = (error?.response?.data?.message || error?.response?.data?.error) 
    ? error.response.data.message || error.response.data.error 
    : '';
  
  toast.error(`${defaultMessage}. ${mensaje}`);
};

export default showErrorMessage;