// Load session from localStorage when page loads
document.addEventListener('DOMContentLoaded', function() {
    const currentSession = localStorage.getItem('currentSession');
    if (currentSession) {
      document.getElementById('sessionSelect').value = currentSession;
    }
  
    updateSessionDropdown();
  });
  
  // Create or select a session
  document.getElementById('createSessionBtn').addEventListener('click', function() {
    const sessionName = document.getElementById('newSessionName').value.trim();
    if (sessionName) {
      localStorage.setItem('currentSession', sessionName);
      window.location.href = 'stopwatch.html';
    } else {
      alert('Please enter a session name.');
    }
  });
  
  document.getElementById('selectSessionBtn').addEventListener('click', function() {
    const sessionName = document.getElementById('sessionSelect').value;
    if (sessionName) {
      localStorage.setItem('currentSession', sessionName);
      window.location.href = 'stopwatch.html';
    } else {
      alert('Please select a session.');
    }
  });
  
  // Update session dropdown on the settings page
  function updateSessionDropdown() {
    const sessionSelect = document.getElementById('sessionSelect');
    const currentSession = localStorage.getItem('currentSession');
    
    // Simulate the saved sessions (for demonstration purposes)
    const savedSessions = ['Session 1', 'Session 2', 'Session 3'];
  
    savedSessions.forEach(session => {
      const option = document.createElement('option');
      option.value = session;
      option.textContent = session;
      sessionSelect.appendChild(option);
    });
  
    if (currentSession) {
      sessionSelect.value = currentSession;
    }
  }
  
