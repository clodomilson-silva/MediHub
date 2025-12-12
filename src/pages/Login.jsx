import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro("");
    
    // Simulação de banco de dados - posteriormente conectar com API real
    const usuarios = [
      { id: 1, email: "admin@medihub.com", senha: "admin123", tipo: "admin", nome: "Administrador" },
      { id: 2, email: "medico@medihub.com", senha: "medico123", tipo: "medico", nome: "Dr. João Silva", crm: "12345-SP" },
      { id: 3, email: "paciente@medihub.com", senha: "paciente123", tipo: "paciente", nome: "Maria Santos", cpf: "123.456.789-00" },
    ];

    const usuario = usuarios.find(u => u.email === email && u.senha === senha);

    if (usuario) {
      const userSemSenha = {
        id: usuario.id,
        email: usuario.email,
        tipo: usuario.tipo,
        nome: usuario.nome,
        ...(usuario.crm && { crm: usuario.crm }),
        ...(usuario.cpf && { cpf: usuario.cpf })
      };
      login(userSemSenha);
      navigate("/dashboard");
    } else {
      setErro("Email ou senha incorretos");
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#E6F9FF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '48px',
        borderRadius: '8px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#006F6A',
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          Login - MediHub
        </h2>

        <form onSubmit={handleSubmit}>
          {erro && (
            <div style={{
              backgroundColor: '#ffebee',
              color: '#c62828',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {erro}
            </div>
          )}

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#5A5A5A',
              fontWeight: '600'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #D9D9D9',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              placeholder="seu@email.com"
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#5A5A5A',
              fontWeight: '600'
            }}>
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #D9D9D9',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: '#009688',
              color: 'white',
              padding: '14px',
              borderRadius: '4px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '16px'
            }}
          >
            Entrar
          </button>

          <div style={{ textAlign: 'center' }}>
            <Link 
              to="/cadastro"
              style={{
                color: '#009688',
                textDecoration: 'none'
              }}
            >
              Não tem conta? Cadastre-se
            </Link>
          </div>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Link 
              to="/"
              style={{
                color: '#5A5A5A',
                textDecoration: 'none',
                fontSize: '14px'
              }}
            >
              ← Voltar para Home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
