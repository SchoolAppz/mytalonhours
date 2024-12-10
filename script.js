let timerInterval;
let totalSeconds = 0; // Total time in seconds
let isRunning = false; // Indicates whether the stopwatch is running

// On page load, initialize the session and handle session dropdown
document.addEventListener('DOMContentLoaded', function () {
  // Make sure that the "2024 season" is always available in the session select dropdown
  updateSessionDropdown();

  // Set "2024 season" as the default session in localStorage if no session is selected
  if (!localStorage.getItem('currentSession')) {
    localStorage.setItem('currentSession', '2024 season');
  }

  // If the "2024 season" session is selected, load its time and update the UI
  loadStopwatchTime('2024 season');

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

// Update the session dropdown with the available session (only "2024 season")
function updateSessionDropdown() {
  const sessionSelect = document.getElementById('sessionSelect');
  sessionSelect.innerHTML = '<option value="">-- Select Session --</option>';

  // Hardcode the session as "2024 season"
  const option = document.createElement('option');
  option.value = '2024 season';
  option.textContent = '2024 season';
  sessionSelect.appendChild(option);
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
    localStorage.setItem('2024 season-time', totalSeconds); // Save time for the "2024 season"
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

  let sessionLogs = JSON.parse(localStorage.getItem('2024 season-logs')) || [];
  sessionLogs.push(log);
  localStorage.setItem('2024 season-logs', JSON.stringify(sessionLogs));

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
  localStorage.setItem('2024 season-time', totalSeconds); // Reset time for the session
  document.getElementById('startStopBtn').textContent = 'Start';
  document.getElementById('logHoursBtn').disabled = true;
  document.querySelector('input[name="category"]:checked')?.checked = false;
}


