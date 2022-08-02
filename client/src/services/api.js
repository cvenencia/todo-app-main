export async function doLogin(username, password) {
    const API_URL = process.env.REACT_APP_API_URL;
    const url = API_URL + '/user/login';
    const data = {
        mode: 'cors',
        headers: new Headers({
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        }),
        method: 'POST',
        body: JSON.stringify({ username, password }),
    };

    const response = await fetch(url, data)
        .then(response => {
            if (!response.ok) return;
            return response.json();
        })
        .then(body => {
            if (!body) return;
            localStorage.token = body.token;
            localStorage.refreshToken = body.refreshToken;
            return true;
        });
    return response;
}

export async function sendToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return;

    const API_URL = process.env.REACT_APP_API_URL;
    const url = API_URL + '/user/token';
    const data = {
        mode: 'cors',
        headers: new Headers({
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        }),
        method: 'POST',
        body: JSON.stringify({ token: refreshToken }),
    };

    const token = await fetch(url, data)
        .then(response => response.json())
        .then(response => response.token)
        .catch(() => null);
    token && localStorage.setItem('token', token);
    return token ? true : false;
}

export async function getTodos(filter = {}) {
    const token = localStorage.getItem('token');
    if (!token) return;

    const API_URL = process.env.REACT_APP_API_URL;
    const url = API_URL + '/todo';
    const data = {
        mode: 'cors',
        headers: new Headers({
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
            filters: JSON.stringify(filter),
        }),
        method: 'GET',
    };

    const response = await fetch(url, data)
        .then(response => response.json())
        .catch(() => null);

    return response;
}

export async function updateTodo(todo) {
    const token = localStorage.getItem('token');
    if (!token) return;

    const API_URL = process.env.REACT_APP_API_URL;
    const url = API_URL + '/todo';
    const data = {
        mode: 'cors',
        headers: new Headers({
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        }),
        method: 'PATCH',
        body: JSON.stringify(todo),
    };

    const response = await fetch(url, data).catch(() => null);

    return response.ok;
}

export async function createTodo(todo) {
    const token = localStorage.getItem('token');
    if (!token) return;

    const API_URL = process.env.REACT_APP_API_URL;
    const url = API_URL + '/todo';
    const data = {
        mode: 'cors',
        headers: new Headers({
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        }),
        body: JSON.stringify(todo),
        method: 'POST',
    };

    const response = await fetch(url, data).catch(() => null);

    return response.ok;
}

export async function deleteTodo(todo) {
    const token = localStorage.getItem('token');
    if (!token) return;

    const API_URL = process.env.REACT_APP_API_URL;
    const url = API_URL + '/todo';
    const data = {
        mode: 'cors',
        headers: new Headers({
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        }),
        body: JSON.stringify(todo),
        method: 'DELETE',
    };

    const response = await fetch(url, data).catch(() => null);

    return response.ok;
}

export async function tryRequest(callback, params) {
    const response = await callback(params);
    if (response) return response;

    await sendToken();
    return await callback(params);
}
