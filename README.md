# Scanline — QR Code Generator

A free, no-signup QR code generator (link, text, Wi-Fi, contact card, email,
phone, SMS) with PNG/SVG download, color and logo customization, and eight
built-in ad placements for Adsterra. Pure HTML/CSS/JS — no build step, no
server, works as a static site.

## What's in this folder

```
index.html                  Main page
404.html                    Custom not-found page
robots.txt                  Search engine crawl rules
assets/css/style.css        All styling
assets/js/qrcode-lib.js     Vendored QR encoding library (MIT licensed)
assets/js/app.js            Site logic — forms, canvas rendering, downloads
assets/js/ads-config.js     <- put your Adsterra scripts here
assets/img/favicon.svg      Site icon
```

## 1. Deploy to GitHub Pages

1. Create a new GitHub repository (e.g. `scanline`).
2. Upload every file in this folder to the repository root, keeping the
   folder structure exactly as it is (don't flatten `assets/`).
3. In the repo, go to **Settings → Pages**.
4. Under **Source**, choose **Deploy from a branch**, pick the `main`
   branch and `/ (root)` folder, then save.
5. GitHub gives you a live URL within a minute or two, usually
   `https://YOUR-USERNAME.github.io/scanline/`.
6. Optional: add a custom domain under the same Pages settings once you
   own one — GitHub Pages supports it for free (you only pay for the
   domain itself).

## 2. Turn on Adsterra ads

Everything is pre-wired with labeled, empty ad containers. You do not need
to edit `index.html` or `style.css` to add ads — do it all from one file:

**`assets/js/ads-config.js`** — open it, read the comments, and paste your
Adsterra script tags where each comment tells you to. There are detailed
instructions inside that file for:

- 5 banner/native slots (top, mid-content, in-content, bottom, download-gate)
- 1 rail slot beside the live QR preview (highest-visibility spot on the page)
- Social Bar (sitewide floating unit)
- Popunder (fires on click)

Sign up as a publisher at `https://publishers.adsterra.com`, add this
website once it's live on GitHub Pages, create an Ad Unit for each format
you want, and Adsterra will give you the exact script to paste.

### Why downloads are gated behind a short popup

Clicking "Download PNG" or "Download SVG" opens a 3-second confirmation
popup before the file saves — that popup has its own ad slot
(`#ad-download-gate`) and is the single highest-converting placement on
the site, since it appears at the exact moment someone is engaged enough
to want to keep their code. Combined with a Popunder firing on the same
click, one download can produce two ad impressions with no extra setup
from you.

If you'd rather remove the delay (e.g. to test faster), it's controlled by
the `seconds` variable inside `openGate()` in `assets/js/app.js`.

## 3. Customize the content

- Site name and copy live directly in `index.html` — search for "Scanline"
  to rename it everywhere, including the page `<title>` and meta
  description near the top of the file.
- Use-case cards, FAQ, and "how it works" steps are plain HTML in the
  same file — edit, add, or remove `<article>` / `<details>` blocks
  freely; nothing else depends on their exact count.
- Colors, fonts, and spacing are all CSS variables at the top of
  `assets/css/style.css` under `:root` — change `--accent` to re-theme
  the whole site from one line.

## 4. How the generator works (for your own reference)

- QR encoding is done entirely client-side with a vendored copy of
  Kazuhiko Arase's `qrcode-generator` library (MIT license, credit kept
  in the file header) — nothing typed into the form is ever sent
  anywhere.
- Each QR "type" tab builds a differently-formatted string before
  encoding it (e.g. Wi-Fi becomes a `WIFI:T:...;S:...;P:...;;` string,
  Contact becomes a `VCARD` block) — these are the same formats phone
  camera apps already recognize, so no app-specific tricks are needed.
- PNG export reads directly off the `<canvas>`; SVG export rebuilds the
  same grid as vector rectangles, so it stays sharp at any print size.
- The last 5 generated codes are kept in the visitor's own
  `localStorage` so they can see their session history — this never
  leaves their browser.

## License note

`assets/js/qrcode-lib.js` is a third-party library (MIT license,
Copyright (c) 2009 Kazuhiko Arase) — keep its header comment intact if
you redistribute this project.
