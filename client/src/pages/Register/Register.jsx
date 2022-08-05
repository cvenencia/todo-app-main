import React, { useContext, useState } from 'react';
import { AppContext } from '../../App';
import { useEffect } from 'react';
import { useRef } from 'react';
import Button from '../../components/buttons/Button';
import ToggleThemeButton from '../../components/buttons/ToggleTheme';
import TextInput from '../../components/input/TextInput';
import { doRegister } from '../../services/api.js';
import { Link, useNavigate } from 'react-router-dom';
import ErrorForm from '../../components/popups/ErrorForm';

export default function Register() {
    const { login, setLogin } = useContext(AppContext);
    const [errorTimeout, setErrorTimeout] = useState();
    const [errorMessage, setErrorMessage] = useState();
    const usernameRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const errorRef = useRef();
    const navigate = useNavigate();

    const handleRegister = async () => {
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;
        const confirmPassword = confirmPasswordRef.current.value;

        if (password !== confirmPassword) {
            animateError();
            return setErrorMessage('Passwords do not match');
        }

        const response = await doRegister(username, password);
        if (response === true) {
            clearTimeout(errorTimeout);
            return setLogin('SUCCESS');
        }

        setErrorMessage(response);
        animateError();
        setLogin('FAIL');
    };

    const handleKeyPress = e => {
        if (e.key === 'Enter') {
            handleRegister();
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
        if (login === 'SUCCESS') navigate('/');
    }, [login, navigate]);

    useEffect(() => {
        return () => clearTimeout(errorTimeout);
    });

    return (
        <div className='form-page-container box-shadow'>
            <ToggleThemeButton />
            <h1>REGISTER</h1>

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
            <TextInput
                placeholder={'Confirm password'}
                textInputRef={confirmPasswordRef}
                type='password'
                className='form-input'
                onKeyDown={handleKeyPress}
            />
            <Button
                children={'Register'}
                onClick={handleRegister}
                className='form__btn'
            />
            <ErrorForm errorRef={errorRef} message={errorMessage} />
            <span>
                Already have an account? <Link to='/login'>Login</Link>
            </span>
        </div>
    );
}
