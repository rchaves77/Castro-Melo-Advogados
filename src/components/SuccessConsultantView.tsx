import React, { useState, FormEvent } from "react";
import { 
  Users, 
  Heart, 
  Smile, 
  Frown, 
  Meh, 
  AlertTriangle, 
  CheckCircle2, 
  Phone, 
  MessageSquare, 
  Calendar, 
  Plus, 
  ArrowRight, 
  Flame, 
  Search, 
  ShieldCheck, 
  UserCheck, 
  Bookmark, 
  Flag,
  Sparkles
} from "lucide-react";
import { Client, ClientStatus } from "../types";

interface SuccessConsultantViewProps {
  clients: Client[];
  onNavigateToClient?: (clientId: string) => void;
}

// Interaction interface
interface Interaction {
  id: string;
  clientId: string;
  clientName: string;
  type: "Ligação" | "WhatsApp" | "E-mail" | "Reunião Presencial" | "Reunião Virtual";
  date: string;
  notes: string;
  satisfaction: "Satisfeito" | "Neutro" | "Insatisfeito";
  consultant: string;
}

// Action Plan interface
interface ActionPlan {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  description: string;
  priority: "Alta" | "Média" | "Baixa";
  dueDate: string;
  status: "Não Iniciado" | "Em Andamento" | "Concluido";
  assignedTo: string;
}

// Mock initial timeline interactions
const INITIAL_INTERACTIONS: Interaction[] = [
  {
    id: "int-1",
    clientId: "cli-1",
    clientName: "Construtora Alpha S.A.",
    type: "Reunião Virtual",
    date: "14/06/2026",
    notes: "Alinhamento mensal sobre os 12 processos de desapropriação. Cliente elogiou a velocidade de resposta do Dr. Rafael.",
    satisfaction: "Satisfeito",
    consultant: "Carlos Eduardo (CS)"
  },
  {
    id: "int-2",
    clientId: "cli-3",
    clientName: "Logística TransGlobal",
    type: "WhatsApp",
    date: "12/06/2026",
    notes: "Cliente questionou sobre demora no andamento do processo trabalhista. Esclarecido que aguarda decisão do magistrado.",
    satisfaction: "Neutro",
    consultant: "Juliana Santos (CS)"
  },
  {
    id: "int-3",
    clientId: "cli-5",
    clientName: "TechCorp Soluções S.A.",
    type: "Ligação",
    date: "10/06/2026",
    notes: "Reclamação sobre rito fiscal prolongado. Alinhado plano de contingência tributária emergencial.",
    satisfaction: "Insatisfeito",
    consultant: "Carlos Eduardo (CS)"
  }
];

// Mock initial action plans
const INITIAL_PLANS: ActionPlan[] = [
  {
    id: "plan-1",
    title: "Reestruturação societária preventiva",
    clientId: "cli-5",
    clientName: "TechCorp Soluções S.A.",
    description: "Reunir contratos de franquia antigos para verificar lacunas jurídicas e reduzir risco de litígio trabalhista.",
    priority: "Alta",
    dueDate: "20/06/2026",
    status: "Em Andamento",
    assignedTo: "Carlos Eduardo (CS)"
  },
  {
    id: "plan-2",
    title: "Auditoria preventiva em depósitos federais",
    clientId: "cli-1",
    clientName: "Construtora Alpha S.A.",
    description: "Fazer levantamento de guias pagas judicialmente no último triênio para subsidiar repetição de indébito fiscal.",
    priority: "Média",
    dueDate: "30/06/2026",
    status: "Não Iniciado",
    assignedTo: "Juliana Santos (CS)"
  },
  {
    id: "plan-3",
    title: "Envio de relatórios semanais customizados",
    clientId: "cli-3",
    clientName: "Logística TransGlobal",
    description: "Manter contato proativo toda sexta-feira para mitigar desconforto sobre prazos de rito ordinário.",
    priority: "Baixa",
    dueDate: "18/06/2026",
    status: "Concluido",
    assignedTo: "Juliana Santos (CS)"
  }
];

