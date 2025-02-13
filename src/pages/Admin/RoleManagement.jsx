import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../services/toast';
import { supabase } from '../../config/supabase';

const ROLES = ['admin', 'analyst', 'editor', 'viewer'];

const RoleManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const { auth, user } = useAuth();
  const { ToastComponent, showSuccess, showError } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Get all users
      const { data: { users: allUsers }, error: usersError } = await supabase.auth.admin.listUsers();
      if (usersError) throw usersError;

      // Get roles for all users
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
      if (rolesError) throw rolesError;

      // Merge user data with roles
      const usersWithRoles = allUsers.map(user => ({
        ...user,
        roles: roles.filter(r => r.user_id === user.id).map(r => r.role)
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      showError('Error', 'Failed to load users');
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const { error } = await auth.assignRole(userId, newRole);
      if (error) throw error;
      showSuccess('Success', 'Role updated successfully');
      loadUsers();
    } catch (error) {
      showError('Error', 'Failed to update role');
      console.error('Error updating role:', error);
    }
  };

  const rolesTemplate = (rowData) => {
    return rowData.roles?.map(role => (
      <Tag
        key={role}
        value={role}
        severity={
          role === 'admin' ? 'danger' :
          role === 'editor' ? 'warning' :
          role === 'analyst' ? 'info' :
          'success'
        }
        className="mr-1"
      />
    ));
  };

  const actionTemplate = (rowData) => {
    const isCurrentUser = rowData.id === user.id;
    const hasAdminRole = rowData.roles?.includes('admin');

    return (
      <div className="flex gap-2">
        <Dropdown
          value={selectedRole}
          options={ROLES}
          onChange={(e) => {
            setSelectedRole(e.value);
            setSelectedUser(rowData);
            setShowConfirm(true);
          }}
          placeholder="Assign Role"
          disabled={isCurrentUser || (hasAdminRole && !user.roles?.includes('admin'))}
        />
      </div>
    );
  };

  const confirmRoleChange = () => {
    if (selectedUser && selectedRole) {
      handleRoleChange(selectedUser.id, selectedRole);
      setSelectedUser(null);
      setSelectedRole(null);
      setShowConfirm(false);
    }
  };

  return (
    <div className="p-4">
      <ToastComponent />
      
      <Card title="User Role Management" className="mb-4">
        <DataTable
          value={users}
          loading={loading}
          paginator
          rows={10}
          rowsPerPageOptions={[10, 25, 50]}
          emptyMessage="No users found"
        >
          <Column
            field="email"
            header="Email"
            sortable
          />
          <Column
            field="roles"
            header="Current Roles"
            body={rolesTemplate}
          />
          <Column
            field="created_at"
            header="Joined"
            body={(rowData) => new Date(rowData.created_at).toLocaleDateString()}
            sortable
          />
          <Column
            field="last_sign_in_at"
            header="Last Active"
            body={(rowData) => rowData.last_sign_in_at ? new Date(rowData.last_sign_in_at).toLocaleDateString() : 'Never'}
            sortable
          />
          <Column
            header="Actions"
            body={actionTemplate}
            style={{ width: '15rem' }}
          />
        </DataTable>
      </Card>

      <ConfirmDialog
        visible={showConfirm}
        onHide={() => {
          setShowConfirm(false);
          setSelectedUser(null);
          setSelectedRole(null);
        }}
        message={`Are you sure you want to assign the role "${selectedRole}" to ${selectedUser?.email}?`}
        header="Confirm Role Change"
        icon="pi pi-exclamation-triangle"
        accept={confirmRoleChange}
        reject={() => {
          setShowConfirm(false);
          setSelectedUser(null);
          setSelectedRole(null);
        }}
      />
    </div>
  );
};

export default RoleManagement;
