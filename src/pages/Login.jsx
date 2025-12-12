import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    
    try {
      const response = await api.post('/auth/login', {
        email,
        senha
      });

      const { usuario, token } = response.data;

      // Salvar token no localStorage
      localStorage.setItem('token', token);

      // Fazer login no contexto com os dados do usuário
      login(usuario);
      
      navigate("/dashboard");
    } catch (error) {
      console.error('Erro no login:', error);
      setErro(error.response?.data?.error || "Erro ao fazer login. Tente novamente.");
    } finally {
      setCarregando(false);
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
            disabled={carregando}
            style={{
              width: '100%',
              backgroundColor: carregando ? '#ccc' : '#009688',
              color: 'white',
              padding: '14px',
              borderRadius: '4px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: carregando ? 'not-allowed' : 'pointer',
              marginBottom: '16px'
            }}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
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
