import { 
  LayoutDashboard, 
  Users, 
  Gavel, 
  CreditCard, 
  FileText, 
  ClipboardList, 
  BarChart3, 
  Menu, 
  X, 
  RefreshCw,
  Heart
} from "lucide-react";
import { resetAllStorage } from "../data";

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function Sidebar({ currentTab, setCurrentTab, mobileOpen, setMobileOpen }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "clientes", label: "Clientes", icon: Users },
    { id: "processos", label: "Processos", icon: Gavel },
    { id: "financeiro", label: "Financeiro", icon: CreditCard },
    { id: "modelos", label: "Modelos e Peças", icon: FileText },
    { id: "controladoria", label: "Controladoria", icon: ClipboardList },
    { id: "sucesso_cliente", label: "Sucesso do Cliente", icon: Heart },
    { id: "analytics", label: "Analytics & BI", icon: BarChart3 },
  ];

  const handleNav = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileOpen(false);
  };

  const logoUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuCh1tyHB_CKTBu1ED_Qt6HLLf4qxYVfOsq9BoFiGrHBvUeUANgkrmuPwSSMlfL2-yB3HCoodezha-dcUFD7FEMoAz9buD7y50iLH-HGODPwRoLSdzlGgss8Bh8_DfI0WDvc1C1ZSEUifkquzu6_w57-XqhifGymCkeQ-4zRgoo-6rmzrbqiKT5HIsEdkQfxGw6b67e9owMd-kPNSSW4yVfmLxU8YVtSx0D7k0GarGE3zN12vSNgVxyY4xANqf4W9hUojTMWvuyoz3Sw";

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#1c2025] text-white py-8 px-4" id="sidebar-container">
      {/* Brand Logo */}
      <div className="px-4 mb-10 flex flex-col items-center justify-center border-b border-gray-800 pb-6" id="sidebar-logo">
        <img 
          alt="Castro Melo Advogados" 
          className="h-24 w-auto object-contain filter brightness-110" 
          src={logoUrl}
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 px-2" id="sidebar-nav">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-item-${item.id}`}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-lg text-sm font-medium transition-all duration-200 outline-none ${
                isActive 
                  ? "bg-[#d6e0f4] text-[#121c2a] font-semibold shadow-md border-l-4 border-[#05080c]" 
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <IconComponent className={`h-5 w-5 ${isActive ? "text-[#121c2a]" : "text-gray-400 group-hover:text-white"}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Reset System Storage Cache Button */}
      <div className="px-2 pt-4 border-t border-gray-800 mt-auto" id="sidebar-footer">
        <button
          onClick={() => {
            if (confirm("Deseja realmente redefinir o sistema para os dados originais do escritório? Todas as alterações serão perdidas.")) {
              resetAllStorage();
            }
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 border border-dashed border-gray-800 transition-all cursor-pointer"
          title="Restaurar dados iniciais do escritório"
          id="btn-restore-office-cache"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Restaurar Sistema</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Left Anchored) */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-[280px] flex-col z-30 shadow-2xl border-r border-gray-800" id="desktop-sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer (Responsive slide) */}
      <div 
        className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 pointer-events-none ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0"
        }`}
        id="mobile-sidebar-backdrop"
      >
        {/* Backdrop overlay */}
        <div 
          className="absolute inset-0 bg-black/60 transition-opacity" 
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer container */}
        <aside 
          className={`absolute left-0 top-0 h-full w-[280px] bg-[#1c2025] shadow-2xl transform transition-transform duration-300 ease-in-out ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          id="mobile-sidebar"
        >
          {/* Close button inside mobile slide */}
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-800 text-gray-300 hover:text-white"
            id="mobile-close-sidebar"
          >
            <X className="h-5 w-5" />
          </button>
          
          <SidebarContent />
        </aside>
      </div>
    </>
  );
}
