(function () {
  "use strict";

  /* ----------------------------------------------------------------
     Element references
  ---------------------------------------------------------------- */
  var form = document.getElementById("qr-form");
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".type-tab"));
  var fieldGroups = Array.prototype.slice.call(document.querySelectorAll(".field-group"));
  var canvas = document.getElementById("qr-canvas");
  var ctx = canvas.getContext("2d");
  var previewEmpty = document.getElementById("preview-empty");
  var scanLine = document.querySelector(".scan-line");

  var btnPng = document.getElementById("btn-download-png");
  var btnSvg = document.getElementById("btn-download-svg");
  var btnCopy = document.getElementById("btn-copy-data");

  var cFg = document.getElementById("c-fg");
  var cBg = document.getElementById("c-bg");
  var cEcc = document.getElementById("c-ecc");
  var cSize = document.getElementById("c-size");
  var cLogo = document.getElementById("c-logo");

  var historyWrap = document.getElementById("history");
  var historyList = document.getElementById("history-list");

  var gate = document.getElementById("download-gate");
  var gateContinueBtn = document.getElementById("btn-gate-continue");
  var gateTimerEl = document.getElementById("gate-timer");

  var currentType = "url";
  var currentQrMatrix = null; // {modules, count}
  var currentRawData = "";
  var logoImage = null;
  var pendingDownload = null; // "png" | "svg"

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ----------------------------------------------------------------
     Tab switching
  ---------------------------------------------------------------- */
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");
      currentType = tab.getAttribute("data-type");

      fieldGroups.forEach(function (g) {
        g.hidden = g.getAttribute("data-fields") !== currentType;
      });
    });
  });

  /* ----------------------------------------------------------------
     Build the raw string to encode, based on active type
  ---------------------------------------------------------------- */
  function escapeWifi(str) {
    return String(str).replace(/([\\;,:"])/g, "\\$1");
  }

  function escapeVCard(str) {
    return String(str).replace(/([\\;,])/g, "\\$1");
  }

  function buildData() {
    var val = function (id) {
      var el = document.getElementById(id);
      return el ? el.value.trim() : "";
    };

    switch (currentType) {
      case "url": {
        var u = val("f-url");
        if (u && !/^https?:\/\//i.test(u)) u = "https://" + u;
        return u;
      }
      case "text":
        return val("f-text");
      case "wifi": {
        var ssid = escapeWifi(val("f-wifi-ssid"));
        var pass = escapeWifi(val("f-wifi-pass"));
        var enc = val("f-wifi-enc") || "WPA";
        var hidden = document.getElementById("f-wifi-hidden").checked ? "true" : "false";
        if (enc === "nopass") {
          return "WIFI:T:nopass;S:" + ssid + ";H:" + hidden + ";;";
        }
        return "WIFI:T:" + enc + ";S:" + ssid + ";P:" + pass + ";H:" + hidden + ";;";
      }
      case "vcard": {
        var name = val("f-vc-name");
        var org = val("f-vc-org");
        var phone = val("f-vc-phone");
        var email = val("f-vc-email");
        var url = val("f-vc-url");
        var lines = ["BEGIN:VCARD", "VERSION:3.0"];
        lines.push("N:" + escapeVCard(name));
        lines.push("FN:" + escapeVCard(name));
        if (org) lines.push("ORG:" + escapeVCard(org));
        if (phone) lines.push("TEL;TYPE=CELL:" + phone);
        if (email) lines.push("EMAIL:" + email);
        if (url) lines.push("URL:" + url);
        lines.push("END:VCARD");
        return lines.join("\n");
      }
      case "email": {
        var to = val("f-email-to");
        var subject = val("f-email-subject");
        var body = val("f-email-body");
        var q = [];
        if (subject) q.push("subject=" + encodeURIComponent(subject));
        if (body) q.push("body=" + encodeURIComponent(body));
        return "mailto:" + to + (q.length ? "?" + q.join("&") : "");
      }
      case "phone":
        return "tel:" + val("f-phone");
      case "sms": {
        var smsTo = val("f-sms-to");
        var smsBody = val("f-sms-body");
        return "SMSTO:" + smsTo + (smsBody ? ":" + smsBody : "");
      }
      default:
        return "";
    }
  }

  /* ----------------------------------------------------------------
     Render QR onto canvas using the vendored qrcode-generator lib
  ---------------------------------------------------------------- */
  function renderQr(data) {
    if (!data) return false;

    var ecc = cEcc.value || "M";
    var qr = qrcode(0, ecc); // typeNumber 0 = auto-detect smallest size
    qr.addData(data);
    qr.make();

    var count = qr.getModuleCount();
    var targetSize = parseInt(cSize.value, 10) || 600;
    var quietModules = 4;
    var totalModules = count + quietModules * 2;
    var cell = Math.floor(targetSize / totalModules) || 1;
    var pixelSize = cell * totalModules;

    canvas.width = pixelSize;
    canvas.height = pixelSize;

    var fg = cFg.value || "#151a21";
    var bg = cBg.value || "#ffffff";

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, pixelSize, pixelSize);

    ctx.fillStyle = fg;
    for (var row = 0; row < count; row++) {
      for (var col = 0; col < count; col++) {
        if (qr.isDark(row, col)) {
          ctx.fillRect(
            (col + quietModules) * cell,
            (row + quietModules) * cell,
            cell,
            cell
          );
        }
      }
    }

    // Optional center logo, drawn on a white backing plate
    if (logoImage) {
      var logoSize = Math.floor(pixelSize * 0.22);
      var pad = Math.floor(logoSize * 0.16);
      var lx = (pixelSize - logoSize) / 2;
      var ly = (pixelSize - logoSize) / 2;
      ctx.fillStyle = bg;
      ctx.fillRect(lx - pad, ly - pad, logoSize + pad * 2, logoSize + pad * 2);
      ctx.drawImage(logoImage, lx, ly, logoSize, logoSize);
    }

    currentQrMatrix = { qr: qr, count: count, quietModules: quietModules, cell: cell, pixelSize: pixelSize, fg: fg, bg: bg };
    return true;
  }

  function buildSvgString() {
    if (!currentQrMatrix) return "";
    var m = currentQrMatrix;
    var parts = [];
    parts.push('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + m.pixelSize + ' ' + m.pixelSize + '" width="' + m.pixelSize + '" height="' + m.pixelSize + '">');
    parts.push('<rect width="100%" height="100%" fill="' + m.bg + '"/>');
    for (var row = 0; row < m.count; row++) {
      for (var col = 0; col < m.count; col++) {
        if (m.qr.isDark(row, col)) {
          var x = (col + m.quietModules) * m.cell;
          var y = (row + m.quietModules) * m.cell;
          parts.push('<rect x="' + x + '" y="' + y + '" width="' + m.cell + '" height="' + m.cell + '" fill="' + m.fg + '"/>');
        }
      }
    }
    parts.push("</svg>");
    return parts.join("");
  }

  /* ----------------------------------------------------------------
     Form submit -> generate
  ---------------------------------------------------------------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = buildData();
    if (!data) {
      alert("Fill in the required field first.");
      return;
    }
    currentRawData = data;

    var ok = renderQr(data);
    if (!ok) return;

    canvas.style.display = "block";
    previewEmpty.style.display = "none";

    scanLine.classList.remove("is-scanning");
    // force reflow so the animation can restart
    void scanLine.offsetWidth;
    scanLine.classList.add("is-scanning");

    btnPng.disabled = false;
    btnSvg.disabled = false;
    btnCopy.disabled = false;

    addToHistory(currentType, data);
  });

  // Re-render live when color/size/ecc changes, if a code already exists
  [cFg, cBg, cEcc, cSize].forEach(function (el) {
    el.addEventListener("input", function () {
      if (currentRawData) renderQr(currentRawData);
    });
  });

  cLogo.addEventListener("change", function () {
    var file = cLogo.files && cLogo.files[0];
    if (!file) { logoImage = null; return; }
    var reader = new FileReader();
    reader.onload = function (ev) {
      var img = new Image();
      img.onload = function () {
        logoImage = img;
        if (currentRawData) renderQr(currentRawData);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  /* ----------------------------------------------------------------
     History (local only — nothing leaves the browser)
  ---------------------------------------------------------------- */
  function addToHistory(type, data) {
    var list;
    try {
      list = JSON.parse(localStorage.getItem("scanline_history") || "[]");
    } catch (err) {
      list = [];
    }
    list.unshift({ type: type, data: data, at: Date.now() });
    list = list.slice(0, 5);
    try {
      localStorage.setItem("scanline_history", JSON.stringify(list));
    } catch (err) { /* storage unavailable — skip silently */ }
    renderHistory(list);
  }

  function renderHistory(list) {
    if (!list || !list.length) return;
    historyWrap.hidden = false;
    historyList.innerHTML = "";
    list.forEach(function (item) {
      var li = document.createElement("li");
      var preview = item.data.length > 70 ? item.data.slice(0, 70) + "…" : item.data;
      li.textContent = "[" + item.type + "] " + preview;
      historyList.appendChild(li);
    });
  }

  (function initHistory() {
    try {
      var list = JSON.parse(localStorage.getItem("scanline_history") || "[]");
      renderHistory(list);
    } catch (err) { /* ignore */ }
  })();

  /* ----------------------------------------------------------------
     Copy raw data
  ---------------------------------------------------------------- */
  btnCopy.addEventListener("click", function () {
    if (!currentRawData) return;
    navigator.clipboard.writeText(currentRawData).then(function () {
      var original = btnCopy.textContent;
      btnCopy.textContent = "Copied";
      setTimeout(function () { btnCopy.textContent = original; }, 1400);
    });
  });

  /* ----------------------------------------------------------------
     Download gate — shows the interstitial ad slot for a few seconds
     before releasing the actual PNG/SVG file. This is the main
     monetization checkpoint: every download passes through an ad
     impression here. See assets/js/ads-config.js for network scripts.
  ---------------------------------------------------------------- */
  function openGate(kind) {
    pendingDownload = kind;
    gate.hidden = false;
    gateContinueBtn.disabled = true;
    var seconds = 3;
    gateTimerEl.textContent = seconds;
    gateContinueBtn.textContent = "Download in " + seconds + "…";

    var timer = setInterval(function () {
      seconds -= 1;
      if (seconds <= 0) {
        clearInterval(timer);
        gateContinueBtn.disabled = false;
        gateContinueBtn.textContent = "Download now";
      } else {
        gateTimerEl.textContent = seconds;
        gateContinueBtn.textContent = "Download in " + seconds + "…";
      }
    }, 1000);
  }

  function closeGate() {
    gate.hidden = true;
    pendingDownload = null;
  }

  btnPng.addEventListener("click", function () { openGate("png"); });
  btnSvg.addEventListener("click", function () { openGate("svg"); });

  gateContinueBtn.addEventListener("click", function () {
    if (gateContinueBtn.disabled) return;
    if (pendingDownload === "png") downloadPng();
    if (pendingDownload === "svg") downloadSvg();
    closeGate();
  });

  gate.addEventListener("click", function (e) {
    if (e.target === gate) closeGate();
  });

  function downloadPng() {
    var link = document.createElement("a");
    link.download = "qr-" + currentType + ".png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function downloadSvg() {
    var svg = buildSvgString();
    var blob = new Blob([svg], { type: "image/svg+xml" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.download = "qr-" + currentType + ".svg";
    link.href = url;
    link.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
  }

  /* ----------------------------------------------------------------
     Generate an initial example code on load
  ---------------------------------------------------------------- */
  form.dispatchEvent(new Event("submit", { cancelable: true }));

})();
