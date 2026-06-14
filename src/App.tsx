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
  X
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import DashboardView from "./components/DashboardView";
import ClientsView from "./components/ClientsView";
import CasesView from "./components/CasesView";
import ControladoriaView from "./components/ControladoriaView";
import FinanceiroView from "./components/FinanceiroView";
import ModelosView from "./components/ModelosView";
import AnalyticsView from "./components/AnalyticsView";

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
    setClientsState(getClients());
    setProcessesState(getProcesses());
    setKanbanTasksState(getKanbanTasks());
    setTransactionsState(getTransactions());
    setInvoicesState(getInvoices());
    setTemplatesState(getTemplates());
    setActivitiesState(getActivities());
  }, []);

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
                  alt="Dr. Rafael Castro Melo" 
                  className="h-8.5 w-8.5 rounded-full object-cover border border-gray-200 shadow" 
                  src={portraitUrl}
                  referrerPolicy="no-referrer"
                />
                
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-gray-900 leading-snug">Dr. Rafael Melo</p>
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
                    <p className="font-bold">Dr. Rafael Castro Melo</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">OAB/SP 412.345</p>
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

          {currentTab === "analytics" && (
            <AnalyticsView />
          )}
        </main>
      </div>

    </div>
  );
}

