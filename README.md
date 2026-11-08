# Studio Krivo — studiokrivo.com

Static website (HTML, CSS, JavaScript, images — no build step), hosted on GitHub Pages.
Every push to `main` is live at https://studiokrivo.com within a minute or two.

- `index.html` — page structure and section text
- `css/style.css` — all styling (day/night colours are the variables at the top)
- `js/data.js` — gallery pieces: names, text, which photos hang on the wall (`wall`) and show in the detail view
- `js/main.js` — interactions (header, gallery wall, filters, detail view, typing, cursor)
- `images/` full-size images, `thumbs/` smaller copies used on the gallery wall

When you replace an image under the same file name, bump `IMG_V` near the top of `js/main.js`
(and the `?v=` numbers in `index.html` for CSS/JS changes) so browsers load the new version.

Preview locally: `python3 -m http.server 5173` in this folder, then open http://localhost:5173
