import {
  COLOR_PALETTES,
  BRUSH_TOOLS,
  SKETCH_TEMPLATES,
  renderPencilTemplate
} from "./templates.js";
import {
  MultiplayerManager,
  getActiveFirebaseConfig,
  saveCustomFirebaseConfig,
  isFirebaseConfigured
} from "./firebase-sync.js";

// حالة التطبيق العامة
const state = {
  mode: "sketch", // 'sketch' (تلوين تخطيط عشوائي مقسم لنصفين) | 'free' (رسم حر كامل)
  templateId: "floating_islands",
  splitLock: true, // قفل كل لاعب في نصفه الخاص في نمط التخطيط
  showSketchOverlay: true,
  currentTool: "watercolor",
  currentColor: "#E76F51",
  brushSize: 24,
  brushOpacity: 0.75,
  activePaletteKey: "pastel",
  customColors: ["#264653", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51"],
  isDrawing: false,
  currentPoints: [],
  allStrokes: {},
  liveStrokes: {},
  remoteCursors: {},
  players: {},
  mySide: "left",
  myName: localStorage.getItem("duo_art_player_name") || "فنان",
  roomId: null
};

// عناصر DOM
const els = {
  mainCanvas: document.getElementById("mainCanvas"),
  liveCanvas: document.getElementById("liveCanvas"),
  sketchCanvas: document.getElementById("sketchCanvas"),
  cursorLayer: document.getElementById("cursorLayer"),
  splitDividerUI: document.getElementById("splitDividerUI"),
  leftZoneBadge: document.getElementById("leftZoneBadge"),
  rightZoneBadge: document.getElementById("rightZoneBadge"),

  // الشريط العلوي والغرفة
  roomCodeDisplay: document.getElementById("roomCodeDisplay"),
  copyRoomLinkBtn: document.getElementById("copyRoomLinkBtn"),
  openLobbyBtn: document.getElementById("openLobbyBtn"),
  firebaseStatusBadge: document.getElementById("firebaseStatusBadge"),
  openFirebaseConfigBtn: document.getElementById("openFirebaseConfigBtn"),

  // حالة اللاعبين
  player1Card: document.getElementById("player1Card"),
  player1Name: document.getElementById("player1Name"),
  player1Status: document.getElementById("player1Status"),
  player2Card: document.getElementById("player2Card"),
  player2Name: document.getElementById("player2Name"),
  player2Status: document.getElementById("player2Status"),

  // أزرار الأنماط والقوالب
  modeSketchBtn: document.getElementById("modeSketchBtn"),
  modeFreeBtn: document.getElementById("modeFreeBtn"),
  templateControls: document.getElementById("templateControls"),
  templateTitle: document.getElementById("templateTitle"),
  randomTemplateBtn: document.getElementById("randomTemplateBtn"),
  toggleSplitLockBtn: document.getElementById("toggleSplitLockBtn"),
  toggleSketchVisBtn: document.getElementById("toggleSketchVisBtn"),

  // الأدوات والألوان
  brushToolsList: document.getElementById("brushToolsList"),
  brushSizeSlider: document.getElementById("brushSizeSlider"),
  brushSizeVal: document.getElementById("brushSizeVal"),
  brushOpacitySlider: document.getElementById("brushOpacitySlider"),
  brushOpacityVal: document.getElementById("brushOpacityVal"),
  paletteTabs: document.getElementById("paletteTabs"),
  paletteSwatches: document.getElementById("paletteSwatches"),
  customColorPicker: document.getElementById("customColorPicker"),
  activeColorPreview: document.getElementById("activeColorPreview"),

  // الإجراءات
  undoBtn: document.getElementById("undoBtn"),
  clearMySideBtn: document.getElementById("clearMySideBtn"),
  saveArtworkBtn: document.getElementById("saveArtworkBtn"),

  // النوافذ المنبثقة
  lobbyModal: document.getElementById("lobbyModal"),
  closeLobbyModalBtn: document.getElementById("closeLobbyModalBtn"),
  playerNameInput: document.getElementById("playerNameInput"),
  createRoomBtn: document.getElementById("createRoomBtn"),
  joinRoomCodeInput: document.getElementById("joinRoomCodeInput"),
  joinRoomBtn: document.getElementById("joinRoomBtn"),
  lobbyInitialMode: document.getElementById("lobbyInitialMode"),

  firebaseModal: document.getElementById("firebaseModal"),
  closeFirebaseModalBtn: document.getElementById("closeFirebaseModalBtn"),
  firebaseConfigTextarea: document.getElementById("firebaseConfigTextarea"),
  saveFirebaseConfigBtn: document.getElementById("saveFirebaseConfigBtn"),

  toastContainer: document.getElementById("toastContainer"),
  progressFillLeft: document.getElementById("progressFillLeft"),
  progressFillRight: document.getElementById("progressFillRight")
};

const mainCtx = els.mainCanvas.getContext("2d");
const liveCtx = els.liveCanvas.getContext("2d");

let lastLiveSyncTime = 0;
let lastCursorSyncTime = 0;

// إنشاء مدير اللعب الجماعي
const mp = new MultiplayerManager({
  onAuthReady(uid, isLocalDemo) {
    updateConnectionBadge(isLocalDemo);
  },
  onMetaChange(meta) {
    if (!meta) return;
    const prevTemplate = state.templateId;
    const prevMode = state.mode;
    state.mode = meta.mode || "sketch";
    state.templateId = meta.templateId || "floating_islands";
    state.splitLock = meta.splitLock !== undefined ? meta.splitLock : true;

    updateModeUI();
    if (prevTemplate !== state.templateId || prevMode !== state.mode) {
      refreshTemplateLayer();
    }
  },
  onPlayersChange(playersMap, myUid) {
    state.players = playersMap || {};
    if (playersMap[myUid]?.side) {
      state.mySide = playersMap[myUid].side;
    }
    renderPlayersStatus(playersMap, myUid);
    updateSplitZonesUI();
  },
  onStrokesSync(strokesMap) {
    state.allStrokes = strokesMap || {};
    redrawAllCompletedStrokes();
    updateArtWorkoutProgress();
  },
  onLiveStrokesChange(liveMap, myUid) {
    const filtered = {};
    for (const [uid, st] of Object.entries(liveMap || {})) {
      if (uid !== myUid && st) {
        filtered[uid] = st;
      }
    }
    state.liveStrokes = filtered;
    redrawLiveLayer();
  },
  onCursorsChange(cursorsMap, myUid) {
    state.remoteCursors = {};
    for (const [uid, cur] of Object.entries(cursorsMap || {})) {
      if (uid !== myUid && cur) {
        state.remoteCursors[uid] = cur;
      }
    }
    renderRemoteCursors();
  },
  onError(msg) {
    showToast(msg, "warning");
  }
});

// تهيئة التطبيق عند التحميل
async function initApp() {
  els.playerNameInput.value = state.myName;
  renderBrushTools();
  renderPaletteTabs();
  renderPaletteSwatches();
  updateActiveColorUI(state.currentColor);
  setupCanvasEvents();
  setupUIEvents();
  refreshTemplateLayer();

  await mp.init();

  // فحص ما إذا كان الرابط يحتوي على رمز غرفة (?room=XXXXXX)
  const urlParams = new URLSearchParams(window.location.search);
  const roomFromUrl = urlParams.get("room");
  if (roomFromUrl) {
    els.joinRoomCodeInput.value = roomFromUrl.toUpperCase();
    try {
      await handleJoinRoom(roomFromUrl.toUpperCase());
      els.lobbyModal.classList.add("hidden");
    } catch (err) {
      showToast(err.message || "تعذر الدخول للغرفة", "error");
      els.lobbyModal.classList.remove("hidden");
    }
  } else {
    els.lobbyModal.classList.remove("hidden");
  }
}

// ============================================================================
// بناء واجهة الأدوات والألوان
// ============================================================================
function renderBrushTools() {
  els.brushToolsList.innerHTML = "";
  for (const tool of BRUSH_TOOLS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `tool-btn ${state.currentTool === tool.id ? "active" : ""}`;
    btn.innerHTML = `
      <span class="tool-icon">${getToolSVG(tool.id)}</span>
      <div class="tool-info">
        <span class="tool-name">${tool.name}</span>
        <span class="tool-desc">${tool.desc}</span>
      </div>
    `;
    btn.addEventListener("click", () => {
      state.currentTool = tool.id;
      state.brushSize = tool.defaultSize;
      state.brushOpacity = tool.defaultOpacity;
      els.brushSizeSlider.min = tool.minSize;
      els.brushSizeSlider.max = tool.maxSize;
      els.brushSizeSlider.value = state.brushSize;
      els.brushSizeVal.textContent = `${state.brushSize}px`;

      els.brushOpacitySlider.value = Math.round(state.brushOpacity * 100);
      els.brushOpacityVal.textContent = `${Math.round(state.brushOpacity * 100)}%`;

      document.querySelectorAll(".tool-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
    els.brushToolsList.appendChild(btn);
  }
}

function getToolSVG(toolId) {
  const icons = {
    pencil: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>`,
    fineliner: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/></svg>`,
    marker: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 4 5 5L8 21H3v-5L15 4z"/><path d="m12 7 5 5"/></svg>`,
    watercolor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z"/><path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7"/></svg>`,
    oil: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.06 11.9 17.13 3.84a2.82 2.82 0 0 1 4 4L13.06 15.9a2 2 0 0 1-1.42.59H9v-2.65a2 2 0 0 1 .59-1.42Z"/><path d="M7 16.5c-2.5 0-4.5 2-4.5 4.5h8c1.5 0 2.5-1 2.5-2.5 0-1.1-.9-2-2-2H7Z"/></svg>`,
    airbrush: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="1"/><circle cx="10" cy="4" r="1"/><circle cx="4" cy="10" r="1"/><circle cx="9" cy="9" r="1"/><path d="M14 14l7 7"/><path d="M11 11l3 3"/></svg>`,
    eraser: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>`
  };
  return icons[toolId] || icons.pencil;
}

function renderPaletteTabs() {
  els.paletteTabs.innerHTML = "";
  for (const [key, pal] of Object.entries(COLOR_PALETTES)) {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = `palette-tab ${state.activePaletteKey === key ? "active" : ""}`;
    tab.textContent = pal.name;
    tab.addEventListener("click", () => {
      state.activePaletteKey = key;
      document.querySelectorAll(".palette-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderPaletteSwatches();
    });
    els.paletteTabs.appendChild(tab);
  }
}

function renderPaletteSwatches() {
  els.paletteSwatches.innerHTML = "";
  const palette = COLOR_PALETTES[state.activePaletteKey] || COLOR_PALETTES.pastel;
  for (const hex of palette.colors) {
    const swatch = document.createElement("button");
    swatch.type = "button";
    swatch.className = `color-swatch ${state.currentColor.toUpperCase() === hex.toUpperCase() ? "active" : ""}`;
    swatch.style.backgroundColor = hex;
    swatch.title = hex;
    swatch.addEventListener("click", () => {
      selectColor(hex);
    });
    els.paletteSwatches.appendChild(swatch);
  }
}

function selectColor(hex) {
  state.currentColor = hex;
  updateActiveColorUI(hex);
  document.querySelectorAll(".color-swatch").forEach((sw) => {
    sw.classList.toggle("active", sw.title.toUpperCase() === hex.toUpperCase());
  });
  if (state.currentTool === "eraser") {
    const wcBtn = els.brushToolsList.querySelectorAll(".tool-btn")[3];
    if (wcBtn) wcBtn.click();
  }
}

function updateActiveColorUI(hex) {
  els.activeColorPreview.style.backgroundColor = hex;
  els.customColorPicker.value = hex;
}

// ============================================================================
// الرسم على اللوحة وتنعيم المنحنيات (Canvas Rendering Engine)
// ============================================================================
function getCanvasCoordinates(ev) {
  const rect = els.liveCanvas.getBoundingClientRect();
  const scaleX = els.liveCanvas.width / rect.width;
  const scaleY = els.liveCanvas.height / rect.height;
  return {
    x: (ev.clientX - rect.left) * scaleX,
    y: (ev.clientY - rect.top) * scaleY
  };
}

// تقييد النقطة داخل النصف المخصص للاعب إذا كان القفل مفعلاً في نمط التخطيط
function clampPointToPlayerZone(pt) {
  if (state.mode !== "sketch" || !state.splitLock) {
    return pt;
  }
  const midX = els.mainCanvas.width / 2;
  if (state.mySide === "left") {
    return { x: Math.min(pt.x, midX), y: pt.y };
  } else {
    return { x: Math.max(pt.x, midX), y: pt.y };
  }
}

function isPointAllowedForPlayer(pt) {
  if (state.mode !== "sketch" || !state.splitLock) return true;
  const midX = els.mainCanvas.width / 2;
  return state.mySide === "left" ? pt.x <= midX + 4 : pt.x >= midX - 4;
}

function setupCanvasEvents() {
  const surface = els.liveCanvas;

  surface.addEventListener("pointerdown", (ev) => {
    if (ev.button !== 0 && ev.pointerType === "mouse") return;
    const rawPt = getCanvasCoordinates(ev);

    if (!isPointAllowedForPlayer(rawPt)) {
      const sideAr = state.mySide === "left" ? "الأيسر" : "الأيمن";
      showToast(`نصفك المخصص للتلوين هو النصف ${sideAr} (يمكنك إلغاء قفل النصف من الأعلى)`, "info");
      return;
    }

    surface.setPointerCapture(ev.pointerId);
    state.isDrawing = true;
    const pt = clampPointToPlayerZone(rawPt);
    state.currentPoints = [pt];

    redrawLiveLayer();
  });

  surface.addEventListener("pointermove", (ev) => {
    const rawPt = getCanvasCoordinates(ev);

    // بث حركة المؤشر للاعب الآخر
    const now = performance.now();
    if (now - lastCursorSyncTime > 45) {
      lastCursorSyncTime = now;
      mp.updateCursor(rawPt.x, rawPt.y, state.currentColor, state.brushSize, state.currentTool);
    }

    if (!state.isDrawing) return;

    const pt = clampPointToPlayerZone(rawPt);
    const prev = state.currentPoints[state.currentPoints.length - 1];
    const dist = Math.hypot(pt.x - prev.x, pt.y - prev.y);
    if (dist < 1.8) return;

    state.currentPoints.push(pt);
    redrawLiveLayer();

    // بث الخط الجاري رسمه لحظيًا للاعب الآخر
    if (now - lastLiveSyncTime > 60) {
      lastLiveSyncTime = now;
      mp.updateLiveStroke(buildCurrentStrokeObject());
    }
  });

  const finishStroke = async () => {
    if (!state.isDrawing) return;
    state.isDrawing = false;

    if (state.currentPoints.length > 0) {
      const strokeObj = buildCurrentStrokeObject();
      drawSingleStroke(mainCtx, strokeObj);
      state.currentPoints = [];
      redrawLiveLayer();
      await mp.pushCompletedStroke(strokeObj);
    }
  };

  surface.addEventListener("pointerup", finishStroke);
  surface.addEventListener("pointercancel", finishStroke);
}

function buildCurrentStrokeObject() {
  // تقليص دقة الأرقام لتسريع المزامنة في Firebase
  const compactPoints = state.currentPoints.map((p) => [
    Math.round(p.x * 10) / 10,
    Math.round(p.y * 10) / 10
  ]);

  return {
    tool: state.currentTool,
    color: state.currentColor,
    size: Number(state.brushSize),
    opacity: Number(state.brushOpacity),
    side: state.mySide,
    splitLocked: state.mode === "sketch" && state.splitLock,
    points: compactPoints
  };
}

// رسم خط واحد مع محاكاة نوع الفرشاة وتنعيم المنحنى
function drawSingleStroke(ctx, stroke) {
  if (!stroke || !stroke.points || stroke.points.length === 0) return;

  const pts = stroke.points.map((p) => (Array.isArray(p) ? { x: p[0], y: p[1] } : p));
  const tool = stroke.tool || "watercolor";
  const size = stroke.size || 12;
  const opacity = stroke.opacity ?? 0.85;
  const color = stroke.color || "#000000";

  ctx.save();

  // إذا كان الخط مرسوماً مع قفل النصف، نضمن عدم تجاوزه لخط المنتصف
  if (stroke.splitLocked && stroke.side) {
    ctx.beginPath();
    const midX = ctx.canvas.width / 2;
    if (stroke.side === "left") {
      ctx.rect(0, 0, midX, ctx.canvas.height);
    } else if (stroke.side === "right") {
      ctx.rect(midX, 0, midX, ctx.canvas.height);
    }
    ctx.clip();
  }

  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = size;

  if (tool === "eraser") {
    ctx.globalCompositeOperation = "destination-out";
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "rgba(0,0,0,1)";
  } else if (tool === "marker") {
    ctx.globalCompositeOperation = "multiply";
    ctx.globalAlpha = opacity * 0.72;
    ctx.strokeStyle = color;
    ctx.lineCap = "square";
  } else if (tool === "watercolor") {
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = opacity * 0.48;
    ctx.strokeStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = size * 0.45;
  } else if (tool === "airbrush") {
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = opacity * 0.3;
    ctx.strokeStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = size * 0.85;
  } else if (tool === "pencil") {
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = opacity * 0.82;
    ctx.strokeStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 0.8;
  } else if (tool === "oil") {
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = Math.min(1, opacity * 1.05);
    ctx.strokeStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 2;
  } else {
    // fineliner
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = color;
  }

  ctx.beginPath();
  if (pts.length === 1) {
    ctx.arc(pts[0].x, pts[0].y, size / 2, 0, Math.PI * 2);
    ctx.fillStyle = tool === "eraser" ? "rgba(0,0,0,1)" : color;
    ctx.fill();
  } else {
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length - 1; i++) {
      const midX = (pts[i].x + pts[i + 1].x) / 2;
      const midY = (pts[i].y + pts[i + 1].y) / 2;
      ctx.quadraticCurveTo(pts[i].x, pts[i].y, midX, midY);
    }
    const last = pts[pts.length - 1];
    ctx.lineTo(last.x, last.y);
    ctx.stroke();
  }

  ctx.restore();
}

function redrawAllCompletedStrokes() {
  mainCtx.clearRect(0, 0, els.mainCanvas.width, els.mainCanvas.height);
  const ordered = Object.values(state.allStrokes).sort(
    (a, b) => (a.timestamp || 0) - (b.timestamp || 0)
  );
  for (const st of ordered) {
    drawSingleStroke(mainCtx, st);
  }
}

function redrawLiveLayer() {
  liveCtx.clearRect(0, 0, els.liveCanvas.width, els.liveCanvas.height);

  // رسم خطوط اللاعب الآخر اللحظية
  for (const remoteStroke of Object.values(state.liveStrokes)) {
    if (remoteStroke.tool !== "eraser") {
      drawSingleStroke(liveCtx, remoteStroke);
    }
  }

  // رسم خط اللاعب الحالي أثناء السحب
  if (state.isDrawing && state.currentPoints.length > 0) {
    const myStroke = buildCurrentStrokeObject();
    if (myStroke.tool === "eraser") {
      // للممحاة نطبقها مباشرة على طبقة الرسم ليرى المسح فوراً
      drawSingleStroke(mainCtx, myStroke);
    } else {
      drawSingleStroke(liveCtx, myStroke);
    }
  }
}

function refreshTemplateLayer() {
  if (state.mode === "sketch" && state.showSketchOverlay) {
    renderPencilTemplate(els.sketchCanvas, state.templateId, state.splitLock);
    const tpl =
      SKETCH_TEMPLATES.find((t) => t.id === state.templateId) || SKETCH_TEMPLATES[0];
    els.templateTitle.textContent = tpl.title;
  } else {
    const sCtx = els.sketchCanvas.getContext("2d");
    sCtx.clearRect(0, 0, els.sketchCanvas.width, els.sketchCanvas.height);
  }
  updateSplitZonesUI();
}

// ============================================================================
// تحديث واجهة الأنماط، اللاعبين، ومؤشر التقدم التعاوني
// ============================================================================
function updateModeUI() {
  const isSketch = state.mode === "sketch";
  els.modeSketchBtn.classList.toggle("active", isSketch);
  els.modeFreeBtn.classList.toggle("active", !isSketch);
  els.templateControls.classList.toggle("hidden", !isSketch);

  els.toggleSplitLockBtn.classList.toggle("active", state.splitLock);
  els.toggleSplitLockBtn.innerHTML = state.splitLock
    ? `<span>🔒 تقسيم النصفين: مفعّل</span>`
    : `<span>🔓 تقسيم النصفين: حر</span>`;

  refreshTemplateLayer();
}

function updateSplitZonesUI() {
  const showSplit = state.mode === "sketch" && state.splitLock;
  els.splitDividerUI.classList.toggle("hidden", !showSplit);
  els.leftZoneBadge.classList.toggle("hidden", !showSplit);
  els.rightZoneBadge.classList.toggle("hidden", !showSplit);

  if (showSplit) {
    const leftPlayer = Object.values(state.players).find((p) => p.side === "left");
    const rightPlayer = Object.values(state.players).find((p) => p.side === "right");
    els.leftZoneBadge.textContent = `النصف الأيسر: ${leftPlayer ? leftPlayer.name : "اللاعب 1"}`;
    els.rightZoneBadge.textContent = `النصف الأيمن: ${rightPlayer ? rightPlayer.name : "اللاعب 2"}`;
  }
}

function renderPlayersStatus(playersMap, myUid) {
  const entries = Object.entries(playersMap || {});
  const leftEntry = entries.find(([, p]) => p.side === "left");
  const rightEntry = entries.find(([, p]) => p.side === "right");

  if (leftEntry) {
    const [uid, p] = leftEntry;
    els.player1Name.textContent = `${p.name} ${uid === myUid ? "(أنت)" : ""}`;
    els.player1Status.textContent = p.online ? "متصل الآن • النصف الأيسر" : "غير متصل";
    els.player1Card.classList.toggle("online", !!p.online);
  } else {
    els.player1Name.textContent = "بانتظار اللاعب 1...";
    els.player1Status.textContent = "النصف الأيسر";
    els.player1Card.classList.remove("online");
  }

  if (rightEntry) {
    const [uid, p] = rightEntry;
    els.player2Name.textContent = `${p.name} ${uid === myUid ? "(أنت)" : ""}`;
    els.player2Status.textContent = p.online ? "متصل الآن • النصف الأيمن" : "غير متصل";
    els.player2Card.classList.toggle("online", !!p.online);
  } else {
    els.player2Name.textContent = "بانتظار صديقك...";
    els.player2Status.textContent = "شارك الرابط ليدخل النصف الأيمن";
    els.player2Card.classList.remove("online");
  }
}

function renderRemoteCursors() {
  els.cursorLayer.innerHTML = "";
  const rect = els.liveCanvas.getBoundingClientRect();
  const scaleX = rect.width / els.liveCanvas.width;
  const scaleY = rect.height / els.liveCanvas.height;

  for (const cur of Object.values(state.remoteCursors)) {
    if (Date.now() - (cur.updatedAt || 0) > 15000) continue;
    const div = document.createElement("div");
    div.className = "remote-cursor";
    div.style.left = `${cur.x * scaleX}px`;
    div.style.top = `${cur.y * scaleY}px`;

    const ring = document.createElement("div");
    ring.className = "cursor-ring";
    const pxSize = Math.max(8, (cur.size || 12) * scaleX);
    ring.style.width = `${pxSize}px`;
    ring.style.height = `${pxSize}px`;
    ring.style.borderColor = cur.color || "#E76F51";

    const tag = document.createElement("span");
    tag.className = "cursor-nametag";
    tag.style.backgroundColor = cur.color || "#E76F51";
    tag.textContent = cur.name || "صديقك";

    div.appendChild(ring);
    div.appendChild(tag);
    els.cursorLayer.appendChild(div);
  }
}

function updateArtWorkoutProgress() {
  const strokes = Object.values(state.allStrokes);
  let leftScore = 0;
  let rightScore = 0;
  for (const s of strokes) {
    if (s.tool === "eraser") continue;
    const ptsCount = (s.points || []).length;
    if (s.side === "right") {
      rightScore += ptsCount;
    } else {
      leftScore += ptsCount;
    }
  }
  const leftPct = Math.min(100, Math.round((leftScore / 350) * 100));
  const rightPct = Math.min(100, Math.round((rightScore / 350) * 100));
  els.progressFillLeft.style.width = `${leftPct}%`;
  els.progressFillRight.style.width = `${rightPct}%`;
}

// ============================================================================
// حفظ اللوحة النهائية كصورة عالية الدقة
// ============================================================================
function exportArtworkImage() {
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = els.mainCanvas.width;
  exportCanvas.height = els.mainCanvas.height;
  const exCtx = exportCanvas.getContext("2d");

  // 1. خلفية ورق الرسم الكريمية المريحة للعين
  exCtx.fillStyle = "#FAF6F0";
  exCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

  // 2. دمج طبقة الألوان المرسومة
  exCtx.drawImage(els.mainCanvas, 0, 0);

  // 3. دمج طبقة التخطيط بقلم الرصاص (بدون خط التقسيم المتقطع)
  if (state.mode === "sketch" && state.showSketchOverlay) {
    const tempSketch = document.createElement("canvas");
    tempSketch.width = exportCanvas.width;
    tempSketch.height = exportCanvas.height;
    renderPencilTemplate(tempSketch, state.templateId, false);
    exCtx.drawImage(tempSketch, 0, 0);
  }

  // 4. توقيع أسماء الفنانين في الزاوية السفلية
  const playerNames = Object.values(state.players)
    .map((p) => p.name)
    .filter(Boolean)
    .join(" & ");
  if (playerNames) {
    exCtx.save();
    exCtx.font = "600 16px 'Tajawal', sans-serif";
    exCtx.fillStyle = "rgba(75, 65, 55, 0.65)";
    exCtx.textAlign = "left";
    exCtx.fillText(`بريشة: ${playerNames}`, 24, exportCanvas.height - 20);
    exCtx.restore();
  }

  const dataUrl = exportCanvas.toDataURL("image/png");
  const link = document.createElement("a");
  const fileName = `duo-art-${state.roomId || "studio"}-${Date.now().toString().slice(-4)}.png`;
  link.download = fileName;
  link.href = dataUrl;
  link.click();
  showToast("تم حفظ اللوحة الفنية بجودة عالية!", "success");
}

// ============================================================================
// إدارة الغرف، الأزرار، والنوافذ
// ============================================================================
async function handleCreateRoom() {
  const playerName = els.playerNameInput.value.trim() || "فنان 1";
  state.myName = playerName;
  localStorage.setItem("duo_art_player_name", playerName);

  const selectedMode = els.lobbyInitialMode.value || "sketch";
  const randomTpl =
    SKETCH_TEMPLATES[Math.floor(Math.random() * SKETCH_TEMPLATES.length)].id;

  try {
    const res = await mp.createRoom({
      playerName,
      mode: selectedMode,
      templateId: randomTpl,
      splitLock: true
    });
    onRoomJoinedSuccess(res.roomId, res.playerSide);
    els.lobbyModal.classList.add("hidden");
  } catch (err) {
    showToast(err.message || "حدث خطأ أثناء إنشاء الغرفة", "error");
  }
}

async function handleJoinRoom(codeOverride) {
  const code = (codeOverride || els.joinRoomCodeInput.value || "").trim().toUpperCase();
  if (!code || code.length < 3) {
    showToast("يرجى إدخال رمز غرفة صحيح", "warning");
    return;
  }

  const playerName = els.playerNameInput.value.trim() || "فنان 2";
  state.myName = playerName;
  localStorage.setItem("duo_art_player_name", playerName);

  const res = await mp.joinRoom({
    roomId: code,
    playerName
  });
  onRoomJoinedSuccess(res.roomId, res.playerSide);
  els.lobbyModal.classList.add("hidden");
}

function onRoomJoinedSuccess(roomId, side) {
  state.roomId = roomId;
  state.mySide = side;
  els.roomCodeDisplay.textContent = roomId;

  const newUrl = new URL(window.location.href);
  newUrl.searchParams.set("room", roomId);
  window.history.replaceState({}, "", newUrl.toString());

  const sideText = side === "left" ? "النصف الأيسر" : "النصف الأيمن";
  showToast(`تم دخول الغرفة (${roomId}) — مكانك: ${sideText}`, "success");
}

function setupUIEvents() {
  // منزلقات الحجم والشفافية
  els.brushSizeSlider.addEventListener("input", (e) => {
    state.brushSize = Number(e.target.value);
    els.brushSizeVal.textContent = `${state.brushSize}px`;
  });

  els.brushOpacitySlider.addEventListener("input", (e) => {
    state.brushOpacity = Number(e.target.value) / 100;
    els.brushOpacityVal.textContent = `${e.target.value}%`;
  });

  els.customColorPicker.addEventListener("input", (e) => {
    selectColor(e.target.value);
  });

  // تبديل النمط (تخطيط رصاص عشوائي / رسم حر)
  els.modeSketchBtn.addEventListener("click", () => {
    state.mode = "sketch";
    updateModeUI();
    mp.updateRoomMeta({ mode: "sketch" });
  });

  els.modeFreeBtn.addEventListener("click", () => {
    state.mode = "free";
    updateModeUI();
    mp.updateRoomMeta({ mode: "free" });
  });

  // اختيار رسمة رصاص عشوائية جديدة
  els.randomTemplateBtn.addEventListener("click", () => {
    const others = SKETCH_TEMPLATES.filter((t) => t.id !== state.templateId);
    const next = others[Math.floor(Math.random() * others.length)] || SKETCH_TEMPLATES[0];
    state.templateId = next.id;
    if (next.suggestedPalette && COLOR_PALETTES[next.suggestedPalette]) {
      state.activePaletteKey = next.suggestedPalette;
      renderPaletteTabs();
      renderPaletteSwatches();
    }
    refreshTemplateLayer();
    mp.updateRoomMeta({ templateId: next.id, mode: "sketch" });
    showToast(`تم اختيار تخطيط: ${next.title}`, "info");
  });

  // قفل/فتح تقسيم النصفين
  els.toggleSplitLockBtn.addEventListener("click", () => {
    state.splitLock = !state.splitLock;
    updateModeUI();
    mp.updateRoomMeta({ splitLock: state.splitLock });
  });

  // إظهار/إخفاء طبقة التخطيط بالرصاص
  els.toggleSketchVisBtn.addEventListener("click", () => {
    state.showSketchOverlay = !state.showSketchOverlay;
    els.toggleSketchVisBtn.classList.toggle("active", state.showSketchOverlay);
    refreshTemplateLayer();
  });

  // التراجع والمسح والحفظ
  els.undoBtn.addEventListener("click", async () => {
    const undone = await mp.undoMyLastStroke(state.allStrokes);
    if (!undone) {
      showToast("لا توجد خطوط سابقة لك للتراجع عنها", "info");
    }
  });

  els.clearMySideBtn.addEventListener("click", async () => {
    await mp.clearMyStrokes(state.allStrokes);
    showToast("تم مسح خطوطك من اللوحة", "info");
  });

  els.saveArtworkBtn.addEventListener("click", exportArtworkImage);

  // نسخ رابط الغرفة للمشاركة
  els.copyRoomLinkBtn.addEventListener("click", async () => {
    if (!state.roomId) {
      els.lobbyModal.classList.remove("hidden");
      return;
    }
    const shareUrl = `${window.location.origin}${window.location.pathname}?room=${state.roomId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast("تم نسخ رابط الغرفة! أرسله لصديقك ليدخل معك فوراً", "success");
    } catch (_) {
      prompt("انسخ رابط الغرفة وشاركه مع صديقك:", shareUrl);
    }
  });

  // نافذة الغرف
  els.openLobbyBtn.addEventListener("click", () => {
    els.lobbyModal.classList.remove("hidden");
  });
  els.closeLobbyModalBtn.addEventListener("click", () => {
    els.lobbyModal.classList.add("hidden");
  });
  els.createRoomBtn.addEventListener("click", handleCreateRoom);
  els.joinRoomBtn.addEventListener("click", () => {
    handleJoinRoom().catch((err) => showToast(err.message, "error"));
  });

  // نافذة إعدادات Firebase
  els.openFirebaseConfigBtn.addEventListener("click", () => {
    const currentCfg = getActiveFirebaseConfig();
    els.firebaseConfigTextarea.value = JSON.stringify(currentCfg, null, 2);
    els.firebaseModal.classList.remove("hidden");
  });
  els.closeFirebaseModalBtn.addEventListener("click", () => {
    els.firebaseModal.classList.add("hidden");
  });
  els.saveFirebaseConfigBtn.addEventListener("click", async () => {
    const rawText = els.firebaseConfigTextarea.value.trim();
    try {
      // يدعم لصق JSON مباشرة أو كائن firebaseConfig من منصة Firebase
      const cleaned = rawText
        .replace(/const\s+firebaseConfig\s*=\s*/, "")
        .replace(/;$/, "")
        .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2":');
      const parsed = JSON.parse(cleaned);
      if (!parsed.apiKey || !parsed.databaseURL) {
        throw new Error("تأكد من وجود apiKey و databaseURL داخل الإعدادات");
      }
      saveCustomFirebaseConfig(parsed);
      els.firebaseModal.classList.add("hidden");
      showToast("تم حفظ إعدادات Firebase وإعادة الاتصال بنجاح!", "success");
      await mp.init();
      if (state.roomId) {
        await handleJoinRoom(state.roomId);
      }
    } catch (err) {
      showToast("صيغة الإعدادات غير صحيحة: " + err.message, "error");
    }
  });

  // اختصار لوحة المفاتيح للتراجع Ctrl+Z
  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
      e.preventDefault();
      els.undoBtn.click();
    }
  });
}

function updateConnectionBadge(isLocalDemo) {
  if (!isLocalDemo && isFirebaseConfigured()) {
    els.firebaseStatusBadge.textContent = "Firebase متصل لحظياً";
    els.firebaseStatusBadge.className = "status-pill connected";
  } else {
    els.firebaseStatusBadge.textContent = "وضع تجريبي (اضغط لربط Firebase)";
    els.firebaseStatusBadge.className = "status-pill demo";
  }
}

function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  els.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("fade-out");
    setTimeout(() => toast.remove(), 300);
  }, 3600);
}

initApp();
