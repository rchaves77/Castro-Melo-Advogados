import { useState, FormEvent } from "react";
import { 
  Filter, 
  Plus, 
  AlertTriangle, 
  Paperclip, 
  Clock, 
  CheckSquare, 
  ArrowRight, 
  X, 
  Check, 
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  Trash2
} from "lucide-react";
import { KanbanTask } from "../types";

interface ControladoriaViewProps {
  kanbanTasks: KanbanTask[];
  setKanbanTasks: (tasks: KanbanTask[]) => void;
  clients: { name: string }[];
}

export default function ControladoriaView({ kanbanTasks, setKanbanTasks, clients }: ControladoriaViewProps) {
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>("Todos");

  // Form states for creating a task
  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [badge, setBadge] = useState<"Intimação" | "Urgente" | "Contestação" | "Recurso Especial" | "Geral">("Intimação");
  const [column, setColumn] = useState<"triagem" | "elaboracao" | "revisao" | "peticionamento">("triagem");
  const [hasAttachment, setHasAttachment] = useState(false);
  const [lawyersInput, setLawyersInput] = useState("AM");
  const [deadline, setDeadline] = useState("Hoje, 14:00");
  const [progress, setProgress] = useState<number>(0);

  const columns = [
    { id: "triagem", label: "Triagem Inicial", color: "border-t-2 border-t-[#d6e0f4]" },
    { id: "elaboracao", label: "Elaboração de Peça", color: "border-t-2 border-t-amber-500" },
    { id: "revisao", label: "Revisão (Sênior)", color: "border-t-2 border-t-red-500" },
    { id: "peticionamento", label: "Peticionamento / Protocolo", color: "border-t-2 border-t-green-600" },
  ];

  // Helper to filter tasks by type/badge
  const filteredTasks = kanbanTasks.filter((task) => {
    if (filterType === "Todos") return true;
    return task.badge === filterType;
  });

  const getColCount = (colId: string) => filteredTasks.filter(t => t.column === colId).length;

  // Handler to cycle columns directly with a click (exceptional UX in sandboxed iframe)
  const moveTask = (taskId: string, direction: "next" | "prev") => {
    const colOrder: ("triagem" | "elaboracao" | "revisao" | "peticionamento")[] = [
      "triagem",
      "elaboracao",
      "revisao",
      "peticionamento"
    ];
    
    const updated = kanbanTasks.map((t) => {
      if (t.id === taskId) {
        const currIndex = colOrder.indexOf(t.column);
        let nextIndex = currIndex;
        if (direction === "next" && currIndex < colOrder.length - 1) {
          nextIndex = currIndex + 1;
        } else if (direction === "prev" && currIndex > 0) {
          nextIndex = currIndex - 1;
        }
        return { ...t, column: colOrder[nextIndex] };
      }
      return t;
    });
    setKanbanTasks(updated);
  };

  const handleCreateTask = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !clientName) return;

    const newTask: KanbanTask = {
      id: "tsk-" + Date.now(),
      title,
      clientName,
      badge,
      column,
      hasAttachment,
      lawyers: lawyersInput.split(",").map(s => s.trim().toUpperCase()).filter(Boolean),
      deadline,
      progress: progress > 0 ? progress : undefined,
      subtasksDone: progress > 0 ? Math.floor(progress / 20) : undefined,
      subtasksTotal: progress > 0 ? 5 : undefined
    };

    setKanbanTasks([newTask, ...kanbanTasks]);
    setIsNewTaskModalOpen(false);

    // reset fields
    setTitle("");
    setClientName("");
    setDeadline("Hoje, 14:00");
    setProgress(0);
    setHasAttachment(false);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm("Deseja realmente remover esta tarefa do workflow?")) {
      setKanbanTasks(kanbanTasks.filter(t => t.id !== taskId));
      setSelectedTask(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="controladoria-view">
      
      {/* Context Top Header & Metric Bento widgets list */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4" id="controladoria-header">
        <div>
          <h2 className="text-xl font-bold text-gray-900 font-sans">Workflow Operacional</h2>
          <p className="text-xs text-gray-500 mt-1">Gestão de prazos processuais e delegação de tarefas de elaboração de peças em Kanban.</p>
        </div>

        {/* Filters and action triggers */}
        <div className="flex items-center gap-3 w-full lg:w-auto" id="controladoria-actions">
          <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 text-xs" id="workflow-quick-filter">
            <span className="px-2 text-gray-400"><Filter className="h-3.5 w-3.5" /></span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent border-none py-1 pl-1 pr-6 font-semibold text-gray-700 outline-none focus:ring-0 text-[11px]"
            >
              <option value="Todos">Todas Peças</option>
              <option value="Intimação">Intimações</option>
              <option value="Urgente">Urgentes</option>
              <option value="Contestação">Contestações</option>
              <option value="Recurso Especial">R. Especiais</option>
            </select>
          </div>

          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1c2025] text-white rounded-lg text-xs font-bold hover:bg-[#3d4757] transition-all shadow-md cursor-pointer"
            id="btn-add-task"
          >
            <Plus className="h-4 w-4" />
            <span>Nova Tarefa</span>
          </button>
        </div>
      </div>

      {/* Bento Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="controladoria-kpis-summary">
        {/* Metric 1 */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Prazos Fatais (Hoje)</p>
            <p className="text-2xl font-bold font-sans text-red-600 mt-1">12</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Protocolos Pendentes</p>
            <p className="text-2xl font-bold font-sans text-[#05080c] mt-1">45</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-[#d6e0f4] flex items-center justify-center text-[#1c2025]">
            <Paperclip className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Análises Concluídas</p>
            <p className="text-2xl font-bold font-sans text-emerald-600 mt-1">28</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700">
            <FileCheck2 className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Produtividade Equipe</p>
            <p className="text-2xl font-bold font-sans text-[#05080c] mt-1">87%</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="overflow-x-auto pb-4" id="kanban-scrollable">
        <div className="flex gap-6 min-w-[1000px] h-[calc(100vh-320px)]" id="kanban-columns-container">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter(t => t.column === col.id);
            return (
              <div 
                key={col.id} 
                className="flex-1 min-w-[280px] bg-gray-50 border border-gray-200 rounded-xl flex flex-col max-h-full overflow-hidden shadow-sm"
                id={`kanban-column-card-${col.id}`}
              >
                {/* Column header */}
                <div className={`p-4 border-b border-gray-200 flex justify-between items-center bg-gray-100/50 rounded-t-xl ${col.color}`}>
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
                    <span>{col.label}</span>
                    <span className="bg-white border border-gray-200 text-gray-500 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      {getColCount(col.id)}
                    </span>
                  </h3>
                </div>

                {/* Task card list inside column */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4" id={`kanban-column-[${col.id}]-tasks`}>
                  {colTasks.length === 0 ? (
                    <div className="h-32 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-center p-6 text-gray-400 text-xs font-sans">
                      Arraste ou clique para mover tarefas para esta coluna
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const isUrgent = task.badge === "Urgente" || task.isOverdue;
                      return (
                        <div
                          key={task.id}
                          className={`bg-white rounded-lg p-4 border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer hover:-translate-y-0.5 border-l-4 ${
                            isUrgent 
                              ? "border-l-red-500" 
                              : task.badge === "Intimação"
                                ? "border-l-[#d6e0f4]"
                                : task.badge === "Contestação"
                                  ? "border-l-amber-400"
                                  : "border-l-slate-400"
                          }`}
                          onClick={() => setSelectedTask(task)}
                          id={`task-card-${task.id}`}
                        >
                          <div className="flex justify-between items-start mb-2.5">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              task.badge === "Urgente"
                                ? "bg-red-50 text-red-700 border border-red-100 animate-pulse"
                                : task.badge === "Intimação"
                                  ? "bg-[#d6e0f4] text-[#1c2025] font-semibold border border-transparent"
                                  : "bg-gray-100 text-gray-600 border border-gray-200 font-semibold"
                            }`}>
                              {task.badge}
                            </span>
                            
                            {task.hasAttachment && <Paperclip className="h-3.5 w-3.5 text-gray-400" />}
                          </div>

                          <h4 className="text-xs font-bold text-gray-900 leading-snug line-clamp-2 hover:text-[#05080c] transition-colors">
                            {task.title}
                          </h4>
                          
                          <p className="text-[10px] text-gray-400 mt-1 font-medium font-sans">
                            Cliente: {task.clientName}
                          </p>

                          {/* Task progress indicator */}
                          {task.progress !== undefined && (
                            <div className="mt-3 space-y-1">
                              <div className="flex justify-between text-[9px] font-semibold text-gray-400">
                                <span>Elaboração de peça</span>
                                <span>{task.subtasksDone}/{task.subtasksTotal} subetapas</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-1">
                                <div className="bg-[#1c2025] h-1 rounded-full" style={{ width: `${task.progress}%` }}></div>
                              </div>
                            </div>
                          )}

                          {/* Task action controls row */}
                          <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-4">
                            {/* Lawyer avatar list */}
                            <div className="flex -space-x-1.5 overflow-hidden">
                              {task.lawyers.map((layIn) => (
                                <div 
                                  key={layIn}
                                  className="w-5 h-5 rounded-full bg-gray-800 text-white flex items-center justify-center text-[9px] font-bold border border-white"
                                  title={`Advogado Responsável: ${layIn}`}
                                >
                                  {layIn}
                                </div>
                              ))}
                            </div>

                            {/* Cycle arrows for exceptional UX inside dev iframe tool */}
                            <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => moveTask(task.id, "prev")}
                                disabled={task.column === "triagem"}
                                className="p-1 rounded text-gray-400 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                                title="Mover para a esquerda"
                              >
                                <ArrowLeft className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => moveTask(task.id, "next")}
                                disabled={task.column === "peticionamento"}
                                className="p-1 rounded text-gray-400 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                                title="Mover para a direita"
                              >
                                <ArrowRight className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>

                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- WORKFLOW MODAL 1: ADD TASK --- */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" id="modal-add-task">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-base font-bold text-gray-900 font-sans">Cadastrar Nova Peça no Kanban</h3>
              <button 
                onClick={() => setIsNewTaskModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Título Curto do Prazo / Peça *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Redigir Contestação Trabalhista - Reclamante: João"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Cliente Relacionado *</label>
                  <select
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                  >
                    <option value="">Selecione...</option>
                    {clients.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Categoria (Badge)</label>
                  <select
                    value={badge}
                    onChange={(e: any) => setBadge(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                  >
                    <option value="Intimação">Intimação</option>
                    <option value="Urgente">Urgente</option>
                    <option value="Contestação">Contestação</option>
                    <option value="Recurso Especial">Recurso Especial</option>
                    <option value="Geral">Geral</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Etapa do Kanban</label>
                  <select
                    value={column}
                    onChange={(e: any) => setColumn(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                  >
                    <option value="triagem">Triagem Inicial</option>
                    <option value="elaboracao">Elaboração de Peça</option>
                    <option value="revisao">Revisão (Sênior)</option>
                    <option value="peticionamento">Peticionamento / Protocolo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Iniciais Advogados (Separado por vírgula)</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: AM, LS, PR"
                    value={lawyersInput}
                    onChange={(e) => setLawyersInput(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Texto de Prazo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 15 Nov, D-2, Hoje, 14:00"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Progresso Inicial (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Deixe em branco ou 0 para ocultar"
                    value={progress || ""}
                    onChange={(e) => setProgress(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-sans"
                  />
                </div>
              </div>

              <div className="flex items-center pl-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-sans font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={hasAttachment}
                    onChange={(e) => setHasAttachment(e.target.checked)}
                    className="rounded border-gray-300 text-[#1c2025] focus:ring-[#1c2025] h-4 w-4"
                  />
                  <span>Contém Arquivo Anexo de Cópia de Intimação</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100 justify-end">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1c2025] text-white rounded-lg text-xs font-bold hover:bg-[#3d4757]"
                >
                  Confirmar e Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- WORKFLOW MODAL 2: TAST DETAILS & CYCLING OPTIONS --- */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" id="modal-task-details">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 max-w-sm w-full overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-[#1c2025] text-white">
              <div>
                <span className="text-[9px] font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded-full uppercase">
                  {selectedTask.badge}
                </span>
                <p className="text-[10px] text-gray-400 mt-1 font-medium">Ficha do Kanban</p>
              </div>
              <button 
                onClick={() => setSelectedTask(null)}
                className="p-1 rounded-full text-gray-300 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 font-sans text-xs" id="task-detail-card">
              <div>
                <p className="text-gray-400 uppercase font-semibold text-[9px] tracking-wide">Descrição / Enunciado</p>
                <p className="font-bold text-gray-900 mt-1 text-sm leading-relaxed">{selectedTask.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 uppercase font-semibold text-[9px] tracking-wide">Cliente Relacionado</p>
                  <p className="font-bold text-gray-800 mt-0.5">{selectedTask.clientName}</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase font-semibold text-[9px] tracking-wide">Data Limite / Prazo</p>
                  <p className="font-bold text-red-600 mt-0.5">{selectedTask.deadline}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-400 uppercase font-semibold text-[9px] tracking-wide">Advogados Responsáveis</p>
                <p className="font-bold text-gray-800 mt-0.5">{selectedTask.lawyers.join(", ")}</p>
              </div>

              {selectedTask.progress !== undefined && (
                <div>
                  <p className="text-gray-400 uppercase font-semibold text-[9px] tracking-wide">Progresso de Redação</p>
                  <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
                    <div className="bg-[#1c2025] h-2 rounded-full" style={{ width: `${selectedTask.progress}%` }}></div>
                  </div>
                  <p className="text-[9px] text-gray-400 text-right mt-1 font-semibold">
                    {selectedTask.progress}% ({selectedTask.subtasksDone}/{selectedTask.subtasksTotal} etapas prontas)
                  </p>
                </div>
              )}

              {/* Directly move columns selection box inside details card */}
              <div className="pt-3 border-t border-gray-100">
                <p className="text-gray-400 uppercase font-semibold text-[9px] tracking-wide mb-2">Alterar Etapa Operacional</p>
                <div className="grid grid-cols-2 gap-2" id="task-reposition-grid">
                  <button
                    disabled={selectedTask.column === "triagem"}
                    onClick={() => {
                      moveTask(selectedTask.id, "prev");
                      setSelectedTask({ ...selectedTask, column: selectedTask.column === "elaboracao" ? "triagem" : selectedTask.column === "revisao" ? "elaboracao" : "revisao" });
                    }}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-md border border-gray-200 transition-all text-[11px] disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Voltar Etapa</span>
                  </button>
                  <button
                    disabled={selectedTask.column === "peticionamento"}
                    onClick={() => {
                      moveTask(selectedTask.id, "next");
                      setSelectedTask({ ...selectedTask, column: selectedTask.column === "triagem" ? "elaboracao" : selectedTask.column === "elaboracao" ? "revisao" : "peticionamento" });
                    }}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#d6e0f4] hover:bg-[#bdc7db] text-[#121c2a] font-bold rounded-md border border-[#bdc7db] transition-all text-[11px] disabled:opacity-30 cursor-pointer"
                  >
                    <span>Avançar</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-between gap-2">
                <button
                  onClick={() => handleDeleteTask(selectedTask.id)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs transition-all border border-red-100 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Remover</span>
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="px-5 py-2 bg-[#1c2025] hover:bg-[#3d4757] rounded-lg text-white font-bold transition-all cursor-pointer"
                  >
                    Fechar Ficha
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
