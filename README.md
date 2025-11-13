# Legendary Winner Chat

A minimal web-based chat client for experimenting with [Google AI Studio](https://aistudio.google.com/) models. The interface keeps the conversation history in the browser and lets you render Gemini responses with Markdown.

## Getting started

1. Install dependencies (only needed if you want to use the optional local dev server):

   ```bash
   npm install
   ```

2. Start a local static server:

   ```bash
   npm run dev
   ```

3. Open the site in your browser. You will be prompted to supply a Google AI Studio API key before you can start chatting.

## Usage

1. In Google AI Studio, create an API key with access to the Gemini model you want to use.
2. Paste the key into the **API key** form at the top of the page.
3. Type a prompt in the message box and send it. The conversation history is persisted in-memory for the current session so each request includes the full context.
4. Responses are rendered as Markdown. Links open in a new tab.

> **Security note**: Keys are only stored in memory in your browser session. Refreshing the page clears the key and the conversation history.

## Project structure

- `index.html` – Base markup, forms, and chat layout.
- `styles/main.css` – Styling for the chat client.
- `scripts/main.js` – Client-side logic for handling API key management, message flow, and Gemini API requests.
- `package.json` – Development server script shortcut.

## License

MIT
