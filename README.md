# Alice Zhao — Portfolio

A recreation of [alicezhao.work](https://alicezhao.work/) — the personal
portfolio of Alice Zhao, product designer and UX lead at AWS.

Static site, no build step. Open `index.html` in a browser, or serve the
folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Structure

- `index.html` — page markup (hero, selected work, about, contact)
- `styles.css` — all styling, responsive + dark-motion-safe
- `script.js` — scroll reveal, sticky header state, footer year

## Notes

Portrait and project images are Unsplash placeholders. Content
(bio, projects, metrics) is based on Alice Zhao's public work.
