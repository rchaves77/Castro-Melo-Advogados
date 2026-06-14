/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { 
  Menu, 
  Bell, 
  User, 
  ChevronDown, 
  Search, 
  Settings, 
  LogOut, 
  Activity, 
  AlertCircle, 
  HelpCircle,
  X,
  Keyboard
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import DashboardView from "./components/DashboardView";
import ClientsView from "./components/ClientsView";
import CasesView from "./components/CasesView";
import ControladoriaView from "./components/ControladoriaView";
import FinanceiroView from "./components/FinanceiroView";
import ModelosView from "./components/ModelosView";
import AnalyticsView from "./components/AnalyticsView";
import SuccessConsultantView from "./components/SuccessConsultantView";

import { 
  getClients, saveClients, 
  getProcesses, saveProcesses, 
  getKanbanTasks, saveKanbanTasks, 
  getTransactions, saveTransactions, 
  getInvoices, saveInvoices, 
  getTemplates, saveTemplates, 
  getActivities, saveActivities 
} from "./data";

import { Client, Process, KanbanTask, Transaction, Invoice, TemplateDocument, ActivityLog } from "./types";

export default function App() {
  // Navigation active tab
  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  // Keyboard Shortcuts & Productivity States
  const [isShortcutGuideOpen, setIsShortcutGuideOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showShortcutToast = (msg: string) => {
    setToastMessage(msg);
    const timer = setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2200);
  };

  // Global synchronized states
  const [clients, setClientsState] = useState<Client[]>([]);
  const [processes, setProcessesState] = useState<Process[]>([]);
  const [kanbanTasks, setKanbanTasksState] = useState<KanbanTask[]>([]);
  const [transactions, setTransactionsState] = useState<Transaction[]>([]);
  const [invoices, setInvoicesState] = useState<Invoice[]>([]);
  const [templates, setTemplatesState] = useState<TemplateDocument[]>([]);
  const [activities, setActivitiesState] = useState<ActivityLog[]>([]);

  // Load initial seed state from storage
  useEffect(() => {
    document.title = "Castro Melo";
    setClientsState(getClients());
    setProcessesState(getProcesses());
    setKanbanTasksState(getKanbanTasks());
    setTransactionsState(getTransactions());
    setInvoicesState(getInvoices());
    setTemplatesState(getTemplates());
    setActivitiesState(getActivities());
  }, []);

  // Set up Keyboard Event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isTyping = activeEl && (
        activeEl.tagName === "INPUT" || 
        activeEl.tagName === "TEXTAREA" || 
        activeEl.getAttribute("contenteditable") === "true"
      );

      // Reset modal guide on Escape
      if (e.key === "Escape") {
        setIsShortcutGuideOpen(false);
        return;
      }

      // 1. Help Guide shortcut: Ctrl + K (or Command + K)
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K" || e.key === "h" || e.key === "H")) {
        e.preventDefault();
        setIsShortcutGuideOpen((prev) => !prev);
        showShortcutToast(!isShortcutGuideOpen ? "Manual de Atalhos Ativado [CTRL+K]" : "Manual Fechado");
        return;
      }

      // 2. Search Shortcut: Ctrl + F (or Command + F) -> Focuses contextual search box
      if ((e.ctrlKey || e.metaKey) && (e.key === "f" || e.key === "F")) {
        e.preventDefault();
        let inputId = "";
        let tabLabel = "";

        if (currentTab === "clientes") {
          inputId = "input-search-clients";
          tabLabel = "Diretório de Clientes";
        } else if (currentTab === "processos") {
          inputId = "input-search-processes";
          tabLabel = "Casos & Processos";
        } else if (currentTab === "modelos") {
          inputId = "input-search-templates";
          tabLabel = "Modelos & Peças";
        } else {
          // Send them to cases if they are anywhere else
          navigateTo("processos");
          inputId = "input-search-processes";
          tabLabel = "Casos & Processos";
        }

        setTimeout(() => {
          const input = document.getElementById(inputId) as HTMLInputElement | null;
          if (input) {
            input.focus();
            input.select();
            showShortcutToast(`Pesquisar em: ${tabLabel}`);
          }
        }, 150);
        return;
      }

      // If user is actively typing a text/number, let's bypass other direct shortcuts (so they can write sentences)
      if (isTyping) return;

      // 3. New Entry Shortcut: Ctrl + N (or Command + N)
      if ((e.ctrlKey || e.metaKey) && (e.key === "n" || e.key === "N")) {
        e.preventDefault();
        if (currentTab === "processos") {
          const btn = document.getElementById("btn-add-process");
          if (btn) {
            btn.click();
            showShortcutToast("Novo Processo");
          }
        } else if (currentTab === "clientes") {
          const btn = document.getElementById("btn-add-client");
          if (btn) {
            btn.click();
            showShortcutToast("Novo Cliente");
          }
        } else if (currentTab === "financeiro") {
          const btn = document.getElementById("btn-add-ledger");
          if (btn) {
            btn.click();
            showShortcutToast("Novo Lançamento Financeiro");
          }
        } else {
          // Redirect them to processes and open the modal
          navigateTo("processos");
          setTimeout(() => {
            const btn = document.getElementById("btn-add-process");
            if (btn) {
              btn.click();
              showShortcutToast("Novo Processo");
            }
          }, 200);
        }
        return;
      }

      // 4. Quick Export Shortcut: Ctrl + Alt + E
      if ((e.ctrlKey || e.metaKey) && e.altKey && (e.key === "e" || e.key === "E")) {
        e.preventDefault();
        if (currentTab === "financeiro") {
          const btn = document.getElementById("btn-export-pdf");
          if (btn) {
            btn.click();
          }
        } else {
          navigateTo("financeiro");
          setTimeout(() => {
            const btn = document.getElementById("btn-export-pdf");
            if (btn) {
              btn.click();
            }
          }, 200);
        }
        return;
      }

      // 5. Tab switcher numeric shortcuts: Alt + [1-8]
      if (e.altKey && e.key >= "1" && e.key <= "8") {
        e.preventDefault();
        const tabs = ["dashboard", "clientes", "processos", "controladoria", "financeiro", "modelos", "sucesso_cliente", "analytics"];
        const labels = ["Painel Principal", "Clientes", "Processos Cíveis", "Controladoria (Kanban)", "Financeiro", "Modelos e Minutas", "Sucesso do Cliente", "Analytics BI"];
        const idx = parseInt(e.key, 10) - 1;
        if (idx >= 0 && idx < tabs.length) {
          navigateTo(tabs[idx]);
          showShortcutToast(`Carregado: ${labels[idx]}`);
        }
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentTab, isShortcutGuideOpen]);

  // Sync state helpers
  const handleSetClients = (newClients: Client[]) => {
    setClientsState(newClients);
    saveClients(newClients);

    // Append standard log
    const log: ActivityLog = {
      id: "act-" + Date.now(),
      title: "Diretório de Clientes Atualizado",
      type: "client",
      description: "As informações da ficha de novos parceiros foram cadastradas.",
      time: "Agora mesmo"
    };
    const updatedLogs = [log, ...activities];
    setActivitiesState(updatedLogs);
    saveActivities(updatedLogs);
  };

  const handleSetProcesses = (newProcesses: Process[]) => {
    setProcessesState(newProcesses);
    saveProcesses(newProcesses);

    // Append log
    const log: ActivityLog = {
      id: "act-" + Date.now(),
      title: "Ficha Processual Regulada",
      type: "document",
      description: "Número do processo unificado cadastrado com agenda de prazos vinculada.",
      time: "Agora mesmo"
    };
    const updatedLogs = [log, ...activities];
    setActivitiesState(updatedLogs);
    saveActivities(updatedLogs);
  };

  const handleSetKanbanTasks = (newTasks: KanbanTask[]) => {
    setKanbanTasksState(newTasks);
    saveKanbanTasks(newTasks);
  };

  const handleSetTransactions = (newTransactions: Transaction[]) => {
    setTransactionsState(newTransactions);
    saveTransactions(newTransactions);

    // Append log
    const log: ActivityLog = {
      id: "act-" + Date.now(),
      title: "Lançamento no Livro Caixa",
      type: "payment",
      description: "Novo registro de fluxo financeiro homologado pelo financeiro em carteira.",
      time: "Agora mesmo"
    };
    const updatedLogs = [log, ...activities];
    setActivitiesState(updatedLogs);
    saveActivities(updatedLogs);
  };

  const handleSetInvoices = (newInvoices: Invoice[]) => {
    setInvoicesState(newInvoices);
    saveInvoices(newInvoices);
  };

  const handleSetTemplates = (newTemplates: TemplateDocument[]) => {
    setTemplatesState(newTemplates);
    saveTemplates(newTemplates);
  };

  // Profile image links from user assets
  const portraitUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuChhfCzkj6G6Xb7jaPAuOgBCty0i_6pwjirzCeKrr7vBalNNuHgrELUTjtUMDWg3gdwv09DsEp83pmZsmkenJt6WZbFtZfZHkn8kwB1EKb6FqEeJ-UL7cGdA7sgZrfzfyFf0fG8J8EgYzunr5lrJOhZ1IK2CYld6LXhSAGTTczrRVrxnyHE3xg-bpZNwQIdZzBT3t2iJaE4gVjjdDgodKxym9udCxd_QSUwt290jsNyjMYpYZKo905kC-Fv5bgSbjHTkfWe6ZalAtQh";

  // Trigger reset tab direct routing
  const navigateTo = (tabId: string) => {
    setCurrentTab(tabId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans select-none overflow-x-hidden antialiased text-gray-800" id="main-panel-app">
      
      {/* 1. Side navigation fixed left */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        mobileOpen={mobileSidebarOpen} 
        setMobileOpen={setMobileSidebarOpen} 
      />

      {/* 2. Main content container wrapper */}
      <div className="flex-1 lg:pl-[280px] flex flex-col min-h-screen relative" id="layout-view-body">
        
        {/* Top Header Panel (Sticky header with action alerts and profile controls) */}
        <header 
          className="sticky top-0 z-25 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shadow-sm flex-shrink-0"
          id="main-top-header"
        >
          {/* Hamburger trigger for mobile viewport */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-500 cursor-pointer"
              id="mobile-menu-hamburger"
              title="Abrir menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Current formatted date label */}
            <div className="hidden sm:block text-xs font-semibold text-gray-400 font-sans tracking-wide uppercase">
              {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </div>
          </div>

          {/* User profile picture + Action controls panel */}
          <div className="flex items-center gap-4 relative">
            
            {/* Keyboard Shortcuts Guide Trigger */}
            <button 
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors hidden sm:inline-block cursor-pointer relative group"
              onClick={() => setIsShortcutGuideOpen(!isShortcutGuideOpen)}
              title="Atalhos do Teclado [Ctrl+K]"
              id="header-shortcuts-icon"
            >
              <Keyboard className="h-5 w-5" />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-30">
                Atalhos (Ctrl + K)
              </span>
            </button>

            {/* Direct interactive feedback quick Help Center link */}
            <button 
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors hidden sm:inline-block cursor-pointer"
              onClick={() => alert("Castro Melo Advogados • Guia Rápido:\nNavegue pelas abas do painel lateral para controlar clientes, processos, controladoria via Kanban, sincronização financeira e BI.")}
              title="Central de Ajuda"
              id="header-help-icon"
            >
              <HelpCircle className="h-5 w-5" />
            </button>

            {/* Notification alert dropdown trigger */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationOpen(!isNotificationOpen);
                  setIsProfileOpen(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-colors relative cursor-pointer focus:outline-none"
                id="header-notification-trigger"
                title="Notificações"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 bg-red-600 border-2 border-white w-3 h-3 rounded-full shadow-md animate-bounce" />
              </button>

              {/* Notification Popover Dropdown content (Matches activities state) */}
              {isNotificationOpen && (
                <div 
                  className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 shadow-2xl rounded-xl z-50 overflow-hidden transform origin-top-right transition-all duration-200"
                  id="notifications-popover"
                >
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <span className="text-xs font-bold text-gray-900">Notificações Recentes</span>
                    <button 
                      onClick={() => setIsNotificationOpen(false)}
                      className="text-gray-400 hover:text-gray-600 p-0.5 rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto text-xs">
                    <div className="p-3.5 hover:bg-gray-50 flex gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-red-600 mt-1.5 flex-shrink-0 animate-pulse" />
                      <div>
                        <p className="font-bold text-gray-900">Prazo Fatal de Recurso Especial</p>
                        <p className="text-gray-500 mt-0.5">Vencendo amanhã às 18h no processo STJ.</p>
                      </div>
                    </div>
                    <div className="p-3.5 hover:bg-gray-50 flex gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">Asaas Conciliado Novo</p>
                        <p className="text-gray-500 mt-0.5">A fatura de Almeida Corp foi quitada.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="h-4 w-px bg-gray-200" />

            {/* Custom Lawyer ID Profile controls dropdown trigger */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationOpen(false);
                }}
                className="flex items-center gap-2.5 p-1.5 hover:bg-gray-100 rounded-lg transition-all cursor-pointer focus:outline-none"
                id="header-user-profile-trigger"
              >
                <img 
                  alt="Dr. Hilário de Castro Melo Jr" 
                  className="h-8.5 w-8.5 rounded-full object-cover border border-gray-200 shadow" 
                  src={portraitUrl}
                  referrerPolicy="no-referrer"
                />
                
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-gray-900 leading-snug">Dr. Hilário Melo</p>
                  <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold">Sócio Diretor</p>
                </div>

                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {/* Profile dropdown panel popover */}
              {isProfileOpen && (
                <div 
                  className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 shadow-2xl rounded-xl z-50 overflow-hidden text-xs"
                  id="profile-popover"
                >
                  <div className="p-4 border-b border-gray-100 bg-[#1c2025] text-white">
                    <p className="font-bold">Dr. Hilário de Castro Melo Jr</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">OAB/SP 123.456</p>
                  </div>
                  
                  <div className="p-2 space-y-1">
                    <button 
                      onClick={() => { 
                        setIsProfileOpen(false); 
                        navigateTo("analytics"); 
                      }} 
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg text-left font-semibold"
                    >
                      <Activity className="h-4 w-4 text-gray-400" />
                      <span>Meu Desempenho BI</span>
                    </button>
                    <button 
                      onClick={() => alert("Castro Melo Advogados Associados\nVersão Integrada: v1.8.2\nAmbiente de Workspace AI Studio.")} 
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg text-left font-semibold"
                    >
                      <Settings className="h-4 w-4 text-gray-400" />
                      <span>Configurações</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* 3. Main interactive view viewport body render */}
        <main className="flex-grow p-6 lg:p-8" id="view-viewport">
          {currentTab === "dashboard" && (
            <DashboardView 
              clients={clients} 
              processes={processes} 
              kanbanTasks={kanbanTasks} 
              transactions={transactions} 
              activities={activities}
              onNavigate={navigateTo} 
            />
          )}

          {currentTab === "clientes" && (
            <ClientsView 
              clients={clients} 
              setClients={handleSetClients} 
            />
          )}

          {currentTab === "processos" && (
            <CasesView 
              processes={processes} 
              setProcesses={handleSetProcesses}
              clients={clients} 
            />
          )}

          {currentTab === "controladoria" && (
            <ControladoriaView 
              kanbanTasks={kanbanTasks} 
              setKanbanTasks={handleSetKanbanTasks}
              clients={clients} 
            />
          )}

          {currentTab === "financeiro" && (
            <FinanceiroView 
              transactions={transactions} 
              setTransactions={handleSetTransactions}
              invoices={invoices} 
              setInvoices={handleSetInvoices}
            />
          )}

          {currentTab === "modelos" && (
            <ModelosView 
              templates={templates} 
              setTemplates={handleSetTemplates} 
            />
          )}

          {currentTab === "sucesso_cliente" && (
            <SuccessConsultantView 
              clients={clients}
            />
          )}

          {currentTab === "analytics" && (
            <AnalyticsView />
          )}
        </main>

        {/* Universal Footer Credits */}
        <footer className="py-4 border-t border-gray-200 bg-white text-center text-[10px] text-gray-500 font-sans tracking-widest uppercase font-bold select-none mt-auto" id="app-footer-credits">
          Desenvolvido por Rômulo Chaves - SerClin Tech
        </footer>
      </div>

      {/* 4. Keyboard Shortcuts Help Modal Overlay */}
      {isShortcutGuideOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          id="shortcuts-modal-overlay"
          onClick={() => setIsShortcutGuideOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-lg w-full overflow-hidden flex flex-col font-sans transition-all transform scale-100"
            id="shortcuts-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header banner */}
            <div className="bg-[#1c2025] text-white p-6 relative">
              <button 
                onClick={() => setIsShortcutGuideOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                title="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500/10 text-emerald-400 p-2.5 rounded-xl border border-emerald-500/20">
                  <Keyboard className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base tracking-wide text-white uppercase">Produtividade Castro Melo</h3>
                  <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase mt-0.5">Painel de Atalhos do Teclado</p>
                </div>
              </div>
            </div>

            {/* Instruction body */}
            <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
              <div>
                <span className="text-[10px] font-black tracking-wider text-gray-400 uppercase block mb-2.5">Ações Contextuais</span>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs p-2 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100/70 transition-colors">
                    <span className="text-gray-650 font-semibold font-sans">Novo Registro (Caso / Cliente / Lançamento)</span>
                    <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-xs font-mono text-[10px] font-bold text-[#1c2025]">Ctrl + N</kbd>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100/70 transition-colors">
                    <span className="text-gray-650 font-semibold font-sans">Focar Campo de Busca (Aba ativa)</span>
                    <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-xs font-mono text-[10px] font-bold text-[#1c2025]">Ctrl + F</kbd>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100/70 transition-colors">
                    <span className="text-gray-650 font-semibold font-sans">Exportar Relatório Financeiro para PDF</span>
                    <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-xs font-mono text-[10px] font-bold text-[#1c2025]">Ctrl + Alt + E</kbd>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100/70 transition-colors">
                    <span className="text-gray-650 font-semibold font-sans">Visualizar / Fechar este Manual</span>
                    <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-xs font-mono text-[10px] font-bold text-[#1c2025]">Ctrl + K</kbd>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-black tracking-wider text-gray-400 uppercase block mb-2.5">Navegação Expressa por Abas</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-100 rounded-lg">
                    <span className="text-gray-600 font-medium">1. Dashboard</span>
                    <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded shadow-xs font-mono text-[9px] font-bold text-[#1c2025]">Alt + 1</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-100 rounded-lg">
                    <span className="text-gray-600 font-medium">2. Clientes</span>
                    <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded shadow-xs font-mono text-[9px] font-bold text-[#1c2025]">Alt + 2</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-100 rounded-lg">
                    <span className="text-gray-600 font-medium">3. Processos</span>
                    <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded shadow-xs font-mono text-[9px] font-bold text-[#1c2025]">Alt + 3</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-100 rounded-lg">
                    <span className="text-gray-600 font-medium">4. Controladoria</span>
                    <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded shadow-xs font-mono text-[9px] font-bold text-[#1c2025]">Alt + 4</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-100 rounded-lg">
                    <span className="text-gray-600 font-medium">5. Financeiro</span>
                    <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded shadow-xs font-mono text-[9px] font-bold text-[#1c2025]">Alt + 5</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-100 rounded-lg">
                    <span className="text-gray-600 font-medium">6. Modelos & Peças</span>
                    <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded shadow-xs font-mono text-[9px] font-bold text-[#1c2025]">Alt + 6</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-100 rounded-lg">
                    <span className="text-gray-600 font-medium font-sans">7. Sucesso Cliente</span>
                    <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded shadow-xs font-mono text-[9px] font-bold text-[#1c2025]">Alt + 7</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-100 rounded-lg">
                    <span className="text-gray-600 font-medium font-sans">8. Analytics BI</span>
                    <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded shadow-xs font-mono text-[9px] font-bold text-[#1c2025]">Alt + 8</kbd>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-semibold font-mono uppercase tracking-wider select-none shrink-0 px-6">
              <span>Auditoria Técnica: SerClin Tech</span>
              <button 
                onClick={() => setIsShortcutGuideOpen(false)}
                className="px-4 py-2 bg-[#1c2025] hover:bg-neutral-700 text-white font-bold rounded-lg uppercase text-[10px] transition-all cursor-pointer shadow"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Shortcut Action Toast confirmation */}
      {toastMessage && (
        <div 
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-55 bg-[#1c2025] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-gray-700 animate-slide-up text-xs font-bold font-mono tracking-wider select-none animate-bounce"
          id="shortcuts-toast-indicator"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping flex-shrink-0" />
          <Keyboard className="h-4 w-4 text-emerald-400 flex-shrink-0" />
          <span className="text-white font-sans">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

