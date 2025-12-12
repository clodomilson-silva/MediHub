import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { db } from './db/index.js';
import { usuarios, unidades, pacientes } from './db/schema.js';

async function seed() {
  console.log('🌱 Populando banco de dados...');

  try {
    // Criar usuários padrão
    const senhaHash = await bcrypt.hash('admin123', 10);
    
    const usuariosCriados = await db.insert(usuarios).values([
      {
        nome: 'Administrador do Sistema',
        email: 'admin@medihub.com',
        senha: senhaHash,
        tipo: 'admin',
        cpf: '000.000.000-00',
      },
      {
        nome: 'Dr. João Silva',
        email: 'medico@medihub.com',
        senha: await bcrypt.hash('medico123', 10),
        tipo: 'medico',
        crm: '12345-SP',
        telefone: '(11) 98765-4321',
      },
      {
        nome: 'Maria Santos',
        email: 'paciente@medihub.com',
        senha: await bcrypt.hash('paciente123', 10),
        tipo: 'paciente',
        cpf: '123.456.789-00',
        telefone: '(11) 91234-5678',
      },
    ]).returning();

    console.log('✅ Usuários criados:', usuariosCriados.length);

    // Criar unidades
    const unidadesCriadas = await db.insert(unidades).values([
      {
        nome: 'Unidade Central',
        endereco: 'Rua Principal, 100',
        cidade: 'São Paulo',
        estado: 'SP',
        telefone: '(11) 3000-0000',
      },
      {
        nome: 'Unidade Norte',
        endereco: 'Av. Norte, 500',
        cidade: 'São Paulo',
        estado: 'SP',
        telefone: '(11) 3000-1111',
      },
    ]).returning();

    console.log('✅ Unidades criadas:', unidadesCriadas.length);

    // Criar pacientes de exemplo
    const pacientesCriados = await db.insert(pacientes).values([
      {
        nome: 'Maria Silva',
        cpf: '123.456.789-00',
        dataNascimento: '1990-05-15',
        sexo: 'F',
        telefone: '(11) 98765-4321',
        email: 'maria.silva@email.com',
        tipoSanguineo: 'A+',
        hipertenso: true,
        diabetico: false,
      },
      {
        nome: 'João Santos',
        cpf: '987.654.321-00',
        dataNascimento: '1972-08-20',
        sexo: 'M',
        telefone: '(11) 91234-5678',
        email: 'joao.santos@email.com',
        tipoSanguineo: 'O-',
        hipertenso: false,
        diabetico: true,
        medicamentoContinuo: true,
        medicamentosContinuos: 'Metformina 850mg - 2x ao dia',
      },
    ]).returning();

    console.log('✅ Pacientes criados:', pacientesCriados.length);

    console.log('\n🎉 Banco de dados populado com sucesso!\n');
    console.log('📧 Credenciais de acesso:');
    console.log('   Admin:    admin@medihub.com / admin123');
    console.log('   Médico:   medico@medihub.com / medico123');
    console.log('   Paciente: paciente@medihub.com / paciente123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao popular banco:', error);
    process.exit(1);
  }
}

seed();
