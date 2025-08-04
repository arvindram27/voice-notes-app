let db;
let recognition;
let isRecording = false;
let finalTranscript = '';
let interimTranscript = '';

// Initialize IndexedDB
function initDatabase() {
    const request = indexedDB.open('VoiceNotesApp', 1);

    request.onupgradeneeded = function(event) {
        db = event.target.result;
        db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
    };

    request.onsuccess = function(event) {
        db = event.target.result;
        console.log('Database initialized');
        loadNotes();
    };

    request.onerror = function(event) {
        console.error('Database error:', event.target.errorCode);
    };
}

// Save a note in the database
function saveNoteToDB(noteContent, category) {
    const transaction = db.transaction(['notes'], 'readwrite');
    const store = transaction.objectStore('notes');
    const note = {
        content: noteContent,
        category: category,
        timestamp: new Date().toLocaleString()
    };
    store.add(note);

    transaction.oncomplete = function() {
        console.log('Note saved');
        loadNotes();
    };

    transaction.onerror = function(event) {
        console.error('Save error:', event.target.errorCode);
    };
}


// HTML sanitization function
function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Display notes
function displayNotes(notes) {
    const notesContainer = document.getElementById('notesContainer');
    notesContainer.innerHTML = '';

    notes.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';
        
        // Create elements safely without innerHTML
        const noteHeader = document.createElement('div');
        noteHeader.className = 'note-header';
        
        const categorySpan = document.createElement('span');
        categorySpan.className = `note-category ${note.category}`;
        categorySpan.textContent = note.category;
        
        const noteActions = document.createElement('div');
        noteActions.className = 'note-actions';
        
        const speakBtn = document.createElement('button');
        speakBtn.className = 'speak-btn';
        speakBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        speakBtn.addEventListener('click', () => speakNote(note.content));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => deleteNote(note.id));
        
        noteActions.appendChild(speakBtn);
        noteActions.appendChild(deleteBtn);
        noteHeader.appendChild(categorySpan);
        noteHeader.appendChild(noteActions);
        
        const noteContent = document.createElement('div');
        noteContent.className = 'note-content';
        noteContent.textContent = note.content; // Safe text insertion
        
        const noteTimestamp = document.createElement('div');
        noteTimestamp.className = 'note-timestamp';
        noteTimestamp.textContent = note.timestamp;
        
        noteCard.appendChild(noteHeader);
        noteCard.appendChild(noteContent);
        noteCard.appendChild(noteTimestamp);
        notesContainer.appendChild(noteCard);
    });

    if (notes.length === 0) {
        notesContainer.innerHTML = '<div class="empty-state"><i class="fas fa-sticky-note"></i><p>No notes available</p></div>';
    }
}


// Initialize Speech Recognition
function initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        // Configure recognition settings
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        // Handle recognition results
        recognition.onresult = function(event) {
            let currentInterim = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    currentInterim += transcript;
                }
            }
            
            interimTranscript = currentInterim;
            updateTranscriptionDisplay();
        };
        
        // Handle recognition start
        recognition.onstart = function() {
            console.log('Speech recognition started');
            isRecording = true;
            showNotification('Listening...', 'info');
        };
        
        // Handle recognition end
        recognition.onend = function() {
            console.log('Speech recognition ended');
            isRecording = false;
            toggleRecordingIndicator(false);
            toggleControls('stop');
            
            if (finalTranscript.trim()) {
                document.getElementById('saveBtn').disabled = false;
                showNotification('Recording complete!', 'success');
            }
        };
        
        // Handle recognition errors
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            isRecording = false;
            toggleRecordingIndicator(false);
            toggleControls('stop');
            
            let errorMessage = 'Speech recognition error: ';
            switch(event.error) {
                case 'no-speech':
                    errorMessage += 'No speech detected. Please try again.';
                    break;
                case 'audio-capture':
                    errorMessage += 'No microphone found. Please check your microphone.';
                    break;
                case 'not-allowed':
                    errorMessage += 'Microphone access denied. Please allow microphone access.';
                    break;
                case 'network':
                    errorMessage += 'Network error. Please check your internet connection.';
                    break;
                default:
                    errorMessage += event.error;
            }
            showNotification(errorMessage, 'error');
        };
        
        return true;
    } else {
        showNotification('Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari.', 'error');
        return false;
    }
}

// Input validation function
function validateAndSanitizeInput(input) {
    if (typeof input !== 'string') return '';
    
    // Remove potentially dangerous characters
    const sanitized = input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
        .replace(/javascript:/gi, '') // Remove javascript: protocols
        .replace(/on\w+\s*=/gi, '') // Remove event handlers
        .trim();
    
    // Limit length to prevent DoS
    return sanitized.length > 5000 ? sanitized.substring(0, 5000) + '...' : sanitized;
}

// Update transcription display with interim and final results
function updateTranscriptionDisplay() {
    const transcriptionElement = document.getElementById('transcriptionText');
    const sanitizedFinal = validateAndSanitizeInput(finalTranscript);
    const sanitizedInterim = validateAndSanitizeInput(interimTranscript);
    const displayText = sanitizedFinal + sanitizedInterim;
    
    if (displayText.trim()) {
        // Clear existing content
        transcriptionElement.textContent = displayText;
        
        // Add cursor indicator safely
        const cursorSpan = document.createElement('span');
        cursorSpan.className = 'interim';
        cursorSpan.textContent = '|';
        transcriptionElement.appendChild(cursorSpan);
    } else {
        transcriptionElement.textContent = 'Listening for speech...';
    }
}

