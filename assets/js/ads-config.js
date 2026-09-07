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
   1) BANNER AD UNITS (top / mid / bottom / in-content)
   -------------------------------------------------------------------------
   In index.html, find these containers:
     #ad-top-banner        — leaderboard, first thing under the header
     #ad-mid-banner        — between the tool and the article content
     #ad-content-native     — inside the article content
     #ad-how-to-faq          — between "how it works" and the FAQ
     #ad-bottom-banner      — just above the footer

   For each one, paste the matching Adsterra "Banner" or "Native Banner"
   script INSIDE the empty <div class="ad-slot__inner"> that sits inside
   that container — replacing the HTML comment that says the script goes
   there. Do not paste it anywhere else in that block; the label and the
   dashed border are layout, not the ad.

   -------------------------------------------------------------------------
   2) PREVIEW RAIL, STICKY RAIL & STICKY BOTTOM BAR UNITS
   -------------------------------------------------------------------------
   Same idea, for these persistent (non-popup) placements:
     #ad-preview-rail   — beside the live QR code, highest-visibility slot
     #ad-sticky-rail    — fixed skyscraper, desktop only (>=1550px wide)
     #ad-sticky-bottom  — fixed bottom bar, mobile only (<=640px wide),
                           dismissible per-session via its × button
   A Native Banner or Banner unit fits these shapes best.

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
   A note on downloads
   -------------------------------------------------------------------------
   "Download PNG / Download SVG" now download immediately — there is no
   interstitial gate. The Popunder above still fires on that click like
   any other click on the page, so downloads still generate an ad
   impression without needing any extra code from you.
   ========================================================================== */

// Paste your Adsterra Social Bar <script> tag below this line:
(function () {
  var s = document.createElement('script');
  s.src = "https://pl31229115.profitableratecpmnetwork.com/a1/78/ba/a178ba5382642c70919a282cd05435aa.js";
  document.body.appendChild(s);
})();

// Paste your Adsterra Popunder <script> tag below this line:
(function () {
  var s = document.createElement('script');
  s.src = "https://pl31229113.profitableratecpmnetwork.com/df/c0/cc/dfc0cc06cab13a34675008b4c6305b7e.js";
  document.body.appendChild(s);
})();
