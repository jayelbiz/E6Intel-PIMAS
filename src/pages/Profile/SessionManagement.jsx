import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../services/toast';

const SessionManagement = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { auth, user } = useAuth();
  const { ToastComponent, showSuccess, showError } = useToast();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const { sessions, error } = await auth.getActiveSessions();
      if (error) throw error;
      setSessions(sessions);
    } catch (error) {
      showError('Error', 'Failed to load sessions');
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTerminateSession = async (sessionId) => {
    try {
      const { error } = await auth.terminateSession(sessionId);
      if (error) throw error;
      showSuccess('Success', 'Session terminated');
      loadSessions();
    } catch (error) {
      showError('Error', 'Failed to terminate session');
      console.error('Error terminating session:', error);
    }
  };

  const handleTerminateAllSessions = async () => {
    try {
      const { error } = await auth.terminateAllSessions(user.id);
      if (error) throw error;
      showSuccess('Success', 'All sessions terminated');
      // User will be redirected to login due to global sign out
    } catch (error) {
      showError('Error', 'Failed to terminate all sessions');
      console.error('Error terminating all sessions:', error);
    }
  };

  const formatDate = (value) => {
    return new Date(value).toLocaleString();
  };

  const actionTemplate = (rowData) => {
    const isCurrentSession = rowData.session_id === user?.session?.id;
    return (
      <Button
        icon="pi pi-times"
        className="p-button-rounded p-button-danger p-button-text"
        onClick={() => handleTerminateSession(rowData.session_id)}
        disabled={isCurrentSession}
        tooltip={isCurrentSession ? 'Current session' : 'Terminate session'}
      />
    );
  };

  return (
    <div className="p-4">
      <ToastComponent />
      <ConfirmDialog />
      
      <Card title="Active Sessions" className="mb-4">
        <div className="mb-4">
          <Button
            label="Terminate All Other Sessions"
            icon="pi pi-power-off"
            severity="danger"
            onClick={() => setShowConfirm(true)}
          />
        </div>

        <DataTable
          value={sessions}
          loading={loading}
          paginator
          rows={10}
          rowsPerPageOptions={[10, 25, 50]}
          emptyMessage="No active sessions found"
        >
          <Column
            field="user_agent"
            header="Device"
            body={(rowData) => {
              const ua = rowData.user_agent;
              const isCurrentSession = rowData.session_id === user?.session?.id;
              return (
                <div>
                  <span>{ua}</span>
                  {isCurrentSession && (
                    <span className="ml-2 text-sm bg-primary text-white px-2 py-1 rounded">
                      Current Session
                    </span>
                  )}
                </div>
              );
            }}
          />
          <Column
            field="ip_address"
            header="IP Address"
          />
          <Column
            field="last_active"
            header="Last Active"
            body={(rowData) => formatDate(rowData.last_active)}
          />
          <Column
            field="created_at"
            header="Started"
            body={(rowData) => formatDate(rowData.created_at)}
          />
          <Column
            body={actionTemplate}
            style={{ width: '5rem' }}
          />
        </DataTable>
      </Card>

      <ConfirmDialog
        visible={showConfirm}
        onHide={() => setShowConfirm(false)}
        message="Are you sure you want to terminate all other sessions? You'll remain logged in on this device only."
        header="Confirm Session Termination"
        icon="pi pi-exclamation-triangle"
        accept={handleTerminateAllSessions}
        reject={() => setShowConfirm(false)}
      />
    </div>
  );
};

export default SessionManagement;
