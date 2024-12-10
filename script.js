let timerInterval;
let totalSeconds = 0;
let isRunning = false;

// Load session from localStorage
document.addEventListener('DOMContentLoaded', function () {
  const currentSession = localStorage.getItem('currentSession');

  if (!currentSession) {
    alert('No session selected!');
    window.location.href = 'index.html'; // Redirect back to the session creation page
  }

  // Load previous time for the current session
  loadStopwatchTime(currentSession);

  // Start or stop the stopwatch based on the button click
  document.getElementById('startStopBtn').addEventListener('click', function () {
    if (isRunning) {
      stopStopwatch();
    } else {
      startStopwatch();
    }
  });

  // Log the hours when the button is pressed
  document.getElementById('logHoursBtn').addEventListener('click', logHours);
});

// Load the time for the current session
function loadStopwatchTime(sessionName) {
  if (localStorage.getItem(`${sessionName}-time`)) {
    totalSeconds = parseInt(localStorage.getItem(`${sessionName}-time`), 10);
    updateTimeDisplay();
  }
}

// Update the time display
function updateTimeDisplay() {
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  document.getElementById('time').textContent = `${hours}:${minutes}:${seconds}`;
}

// Start the stopwatch
function startStopwatch() {
  timerInterval = setInterval(function () {
    totalSeconds++;
    updateTimeDisplay();
    localStorage.setItem(`${localStorage.getItem('currentSession')}-time`, totalSeconds);
  }, 1000);
  isRunning = true;
  document.getElementById('startStopBtn').textContent = 'Stop';
  document.getElementById('logHoursBtn').disabled = false;
}

// Stop the stopwatch
function stopStopwatch() {
  clearInterval(timerInterval);
  isRunning = false;
  document.getElementById('startStopBtn').textContent = 'Start';
}

// Log the hours
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

  let sessionLogs = JSON.parse(localStorage.getItem(`${localStorage.getItem('currentSession')}-logs`)) || [];
  sessionLogs.push(log);
  localStorage.setItem(`${localStorage.getItem('currentSession')}-logs`, JSON.stringify(sessionLogs));

  updateLogTable(sessionLogs);
  updateTotals(sessionLogs);

  resetStopwatch();
}

// Update the log table
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

// Format duration in hours, minutes, seconds
function formatDuration(seconds) {
  const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const remainingSeconds = String(seconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${remainingSeconds}`;
}

// Update the totals for Build and Business
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

// Reset the stopwatch
function resetStopwatch() {
  totalSeconds = 0;
  updateTimeDisplay();
  localStorage.setItem(`${localStorage.getItem('currentSession')}-time`, totalSeconds);
  document.getElementById('startStopBtn').textContent = 'Start';
  document.getElementById('logHoursBtn').disabled = true;
  document.querySelector('input[name="category"]:checked')?.checked = false;
}

