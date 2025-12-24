
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
            {/* Sidebar Desktop - Hidden on Mobile */}
            <div 
                className="hidden md:block h-full z-50 transition-all duration-500 ease-in-out"
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
            <main className="flex-1 relative flex flex-col h-full md:pb-6 md:pr-6 transition-all duration-500 ease-in-out overflow-hidden">
                
                {/* Top Navbar Refined */}
                <div className="absolute top-4 left-0 right-0 md:right-6 z-30 px-4 md:px-0 flex items-center justify-between pointer-events-none">
                    <div className="flex-1 pointer-events-auto">
                        {currentPath !== 'selection' && (
                            <button 
                                onClick={() => onNavigate('selection')}
                                className="bg-amber text-gunmetal px-5 py-2.5 rounded-xl font-bold text-[11px] flex items-center gap-2 shadow-lg shadow-amber/10 hover:scale-105 transition-all group"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                NOVO TREINO
                            </button>
                        )}
                        <div className="md:hidden flex items-center gap-2 pointer-events-auto">
                            <div className="w-8 h-8 bg-amber rounded-lg flex items-center justify-center text-gunmetal font-black text-xs">DR</div>
                            <span className="font-black text-sm tracking-tight">Coach</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pointer-events-auto">
                        <button className="w-9 h-9 rounded-xl bg-ghost/10 backdrop-blur-md flex items-center justify-center border border-white/5 text-ghost hover:bg-ghost/20 transition-all">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </button>
                        <div className="w-9 h-9 rounded-xl overflow-hidden border border-amber/50 shadow-md">
                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>

                {/* Content Scroll Area */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar px-4 md:px-0 pt-20 md:pt-24 pb-24 md:pb-0">
                    <div className="relative z-10">
                        {children}
                    </div>
                </div>

                {/* Mobile Bottom Navigation */}
                <div className="md:hidden fixed bottom-6 left-4 right-4 z-[60] bg-gunmetal/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex justify-around shadow-2xl">
                    <button onClick={() => onNavigate('selection')} className={`p-3 rounded-xl transition-all ${currentPath === 'selection' ? 'bg-amber text-gunmetal' : 'text-olive'}`}>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                    <button onClick={() => onNavigate('goals')} className={`p-3 rounded-xl transition-all ${currentPath === 'goals' ? 'bg-amber text-gunmetal' : 'text-olive'}`}>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    </button>
                    <button onClick={() => onNavigate('recordings')} className={`p-3 rounded-xl transition-all ${currentPath === 'recordings' ? 'bg-amber text-gunmetal' : 'text-olive'}`}>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18" /></svg>
                    </button>
                    <button onClick={() => onNavigate('profile')} className={`p-3 rounded-xl transition-all ${currentPath === 'profile' ? 'bg-amber text-gunmetal' : 'text-olive'}`}>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Layout;
