import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadUsers, addUser, editUser, removeUser, setPage, clearFormError } from '../store/usersSlice';
import UserTable from '../components/UserTable';
import UserFormModal from '../components/UserFormModal';
import ErrorBanner from '../components/ErrorBanner';
import type { User, UserFormData } from '../types/user';

const UsersListPage = () => {
  const dispatch = useAppDispatch();
  const { items, totalCount, page, limit, loading, error, formLoading, formError } =
    useAppSelector((state) => state.users);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    dispatch(loadUsers({ page, limit }));
  }, [dispatch, page, limit]);

  const pageCount = Math.max(1, Math.ceil(totalCount / limit));

  const handleOpenCreate = () => {
    setEditingUser(null);
    dispatch(clearFormError());
    setModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    dispatch(clearFormError());
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async (data: UserFormData) => {
    if (editingUser) {
      const result = await dispatch(editUser({ id: editingUser.id, data }));
      if (editUser.fulfilled.match(result)) {
        setModalOpen(false);
      }
    } else {
      const result = await dispatch(addUser(data));
      if (addUser.fulfilled.match(result)) {
        setModalOpen(false);
        // после создания обновим список, чтобы увидеть нового пользователя
        dispatch(loadUsers({ page, limit }));
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      await dispatch(removeUser(userToDelete.id));
      setUserToDelete(null);
      dispatch(loadUsers({ page, limit }));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Пользователи
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          Добавить пользователя
        </Button>
      </Box>

      <ErrorBanner message={error} />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <UserTable users={items} onEdit={handleOpenEdit} onDelete={setUserToDelete} />

          {pageCount > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={pageCount}
                page={page}
                onChange={(_, value) => dispatch(setPage(value))}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      <UserFormModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={editingUser}
        loading={formLoading}
        error={formError}
      />

      <Dialog open={Boolean(userToDelete)} onClose={() => setUserToDelete(null)}>
        <DialogTitle>Удалить пользователя?</DialogTitle>
        <DialogContent>
          Вы уверены, что хотите удалить пользователя «{userToDelete?.name}»? Это действие
          необратимо.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserToDelete(null)}>Отмена</Button>
          <Button color="error" variant="contained" onClick={handleDeleteConfirm}>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UsersListPage;
