
import React, { useState } from 'react';
import { User, Recording } from '../types';

interface ProfileScreenProps {
    user: User;
    recordings: Recording[];
    onUpdate: (user: User) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, recordings, onUpdate }) => {
    const [name, setName] = useState(user.name);
    const [brand, setBrand] = useState(user.brand);
    const [isEditing, setIsEditing] = useState(false);

    const totalCalls = recordings.length;
    const avgScore = totalCalls > 0 
        ? Math.round(recordings.reduce((acc, r) => acc + r.analysis.score, 0) / totalCalls) 
        : 0;
    const qualifiedCount = recordings.filter(r => r.analysis.isQualified).length;

    const handleSave = () => {
        onUpdate({ ...user, name, brand });
        setIsEditing(false);
    };

    return (
        <div className="w-full max-w-4xl mx-auto animate-fade-in">
            <header className="mb-12">
                <span className="text-teal-500 font-bold tracking-[0.3em] text-xs uppercase mb-2 block">Área Pessoal</span>
                <h1 className="text-4xl font-extrabold tracking-tight">O Seu Perfil</h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 space-y-8">
                    <div className="glass-card rounded-3xl p-8 border border-white/5 flex flex-col items-center text-center">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-teal-500 blur-2xl opacity-20 rounded-full"></div>
                            <img src={user.avatarUrl} alt={user.name} className="relative w-32 h-32 rounded-full border-4 border-teal-500/20 shadow-2xl" />
                        </div>
                        
                        {isEditing ? (
                            <div className="w-full space-y-4">
                                <input 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-center text-xl font-bold text-white outline-none focus:border-teal-500"
                                    value={name} onChange={e => setName(e.target.value)}
                                />
                                <input 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-center text-sm font-bold text-teal-400 uppercase outline-none focus:border-teal-500"
                                    value={brand} onChange={e => setBrand(e.target.value)}
                                />
                                <div className="flex gap-2">
                                    <button onClick={handleSave} className="flex-1 bg-teal-500 text-white font-bold py-2 rounded-xl text-sm">Guardar</button>
                                    <button onClick={() => setIsEditing(false)} className="flex-1 bg-white/10 text-white font-bold py-2 rounded-xl text-sm">Cancelar</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
                                <p className="text-sm font-bold text-teal-500 uppercase tracking-widest mb-6">{user.brand}</p>
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                                >
                                    Editar Informação
                                </button>
                            </>
                        )}
                        
                        <div className="w-full mt-10 pt-10 border-t border-white/5 text-left">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Detalhes da Conta</p>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold">Email</p>
                                    <p className="text-sm font-medium">{user.email}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold">Membro desde</p>
                                    <p className="text-sm font-medium">{new Date(user.joinedDate).toLocaleDateString('pt-PT')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {user.discProfile && (
                        <div className="bg-amber/10 rounded-3xl p-8 border border-amber/20">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-amber text-gunmetal rounded-2xl flex items-center justify-center font-black text-xl">
                                    {user.discProfile.type}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-ghost leading-none">Perfil DISC</h3>
                                    <p className="text-xs text-amber font-bold uppercase tracking-widest mt-1">{user.discProfile.label}</p>
                                </div>
                            </div>
                            <p className="text-slate-400 text-xs leading-relaxed mb-6">
                                {user.discProfile.description}
                            </p>
                            <div className="p-4 bg-gunmetal/40 rounded-2xl border border-white/5">
                                <p className="text-[9px] font-bold text-amber uppercase tracking-widest mb-2">Estratégia de Treino</p>
                                <p className="text-[11px] text-ghost leading-relaxed italic">
                                    {user.discProfile.challengeStrategy}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-7 space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div className="glass-card rounded-3xl p-6 border border-white/5">
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Total de Treinos</p>
                            <p className="text-4xl font-black text-white">{totalCalls}</p>
                         </div>
                         <div className="glass-card rounded-3xl p-6 border border-white/5">
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Score Médio</p>
                            <p className="text-4xl font-black text-teal-500">{avgScore}%</p>
                         </div>
                         <div className="glass-card rounded-3xl p-6 border border-white/5">
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Leads Qualificados</p>
                            <p className="text-4xl font-black text-emerald-500">{qualifiedCount}</p>
                         </div>
                         <div className="glass-card rounded-3xl p-6 border border-white/5">
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Nível de Experiência</p>
                            <p className="text-2xl font-black text-white uppercase">{totalCalls > 50 ? 'Master' : totalCalls > 10 ? 'Avançado' : 'Iniciante'}</p>
                         </div>
                    </div>

                    <div className="glass-card rounded-3xl p-8 border border-white/5">
                        <h3 className="text-lg font-bold mb-4">Sobre a sua Performance</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            O seu progresso é guardado automaticamente. Continue a treinar para desbloquear novas medalhas e subir no ranking da sua empresa. A consistência no treino leva à perfeição no terreno.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileScreen;
