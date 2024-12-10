let startTime, endTime, timerInterval;
let isRunning = false;
let totalSeconds = 0;
let logs = [];
let totalBuild = 0, totalBusiness = 0;
let sessions = JSON.parse(localStorage.getItem('sessions')) || {};

document.getElementById('startStopBtn').addEventListener('click', () => {
  if (isRunning) {
    stopStopwatch();
  } else {
    startStopwatch();
  }
});

document.getElementById('logHoursBtn').addEventListener('click', logHours);

function startStopwatch() {
  startTime = new Date();
  isRunning = true;
  document.getElementById('startStopBtn').textContent = 'Stop';
  document.getElementById('logHoursBtn').disabled = false; // Enable log button
  timerInterval = setInterval(updateTime, 1000);
}

function stopStopwatch() {
  clearInterval(timerInterval);
  isRunning = false;
  document.getElementById('startStopBtn').textContent = 'Start';
  document.getElementById('logHoursBtn').disabled = false; // Enable log button
  document.getElementById('build').disabled = false;
  document.getElementById('business').disabled = false;
}

function updateTime() {
  totalSeconds++;
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  document.getElementById('time').textContent = `${hours}:${minutes}:${seconds}`;
}

function logHours() {
  const category = document.querySelector('input[name="category"]:checked');
  if (!category) {
    alert('Please select either Build or Business category.');
    return;
  }

  const currentSession = getCurrentSession();
  const log = {
    startTime: startTime,
    endTime: new Date(),
    duration: totalSeconds,
    category: category.id === 'build' ? 'Build' : 'Business'
  };

  logs.push(log);
  currentSession.logs.push(log);

  // Update totals
  if (category.id === 'build') {
    totalBuild += totalSeconds;
  } else {
    totalBusiness += totalSeconds;
  }

  saveSession(currentSession);
  updateLogTable();
  updateTotals();

  // Reset stopwatch
  totalSeconds = 0;
  clearInterval(timerInterval);
  isRunning = false;
  document.getElementById('startStopBtn').textContent = 'Start';
  document.getElementById('logHoursBtn').disabled = true;
  document.getElementById('build').disabled = true;
  document.getElementById('business').disabled = true;
}

function updateLogTable() {
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

function updateTotals() {
  document.getElementById('totalBuild').textContent = totalBuild / 3600;
  document.getElementById('totalBusiness').textContent = totalBusiness / 3600;
  document.getElementById('totalTotal').textContent = (totalBuild + totalBusiness) / 3600;
}

function getCurrentSession() {
  const sessionName = document.getElementById('sessionSelect').value;
  return sessions[sessionName] || { logs: [], name: sessionName || 'default' };
}

function saveSession(session) {
  sessions[session.name] = session;
  localStorage.setItem('sessions', JSON.stringify(sessions));
  updateSessionDropdown();
}

function updateSessionDropdown() {
  const sessionSelect = document.getElementById('sessionSelect');
  sessionSelect.innerHTML = '<option value="">-- Select Session --</option>';
  Object.keys(sessions).forEach(sessionName => {
    const option = document.createElement('option');
    option.value = sessionName;
    option.textContent = sessionName;
    sessionSelect.appendChild(option);
  });
}

document.getElementById('newSessionBtn').addEventListener('click', createNewSession);
document.getElementById('deleteSessionBtn').addEventListener('click', deleteSession);

function createNewSession() {
  const sessionName = prompt("Enter session name:");
  if (!sessionName) return;

  sessions[sessionName] = { logs: [], name: sessionName };
  saveSession(sessions[sessionName]);
  updateSessionDropdown();
}

function deleteSession() {
  const sessionName = document.getElementById('sessionSelect').value;
  if (!sessionName || confirm("Are you sure you want to delete this session?")) return;

  delete sessions[sessionName];
  saveSession();
  updateSessionDropdown();
}

document.getElementById('sessionSelect').addEventListener('change', () => {
  const sessionName = document.getElementById('sessionSelect').value;
  if (sessionName) {
    document.getElementById('deleteSessionBtn').style.display = 'inline-block';
  } else {
    document.getElementById('deleteSessionBtn').style.display = 'none';
  }
});

updateSessionDropdown();
