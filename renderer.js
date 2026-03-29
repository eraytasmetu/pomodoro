// Elements
const timeDisplay = document.getElementById('time-display');
const statusText = document.getElementById('status-text');
const btnToggle = document.getElementById('btn-toggle');
const iconToggle = document.getElementById('icon-toggle');
const btnReset = document.getElementById('btn-reset');

const modes = {
  pomodoro: { id: 'btn-pomodoro', min: 25, color: '#FF7B89', glow: 'rgba(255, 123, 137, 0.3)', text: 'Focus time' },
  short: { id: 'btn-short', min: 5, color: '#A0C4FF', glow: 'rgba(160, 196, 255, 0.3)', text: 'Short break' },
  long: { id: 'btn-long', min: 15, color: '#BDB2FF', glow: 'rgba(189, 178, 255, 0.3)', text: 'Long break' }
};

let currentMode = 'pomodoro';
let timerInterval = null;
let timeLeft = modes.pomodoro.min * 60;
let isRunning = false;
let totalTime = modes.pomodoro.min * 60;

// SVG Circle setup
const circle = document.querySelector('.progress-ring__circle.fg');
const radius = circle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;

function setProgress(percent) {
  const offset = circumference - percent / 100 * circumference;
  circle.style.strokeDashoffset = offset;
}

function updateDisplay() {
  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  timeDisplay.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  
  if(totalTime > 0) {
    const percent = ((totalTime - timeLeft) / totalTime) * 100;
    setProgress(percent);
  } else {
    setProgress(0);
  }
}

function switchMode(mode) {
  if (isRunning) toggleTimer();
  
  // Update buttons
  Object.values(modes).forEach(m => document.getElementById(m.id).classList.remove('active'));
  document.getElementById(modes[mode].id).classList.add('active');
  
  currentMode = mode;
  timeLeft = modes[mode].min * 60;
  totalTime = timeLeft;
  
  // Update Theme colors
  document.documentElement.style.setProperty('--theme-color', modes[mode].color);
  document.documentElement.style.setProperty('--theme-glow', modes[mode].glow);
  
  statusText.textContent = modes[mode].text;
  
  updateDisplay();
}

// Mode Listeners
document.getElementById('btn-pomodoro').addEventListener('click', () => switchMode('pomodoro'));
document.getElementById('btn-short').addEventListener('click', () => switchMode('short'));
document.getElementById('btn-long').addEventListener('click', () => switchMode('long'));

// Timer Control
let endTime = null;

function toggleTimer() {
  if (isRunning) {
    clearInterval(timerInterval);
    iconToggle.classList.remove('fa-pause');
    iconToggle.classList.add('fa-play');
  } else {
    endTime = Date.now() + (timeLeft * 1000);
    
    timerInterval = setInterval(() => {
      let now = Date.now();
      timeLeft = Math.round((endTime - now) / 1000);
      
      if (timeLeft <= 0) {
        timeLeft = 0;
        updateDisplay();
        clearInterval(timerInterval);
        isRunning = false;
        iconToggle.classList.remove('fa-pause');
        iconToggle.classList.add('fa-play');
        let nextStatus = currentMode === 'pomodoro' ? 'Break Time!' : 'Focus Time!';
        statusText.textContent = `Done! ${nextStatus}`;
        playAlarm();
      } else {
        updateDisplay();
      }
    }, 1000);
    iconToggle.classList.remove('fa-play');
    iconToggle.classList.add('fa-pause');
  }
  isRunning = !isRunning;
}

btnToggle.addEventListener('click', toggleTimer);
btnReset.addEventListener('click', () => {
  if (isRunning) toggleTimer();
  timeLeft = modes[currentMode].min * 60;
  updateDisplay();
});

// Settings Modal
const settingsModal = document.getElementById('settings-modal');
const btnSettings = document.getElementById('btn-settings');
const btnCloseSettings = document.getElementById('btn-close-settings');
const btnSaveSettings = document.getElementById('btn-save-settings');

btnSettings.addEventListener('click', () => {
  settingsModal.classList.remove('hidden');
});
btnCloseSettings.addEventListener('click', () => {
  settingsModal.classList.add('hidden');
});

btnSaveSettings.addEventListener('click', () => {
  // Update mode min values
  const pM = parseInt(document.getElementById('input-pomodoro').value);
  const sM = parseInt(document.getElementById('input-short').value);
  const lM = parseInt(document.getElementById('input-long').value);
  
  if(pM > 0) modes.pomodoro.min = pM;
  if(sM > 0) modes.short.min = sM;
  if(lM > 0) modes.long.min = lM;

  const bgChoice = document.getElementById('select-bg').value;
  document.body.className = `bg-${bgChoice}`;

  switchMode(currentMode); // Reset app with new settings
  settingsModal.classList.add('hidden');
});

// Alarm Sound using Web Audio API
function playAlarm() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  
  function playNote(freq, startTime, duration) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, startTime);
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }
  
  const now = audioCtx.currentTime;
  // A soft, soothing chime sequence
  playNote(440.00, now, 1.5);        // A4
  playNote(554.37, now + 0.2, 1.5);  // C#5
  playNote(659.25, now + 0.4, 2.5);  // E5
}

// Init
updateDisplay();

// --- Todo List Logic ---
const todoInput = document.getElementById('todo-input');
const btnAddTodo = document.getElementById('btn-add-todo');
const todoList = document.getElementById('todo-list');

let todos = JSON.parse(localStorage.getItem('pomodoro-todos')) || [];

function saveTodos() {
  localStorage.setItem('pomodoro-todos', JSON.stringify(todos));
}

let draggedItemIndex = null;

function renderTodos() {
  todoList.innerHTML = '';
  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    
    // Drag integration
    li.draggable = true;
    li.dataset.index = index;

    li.addEventListener('dragstart', (e) => {
      draggedItemIndex = index;
      setTimeout(() => li.classList.add('dragging'), 0);
    });

    li.addEventListener('dragend', () => {
      li.classList.remove('dragging');
      draggedItemIndex = null;
    });

    li.addEventListener('dragover', (e) => {
      e.preventDefault(); // allow drop
    });

    li.addEventListener('drop', (e) => {
      e.preventDefault();
      const dropIndex = index;
      if (draggedItemIndex !== null && draggedItemIndex !== dropIndex) {
        const draggedItem = todos[draggedItemIndex];
        todos.splice(draggedItemIndex, 1);
        todos.splice(dropIndex, 0, draggedItem);
        saveTodos();
        renderTodos();
      }
    });

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => {
      todos[index].completed = checkbox.checked;
      saveTodos();
      renderTodos();
    });

    // Text
    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = todo.text;

    // Delete Button
    const delBtn = document.createElement('button');
    delBtn.className = 'todo-delete';
    delBtn.innerHTML = '<i class="fas fa-trash"></i>';
    delBtn.addEventListener('click', () => {
      todos.splice(index, 1);
      saveTodos();
      renderTodos();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);
    todoList.appendChild(li);
  });
}

function addTodo() {
  const text = todoInput.value.trim();
  if (text) {
    todos.push({ text, completed: false });
    todoInput.value = '';
    saveTodos();
    renderTodos();
  }
}

btnAddTodo.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addTodo();
  }
});

// Render initial todos
renderTodos();
