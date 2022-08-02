import React, { useContext } from 'react';
import { AppContext } from '../../App';
import { useEffect } from 'react';
import { useRef } from 'react';
import Button from '../../components/buttons/Button';
import TextInput from '../../components/input/TextInput';
import { doLogin } from '../../services/api.js';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const { login, setLogin } = useContext(AppContext);
    const usernameRef = useRef();
    const passwordRef = useRef();
    const navigate = useNavigate();

    const handleLogin = async () => {
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;

        const response = await doLogin(username, password);
        if (response) setLogin('SUCCESS');
        else setLogin('FAIL');
    };

    useEffect(() => {
        if (login === 'SUCCESS') navigate('/');
    }, [login, navigate]);

    return (
        <div>
            <TextInput placeholder={'Username'} textInputRef={usernameRef} />
            <TextInput placeholder={'Password'} textInputRef={passwordRef} />
            <Button children={'Login'} onClick={handleLogin} />
        </div>
    );
}
