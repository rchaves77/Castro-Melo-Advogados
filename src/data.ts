import { Client, ClientStatus, Process, KanbanTask, Transaction, Invoice, TemplateDocument, ActivityLog } from "./types";

export const INITIAL_CLIENTS: Client[] = [
  {
    id: "cli-1",
    name: "Construtora Alpha S.A.",
    type: "Pessoa Jurídica",
    identifier: "12.345.678/0001-90",
    status: ClientStatus.ATIVO,
    lastContact: "Hoje, 10:30",
    activeCases: 12,
    priority: "Alta Prioridade",
    email: "contato@construtoraalpha.com.br",
    phone: "(11) 98765-4321",
    address: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP",
    notes: "Cliente corporativo estratégico de infraestrutura e incorporações."
  },
  {
    id: "cli-2",
    name: "Roberto Mendes",
    type: "Pessoa Física",
    identifier: "321.654.987-10",
    status: ClientStatus.LEAD_QUENTE,
    lastContact: "Ontem, 15:45",
    activeCases: 0,
    priority: "Normal",
    email: "roberto.mendes@gmail.com",
    phone: "(11) 99123-4567",
    address: "Rua Augusta, 450, Ap 12 - Consolação, São Paulo - SP",
    notes: "Interessado em planejamento sucessório e holdings familiares."
  },
  {
    id: "cli-3",
    name: "Logística TransGlobal",
    type: "Pessoa Jurídica",
    identifier: "98.765.432/0001-10",
    status: ClientStatus.ATIVO,
    lastContact: "12 Mar 2024",
    activeCases: 3,
    priority: "Normal",
    email: "legal@transglobal.com.br",
    phone: "(11) 3344-5566",
    address: "Rodovia Anhanguera, Km 22 - Jundiaí - SP",
    notes: "Assessoria no contencioso cível e contratos internacionais de frete."
  },
  {
    id: "cli-4",
    name: "Clínica Florença",
    type: "Pessoa Jurídica",
    identifier: "11.222.333/0001-44",
    status: ClientStatus.ARQUIVADO,
    lastContact: "15 Jan 2023",
    activeCases: 0,
    priority: "Baixa",
    email: "adm@clinicaflorenca.com.br",
    phone: "(11) 2233-4455",
    address: "Al. Lorena, 1500 - Cerqueira César, São Paulo - SP",
    notes: "Contrato encerrado após êxito em processo de responsabilidade médica."
  },
  {
    id: "cli-5",
    name: "TechCorp Soluções S.A.",
    type: "Pessoa Jurídica",
    identifier: "12.345.678/0001-90",
    status: ClientStatus.ATIVO,
    lastContact: "Hoje, 14:00",
    activeCases: 8,
    priority: "Alta Prioridade",
    email: "diretoria@techcorp.com",
    phone: "(11) 5566-7788",
    address: "Av. Brigadeiro Faria Lima, 3400 - Itaim Bibi, São Paulo - SP",
    notes: "Multinacional de tecnologia SaaS com demandas de propriedade intelectual."
  },
  {
    id: "cli-6",
    name: "Banco de Investimentos S.A.",
    type: "Pessoa Jurídica",
    identifier: "00.000.000/0001-91",
    status: ClientStatus.ATIVO,
    lastContact: "3 dias atrás",
    activeCases: 22,
    priority: "Alta Prioridade",
    email: "compliance@bancoinvest.com",
    phone: "(11) 3003-4004",
    address: "Av. Pres. Juscelino Kubitschek, 1800 - Vila Olímpia, São Paulo - SP",
    notes: "Demandas regulatórias complexas em tribunais superiores (STJ/STF)."
  }
];

export const INITIAL_PROCESSES: Process[] = [
  {
    id: "proc-1",
    number: "1048293-45.2023.8.26.0100",
    action: "Ação Indenizatória",
    clientName: "TechCorp Soluções S.A.",
    court: "TJSP - 34ª Vara Cível - São Paulo",
    phase: "Peticionamento",
    nextDeadline: "15/11/2026",
    deadlineType: "Contestação",
    isUrgent: true,
    notes: "Ação indenizatória de danos morais movida por ex-parceiro comercial."
  },
  {
    id: "proc-2",
    number: "5012345-89.2022.4.03.6100",
    action: "Mandado de Segurança",
    clientName: "Construtora Horizonte Ltda",
    court: "TRF3 - 12ª Vara Federal - SP",
    phase: "Análise",
    nextDeadline: "28/11/2026",
    deadlineType: "Agravo de Instrumento",
    isUrgent: false,
    notes: "Impugnação de certidão negativa de débitos fiscais retida."
  },
  {
    id: "proc-3",
    number: "0010987-12.2021.5.02.0000",
    action: "Reclamação Trabalhista",
    clientName: "Indústrias Metalúrgicas S.A.",
    court: "TRT2 - 5ª Vara do Trabalho - SP",
    phase: "Triagem",
    nextDeadline: "10/12/2026",
    deadlineType: "Audiência Inicial",
    isUrgent: false,
    notes: "Defesa prévia sobre verbas rescisórias e dissídio coletivo."
  },
  {
    id: "proc-4",
    number: "REsp 1.845.923/SP",
    action: "Recurso Especial",
    clientName: "Banco de Investimentos S.A.",
    court: "STJ - 3ª Turma",
    phase: "Aguardando Julgamento",
    nextDeadline: "Sem prazo ativo",
    deadlineType: "Nenhum",
    isUrgent: false,
    notes: "Discussão de validade de cláusula de juros capitalizados."
  }
];

