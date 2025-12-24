
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
                className={`w-full flex items-center rounded-xl transition-all duration-300 group overflow-hidden ${
                    isCollapsed ? 'justify-center p-2.5' : 'px-4 py-2.5'
                } ${
                    isActive 
                    ? 'bg-gunmetal text-ghost shadow-md' 
                    : 'text-olive hover:bg-slate-100 hover:text-gunmetal'
                }`}
            >
                <div className={`flex-shrink-0 ${isCollapsed ? '' : 'mr-3'} ${isActive ? 'text-amber' : 'group-hover:text-amber'}`}>
                    {children}
                </div>
                {!isCollapsed && (
                    <span className="font-bold text-[13px] whitespace-nowrap opacity-100 transition-opacity">
                        {label}
                    </span>
                )}
            </button>
        </li>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentPath, user, onLogout, isCollapsed }) => {
    return (
        <aside className={`h-full transition-all duration-300 p-4 flex flex-col ${isCollapsed ? 'w-20' : 'w-64'}`}>
            <div className="bg-white h-full rounded-3xl p-5 flex flex-col shadow-2xl border border-slate-100">
                <div onClick={() => onNavigate('selection')} className={`flex items-center mb-10 transition-all cursor-pointer group ${isCollapsed ? 'justify-center' : 'px-2 gap-3'}`}>
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-amber rounded-xl text-gunmetal shadow-lg transition-transform group-hover:rotate-6">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    {!isCollapsed && <h1 className="text-lg font-black tracking-tight text-gunmetal">DR Coach</h1>}
                </div>
                
                <nav className="flex-grow">
                    <ul className="flex flex-col gap-1.5">
                        <NavItem label="Dashboard" isActive={currentPath === 'selection'} onClick={() => onNavigate('selection')} isCollapsed={isCollapsed}>
                            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                        </NavItem>
                        <NavItem label="Metas" isActive={currentPath === 'goals'} onClick={() => onNavigate('goals')} isCollapsed={isCollapsed}>
                            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        </NavItem>
                        <NavItem label="Resultados" isActive={currentPath === 'recordings'} onClick={() => onNavigate('recordings')} isCollapsed={isCollapsed}>
                            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18" /></svg>
                        </NavItem>
                        <NavItem label="Documentos" isActive={currentPath === 'profile'} onClick={() => onNavigate('profile')} isCollapsed={isCollapsed}>
                            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                        </NavItem>
                    </ul>
                </nav>

                <div className={`mt-auto pt-6 border-t border-slate-50 ${isCollapsed ? 'items-center' : ''}`}>
                    <button onClick={onLogout} className={`flex items-center w-full group ${isCollapsed ? 'justify-center' : 'gap-3 px-2 hover:bg-slate-50 py-2 rounded-xl'}`}>
                        <div className="w-8 h-8 rounded-lg overflow-hidden border border-amber/30">
                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                        {!isCollapsed && (
                            <div className="text-left">
                                <p className="text-[11px] font-black text-gunmetal truncate w-32">{user.name}</p>
                                <p className="text-[8px] font-bold text-ochre uppercase tracking-widest">Sair</p>
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
