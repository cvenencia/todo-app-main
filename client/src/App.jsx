import React, { createContext, useState } from 'react';
import { useEffect } from 'react';
import Login from './pages/Login';
import { sendToken } from './services/api';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Todos from './pages/Todos';

export const AppContext = createContext(null);

export default function App() {
    const [theme, setTheme] = useState('light');
    const [login, setLogin] = useState('WAITING');

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    useEffect(() => {
        (async () => {
            const response = await sendToken();

            if (response) setLogin('SUCCESS');
            else setLogin('FAIL');
        })();
    }, []);

    return (
        <div className={theme}>
            <AppContext.Provider
                value={{ theme, toggleTheme, login, setLogin }}
            >
                <BrowserRouter>
                    <Routes>
                        <Route exact path='/' element={<Todos />} />
                        <Route path='/login' element={<Login />} />
                        {/* <Login /> */}
                    </Routes>
                </BrowserRouter>
            </AppContext.Provider>
        </div>
    );
}
