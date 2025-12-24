
import React, { useState, useCallback, useEffect } from 'react';
import { Recording, User, Theme } from './types';
import Layout from './components/Layout';
import SelectionFlow from './components/SelectionFlow';
import RecordingsScreen from './components/RecordingsScreen';
import GoalsScreen from './components/GoalsScreen';
import ProfileScreen from './components/ProfileScreen';
import AuthScreen from './components/AuthScreen';

type Page = 'selection' | 'recordings' | 'goals' | 'profile';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('selection');
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [theme, setTheme] = useState<Theme>('dark');

  // Load user from session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('dr_current_user');
    const savedTheme = localStorage.getItem('dr_theme') as Theme;
    
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser);
            setCurrentUser(user);
            loadUserRecordings(user.id);
        } catch (e) {
            console.error("Erro ao carregar sessão:", e);
            localStorage.removeItem('dr_current_user');
        }
    }
    
    if (savedTheme) {
        setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('dr_theme', newTheme);
  };

  const loadUserRecordings = (userId: string) => {
    const storedRecordings = localStorage.getItem('dr_recordings');
    const allRecordings = storedRecordings ? JSON.parse(storedRecordings) : [];
    const userRecs = allRecordings.filter((r: Recording) => r.userId === userId);
    setRecordings(userRecs);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('dr_current_user', JSON.stringify(user));
    loadUserRecordings(user.id);
    setCurrentPage('selection');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('dr_current_user');
    setRecordings([]);
    setCurrentPage('selection');
  };

  const addRecording = useCallback((newRecording: Omit<Recording, 'id' | 'date' | 'userId'>) => {
    if (!currentUser) return;

    const recording: Recording = {
        ...newRecording,
        id: Date.now().toString(),
        userId: currentUser.id,
        date: new Date().toISOString()
    };

    const storedRecordings = localStorage.getItem('dr_recordings');
    const allRecordings = storedRecordings ? JSON.parse(storedRecordings) : [];
    const updatedAll = [recording, ...allRecordings];
    localStorage.setItem('dr_recordings', JSON.stringify(updatedAll));
    
    setRecordings(prev => [recording, ...prev]);
  }, [currentUser]);

  const handleUpdateProfile = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('dr_current_user', JSON.stringify(updatedUser));
    
    // Update in users "database"
    const storedUsers = localStorage.getItem('dr_users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    const updatedUsers = users.map((u: User) => u.id === updatedUser.id ? updatedUser : u);
    localStorage.setItem('dr_users', JSON.stringify(updatedUsers));
  };

  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} theme={theme} />;
  }

  const renderPage = () => {
    switch (currentPage) {
        case 'selection':
            return <SelectionFlow onSaveRecording={addRecording} user={currentUser} recordings={recordings} />;
        case 'recordings':
            return <RecordingsScreen recordings={recordings} />;
        case 'goals':
            return <GoalsScreen recordings={recordings} />;
        case 'profile':
            return <ProfileScreen user={currentUser} recordings={recordings} onUpdate={handleUpdateProfile} />;
        default:
            return <SelectionFlow onSaveRecording={addRecording} user={currentUser} recordings={recordings} />;
    }
  }

  return (
    <div className={theme}>
        <Layout 
            onNavigate={setCurrentPage} 
            currentPath={currentPage} 
            user={currentUser} 
            onLogout={handleLogout}
            theme={theme}
            onToggleTheme={toggleTheme}
        >
            {renderPage()}
        </Layout>
    </div>
  );
};

export default App;
