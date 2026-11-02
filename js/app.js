import {
  COLOR_PALETTES,
  PAPER_THEMES,
  BRUSH_TOOLS,
  SKETCH_TEMPLATES,
  renderPencilTemplate
} from "./templates.js";
import {
  MultiplayerManager,
  getActiveCloudConfig,
  saveCustomCloudConfig
} from "./firebase-sync.js";

// حالة المرسم العامة
const state = {
  mode: "sketch", // 'sketch' (تخطيط رصاص مقسم لنصفين) | 'free' (مرسم حر كامل)
  templateId: "floating_islands",
  paperId: "cream",
  splitLock: true,
  showSketchOverlay: true,
  symmetryMode: false,
  zoomLevel: 1,
  toolCategory: "all",
  currentTool: "watercolor",
  currentColor: "#E76F51",
  brushSize: 24,
  brushOpacity: 0.78,
  activePaletteKey: "pastel",
  recentColors: ["#E76F51", "#2A9D8F", "#E9C46A", "#457B9D", "#F4A261", "#81B29A", "#6D6875", "#264653"],
  isDrawing: false,
  isReplaying: false,
  currentPoints: [],
  redoStack: [],
  allStrokes: {},
  liveStrokes: {},
  remoteCursors: {},
  players: {},
  weeklyFeatured: {},
  submissions: {},
  mySide: "left",
  myName: localStorage.getItem("duo_art_player_name") || "فنان",
  roomId: null,
  adminUnlocked: sessionStorage.getItem("duo_art_admin_auth") === "1"
};

const ADMIN_PIN_STORAGE_KEY = "duo_art_admin_pin_v1";
function getAdminPin() {
  return localStorage.getItem(ADMIN_PIN_STORAGE_KEY) || "2026";
}

// عناصر الواجهة
const els = {
  brandLogoTrigger: document.getElementById("brandLogoTrigger"),
  mainCanvas: document.getElementById("mainCanvas"),
  liveCanvas: document.getElementById("liveCanvas"),
  sketchCanvas: document.getElementById("sketchCanvas"),
  canvasWrapper: document.getElementById("canvasWrapper"),
  canvasViewport: document.getElementById("canvasViewport"),
  cursorLayer: document.getElementById("cursorLayer"),
  splitDividerUI: document.getElementById("splitDividerUI"),
  leftZoneBadge: document.getElementById("leftZoneBadge"),
  rightZoneBadge: document.getElementById("rightZoneBadge"),

  // الشريط العلوي
  roomCodeDisplay: document.getElementById("roomCodeDisplay"),
  copyRoomLinkBtn: document.getElementById("copyRoomLinkBtn"),
  openLobbyBtn: document.getElementById("openLobbyBtn"),
  openWeeklyGalleryBtn: document.getElementById("openWeeklyGalleryBtn"),
  openSubmitArtworkBtn: document.getElementById("openSubmitArtworkBtn"),
  saveArtworkBtn: document.getElementById("saveArtworkBtn"),

  // اللاعبين والتقدم
  player1Card: document.getElementById("player1Card"),
  player1Name: document.getElementById("player1Name"),
  player1Status: document.getElementById("player1Status"),
  player2Card: document.getElementById("player2Card"),
  player2Name: document.getElementById("player2Name"),
  player2Status: document.getElementById("player2Status"),
  progressFillLeft: document.getElementById("progressFillLeft"),
  progressFillRight: document.getElementById("progressFillRight"),
  reactionBtns: document.querySelectorAll(".reaction-chip"),

  // الأنماط والقوالب والورق
  modeSketchBtn: document.getElementById("modeSketchBtn"),
  modeFreeBtn: document.getElementById("modeFreeBtn"),
  templateControls: document.getElementById("templateControls"),
  templateSelect: document.getElementById("templateSelect"),
  randomTemplateBtn: document.getElementById("randomTemplateBtn"),
  toggleSplitLockBtn: document.getElementById("toggleSplitLockBtn"),
  toggleSketchVisBtn: document.getElementById("toggleSketchVisBtn"),
  toggleSymmetryBtn: document.getElementById("toggleSymmetryBtn"),
  paperThemeSelect: document.getElementById("paperThemeSelect"),
  zoomInBtn: document.getElementById("zoomInBtn"),
  zoomOutBtn: document.getElementById("zoomOutBtn"),
  zoomResetBtn: document.getElementById("zoomResetBtn"),
  replayBtn: document.getElementById("replayBtn"),

  // الأدوات والألوان
  toolCatBtns: document.querySelectorAll(".tool-cat-btn"),
  brushToolsList: document.getElementById("brushToolsList"),
  brushSizeSlider: document.getElementById("brushSizeSlider"),
  brushSizeVal: document.getElementById("brushSizeVal"),
  brushOpacitySlider: document.getElementById("brushOpacitySlider"),
  brushOpacityVal: document.getElementById("brushOpacityVal"),
  paletteTabs: document.getElementById("paletteTabs"),
  paletteSwatches: document.getElementById("paletteSwatches"),
  recentSwatches: document.getElementById("recentSwatches"),
  customColorPicker: document.getElementById("customColorPicker"),
  activeColorPreview: document.getElementById("activeColorPreview"),
  activeColorHex: document.getElementById("activeColorHex"),

  // أزرار التراجع والمسح
  undoBtn: document.getElementById("undoBtn"),
  redoBtn: document.getElementById("redoBtn"),
  clearMySideBtn: document.getElementById("clearMySideBtn"),

  // النوافذ المنبثقة
  lobbyModal: document.getElementById("lobbyModal"),
  closeLobbyModalBtn: document.getElementById("closeLobbyModalBtn"),
  playerNameInput: document.getElementById("playerNameInput"),
  createRoomBtn: document.getElementById("createRoomBtn"),
  joinRoomCodeInput: document.getElementById("joinRoomCodeInput"),
  joinRoomBtn: document.getElementById("joinRoomBtn"),
  lobbyInitialMode: document.getElementById("lobbyInitialMode"),

  // نافذة معرض لوحة الأسبوع
  weeklyGalleryModal: document.getElementById("weeklyGalleryModal"),
  closeWeeklyGalleryBtn: document.getElementById("closeWeeklyGalleryBtn"),
  weeklyHeroContainer: document.getElementById("weeklyHeroContainer"),
  weeklyGridContainer: document.getElementById("weeklyGridContainer"),

  // نافذة إرسال اللوحة لرسمة الأسبوع
  submitArtworkModal: document.getElementById("submitArtworkModal"),
  closeSubmitArtworkBtn: document.getElementById("closeSubmitArtworkBtn"),
  submitPreviewImg: document.getElementById("submitPreviewImg"),
  submitTitleInput: document.getElementById("submitTitleInput"),
  submitArtistsInput: document.getElementById("submitArtistsInput"),
  confirmSubmitArtworkBtn: document.getElementById("confirmSubmitArtworkBtn"),

  // نافذة لوحة تحكم الأدمن السرية
  adminModal: document.getElementById("adminModal"),
  closeAdminModalBtn: document.getElementById("closeAdminModalBtn"),
  adminLoginSection: document.getElementById("adminLoginSection"),
  adminPinInput: document.getElementById("adminPinInput"),
  adminLoginBtn: document.getElementById("adminLoginBtn"),
  adminDashboardSection: document.getElementById("adminDashboardSection"),
  adminSubmissionsGrid: document.getElementById("adminSubmissionsGrid"),
  adminFeaturedGrid: document.getElementById("adminFeaturedGrid"),
  adminCloudConfigTextarea: document.getElementById("adminCloudConfigTextarea"),
  adminSaveCloudConfigBtn: document.getElementById("adminSaveCloudConfigBtn"),
  adminNewPinInput: document.getElementById("adminNewPinInput"),
  adminSavePinBtn: document.getElementById("adminSavePinBtn"),

  toastContainer: document.getElementById("toastContainer")
};

