# API Reference

This document provides detailed information about the APIs used in the Voice Notes App.

## Web Speech API

### `webkitSpeechRecognition`
- **Purpose**: Capture voice input and convert it to text.
- **Settings**:
  - `continuous`: Boolean, enables continuous listening without stopping after each phrase.
  - `interimResults`: Boolean, allows access to interim results while speaking.
  - `lang`: String, sets the language (default: `'en-US'`).

### Example Usage
```javascript
const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-US';
```

### Events
- `onresult`: Triggered with the speech recognition results.
- `onerror`: Occurs in case of recognition errors such as no-speech, audio-capture failure, etc.
- `onstart`: Fired when speech recognition starts.
- `onend`: Fired when speech recognition stops.

### Error Handling
- Handles errors such as `no-speech`, `audio-capture`, `not-allowed`, and `network`.

## IndexedDB API

### `VoiceNotesApp` Database
- **Purpose**: Store and manage voice notes.
- **Object Stores**:
  - `notes`: Primary store with key path `id`.

### Example Usage
```javascript
const request = indexedDB.open('VoiceNotesApp', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
};
```

### Transactions
- Uses `readwrite` transactions to add, read, or delete notes.
- Completes transactions asynchronously with callbacks for success and error handling.

### Example Note Schema
```json
{
  "id": 1,
  "content": "Sample Note Content",
  "category": "general",
  "timestamp": "2025-07-31 21:50:00"
}
```

## SpeechSynthesis API

### `speechSynthesis`
- **Purpose**: Convert text to speech.
- **Elements**:
  - `SpeechSynthesisUtterance`: The text content to be spoken.

### Example Usage
```javascript
const utterance = new SpeechSynthesisUtterance(text);
speechSynthesis.speak(utterance);
```

## Notes
- These APIs are fully client-side and require compatible browsers for full functionality.

