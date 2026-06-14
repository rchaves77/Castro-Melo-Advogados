import { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Trophy, 
  Briefcase, 
  PieChart, 
  Scale, 
  MapPin, 
  Award,
  ArrowUpRight
} from "lucide-react";

export default function AnalyticsView() {
  const [selectedQuarter, setSelectedQuarter] = useState<string>("Q3 2026");

  // Lawyers dashboard leaderboard data
  const lawyers = [
    { name: "João Batista", specialty: "Tributário Consultivo", cases: 54, winRate: "91%", billingYtd: "R$ 820.000", initials: "JB", rank: 1 },
    { name: "Rafael Silva", specialty: "Contencioso Cível", cases: 142, winRate: "85%", billingYtd: "R$ 450.000", initials: "RS", rank: 2 },
    { name: "Carolina Mendes", specialty: "Trabalhista Empresarial", cases: 215, winRate: "72%", billingYtd: "R$ 380.000", initials: "CM", rank: 3 }
  ];

  // Cases allocation allocation types
  const allocations = [
    { label: "Direito do Consumidor e Reparação Cível", percentage: 42, color: "bg-[#d6e0f4]", count: 524 },
    { label: "Direito do Trabalho Coletivo e Individual", percentage: 28, color: "bg-amber-400", count: 348 },
    { label: "Direito Tributário e Consultoria Fiscal", percentage: 18, color: "bg-slate-400", count: 224 },
    { label: "Contratos Corporativos e Marcas", percentage: 12, color: "bg-emerald-400", count: 142 }
  ];

  return (
    <div className="space-y-6 animate-fade-in" id="analytics-view">
      
      {/* Top Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4" id="analytics-header">
        <div>
          <h2 className="text-xl font-bold text-gray-900 font-sans">Business Intelligence</h2>
          <p className="text-xs text-gray-500 mt-1">Análise de performance operacional de associados e demonstrativos de êxito processual.</p>
        </div>

        {/* Quarter range selectors */}
        <div className="flex bg-white border border-gray-200 rounded-lg p-1 text-xs" id="range-picker">
          {["Q1 2026", "Q2 2026", "Q3 2026"].map((q) => (
            <button
              key={q}
              onClick={() => setSelectedQuarter(q)}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                selectedQuarter === q 
                  ? "bg-[#1c2025] text-white font-bold" 
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split: Leaderboard and Stats graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="analytics-grid">
        
        {/* Left Part: SVG interactive revenue chart */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between" id="revenue-analytics-card">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-gray-900 font-sans">Evolução de Honorários de Êxito (YTD)</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Histórico financeiro em milhares de reais consolidado por mês.</p>
            </div>
            <span className="flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+14.2%</span>
            </span>
          </div>

          {/* Premium Vector SVG line representation graph (Looks exceptionally elegant!) */}
          <div className="relative h-60 w-full flex items-end justify-between px-2 pt-4 group select-none" id="analytics-svg-graph">
            {/* Grid references Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[8px] font-bold text-gray-300 font-sans py-4">
              <div className="border-b border-dashed border-gray-100 w-full text-right pr-2">R$ 160k</div>
              <div className="border-b border-dashed border-gray-100 w-full text-right pr-2">R$ 120k</div>
              <div className="border-b border-dashed border-gray-100 w-full text-right pr-2">R$ 80k</div>
              <div className="border-b border-dashed border-gray-100 w-full text-right pr-2">R$ 40k</div>
              <div className="text-right pr-2">0</div>
            </div>

            {/* Simulated Vector Polyline drawing connecting points */}
            <svg className="absolute inset-0 h-full w-full pointer-events-none overflow-visible px-4 py-4" viewBox="0 0 500 240">
              {/* Fade gradient area beneath path */}
              <defs>
                <linearGradient id="gradient-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d6e0f4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#d6e0f4" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path 
                d="M 10 200 L 90 180 L 170 140 L 250 150 L 330 90 L 415 80 L 490 40 L 490 220 L 10 220 Z" 
                fill="url(#gradient-area)" 
              />
              <path 
                d="M 10 200 L 90 180 L 170 140 L 250 150 L 330 90 L 415 80 L 490 40" 
                fill="none" 
                stroke="#1c2025" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              {/* Intersect dots */}
              <circle cx="10" cy="200" r="5" fill="#1c2025" stroke="white" strokeWidth="2" />
              <circle cx="90" cy="180" r="5" fill="#1c2025" stroke="white" strokeWidth="2" />
              <circle cx="170" cy="140" r="5" fill="#1c2025" stroke="white" strokeWidth="2" />
              <circle cx="250" cy="150" r="5" fill="#1c2025" stroke="white" strokeWidth="2" />
              <circle cx="330" cy="90" r="5" fill="#1c2025" stroke="white" strokeWidth="2" />
              <circle cx="415" cy="80" r="5" fill="#111822" stroke="white" strokeWidth="2" />
              <circle cx="490" cy="40" r="6" fill="#000000" stroke="white" strokeWidth="2.5" className="animate-pulse" />
            </svg>

            {/* X-Axis labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-3 text-[9px] font-bold text-gray-400 font-sans mb-1 uppercase">
              <span>Jan</span>
              <span>Fev</span>
              <span>Mar</span>
              <span>Abr</span>
              <span>Mai</span>
              <span>Jun</span>
              <span>Jul (Atual)</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-100 text-xs font-sans">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Ticket Médio por Processo</span>
              <span className="text-base font-bold text-gray-900 block mt-0.5">R$ 18.500,00</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Taxa Geral de Êxito em Julgamento</span>
              <span className="text-base font-bold text-green-700 block mt-0.5">82.6% • Alto</span>
            </div>
          </div>
        </div>

        {/* Right Part: Lawyer Leaderboard Scorecards */}
        <div className="lg:col-span-5 flex flex-col gap-6" id="analytics-leaderboard-sidebar">
          {/* Leaders Board card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm" id="lawyers-leaderboard-panel">
            <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500 animate-bounce" />
                <h3 className="text-sm font-bold text-gray-900 font-sans">Faturamento por Associado</h3>
              </div>
              <span className="text-[9px] font-bold tracking-wider bg-gray-100 border border-gray-200 text-gray-500 px-2 py-0.5 rounded uppercase">
                Julho YTD
              </span>
            </div>

            <div className="space-y-4" id="lawyers-leaders-list">
              {lawyers.map((lay) => (
                <div 
                  key={lay.rank} 
                  className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-200 hover:bg-gray-100/50 transition-all rounded-xl relative group overflow-hidden"
                >
                  <div className="flex items-center gap-3">
                    {/* Rank indicator badge */}
                    <div className="font-sans italic font-bold text-gray-400 text-sm w-4 text-center">{lay.rank}º</div>
                    
                    {/* Initials avatar badge */}
                    <div className="w-9 h-9 rounded-full bg-[#1c2025] text-white flex items-center justify-center font-bold text-xs shadow">
                      {lay.initials}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-gray-900 leading-snug group-hover:text-[#05080c] transition-colors">{lay.name}</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">{lay.specialty}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-900">{lay.billingYtd}</p>
                    <span className="inline-block text-[9px] font-bold text-emerald-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full mt-1">
                      {lay.winRate} Êxito
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Grid Row 2: Practice Allocation percentage bento bar list */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm" id="allocations-block">
        <h3 className="text-sm font-bold text-gray-900 font-sans mb-1">Distribuição de Matérias Cíveis</h3>
        <p className="text-xs text-gray-500 mb-6">Proporção e volume bruto de causas assistidas por área do direito.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="allocations-bars">
          {allocations.map((alloc) => (
            <div key={alloc.label} className="space-y-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex justify-between items-start text-xs">
                <span className="font-bold text-gray-800 font-sans leading-snug line-clamp-2 h-8">{alloc.label}</span>
                <span className="font-bold text-gray-900 font-sans text-right pl-2">{alloc.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`h-2 rounded-full ${alloc.color}`} style={{ width: `${alloc.percentage}%` }}></div>
              </div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider pt-1">{alloc.count} causas ativas</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
