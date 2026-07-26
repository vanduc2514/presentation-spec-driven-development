/* remote-control.js — Presenter-side remote control (ntfy.sh relay)
 * Injected into output/index.html by build.cjs
 * CDN dep loaded before this script: qrcodejs
 *
 * Uses ntfy.sh as an HTTP/SSE pub-sub relay so the remote works on any
 * network — including mobile 4G — without WebRTC or TURN servers.
 *
 * Two password-derived topics (SHA-256 hex prefixes):
 *   <base>-s  presenter publishes slide state → mobile subscribes
 *   <base>-r  mobile publishes commands       → presenter subscribes
 */
/* global QRCode */
(() => {
  "use strict";

  const NTFY = "https://ntfy.sh";
  const MAX_NOTES = 2000;

  const overlay = Object.assign(document.createElement("div"), {
    id: "rc-overlay",
    innerHTML: `
      <div id="rc-modal">
        <button id="rc-close-btn" title="Close">&#x2715;</button>
        <div id="rc-modal-title">Remote Control</div>
        <div id="rc-setup-panel">
          <label for="rc-pw-input">Session Password</label>
          <input id="rc-pw-input" type="password" placeholder="Choose a password\u2026" autocomplete="off">
          <div id="rc-setup-error" style="display:none"></div>
          <button id="rc-start-btn">Start Remote Session</button>
        </div>
        <div id="rc-active-panel" style="display:none">
          <div id="rc-status">Waiting for connection\u2026</div>
          <div id="rc-qr-wrap">
            <div id="rc-qr-canvas"></div>
            <button id="rc-url-btn" title="Click to copy">\u2014</button>
          </div>
          <div id="rc-count">0 device(s) connected</div>
          <button id="rc-stop-btn">Stop Session</button>
        </div>
      </div>
    `,
  });
  document.body.append(overlay);

  const rcBtn = Object.assign(document.createElement("button"), {
    id: "rc-btn",
    title: "Remote Control",
    textContent: "Remote",
  });
  document.body.append(rcBtn);

  // ── element refs ──────────────────────────────────────────────────────
  const $ = (id) => overlay.querySelector(id);
  const pwInput = $("#rc-pw-input");
  const setupPanel = $("#rc-setup-panel");
  const activePanel = $("#rc-active-panel");
  const setupError = $("#rc-setup-error");
  const statusEl = $("#rc-status");
  const qrWrap = $("#rc-qr-canvas");
  const urlBtn = $("#rc-url-btn");
  const countEl = $("#rc-count");
  const startBtn = $("#rc-start-btn");
  const stopBtn = $("#rc-stop-btn");
  const closeBtn = $("#rc-close-btn");

  // ── misc ──────────────────────────────────────────────────────────────
  let stateTopic = "";
  let cmdTopic = "";
  let evtSource = null;
  let statePoller = null;
  let lastState = "";

  const deriveTopics = (pw) => {
    let hash = 0;
    for (let i = 0; i < pw.length; i++) {
      const chr = pw.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    const b64 = btoa(String(Math.abs(hash)));
    const base = "pres-" + b64.slice(0, 8).replace(/[^a-zA-Z0-9]/g, "x").toLowerCase();
    return { stateTopic: base + "-s", cmdTopic: base + "-r" };
  };

  const getSlideState = () => {
    const active = document.querySelector(".step.active");
    if (!active) return null;
    const all = document.querySelectorAll(".step");
    const idx = Array.from(all).indexOf(active);
    const heading = active.querySelector("h1, h2, h3")?.textContent?.trim() || "";
    // Extract speaker notes from HTML comments
    const notesMatch = active.innerHTML.match(/<!--\s*SPEAKER NOTES\s*-->\s*([\s\S]*?)-->/);
    const notes = notesMatch ? notesMatch[1].trim().slice(0, MAX_NOTES) : "";
    return { current: idx, total: all.length, title: heading, notes };
  };

  const publishState = () => {
    const state = getSlideState();
    if (!state) return;
    const msg = JSON.stringify(state);
    if (msg === lastState) return;
    lastState = msg;
    fetch(`${NTFY}/${stateTopic}`, { method: "POST", body: msg, keepalive: true }).catch(() => {});
  };

  const startRemote = () => {
    const pw = pwInput.value.trim();
    if (!pw) {
      setupError.textContent = "Please enter a password.";
      setupError.style.display = "block";
      return;
    }
    setupError.style.display = "none";

    const topics = deriveTopics(pw);
    stateTopic = topics.stateTopic;
    cmdTopic = topics.cmdTopic;
    const remoteUrl = `${window.location.origin}${window.location.pathname.replace(/\/?$/, "/remote.html")}`;

    setupPanel.style.display = "none";
    activePanel.style.display = "block";
    statusEl.textContent = "Starting session\u2026";

    // Publish initial state
    publishState();

    // Poll state periodically
    statePoller = setInterval(publishState, 2000);

    // Subscribe to command events via SSE
    if (evtSource) evtSource.close();
    evtSource = new EventSource(`${NTFY}/${cmdTopic}/sse`);
    evtSource.onmessage = (e) => {
      const cmd = e.data?.trim();
      if (cmd === "prev") impress().prev();
      else if (cmd === "next") impress().next();
      publishState(); // Push updated state immediately
    };
    evtSource.onopen = () => {
      statusEl.textContent = "Session active \u2014 scan QR code to control";
    };
    evtSource.onerror = () => {
      statusEl.textContent = "Connection lost \u2014 reconnecting\u2026";
    };

    // Device count (ntfy doesn't expose this directly, show placeholder)
    countEl.textContent = "Scan the QR code to connect";

    // QR Code
    qrWrap.innerHTML = "";
    try {
      new QRCode(qrWrap, {
        text: remoteUrl,
        width: 160,
        height: 160,
        colorDark: "#1e1e2e",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
    } catch {
      qrWrap.textContent = "QR code unavailable";
    }
    urlBtn.textContent = remoteUrl;
    urlBtn.onclick = () => {
      navigator.clipboard.writeText(remoteUrl).catch(() => {});
      urlBtn.textContent = "Copied!";
      setTimeout(() => { urlBtn.textContent = remoteUrl; }, 2000);
    };
  };

  const stopRemote = () => {
    if (evtSource) { evtSource.close(); evtSource = null; }
    if (statePoller) { clearInterval(statePoller); statePoller = null; }
    setupPanel.style.display = "block";
    activePanel.style.display = "none";
    overlay.classList.remove("rc-open");
  };

  // ── event wiring ─────────────────────────────────────────────────────
  rcBtn.addEventListener("click", () => overlay.classList.add("rc-open"));
  closeBtn.addEventListener("click", () => overlay.classList.remove("rc-open"));
  startBtn.addEventListener("click", startRemote);
  stopBtn.addEventListener("click", stopRemote);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.classList.remove("rc-open");
  });
  pwInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") startBtn.click();
  });
})();
