import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header style={{
        backgroundColor: '#009688',
        padding: '16px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white'
      }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>MediHub</h1>
        <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="#home" style={{ color: 'white', textDecoration: 'none' }}>Home</a>
          <a href="#servicos" style={{ color: 'white', textDecoration: 'none' }}>Serviços</a>
          <a href="#sobre" style={{ color: 'white', textDecoration: 'none' }}>Sobre</a>
          <a href="#contato" style={{ color: 'white', textDecoration: 'none' }}>Contato</a>
          <Link 
            to="/login" 
            style={{
              backgroundColor: 'white',
              color: '#009688',
              padding: '8px 24px',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            Login
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section 
        id="home"
        style={{
          backgroundColor: '#E6F9FF',
          padding: '80px 48px',
          textAlign: 'center'
        }}
      >
        <h2 style={{ 
          fontSize: '48px', 
          fontWeight: 'bold', 
          color: '#006F6A',
          marginBottom: '24px'
        }}>
          Cuidando da sua saúde com excelência
        </h2>
        <p style={{ 
          fontSize: '20px', 
          color: '#5A5A5A',
          marginBottom: '32px',
          maxWidth: '800px',
          margin: '0 auto 32px'
        }}>
          Sistema integrado de gestão de pacientes com histórico completo de atendimentos
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link 
            to="/cadastro" 
            style={{
              backgroundColor: '#009688',
              color: 'white',
              padding: '12px 32px',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '18px'
            }}
          >
            Cadastre-se
          </Link>
          <Link 
            to="/login" 
            style={{
              backgroundColor: 'transparent',
              color: '#009688',
              padding: '12px 32px',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '18px',
              border: '2px solid #009688'
            }}
          >
            Acessar Sistema
          </Link>
        </div>
      </section>

      {/* Serviços */}
      <section 
        id="servicos"
        style={{
          padding: '80px 48px',
          backgroundColor: 'white'
        }}
      >
        <h3 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#006F6A',
          textAlign: 'center',
          marginBottom: '48px'
        }}>
          Nossos Serviços
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {[
            { titulo: 'Consultas Médicas', desc: 'Atendimento com profissionais qualificados' },
            { titulo: 'Exames Laboratoriais', desc: 'Exames com resultados rápidos e precisos' },
            { titulo: 'Procedimentos', desc: 'Procedimentos médicos com segurança' },
            { titulo: 'Histórico Completo', desc: 'Acesso ao histórico de atendimentos' }
          ].map((servico, idx) => (
            <div 
              key={idx}
              style={{
                backgroundColor: '#F5F6F7',
                padding: '32px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <h4 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#009688',
                marginBottom: '16px'
              }}>
                {servico.titulo}
              </h4>
              <p style={{ color: '#5A5A5A', lineHeight: '1.6' }}>
                {servico.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#006F6A',
        color: 'white',
        padding: '32px 48px',
        textAlign: 'center'
      }}>
        <p>&copy; 2025 MediHub - Sistema de Gestão de Saúde</p>
      </footer>
    </div>
  );
}
