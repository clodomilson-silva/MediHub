import DashboardLayout from "../layouts/DashboardLayout";

export default function Home() {
  console.log("Home component rendering");
  
  return (
    <DashboardLayout>
      <div>
        <h2>Bem-vindo ao MediHub</h2>
        <p>Gerencie pacientes, histórico clínico e atendimentos.</p>
      </div>
    </DashboardLayout>
  );
}
