import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ 
          padding: '32px', 
          backgroundColor: '#F5F6F7', 
          flex: 1,
          overflowY: 'auto'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}
