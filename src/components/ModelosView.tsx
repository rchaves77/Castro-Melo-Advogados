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

  // WYSIWYG Editor custom formatting properties
  const [selectedLetterhead, setSelectedLetterhead] = useState<"CastroMelo" | "Moderno" | "Brasao" | "Nenhum">("CastroMelo");
  const [selectedFont, setSelectedFont] = useState<"font-sans" | "font-serif" | "font-mono">("font-serif");
  const [selectedSize, setSelectedSize] = useState<"text-[10px]" | "text-xs" | "text-sm" | "text-base">("text-xs");
  const [selectedMargin, setSelectedMargin] = useState<"p-4" | "p-8" | "p-12" | "p-16">("p-12");
  const [selectedAlign, setSelectedAlign] = useState<"text-justify" | "text-left" | "text-right">("text-justify");

  // Legal snippets
  const LEGAL_SNIPPETS = [
    { label: "Preâmbulo Inicial", value: "\n\nREQUERENTE (Qualificação civil conforme art. 319 CPC), inscrito no CPF sob o nº ..., residente e domiciliado na ..., por intermédio de seu Advogado infra-assinado, com procuração anexa e escritório profissional em ..., local de recebimento de intimações, vem perante Vossa Excelência propor a presente..." },
    { label: "Seção Dos Fatos", value: "\n\nI – DOS FATOS EM SÍNTESE:\nO Requerente celebrou avença na data de ... cujo escopo pactuado visava ... Ocorre que, em total inobservância aos deveres e diretrizes fundamentais do pacto..." },
    { label: "Seção Do Direito", value: "\n\nII – DO EMBASAMENTO JURÍDICO:\nA pretensão do Requerente é categoricamente amparada pela inteligência do Artigo 389 e caput do Código Civil, de modo que aquele que descumprir obrigação voluntária submete-se ao dever de ressarcimento..." },
    { label: "Pedidos & Sucumbências", value: "\n\nIII – DOS PEDIDOS:\nDiante de todo o exposto, pugna o Autor pela procedência integral para:\na) A citação da Requerida para manifestação sob revelia;\nb) Condenação ao ressarcimento por perdas e danos;\nc) Arbitramento de honorários em 20% do proveito econômico obtido." },
    { label: "Fechamento OAB", value: "\n\nNesses termos, confia no deferimento.\nSão Paulo, 14 de Junho de 2026.\n\n___________________________________\nDRA. CAROLINE MELO DE CASTRO\nAdvogada Associada - OAB/SP 412.345" }
  ];

  const insertSnippet = (snippetText: string) => {
    setEditorContent(prev => prev + snippetText);
  };

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
            <div className="flex flex-col h-full bg-[#f4f6f8]">
              {/* Header tools */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white flex-shrink-0 shadow-sm z-10">
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
                      Salvar Peça
                    </button>
                  ) : (
                    <button
                      onClick={startEdit}
                      className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-md text-[11px] font-bold transition-all shadow-sm cursor-pointer"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      <span>Configurar & Editar</span>
                    </button>
                  )}
                </div>
              </div>

              {/* WYSIWYG Formatting controls (Shown when in editor or view mode for beautiful styling!) */}
              <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 flex-shrink-0 text-[10px]">
                {/* Configuration inputs */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Select font selectbox */}
                  <div className="flex items-center bg-white border border-gray-200 rounded px-2 py-1">
                    <span className="text-gray-400 mr-1.5 font-bold">Fonte:</span>
                    <select
                      value={selectedFont}
                      onChange={(e: any) => setSelectedFont(e.target.value)}
                      className="bg-transparent border-none p-0 outline-none font-bold text-gray-700 h-4 text-[10px]"
                    >
                      <option value="font-sans">Inter (Moderno)</option>
                      <option value="font-serif">Garamond (Fórum)</option>
                      <option value="font-mono">Mono (Técnico)</option>
                    </select>
                  </div>

                  {/* Size switcher */}
                  <div className="flex items-center bg-white border border-gray-200 rounded px-2 py-1">
                    <span className="text-gray-400 mr-1.5 font-bold">Meta-Tamanho:</span>
                    <select
                      value={selectedSize}
                      onChange={(e: any) => setSelectedSize(e.target.value)}
                      className="bg-transparent border-none p-0 outline-none font-bold text-gray-700 h-4 text-[10px]"
                    >
                      <option value="text-[10px]">Pequeno (10pt)</option>
                      <option value="text-xs">Normal (12pt)</option>
                      <option value="text-sm">Médio (14pt)</option>
                      <option value="text-base">Grande (16pt)</option>
                    </select>
                  </div>

                  {/* Margin switcher */}
                  <div className="flex items-center bg-white border border-gray-200 rounded px-2 py-1">
                    <span className="text-gray-400 mr-1.5 font-bold">Margens:</span>
                    <select
                      value={selectedMargin}
                      onChange={(e: any) => setSelectedMargin(e.target.value)}
                      className="bg-transparent border-none p-0 outline-none font-bold text-gray-700 h-4 text-[10px]"
                    >
                      <option value="p-4">Estreita (1.5cm)</option>
                      <option value="p-8">Padrão (2.0cm)</option>
                      <option value="p-12">Fórum Ampla (3.0cm)</option>
                      <option value="p-16">Especial (4.0cm)</option>
                    </select>
                  </div>

                  {/* Letterhead selector */}
                  <div className="flex items-center bg-white border border-gray-200 rounded px-2 py-1">
                    <span className="text-gray-400 mr-1.5 font-bold">Papel Timbrado:</span>
                    <select
                      value={selectedLetterhead}
                      onChange={(e: any) => setSelectedLetterhead(e.target.value)}
                      className="bg-transparent border-none p-0 outline-none font-bold text-[#1c2025] h-4 text-[10px]"
                    >
                      <option value="CastroMelo">Premium Castro Melo</option>
                      <option value="Moderno">Moderno C&M</option>
                      <option value="Brasao">Brasão Tribunal SP</option>
                      <option value="Nenhum">Sem Timbre</option>
                    </select>
                  </div>

                  {/* Text alignments */}
                  <div className="flex items-center bg-white border border-gray-200 rounded p-1 gap-1">
                    {(["text-left", "text-justify", "text-right"] as const).map((ali) => (
                      <button
                        key={ali}
                        onClick={() => setSelectedAlign(ali)}
                        className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          selectedAlign === ali ? "bg-gray-800 text-white" : "text-gray-400 hover:text-gray-700"
                        }`}
                      >
                        {ali === "text-left" ? "Esq." : ali === "text-right" ? "Dir." : "Justif."}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Component Pieces Injector Sidebar (only visible when editing) */}
              {isEditing && (
                <div className="bg-[#1c2025] text-white px-4 py-2 border-b border-gray-800 overflow-x-auto flex items-center gap-1.5 shrink-0" id="snippets-injector-shelf">
                  <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase mr-1 whitespace-nowrap">Inserir Peça Reutilizável:</span>
                  {LEGAL_SNIPPETS.map((snip) => (
                    <button
                      key={snip.label}
                      type="button"
                      onClick={() => insertSnippet(snip.value)}
                      className="px-2.5 py-1 bg-white/10 hover:bg-[#d6e0f4] hover:text-[#1c2025] font-bold rounded text-[9px] border border-white/5 transition-all whitespace-nowrap cursor-pointer"
                    >
                      + {snip.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Editable/Readable Body workspace (Styled inside real paper mockup) */}
              <div className="flex-grow p-4 md:p-6 overflow-y-auto select-text bg-[#eaedf1]" id="document-paper-container">
                <div className="bg-white mx-auto shadow-2xl rounded border border-gray-200 max-w-[700px] min-h-[85vh] flex flex-col p-6 md:p-10 relative font-sans transition-all">
                  
                  {/* Real Letterhead renderer inside paper */}
                  {selectedLetterhead === "CastroMelo" && (
                    <div className="border-b-2 border-amber-600 pb-3 mb-6 text-center select-none" id="letterhead-castromelo">
                      <h1 className="font-serif tracking-widest text-[#05080c] font-bold text-base uppercase">Castro Melo Advogados</h1>
                      <p className="text-[8px] tracking-wider text-gray-500 uppercase font-semibold">Assessoria Corporativa • Contencioso de Alto Impacto • Ambiental</p>
                      <div className="text-[8px] text-gray-400 mt-0.5 font-mono">Av. Brigadeiro Faria Lima, 3400 - São Paulo/SP | contato@castromelo.com.br</div>
                    </div>
                  )}

                  {selectedLetterhead === "Moderno" && (
                    <div className="border-l-4 border-[#121c2a] pl-3 pb-1 mb-6 text-left select-none" id="letterhead-moderno">
                      <h1 className="font-sans font-black tracking-tight text-[#1c2025] text-sm uppercase leading-none">C&M ADVOGADOS ASSOCIADOS</h1>
                      <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mt-1">São Paulo • Brasília • Rio de Janeiro</p>
                    </div>
                  )}

                  {selectedLetterhead === "Brasao" && (
                    <div className="border-b border-gray-200 pb-3 mb-6 text-center flex flex-col items-center select-none" id="letterhead-brasao">
                      <div className="w-6 h-6 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center text-[8px] font-black text-amber-700 shadow-sm leading-none mb-1">
                        SP
                      </div>
                      <h1 className="font-serif tracking-normal text-zinc-800 text-[10px] uppercase font-bold">Poder Judiciário do Estado de São Paulo</h1>
                      <p className="text-[8px] text-zinc-400 font-sans tracking-wide">Fórum de Primeira Instância - Cível Central da Capital</p>
                    </div>
                  )}

                  {/* Body text area / printable document layer */}
                  <div className="flex-1 flex flex-col">
                    {isEditing ? (
                      <textarea
                        value={editorContent}
                        onChange={(e) => setEditorContent(e.target.value)}
                        className={`w-full flex-grow bg-white focus:outline-none placeholder-gray-300 resize-none rounded-lg text-gray-800 ${selectedFont} ${selectedSize} ${selectedAlign} leading-relaxed h-[60vh]`}
                        id="editor-textarea-field"
                        placeholder="Escreva a petição ou minuta aqui. Utilize a barra superior para inserir cabeçalhos, margens e componentes reutilizáveis de peças..."
                      />
                    ) : (
                      <div className="whitespace-pre-wrap select-text h-full" id="templates-view-workspace">
                        <pre className={`whitespace-pre-wrap text-gray-700 bg-white leading-relaxed ${selectedFont} ${selectedSize} ${selectedAlign} ${selectedMargin}`}>
                          {selectedTemplate.content}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
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
