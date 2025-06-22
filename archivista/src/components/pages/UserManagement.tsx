import React, { useState } from 'react';
import { FaUserPlus, FaUserEdit, FaTrash } from 'react-icons/fa';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  lastLogin: string;
  status: 'active' | 'inactive';
}

const UserManagement: React.FC = () => {
  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      lastLogin: '2024-03-20 14:30',
      status: 'active'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'user',
      lastLogin: '2024-03-19 09:15',
      status: 'active'
    }
  ]);

  return (
    <div className="content">
      <div style={{ width: '100%', maxWidth: '1200px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 600 }}>User Management</h1>
          <button className="button" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaUserPlus />
            Add New User
          </button>
        </div>

        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
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
                  <td>{user.name}</td>
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
                  <td>{user.lastLogin}</td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: user.status === 'active' ? 'rgba(75, 222, 151, 0.2)' : 'rgba(255, 86, 86, 0.2)',
                      color: user.status === 'active' ? '#4bde97' : '#ff5656',
                      fontSize: '0.9rem'
                    }}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="button small" style={{ padding: '6px' }}>
                        <FaUserEdit />
                      </button>
                      <button className="button small secondary" style={{ padding: '6px' }}>
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
    </div>
  );
};

export default UserManagement; 