# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a client-side Voice Notes App built with vanilla JavaScript, HTML, and CSS. It's a single-page application that uses browser APIs for speech recognition and synthesis, with IndexedDB for local data persistence.

## Architecture

### Core Components
- **app.js**: Main application logic containing all functionality
- **index.html**: Single HTML file with complete UI structure
- **styles.css**: Comprehensive styling with responsive design

### Key Technologies
- **Web Speech API**: For speech recognition (`webkitSpeechRecognition`)
- **Speech Synthesis API**: For text-to-speech functionality
- **IndexedDB**: For local note storage (`VoiceNotesApp` database)
- **Vanilla JavaScript**: No frameworks or build tools

### Data Architecture
- **Database**: IndexedDB with `notes` object store
- **Note Schema**: `{id, content, category, timestamp}`
- **Categories**: general, todo, grocery, academic

## Development Commands

This is a client-side only application with no build process. To run:

1. **Local Development**: Open `index.html` directly in a web browser or serve via local server
2. **Testing**: Manual testing in browser (no automated tests)
3. **Deployment**: Static file hosting (no build step required)

## Browser Requirements

- **Speech Recognition**: Chrome, Edge, or Safari (requires `webkitSpeechRecognition`)
- **IndexedDB**: All modern browsers
- **Microphone Access**: HTTPS required for production

## Key Features

### Voice Recording
- Real-time speech recognition with interim and final results
- Microphone permission handling
- Recording state management with visual indicators

### Note Management
- CRUD operations via IndexedDB
- Category-based organization and filtering
- Search functionality across note content
- Export notes as JSON

### Text-to-Speech
- Read individual notes aloud
- Read current transcription
- Browser speech synthesis API

## Important Implementation Details

### Speech Recognition Flow
1. Request microphone permission via `getUserMedia`
2. Initialize `webkitSpeechRecognition` with continuous mode
3. Handle interim and final results separately
4. Manage recording state across UI components

### Database Operations
- All operations are asynchronous using IndexedDB transactions
- Error handling for database operations
- Automatic UI updates after data changes

### State Management
- Global variables for recording state and note filtering
- No external state management library
- DOM manipulation for UI updates

## Security Considerations

- Client-side only application with no server communication
- Local data storage only (IndexedDB)
- Microphone permission required for core functionality
- No sensitive data handling beyond user's personal notes