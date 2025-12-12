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
      </Routes>
    </BrowserRouter>
  );
}
