import Alert from '@mui/material/Alert';

interface ErrorBannerProps {
  message: string | null;
  onClose?: () => void;
}

const ErrorBanner = ({ message, onClose }: ErrorBannerProps) => {
  if (!message) return null;

  return (
    <Alert severity="error" onClose={onClose} sx={{ mb: 2 }}>
      {message}
    </Alert>
  );
};

export default ErrorBanner;
