import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Dashboard from "./pages/Dashboard";
import ListaPacientes from "./pages/Pacientes/ListaPacientes";
import DetalhesPaciente from "./pages/Pacientes/DetalhesPaciente";
import CadastrarPaciente from "./pages/Pacientes/CadastrarPaciente";
import ListaAtendimentos from "./pages/Atendimentos/ListaAtendimentos";
import DetalhesAtendimento from "./pages/Atendimentos/DetalhesAtendimento";
import ListaReceitas from "./pages/Receitas/ListaReceitas";
import DetalhesReceita from "./pages/Receitas/DetalhesReceita";
import ListaExames from "./pages/Exames/ListaExames";
import DetalhesExame from "./pages/Exames/DetalhesExame";
import ListaUnidades from "./pages/Unidades/ListaUnidades";
import DetalhesUnidade from "./pages/Unidades/DetalhesUnidade";
import CadastrarUnidade from "./pages/Unidades/CadastrarUnidade";
import ListaUsuarios from "./pages/Usuarios/ListaUsuarios";
import DetalhesUsuario from "./pages/Usuarios/DetalhesUsuario";
import CadastrarUsuario from "./pages/Usuarios/CadastrarUsuario";
import MeuProntuario from "./pages/Paciente/MeuProntuario";
import MinhasConsultas from "./pages/Paciente/MinhasConsultas";
import MinhasReceitas from "./pages/Paciente/MinhasReceitas";
import MeusExames from "./pages/Paciente/MeusExames";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/pacientes" 
          element={
            <ProtectedRoute allowedTypes={['admin', 'medico']}>
              <ListaPacientes />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/paciente/:id" 
          element={
            <ProtectedRoute allowedTypes={['admin', 'medico']}>
              <DetalhesPaciente />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/pacientes/novo" 
          element={
            <ProtectedRoute allowedTypes={['admin', 'medico']}>
              <CadastrarPaciente />
            </ProtectedRoute>
          } 
        />
        
        {/* Rotas de Atendimentos */}
        <Route 
          path="/atendimentos" 
          element={
            <ProtectedRoute allowedTypes={['admin', 'medico']}>
              <ListaAtendimentos />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/atendimento/:id" 
          element={
            <ProtectedRoute allowedTypes={['admin', 'medico']}>
              <DetalhesAtendimento />
            </ProtectedRoute>
          } 
        />
        
        {/* Rotas de Receitas */}
        <Route 
          path="/receitas" 
          element={
            <ProtectedRoute allowedTypes={['admin', 'medico']}>
              <ListaReceitas />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/receita/:id" 
          element={
            <ProtectedRoute allowedTypes={['admin', 'medico']}>
              <DetalhesReceita />
            </ProtectedRoute>
          } 
        />
        
        {/* Rotas de Exames */}
        <Route 
          path="/exames" 
          element={
            <ProtectedRoute allowedTypes={['admin', 'medico']}>
              <ListaExames />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/exame/:id" 
          element={
            <ProtectedRoute allowedTypes={['admin', 'medico']}>
              <DetalhesExame />
            </ProtectedRoute>
          } 
        />
        
        {/* Rotas de Unidades - Apenas Admin */}
        <Route 
          path="/unidades" 
          element={
            <ProtectedRoute allowedTypes={['admin']}>
              <ListaUnidades />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/unidade/:id" 
          element={
            <ProtectedRoute allowedTypes={['admin']}>
              <DetalhesUnidade />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/unidades/nova" 
          element={
            <ProtectedRoute allowedTypes={['admin']}>
              <CadastrarUnidade />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/unidades/editar/:id" 
          element={
            <ProtectedRoute allowedTypes={['admin']}>
              <CadastrarUnidade />
            </ProtectedRoute>
          } 
        />
        
        {/* Rotas de Usuários - Apenas Admin */}
        <Route 
          path="/usuarios" 
          element={
            <ProtectedRoute allowedTypes={['admin']}>
              <ListaUsuarios />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/usuario/:id" 
          element={
            <ProtectedRoute allowedTypes={['admin']}>
              <DetalhesUsuario />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/usuarios/novo" 
          element={
            <ProtectedRoute allowedTypes={['admin']}>
              <CadastrarUsuario />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/usuarios/editar/:id" 
          element={
            <ProtectedRoute allowedTypes={['admin']}>
              <CadastrarUsuario />
            </ProtectedRoute>
          } 
        />
        
        {/* Rotas do Paciente */}
        <Route 
          path="/meu-prontuario" 
          element={
            <ProtectedRoute allowedTypes={['paciente']}>
              <MeuProntuario />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/minhas-consultas" 
          element={
            <ProtectedRoute allowedTypes={['paciente']}>
              <MinhasConsultas />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/minhas-receitas" 
          element={
            <ProtectedRoute allowedTypes={['paciente']}>
              <MinhasReceitas />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/meus-exames" 
          element={
            <ProtectedRoute allowedTypes={['paciente']}>
              <MeusExames />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}
