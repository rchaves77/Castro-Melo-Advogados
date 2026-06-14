export enum ClientStatus {
  ATIVO = "Ativo",
  LEAD_QUENTE = "Lead Quente",
  ARQUIVADO = "Arquivado"
}

export interface Client {
  id: string;
  name: string;
  type: "Pessoa Física" | "Pessoa Jurídica";
  identifier: string; // CPF or CNPJ
  status: ClientStatus;
  lastContact: string;
  activeCases: number;
  priority: "Alta Prioridade" | "Normal" | "Baixa";
  email: string;
  phone: string;
  address?: string;
  notes?: string;
}

export interface Process {
  id: string;
  number: string;
  action: string;
  clientName: string;
  court: string;
  phase: string;
  nextDeadline: string;
  deadlineType: string;
  isUrgent?: boolean;
  notes?: string;
}

export interface KanbanTask {
  id: string;
  title: string;
  clientName: string;
  badge: "Intimação" | "Urgente" | "Contestação" | "Recurso Especial" | "Geral";
  column: "triagem" | "elaboracao" | "revisao" | "peticionamento";
  hasAttachment?: boolean;
  lawyers: string[]; // initials like ["AM", "LS"]
  deadline: string;
  isOverdue?: boolean;
  progress?: number; // percentage (0-100) or undefined
  subtasksDone?: number;
  subtasksTotal?: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: "Receita" | "Despesa Operacional" | "Impostos" | "Pessoal";
  status: "Pago" | "Processando" | "Pendente";
  value: number; // positive for income, negative for expense
}

export interface Invoice {
  id: string;
  company: string;
  dueDate: string;
  value: number;
  status: "Vencido" | "Hoje" | "Amanhã" | "Pago";
}

export interface TemplateDocument {
  id: string;
  title: string;
  category: "Petições Iniciais" | "Contratos" | "Recursos" | "Contestações" | "Procurações";
  description: string;
  content: string;
  lastUpdated: string;
  authorInitials: string;
}

export interface ActivityLog {
  id: string;
  title: string;
  type: "document" | "payment" | "deadline" | "client";
  description: string;
  time: string;
  tag?: string;
}
