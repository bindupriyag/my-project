import { useCallback, useEffect, useState } from 'react';

import { createUser, deleteUser, listUsers, updateUser } from '../api/usersApi';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(async (payload) => {
    setLoading(true);
    setError('');
    try {
      const created = await createUser(payload);
      setUsers((prev) => [created, ...prev]);
      return created;
    } catch (e) {
      const message = e?.message || 'Failed to create user';
      setError(message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id, payload) => {
    setLoading(true);
    setError('');
    try {
      const updated = await updateUser(id, payload);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
      return updated;
    } catch (e) {
      const message = e?.message || 'Failed to update user';
      setError(message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id) => {
    setLoading(true);
    setError('');
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      const message = e?.message || 'Failed to delete user';
      setError(message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    users,
    loading,
    error,
    setError,
    refresh,
    add,
    update,
    remove,
  };
}