export const INITIAL_KANBAN_TASKS: KanbanTask[] = [
  {
    id: "tsk-1",
    title: "Análise de Publicação DJE - Processo 1002345-89.2023.8.26.0100",
    clientName: "TechCorp S.A.",
    badge: "Intimação",
    column: "triagem",
    hasAttachment: true,
    lawyers: ["AM"],
    deadline: "Hoje, 14:00",
    isOverdue: false
  },
  {
    id: "tsk-2",
    title: "Distribuição de Tutela Cautelar Antecedente",
    clientName: "Construtora Alpha S.A.",
    badge: "Urgente",
    column: "triagem",
    lawyers: ["PR"],
    deadline: "D-0",
    isOverdue: true
  },
  {
    id: "tsk-3",
    title: "Redigir Contestação Trabalhista - Reclamante: João Silva",
    clientName: "Indústria Beta Ltda.",
    badge: "Contestação",
    column: "elaboracao",
    hasAttachment: false,
    lawyers: ["LS", "AM"],
    deadline: "15 Nov",
    progress: 40,
    subtasksDone: 2,
    subtasksTotal: 5
  },
  {
    id: "tsk-4",
    title: "Revisão de Agravo em REsp - Tese Tributária com parecer de jurisprudência",
    clientName: "Varejo Mega S.A.",
    badge: "Recurso Especial",
    column: "revisao",
    lawyers: ["CM"],
    deadline: "D-2",
    isOverdue: false
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "trans-1",
    date: "2026-06-14",
    description: "Honorários Iniciais - Caso Trabalhista (Silva & Cia)",
    category: "Receita",
    status: "Pago",
    value: 5000.00
  },
  {
    id: "trans-2",
    date: "2026-06-13",
    description: "Licenças Software Jurídico LegalOne",
    category: "Despesa Operacional",
    status: "Processando",
    value: -1250.00
  },
  {
    id: "trans-3",
    date: "2026-06-12",
    description: "Consultoria Tributária Integrada - Empresa Y",
    category: "Receita",
    status: "Pago",
    value: 8500.00
  },
  {
    id: "trans-4",
    date: "2026-06-10",
    description: "Aluguel da Sede Comercial - Paulista",
    category: "Despesa Operacional",
    status: "Pago",
    value: -4200.00
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: "inv-1",
    company: "Empresa ABC Ltda",
    dueDate: "15/10/2026",
    value: 4500.00,
    status: "Vencido"
  },
  {
    id: "inv-2",
    company: "João Silva ME",
    dueDate: "Vence hoje",
    value: 1200.00,
    status: "Hoje"
  },
  {
    id: "inv-3",
    company: "Construtora X S.A.",
    dueDate: "Vence amanhã",
    value: 8900.00,
    status: "Amanhã"
  }
];

