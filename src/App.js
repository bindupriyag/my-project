import * as React from 'react';
 
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import './App.css';
import ConfirmDialog from './components/ConfirmDialog';
import UserForm from './components/UserForm';
import UserTable from './components/UserTable';
import { useUsers } from './hooks/useUsers';

function App() {
  const { users, loading, error, setError, add, update, remove, refresh } = useUsers();

  const [editingUser, setEditingUser] = React.useState(null);
  const [deletingUser, setDeletingUser] = React.useState(null);
  const [toast, setToast] = React.useState({ open: false, message: '', severity: 'success' });

  const closeToast = () => setToast((prev) => ({ ...prev, open: false }));

  const handleCreate = async (payload) => {
    await add(payload);
    setToast({ open: true, message: 'User created', severity: 'success' });
  };

  const handleSaveEdit = async (payload) => {
    if (!editingUser) return;
    await update(editingUser.id, { ...editingUser, ...payload });
    setEditingUser(null);
    setToast({ open: true, message: 'User updated', severity: 'success' });
  };

  const confirmDelete = async () => {
    if (!deletingUser) return;
    await remove(deletingUser.id);
    setDeletingUser(null);
    setToast({ open: true, message: 'User deleted', severity: 'success' });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            User Management
          </Typography>
          <Button color="inherit" onClick={refresh} disabled={loading}>
            Refresh
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 3 }}>
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <UserForm mode="create" onSubmit={handleCreate} submitting={loading} />
        </Paper>

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Users
            </Typography>
            {loading ? <CircularProgress size={18} /> : null}
          </Box>

          {error ? (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              action={
                <IconButton size="small" aria-label="close" color="inherit" onClick={() => setError('')}>
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {error}
            </Alert>
          ) : null}

          <UserTable users={users} onEdit={setEditingUser} onDelete={setDeletingUser} />
        </Paper>
      </Container>

      <Dialog open={Boolean(editingUser)} onClose={() => setEditingUser(null)} maxWidth="md" fullWidth>
        <DialogContent>
          <UserForm
            mode="edit"
            value={editingUser}
            onCancel={() => setEditingUser(null)}
            onSubmit={handleSaveEdit}
            submitting={loading}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deletingUser)}
        title="Delete user?"
        description={
          deletingUser
            ? `This will permanently remove ${deletingUser.firstName || ''} ${deletingUser.lastName || ''}.`
            : ''
        }
        confirmText="Delete"
        onCancel={() => setDeletingUser(null)}
        onConfirm={confirmDelete}
      />

      <Snackbar open={toast.open} autoHideDuration={3000} onClose={closeToast}>
        <Alert onClose={closeToast} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
