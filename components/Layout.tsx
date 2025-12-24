
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { User, Theme } from '../types';

type Page = 'selection' | 'recordings' | 'goals' | 'profile';

interface LayoutProps {
    children: React.ReactNode;
    onNavigate: (path: Page) => void;
    currentPath: Page;
    user: User;
    onLogout: () => void;
    theme: Theme;
    onToggleTheme: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onNavigate, currentPath, user, onLogout, theme, onToggleTheme }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

    return (
        <div className="flex flex-col md:flex-row h-screen overflow-hidden relative">
            {/* Sidebar Container com trigger de Hover */}
            <div 
                className="h-full z-50 transition-all duration-500 ease-in-out"
                onMouseEnter={() => setSidebarCollapsed(false)}
                onMouseLeave={() => setSidebarCollapsed(true)}
            >
                <Sidebar 
                    onNavigate={onNavigate} 
                    currentPath={currentPath} 
                    user={user} 
                    onLogout={onLogout}
                    theme={theme}
                    onToggleTheme={onToggleTheme}
                    isCollapsed={sidebarCollapsed}
                    onToggleCollapse={() => {}} 
                />
            </div>
            
            {/* Main Content Area */}
            <main className="flex-1 relative flex flex-col h-full md:pb-14 md:pr-12 transition-all duration-500 ease-in-out">
                
                {/* Top Navbar - Posicionada de forma absoluta para não afetar o ponto de partida do conteúdo */}
                {currentPath !== 'selection' && (
                    <div className="absolute top-8 left-0 right-12 z-30 px-6 md:px-0 flex items-center justify-between animate-fade-up">
                        <div className="flex-1">
                            <button 
                                onClick={() => onNavigate('selection')}
                                className="bg-amber text-gunmetal px-6 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 shadow-xl shadow-amber/20 hover:scale-105 transition-all group"
                            >
                                <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                NOVO TREINO
                            </button>
                        </div>

                        <div className="flex items-center gap-4 animate-fade-in">
                            <div className="flex items-center gap-2">
                                <button className="w-11 h-11 rounded-full bg-ghost flex items-center justify-center shadow-sm border border-olive/20 text-olive hover:text-gunmetal transition-colors">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                                <button className="w-11 h-11 rounded-full bg-ghost flex items-center justify-center shadow-sm border border-olive/20 text-olive hover:text-gunmetal transition-colors relative">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-amber rounded-full border-2 border-ghost"></span>
                                </button>
                            </div>
                            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-amber shadow-lg">
                                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Container de Scroll com pt-36 obrigatório (linha vermelha) */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-6 md:px-0 pt-16 md:pt-36">
                    <div className="relative z-10 pb-10">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
