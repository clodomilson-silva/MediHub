import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  
  // Menus baseados no tipo de usuário
  const getMenuItems = () => {
    const baseItems = [
      { path: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['admin', 'medico', 'paciente'] },
    ];

    const adminMedicoItems = [
      { path: '/pacientes', label: 'Pacientes', icon: '👥', roles: ['admin', 'medico'] },
      { path: '/atendimentos', label: 'Atendimentos', icon: '🩺', roles: ['admin', 'medico'] },
      { path: '/receitas', label: 'Receitas', icon: '📋', roles: ['admin', 'medico'] },
      { path: '/exames', label: 'Exames', icon: '🔬', roles: ['admin', 'medico'] },
    ];

    const pacienteItems = [
      { path: '/meu-prontuario', label: 'Meu Prontuário', icon: '📄', roles: ['paciente'] },
      { path: '/minhas-consultas', label: 'Consultas', icon: '🩺', roles: ['paciente'] },
      { path: '/meus-exames', label: 'Exames', icon: '🔬', roles: ['paciente'] },
      { path: '/minhas-receitas', label: 'Receitas', icon: '💊', roles: ['paciente'] },
    ];

    const adminItems = [
      { path: '/unidades', label: 'Unidades', icon: '🏥', roles: ['admin'] },
      { path: '/usuarios', label: 'Usuários', icon: '👤', roles: ['admin'] },
    ];

    return [...baseItems, ...adminMedicoItems, ...pacienteItems, ...adminItems]
      .filter(item => item.roles.includes(user?.tipo));
  };

  const menuItems = getMenuItems();
  
  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#006F6A',
      height: '100vh',
      padding: '24px 16px',
      overflowY: 'auto'
    }}>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path}
              to={item.path} 
              style={{ 
                textDecoration: 'none', 
                color: 'white',
                padding: '12px 16px',
                borderRadius: '4px',
                backgroundColor: isActive ? '#009688' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontWeight: isActive ? '600' : '400',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(0, 150, 136, 0.3)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
