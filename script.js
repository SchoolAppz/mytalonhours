let timerInterval;
let totalSeconds = 0; // Total time in seconds
let isRunning = false; // Indicates whether the stopwatch is running

// Get the current session from localStorage (used across different pages)
let currentSession = localStorage.getItem('currentSession');
if (!currentSession) {
  currentSession = 'default'; // Default session if no session is selected
}

// On page load, initialize the stopwatch time if available
document.addEventListener('DOMContentLoaded', function() {
  // Load previously saved time if available
  if (localStorage.getItem(`${currentSession}-time`)) {
    totalSeconds = parseInt(localStorage.getItem(`${currentSession}-time`), 10);
    updateTimeDisplay();
  }

  // If the session is set and valid, update buttons and session info
  if (currentSession !== 'default') {
    document.getElementById('sessionSelect').value = currentSession;
  }

  // Handle the start/stop button
  document.getElementById('startStopBtn').addEventListener('click', function() {
    if (isRunning) {
      stopStopwatch();
    } else {
      startStopwatch();
    }
  });

  // Handle the log hours button
  document.getElementById('logHoursBtn').addEventListener('click', logHours);

  // Handle session change
  document.getElementById('sessionSelect').addEventListener('change', function() {
    currentSession = document.getElementById('sessionSelect').value;
    localStorage.setItem('currentSession', currentSession);
    totalSeconds = 0; // Reset stopwatch for the new session
    updateTimeDisplay();
  });

  updateSessionDropdown();
});

// Start the stopwatch and update the display every second
function startStopwatch() {
  timerInterval = setInterval(function() {
    totalSeconds++;
    updateTimeDisplay();
    localStorage.setItem(`${currentSession}-time`, totalSeconds);
  }, 1000);

  isRunning = true;
  document.getElementById('startStopBtn').textContent = 'Stop';
  document.getElementById('logHoursBtn').disabled = false;
}

// Stop the stopwatch and stop updating the time
function stopStopwatch() {
  clearInterval(timerInterval);
  isRunning = false;
  document.getElementById('startStopBtn').textContent = 'Start';
}

// Update the displayed time in HH:MM:SS format
function updateTimeDisplay() {
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  document.getElementById('time').textContent = `${hours}:${minutes}:${seconds}`;
}

// Log hours to the current session
function logHours() {
  const category = document.querySelector('input[name="category"]:checked');
  if (!category) {
    alert('Please select either Build or Business category.');
    return;
  }

  // Prepare log data
  const log = {
    startTime: new Date(),
    endTime: new Date(),
    duration: totalSeconds,
    category: category.id === 'build' ? 'Build' : 'Business'
  };

  // Get current logs from localStorage or initialize them
  let sessionLogs = JSON.parse(localStorage.getItem(`${currentSession}-logs`)) || [];

  // Add the new log to the session logs
  sessionLogs.push(log);

  // Save logs back to localStorage
  localStorage.setItem(`${currentSession}-logs`, JSON.stringify(sessionLogs));

  // Update log table and reset the stopwatch
  updateLogTable(sessionLogs);
  updateTotals(sessionLogs);
  resetStopwatch();
}

// Update the log table with session logs
function updateLogTable(logs) {
  const tbody = document.getElementById('logTable').querySelector('tbody');
  tbody.innerHTML = ''; // Clear existing table data
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

// Format duration from seconds to HH:MM:SS
function formatDuration(seconds) {
  const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const remainingSeconds = String(seconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${remainingSeconds}`;
}

// Update total hours worked in both Build and Business categories
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

// Reset the stopwatch after logging hours
function resetStopwatch() {
  totalSeconds = 0;
  updateTimeDisplay();
  localStorage.setItem(`${currentSession}-time`, totalSeconds);
  document.getElementById('startStopBtn').textContent = 'Start';
  document.getElementById('logHoursBtn').disabled = true;
  document.querySelector('input[name="category"]:checked')?.checked = false; // Uncheck categories
}

// Update the session dropdown with available sessions
function updateSessionDropdown() {
  const sessionSelect = document.getElementById('sessionSelect');
  sessionSelect.innerHTML = '<option value="">-- Select Session --</option>';
  const savedSessions = JSON.parse(localStorage.getItem('sessions')) || [];

  savedSessions.forEach(session => {
    const option = document.createElement('option');
    option.value = session;
    option.textContent = session;
    sessionSelect.appendChild(option);
  });
}