const mainCtx = els.mainCanvas.getContext("2d", { willReadFrequently: true });
const liveCtx = els.liveCanvas.getContext("2d");

let lastLiveSyncTime = 0;
let lastCursorSyncTime = 0;
let logoClickCount = 0;
let logoClickTimer = null;

// مدير الغرف والمزامنة والمعرض
const mp = new MultiplayerManager({
  onAuthReady() {},
  onMetaChange(meta) {
    if (!meta) return;
    const prevTemplate = state.templateId;
    const prevMode = state.mode;
    const prevPaper = state.paperId;

    state.mode = meta.mode || "sketch";
    state.templateId = meta.templateId || "floating_islands";
    state.splitLock = meta.splitLock !== undefined ? meta.splitLock : true;
    state.paperId = meta.paperId || "cream";

    updateModeUI();
    if (prevPaper !== state.paperId) {
      applyPaperTheme(state.paperId);
    }
    if (prevTemplate !== state.templateId || prevMode !== state.mode || prevPaper !== state.paperId) {
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
    if (!state.isReplaying) {
      redrawAllCompletedStrokes();
    }
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
    if (!state.isReplaying) {
      redrawLiveLayer();
    }
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
  onReactionReceived(reaction) {
    if (reaction && reaction.text) {
      showFloatingReaction(`${reaction.sender}: ${reaction.text}`);
    }
  },
  onWeeklyFeaturedChange(featuredMap) {
    state.weeklyFeatured = featuredMap || {};
    renderWeeklyGalleryUI();
    if (state.adminUnlocked) {
      renderAdminDashboardUI();
    }
  },
  onSubmissionsChange(subsMap) {
    state.submissions = subsMap || {};
    if (state.adminUnlocked) {
      renderAdminDashboardUI();
    }
  }
});

// تهيئة التطبيق
async function initApp() {
  els.playerNameInput.value = state.myName;
  populateTemplateSelect();
  populatePaperThemeSelect();
  renderBrushTools();
  renderPaletteTabs();
  renderPaletteSwatches();
  renderRecentSwatches();
  updateActiveColorUI(state.currentColor);
  applyPaperTheme(state.paperId);
  setupCanvasEvents();
  setupUIEvents();
  refreshTemplateLayer();

  await mp.init();

  const urlParams = new URLSearchParams(window.location.search);

  // فتح لوحة تحكم الأدمن إذا دخل عبر الرابط السري ?admin=1
  if (urlParams.get("admin") === "1") {
    openAdminModal();
  }

  const roomFromUrl = urlParams.get("room");
  if (roomFromUrl) {
    els.joinRoomCodeInput.value = roomFromUrl.toUpperCase();
    try {
      await handleJoinRoom(roomFromUrl.toUpperCase());
      els.lobbyModal.classList.add("hidden");
    } catch (err) {
      showToast(err.message || "تعذر الانضمام للغرفة", "error");
      els.lobbyModal.classList.remove("hidden");
    }
  } else if (urlParams.get("admin") !== "1") {
    els.lobbyModal.classList.remove("hidden");
  }
}

// ============================================================================
// القوائم والأدوات والألوان
// ============================================================================
function populateTemplateSelect() {
  els.templateSelect.innerHTML = "";
  for (const tpl of SKETCH_TEMPLATES) {
    const opt = document.createElement("option");
    opt.value = tpl.id;
    opt.textContent = tpl.title;
    els.templateSelect.appendChild(opt);
  }
  els.templateSelect.value = state.templateId;
}

function populatePaperThemeSelect() {
  els.paperThemeSelect.innerHTML = "";
  for (const paper of PAPER_THEMES) {
    const opt = document.createElement("option");
    opt.value = paper.id;
    opt.textContent = paper.name;
    els.paperThemeSelect.appendChild(opt);
  }
  els.paperThemeSelect.value = state.paperId;
}

function applyPaperTheme(paperId) {
  const paper = PAPER_THEMES.find((p) => p.id === paperId) || PAPER_THEMES[0];
  els.canvasWrapper.style.backgroundColor = paper.bg;
  els.canvasWrapper.style.backgroundImage = `radial-gradient(${paper.dot} 1px, transparent 0)`;
  els.paperThemeSelect.value = paper.id;
}

function renderBrushTools() {
  els.brushToolsList.innerHTML = "";
  const filtered = BRUSH_TOOLS.filter(
    (t) => state.toolCategory === "all" || t.category === state.toolCategory
  );

  for (const tool of filtered) {
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
      selectTool(tool.id);
    });
    els.brushToolsList.appendChild(btn);
  }
}

function selectTool(toolId) {
  const tool = BRUSH_TOOLS.find((t) => t.id === toolId) || BRUSH_TOOLS[0];
  state.currentTool = tool.id;
  state.brushSize = tool.defaultSize;
  state.brushOpacity = tool.defaultOpacity;

  els.brushSizeSlider.min = tool.minSize;
  els.brushSizeSlider.max = tool.maxSize;
  els.brushSizeSlider.value = state.brushSize;
  els.brushSizeVal.textContent = `${state.brushSize}px`;

  els.brushOpacitySlider.value = Math.round(state.brushOpacity * 100);
  els.brushOpacityVal.textContent = `${Math.round(state.brushOpacity * 100)}%`;

  renderBrushTools();
}

