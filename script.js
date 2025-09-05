const noteInput = document.getElementById('new-note-input');
const addButton = document.getElementById('add-note-button');
const notesContainer = document.getElementById('notes-container');
const toggleThemeButton = document.getElementById('toggle-theme-button');
const body = document.body;
const colors = ['note-yellow', 'note-blue', 'note-pink'];


// Crea un elemento de nota con el texto y la clase de color proporcionados

function createNoteElement(text, colorClass) {
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note', colorClass); 
    noteDiv.textContent = text;

    const deleteButton = document.createElement('span');
    deleteButton.classList.add('delete-btn');
    deleteButton.textContent = 'x';

    noteDiv.appendChild(deleteButton);
    return noteDiv;
}


// Guarda las notas actuales en el almacenamiento local

function saveNotes() {
    const notes = [];
    document.querySelectorAll('.note').forEach(note => {
        if (!note.classList.contains('editing')) {
            notes.push({
                text: note.childNodes[0].nodeValue,
                color: note.classList[1]
            });
        }
    });
    localStorage.setItem('notes', JSON.stringify(notes));
}


// Carga las notas desde el almacenamiento local al iniciar la aplicacion

function loadNotes() {
    notesContainer.innerHTML = '';
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
        const notes = JSON.parse(storedNotes);
        notes.forEach(noteData => {
            const newNote = createNoteElement(noteData.text, noteData.color);
            notesContainer.appendChild(newNote);
        });
    }
}


// Establece el tema inicial basado en la preferencia guardada


function setInitialTheme() {
    const isDarkMode = localStorage.getItem('isDarkMode') === 'true';
    if (isDarkMode) {
        body.classList.add('dark-mode');
        toggleThemeButton.textContent = 'Modo Claro';
    }
}


// Habilita o deshabilita el boton de agregar nota basado en la entrada


noteInput.addEventListener('input', () => {
    addButton.disabled = noteInput.value.trim() === '';
});

// Alterna entre modo oscuro y claro guarda la preferencia


toggleThemeButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('isDarkMode', isDarkMode);
    toggleThemeButton.textContent = isDarkMode ? 'Modo Claro' : 'Modo Oscuro';
});


// Edita una nota al hacer doble clic en ella

notesContainer.addEventListener('dblclick', (event) => {
    const target = event.target;
    if (target.classList.contains('note')) {
        const currentText = target.textContent.slice(0, -1);
        target.textContent = '';
        target.classList.add('editing');

        const textarea = document.createElement('textarea');
        textarea.value = currentText;
        target.appendChild(textarea);
        textarea.focus();

        function saveEdit() {
            const newText = textarea.value.trim();
            target.textContent = newText;
            target.classList.remove('editing');
            
            const deleteButton = document.createElement('span');
            deleteButton.classList.add('delete-btn');
            deleteButton.textContent = 'x';
            target.appendChild(deleteButton);

            saveNotes();
        }
        textarea.addEventListener('blur', saveEdit);
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveEdit();
            }
        });
    }
});

// Agrega una nueva nota con un color aleatorio al hacer clic en el boton

addButton.addEventListener('click', () => {
    const noteText = noteInput.value.trim();
    if (noteText !== '') {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const newNote = createNoteElement(noteText, randomColor);
        notesContainer.appendChild(newNote);
        noteInput.value = '';
        addButton.disabled = true;
        saveNotes();
    }
});

// Elimina una nota al hacer clic en el boton de eliminar

notesContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        event.target.parentElement.remove();
        saveNotes();
    }
});

// Agrega efectos visuales al pasar el mouse sobre una nota

notesContainer.addEventListener('mouseover', (event) => {
    if (event.target.classList.contains('note')) {
        event.target.style.boxShadow = '0 0 15px rgba(0,0,0,0.3)';
    }
});

// Elimina los efectos visuales al quitar el mouse de una nota

notesContainer.addEventListener('mouseout', (event) => {
    if (event.target.classList.contains('note')) {
        event.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }
});



setInitialTheme();
loadNotes();