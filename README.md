# Legendary Winner

A lightweight static website scaffold ready for customization.

## Project structure

```
├── assets/
├── index.html
├── package.json
├── scripts/
│   └── main.js
└── styles/
    └── main.css
```

- **index.html** – Main HTML document featuring a hero section, feature list, and contact form.
- **styles/main.css** – Global stylesheet with responsive layout and accessible color palette.
- **scripts/main.js** – Small JavaScript helper that updates the footer year and adds a form handler.
- **assets/** – Place any static assets (images, fonts, icons) you add to the site.

## Getting started

1. Install dependencies (none required for the base scaffold).
2. Launch a local development server:

   ```bash
   npm run dev
   ```

   This uses [`http-server`](https://www.npmjs.com/package/http-server) via `npx` to host the site at `http://localhost:4173`.

3. Open `index.html` in your browser to preview and iterate.

Feel free to adapt this structure to match your preferred tooling or front-end framework.
