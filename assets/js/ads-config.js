/* ==========================================================================
   ADSTERRA CONFIGURATION
   ==========================================================================
   This file is the ONLY place you need to touch to turn on ads. Everything
   else in the site (the labeled boxes you see in index.html) is already
   wired up to hold your ad units.

   You get each snippet below from https://beta.publishers.adsterra.com
   after creating an Ad Unit for this website. Adsterra gives you a
   <script> tag (and sometimes a matching <div>) for every unit — paste
   those exactly as given, in the spot named for them here.

   -------------------------------------------------------------------------
   1) BANNER AD UNITS (top / mid / bottom / interstitial)
   -------------------------------------------------------------------------
   In index.html, find these five containers:
     #ad-top-banner        — leaderboard, first thing under the header
     #ad-mid-banner        — between the tool and the article content
     #ad-content-native     — inside the article content
     #ad-bottom-banner      — just above the footer
     #ad-download-gate      — inside the download confirmation popup

   For each one, paste the matching Adsterra "Banner" or "Native Banner"
   script INSIDE the empty <div class="ad-slot__inner"> that sits inside
   that container — replacing the HTML comment that says the script goes
   there. Do not paste it anywhere else in that block; the label and the
   dashed border are layout, not the ad.

   -------------------------------------------------------------------------
   2) PREVIEW RAIL UNIT (beside the live QR code)
   -------------------------------------------------------------------------
   Same idea, for the box with id="ad-preview-rail" — this is the highest
   -visibility slot on the page since it sits next to the tool people are
   actually using. A Native Banner unit fits this shape best.

   -------------------------------------------------------------------------
   3) SOCIAL BAR (sitewide floating unit)
   -------------------------------------------------------------------------
   Adsterra's Social Bar is a single global script — it is NOT tied to one
   container, it manages its own floating widget on every page. Paste that
   script directly into this file, below this comment block, exactly as
   Adsterra gives it to you:

   // <script src="//YOUR-SOCIAL-BAR-SCRIPT-URL"></script>
   // (paste the real <script> tag's contents here, or leave as a normal
   //  <script> tag placed just before </body> in index.html — either
   //  location works, Adsterra's own snippet will say which it needs)

   -------------------------------------------------------------------------
   4) POPUNDER (fires on click, anywhere on the page)
   -------------------------------------------------------------------------
   Popunder is also a single global script with no container. Paste it the
   same way as the Social Bar script above, directly in this file. Adsterra
   automatically limits it to roughly once per visitor per session — you
   don't need to build that logic yourself.

   -------------------------------------------------------------------------
   A note on the download gate
   -------------------------------------------------------------------------
   Every "Download PNG / Download SVG" click already routes through a
   3-second confirmation popup (see #ad-download-gate in index.html and
   openGate() in app.js) before the file is released. That popup is where
   the #ad-download-gate banner script earns its keep — combined with a
   Popunder firing on the same click, one download can generate two ad
   impressions without needing any extra code from you.
   ========================================================================== */

// Paste your Adsterra Social Bar <script> tag below this line:


// Paste your Adsterra Popunder <script> tag below this line:
