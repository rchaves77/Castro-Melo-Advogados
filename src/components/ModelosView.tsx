import { useState, FormEvent } from "react";
import { 
  FileText, 
  Search, 
  Copy, 
  Check, 
  ExternalLink, 
  Plus, 
  X, 
  Edit, 
  BookOpen, 
  CornerDownRight 
} from "lucide-react";
import { TemplateDocument } from "../types";

interface ModelosViewProps {
  templates: TemplateDocument[];
  setTemplates: (templates: TemplateDocument[]) => void;
}

export default function ModelosView({ templates, setTemplates }: ModelosViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateDocument | null>(templates[0] || null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editorContent, setEditorContent] = useState<string>("");
  const [isNewTemplateModalOpen, setIsNewTemplateModalOpen] = useState<boolean>(false);

  // New template states
  const [newTitle, setNewTitle] = useState("");
  const [newCat, setNewCat] = useState<"Petições Iniciais" | "Contratos" | "Recursos" | "Contestações" | "Procurações">("Petições Iniciais");
  const [newDesc, setNewDesc] = useState("");
  const [newCont, setNewCont] = useState("");

  const categories = ["Todos", "Petições Iniciais", "Contratos", "Recursos", "Contestações", "Procurações"];

  // Filter templates
  const filteredTemplates = templates.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    if (selectedCategory === "Todos") return true;
    return t.category === selectedCategory;
  });

  const handleCopy = () => {
    if (!selectedTemplate) return;
    navigator.clipboard.writeText(selectedTemplate.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startEdit = () => {
    if (!selectedTemplate) return;
    setEditorContent(selectedTemplate.content);
    setIsEditing(true);
  };

  const saveEdit = () => {
    if (!selectedTemplate) return;
    const updated = templates.map((t) => {
      if (t.id === selectedTemplate.id) {
        return {
          ...t,
          content: editorContent,
          lastUpdated: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
        };
      }
      return t;
    });
    setTemplates(updated);
    
    // update current selected
    setSelectedTemplate({
      ...selectedTemplate,
      content: editorContent,
      lastUpdated: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
    });
    
    setIsEditing(false);
  };

  const handleCreateTemplate = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newDoc: TemplateDocument = {
      id: "doc-" + Date.now(),
      title: newTitle,
      category: newCat,
      description: newDesc,
      content: newCont || `EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO...\n\nQualificação do cliente...\n\nBreve descrição do caso...\n\nPedidos finais.`,
      lastUpdated: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      authorInitials: "CM"
    };

    setTemplates([newDoc, ...templates]);
    setSelectedTemplate(newDoc);
    setIsNewTemplateModalOpen(false);

    // reset forms
    setNewTitle("");
    setNewDesc("");
    setNewCont("");
  };

  return (
    <div className="space-y-6 animate-fade-in" id="modelos-view">
      
      {/* Header Info */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4" id="modelos-header-toolbar">
        <div>
          <h2 className="text-xl font-bold text-gray-900 font-sans">Modelos e Peças</h2>
          <p className="text-xs text-gray-500 mt-1">Biblioteca integrada de minutas jurídicas, petições padrão e contratos homologados.</p>
        </div>

        {/* Global Catalog Search field */}
        <div className="relative w-full lg:w-72" id="modelos-search-input">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar modelo de petição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm transition-colors focus:border-[#1c2025] outline-none font-sans"
            id="input-search-templates"
          />
        </div>
      </div>

      {/* Category Pills and New template action button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm" id="templates-tools-bar">
        {/* Category Pills lists */}
        <div className="flex flex-wrap items-center gap-2" id="templates-category-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-[#d6e0f4] text-[#121c2a] border border-[#bdc7db] font-semibold"
                  : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* New Template Primary Action */}
        <button
          onClick={() => setIsNewTemplateModalOpen(true)}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-[#1c2025] text-white rounded-lg text-xs font-bold hover:bg-[#3d4757] transition-all shadow-md w-full md:w-auto justify-center cursor-pointer"
          id="btn-add-template"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Modelo</span>
        </button>
      </div>

      {/* Screen Split layout: Model list / active reader-writer panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="modelos-split-grid">
        
        {/* LEFT column: List of template files */}
        <div className="lg:col-span-5 space-y-4 max-h-[calc(100vh-270px)] overflow-y-auto pr-1" id="templates-catalog">
          {filteredTemplates.length === 0 ? (
            <div className="bg-white rounded-xl p-8 border border-gray-200 text-center text-gray-400 text-xs font-sans">
              Nenhum template de modelo encontrado nesta categoria.
            </div>
          ) : (
            filteredTemplates.map((temp) => (
              <div
                key={temp.id}
                onClick={() => {
                  setSelectedTemplate(temp);
                  setIsEditing(false);
                }}
                className={`p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${
                  selectedTemplate?.id === temp.id 
                    ? "border-2 border-[#1c2025] ring-2 ring-gray-100" 
                    : "border-gray-200 hover:bg-gray-50/50"
                }`}
                id={`template-item-${temp.id}`}
              >
                <div className="flex gap-3">
                  <div className={`p-2.5 rounded-lg flex-shrink-0 ${
                    selectedTemplate?.id === temp.id ? "bg-[#d6e0f4] text-[#1c2025]" : "bg-gray-100 text-gray-500"
                  }`}>
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 leading-snug line-clamp-1">{temp.title}</h4>
                    <p className="text-[10px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">{temp.description}</p>
                    
                    <div className="flex items-center justify-between mt-3 flex-wrap gap-2 pt-2 border-t border-gray-100">
                      <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full text-gray-500 bg-gray-100 border border-gray-200 font-sans">
                        {temp.category}
                      </span>
                      <span className="text-[9px] text-gray-400 font-medium">Att: {temp.lastUpdated}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* RIGHT column: Document Clause Viewer / Editor (Extremely premium!) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-270px)]" id="template-clause-editor">
          {selectedTemplate ? (
            <div className="flex flex-col h-full">
              {/* Header tools */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-gray-500" />
                  <div>
                    <h3 className="text-xs font-bold text-gray-900 line-clamp-1">{selectedTemplate.title}</h3>
                    <p className="text-[9px] text-gray-400 flex items-center gap-1 font-sans">
                      <CornerDownRight className="h-3 w-3" />
                      <span>{selectedTemplate.category} • Atualizado em {selectedTemplate.lastUpdated}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-md text-[11px] font-bold transition-all shadow-sm cursor-pointer"
                    id="btn-copy-template"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-green-600" />
                        <span className="text-green-600">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copiar Cláusulas</span>
                      </>
                    )}
                  </button>

                  {isEditing ? (
                    <button
                      onClick={saveEdit}
                      className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-[11px] font-bold transition-all shadow-md cursor-pointer"
                    >
                      Salvar Cláusula
                    </button>
                  ) : (
                    <button
                      onClick={startEdit}
                      className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-md text-[11px] font-bold transition-all shadow-sm cursor-pointer"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      <span>Editar Minuta</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Editable/Readable Body workspace */}
              <div className="flex-1 p-6 overflow-y-auto bg-gray-50/80 font-mono text-[11px] leading-relaxed select-text" id="document-textarea-wrapper">
                {isEditing ? (
                  <textarea
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    className="w-full h-full bg-white p-4 border border-gray-300 rounded-lg shadow-inner outline-none font-mono resize-none text-[11px] leading-relaxed text-gray-800"
                    id="editor-textarea-field"
                  />
                ) : (
                  <pre className="whitespace-pre-wrap text-gray-700 bg-white border border-gray-200 rounded-lg p-6 font-mono leading-relaxed select-text">
                    {selectedTemplate.content}
                  </pre>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-400" id="empty-editor-prompt">
              <FileText className="h-12 w-12 text-gray-300 mb-2 pointer-events-none" />
              <p className="text-xs font-sans">Selecione uma peça ou minuta da lista para leitura e edição.</p>
            </div>
          )}
        </div>

      </div>

      {/* --- ADD NEW TEMPLATE MODAL --- */}
      {isNewTemplateModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" id="modal-add-template">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-base font-bold text-gray-900 font-sans">Adicionar Novo Modelo no Catálogo</h3>
              <button 
                onClick={() => setIsNewTemplateModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTemplate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Título do Modelo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ação Rescisória de Aluguel de Imóvel"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Categoria do Documento</label>
                  <select
                    value={newCat}
                    onChange={(e: any) => setNewCat(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700"
                  >
                    <option value="Petições Iniciais">Petições Iniciais</option>
                    <option value="Contratos">Contratos</option>
                    <option value="Recursos">Recursos</option>
                    <option value="Contestações">Contestações</option>
                    <option value="Procurações">Procurações</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Objetivo / Descrição Curta *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Modelo de minuta de despejo por quebra estrutural."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Corpo das Cláusulas (Minuta Padrão)</label>
                <textarea
                  placeholder="EXCELENTÍSSIMO SENHOR DOUTOR JUIZ..."
                  rows={8}
                  value={newCont}
                  onChange={(e) => setNewCont(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-xs font-mono leading-relaxed resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100 justify-end">
                <button
                  type="button"
                  onClick={() => setIsNewTemplateModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1c2025] text-white rounded-lg text-xs font-bold hover:bg-[#3d4757]"
                >
                  Criar Modelo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
