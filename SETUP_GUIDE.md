# Setup Guide

Follow these steps to set up the Voice Notes App on your local machine.

## Prerequisites

- **Modern Web Browser**: Latest version of Chrome, Edge, or Safari for full compatibility.
- **Microphone Access**: Ensure a microphone is available and functional.

## Downloading the Project

1. Download the zip from the repository or clone it using the following command:
   ```bash
   git clone https://your-repo-url.git
   ```

2. Navigate to the project directory:
   ```bash
   cd voice-notes-app
   ```

## Running the Application

1. **Open `index.html`:**
   - Double-click the `index.html` file in the project directory to open it in your browser.
   - Alternatively, serve the directory using a local static server (like [http-server](https://www.npmjs.com/package/http-server)):
   ```bash
   npx http-server
   ```

2. **Allow Microphone Access:**
   - Your browser will prompt you; click "Allow" to enable recording.

## Usage

1. **Start Recording:**
   - Click the "Start Recording" button to begin capturing audio.

2. **Transcription and Saving:**
   - Choose a category for your note, then click "Save Note" to store it.

3. **Manage Notes:**
   - Use the search, category filter, and options to delete or export notes.

## Troubleshooting

- If the app doesn't seem to capture audio, make sure you have allowed microphone access and that your microphone is properly connected.
- For browser support issues, see [API_REFERENCE.md](API_REFERENCE.md) for detailed browser compatibility.

## Reporting Issues

If you encounter problems or have questions, please consult the [TROUBLESHOOTING.md](TROUBLESHOOTING.md) or open a new issue in our GitHub repository.
