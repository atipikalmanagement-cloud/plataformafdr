
import React, { useState, useEffect } from 'react';
import { User, Theme, DiscProfile } from '../types';
import DiscTestModal from './DiscTestModal';

interface AuthScreenProps {
    onLogin: (user: User) => void;
    theme: Theme;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, theme }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [pendingUser, setPendingUser] = useState<User | null>(null);
    
    // Clear error when toggling between login and register
    useEffect(() => {
        setError(null);
    }, [isLogin]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        const storedUsers = localStorage.getItem('dr_users');
        const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
        
        if (isLogin) {
            const user = users.find((u: User) => u.email.toLowerCase() === email.toLowerCase());
            
            if (!user) {
                setError('EMAIL NÃO ENCONTRADO. VERIFIQUE OU REGISTE-SE.');
                return;
            }

            if (user.password !== password) {
                setError('PALAVRA-PASSE INCORRETA. TENTE NOVAMENTE.');
                return;
            }

            onLogin(user);
        } else {
            const emailExists = users.some((u: User) => u.email.toLowerCase() === email.toLowerCase());
            
            if (emailExists) {
                setError('ESTE EMAIL JÁ ESTÁ REGISTADO. TENTE FAZER LOGIN.');
                return;
            }

            if (password.length < 6) {
                setError('A PALAVRA-PASSE DEVE TER PELO MENOS 6 CARACTERES.');
                return;
            }

            const newUser: User = {
                id: Date.now().toString(),
                name,
                email,
                password,
                brand: brand || 'Independente',
                avatarUrl: `https://avatar.iran.liara.run/public?username=${encodeURIComponent(name)}`,
                joinedDate: new Date().toISOString()
            };

            // Don't login yet, show DISC test
            setPendingUser(newUser);
        }
    };

    const handleDiscComplete = (profile: DiscProfile) => {
        if (!pendingUser) return;
        
        const finalUser = { ...pendingUser, discProfile: profile };
        
        // Save to "database"
        const storedUsers = localStorage.getItem('dr_users');
        const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
        const updatedUsers = [...users, finalUser];
        localStorage.setItem('dr_users', JSON.stringify(updatedUsers));
        
        onLogin(finalUser);
    };

    if (pendingUser) {
        return <DiscTestModal onComplete={handleDiscComplete} />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gunmetal relative overflow-hidden">
            {/* Background Accents using Palette */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-ochre blur-[150px] rounded-full"></div>
                <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-amber blur-[150px] rounded-full opacity-50"></div>
            </div>

            <div className="w-full max-w-md bg-ghost rounded-[40px] p-10 md:p-14 border border-olive/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative z-10 animate-fade-up">
                <div className="flex flex-col items-center mb-12">
                    <div className="w-16 h-16 bg-amber rounded-2xl flex items-center justify-center shadow-2xl shadow-amber/30 mb-8">
                        <svg className="w-10 h-10 text-gunmetal" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight leading-none mb-3 text-center text-gunmetal">DR COACH</h1>
                    <p className="text-[11px] font-black text-olive uppercase tracking-[0.3em] opacity-60">AI Sales Roleplays</p>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-ochre/10 border border-ochre/20 rounded-2xl animate-shake">
                        <p className="text-[10px] font-black text-ochre text-center uppercase tracking-wider leading-relaxed">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                        <>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest mb-2 px-1 text-olive opacity-50">Nome Completo</label>
                                <input 
                                    type="text" required value={name} onChange={e => setName(e.target.value)}
                                    className="w-full bg-slate-100/50 border border-transparent px-5 py-4 rounded-2xl outline-none transition-all text-gunmetal font-bold focus:bg-white focus:border-amber/30"
                                    placeholder="João Silva"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest mb-2 px-1 text-olive opacity-50">Empresa / Agência</label>
                                <input 
                                    type="text" value={brand} onChange={e => setBrand(e.target.value)}
                                    className="w-full bg-slate-100/50 border border-transparent px-5 py-4 rounded-2xl outline-none transition-all text-gunmetal font-bold focus:bg-white focus:border-amber/30"
                                    placeholder="Ex: Century 21"
                                />
                            </div>
                        </>
                    )}
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-2 px-1 text-olive opacity-50">Email Corporativo</label>
                        <input 
                            type="email" required value={email} onChange={e => setEmail(e.target.value)}
                            className="w-full bg-slate-100/50 border border-transparent px-5 py-4 rounded-2xl outline-none transition-all text-gunmetal font-bold focus:bg-white focus:border-amber/30"
                            placeholder="seu@email.com"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-2 px-1 text-olive opacity-50">Palavra-passe</label>
                        <input 
                            type="password" required value={password} onChange={e => setPassword(e.target.value)}
                            className="w-full bg-slate-100/50 border border-transparent px-5 py-4 rounded-2xl outline-none transition-all text-gunmetal font-bold focus:bg-white focus:border-amber/30"
                            placeholder="••••••••"
                        />
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-gunmetal hover:bg-ochre text-amber hover:text-ghost font-black py-5 rounded-2xl transition-all shadow-2xl shadow-gunmetal/20 active:scale-95 mt-4 text-sm tracking-widest"
                    >
                        {isLogin ? 'ENTRAR NO TREINO' : 'CRIAR CONTA AGORA'}
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-xs font-bold text-olive">
                        {isLogin ? 'Novo por aqui?' : 'Já tens conta?'}
                        <button 
                            onClick={() => setIsLogin(!isLogin)}
                            className="ml-2 text-ochre font-black hover:text-amber transition-colors underline decoration-2 underline-offset-4"
                        >
                            {isLogin ? 'Regista-te agora' : 'Faz login'}
                        </button>
                    </p>
                </div>
            </div>
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-shake { animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both; }
            `}</style>
        </div>
    );
};

export default AuthScreen;
