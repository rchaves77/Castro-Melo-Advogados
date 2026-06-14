import { useState, FormEvent } from "react";
import { 
  DollarSign, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Calendar, 
  Plus, 
  X, 
  Check, 
  ArrowUpRight, 
  Coins,
  FileDown
} from "lucide-react";
import { jsPDF } from "jspdf";
import { Transaction, Invoice } from "../types";

interface FinanceiroViewProps {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  invoices: Invoice[];
  setInvoices: (invoices: Invoice[]) => void;
}

export default function FinanceiroView({ 
  transactions, 
  setTransactions, 
  invoices, 
  setInvoices 
}: FinanceiroViewProps) {
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Ledger form states
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"Receita" | "Despesa Operacional" | "Impostos" | "Pessoal">("Receita");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"Pago" | "Processando" | "Pendente">("Pago");

  // Dynamic calculations
  const totalRevenue = transactions
    .filter(t => t.category === "Receita" && t.status === "Pago")
    .reduce((acc, curr) => acc + curr.value, 0) + 111000; // anchor

  const totalExpenses = Math.abs(
    transactions
      .filter(t => t.category !== "Receita")
      .reduce((acc, curr) => acc + curr.value, 0)
  ) + 18500; // anchor

  const defaultBalance = totalRevenue - totalExpenses;

  // Sync action trigger (Asaas simulation)
  const handleSyncAsaas = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      // Let's add a fresh mock invoice synchronized from Asaas!
      const freshSyncInvoice: Invoice = {
        id: "inv-" + Date.now(),
        company: "Almeida Associados Corp.",
        dueDate: "Em 5 dias",
        value: 12500.00,
        status: "Pago"
      };
      setInvoices([freshSyncInvoice, ...invoices]);
      alert("Asaas API sincronizado com êxito! 1 fatura liquidada recente importada com sucesso.");
    }, 1200);
  };

  // PDF Export Generation for Financial Transactions
  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    // Institutional Banner/Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(5, 8, 12); // #05080c
    doc.text("CASTRO MELO ADVOGADOS", 20, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(110, 110, 110);
    doc.text("Assessoria Corporativa • Contencioso de Alto Impacto • Ambiental", 20, 25);
    doc.text("Av. Brigadeiro Faria Lima, 3400 - São Paulo/SP | contato@castromelo.com.br", 20, 29);
    
    // Separation line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 33, 190, 33);

    // Title of dynamic report document
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(28, 32, 37); // #1c2025
    doc.text("RELATÓRIO FINANCEIRO & HISTÓRICO DE LANÇAMENTOS DO LIVRO CAIXA", 20, 42);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(70, 70, 70);
    doc.text(`Período de Emissão: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`, 20, 47);
    doc.text("Diretor Sócio Emissor: Dr. Hilário de Castro Melo Jr.", 20, 52);

    // Beautiful Gray Banner for Scorecard/KPI summary block
    doc.setFillColor(243, 244, 246);
    doc.rect(20, 56, 170, 21, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(110, 110, 110);
    doc.text("FATURAMENTO BRUTO", 25, 61);
    doc.text("DESPESAS OPERACIONAIS", 82, 61);
    doc.text("FATURAMENTO LÍQUIDO", 140, 61);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(22, 163, 74); // green-600
    doc.text(`R$ ${totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 25, 68);

    doc.setTextColor(220, 38, 38); // red-600
    doc.text(`R$ ${totalExpenses.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 82, 68);

    doc.setTextColor(18, 28, 42); // slate dark
    doc.text(`R$ ${defaultBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 140, 68);

    // Main ledger details label
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(28, 32, 37);
    doc.text("LIVRO CAIXA - DETALHAMENTO DAS TRANSAÇÕES", 20, 85);

    // Table view header section
    doc.setFillColor(28, 32, 37); // #1c2025 dark slate header
    doc.rect(20, 89, 170, 7.5, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text("DATA", 23, 94);
    doc.text("DESCRIÇÃO DA OPERAÇÃO", 44, 94);
    doc.text("CATEGORIA", 112, 94);
    doc.text("STATUS", 144, 94);
    doc.text("VALOR (R$)", 187, 94, { align: "right" });

    let currentY = 101;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);

    transactions.forEach((t, i) => {
      // Zebra backgrounds
      if (i % 2 === 0) {
        doc.setFillColor(249, 250, 251);
        doc.rect(20, currentY - 4.5, 170, 6.5, "F");
      }

      // Border floor
      doc.setDrawColor(240, 240, 240);
      doc.line(20, currentY + 2, 190, currentY + 2);

      const formattedDate = t.date.split("-").reverse().join("/");
      doc.text(formattedDate, 23, currentY);

      let truncatedDesc = t.description;
      if (truncatedDesc.length > 37) {
        truncatedDesc = truncatedDesc.substring(0, 34) + "...";
      }
      doc.text(truncatedDesc, 44, currentY);
      doc.text(t.category, 112, currentY);
      doc.text(t.status, 144, currentY);

      const isRevenue = t.category === "Receita";
      doc.setFont("helvetica", "bold");
      if (isRevenue) {
        doc.setTextColor(22, 163, 74); // green
      } else {
        doc.setTextColor(220, 38, 38); // red
      }
      const printedValue = `${isRevenue ? "+" : "-"} R$ ${Math.abs(t.value).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      doc.text(printedValue, 187, currentY, { align: "right" });

      doc.setFont("helvetica", "normal");
      doc.setTextColor(50, 50, 50);

      currentY += 6.5;

      // Wrap page logic
      if (currentY > 272) {
        doc.addPage();
        currentY = 25;

        // Print header columns on consecutive pages too
        doc.setFillColor(28, 32, 37);
        doc.rect(20, 10, 170, 7.5, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text("DATA", 23, 15);
        doc.text("DESCRIÇÃO DA OPERAÇÃO", 44, 15);
        doc.text("CATEGORIA", 112, 15);
        doc.text("STATUS", 144, 15);
        doc.text("VALOR (R$)", 187, 15, { align: "right" });

        currentY = 22;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(50, 50, 50);
      }
    });

    // Set precise footer positioning
    let finalFooterY = Math.min(currentY + 12, 276);
    doc.setDrawColor(200, 200, 200);
    doc.line(20, finalFooterY - 3, 190, finalFooterY - 3);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    doc.text("Desenvolvido por Rômulo Chaves - SerClin Tech", 20, finalFooterY + 3);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text("Este documento constitui extrato confidencial emitido por Castro Melo Advogados e auditado por SerClin Tech.", 20, finalFooterY + 7);

    // Trigger vector PDF download save
    doc.save(`relatorio_financeiro_castro_melo_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const handleAddTransaction = (e: FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !value.trim()) return;

    const numericValue = parseFloat(value);
    const signedValue = category === "Receita" ? numericValue : -Math.abs(numericValue);

    const newTransaction: Transaction = {
      id: "trans-" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      description,
      category,
      status,
      value: signedValue
    };

    setTransactions([newTransaction, ...transactions]);
    setIsAddModalOpen(false);

    // reset fields
    setDescription("");
    setValue("");
  };

  return (
    <div className="space-y-6 animate-fade-in" id="financeiro-view">
      
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4" id="financeiro-header">
        <div>
          <h2 className="text-xl font-bold text-gray-900 font-sans">Fluxo Financeiro</h2>
          <p className="text-xs text-gray-500 mt-1">Gestão de tesouraria integrada, conciliação bancária Asaas e controle de recebíveis.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncAsaas}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg text-xs font-semibold text-gray-700 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            id="btn-sync-asaas"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-gray-500 ${isSyncing ? "animate-spin" : ""}`} />
            <span>Sincronizar Asaas</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#d6e0f4] text-[#121c2a] border border-[#bdc7db] rounded-lg text-xs font-bold hover:bg-[#bdc7db] transition-all shadow-sm cursor-pointer"
            id="btn-export-pdf"
          >
            <FileDown className="h-4 w-4" />
            <span>Exportar PDF</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1c2025] text-white rounded-lg text-xs font-bold hover:bg-[#3d4757] transition-all shadow-md cursor-pointer"
            id="btn-add-ledger"
          >
            <Plus className="h-4 w-4" />
            <span>Novo Lançamento</span>
          </button>
        </div>
      </div>

      {/* Bento Financial Scorecards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="financeiro-kpi-bento">
        {/* Metric 1 */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Faturamento Líquido</p>
            <p className="text-2xl font-bold font-sans text-gray-900 mt-1">R$ {defaultBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <div className="flex items-center gap-1 text-green-600 text-[10px] font-bold mt-2 font-sans">
              <TrendingUp className="h-3 w-3" />
              <span>+18.4% vs mês anterior</span>
            </div>
          </div>
          <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center text-green-700">
            <Coins className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Despesas Operacionais</p>
            <p className="text-2xl font-bold font-sans text-red-600 mt-1">R$ {totalExpenses.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <div className="flex items-center gap-1 text-red-500 text-[10px] font-bold mt-2 font-sans">
              <TrendingDown className="h-3 w-3" />
              <span>Sede Paulista + Licenças</span>
            </div>
          </div>
          <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
            <TrendingDown className="h-5 w-5 animate-pulse" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Faturas Pendentes (Asaas)</p>
            <p className="text-2xl font-bold font-sans text-gray-900 mt-1">
              R$ {invoices.filter(i => i.status !== "Pago").reduce((sum, current) => sum + current.value, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
            <div className="flex items-center gap-1 text-gray-600 text-[10px] font-bold mt-2 font-sans">
              <Check className="h-3 w-3 text-emerald-500 font-bold" />
              <span>Conexão API ativa</span>
            </div>
          </div>
          <div className="h-10 w-10 rounded-full bg-[#d6e0f4] flex items-center justify-center text-[#1c2025]">
            <RefreshCw className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Split Sections: Cash Flow / Ledger & Asaas Faturas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="financeiro-dashboard-body">
        
        {/* Left column: Recent Ledger Table with dynamic chart */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col" id="ledger-book-panel">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
              <h3 className="text-sm font-bold text-gray-900 font-sans">Livro Caixa Recente</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Lançamentos de receitas brutas e saídas operacionais homologadas.</p>
            </div>
            <span className="text-[10px] font-bold bg-[#d6e0f4] text-[#121c2a] border border-[#bdc7db] px-2.5 py-0.5 rounded-full uppercase">
              Consolidado
            </span>
          </div>

          {/* Table list of transactions */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans">
                  <th className="py-3 px-5 font-semibold">Data</th>
                  <th className="py-3 px-5 font-semibold">Descrição de Operação</th>
                  <th className="py-3 px-5 font-semibold">Categoria</th>
                  <th className="py-3 px-5 font-semibold">Status</th>
                  <th className="py-3 px-5 font-semibold text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-gray-100 font-sans">
                {transactions.map((t) => {
                  const isRevenue = t.category === "Receita";
                  return (
                    <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 px-5 font-mono text-gray-500">
                        {t.date.split("-").reverse().join("/")}
                      </td>
                      <td className="py-3.5 px-5 font-semibold text-gray-900">
                        {t.description}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="text-[10px] font-medium text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-md">
                          {t.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          t.status === "Pago" 
                            ? "bg-green-50 text-green-700" 
                            : t.status === "Processando"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-gray-50 text-gray-500"
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className={`py-3.5 px-5 text-right font-bold text-sm ${isRevenue ? "text-green-600" : "text-red-500"}`}>
                        {isRevenue ? "+" : "-"} R$ {Math.abs(t.value).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Monthly Projections dynamic comparison view chart */}
          <div className="p-6 bg-gray-50 border-t border-gray-100" id="cashflow-comparison-chart-block">
            <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-4">Fluxo de Caixa Mensal (Realizado vs. Projetado em R$)</h4>
            
            <div className="space-y-4" id="visual-bars-container">
              {/* Bar Row 1 */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-sans">
                  <span className="font-semibold text-gray-700">Setembro</span>
                  <div className="flex gap-4">
                    <span className="text-gray-400">Projetado: <span className="font-semibold text-gray-700">R$ 130.000</span></span>
                    <span className="text-green-600">Realizado: <span className="font-bold">R$ 145.000</span></span>
                  </div>
                </div>
                <div className="w-full bg-white rounded-full h-2 border border-gray-200 p-0.5 overflow-hidden">
                  <div className="bg-green-500 h-1 rounded-full" style={{ width: "95%" }}></div>
                </div>
              </div>

              {/* Bar Row 2 */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-sans">
                  <span className="font-semibold text-gray-700">Outubro (Corrente)</span>
                  <div className="flex gap-4">
                    <span className="text-gray-400">Projetado: <span className="font-semibold text-gray-700">R$ 140.000</span></span>
                    <span className="text-blue-600">Realizado YTD: <span className="font-bold">R$ 124.500</span></span>
                  </div>
                </div>
                <div className="w-full bg-white rounded-full h-2 border border-gray-200 p-0.5 overflow-hidden">
                  <div className="bg-[#1c2025] h-1 rounded-full" style={{ width: "84%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Integrated Asaas Faturas widget */}
        <div className="lg:col-span-4 flex flex-col gap-6" id="asaas-faturas-side">
          {/* Card 1: Asaas Status Feed */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col" id="asaas-faturas-panel">
            <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-bold text-gray-900 font-sans">Faturas Asaas</h3>
                <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Histórico de cobranças em carteira.</p>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow animate-pulse" title="Asaas webhook ativo" />
            </div>

            <div className="space-y-4" id="asaas-invoices-list">
              {invoices.map((inv) => {
                const isOverdue = inv.status === "Vencido";
                return (
                  <div 
                    key={inv.id} 
                    className={`p-3.5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100/50 transition-all ${
                      isOverdue ? "border-l-4 border-l-red-500" : "border-l-4 border-l-[#d6e0f4]"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">{inv.company}</h4>
                        <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1 font-sans">
                          <Calendar className="h-3 w-3" />
                          <span>Vencimento: {inv.dueDate}</span>
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xs font-bold text-gray-900">R$ {inv.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                        <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-1.5 uppercase ${
                          inv.status === "Vencido" 
                            ? "bg-red-50 text-red-600 border border-red-100 animate-bounce" 
                            : inv.status === "Pago"
                              ? "bg-green-50 text-green-700 border border-green-100"
                              : "bg-gray-200 text-gray-600 border border-gray-300"
                        }`}>
                          {inv.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* --- ADD TRANSACTION MODAL --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" id="modal-add-transaction">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 max-w-sm w-full">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-sm font-bold text-gray-900 font-sans">Cadastrar Lançamento de Caixa</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="p-5 space-y-4 font-sans text-xs">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Descrição Curta *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pagamento Honorários Executivos"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Categoria Cadastral</label>
                <select
                  value={category}
                  onChange={(e: any) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700"
                >
                  <option value="Receita">Receita (Honorários de êxito/mensal)</option>
                  <option value="Despesa Operacional">Despesa Operacional</option>
                  <option value="Impostos">Impostos & Tributos</option>
                  <option value="Pessoal">Pessoal / Pro-labore</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Valor Bruto (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="Ex: 12500.00"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Status do Repasse</label>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                  >
                    <option value="Pago">Conciliado e Pago</option>
                    <option value="Processando">Processando</option>
                    <option value="Pendente">Pendente</option>
                  </select>
                </div>
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
                  Registrar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
