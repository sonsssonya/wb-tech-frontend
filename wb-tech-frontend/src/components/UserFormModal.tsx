import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import type { User, UserFormData } from '../types/user';
import ErrorBanner from './ErrorBanner';

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  initialData?: User | null;
  loading: boolean;
  error: string | null;
}

const emptyForm: UserFormData = {
  name: '',
  email: '',
  phone: '',
  city: '',
  position: '',
  avatar: '',
};

const UserFormModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading,
  error,
}: UserFormModalProps) => {
  const [formData, setFormData] = useState<UserFormData>(emptyForm);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setFormData(
        initialData
          ? {
              name: initialData.name,
              email: initialData.email,
              phone: initialData.phone,
              city: initialData.city,
              position: initialData.position,
              avatar: initialData.avatar || '',
            }
          : emptyForm
      );
      setValidationError(null);
    }
  }, [open, initialData]);

  const handleChange =
    (field: keyof UserFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      setValidationError('Поля "Имя" и "Email" обязательны для заполнения');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setValidationError('Введите корректный email');
      return;
    }
    setValidationError(null);
    onSubmit(formData);
  };

  const isEdit = Boolean(initialData);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? 'Редактировать пользователя' : 'Новый пользователь'}</DialogTitle>
      <DialogContent>
        <ErrorBanner message={validationError || error} />
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Имя"
            value={formData.name}
            onChange={handleChange('name')}
            fullWidth
            required
          />
          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            fullWidth
            required
          />
          <TextField
            label="Телефон"
            value={formData.phone}
            onChange={handleChange('phone')}
            fullWidth
          />
          <TextField
            label="Город"
            value={formData.city}
            onChange={handleChange('city')}
            fullWidth
          />
          <TextField
            label="Должность"
            value={formData.position}
            onChange={handleChange('position')}
            fullWidth
          />
          <TextField
            label="Ссылка на аватар (URL)"
            value={formData.avatar}
            onChange={handleChange('avatar')}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Отмена
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={22} /> : isEdit ? 'Сохранить' : 'Создать'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserFormModal;
