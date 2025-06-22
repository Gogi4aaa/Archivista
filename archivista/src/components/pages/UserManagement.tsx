import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaUserEdit, FaTrash } from 'react-icons/fa';
import EditUserModal from '../modals/EditUserModal';
import DeleteUserModal from '../modals/DeleteUserModal';
import { userService } from '../../services/userService';
import { UserResponse, CreateUserRequest, UpdateUserRequest } from '../../types/user';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAuthError = (error: any) => {
    if (error.response?.status === 401) {
      toast.error('Your session has expired. Please log in again.');
      logout();
      navigate('/login');
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.');
      navigate('/');
    }
  };

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const fetchedUsers = await userService.getAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      handleAuthError(error);
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (user: UserResponse) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (user: UserResponse) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsEditModalOpen(true);
  };

  const handleSaveUser = async (userData: CreateUserRequest | UpdateUserRequest) => {
    try {
      if (selectedUser) {
        // Update existing user
        const updatedUser = await userService.updateUser(selectedUser.id, userData as UpdateUserRequest);
        setUsers(users.map(user => 
          user.id === updatedUser.id ? updatedUser : user
        ));
        toast.success('User updated successfully!');
      } else {
        // Add new user
        const createdUser = await userService.createUser(userData as CreateUserRequest);
        setUsers([...users, createdUser]);
        toast.success('User added successfully!');
      }
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error saving user:', error);
      handleAuthError(error);
      toast.error(selectedUser ? 'Failed to update user' : 'Failed to create user');
    }
  };

  const handleConfirmDelete = async (userId: string) => {
    try {
      await userService.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      setIsDeleteModalOpen(false);
      toast.success('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      handleAuthError(error);
      toast.error('Failed to delete user');
    }
  };

  const handleUpdateStatus = async (userId: string, isActive: boolean) => {
    try {
      await userService.updateUserStatus(userId, isActive);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isActive } : user
      ));
      toast.success('User status updated successfully!');
    } catch (error) {
      console.error('Error updating user status:', error);
      handleAuthError(error);
      toast.error('Failed to update user status');
    }
  };

  if (isLoading) {
    return (
      <div className="content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="content">
      <div style={{ width: '100%', maxWidth: '1200px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 600 }}>User Management</h1>
          <button 
            className="button" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={handleAddUser}
          >
            <FaUserPlus />
            Add New User
          </button>
        </div>

        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Last Login</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{`${user.firstName} ${user.lastName}`}</td>
                  <td>{user.email}</td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: user.role === 'admin' ? 'rgba(63, 203, 243, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                      color: user.role === 'admin' ? '#3fcbf3' : '#fff',
                      fontSize: '0.9rem'
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</td>
                  <td>
                    <span 
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: user.isActive ? 'rgba(75, 222, 151, 0.2)' : 'rgba(255, 86, 86, 0.2)',
                        color: user.isActive ? '#4bde97' : '#ff5656',
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleUpdateStatus(user.id, !user.isActive)}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="button small" 
                        style={{ padding: '6px' }}
                        onClick={() => handleEditUser(user)}
                      >
                        <FaUserEdit />
                      </button>
                      <button 
                        className="button small secondary" 
                        style={{ padding: '6px' }}
                        onClick={() => handleDeleteUser(user)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EditUserModal
        user={selectedUser}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveUser}
      />

      <DeleteUserModal
        user={selectedUser}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => selectedUser && handleConfirmDelete(selectedUser.id)}
      />
    </div>
  );
};

export default UserManagement; 