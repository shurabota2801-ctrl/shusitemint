const API_BASE = 'http://localhost:8000/api/auth/';

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`button[onclick="showTab('${tabName}')"]`).classList.add('active');
}

async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const errorElement = document.getElementById('login-error');

    try {
        const response = await fetch(`${API_BASE}login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('user_id', data.user_id);
            localStorage.setItem('username', data.username);
            window.location.href = 'notes.html';
        } else {
            const error = await response.json();
            errorElement.textContent = error.detail || 'Ошибка входа';
        }
    } catch (error) {
        errorElement.textContent = 'Ошибка подключения';
    }
}

async function register() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const errorElement = document.getElementById('register-error');

    try {
        const response = await fetch(`${API_BASE}register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            errorElement.textContent = 'Регистрация успешна! Войдите в систему.';
            showTab('login');
        } else {
            const error = await response.json();
            errorElement.textContent = error.username || error.password || 'Ошибка регистрации';
        }
    } catch (error) {
        errorElement.textContent = 'Ошибка подключения';
    }
}

function checkAuth() {
    const token = localStorage.getItem('token');
    if (token && window.location.pathname.endsWith('index.html')) {
        window.location.href = 'notes.html';
    } else if (!token && !window.location.pathname.endsWith('index.html')) {
        window.location.href = 'index.html';
    }
}

// Проверяем авторизацию при загрузке страницы
checkAuth();