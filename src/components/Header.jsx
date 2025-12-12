import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getTipoLabel = (tipo) => {
    const labels = {
      admin: 'Administrador',
      medico: 'Médico',
      paciente: 'Paciente'
    };
    return labels[tipo] || tipo;
  };
  
  return (
    <header style={{ 
      width: '100%', 
      backgroundColor: '#009688', 
      padding: '16px 32px', 
      color: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>MediHub</h1>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '14px', fontWeight: '600' }}>{user?.nome}</div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>{getTipoLabel(user?.tipo)}</div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid white',
            padding: '6px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Sair
        </button>
      </div>
    </header>
  );
}
