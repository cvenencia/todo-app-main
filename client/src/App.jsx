import React, { createContext, useState } from 'react';
import { useEffect } from 'react';
import Login from './pages/Login';
import { sendToken } from './services/api';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Todos from './pages/Todos';
import Register from './pages/Register';
import './general.scss';
import './theme.scss';

export const AppContext = createContext(null);

export default function App() {
    const [theme, setTheme] = useState();
    const [login, setLogin] = useState('WAITING');
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 900);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    const updateMedia = () => {
        setIsDesktop(window.innerWidth > 900);
    };

    useEffect(() => {
        setTheme(localStorage.getItem('theme') || 'dark');
        (async () => {
            const response = await sendToken();

            if (response) setLogin('SUCCESS');
            else setLogin('FAIL');
        })();
    }, []);

    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        window.addEventListener('resize', updateMedia);
        return () => window.removeEventListener('resize', updateMedia);
    });

    return (
        <div
            className={`app-container ${theme}`}
            style={{ minHeight: '100vh' }}
        >
            <AppContext.Provider
                value={{ theme, toggleTheme, login, setLogin, isDesktop }}
            >
                <BrowserRouter>
                    <Routes>
                        <Route path={process.env.REACT_APP_GH_PAGES}>
                            <Route path='' element={<Todos />} />
                            <Route path='login' element={<Login />} />
                            <Route path='register' element={<Register />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </AppContext.Provider>
        </div>
    );
}
