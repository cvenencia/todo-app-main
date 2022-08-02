import React, { useContext } from 'react';
import { AppContext } from '../../App';
import { useEffect } from 'react';
import { useRef } from 'react';
import Button from '../../components/buttons/Button';
import TextInput from '../../components/input/TextInput';
import { doRegister } from '../../services/api.js';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const { login, setLogin } = useContext(AppContext);
    const usernameRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const navigate = useNavigate();

    const handleRegister = async () => {
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;
        const confirmPassword = confirmPasswordRef.current.value;

        if (password !== confirmPassword)
            return alert('Passwords do not match');

        const response = await doRegister(username, password);
        if (response === true) return setLogin('SUCCESS');

        alert(response);
        setLogin('FAIL');
    };

    useEffect(() => {
        if (login === 'SUCCESS') navigate('/');
    }, [login, navigate]);

    return (
        <div>
            <TextInput placeholder={'Username'} textInputRef={usernameRef} />
            <TextInput
                placeholder={'Password'}
                textInputRef={passwordRef}
                type='password'
            />
            <TextInput
                placeholder={'Confirm password'}
                textInputRef={confirmPasswordRef}
                type='password'
            />
            <Button children={'Register'} onClick={handleRegister} />
        </div>
    );
}