// Start voice recording
function startRecording() {
    if (!recognition) {
        if (!initSpeechRecognition()) {
            return;
        }
    }
    
    // Check for microphone permission
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
            // Permission granted, start recognition
            finalTranscript = '';
            interimTranscript = '';
            
            try {
                recognition.start();
                toggleRecordingIndicator(true);
                toggleControls('record');
            } catch (error) {
                console.error('Error starting recognition:', error);
                showNotification('Error starting speech recognition', 'error');
            }
            
            // Stop the microphone stream as we're using speech recognition
            stream.getTracks().forEach(track => track.stop());
        })
        .catch(function(error) {
            console.error('Microphone access denied:', error);
            showNotification('Microphone access is required for voice recording', 'error');
        });
}

// Stop voice recording
function stopRecording() {
    if (recognition && isRecording) {
        recognition.stop();
    }
}

initDatabase();
initSpeechRecognition();

document.getElementById('recordBtn').addEventListener('click', function() {
    startRecording();
});

document.getElementById('stopBtn').addEventListener('click', function() {
    stopRecording();
});

document.getElementById('playBtn').addEventListener('click', function() {
    // Read aloud...
});

document.getElementById('saveBtn').addEventListener('click', function() {
    const transcriptionText = validateAndSanitizeInput(finalTranscript.trim());
    const selectedCategory = document.getElementById('noteCategory').value;
    
    if (transcriptionText && transcriptionText !== 'Start recording to see your speech transcribed here...') {
        saveNoteToDB(transcriptionText, selectedCategory);
        document.getElementById('transcriptionText').textContent = 'Start recording to see your speech transcribed here...';
        this.disabled = true;
        showNotification('Note saved successfully!', 'success');
    } else {
        showNotification('No content to save!', 'error');
    }
});

document.getElementById('clearBtn').addEventListener('click', function() {
    // Clear transcription...
    document.getElementById('transcriptionText').textContent = 'Start recording to see your speech transcribed here...';
});

// Add export button event listener
document.getElementById('exportBtn').addEventListener('click', function() {
    exportNotes();
});

function toggleRecordingIndicator(isRecording) {
    const indicator = document.getElementById('recordingIndicator');
    indicator.classList.toggle('hidden', !isRecording);
}

// Category filtering and search functionality
let allNotes = [];
let currentFilter = 'all';

// Load notes and store them globally for filtering
function loadNotes() {
    const transaction = db.transaction(['notes'], 'readonly');
    const store = transaction.objectStore('notes');
    const request = store.getAll();

    request.onsuccess = function(event) {
        allNotes = event.target.result;
        filterAndDisplayNotes();
    };

    request.onerror = function(event) {
        console.error('Load error:', event.target.errorCode);
    };
}

// Filter and display notes based on category and search
function filterAndDisplayNotes() {
    let filteredNotes = allNotes;
    
    // Filter by category
    if (currentFilter !== 'all') {
        filteredNotes = filteredNotes.filter(note => note.category === currentFilter);
    }
    
    // Filter by search term
    const searchTerm = document.getElementById('searchNotes').value.toLowerCase();
    if (searchTerm) {
        filteredNotes = filteredNotes.filter(note => 
            note.content.toLowerCase().includes(searchTerm)
        );
    }
    
    displayNotes(filteredNotes);
}

// Set up category tab listeners
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Set current filter
            currentFilter = this.getAttribute('data-category');
            filterAndDisplayNotes();
        });
    });
    
    // Set up search listener
    document.getElementById('searchNotes').addEventListener('input', filterAndDisplayNotes);
});

// Text-to-speech functionality
function speakNote(text) {
    if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        window.speechSynthesis.speak(utterance);
        showNotification('Reading note aloud...', 'info');
    } else {
        showNotification('Text-to-speech not supported in this browser', 'error');
    }
}

// Read current transcription aloud
document.getElementById('playBtn').addEventListener('click', function() {
    const transcriptionText = document.getElementById('transcriptionText').innerText;
    if (transcriptionText && transcriptionText !== 'Start recording to see your speech transcribed here...') {
        speakNote(transcriptionText);
    } else {
        showNotification('No text to read aloud!', 'error');
    }
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${
            type === 'success' ? 'fa-check-circle' :
            type === 'error' ? 'fa-exclamation-circle' :
            'fa-info-circle'
        }"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Enhanced note management
function deleteNote(id) {
    if (confirm('Are you sure you want to delete this note?')) {
        const transaction = db.transaction(['notes'], 'readwrite');
        const store = transaction.objectStore('notes');
        store.delete(id);

        transaction.oncomplete = function() {
            console.log('Note deleted');
            loadNotes();
            showNotification('Note deleted successfully!', 'success');
        };

        transaction.onerror = function(event) {
            console.error('Delete error:', event.target.errorCode);
            showNotification('Error deleting note!', 'error');
        };
    }
}

// Export/Import functionality
function exportNotes() {
    const dataStr = JSON.stringify(allNotes, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `voice-notes-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    showNotification('Notes exported successfully!', 'success');
}

function toggleControls(action) {
    const recordBtn = document.getElementById('recordBtn');
    const stopBtn = document.getElementById('stopBtn');
    const playBtn = document.getElementById('playBtn');
    const saveBtn = document.getElementById('saveBtn');
    
    if (action === 'record') {
        recordBtn.disabled = true;
        stopBtn.disabled = false;
        playBtn.disabled = true;
        saveBtn.disabled = true;
    } else if (action === 'stop') {
        recordBtn.disabled = false;
        stopBtn.disabled = true;
        playBtn.disabled = false;
        saveBtn.disabled = false;
    }
}
