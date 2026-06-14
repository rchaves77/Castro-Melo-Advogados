import { useState, FormEvent } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  TrendingUp, 
  UserPlus, 
  MoreHorizontal, 
  Edit, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  X,
  Mail,
  Phone,
  MapPin,
  Trash2
} from "lucide-react";
import { Client, ClientStatus } from "../types";

interface ClientsViewProps {
  clients: Client[];
  setClients: (clients: Client[]) => void;
}

export default function ClientsView({ clients, setClients }: ClientsViewProps) {
  // State for filtering, searching, paginating, and modals
  const [selectedFilter, setSelectedFilter] = useState<string>("Todos");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  // Form states for new/edit client
  const [name, setName] = useState("");
  const [type, setType] = useState<"Pessoa Física" | "Pessoa Jurídica">("Pessoa Jurídica");
  const [identifier, setIdentifier] = useState("");
  const [status, setStatus] = useState<ClientStatus>(ClientStatus.ATIVO);
  const [priority, setPriority] = useState<"Alta Prioridade" | "Normal" | "Baixa">("Alta Prioridade");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [editingClientId, setEditingClientId] = useState<string | null>(null);

  // Stats calculation
  const totalActivesNum = clients.filter(c => c.status === ClientStatus.ATIVO).length + 244;
  const monthlyLeadsNum = clients.filter(c => c.status === ClientStatus.LEAD_QUENTE).length + 28;

  // Filter logic
  const filteredClients = clients.filter((client) => {
    // Search filter
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.identifier.includes(searchTerm) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    // Type filter
    if (selectedFilter === "Todos") return true;
    if (selectedFilter === "Ativos") return client.status === ClientStatus.ATIVO;
    if (selectedFilter === "Leads") return client.status === ClientStatus.LEAD_QUENTE;
    if (selectedFilter === "Arquivados") return client.status === ClientStatus.ARQUIVADO;

    return true;
  });

  // Pagination logic
  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage) || 1;
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Init form helper
  const openAddModal = (clientToEdit: Client | null = null) => {
    if (clientToEdit) {
      setEditingClientId(clientToEdit.id);
      setName(clientToEdit.name);
      setType(clientToEdit.type);
      setIdentifier(clientToEdit.identifier);
      setStatus(clientToEdit.status);
      setPriority(clientToEdit.priority);
      setEmail(clientToEdit.email);
      setPhone(clientToEdit.phone);
      setAddress(clientToEdit.address || "");
      setNotes(clientToEdit.notes || "");
    } else {
      setEditingClientId(null);
      setName("");
      setType("Pessoa Jurídica");
      setIdentifier("");
      setStatus(ClientStatus.ATIVO);
      setPriority("Alta Prioridade");
      setEmail("");
      setPhone("");
      setAddress("");
      setNotes("");
    }
    setIsAddModalOpen(true);
  };

  // Submit handler (Creates or updates client)
  const handleSaveClient = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !identifier.trim()) return;

    if (editingClientId) {
      const updated = clients.map((c) => {
        if (c.id === editingClientId) {
          return {
            ...c,
            name,
            type,
            identifier,
            status,
            priority,
            email,
            phone,
            address,
            notes,
            lastContact: "Hoje, " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
          };
        }
        return c;
      });
      setClients(updated);
    } else {
      const newClient: Client = {
        id: "cli-" + Date.now(),
        name,
        type,
        identifier,
        status,
        priority,
        email,
        phone,
        address,
        notes,
        lastContact: "Hoje, " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        activeCases: 0
      };
      setClients([newClient, ...clients]);
    }
    setIsAddModalOpen(false);
  };

  // Delete handler
  const handleDeleteClient = (clientId: string) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      setClients(clients.filter(c => c.id !== clientId));
      setIsDetailModalOpen(false);
    }
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6 animate-fade-in" id="clients-view">
      
      {/* Search Header for Mobile */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4" id="clients-toolbar-header">
        <div>
          <h2 className="text-xl font-bold text-gray-900 font-sans">Clientes</h2>
          <p className="text-xs text-gray-500 mt-1">Diretório integrado de clientes ativos, contatos e leads comerciais.</p>
        </div>

        {/* Client general search input */}
        <div className="relative w-full lg:w-72" id="clients-search-block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, CNPJ, email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm transition-colors focus:border-[#1c2025] outline-none"
            id="input-search-clients"
          />
        </div>
      </div>

      {/* Top action and filter bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm" id="clients-bento-bar">
        {/* Filter Selection Pills */}
        <div className="flex flex-wrap items-center gap-2" id="clients-filter-badges">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-all shadow-sm">
            <Filter className="h-3.5 w-3.5 text-gray-500" />
            <span>Filtros</span>
          </button>
          <div className="h-5 w-px bg-gray-200 mx-2 hidden md:block" />
          
          {["Todos", "Ativos", "Leads", "Arquivados"].map((filterOpt) => (
            <button
              key={filterOpt}
              onClick={() => {
                setSelectedFilter(filterOpt);
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedFilter === filterOpt
                  ? "bg-[#d6e0f4] text-[#121c2a] border border-[#bdc7db] font-semibold"
                  : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {filterOpt}
            </button>
          ))}
        </div>

        {/* Novo Cliente Primary Trigger */}
        <button
          onClick={() => openAddModal()}
          className="flex items-center gap-1.5 px-6 py-2.5 bg-[#1c2025] text-white rounded-lg text-xs font-bold hover:bg-[#3d4757] transition-all shadow-md w-full md:w-auto justify-center cursor-pointer"
          id="btn-add-client"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Cliente</span>
        </button>
      </div>

      {/* Grid: Stats Column + Table list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="clients-main-grid">
        
        {/* Left Side: Summary mini-bento */}
        <div className="lg:col-span-3 flex flex-col gap-4" id="clients-bento-side">
          {/* Stat 1 */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Ativos</p>
              <p className="text-2xl font-bold font-sans text-[#05080c] mt-1">{totalActivesNum}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#d6e0f4] flex items-center justify-center text-[#1c2025]">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>

          {/* Stat 2 */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-semibold">Novos Leads (Mês)</p>
              <p className="text-2xl font-bold font-sans text-[#05080c] mt-1">{monthlyLeadsNum}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
              <UserPlus className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Right Side: Main directory table view */}
        <div className="lg:col-span-9 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col" id="clients-directory-panel">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-sm font-bold text-gray-900 font-sans">Diretório de Clientes</h3>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto" id="clients-table">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans">
                  <th className="py-3 px-5 font-semibold">Nome do Cliente / Empresa</th>
                  <th className="py-3 px-5 font-semibold">Status</th>
                  <th className="py-3 px-5 font-semibold">Último Contato</th>
                  <th className="py-3 px-5 font-semibold">Processos Ativos</th>
                  <th className="py-3 px-5 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-gray-100">
                {paginatedClients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400 font-sans">
                      Nenhum cliente encontrado.
                    </td>
                  </tr>
                ) : (
                  paginatedClients.map((client) => {
                    const isCorporate = client.type === "Pessoa Jurídica";
                    return (
                      <tr key={client.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            {/* Colorful avatar based on client category */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${
                              client.status === ClientStatus.ATIVO
                                ? "bg-[#d6e0f4] text-[#121c2a]"
                                : client.status === ClientStatus.LEAD_QUENTE
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-gray-200 text-gray-600"
                            }`}>
                              {getInitials(client.name)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 hover:text-[#05080c] transition-colors">{client.name}</p>
                              <p className="text-[10px] text-gray-500 mt-0.5 font-mono">{isCorporate ? "CNPJ: " : "CPF: "}{client.identifier}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          {client.status === ClientStatus.ATIVO && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 border border-green-100 text-green-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                              Ativo
                            </span>
                          )}
                          {client.status === ClientStatus.LEAD_QUENTE && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 border border-amber-100 text-amber-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
                              Lead Quente
                            </span>
                          )}
                          {client.status === ClientStatus.ARQUIVADO && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 border border-gray-200 text-gray-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-1.5"></span>
                              Arquivado
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-5 text-gray-500">{client.lastContact}</td>
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{client.status === ClientStatus.ATIVO ? client.activeCases + 4 : "-"}</span>
                            {client.priority === "Alta Prioridade" && client.status === ClientStatus.ATIVO && (
                              <span className="text-[9px] font-bold tracking-wider text-gray-600 bg-gray-100 px-2 py-0.5 rounded uppercase border border-gray-200">
                                Alta Prioridade
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedClient(client);
                                setIsDetailModalOpen(true);
                              }}
                              className="p-1 px-2 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                              title="Visualizar Detalhes"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>Ver</span>
                            </button>
                            <button
                              onClick={() => openAddModal(client)}
                              className="p-1 px-2 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                              title="Editar cliente"
                            >
                              <Edit className="h-3.5 w-3.5" />
                              <span>Editar</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination bar footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between mt-auto" id="clients-pagination">
            <p className="text-xs text-gray-500">
              Mostrando <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> a <span className="font-semibold">{Math.min(currentPage * itemsPerPage, filteredClients.length)}</span> de <span className="font-semibold">{filteredClients.length}</span> clientes
            </p>
            <div className="flex gap-1" id="clients-pagination-buttons">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="p-1.5 text-gray-500 hover:bg-gray-100 border border-transparent hover:border-gray-200 rounded disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded transition-all ${
                    currentPage === idx + 1
                      ? "bg-[#d6e0f4] text-[#121c2a] border border-[#bdc7db] font-bold"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="p-1.5 text-gray-500 hover:bg-gray-100 border border-transparent hover:border-gray-200 rounded disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* --- MODAL 1: ADD / EDIT CLIENT --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" id="modal-add-client">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-base font-bold text-gray-900 font-sans">
                {editingClientId ? "Editar Cliente" : "Adicionar Novo Cliente"}
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClient} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Nome Completo / Empresa *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Construtora Alpha S.A."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Tipo de Pessoa</label>
                  <select
                    value={type}
                    onChange={(e: any) => setType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                  >
                    <option value="Pessoa Jurídica">Pessoa Jurídica (CNPJ)</option>
                    <option value="Pessoa Física">Pessoa Física (CPF)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Documento Identificador (CNPJ / CPF) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 12.345.678/0001-90"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Status Comercial</label>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                  >
                    <option value={ClientStatus.ATIVO}>Ativo</option>
                    <option value={ClientStatus.LEAD_QUENTE}>Lead Quente</option>
                    <option value={ClientStatus.ARQUIVADO}>Arquivado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Prioridade Operacional</label>
                  <select
                    value={priority}
                    onChange={(e: any) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                  >
                    <option value="Alta Prioridade">Alta Prioridade</option>
                    <option value="Normal">Normal</option>
                    <option value="Baixa">Baixa</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">E-mail para Notificações</label>
                  <input
                    type="email"
                    placeholder="Ex: contato@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Telefone para Contato</label>
                  <input
                    type="tel"
                    placeholder="Ex: (11) 98765-4321"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Endereço Comercial</label>
                <input
                  type="text"
                  placeholder="Ex: Av. Paulista, 1000 - São Paulo, SP"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Observações Internas (Notas em Briefing)</label>
                <textarea
                  placeholder="Histórico comercial do cliente, áreas demandantes, etc..."
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
                  Confirmar e Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: CLIENT DETAILS VIEW --- */}
      {isDetailModalOpen && selectedClient && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" id="modal-client-details">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-[#1c2025] text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center font-bold">
                  {getInitials(selectedClient.name)}
                </div>
                <div>
                  <h3 className="text-sm font-bold font-sans">{selectedClient.name}</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">{selectedClient.type}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1 rounded-full text-gray-300 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4" id="client-detail-fields">
              <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                <div>
                  <p className="text-gray-400 uppercase font-semibold text-[9px] tracking-wide">Documento</p>
                  <p className="font-bold text-gray-900 mt-0.5">{selectedClient.identifier}</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase font-semibold text-[9px] tracking-wide">Prioridade Interna</p>
                  <p className="font-bold text-gray-900 mt-0.5">{selectedClient.priority}</p>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-gray-100 text-xs font-sans">
                <div className="flex items-center gap-2.5 text-gray-600">
                  <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span>{selectedClient.email || "E-mail não cadastrado"}</span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-600">
                  <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span>{selectedClient.phone || "Fone não cadastrado"}</span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span>{selectedClient.address || "Endereço não cadastrado"}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 text-xs font-sans">
                <p className="text-gray-400 uppercase font-semibold text-[9px] tracking-wide mb-1">Notas Internas & Briefing</p>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg leading-relaxed text-[11px] leading-relaxed border border-gray-100">
                  {selectedClient.notes || "Sem anotações complementares registradas para este cliente."}
                </p>
              </div>

              <div className="pt-5 border-t border-gray-100 flex gap-2 justify-between">
                <button
                  onClick={() => {
                    handleDeleteClient(selectedClient.id);
                  }}
                  className="flex items-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-all border border-red-100 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Excluir</span>
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      openAddModal(selectedClient);
                    }}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs text-gray-700 transition-all font-bold cursor-pointer"
                  >
                    Editar Cadastro
                  </button>
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="px-4 py-2 bg-[#1c2025] hover:bg-[#3d4757] rounded-lg text-xs text-white font-bold transition-all cursor-pointer"
                  >
                    Fechar
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