function getToolSVG(toolId) {
  const icons = {
    watercolor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z"/><path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7"/></svg>`,
    oil: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.06 11.9 17.13 3.84a2.82 2.82 0 0 1 4 4L13.06 15.9a2 2 0 0 1-1.42.59H9v-2.65a2 2 0 0 1 .59-1.42Z"/><path d="M7 16.5c-2.5 0-4.5 2-4.5 4.5h8c1.5 0 2.5-1 2.5-2.5 0-1.1-.9-2-2-2H7Z"/></svg>`,
    marker: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 4 5 5L8 21H3v-5L15 4z"/><path d="m12 7 5 5"/></svg>`,
    pastel: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="13" width="16" height="6" rx="2"/><path d="M7 13V8l5-4 5 4v5"/></svg>`,
    pencil: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>`,
    fineliner: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/></svg>`,
    calligraphy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 4 9 15"/><path d="m14 4 6 6"/><path d="M4 20l5-1 6-6-4-4-6 6-1 5z"/></svg>`,
    charcoal: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20 19 5"/><path d="M6 14 14 6"/><path d="M9 19 19 9"/></svg>`,
    airbrush: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="1"/><circle cx="10" cy="4" r="1"/><circle cx="4" cy="10" r="1"/><circle cx="9" cy="9" r="1"/><path d="M14 14l7 7"/><path d="M11 11l3 3"/></svg>`,
    neon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><circle cx="12" cy="12" r="4"/></svg>`,
    bucket: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z"/><path d="m5 2 5 5"/><path d="M2 13h15"/><path d="M22 20a2 2 0 1 1-4 0c0-1.6 1.7-2.4 2-4 .3 1.6 2 2.4 2 4Z"/></svg>`,
    line: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="20" x2="20" y2="4"/><circle cx="4" cy="20" r="2"/><circle cx="20" cy="4" r="2"/></svg>`,
    circle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg>`,
    rect: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/></svg>`,
    eyedropper: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m2 22 1-1h3l9-9"/><path d="M3 21v-3l9-9"/><path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z"/></svg>`,
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

function renderRecentSwatches() {
  els.recentSwatches.innerHTML = "";
  for (const hex of state.recentColors) {
    const sw = document.createElement("button");
    sw.type = "button";
    sw.className = "recent-swatch";
    sw.style.backgroundColor = hex;
    sw.title = hex;
    sw.addEventListener("click", () => selectColor(hex));
    els.recentSwatches.appendChild(sw);
  }
}

function selectColor(hex) {
  const cleanHex = hex.toUpperCase();
  state.currentColor = cleanHex;
  updateActiveColorUI(cleanHex);

  state.recentColors = [cleanHex, ...state.recentColors.filter((c) => c.toUpperCase() !== cleanHex)].slice(0, 8);
  renderRecentSwatches();

  document.querySelectorAll(".color-swatch").forEach((sw) => {
    sw.classList.toggle("active", sw.title.toUpperCase() === cleanHex);
  });

  if (state.currentTool === "eraser" || state.currentTool === "eyedropper") {
    selectTool("watercolor");
  }
}

function updateActiveColorUI(hex) {
  els.activeColorPreview.style.backgroundColor = hex;
  els.customColorPicker.value = hex;
  els.activeColorHex.textContent = hex.toUpperCase();
}

// ============================================================================
// محرك الرسم المتقدم، الأشكال، دلو التعبئة، والتناظر المرآوي
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
  return state.mySide === "left" ? pt.x <= midX + 5 : pt.x >= midX - 5;
}

function setupCanvasEvents() {
  const surface = els.liveCanvas;

  surface.addEventListener("pointerdown", async (ev) => {
    if (state.isReplaying) return;
    if (ev.button !== 0 && ev.pointerType === "mouse") return;
    const rawPt = getCanvasCoordinates(ev);

    // 1. أداة قطارة سحب اللون (Eyedropper)
    if (state.currentTool === "eyedropper") {
      const picked = pickColorAtPoint(Math.round(rawPt.x), Math.round(rawPt.y));
      selectColor(picked);
      showToast(`تم التقاط اللون ${picked}`, "info");
      return;
    }

    if (!isPointAllowedForPlayer(rawPt)) {
      const sideAr = state.mySide === "left" ? "الأيسر" : "الأيمن";
      showToast(`منطقتك الحالية هي النصف ${sideAr} (أو افتح قفل النصفين من الشريط العلوي)`, "info");
      return;
    }

    // 2. أداة دلو التعبئة الذكي (Flood Fill)
    if (state.currentTool === "bucket") {
      const pt = clampPointToPlayerZone(rawPt);
      const fillStroke = {
        tool: "bucket",
        color: state.currentColor,
        opacity: Number(state.brushOpacity),
        side: state.mySide,
        splitLocked: state.mode === "sketch" && state.splitLock,
        points: [[Math.round(pt.x), Math.round(pt.y)]]
      };
      state.redoStack = [];
      drawSingleStroke(mainCtx, fillStroke);
      await mp.pushCompletedStroke(fillStroke);
      return;
    }

    surface.setPointerCapture(ev.pointerId);
    state.isDrawing = true;
    state.redoStack = [];
    const pt = clampPointToPlayerZone(rawPt);
    state.currentPoints = [pt];

    redrawLiveLayer();
  });

  surface.addEventListener("pointermove", (ev) => {
    const rawPt = getCanvasCoordinates(ev);

    const now = performance.now();
    if (now - lastCursorSyncTime > 45) {
      lastCursorSyncTime = now;
      mp.updateCursor(rawPt.x, rawPt.y, state.currentColor, state.brushSize, state.currentTool);
    }

    if (!state.isDrawing) return;

    const pt = clampPointToPlayerZone(rawPt);

    // للأدوات الهندسية (خط، دائرة، مستطيل) نحتفظ بنقطة البداية والنهاية فقط
    if (isShapeTool(state.currentTool)) {
      state.currentPoints = [state.currentPoints[0], pt];
    } else {
      const prev = state.currentPoints[state.currentPoints.length - 1];
      const dist = Math.hypot(pt.x - prev.x, pt.y - prev.y);
      if (dist < 1.6) return;
      state.currentPoints.push(pt);
    }

    redrawLiveLayer();

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

function isShapeTool(toolId) {
  return toolId === "line" || toolId === "circle" || toolId === "rect";
}

function pickColorAtPoint(x, y) {
  const pixel = mainCtx.getImageData(x, y, 1, 1).data;
  if (pixel[3] < 15) {
    const paper = PAPER_THEMES.find((p) => p.id === state.paperId) || PAPER_THEMES[0];
    return paper.bg;
  }
  const toHex = (n) => n.toString(16).padStart(2, "0");
  return `#${toHex(pixel[0])}${toHex(pixel[1])}${toHex(pixel[2])}`.toUpperCase();
}

function buildCurrentStrokeObject() {
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
    symmetry: state.symmetryMode && (!state.splitLock || state.mode === "free"),
    splitLocked: state.mode === "sketch" && state.splitLock,
    points: compactPoints
  };
}

// رسم خط أو شكل هندسي أو دلو تعبئة
function drawSingleStroke(ctx, stroke) {
  if (!stroke || !stroke.points || stroke.points.length === 0) return;

  if (stroke.tool === "bucket") {
    executeSmartFloodFill(ctx, stroke);
    return;
  }

  renderStrokeGeometry(ctx, stroke, false);

  // إذا كان وضع التناظر المرآوي مفعلاً، نرسم نسخة معكوسة حول محور اللوحة (X = 600)
  if (stroke.symmetry) {
    renderStrokeGeometry(ctx, stroke, true);
  }
}

function renderStrokeGeometry(ctx, stroke, mirrorX = false) {
  const width = ctx.canvas.width;
  const pts = stroke.points.map((p) => {
    const rawX = Array.isArray(p) ? p[0] : p.x;
    const rawY = Array.isArray(p) ? p[1] : p.y;
    return {
      x: mirrorX ? width - rawX : rawX,
      y: rawY
    };
  });

  const tool = stroke.tool || "watercolor";
  const size = stroke.size || 12;
  const opacity = stroke.opacity ?? 0.85;
  const color = stroke.color || "#000000";

  ctx.save();

  if (stroke.splitLocked && stroke.side && !stroke.symmetry) {
    ctx.beginPath();
    const midX = width / 2;
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
    ctx.globalAlpha = opacity * 0.46;
    ctx.strokeStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = size * 0.5;
  } else if (tool === "pastel") {
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = opacity * 0.75;
    ctx.strokeStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = size * 0.18;
    ctx.setLineDash([size * 0.25, size * 0.08]);
  } else if (tool === "charcoal") {
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = opacity * 0.68;
    ctx.strokeStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = size * 0.35;
  } else if (tool === "airbrush") {
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = opacity * 0.28;
    ctx.strokeStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = size * 0.9;
  } else if (tool === "neon") {
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = Math.max(2, size * 0.45);
    ctx.shadowColor = color;
    ctx.shadowBlur = size * 1.3;
  } else if (tool === "pencil") {
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = opacity * 0.84;
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
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = color;
  }

  // 1. أداة ريشة الخط العربي المائلة (Calligraphy)
  if (tool === "calligraphy" && pts.length > 1) {
    ctx.fillStyle = color;
    const angle = -Math.PI / 5;
    const dx = Math.cos(angle) * (size * 0.65);
    const dy = Math.sin(angle) * (size * 0.65);
    for (let i = 0; i < pts.length - 1; i++) {
      ctx.beginPath();
      ctx.moveTo(pts[i].x - dx, pts[i].y - dy);
      ctx.lineTo(pts[i].x + dx, pts[i].y + dy);
      ctx.lineTo(pts[i + 1].x + dx, pts[i + 1].y + dy);
      ctx.lineTo(pts[i + 1].x - dx, pts[i + 1].y - dy);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
    return;
  }

  // 2. أدوات الأشكال الهندسية (Line / Circle / Rect)
  if (tool === "line" && pts.length >= 2) {
    const start = pts[0];
    const end = pts[pts.length - 1];
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    ctx.restore();
    return;
  }

  if (tool === "circle" && pts.length >= 2) {
    const start = pts[0];
    const end = pts[pts.length - 1];
    const rx = Math.abs(end.x - start.x) / 2;
    const ry = Math.abs(end.y - start.y) / 2;
    const cx = (start.x + end.x) / 2;
    const cy = (start.y + end.y) / 2;
    ctx.beginPath();
    ctx.ellipse(cx, cy, Math.max(1, rx), Math.max(1, ry), 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    return;
  }

  if (tool === "rect" && pts.length >= 2) {
    const start = pts[0];
    const end = pts[pts.length - 1];
    ctx.beginPath();
    ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
    ctx.restore();
    return;
  }

  // 3. المسارات الحرة المنعمة
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

// خوارزمية دلو التعبئة الذكي مع مراعاة خطوط التخطيط الرصاص ونصف اللاعب
function executeSmartFloodFill(ctx, stroke) {
  const pt = stroke.points?.[0];
  if (!pt) return;
  const startX = Math.round(Array.isArray(pt) ? pt[0] : pt.x);
  const startY = Math.round(Array.isArray(pt) ? pt[1] : pt.y);
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  if (startX < 0 || startX >= w || startY < 0 || startY >= h) return;

  // تحديد حدود النصف المسموح به
  let minX = 0;
  let maxX = w - 1;
  if (stroke.splitLocked && stroke.side === "left") maxX = Math.floor(w / 2) - 1;
  if (stroke.splitLocked && stroke.side === "right") minX = Math.floor(w / 2);

  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  // قراءة طبقة التخطيط بالرصاص لاعتبار خطوطها حدوداً مغلقة أثناء التعبئة
  let sketchData = null;
  if (state.mode === "sketch" && state.showSketchOverlay) {
    sketchData = els.sketchCanvas.getContext("2d").getImageData(0, 0, w, h).data;
  }

  const fillRGB = hexToRgb(stroke.color || "#E76F51");
  const fillA = Math.round((stroke.opacity ?? 0.9) * 255);

  const startIdx = (startY * w + startX) * 4;
  const targetR = data[startIdx];
  const targetG = data[startIdx + 1];
  const targetB = data[startIdx + 2];
  const targetA = data[startIdx + 3];

  if (
    Math.abs(targetR - fillRGB.r) < 5 &&
    Math.abs(targetG - fillRGB.g) < 5 &&
    Math.abs(targetB - fillRGB.b) < 5 &&
    Math.abs(targetA - fillA) < 15
  ) {
    return;
  }

  const visited = new Uint8Array(w * h);
  const stack = [startX, startY];
  const tolerance = 42;

  const matchesStart = (pxIdx) => {
    const i = pxIdx * 4;
    if (sketchData && sketchData[i + 3] > 55) return false;
    return (
      Math.abs(data[i] - targetR) <= tolerance &&
      Math.abs(data[i + 1] - targetG) <= tolerance &&
      Math.abs(data[i + 2] - targetB) <= tolerance &&
      Math.abs(data[i + 3] - targetA) <= tolerance
    );
  };

  while (stack.length > 0) {
    const y = stack.pop();
    const x = stack.pop();
    const pxIdx = y * w + x;
    if (visited[pxIdx]) continue;
    visited[pxIdx] = 1;

    const i = pxIdx * 4;
    data[i] = fillRGB.r;
    data[i + 1] = fillRGB.g;
    data[i + 2] = fillRGB.b;
    data[i + 3] = fillA;

    if (x > minX && !visited[pxIdx - 1] && matchesStart(pxIdx - 1)) stack.push(x - 1, y);
    if (x < maxX && !visited[pxIdx + 1] && matchesStart(pxIdx + 1)) stack.push(x + 1, y);
    if (y > 0 && !visited[pxIdx - w] && matchesStart(pxIdx - w)) stack.push(x, y - 1);
    if (y < h - 1 && !visited[pxIdx + w] && matchesStart(pxIdx + w)) stack.push(x, y + 1);
  }

  ctx.putImageData(imgData, 0, 0);
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
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

  for (const remoteStroke of Object.values(state.liveStrokes)) {
    if (remoteStroke.tool !== "eraser" && remoteStroke.tool !== "bucket") {
      drawSingleStroke(liveCtx, remoteStroke);
    }
  }

  if (state.isDrawing && state.currentPoints.length > 0) {
    const myStroke = buildCurrentStrokeObject();
    if (myStroke.tool === "eraser") {
      drawSingleStroke(mainCtx, myStroke);
    } else {
      drawSingleStroke(liveCtx, myStroke);
    }
  }
}

function refreshTemplateLayer() {
  if (state.mode === "sketch" && state.showSketchOverlay) {
    renderPencilTemplate(els.sketchCanvas, state.templateId, state.splitLock, state.paperId);
    els.templateSelect.value = state.templateId;
  } else {
    const sCtx = els.sketchCanvas.getContext("2d");
    sCtx.clearRect(0, 0, els.sketchCanvas.width, els.sketchCanvas.height);
  }
  updateSplitZonesUI();
}

// ============================================================================
// إعادة عرض خطوات الرسم (Time-lapse Replay)
// ============================================================================
async function playTimelapseReplay() {
  const ordered = Object.values(state.allStrokes).sort(
    (a, b) => (a.timestamp || 0) - (b.timestamp || 0)
  );
  if (ordered.length === 0) {
    showToast("ارسم بعض الخطوط أولاً لتشغيل العرض السريع!", "info");
    return;
  }

  state.isReplaying = true;
  els.replayBtn.disabled = true;
  mainCtx.clearRect(0, 0, els.mainCanvas.width, els.mainCanvas.height);
  liveCtx.clearRect(0, 0, els.liveCanvas.width, els.liveCanvas.height);

  const delay = Math.max(18, Math.min(90, Math.floor(2500 / ordered.length)));
  for (const st of ordered) {
    drawSingleStroke(mainCtx, st);
    await new Promise((r) => setTimeout(r, delay));
  }

  state.isReplaying = false;
  els.replayBtn.disabled = false;
  redrawAllCompletedStrokes();
  showToast("اكتمل عرض مراحل رسم اللوحة!", "success");
}

// ============================================================================
// تحديث واجهة الأنماط، اللاعبين، والتقدم
// ============================================================================
function updateModeUI() {
  const isSketch = state.mode === "sketch";
  els.modeSketchBtn.classList.toggle("active", isSketch);
  els.modeFreeBtn.classList.toggle("active", !isSketch);
  els.templateControls.classList.toggle("hidden", !isSketch);

  els.toggleSplitLockBtn.classList.toggle("active", state.splitLock);
  els.toggleSplitLockBtn.textContent = state.splitLock
    ? "قفل النصفين: مفعّل"
    : "قفل النصفين: مفتوح";

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
    els.player2Name.textContent = "بانتظار شريكك...";
    els.player2Status.textContent = "شارك رابط الدعوة لينضم معك";
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
    tag.textContent = cur.name || "شريكك";

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
    const weight = s.tool === "bucket" ? 95 : (s.points || []).length;
    if (s.side === "right") {
      rightScore += weight;
    } else {
      leftScore += weight;
    }
  }
  const leftPct = Math.min(100, Math.round((leftScore / 350) * 100));
  const rightPct = Math.min(100, Math.round((rightScore / 350) * 100));
  els.progressFillLeft.style.width = `${leftPct}%`;
  els.progressFillRight.style.width = `${rightPct}%`;
}

// ============================================================================
// توليد صورة اللوحة المدمجة للحفظ أو الإرسال لمسابقة لوحة الأسبوع
// ============================================================================
function generateCompositeDataUrl(maxWidth = 1200, quality = 0.92) {
  const scale = maxWidth / els.mainCanvas.width;
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = Math.round(els.mainCanvas.width * scale);
  exportCanvas.height = Math.round(els.mainCanvas.height * scale);
  const exCtx = exportCanvas.getContext("2d");

  exCtx.scale(scale, scale);

  const paper = PAPER_THEMES.find((p) => p.id === state.paperId) || PAPER_THEMES[0];
  exCtx.fillStyle = paper.bg;
  exCtx.fillRect(0, 0, els.mainCanvas.width, els.mainCanvas.height);

  exCtx.drawImage(els.mainCanvas, 0, 0);

  if (state.mode === "sketch" && state.showSketchOverlay) {
    const tempSketch = document.createElement("canvas");
    tempSketch.width = els.mainCanvas.width;
    tempSketch.height = els.mainCanvas.height;
    renderPencilTemplate(tempSketch, state.templateId, false, state.paperId);
    exCtx.drawImage(tempSketch, 0, 0);
  }

  const playerNames = Object.values(state.players)
    .map((p) => p.name)
    .filter(Boolean)
    .join(" & ");
  if (playerNames) {
    exCtx.save();
    exCtx.font = "700 16px 'Tajawal', sans-serif";
    exCtx.fillStyle = state.paperId === "night" ? "rgba(255,255,255,0.65)" : "rgba(75, 65, 55, 0.65)";
    exCtx.textAlign = "left";
    exCtx.fillText(`بريشة: ${playerNames}`, 24, els.mainCanvas.height - 20);
    exCtx.restore();
  }

  return maxWidth < 1200
    ? exportCanvas.toDataURL("image/jpeg", quality)
    : exportCanvas.toDataURL("image/png");
}

function exportArtworkImage() {
  const dataUrl = generateCompositeDataUrl(1200);
  const link = document.createElement("a");
  const fileName = `duo-art-${state.roomId || "studio"}-${Date.now().toString().slice(-4)}.png`;
  link.download = fileName;
  link.href = dataUrl;
  link.click();
  showToast("تم حفظ اللوحة بجودة أصلية فائقة!", "success");
}

// ============================================================================
// معرض "لوحة الأسبوع" + إرسال اللوحات + لوحة تحكم الأدمن السرية
// ============================================================================
function renderWeeklyGalleryUI() {
  const entries = Object.entries(state.weeklyFeatured || {}).sort(
    (a, b) => (b[1].featuredAt || 0) - (a[1].featuredAt || 0)
  );

  if (entries.length === 0) {
    els.weeklyHeroContainer.innerHTML = `
      <div class="empty-gallery-banner">
        <h3>قائمة لوحة الأسبوع مفتوحة الآن!</h3>
        <p>ارسم مع صديقك وأرسل لوحتكما عبر زر "ترشيح لرسمة الأسبوع" لتظهر هنا كأفضل لوحة أسبوعية.</p>
      </div>
    `;
    els.weeklyGridContainer.innerHTML = "";
    return;
  }

  const [topId, topArt] = entries[0];
  els.weeklyHeroContainer.innerHTML = `
    <div class="weekly-winner-card">
      <div class="winner-preview-wrap">
        <span class="winner-crown-badge">${escapeHtml(topArt.badge || "لوحة الأسبوع الفائزة")}</span>
        <img src="${topArt.imageDataUrl}" alt="${escapeHtml(topArt.title)}" class="winner-img" />
      </div>
      <div class="winner-details">
        <span class="winner-tag">المركز الأول هذا الأسبوع</span>
        <h3>${escapeHtml(topArt.title)}</h3>
        <p class="winner-artists">بريشة الثنائي: <strong>${escapeHtml(topArt.artists)}</strong></p>
        <p class="winner-meta">${escapeHtml(topArt.templateTitle || "إبداع مشترك")}</p>
        <div class="winner-actions">
          <button type="button" class="btn btn-primary like-feat-btn" data-id="${topId}" data-likes="${topArt.likes || 0}">
            إعجاب باللوحة (${topArt.likes || 0})
          </button>
        </div>
      </div>
    </div>
  `;

  els.weeklyGridContainer.innerHTML = "";
  for (const [id, item] of entries.slice(1)) {
    const card = document.createElement("div");
    card.className = "gallery-card";
    card.innerHTML = `
      <div class="gallery-img-wrap">
        <span class="gallery-badge">${escapeHtml(item.badge || "مميزة")}</span>
        <img src="${item.imageDataUrl}" alt="${escapeHtml(item.title)}" />
      </div>
      <div class="gallery-card-body">
        <h4>${escapeHtml(item.title)}</h4>
        <span class="gallery-artists">${escapeHtml(item.artists)}</span>
        <div class="gallery-card-footer">
          <button type="button" class="btn like-feat-btn" data-id="${id}" data-likes="${item.likes || 0}">
            إعجاب (${item.likes || 0})
          </button>
        </div>
      </div>
    `;
    els.weeklyGridContainer.appendChild(card);
  }

  document.querySelectorAll(".like-feat-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const likes = Number(btn.dataset.likes || 0);
      mp.likeFeaturedArtwork(id, likes);
    });
  });
}

function openSubmitArtworkModal() {
  if (Object.keys(state.allStrokes).length === 0) {
    showToast("اللوحة فارغة حالياً! ارسموا شيئاً جميلاً أولاً قبل إرسالها.", "warning");
    return;
  }
  const previewUrl = generateCompositeDataUrl(800, 0.85);
  els.submitPreviewImg.src = previewUrl;

  const names = Object.values(state.players)
    .map((p) => p.name)
    .filter(Boolean)
    .join(" & ");
  els.submitArtistsInput.value = names || state.myName;

  const tpl = SKETCH_TEMPLATES.find((t) => t.id === state.templateId);
  els.submitTitleInput.value = state.mode === "sketch" && tpl ? tpl.title : "لوحة إبداعية مشتركة";
  els.submitArtworkModal.classList.remove("hidden");
}

// لوحة تحكم الأدمن السرية
function openAdminModal() {
  els.adminModal.classList.remove("hidden");
  if (state.adminUnlocked) {
    els.adminLoginSection.classList.add("hidden");
    els.adminDashboardSection.classList.remove("hidden");
    els.adminCloudConfigTextarea.value = JSON.stringify(getActiveCloudConfig(), null, 2);
    renderAdminDashboardUI();
  } else {
    els.adminLoginSection.classList.remove("hidden");
    els.adminDashboardSection.classList.add("hidden");
    els.adminPinInput.focus();
  }
}

function renderAdminDashboardUI() {
  // 1. اللوحات المرسلة من اللاعبين بانتظار المراجعة
  const subEntries = Object.entries(state.submissions || {}).sort(
    (a, b) => (b[1].createdAt || 0) - (a[1].createdAt || 0)
  );
  els.adminSubmissionsGrid.innerHTML = "";

  if (subEntries.length === 0) {
    els.adminSubmissionsGrid.innerHTML = `<p style="color:var(--text-secondary); font-size:0.86rem;">لا توجد رسمات مرسلة حالياً في صندوق المراجعة.</p>`;
  } else {
    for (const [subId, sub] of subEntries) {
      const card = document.createElement("div");
      card.className = "admin-art-card";
      card.innerHTML = `
        <img src="${sub.imageDataUrl}" alt="${escapeHtml(sub.title)}" />
        <div class="admin-art-info">
          <h4>${escapeHtml(sub.title)}</h4>
          <span>الفنانون: ${escapeHtml(sub.artists)}</span>
          <div class="admin-art-actions">
            <button type="button" class="btn btn-primary promote-btn" data-id="${subId}">
              تعيين كلوحة الأسبوع
            </button>
            <a href="${sub.imageDataUrl}" download="submission-${subId}.jpg" class="btn">تحميل</a>
            <button type="button" class="btn delete-sub-btn" data-id="${subId}" style="color:#C94A4A;">
              حذف
            </button>
          </div>
        </div>
      `;
      els.adminSubmissionsGrid.appendChild(card);
    }
  }

  // 2. اللوحات المعروضة حالياً في قائمة لوحة الأسبوع
  const featEntries = Object.entries(state.weeklyFeatured || {}).sort(
    (a, b) => (b[1].featuredAt || 0) - (a[1].featuredAt || 0)
  );
  els.adminFeaturedGrid.innerHTML = "";

  if (featEntries.length === 0) {
    els.adminFeaturedGrid.innerHTML = `<p style="color:var(--text-secondary); font-size:0.86rem;">لم يتم تعيين لوحة الأسبوع بعد.</p>`;
  } else {
    for (const [featId, feat] of featEntries) {
      const card = document.createElement("div");
      card.className = "admin-art-card";
      card.innerHTML = `
        <img src="${feat.imageDataUrl}" alt="${escapeHtml(feat.title)}" />
        <div class="admin-art-info">
          <h4>${escapeHtml(feat.title)}</h4>
          <span>${escapeHtml(feat.artists)} • الإعجابات: ${feat.likes || 0}</span>
          <div class="admin-art-actions">
            <button type="button" class="btn remove-feat-btn" data-id="${featId}" style="color:#C94A4A;">
              إزالة من قائمة الأسبوع
            </button>
          </div>
        </div>
      `;
      els.adminFeaturedGrid.appendChild(card);
    }
  }

  // ربط أزرار الأدمن
  els.adminSubmissionsGrid.querySelectorAll(".promote-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const item = state.submissions[id];
      if (!item) return;
      await mp.promoteSubmissionToWeeklyFeatured(id, item, "لوحة الأسبوع الفائزة");
      showToast("تم نشر اللوحة في قائمة لوحة الأسبوع لجميع الزوار!", "success");
    });
  });

  els.adminSubmissionsGrid.querySelectorAll(".delete-sub-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      await mp.deleteGalleryItem("submissions", id);
      showToast("تم حذف اللوحة من المرسلات", "info");
    });
  });

  els.adminFeaturedGrid.querySelectorAll(".remove-feat-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      await mp.deleteGalleryItem("weeklyFeatured", id);
      showToast("تمت إزالة اللوحة من العرض الأسبوعي", "info");
    });
  });
}

