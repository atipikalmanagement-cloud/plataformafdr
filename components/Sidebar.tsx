
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
                {!isCollapsed && <span className="font-semibold text-[15px] whitespace-nowrap opacity-100 transition-opacity duration-300">{label}</span>}
            </button>
        </li>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentPath, user, onLogout, isCollapsed }) => {
    return (
        <aside 
            className={`h-full transition-all duration-500 ease-in-out p-6 flex flex-col ${
                isCollapsed ? 'w-[120px]' : 'w-[300px]'
            }`}
        >
            <div className="sidebar-white flex flex-col h-full overflow-hidden p-6 md:p-8 relative">
                {/* Brand */}
                <div className={`flex items-center mb-12 px-2 transition-all duration-300 ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center text-ochre">
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                           <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    {!isCollapsed && <h1 className="text-2xl font-black tracking-tight text-gunmetal animate-fade-in">DR Coach</h1>}
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

                    {!isCollapsed && (
                        <div className="mt-12 animate-fade-in">
                            <p className="px-6 text-[11px] font-extrabold uppercase tracking-[0.2em] text-olive mb-6">Equipas</p>
                            <ul className="flex flex-col gap-4 px-6">
                                <li className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-ochre"></div>
                                    <span className="text-sm font-bold text-gunmetal">Comercial</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-olive"></div>
                                    <span className="text-sm font-bold text-gunmetal">Marketing</span>
                                </li>
                            </ul>
                        </div>
                    )}
                </nav>

                {/* Profile Card Bottom */}
                <div className={`mt-auto border-t border-slate-100 pt-8 transition-all duration-300 ${isCollapsed ? 'items-center' : ''}`}>
                    <button 
                        onClick={onLogout}
                        className={`flex items-center w-full group ${isCollapsed ? 'justify-center' : 'gap-4 px-2'}`}
                    >
                        <div className="w-12 h-12 rounded-2xl flex-shrink-0 overflow-hidden shadow-inner border border-amber">
                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                        {!isCollapsed && (
                            <div className="text-left overflow-hidden animate-fade-in">
                                <p className="text-sm font-extrabold text-gunmetal truncate">{user.name}</p>
                                <p className="text-[10px] font-bold text-olive uppercase">Sair da conta</p>
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
