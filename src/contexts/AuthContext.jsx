/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Hook customizado para usar o contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}

// Componente Provider
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const savedUser = localStorage.getItem('medihub_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('medihub_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medihub_user');
  };

  const hasPermission = (action) => {
    if (!user) return false;

    const permissions = {
      admin: {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canViewAll: true,
      },
      medico: {
        canCreate: true,
        canEdit: true,
        canDelete: false,
        canViewAll: true,
      },
      paciente: {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canViewAll: false,
        canViewOwn: true,
      },
    };

    return permissions[user.tipo]?.[action] || false;
  };

  const value = {
    user,
    login,
    logout,
    hasPermission,
    isAuthenticated: !!user,
    isAdmin: user?.tipo === 'admin',
    isMedico: user?.tipo === 'medico',
    isPaciente: user?.tipo === 'paciente',
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#E6F9FF'
      }}>
        <div style={{ color: '#009688', fontSize: '24px' }}>Carregando...</div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
