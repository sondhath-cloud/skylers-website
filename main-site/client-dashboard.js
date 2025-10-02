// Client Dashboard Functionality
document.addEventListener('DOMContentLoaded', function() {
    const clientSession = JSON.parse(localStorage.getItem('clientSession') || '{}');
    const logoutBtn = document.getElementById('logout-btn');
    const videoModal = document.getElementById('video-modal');
    const closeVideoModal = document.getElementById('close-video-modal');
    const modalVideo = document.getElementById('modal-video');

    // Check if user is logged in
    if (!clientSession.clientId) {
        window.location.href = 'client-login.html';
        return;
    }

    // Update dashboard with client info
    updateClientInfo();
    loadProgressVideos();
    loadTrainingNotes();
    loadUpcomingSessions();

    // Handle logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('clientSession');
            window.location.href = 'client-login.html';
        });
    }

    // Handle video modal
    if (closeVideoModal) {
        closeVideoModal.addEventListener('click', function() {
            videoModal.classList.add('hidden');
            modalVideo.pause();
        });
    }

    // Close modal when clicking outside
    if (videoModal) {
        videoModal.addEventListener('click', function(e) {
            if (e.target === videoModal) {
                videoModal.classList.add('hidden');
                modalVideo.pause();
            }
        });
    }

    async function updateClientInfo() {
        try {
            const response = await fetch(`api/client-info.php?clientId=${clientSession.clientId}`);
            const result = await response.json();
            
            if (result.success) {
                document.getElementById('client-name').textContent = result.name;
                document.getElementById('dog-name').textContent = result.dogName;
                document.getElementById('dog-breed').textContent = result.dogBreed || 'Not specified';
                document.getElementById('dog-age').textContent = result.dogAge || 'Not specified';
                document.getElementById('training-goals').textContent = result.trainingGoals || 'Not specified';
            }
        } catch (error) {
            console.error('Error loading client info:', error);
        }
    }

    async function loadProgressVideos() {
        try {
            const response = await fetch(`api/client-videos.php?clientId=${clientSession.clientId}`);
            const result = await response.json();
            
            const videoGrid = document.getElementById('video-grid');
            
            if (result.success && result.videos.length > 0) {
                videoGrid.innerHTML = '';
                
                result.videos.forEach(video => {
                    const videoCard = createVideoCard(video);
                    videoGrid.appendChild(videoCard);
                });
            } else {
                videoGrid.innerHTML = '<div class="video-placeholder"><p>No videos uploaded yet. Videos will appear here after your training sessions.</p></div>';
            }
        } catch (error) {
            console.error('Error loading videos:', error);
        }
    }

    function createVideoCard(video) {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.innerHTML = `
            <div class="video-thumbnail">
                <video preload="metadata" muted>
                    <source src="${video.filePath}" type="video/mp4">
                </video>
                <div class="play-button">▶</div>
            </div>
            <div class="video-info">
                <h4>${video.title}</h4>
                <p>${video.description}</p>
                <span class="video-date">${new Date(video.uploadDate).toLocaleDateString()}</span>
            </div>
        `;
        
        card.addEventListener('click', function() {
            openVideoModal(video);
        });
        
        return card;
    }

    function openVideoModal(video) {
        modalVideo.src = video.filePath;
        document.getElementById('video-title').textContent = video.title;
        document.getElementById('video-description').textContent = video.description;
        document.getElementById('video-date').textContent = `Uploaded: ${new Date(video.uploadDate).toLocaleDateString()}`;
        videoModal.classList.remove('hidden');
    }

    async function loadTrainingNotes() {
        try {
            const response = await fetch(`api/client-notes.php?clientId=${clientSession.clientId}`);
            const result = await response.json();
            
            const notesContainer = document.getElementById('notes-container');
            
            if (result.success && result.notes.length > 0) {
                notesContainer.innerHTML = '';
                
                result.notes.forEach(note => {
                    const noteElement = document.createElement('div');
                    noteElement.className = 'training-note';
                    noteElement.innerHTML = `
                        <h4>${note.title}</h4>
                        <p>${note.content}</p>
                        <span class="note-date">${new Date(note.date).toLocaleDateString()}</span>
                    `;
                    notesContainer.appendChild(noteElement);
                });
            } else {
                notesContainer.innerHTML = '<div class="note-placeholder"><p>Training notes will appear here after your sessions.</p></div>';
            }
        } catch (error) {
            console.error('Error loading notes:', error);
        }
    }

    async function loadUpcomingSessions() {
        try {
            const response = await fetch(`api/client-sessions.php?clientId=${clientSession.clientId}`);
            const result = await response.json();
            
            const sessionsContainer = document.getElementById('sessions-container');
            
            if (result.success && result.sessions.length > 0) {
                sessionsContainer.innerHTML = '';
                
                result.sessions.forEach(session => {
                    const sessionElement = document.createElement('div');
                    sessionElement.className = 'session-item';
                    sessionElement.innerHTML = `
                        <h4>${session.type} Session</h4>
                        <p><strong>Date:</strong> ${new Date(session.date).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> ${session.time}</p>
                        <p><strong>Location:</strong> ${session.location}</p>
                    `;
                    sessionsContainer.appendChild(sessionElement);
                });
            } else {
                sessionsContainer.innerHTML = '<div class="session-placeholder"><p>No upcoming sessions scheduled.</p></div>';
            }
        } catch (error) {
            console.error('Error loading sessions:', error);
        }
    }
});
