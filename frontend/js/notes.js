const API_BASE = 'http://localhost:8000/api/notes/';

// Основные функции
function getAuthHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`
    };
}

async function loadNotes() {
    try {
        const response = await fetch(API_BASE, { headers: getAuthHeaders() });
        if (response.ok) {
            displayNotes(await response.json());
        } else if (response.status === 401) {
            logout();
        }
    } catch (error) {
        alert('Ошибка загрузки заметок');
    }
}

function displayNotes(notes) {
    const container = document.getElementById('notes-container');
    container.innerHTML = notes.length ? notes.map(note => `
        <div class="note-card">
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <small>Создано: ${new Date(note.created_at).toLocaleString('ru-RU')}</small>
            <div class="note-actions">
                <button class="edit-btn" onclick="editNote(${note.id})">✏️</button>
                <button class="delete-btn" onclick="deleteNote(${note.id})">🗑️</button>
            </div>
        </div>
    `).join('') : '<p>У вас пока нет заметок</p>';
}

async function createNote() {
    const title = document.getElementById('note-title').value.trim();
    const content = document.getElementById('note-content').value.trim();
    
    if (!title || !content) return alert('Заполните все поля');

    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ title, content })
        });
        
        if (response.ok) {
            document.getElementById('note-title').value = '';
            document.getElementById('note-content').value = '';
            loadNotes();
            alert('Заметка создана!');
        }
    } catch (error) {
        alert('Ошибка создания заметки');
    }
}

async function editNote(noteId) {
    try {
        const response = await fetch(`${API_BASE}${noteId}/`, { headers: getAuthHeaders() });
        if (response.ok) {
            const note = await response.json();
            document.getElementById('edit-note-id').value = note.id;
            document.getElementById('edit-note-title').value = note.title;
            document.getElementById('edit-note-content').value = note.content;
            document.getElementById('editModal').style.display = 'block';
        }
    } catch (error) {
        alert('Ошибка загрузки заметки');
    }
}

async function updateNote() {
    const noteId = document.getElementById('edit-note-id').value;
    const title = document.getElementById('edit-note-title').value.trim();
    const content = document.getElementById('edit-note-content').value.trim();

    if (!title || !content) return alert('Заполните все поля');

    try {
        const response = await fetch(`${API_BASE}${noteId}/`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ title, content })
        });
        
        if (response.ok) {
            document.getElementById('editModal').style.display = 'none';
            loadNotes();
            alert('Заметка обновлена!');
        }
    } catch (error) {
        alert('Ошибка обновления заметки');
    }
}

async function deleteNote(noteId) {
    if (!confirm('Удалить заметку?')) return;

    try {
        const response = await fetch(`${API_BASE}${noteId}/`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            loadNotes();
            alert('Заметка удалена!');
        }
    } catch (error) {
        alert('Ошибка удаления заметки');
    }
}

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}

// Вспомогательные функции
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Обработчики событий
document.addEventListener('click', (e) => {
    if (e.target.id === 'editModal') closeEditModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeEditModal();
});

document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('token')) {
        window.location.href = 'index.html';
        return;
    }
    loadNotes();
});