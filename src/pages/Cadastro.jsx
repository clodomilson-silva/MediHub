import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Cadastro() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    tipoUsuario: "paciente",
    cpf: "",
    telefone: "",
    crm: "",
    coren: "",
    matricula: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.senha !== formData.confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    // Validação de campos profissionais obrigatórios
    if (formData.tipoUsuario === "medico" && !formData.crm.trim()) {
      alert("O número do CRM é obrigatório para médicos!");
      return;
    }

    if (formData.tipoUsuario === "enfermeiro" && !formData.coren.trim()) {
      alert("O número do COREN é obrigatório para enfermeiros!");
      return;
    }

    if (formData.tipoUsuario === "profissional" && !formData.matricula.trim()) {
      alert("A matrícula é obrigatória para profissionais de saúde!");
      return;
    }

    console.log("Cadastro:", formData);
    // Implementar cadastro real depois
    
    navigate("/login");
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#E6F9FF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '48px',
        borderRadius: '8px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '600px'
      }}>
        <h2 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#006F6A',
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          Cadastro - MediHub
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#5A5A5A',
              fontWeight: '600'
            }}>
              Tipo de Usuário
            </label>
            <select
              name="tipoUsuario"
              value={formData.tipoUsuario}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #D9D9D9',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            >
              <option value="paciente">Paciente</option>
              <option value="medico">Médico</option>
              <option value="enfermeiro">Enfermeiro</option>
              <option value="profissional">Profissional de Saúde</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#5A5A5A',
              fontWeight: '600'
            }}>
              Nome Completo
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #D9D9D9',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#5A5A5A',
                fontWeight: '600'
              }}>
                CPF
              </label>
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #D9D9D9',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#5A5A5A',
                fontWeight: '600'
              }}>
                Telefone
              </label>
              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #D9D9D9',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              />
            </div>
          </div>

          {/* Campo CRM - apenas para Médicos */}
          {formData.tipoUsuario === "medico" && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#5A5A5A',
                fontWeight: '600'
              }}>
                Número do CRM *
              </label>
              <input
                type="text"
                name="crm"
                value={formData.crm}
                onChange={handleChange}
                placeholder="Ex: CRM/SP 123456"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #D9D9D9',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              />
            </div>
          )}

          {/* Campo COREN - apenas para Enfermeiros */}
          {formData.tipoUsuario === "enfermeiro" && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#5A5A5A',
                fontWeight: '600'
              }}>
                Número do COREN *
              </label>
              <input
                type="text"
                name="coren"
                value={formData.coren}
                onChange={handleChange}
                placeholder="Ex: COREN/SP 123456"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #D9D9D9',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              />
            </div>
          )}

          {/* Campo Matrícula - apenas para outros Profissionais de Saúde */}
          {formData.tipoUsuario === "profissional" && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#5A5A5A',
                fontWeight: '600'
              }}>
                Matrícula Profissional *
              </label>
              <input
                type="text"
                name="matricula"
                value={formData.matricula}
                onChange={handleChange}
                placeholder="Ex: 123456"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #D9D9D9',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
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
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #D9D9D9',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
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
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #D9D9D9',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#5A5A5A',
                fontWeight: '600'
              }}>
                Confirmar Senha
              </label>
              <input
                type="password"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #D9D9D9',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              />
            </div>
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
            Cadastrar
          </button>

          <div style={{ textAlign: 'center' }}>
            <Link 
              to="/login"
              style={{
                color: '#009688',
                textDecoration: 'none'
              }}
            >
              Já tem conta? Faça login
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
