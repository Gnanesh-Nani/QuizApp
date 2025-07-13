import { useAuth } from '../contexts/AuthContext';

const DebugUser = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Not authenticated</div>;
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px', 
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999
    }}>
      <div><strong>User Debug:</strong></div>
      <div>ID: {user?.id}</div>
      <div>Username: {user?.username}</div>
      <div>Email: {user?.email}</div>
      <div>Role: {user?.role || 'undefined'}</div>
      <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
    </div>
  );
};

export default DebugUser; 