// ============================================================================
// إدارة الغرف، الأحداث، والاختصارات
// ============================================================================
async function handleCreateRoom() {
  const playerName = els.playerNameInput.value.trim() || "فنان 1";
  state.myName = playerName;
  localStorage.setItem("duo_art_player_name", playerName);

  const selectedMode = els.lobbyInitialMode.value || "sketch";
  const randomTpl = SKETCH_TEMPLATES[Math.floor(Math.random() * SKETCH_TEMPLATES.length)].id;

  try {
    const res = await mp.createRoom({
      playerName,
      mode: selectedMode,
      templateId: randomTpl,
      splitLock: true,
      paperId: state.paperId
    });
    onRoomJoinedSuccess(res.roomId, res.playerSide);
    els.lobbyModal.classList.add("hidden");
  } catch (err) {
    showToast(err.message || "تعذر إنشاء الغرفة", "error");
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
  newUrl.searchParams.delete("admin");
  window.history.replaceState({}, "", newUrl.toString());

  const sideText = side === "left" ? "النصف الأيسر" : "النصف الأيمن";
  showToast(`أهلاً بك في الغرفة (${roomId}) — منطقتك: ${sideText}`, "success");
}

function setCanvasZoom(newZoom) {
  state.zoomLevel = Math.max(1, Math.min(2.4, Math.round(newZoom * 100) / 100));
  els.canvasWrapper.style.transform = `scale(${state.zoomLevel})`;
  els.zoomResetBtn.textContent = `${Math.round(state.zoomLevel * 100)}%`;
}

function setupUIEvents() {
  // البوابة السرية للأدمن: 5 ضغطات متتالية على شعار الموقع
  els.brandLogoTrigger.addEventListener("click", () => {
    logoClickCount++;
    clearTimeout(logoClickTimer);
    logoClickTimer = setTimeout(() => {
      logoClickCount = 0;
    }, 1800);
    if (logoClickCount >= 5) {
      logoClickCount = 0;
      openAdminModal();
    }
  });

  // تصنيفات الأدوات
  els.toolCatBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      state.toolCategory = btn.dataset.cat || "all";
      els.toolCatBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderBrushTools();
    });
  });

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

  // تبديل النمط
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

  // اختيار قالب محدد أو عشوائي
  els.templateSelect.addEventListener("change", (e) => {
    const chosenId = e.target.value;
    state.templateId = chosenId;
    const tpl = SKETCH_TEMPLATES.find((t) => t.id === chosenId);
    if (tpl?.suggestedPalette && COLOR_PALETTES[tpl.suggestedPalette]) {
      state.activePaletteKey = tpl.suggestedPalette;
      renderPaletteTabs();
      renderPaletteSwatches();
    }
    refreshTemplateLayer();
    mp.updateRoomMeta({ templateId: chosenId, mode: "sketch" });
  });

  els.randomTemplateBtn.addEventListener("click", () => {
    const others = SKETCH_TEMPLATES.filter((t) => t.id !== state.templateId);
    const next = others[Math.floor(Math.random() * others.length)] || SKETCH_TEMPLATES[0];
    state.templateId = next.id;
    els.templateSelect.value = next.id;
    if (next.suggestedPalette && COLOR_PALETTES[next.suggestedPalette]) {
      state.activePaletteKey = next.suggestedPalette;
      renderPaletteTabs();
      renderPaletteSwatches();
    }
    refreshTemplateLayer();
    mp.updateRoomMeta({ templateId: next.id, mode: "sketch" });
    showToast(`تم اختيار تخطيط: ${next.title}`, "info");
  });

  // تغيير نوع ورق الرسم
  els.paperThemeSelect.addEventListener("change", (e) => {
    state.paperId = e.target.value;
    applyPaperTheme(state.paperId);
    refreshTemplateLayer();
    mp.updateRoomMeta({ paperId: state.paperId });
  });

  // قفل/فتح النصفين، إظهار التخطيط، والتناظر المرآوي
  els.toggleSplitLockBtn.addEventListener("click", () => {
    state.splitLock = !state.splitLock;
    updateModeUI();
    mp.updateRoomMeta({ splitLock: state.splitLock });
  });

  els.toggleSketchVisBtn.addEventListener("click", () => {
    state.showSketchOverlay = !state.showSketchOverlay;
    els.toggleSketchVisBtn.classList.toggle("active", state.showSketchOverlay);
    refreshTemplateLayer();
  });

  els.toggleSymmetryBtn.addEventListener("click", () => {
    state.symmetryMode = !state.symmetryMode;
    els.toggleSymmetryBtn.classList.toggle("active", state.symmetryMode);
    if (state.symmetryMode && state.splitLock && state.mode === "sketch") {
      state.splitLock = false;
      updateModeUI();
      mp.updateRoomMeta({ splitLock: false });
    }
    showToast(
      state.symmetryMode ? "تم تفعيل الرسم المتناظر المرآوي!" : "تم إيقاف الرسم المتناظر",
      "info"
    );
  });

  // التكبير والتصغير والعرض السريع
  els.zoomInBtn.addEventListener("click", () => setCanvasZoom(state.zoomLevel + 0.25));
  els.zoomOutBtn.addEventListener("click", () => setCanvasZoom(state.zoomLevel - 0.25));
  els.zoomResetBtn.addEventListener("click", () => setCanvasZoom(1));
  els.replayBtn.addEventListener("click", playTimelapseReplay);

  // ردود الفعل السريعة بين الشريكين
  els.reactionBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      mp.sendQuickReaction(btn.dataset.msg);
    });
  });

  // التراجع والإعادة والمسح والحفظ
  els.undoBtn.addEventListener("click", async () => {
    const undoneStroke = await mp.undoMyLastStroke(state.allStrokes);
    if (undoneStroke) {
      state.redoStack.push(undoneStroke);
    } else {
      showToast("لا توجد خطوط سابقة للتراجع عنها", "info");
    }
  });

  els.redoBtn.addEventListener("click", async () => {
    if (state.redoStack.length === 0) {
      showToast("لا توجد خطوة للإعادة", "info");
      return;
    }
    const strokeToRestore = state.redoStack.pop();
    drawSingleStroke(mainCtx, strokeToRestore);
    await mp.pushCompletedStroke(strokeToRestore);
  });

  els.clearMySideBtn.addEventListener("click", async () => {
    await mp.clearMyStrokes(state.allStrokes);
    showToast("تم مسح خطوطك من اللوحة", "info");
  });

  els.saveArtworkBtn.addEventListener("click", exportArtworkImage);

  // نسخ رابط الغرفة
  els.copyRoomLinkBtn.addEventListener("click", async () => {
    if (!state.roomId) {
      els.lobbyModal.classList.remove("hidden");
      return;
    }
    const shareUrl = `${window.location.origin}${window.location.pathname}?room=${state.roomId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast("تم نسخ رابط الدعوة! أرسله لصديقك ليدخل معك فوراً", "success");
    } catch (_) {
      prompt("انسخ رابط الغرفة وشاركه مع صديقك:", shareUrl);
    }
  });

  // نافذة الغرف
  els.openLobbyBtn.addEventListener("click", () => els.lobbyModal.classList.remove("hidden"));
  els.closeLobbyModalBtn.addEventListener("click", () => els.lobbyModal.classList.add("hidden"));
  els.createRoomBtn.addEventListener("click", handleCreateRoom);
  els.joinRoomBtn.addEventListener("click", () => {
    handleJoinRoom().catch((err) => showToast(err.message, "error"));
  });

  // نافذة معرض لوحة الأسبوع
  els.openWeeklyGalleryBtn.addEventListener("click", () => {
    renderWeeklyGalleryUI();
    els.weeklyGalleryModal.classList.remove("hidden");
  });
  els.closeWeeklyGalleryBtn.addEventListener("click", () => {
    els.weeklyGalleryModal.classList.add("hidden");
  });

  // نافذة إرسال اللوحة لرسمة الأسبوع
  els.openSubmitArtworkBtn.addEventListener("click", openSubmitArtworkModal);
  els.closeSubmitArtworkBtn.addEventListener("click", () => {
    els.submitArtworkModal.classList.add("hidden");
  });
  els.confirmSubmitArtworkBtn.addEventListener("click", async () => {
    const title = els.submitTitleInput.value.trim() || "لوحة ثنائية مشتركة";
    const artists = els.submitArtistsInput.value.trim() || state.myName;
    const imageDataUrl = els.submitPreviewImg.src;
    const tpl = SKETCH_TEMPLATES.find((t) => t.id === state.templateId);

    els.confirmSubmitArtworkBtn.disabled = true;
    try {
      await mp.submitArtworkForWeeklyReview({
        title,
        artists,
        imageDataUrl,
        mode: state.mode,
        templateTitle: state.mode === "sketch" && tpl ? tpl.title : "مرسم حر كامل"
      });
      els.submitArtworkModal.classList.add("hidden");
      showToast("تم إرسال لوحتكما بنجاح لمسابقة لوحة الأسبوع!", "success");
    } catch (err) {
      showToast("تعذر الإرسال: " + err.message, "error");
    } finally {
      els.confirmSubmitArtworkBtn.disabled = false;
    }
  });

  // نافذة لوحة تحكم الأدمن السرية
  els.closeAdminModalBtn.addEventListener("click", () => {
    els.adminModal.classList.add("hidden");
  });
  els.adminLoginBtn.addEventListener("click", () => {
    const entered = els.adminPinInput.value.trim();
    if (entered === getAdminPin()) {
      state.adminUnlocked = true;
      sessionStorage.setItem("duo_art_admin_auth", "1");
      openAdminModal();
      showToast("مرحباً بك في لوحة تحكم الإدارة", "success");
    } else {
      showToast("رمز الدخول غير صحيح", "error");
    }
  });

  els.adminSavePinBtn.addEventListener("click", () => {
    const newPin = els.adminNewPinInput.value.trim();
    if (newPin.length < 4) {
      showToast("اختر رمزاً من 4 خانات على الأقل", "warning");
      return;
    }
    localStorage.setItem(ADMIN_PIN_STORAGE_KEY, newPin);
    els.adminNewPinInput.value = "";
    showToast("تم تحديث رمز دخول المشرف بنجاح", "success");
  });

  els.adminSaveCloudConfigBtn.addEventListener("click", async () => {
    const rawText = els.adminCloudConfigTextarea.value.trim();
    try {
      const cleaned = rawText
        .replace(/const\s+firebaseConfig\s*=\s*/, "")
        .replace(/;$/, "")
        .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2":');
      const parsed = JSON.parse(cleaned);
      if (!parsed.apiKey || !parsed.databaseURL) {
        throw new Error("تأكد من تضمين apiKey و databaseURL");
      }
      saveCustomCloudConfig(parsed);
      showToast("تم حفظ إعدادات الربط السحابي وتنشيط الاتصال!", "success");
      await mp.init();
      if (state.roomId) {
        await handleJoinRoom(state.roomId);
      }
    } catch (err) {
      showToast("صيغة غير صحيحة: " + err.message, "error");
    }
  });

  // اختصارات لوحة المفاتيح الاحترافية
  window.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
      e.preventDefault();
      els.undoBtn.click();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
      e.preventDefault();
      els.redoBtn.click();
    } else if (e.key === "[") {
      state.brushSize = Math.max(1, state.brushSize - 3);
      els.brushSizeSlider.value = state.brushSize;
      els.brushSizeVal.textContent = `${state.brushSize}px`;
    } else if (e.key === "]") {
      state.brushSize = Math.min(120, state.brushSize + 3);
      els.brushSizeSlider.value = state.brushSize;
      els.brushSizeVal.textContent = `${state.brushSize}px`;
    }
  });
}

function showFloatingReaction(text) {
  const pill = document.createElement("div");
  pill.className = "floating-reaction";
  pill.textContent = text;
  els.canvasViewport.appendChild(pill);
  setTimeout(() => pill.remove(), 3200);
}

function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  els.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("fade-out");
    setTimeout(() => toast.remove(), 300);
  }, 3400);
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

initApp();
