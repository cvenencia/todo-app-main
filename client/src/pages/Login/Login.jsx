import React, { useContext, useState } from 'react';
import { AppContext } from '../../App';
import { useEffect } from 'react';
import { useRef } from 'react';
import Button from '../../components/buttons/Button';
import ToggleThemeButton from '../../components/buttons/ToggleTheme';
import TextInput from '../../components/input/TextInput';
import { doLogin } from '../../services/api.js';
import { Link, useNavigate } from 'react-router-dom';
import ErrorForm from '../../components/popups/ErrorForm';

export default function Login() {
    const { login, setLogin } = useContext(AppContext);
    const [errorTimeout, setErrorTimeout] = useState();
    const usernameRef = useRef();
    const passwordRef = useRef();
    const errorRef = useRef();
    const navigate = useNavigate();

    const handleLogin = async () => {
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;

        const response = await doLogin(username, password);
        if (response) {
            clearTimeout(errorTimeout);
            return setLogin('SUCCESS');
        }

        setLogin('FAIL');
        animateError();
    };

    const handleKeyPress = e => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    const animateError = () => {
        clearTimeout(errorTimeout);
        errorRef.current.style.display = 'block';
        errorRef.current.style.animation =
            'slide-in-error-form 250ms ease forwards';

        setErrorTimeout(
            setTimeout(() => {
                errorRef.current.style.animation =
                    'slide-out-error-form 250ms ease forwards';
                setTimeout(
                    () => (errorRef.current.style.display = 'none'),
                    250
                );
            }, 5000)
        );
    };

    useEffect(() => {
        if (login === 'SUCCESS') navigate(process.env.REACT_APP_GH_PAGES + '/');
    }, [login, navigate]);

    useEffect(() => {
        return () => clearTimeout(errorTimeout);
    });

    return (
        <div className='form-page-container box-shadow'>
            <ToggleThemeButton />
            <h1>LOGIN</h1>
            <TextInput
                placeholder={'Username'}
                textInputRef={usernameRef}
                className='form-input'
                onKeyDown={handleKeyPress}
            />
            <TextInput
                placeholder={'Password'}
                textInputRef={passwordRef}
                type='password'
                className='form-input'
                onKeyDown={handleKeyPress}
            />
            <Button
                children={'Login'}
                onClick={handleLogin}
                className='form__btn'
            />
            <ErrorForm errorRef={errorRef} message={'Invalid credentials.'} />
            <span>
                Don't have an account?{' '}
                <Link to={process.env.REACT_APP_GH_PAGES + '/register'}>
                    Register
                </Link>
            </span>
        </div>
    );
}
