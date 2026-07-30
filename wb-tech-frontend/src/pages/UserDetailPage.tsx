import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadUserById, clearCurrentUser } from '../store/usersSlice';
import ErrorBanner from '../components/ErrorBanner';

const InfoRow = ({ label, value }: { label: string; value?: string }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body1">{value || '—'}</Typography>
  </Box>
);

const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentUser, currentUserLoading, currentUserError } = useAppSelector(
    (state) => state.users
  );

  useEffect(() => {
    if (id) {
      dispatch(loadUserById(id));
    }
    return () => {
      dispatch(clearCurrentUser());
    };
  }, [dispatch, id]);

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 2 }}>
        Назад к списку
      </Button>

      <ErrorBanner message={currentUserError} />

      {currentUserLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : currentUser ? (
        <Paper sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Avatar src={currentUser.avatar} sx={{ width: 72, height: 72 }}>
              {currentUser.name?.[0]?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h5">{currentUser.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {currentUser.position}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
            }}
          >
            <InfoRow label="Email" value={currentUser.email} />
            <InfoRow label="Телефон" value={currentUser.phone} />
            <InfoRow label="Город" value={currentUser.city} />
            <InfoRow label="ID" value={currentUser.id} />
          </Box>
        </Paper>
      ) : (
        !currentUserError && <Typography>Пользователь не найден</Typography>
      )}
    </Container>
  );
};

export default UserDetailPage;
