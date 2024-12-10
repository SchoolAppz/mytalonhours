let timerInterval;
let totalSeconds = 0; // Total time in seconds
let isRunning = false; // Indicates whether the stopwatch is running

// On page load, initialize the session and handle session dropdown
document.addEventListener('DOMContentLoaded', function () {
  let currentSession = localStorage.getItem('currentSession');
  if (!currentSession) {
    currentSession = 'default'; // Default session if no session is selected
  }

  // Update the session dropdown with available sessions
  updateSessionDropdown();

  // If there's a valid session selected, load its time and update the UI
  if (currentSession !== 'default') {
    document.getElementById('sessionSelect').value = currentSession;
    loadStopwatchTime(currentSession);
  }

  // Handle create new session button
  document.getElementById('createSessionBtn').addEventListener('click', function () {
    const sessionName = document.getElementById('newSessionName').value.trim();
    if (sessionName) {
      createNewSession(sessionName);
    } else {
      alert('Please enter a valid session name.');
    }
  });

  // Handle select session button
  document.getElementById('selectSessionBtn').addEventListener('click', function () {
    const sessionName = document.getElementById('sessionSelect').value;
    if (sessionName) {
      // Save the selected session to localStorage
      localStorage.setItem('currentSession', sessionName);
      window.location.href = 'stopwatch.html'; // Redirect to the stopwatch page
    } else {
      alert('Please select a session.');
    }
  });
});

// Update the session dropdown with available sessions
function updateSessionDropdown() {
  const sessionSelect = document.getElementById('sessionSelect');
  sessionSelect.innerHTML = '<option value="">-- Select Session --</option>';

  // Get saved sessions from localStorage or initialize them as an empty array
  const savedSessions = JSON.parse(localStorage.getItem('sessions')) || [];

  // Add each saved session to the dropdown
  savedSessions.forEach(session => {
    const option = document.createElement('option');
    option.value = session;
    option.textContent = session;
    sessionSelect.appendChild(option);
  });
}

// Create a new session and add it to the session list
function createNewSession(sessionName) {
  const savedSessions = JSON.parse(localStorage.getItem('sessions')) || [];

  // Check if the session already exists
  if (savedSessions.includes(sessionName)) {
    alert('Session already exists!');
    return;
  }

  // Add the new session to the list of saved sessions
  savedSessions.push(sessionName);
  localStorage.setItem('sessions', JSON.stringify(savedSessions));

  // Set the new session as the current session
  localStorage.setItem('currentSession', sessionName);

  // Update the session dropdown and select the new session
  updateSessionDropdown();
  document.getElementById('sessionSelect').value = sessionName;

  // Redirect to the stopwatch page for the new session
  window.location.href = 'stopwatch.html';
}

// Load the stopwatch time for the selected session
function loadStopwatchTime(sessionName) {
  if (localStorage.getItem(`${sessionName}-time`)) {
    totalSeconds = parseInt(localStorage.getItem(`${sessionName}-time`), 10);
    updateTimeDisplay();
  }
}

// Update the time display on the stopwatch page
function updateTimeDisplay() {
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  document.getElementById('time').textContent = `${hours}:${minutes}:${seconds}`;
}

// Stopwatch functions
let isRunning = false;
let timerInterval;
let totalSeconds = 0;

document.getElementById('startStopBtn').addEventListener('click', function () {
  if (isRunning) {
    stopStopwatch();
  } else {
    startStopwatch();
  }
});

document.getElementById('logHoursBtn').addEventListener('click', logHours);

function startStopwatch() {
  timerInterval = setInterval(function () {
    totalSeconds++;
    updateTimeDisplay();
    localStorage.setItem(`${currentSession}-time`, totalSeconds);
  }, 1000);
  isRunning = true;
  document.getElementById('startStopBtn').textContent = 'Stop';
  document.getElementById('logHoursBtn').disabled = false;
}

function stopStopwatch() {
  clearInterval(timerInterval);
  isRunning = false;
  document.getElementById('startStopBtn').textContent = 'Start';
}

function logHours() {
  const category = document.querySelector('input[name="category"]:checked');
  if (!category) {
    alert('Please select either Build or Business category.');
    return;
  }

  const log = {
    startTime: new Date(),
    endTime: new Date(),
    duration: totalSeconds,
    category: category.id === 'build' ? 'Build' : 'Business'
  };

  let sessionLogs = JSON.parse(localStorage.getItem(`${currentSession}-logs`)) || [];
  sessionLogs.push(log);
  localStorage.setItem(`${currentSession}-logs`, JSON.stringify(sessionLogs));

  updateLogTable(sessionLogs);
  updateTotals(sessionLogs);

  resetStopwatch();
}

function updateLogTable(logs) {
  const tbody = document.getElementById('logTable').querySelector('tbody');
  tbody.innerHTML = '';
  logs.forEach(log => {
    const row = document.createElement('tr');
    const start = new Date(log.startTime).toLocaleString();
    const end = new Date(log.endTime).toLocaleString();
    const duration = formatDuration(log.duration);
    const category = log.category;
    row.innerHTML = `<td>${start}</td><td>${end}</td><td>${duration}</td><td>${category}</td>`;
    tbody.appendChild(row);
  });
}

function formatDuration(seconds) {
  const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const remainingSeconds = String(seconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${remainingSeconds}`;
}

function updateTotals(logs) {
  let totalBuild = 0;
  let totalBusiness = 0;

  logs.forEach(log => {
    if (log.category === 'Build') {
      totalBuild += log.duration;
    } else {
      totalBusiness += log.duration;
    }
  });

  const totalHours = totalBuild + totalBusiness;
  document.getElementById('totalBuild').textContent = formatDuration(totalBuild);
  document.getElementById('totalBusiness').textContent = formatDuration(totalBusiness);
  document.getElementById('totalTotal').textContent = formatDuration(totalHours);
}

function resetStopwatch() {
  totalSeconds = 0;
  updateTimeDisplay();
  localStorage.setItem(`${currentSession}-time`, totalSeconds);
  document.getElementById('startStopBtn').textContent = 'Start';
  document.getElementById('logHoursBtn').disabled = true;
  document.querySelector('input[name="category"]:checked')?.checked = false;
}

