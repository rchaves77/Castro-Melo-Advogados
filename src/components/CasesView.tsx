import { useState, FormEvent } from "react";
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  TableProperties, 
  KanbanSquare, 
  AlertTriangle, 
  Clock, 
  Hourglass, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight, 
  X
} from "lucide-react";
import { Process, Client } from "../types";

interface CasesViewProps {
  processes: Process[];
  setProcesses: (processes: Process[]) => void;
  clients: Client[];
}

export default function CasesView({ processes, setProcesses, clients }: CasesViewProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  
  // Form states for adding processes
  const [number, setNumber] = useState("");
  const [action, setAction] = useState("Ação Indenizatória");
  const [clientName, setClientName] = useState("");
  const [court, setCourt] = useState("");
  const [phase, setPhase] = useState("Peticionamento");
  const [nextDeadline, setNextDeadline] = useState("");
  const [deadlineType, setDeadlineType] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [notes, setNotes] = useState("");

  const itemsPerPage = 4;

  // Filter processes based on search
  const filteredProcesses = processes.filter((proc) => {
    return (
      proc.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proc.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proc.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proc.court.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalResults = filteredProcesses.length + 93; // anchor to exact screenshots

  const paginatedProcesses = filteredProcesses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredProcesses.length / itemsPerPage) || 1;

  const handleAddProcess = (e: FormEvent) => {
    e.preventDefault();
    if (!number.trim() || !clientName.trim()) return;

    const newProcess: Process = {
      id: "proc-" + Date.now(),
      number,
      action,
      clientName,
      court,
      phase,
      nextDeadline: nextDeadline ? new Date(nextDeadline).toLocaleDateString("pt-BR") : "Sem prazo ativo",
      deadlineType: deadlineType || "Nenhum",
      isUrgent,
      notes
    };

    setProcesses([newProcess, ...processes]);
    setIsAddModalOpen(false);

    // reset fields
    setNumber("");
    setClientName("");
    setCourt("");
    setNotes("");
  };

  const handleExport = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(processes, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", "processos_castro_melo.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 animate-fade-in" id="cases-view">
      
      {/* Header Info */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4" id="cases-header-toolbar">
        <div>
          <h2 className="text-xl font-bold text-gray-900 font-sans">Processos</h2>
          <p className="text-xs text-gray-500 mt-1">Gestão de contencioso ativo, distribuição tributária e recursos hierárquicos.</p>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-full lg:w-72" id="cases-search-field">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar numeração, cliente..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm transition-colors focus:border-[#1c2025] outline-none"
            id="input-search-processes"
          />
        </div>
      </div>

      {/* Toolbar Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm" id="cases-tab-tools">
        
        {/* Buttons Group */}
        <div className="flex flex-wrap items-center gap-3" id="cases-btn-triggers">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1c2025] text-white rounded-lg text-xs font-bold hover:bg-[#3d4757] transition-all shadow-md cursor-pointer"
            id="btn-add-process"
          >
            <Plus className="h-4 w-4" />
            <span>Novo Processo</span>
          </button>
          
          <div className="h-5 w-px bg-gray-200 mx-1 hidden sm:block" />

          <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-gray-200 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all shadow-sm">
            <Filter className="h-3.5 w-3.5 text-gray-400" />
            <span>Filtros</span>
          </button>
          
          <button 
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-gray-200 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all shadow-sm cursor-pointer"
            id="btn-export-processes"
          >
            <Download className="h-3.5 w-3.5 text-gray-400" />
            <span>Exportar</span>
          </button>
        </div>

        {/* Layout Grid / List format visual toggler (Matches the design screenshot) */}
        <div className="flex items-center gap-2.5 w-full md:w-auto" id="cases-layout-selector">
          <span className="text-xs text-gray-500 font-medium">Visualização:</span>
          <div className="flex bg-gray-100 border border-gray-200 rounded-lg p-1">
            <button className="p-1 px-2.5 bg-white shadow-sm rounded-md text-gray-900 border border-gray-200 flex items-center gap-1 text-[11px] font-bold">
              <TableProperties className="h-3.5 w-3.5" />
              <span>Tabela</span>
            </button>
            <button 
              className="p-1 px-2.5 text-gray-400 hover:text-gray-700 rounded-md transition-all flex items-center gap-1 text-[11px] font-semibold"
              onClick={() => alert("Atalho: Acesse a aba 'Controladoria' na barra lateral para visualizar o Kanban Completo de workflows de peças.")}
            >
              <KanbanSquare className="h-3.5 w-3.5" />
              <span>Kanban</span>
            </button>
          </div>
        </div>

      </div>

      {/* Main Lawsuit table Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col animate-fade-in" id="cases-table-panel">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans">
                <th className="px-6 py-4 font-semibold">Nº do Processo</th>
                <th className="px-6 py-4 font-semibold">Cliente</th>
                <th className="px-6 py-4 font-semibold">Tribunal / Vara</th>
                <th className="px-6 py-4 font-semibold">Fase Atual</th>
                <th className="px-6 py-4 font-semibold">Próximo Prazo</th>
                <th className="px-6 py-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {paginatedProcesses.map((proc) => {
                const isUrgentDeadline = proc.isUrgent || proc.nextDeadline.includes("(D-") || proc.nextDeadline.includes("Hoje");
                
                return (
                  <tr 
                    key={proc.id} 
                    className="hover:bg-gray-50/50 transition-colors group border-l-4 border-transparent hover:border-l-[#d6e0f4] cursor-pointer"
                    onClick={() => {
                      setSelectedProcess(proc);
                    }}
                  >
                    {/* Lawsuit number */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-sans tracking-widest text-[#05080c] font-bold text-sm uppercase">{proc.number}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5 font-medium">{proc.action}</div>
                    </td>

                    {/* Associated Client details */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{proc.clientName}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5 font-mono">CNPJ registrado</div>
                    </td>

                    {/* Court Vara location info */}
                    <td className="px-6 py-4">
                      <div className="text-gray-800 font-medium">{proc.court.split(" - ")[0]}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{proc.court.split(" - ").slice(1).join(" - ")}</div>
                    </td>

                    {/* Operation status badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        proc.phase === "Peticionamento"
                          ? "bg-blue-50 text-blue-700 border border-blue-100"
                          : proc.phase === "Análise"
                            ? "bg-amber-50 text-amber-700 border border-amber-100"
                            : proc.phase === "Triagem"
                              ? "bg-amber-50 text-amber-700 border border-amber-100"
                              : "bg-[#f1dfd5] text-[#50453d] border border-gray-200"
                      }`}>
                        {proc.phase}
                      </span>
                    </td>

                    {/* Calculated Deadline metrics */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {proc.nextDeadline === "Sem prazo ativo" ? (
                        <div className="flex items-center gap-1.5 text-gray-500 italic">
                          <Hourglass className="h-3.5 w-3.5" />
                          <span>Sem prazo ativo</span>
                        </div>
                      ) : (
                        <div>
                          <div className={`flex items-center gap-1.5 font-bold ${
                            isUrgentDeadline ? "text-red-600 font-sans" : "text-gray-900"
                          }`}>
                            {isUrgentDeadline ? <AlertTriangle className="h-3.5 w-3.5 text-red-500" /> : <Clock className="h-3.5 w-3.5 text-gray-400" />}
                            <span>{proc.nextDeadline}</span>
                          </div>
                          <div className="text-[10px] text-gray-400 mt-0.5 font-medium">{proc.deadlineType}</div>
                        </div>
                      )}
                    </td>

                    {/* Details and quick config triggers */}
                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                      <button 
                        className="text-gray-400 hover:text-gray-900 p-1.5 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                        title="Abrir Detalhes"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProcess(proc);
                        }}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Case Table Pagination */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/50" id="cases-pagination-bar">
          <div>
            <p className="text-xs text-gray-500">
              Mostrando <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> a <span className="font-semibold">{Math.min(currentPage * itemsPerPage, filteredProcesses.length)}</span> de <span className="font-semibold">{totalResults}</span> resultados
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 hover:bg-gray-100 border border-gray-200 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`relative z-10 inline-flex items-center px-4 py-2 text-xs font-bold transition-all ${
                    currentPage === idx + 1
                      ? "bg-[#1c2025] text-white font-bold"
                      : "text-gray-700 bg-white hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 hover:bg-gray-100 border border-gray-200 disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </nav>
          </div>
        </div>

      </div>

      {/* --- ADD LAWSUIT / PROCESS MODAL --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" id="modal-add-process">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-base font-bold text-gray-900 font-sans">Cadastrar Novo Processo</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddProcess} className="p-6 space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Número Unificado (CNJ) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 5012345-89.2022.4.03.6100"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Ação / Matéria *</label>
                  <select
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                  >
                    <option value="Ação Indenizatória">Ação Indenizatória</option>
                    <option value="Mandado de Segurança">Mandado de Segurança</option>
                    <option value="Reclamação Trabalhista">Reclamação Trabalhista</option>
                    <option value="Recurso Especial">Recurso Especial</option>
                    <option value="Ação Revisional">Ação Revisional</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Cliente Associado (Física ou CNPJ) *</label>
                <select
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                >
                  <option value="">Selecione o Cliente...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Tribunal de Competência / Vara / Ofício *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: TJSP - 34ª Vara Cível - São Paulo"
                  value={court}
                  onChange={(e) => setCourt(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Fase Processual Inicial</label>
                  <select
                    value={phase}
                    onChange={(e) => setPhase(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                  >
                    <option value="Peticionamento">Peticionamento</option>
                    <option value="Análise">Análise</option>
                    <option value="Triagem">Triagem</option>
                    <option value="Aguardando Julgamento">Aguardando Julgamento</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Próximo Prazo Limite</label>
                  <input
                    type="date"
                    value={nextDeadline}
                    onChange={(e) => setNextDeadline(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Tipo do Prazo</label>
                  <input
                    type="text"
                    placeholder="Ex: Contestação, Réplica, Apelação"
                    value={deadlineType}
                    onChange={(e) => setDeadlineType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div className="flex items-center pt-6 pl-2">
                  <label className="flex items-center gap-2 cursor-pointer font-sans text-xs">
                    <input
                      type="checkbox"
                      checked={isUrgent}
                      onChange={(e) => setIsUrgent(e.target.checked)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500 h-4 w-4"
                    />
                    <span className="font-bold text-red-600 uppercase tracking-wider">Prazo Fatal / Urgente</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Notas Processuais Secundárias</label>
                <textarea
                  placeholder="Informações adicionais corporativas ou sumário processual..."
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100 justify-end">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1c2025] text-white rounded-lg text-xs font-bold hover:bg-[#3d4757]"
                >
                  Cadastrar Processo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DETAIL MODAL FOR DEEP READ --- */}
      {selectedProcess && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" id="modal-process-detail">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-[#1c2025] text-white">
              <div>
                <h3 className="text-sm font-bold font-sans uppercase tracking-widest">{selectedProcess.number}</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">{selectedProcess.action}</p>
              </div>
              <button 
                onClick={() => setSelectedProcess(null)}
                className="p-1 rounded-full text-gray-300 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 font-sans text-xs" id="process-detail-card">
              <div>
                <p className="text-gray-400 uppercase font-semibold text-[9px] tracking-wide">Cliente Requerente/Requerido</p>
                <p className="font-bold text-gray-900 mt-0.5 text-sm">{selectedProcess.clientName}</p>
              </div>

              <div>
                <p className="text-gray-400 uppercase font-semibold text-[9px] tracking-wide">Tribunal de Tramitação / Instrução</p>
                <p className="font-semibold text-gray-800 mt-0.5">{selectedProcess.court}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 uppercase font-semibold text-[9px] tracking-wide">Fase Atual</p>
                  <p className="font-bold text-gray-800 mt-0.5">{selectedProcess.phase}</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase font-semibold text-[9px] tracking-wide">Próximo Prazo / Agenda</p>
                  <p className={`font-bold mt-0.5 ${selectedProcess.isUrgent ? "text-red-600" : "text-gray-900"}`}>
                    {selectedProcess.nextDeadline} ({selectedProcess.deadlineType})
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <p className="text-gray-400 uppercase font-semibold text-[9px] tracking-wide mb-1">Observações processuais internas</p>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg leading-relaxed text-[11px] leading-relaxed border border-gray-100">
                  {selectedProcess.notes || "Nenhuma anotação complementar foi adicionada para este processo de instrução."}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-2 text-xs font-bold">
                <button
                  onClick={() => {
                    if (confirm("Tem certeza que deseja excluir esta ficha processual?")) {
                      setProcesses(processes.filter(p => p.id !== selectedProcess.id));
                      setSelectedProcess(null);
                    }
                  }}
                  className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs"
                >
                  Excluir Ficha
                </button>
                <button
                  onClick={() => setSelectedProcess(null)}
                  className="px-4 py-2 bg-[#1c2025] hover:bg-[#3d4757] rounded-lg text-white"
                >
                  Fechar Detalhes
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