export default function SuccessConsultantView({ clients }: SuccessConsultantViewProps) {
  const [role, setRole] = useState<"Consultor de Sucesso" | "Administrador CS">("Consultor de Sucesso");
  const [interactions, setInteractions] = useState<Interaction[]>(INITIAL_INTERACTIONS);
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>(INITIAL_PLANS);
  const [csSearchTerm, setCsSearchTerm] = useState<string>("");
  const [healthFilter, setHealthFilter] = useState<string>("Todos");

  // Interaction Form states
  const [formClient, setFormClient] = useState("");
  const [formType, setFormType] = useState<"Ligação" | "WhatsApp" | "E-mail" | "Reunião Presencial" | "Reunião Virtual">("Ligação");
  const [formNotes, setFormNotes] = useState("");
  const [formSatisfaction, setFormSatisfaction] = useState<"Satisfeito" | "Neutro" | "Insatisfeito">("Satisfeito");

  // Action Plan Form states
  const [planTitle, setPlanTitle] = useState("");
  const [planClient, setPlanClient] = useState("");
  const [planDesc, setPlanDesc] = useState("");
  const [planPriority, setPlanPriority] = useState<"Alta" | "Média" | "Baixa">("Média");
  const [planDueDate, setPlanDueDate] = useState("2026-06-25");

  // Client health mapping helper (Static score based on some rules or priority)
  const getClientHealth = (client: Client): { label: "Excelente" | "Estável" | "Em Risco" | "Crítico", color: string, icon: any } => {
    if (client.priority === "Alta Prioridade" && client.activeCases > 10) {
      return { label: "Estável", color: "bg-blue-50 text-blue-700 border-blue-200", icon: Smile };
    }
    if (client.status === ClientStatus.ARQUIVADO) {
      return { label: "Crítico", color: "bg-gray-100 text-gray-500 border-gray-200", icon: Frown };
    }
    if (client.name.includes("TechCorp")) {
      return { label: "Em Risco", color: "bg-orange-50 text-orange-700 border-orange-200", icon: AlertTriangle };
    }
    if (client.priority === "Alta Prioridade") {
      return { label: "Excelente", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: Smile };
    }
    return { label: "Estável", color: "bg-blue-50 text-blue-700 border-blue-200", icon: Smile };
  };

  // KPI calculations
  const totalCsClients = clients.length;
  const clientsWithHealth = clients.map(c => ({ ...c, health: getClientHealth(c) }));
  
  const excelenteCount = clientsWithHealth.filter(c => c.health.label === "Excelente").length;
  const estavelCount = clientsWithHealth.filter(c => c.health.label === "Estável").length;
  const riscoCount = clientsWithHealth.filter(c => c.health.label === "Em Risco").length;
  const criticoCount = clientsWithHealth.filter(c => c.health.label === "Crítico").length;

  const npsEstimado = 86; // CS Simulated metric

  // Filters
  const filteredCsClients = clientsWithHealth.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(csSearchTerm.toLowerCase()) || 
                          c.identifier.includes(csSearchTerm);
    const matchesHealth = healthFilter === "Todos" || c.health.label === healthFilter;
    return matchesSearch && matchesHealth;
  });

  // Cycle Action Plan Status
  const togglePlanStatus = (planId: string) => {
    setActionPlans(prev => prev.map(p => {
      if (p.id === planId) {
        const nextStatus = p.status === "Não Iniciado" 
          ? "Em Andamento" 
          : p.status === "Em Andamento" 
            ? "Concluido" 
            : "Não Iniciado";
        return { ...p, status: nextStatus };
      }
      return p;
    }));
  };

  // Submit New Interaction
  const handleAddInteraction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formClient || !formNotes.trim()) return;

    const matchedClient = clients.find(c => c.id === formClient);
    const newInt: Interaction = {
      id: "int-" + Date.now(),
      clientId: formClient,
      clientName: matchedClient ? matchedClient.name : "Cliente Geral",
      type: formType,
      date: new Date().toLocaleDateString("pt-BR"),
      notes: formNotes,
      satisfaction: formSatisfaction,
      consultant: "Dra. Luciana Mendes (CS Sênior)"
    };

    setInteractions([newInt, ...interactions]);
    setFormNotes("");
    setFormClient("");
  };

  // Submit New Action Plan
  const handleCreateActionPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planTitle.trim() || !planClient) return;

    const matchedClient = clients.find(c => c.id === planClient);
    const newPlan: ActionPlan = {
      id: "plan-" + Date.now(),
      title: planTitle,
      clientId: planClient,
      clientName: matchedClient ? matchedClient.name : "Cliente Geral",
      description: planDesc,
      priority: planPriority,
      dueDate: planDueDate.split("-").reverse().join("/"),
      status: "Não Iniciado",
      assignedTo: "Carlos Eduardo (CS)"
    };

    setActionPlans([newPlan, ...actionPlans]);
    setPlanTitle("");
    setPlanDesc("");
    setPlanClient("");
  };

  return (
    <div className="space-y-6 animate-fade-in" id="customer-success-view">
      
      {/* 1. Header and Role Switcher Banner */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4" id="cs-header-banner">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600 animate-pulse" />
            <span>Módulo Administrativo Autenticado • Castro Melo CS</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 font-sans">Sucesso do Cliente (Customer Success)</h2>
          <p className="text-xs text-gray-500 mt-1">Check-ups regulares de NPS, mitigação de riscos processuais, acompanhamento de satisfação e planos de ação preventivos.</p>
        </div>

        {/* Level authorization switcher display */}
        <div className="flex bg-gray-100 border border-gray-200 p-1.5 rounded-lg text-xs items-center gap-2 self-start md:self-center" id="cs-permission-switcher">
          <span className="text-[10px] font-bold text-gray-400 pl-1">Acesso:</span>
          {["Consultor de Sucesso", "Administrador CS"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r as any)}
              className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${
                role === r 
                  ? "bg-[#1c2025] text-white shadow-md font-bold" 
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Customer Health Metrics Panel */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4" id="cs-metrics-mesh">
        <button
          onClick={() => setHealthFilter("Excelente")}
          className={`bg-white border p-4 rounded-xl shadow-sm text-left transition-all ${healthFilter === "Excelente" ? "border-emerald-500 ring-2 ring-emerald-100" : "border-gray-200 hover:border-gray-300"}`}
        >
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Excelente</span>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-2xl font-bold text-emerald-700 font-sans">{excelenteCount}</span>
            <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold">
              <Smile className="h-4 w-4" />
            </div>
          </div>
        </button>

        <button
          onClick={() => setHealthFilter("Estável")}
          className={`bg-white border p-4 rounded-xl shadow-sm text-left transition-all ${healthFilter === "Estável" ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-200 hover:border-gray-300"}`}
        >
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Estável</span>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-2xl font-bold text-blue-700 font-sans">{estavelCount}</span>
            <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
              <Smile className="h-4 w-4" />
            </div>
          </div>
        </button>

        <button
          onClick={() => setHealthFilter("Em Risco")}
          className={`bg-white border p-4 rounded-xl shadow-sm text-left transition-all ${healthFilter === "Em Risco" ? "border-orange-500 ring-2 ring-orange-100" : "border-gray-200 hover:border-gray-300"}`}
        >
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Em Risco</span>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-2xl font-bold text-orange-600 font-sans">{riscoCount}</span>
            <div className="w-7 h-7 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-xs font-bold">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
        </button>

        <button
          onClick={() => setHealthFilter("Crítico")}
          className={`bg-white border p-4 rounded-xl shadow-sm text-left transition-all ${healthFilter === "Crítico" ? "border-red-500 ring-2 ring-red-100" : "border-gray-200 hover:border-gray-300"}`}
        >
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Crítico / Churn</span>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-2xl font-bold text-red-700 font-sans">{criticoCount}</span>
            <div className="w-7 h-7 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-xs font-bold">
              <Frown className="h-4 w-4" />
            </div>
          </div>
        </button>

        <button
          onClick={() => setHealthFilter("Todos")}
          className="bg-gradient-to-br from-[#1c2025] to-[#2e3745] text-white p-4 rounded-xl shadow-sm text-left"
        >
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">NPS Carteira</span>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-2xl font-bold font-sans">{npsEstimado}</span>
            <div className="w-7 h-7 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center text-xs font-bold border border-slate-700">
              <Sparkles className="h-4 w-4 animate-spin-slow" />
            </div>
          </div>
        </button>
      </div>

      {/* 3. Client Health & Action Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="cs-split-pane">
        
        {/* Left Side: Client List with Custom Health Scores */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col h-[650px]" id="cs-clients-list-card">
          <div className="mb-4">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Roteiro de Saúde por Cliente</span>
              {healthFilter !== "Todos" && (
                <button 
                  onClick={() => setHealthFilter("Todos")}
                  className="text-[10px] text-zinc-500 hover:text-zinc-900 font-bold underline"
                >
                  Limpar Filtro
                </button>
              )}
            </h3>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input 
                type="text"
                placeholder="Buscar cliente na carteira..."
                value={csSearchTerm}
                onChange={(e) => setCsSearchTerm(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg outline-none focus:border-[#1c2025]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 font-sans">
            {filteredCsClients.map((client) => {
              const MyIcon = client.health.icon;
              return (
                <div 
                  key={client.id}
                  className="p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-white transition-all hover:shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 leading-snug line-clamp-1">{client.name}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">{client.type} • {client.priority}</p>
                    </div>

                    <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border ${client.health.color}`}>
                      <MyIcon className="h-3 w-3" />
                      <span>{client.health.label}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2 border-t border-dashed border-gray-200 text-[10px] text-gray-500">
                    <div>
                      <span className="block font-semibold">Casos Ativos</span>
                      <span className="font-bold text-gray-800">{client.activeCases} processos</span>
                    </div>
                    <div>
                      <span className="block font-semibold">Contato S/C</span>
                      <span className="text-gray-800">{client.lastContact}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Log Interactions & Timeline and Action Plans */}
        <div className="lg:col-span-8 space-y-6" id="cs-timeline-and-plans">
          
          {/* Interaction Logs & Timeline */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm" id="cs-interactions-panel">
            <h3 className="text-xs font-bold text-[#1c2025] uppercase tracking-wider border-b border-gray-100 pb-2.5 mb-4 flex items-center gap-2">
              <UserCheck className="h-4.5 w-4.5 text-[#1c2025]" />
              <span>Histórico de Interações & Termômetro de Satisfação</span>
            </h3>

            {/* Split within interaction panel: form to create interaction and list of interactions */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              
              {/* Log new interaction Form */}
              <form onSubmit={handleAddInteraction} className="md:col-span-5 bg-gray-50 rounded-xl p-4 border border-gray-200 text-xs space-y-3">
                <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest pl-0.5 mb-2">Registrar Atendimento</p>
                
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-1">Selecione o Cliente *</label>
                  <select
                    required
                    value={formClient}
                    onChange={(e) => setFormClient(e.target.value)}
                    className="w-full p-2 border border-blue-100 focus:border-blue-400 bg-white rounded-md h-8 text-[11px]"
                  >
                    <option value="">Selecione...</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-1">Canal</label>
                    <select
                      value={formType}
                      onChange={(e: any) => setFormType(e.target.value)}
                      className="w-full p-1.5 border border-blue-100 bg-white rounded-md h-8 text-[11px]"
                    >
                      <option value="Ligação">Ligação</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="E-mail">E-mail</option>
                      <option value="Reunião Virtual">R. Virtual</option>
                      <option value="Reunião Presencial">R. Presencial</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-1">Satisfação</label>
                    <select
                      value={formSatisfaction}
                      onChange={(e: any) => setFormSatisfaction(e.target.value)}
                      className="w-full p-1.5 border border-blue-100 bg-white rounded-md h-8 text-[11px]"
                    >
                      <option value="Satisfeito">Satisfeito</option>
                      <option value="Neutro">Neutro</option>
                      <option value="Insatisfeito">Insatisfeito</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-1 font-sans">Notas de Alinhamento *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Resuma os pontos tratados, dúvidas e o sentimento..."
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full p-2 border border-blue-100 bg-white rounded-md text-[11px] font-sans resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-[#1c2025] hover:bg-[#3d4757] text-white font-bold rounded-lg text-xs transition-all flex items-center justify-center gap-1 shadow-md"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Gravar Contato</span>
                </button>
              </form>

              {/* Interactions Timeline List */}
              <div className="md:col-span-7 space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                {interactions.map((int) => (
                  <div key={int.id} className="relative pl-5 border-l-2 border-slate-200 pb-1 text-xs">
                    <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-slate-300 border-2 border-white" />
                    
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1c2025] block">{int.clientName}</span>
                      <span className="text-[9px] text-gray-400 font-semibold">{int.date}</span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="font-bold text-slate-500 text-[10px] bg-slate-100 border border-slate-200/55 rounded px-2 py-0.5">
                        {int.type}
                      </span>

                      <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        int.satisfaction === "Satisfeito" 
                          ? "bg-green-50 text-green-700" 
                          : int.satisfaction === "Neutro" 
                            ? "bg-slate-50 text-slate-600" 
                            : "bg-red-50 text-red-600"
                      }`}>
                        {int.satisfaction === "Satisfeito" && <Smile className="h-3 w-3" />}
                        {int.satisfaction === "Neutro" && <Meh className="h-3 w-3" />}
                        {int.satisfaction === "Insatisfeito" && <Frown className="h-3 w-3" />}
                        <span>{int.satisfaction}</span>
                      </span>
                    </div>

                    <p className="text-gray-600 mt-1.5 leading-relaxed text-[11px] font-sans">
                      {int.notes}
                    </p>
                    <p className="text-[9px] text-gray-400 font-semibold mt-1">Consultor: {int.consultant}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Action Plans Preventative */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm" id="cs-action-plans-panel">
            <h3 className="text-xs font-bold text-[#1c2025] uppercase tracking-wider border-b border-gray-100 pb-2.5 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Bookmark className="h-4.5 w-4.5 text-[#1c2025]" />
                <span>Planos de Ação Preventivos (Prevenir Litígios)</span>
              </span>
              <span className="text-[9px] font-bold text-gray-400">Clique no status para progredir</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              
              {/* Render action plans cards lists */}
              <div className="md:col-span-8 space-y-3 max-h-[290px] overflow-y-auto pr-1">
                {actionPlans.map((plan) => (
                  <div 
                    key={plan.id}
                    className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-gray-900 leading-snug">{plan.title}</span>
                        
                        <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider border ${
                          plan.priority === "Alta"
                            ? "bg-red-50 text-red-700 border-red-100 animate-pulse"
                            : plan.priority === "Média"
                              ? "bg-amber-50 text-amber-700 border-amber-100"
                              : "bg-blue-50 text-blue-700 border-blue-100"
                        }`}>
                          {plan.priority}
                        </span>
                      </div>

                      <p className="text-[10px] text-gray-500 font-bold">Cliente: {plan.clientName}</p>
                      
                      <p className="text-gray-600 font-sans text-[11px] leading-relaxed">
                        {plan.description}
                      </p>

                      <div className="flex items-center gap-3 pt-1 border-t border-dashed border-gray-200/60 mt-2 text-[9px] text-gray-400 font-semibold font-sans">
                        <span>Prazo: {plan.dueDate}</span>
                        <span>Designado: {plan.assignedTo}</span>
                      </div>
                    </div>

                    {/* Highly interactive status toggle */}
                    <button
                      onClick={() => togglePlanStatus(plan.id)}
                      className={`px-3 py-2 rounded-lg text-[10px] font-bold border flex flex-col items-center justify-center gap-1 w-24 h-16 shadow-sm transition-all focus:outline-none cursor-pointer hover:scale-105 ${
                        plan.status === "Concluido"
                          ? "bg-green-50 text-green-700 border-green-200 font-bold"
                          : plan.status === "Em Andamento"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-gray-100 text-gray-500 border-gray-200"
                      }`}
                      title="Alterar status"
                    >
                      {plan.status === "Concluido" ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span>Concluído</span>
                        </>
                      ) : plan.status === "Em Andamento" ? (
                        <>
                          <Flame className="h-4 w-4 text-amber-500" />
                          <span>Andamento</span>
                        </>
                      ) : (
                        <>
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>Não Iniciado</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Form to create action plans */}
              <form onSubmit={handleCreateActionPlan} className="md:col-span-4 bg-[#1c2025] text-white rounded-xl p-4 space-y-3 text-xs shadow-lg">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Criar Plano Preventivo</p>
                
                <div>
                  <label className="block text-[9px] font-bold text-gray-300 uppercase tracking-wide mb-1">Título do Plano *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Auditoria de certidões"
                    value={planTitle}
                    onChange={(e) => setPlanTitle(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-gray-300 uppercase tracking-wide mb-1">Cliente *</label>
                  <select
                    required
                    value={planClient}
                    onChange={(e) => setPlanClient(e.target.value)}
                    className="w-full p-1.5 bg-slate-800 border border-slate-700 rounded text-xs font-semibold text-white.5 h-8 text-black"
                  >
                    <option value="">Selecione...</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id} className="text-gray-800">{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] font-bold text-gray-300 uppercase tracking-wide mb-1">Prioridade</label>
                    <select
                      value={planPriority}
                      onChange={(e: any) => setPlanPriority(e.target.value)}
                      className="w-full p-1.5 bg-slate-800 border border-slate-700 rounded text-xs text-white.5 h-8 text-black"
                    >
                      <option value="Alta" className="text-gray-800">Alta</option>
                      <option value="Média" className="text-gray-800">Média</option>
                      <option value="Baixa" className="text-gray-800">Baixa</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-gray-300 uppercase tracking-wide mb-1">Prazo</label>
                    <input
                      type="date"
                      required
                      value={planDueDate}
                      onChange={(e) => setPlanDueDate(e.target.value)}
                      className="w-full px-1.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-xs text-white h-8"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-gray-300 uppercase tracking-wide mb-1 font-sans">Ações Previstas</label>
                  <textarea
                    rows={2}
                    placeholder="Quais as etapas?"
                    value={planDesc}
                    onChange={(e) => setPlanDesc(e.target.value)}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-xs text-white font-sans resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-white hover:bg-slate-100 text-[#1c2025] font-extrabold rounded text-xs tracking-wide shadow transition-all duration-200"
                >
                  Confirmar Plano
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
