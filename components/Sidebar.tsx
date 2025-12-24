
import React from 'react';
import { User, Theme } from '../types';

type Page = 'selection' | 'recordings' | 'goals' | 'profile';

interface SidebarProps {
    onNavigate: (path: Page) => void;
    currentPath: Page;
    user: User;
    onLogout: () => void;
    theme: Theme;
    onToggleTheme: () => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

const NavItem: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
    isCollapsed: boolean;
    children: React.ReactNode;
}> = ({ label, isActive, onClick, isCollapsed, children }) => {
    return (
        <li className="w-full">
            <button
                onClick={onClick}
                className={`w-full flex items-center rounded-2xl transition-all duration-300 group overflow-hidden ${
                    isCollapsed ? 'justify-center p-3' : 'px-6 py-3.5'
                } ${
                    isActive 
                    ? 'active-nav shadow-lg' 
                    : 'text-olive hover:text-gunmetal hover:bg-slate-100'
                }`}
            >
                <div className={`transition-transform flex-shrink-0 ${isCollapsed ? '' : 'mr-4'} ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {children}
                </div>
                <span className={`font-semibold text-[15px] whitespace-nowrap transition-all duration-500 overflow-hidden ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                    {label}
                </span>
            </button>
        </li>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentPath, user, onLogout, isCollapsed }) => {
    return (
        <aside 
            className={`h-full transition-all duration-500 ease-in-out p-6 flex flex-col ${
                isCollapsed ? 'w-[120px]' : 'w-[320px]'
            }`}
        >
            <div className="sidebar-white flex flex-col h-full overflow-hidden p-6 md:p-8 relative shadow-2xl">
                {/* Brand */}
                <div className={`flex items-center mb-12 px-2 transition-all duration-500 ${isCollapsed ? 'justify-center' : 'gap-4'}`}>
                    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center text-ochre bg-ochre/5 rounded-2xl transition-transform duration-500 hover:rotate-12">
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                           <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h1 className={`text-2xl font-black tracking-tight text-gunmetal transition-all duration-500 overflow-hidden ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                        DR Coach
                    </h1>
                </div>
                
                {/* Navigation */}
                <nav className="flex-grow">
                    <ul className="flex flex-col gap-2">
                        <NavItem label="Dashboard" isActive={currentPath === 'selection'} onClick={() => onNavigate('selection')} isCollapsed={isCollapsed}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </NavItem>
                        <NavItem label="Metas" isActive={currentPath === 'goals'} onClick={() => onNavigate('goals')} isCollapsed={isCollapsed}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </NavItem>
                        <NavItem label="Estatísticas" isActive={currentPath === 'recordings'} onClick={() => onNavigate('recordings')} isCollapsed={isCollapsed}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                            </svg>
                        </NavItem>
                        <NavItem label="Documentos" isActive={currentPath === 'profile'} onClick={() => onNavigate('profile')} isCollapsed={isCollapsed}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                        </NavItem>
                    </ul>

                    <div className={`mt-12 transition-all duration-500 ${isCollapsed ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
                        <p className="px-6 text-[10px] font-black uppercase tracking-[0.3em] text-olive/60 mb-6">Equipas</p>
                        <ul className="flex flex-col gap-4 px-6">
                            <li className="flex items-center gap-4 group cursor-pointer">
                                <div className="w-2.5 h-2.5 rounded-full bg-ochre shadow-lg shadow-ochre/20 group-hover:scale-125 transition-transform"></div>
                                <span className="text-sm font-black text-gunmetal/70 group-hover:text-gunmetal transition-colors">Comercial</span>
                            </li>
                            <li className="flex items-center gap-4 group cursor-pointer">
                                <div className="w-2.5 h-2.5 rounded-full bg-olive/40 group-hover:bg-olive group-hover:scale-125 transition-all"></div>
                                <span className="text-sm font-black text-gunmetal/70 group-hover:text-gunmetal transition-colors">Marketing</span>
                            </li>
                        </ul>
                    </div>
                </nav>

                {/* Profile Card Bottom */}
                <div className={`mt-auto border-t border-slate-100 pt-8 transition-all duration-500 ${isCollapsed ? 'items-center' : ''}`}>
                    <button 
                        onClick={onLogout}
                        className={`flex items-center w-full group transition-all duration-300 ${isCollapsed ? 'justify-center' : 'gap-4 px-2 hover:bg-slate-50 py-2 rounded-2xl'}`}
                    >
                        <div className="w-12 h-12 rounded-2xl flex-shrink-0 overflow-hidden shadow-xl border-2 border-amber transition-transform group-hover:scale-105">
                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                        <div className={`text-left overflow-hidden transition-all duration-500 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                            <p className="text-sm font-black text-gunmetal truncate">{user.name}</p>
                            <p className="text-[9px] font-black text-ochre uppercase tracking-widest">Sair da conta</p>
                        </div>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
