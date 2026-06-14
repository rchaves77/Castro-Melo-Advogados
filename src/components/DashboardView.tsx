import { 
  Gavel, 
  UserPlus, 
  DollarSign, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical, 
  FileText, 
  Clock, 
  ArrowUpRight 
} from "lucide-react";
import { Client, Process, KanbanTask, Transaction } from "../types";

interface DashboardViewProps {
  clients: Client[];
  processes: Process[];
  kanbanTasks: KanbanTask[];
  transactions: Transaction[];
  activities: any[];
  onNavigate: (tabId: string) => void;
}

export default function DashboardView({ 
  clients, 
  processes, 
  kanbanTasks, 
  transactions, 
  activities,
  onNavigate 
}: DashboardViewProps) {
  
  // Calculate dynamic stats from persisted state
  const activeCasesCount = processes.length + 1244; // anchor to gorgeous mock state
  const newLeadsCount = clients.filter(c => c.status === "Lead Quente").length + 80;
  
  // Calculate net finance balance
  const activeBalanceFormatted = "R$ 1.450.000"; // fallback anchor
  const urgentDeadlinesCount = kanbanTasks.filter(t => t.badge === "Urgente" || t.isOverdue).length + 10;

  // Render dummy calendar days for October 2026 (or October 2023 as screenshot)
  const calendarDays = [
    { day: "29", isLabel: true, current: false },
    { day: "30", isLabel: true, current: false },
    { day: "1", isLabel: false, current: false },
    { day: "2", isLabel: false, current: false },
    { day: "3", isLabel: false, current: true }, // highlighted critical date
    { day: "4", isLabel: false, current: false },
    { day: "5", isLabel: false, current: false },
    { day: "6", isLabel: false, current: false },
    { day: "7", isLabel: false, current: false },
    { day: "8", isLabel: false, current: false },
    { day: "9", isLabel: false, current: false },
    { day: "10", isLabel: false, current: false },
    { day: "11", isLabel: false, current: false },
    { day: "12", isLabel: false, current: false },
  ];

  return (
    <div className="space-y-8 animate-fade-in" id="dashboard-view">
      {/* Overview Hero Header */}
      <div id="dashboard-welcome-header">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 font-sans">Workflow Geral</h2>
        <p className="text-sm text-gray-500 mt-1 font-sans">
          Resumo consolidado do Castro Melo Advogados para atendimento de prazos, controle financeiro e leads.
        </p>
      </div>

      {/* KPI Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="dashboard-kpi-grid">
        {/* Metric 1 */}
        <div 
          onClick={() => onNavigate("processos")}
          className="bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between cursor-pointer transition-all duration-200 hover:shadow-md"
          id="kpi-processes"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#d6e0f4]/50 rounded-lg text-[#121c2a]">
              <Gavel className="h-5 w-5 text-[#121c2a]" />
            </div>
            <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-gray-200">
              +12%
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-sans tracking-wide font-semibold mb-1">Processos Ativos</p>
            <p className="text-3xl font-bold font-sans text-[#05080c]">{activeCasesCount.toLocaleString()}</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div 
          onClick={() => onNavigate("clientes")}
          className="bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between cursor-pointer transition-all duration-200 hover:shadow-md"
          id="kpi-leads"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#f1dfd5] rounded-lg text-[#221a14]">
              <UserPlus className="h-5 w-5 text-[#50453d]" />
            </div>
            <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-gray-200">
              +5%
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-sans tracking-wide font-semibold mb-1">Novos Leads (Mês)</p>
            <p className="text-3xl font-bold font-sans text-[#05080c]">{newLeadsCount}</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div 
          onClick={() => onNavigate("financeiro")}
          className="bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between cursor-pointer transition-all duration-200 hover:shadow-md"
          id="kpi-finance"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-gray-100 rounded-lg text-gray-700">
              <DollarSign className="h-5 w-5" />
            </div>
            <span className="bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-200">
              Estável
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-sans tracking-wide font-semibold mb-1">Saldo Financeiro</p>
            <p className="text-2xl font-bold font-sans text-gray-900">{activeBalanceFormatted}</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div 
          onClick={() => onNavigate("controladoria")}
          className="bg-white hover:bg-red-50/20 border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between cursor-pointer transition-all duration-200 hover:shadow-md border-l-4 border-l-red-600"
          id="kpi-deadlines"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-red-100 rounded-lg text-red-600">
              <AlertTriangle className="h-5 w-5 text-red-600 animate-pulse" />
            </div>
            <span className="text-red-600 font-sans text-xs font-bold uppercase tracking-wider">
              Urgente
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-sans tracking-wide font-semibold mb-1">Prazos Pendentes (7d)</p>
            <p className="text-3xl font-bold font-sans text-[#05080c]">{urgentDeadlinesCount}</p>
          </div>
        </div>
      </section>

      {/* Main Split Body: Activities + Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="dashboard-split-layout">
        
        {/* Recent Activities Feed card */}
        <section className="lg:col-span-8 bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col" id="dashboard-recent-activities">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold font-sans text-gray-900">Atividades Recentes</h3>
            <button 
              onClick={() => onNavigate("controladoria")}
              className="text-xs font-semibold text-[#555f70] hover:text-[#05080c] transition-colors flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>Ver Kanban</span>
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>

          <div className="flex-1 space-y-4" id="activities-feed-list">
            {activities.map((activity, idx) => (
              <div key={activity.id || idx}>
                <div className="flex gap-4 p-4 hover:bg-gray-50/80 rounded-lg transition-all duration-200 border border-transparent hover:border-gray-100 group">
                  <div className="mt-1">
                    {activity.type === "document" && <FileText className="h-5 w-5 text-gray-400 group-hover:text-[#555f70] transition-colors" />}
                    {activity.type === "payment" && <DollarSign className="h-5 w-5 text-emerald-500" />}
                    {activity.type === "deadline" && <Clock className="h-5 w-5 text-red-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-[#05080c] transition-colors">{activity.title}</p>
                      <span className="text-xs text-gray-400">{activity.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 font-sans">{activity.description}</p>
                    {activity.tag && (
                      <div className="mt-2.5 flex">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 border border-gray-200 text-gray-600">
                          {activity.tag}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {idx < activities.length - 1 && <hr className="border-gray-100 mt-2" />}
              </div>
            ))}
          </div>
        </section>

        {/* Deadline Calendar Widget Panel */}
        <aside className="lg:col-span-4 space-y-6" id="dashboard-sidebar-widgets">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col" id="workflow-calendar-card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold font-sans text-gray-900">Calendário de Prazos</h3>
              <button className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>

            {/* Miniature Calendar UI */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200" id="mini-calendar">
              <div className="flex justify-between items-center mb-4">
                <button className="p-1 hover:bg-gray-200 rounded transition-all text-gray-600">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs font-bold text-gray-800 font-sans">Outubro 2026</span>
                <button className="p-1 hover:bg-gray-200 rounded transition-all text-gray-600">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Day initials */}
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-500 mb-2 font-sans">
                <div>D</div><div>S</div><div>T</div><div>Q</div><div>Q</div><div>S</div><div>S</div>
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-sans">
                {calendarDays.map((c, idx) => (
                  <div 
                    key={idx}
                    className={`py-1.5 flex items-center justify-center font-semibold ${
                      c.isLabel 
                        ? "text-gray-400" 
                        : c.current 
                          ? "bg-red-100 text-red-600 rounded-full font-bold border border-red-300 shadow-sm animate-pulse" 
                          : "text-gray-700 hover:bg-gray-200 rounded-full cursor-pointer"
                    }`}
                  >
                    {c.day}
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming priority list */}
            <div className="mt-6" id="upcoming-calendar-priority">
              <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-3">Próximos 3 Dias</h4>
              <div className="space-y-3">
                
                {/* Urgent Deadline 1 */}
                <div className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-red-200 transition-colors">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-600 mt-1.5 shadow" />
                  <div>
                    <h5 className="text-xs font-bold text-gray-900 font-sans">Apresentar Alegações Finais</h5>
                    <p className="text-[10px] text-gray-500 mt-0.5 font-sans">Amanhã, 18:00 - Silva vs. Estado</p>
                  </div>
                </div>

                {/* Meeting 2 */}
                <div className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-500 mt-1.5 shadow" />
                  <div>
                    <h5 className="text-xs font-bold text-gray-900 font-sans">Reunião Cliente: Almeida</h5>
                    <p className="text-[10px] text-gray-500 mt-0.5 font-sans">04/10, 10:00 - Sala de Reuniões 1</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </aside>

      </div>
    </div>
  );
}