export const INITIAL_TEMPLATES: TemplateDocument[] = [
  {
    id: "doc-1",
    title: "Ação Indenizatória por Danos Morais",
    category: "Petições Iniciais",
    description: "Modelo padrão para ações de reparação civil contra instituições financeiras por negativação indevida e falha na prestação de serviços.",
    lastUpdated: "12/05",
    authorInitials: "CM",
    content: `EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA [__] VARA CÍVEL DA COMARCA DE SÃO PAULO - SP

REQUERENTE: [Nome do Cliente], brasileiro, casado, portador do RG nº [__] e do CPF nº [__], residente e domiciliado na [__]...

REQUERIDO: BANCO [Nome do Banco], pessoa jurídica de direito privado...

DOS FATOS:
O Requerente teve seu nome indevidamente inscrito nos órgãos de proteção ao crédito (SPC/SERASA) por suposta dívida inexistente...

DO DIREITO:
Conforme o art. 186 e 927 do Código Civil, aquele que violar direito e causar dano a outrem comete ato ilícito e fica obrigado a reparar...

DOS PEDIDOS:
A) A concessão da tutela provisória de urgência para imediata exclusão do nome...
B) Condenação ao pagamento de danos morais no sugerido de R$ 15.000,00...
`
  },
  {
    id: "doc-2",
    title: "Contrato de Honorários Advocatícios - Ad Exitum",
    category: "Contratos",
    description: "Cláusulas padrão para prestação de serviços jurídicos profissionais com cláusula quota litis, baseando a remuneração estritamente no proveito.",
    lastUpdated: "08/05",
    authorInitials: "LM",
    content: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS ADVOCATÍCIOS E HONORÁRIOS

CONTRATANTE: [Nome do Cliente / Razão Social]...
CONTRATADO: CASTRO MELO ADVOCACIA, sociedade de advogados inscrita na OAB/SP sob o nº...

CLÁUSULA PRIMEIRA - DO OBJETO:
O objeto do presente instrumento é a defesa dos interesses do CONTRATANTE na ação judicial de [__]...

CLÁUSULA SEGUNDA - DOS VALORES (AD EXITUM):
Os honorários convencionais são estipulados em 20% (vinte por cento) incidentes sobre o montante bruto do êxito econômico obtido...
`
  },
  {
    id: "doc-3",
    title: "Apelação Cível - Revisão de Juros Bancários",
    category: "Recursos",
    description: "Minuta refinada de recurso de apelação cível visando a reforma de sentença improcedente proferida em sede de ação revisional de financiamento.",
    lastUpdated: "01/05",
    authorInitials: "CM",
    content: `EGRÉGIO TRIBUNAL DE JUSTIÇA DO ESTADO DE SÃO PAULO

COLENDA CÂMARA JULGADORA
EMÉRITOS DESEMBARGADORES

RAZÕES DE APELAÇÃO

Apelante: [Nome do Cliente]
Apelado: BANCO [Nome do Banco]
Processo de Origem nº: [__] - [__] Vara Cível de Origem

PRELIMINARMENTE DA ADMISSIBILIDADE:
O presente recurso é plenamente tempestivo e o preparo foi devidamente recolhido nas guias anexas...

MÉRITO RECURSAL:
A r. sentença merece reforma porquanto ignorou a manifesta abusividade da taxa de juros remuneratórios contratada, que excede em mais de duas vezes a média divulgada pelo Banco Central do Brasil para o mesmo período histórico...
`
  }
];

export const INITIAL_ACTIVITIES: ActivityLog[] = [
  {
    id: "act-1",
    title: "Petição Inicial Protocolada",
    type: "document",
    description: "Processo nº 1004567-89.2023.8.26.0100 - Cliente: Silva & Cia Ltda.",
    time: "Há 2 horas",
    tag: "Cível"
  },
  {
    id: "act-2",
    title: "Honorários Recebidos",
    type: "payment",
    description: "Fatura #4592 - Cliente: Almeida Corp.",
    time: "Há 5 horas"
  },
  {
    id: "act-3",
    title: "Prazo Fatal Próximo",
    type: "deadline",
    description: "Contestação - Processo Trabalhista nº 0012345-67.2023.5.02.0001",
    time: "Ontem"
  }
];

// LocalStorage Helper functions
const getStorageItem = <T>(key: string, initialValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Local storage read error for key: " + key, e);
  }
  return initialValue;
};

const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Local storage set error for key: " + key, e);
  }
};

export const getClients = (): Client[] => getStorageItem("app_clients", INITIAL_CLIENTS);
export const saveClients = (data: Client[]) => setStorageItem("app_clients", data);

export const getProcesses = (): Process[] => getStorageItem("app_processes", INITIAL_PROCESSES);
export const saveProcesses = (data: Process[]) => setStorageItem("app_processes", data);

export const getKanbanTasks = (): KanbanTask[] => getStorageItem("app_kanban_tasks", INITIAL_KANBAN_TASKS);
export const saveKanbanTasks = (data: KanbanTask[]) => setStorageItem("app_kanban_tasks", data);

export const getTransactions = (): Transaction[] => getStorageItem("app_transactions", INITIAL_TRANSACTIONS);
export const saveTransactions = (data: Transaction[]) => setStorageItem("app_transactions", data);

export const getInvoices = (): Invoice[] => getStorageItem("app_invoices", INITIAL_INVOICES);
export const saveInvoices = (data: Invoice[]) => setStorageItem("app_invoices", data);

export const getTemplates = (): TemplateDocument[] => getStorageItem("app_templates", INITIAL_TEMPLATES);
export const saveTemplates = (data: TemplateDocument[]) => setStorageItem("app_templates", data);

export const getActivities = (): ActivityLog[] => getStorageItem("app_activities", INITIAL_ACTIVITIES);
export const saveActivities = (data: ActivityLog[]) => setStorageItem("app_activities", data);

// Quick helper to reset local storage
export const resetAllStorage = () => {
  localStorage.removeItem("app_clients");
  localStorage.removeItem("app_processes");
  localStorage.removeItem("app_kanban_tasks");
  localStorage.removeItem("app_transactions");
  localStorage.removeItem("app_invoices");
  localStorage.removeItem("app_templates");
  localStorage.removeItem("app_activities");
  window.location.reload();
};
