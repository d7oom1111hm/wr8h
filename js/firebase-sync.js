// محرك الاتصال الجماعي اللحظي وإدارة معرض "لوحة الأسبوع" ولوحة الإدارة

import { initializeApp, getApps, deleteApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  get,
  remove,
  onDisconnect,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

// ============================================================================
// إعدادات اتصال قاعدة البيانات السحابية للمشروع
// ============================================================================
export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const STORAGE_CONFIG_KEY = "duo_art_cloud_config_v2";
const SUBMISSIONS_LOCAL_KEY = "duo_art_submissions_store_v1";
const FEATURED_LOCAL_KEY = "duo_art_weekly_featured_v1";

export function getActiveCloudConfig() {
  try {
    const saved = localStorage.getItem(STORAGE_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.apiKey && parsed.databaseURL) {
        return parsed;
      }
    }
  } catch (_) {}
  return DEFAULT_FIREBASE_CONFIG;
}

export function saveCustomCloudConfig(configObj) {
  localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(configObj));
}

export function isCloudConfigured(cfg = getActiveCloudConfig()) {
  return (
    cfg &&
    cfg.apiKey &&
    cfg.databaseURL &&
    !cfg.apiKey.includes("YOUR_API_KEY") &&
    !cfg.databaseURL.includes("YOUR_PROJECT_ID")
  );
}

export class MultiplayerManager {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.app = null;
    this.auth = null;
    this.db = null;
    this.uid = null;
    this.roomId = null;
    this.playerSide = "left";
    this.playerName = "فنان 1";
    this.unsubscribers = [];
    this.globalUnsubscribers = [];
    this.useLocalBus = false;
    this.localChannel = null;
    this.globalChannel = new BroadcastChannel("duo_art_global_gallery_bus");
  }

  async init() {
    const config = getActiveCloudConfig();
    if (!isCloudConfigured(config)) {
      this.enableInstantLocalSync();
      this.subscribeGlobalFeeds();
      return { ready: true, uid: this.uid };
    }

    try {
      const existingApps = getApps();
      for (const a of existingApps) {
        await deleteApp(a);
      }

      this.app = initializeApp(config);
      this.auth = getAuth(this.app);
      this.db = getDatabase(this.app);
      this.useLocalBus = false;

      const user = await new Promise((resolve, reject) => {
        const unsub = onAuthStateChanged(
          this.auth,
          (u) => {
            if (u) {
              unsub();
              resolve(u);
            }
          },
          (err) => reject(err)
        );
        signInAnonymously(this.auth).catch(reject);
      });

      this.uid = user.uid;
      this.callbacks.onAuthReady?.(this.uid);
      this.subscribeGlobalFeeds();
      return { ready: true, uid: this.uid };
    } catch (_) {
      this.enableInstantLocalSync();
      this.subscribeGlobalFeeds();
      return { ready: true, uid: this.uid };
    }
  }

  enableInstantLocalSync() {
    this.useLocalBus = true;
    let tabUid = sessionStorage.getItem("duo_art_session_uid");
    if (!tabUid) {
      tabUid = "u_" + Math.random().toString(36).substring(2, 10);
      sessionStorage.setItem("duo_art_session_uid", tabUid);
    }
    this.uid = tabUid;
    this.callbacks.onAuthReady?.(this.uid);
  }

  generateRoomCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  async createRoom({ playerName, mode, templateId, splitLock, paperId }) {
    const code = this.generateRoomCode();
    return this.joinRoom({
      roomId: code,
      playerName,
      initialMeta: {
        mode: mode || "sketch",
        templateId: templateId || "floating_islands",
        splitLock: splitLock !== undefined ? splitLock : true,
        paperId: paperId || "cream"
      },
      isCreating: true
    });
  }

  async joinRoom({ roomId, playerName, initialMeta = null, isCreating = false }) {
    this.leaveRoom();
    const cleanCode = roomId.trim().toUpperCase();
    this.roomId = cleanCode;
    this.playerName = playerName?.trim() || "فنان";

    if (this.useLocalBus) {
      return this.joinLocalBusRoom(cleanCode, initialMeta, isCreating);
    }

    const roomRef = ref(this.db, `rooms/${cleanCode}`);
    const playersRef = ref(this.db, `rooms/${cleanCode}/players`);
    const metaRef = ref(this.db, `rooms/${cleanCode}/meta`);

    const snapshot = await get(roomRef);
    const roomData = snapshot.val();

    if (!roomData && !isCreating && !initialMeta) {
      initialMeta = {
        mode: "sketch",
        templateId: "floating_islands",
        splitLock: true,
        paperId: "cream"
      };
    }

    const existingPlayers = roomData?.players || {};
    const playerUids = Object.keys(existingPlayers);

    if (!existingPlayers[this.uid] && playerUids.length >= 2) {
      throw new Error("هذه الغرفة مكتملة العدد (تضم لاعبين حالياً).");
    }

    if (existingPlayers[this.uid]) {
      this.playerSide = existingPlayers[this.uid].side || "left";
    } else {
      const takenSides = Object.values(existingPlayers).map((p) => p.side);
      this.playerSide = takenSides.includes("left") ? "right" : "left";
    }

    if (!roomData?.meta) {
      await set(metaRef, {
        mode: initialMeta?.mode || "sketch",
        templateId: initialMeta?.templateId || "floating_islands",
        splitLock: initialMeta?.splitLock ?? true,
        paperId: initialMeta?.paperId || "cream",
        createdAt: serverTimestamp(),
        hostUid: this.uid
      });
    }

    const myPlayerRef = ref(this.db, `rooms/${cleanCode}/players/${this.uid}`);
    const myCursorRef = ref(this.db, `rooms/${cleanCode}/cursors/${this.uid}`);
    const myLiveStrokeRef = ref(this.db, `rooms/${cleanCode}/liveStroke/${this.uid}`);

    await set(myPlayerRef, {
      name: this.playerName,
      side: this.playerSide,
      online: true,
      lastSeen: serverTimestamp()
    });

    const connectedRef = ref(this.db, ".info/connected");
    const unsubConn = onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        onDisconnect(myPlayerRef).update({
          online: false,
          lastSeen: serverTimestamp()
        });
        onDisconnect(myCursorRef).remove();
        onDisconnect(myLiveStrokeRef).remove();

        set(myPlayerRef, {
          name: this.playerName,
          side: this.playerSide,
          online: true,
          lastSeen: serverTimestamp()
        });
      }
    });
    this.unsubscribers.push(unsubConn);

    const unsubMeta = onValue(metaRef, (snap) => {
      const meta = snap.val();
      if (meta) this.callbacks.onMetaChange?.(meta);
    });
    this.unsubscribers.push(unsubMeta);

    const unsubPlayers = onValue(playersRef, (snap) => {
      this.callbacks.onPlayersChange?.(snap.val() || {}, this.uid);
    });
    this.unsubscribers.push(unsubPlayers);

    const strokesRef = ref(this.db, `rooms/${cleanCode}/strokes`);
    const unsubStrokes = onValue(strokesRef, (snap) => {
      this.callbacks.onStrokesSync?.(snap.val() || {});
    });
    this.unsubscribers.push(unsubStrokes);

    const liveStrokesRef = ref(this.db, `rooms/${cleanCode}/liveStroke`);
    const unsubLive = onValue(liveStrokesRef, (snap) => {
      this.callbacks.onLiveStrokesChange?.(snap.val() || {}, this.uid);
    });
    this.unsubscribers.push(unsubLive);

    const cursorsRef = ref(this.db, `rooms/${cleanCode}/cursors`);
    const unsubCursors = onValue(cursorsRef, (snap) => {
      this.callbacks.onCursorsChange?.(snap.val() || {}, this.uid);
    });
    this.unsubscribers.push(unsubCursors);

    const reactionsRef = ref(this.db, `rooms/${cleanCode}/reactions`);
    const unsubReact = onValue(reactionsRef, (snap) => {
      const val = snap.val();
      if (val && Date.now() - (val.timestamp || 0) < 4000) {
        this.callbacks.onReactionReceived?.(val);
      }
    });
    this.unsubscribers.push(unsubReact);

    return {
      roomId: cleanCode,
      playerSide: this.playerSide,
      uid: this.uid
    };
  }

  async pushCompletedStroke(strokeData) {
    if (!this.roomId) return;
    const payload = {
      ...strokeData,
      uid: this.uid,
      side: this.playerSide,
      timestamp: Date.now()
    };

    if (this.useLocalBus) {
      this.pushLocalBusStroke(payload);
      return;
    }

    const strokesRef = ref(this.db, `rooms/${this.roomId}/strokes`);
    const newStrokeRef = push(strokesRef);
    await set(newStrokeRef, payload);

    const myLiveStrokeRef = ref(this.db, `rooms/${this.roomId}/liveStroke/${this.uid}`);
    await remove(myLiveStrokeRef);
  }

  updateLiveStroke(strokeData) {
    if (!this.roomId) return;
    if (this.useLocalBus) {
      this.localChannel?.postMessage({
        type: "liveStroke",
        uid: this.uid,
        stroke: strokeData
      });
      return;
    }

    const myLiveStrokeRef = ref(this.db, `rooms/${this.roomId}/liveStroke/${this.uid}`);
    if (!strokeData) {
      remove(myLiveStrokeRef);
    } else {
      set(myLiveStrokeRef, {
        ...strokeData,
        uid: this.uid
      });
    }
  }

  updateCursor(x, y, color, size, tool) {
    if (!this.roomId) return;
    const cursorPayload = {
      x: Math.round(x),
      y: Math.round(y),
      color,
      size,
      tool,
      name: this.playerName,
      side: this.playerSide,
      updatedAt: Date.now()
    };

    if (this.useLocalBus) {
      this.localChannel?.postMessage({
        type: "cursor",
        uid: this.uid,
        cursor: cursorPayload
      });
      return;
    }

    const myCursorRef = ref(this.db, `rooms/${this.roomId}/cursors/${this.uid}`);
    set(myCursorRef, cursorPayload);
  }

  sendQuickReaction(reactionText) {
    if (!this.roomId) return;
    const payload = {
      sender: this.playerName,
      text: reactionText,
      timestamp: Date.now()
    };
    if (this.useLocalBus) {
      this.callbacks.onReactionReceived?.(payload);
      this.localChannel?.postMessage({ type: "reaction", payload });
      return;
    }
    const reactionsRef = ref(this.db, `rooms/${this.roomId}/reactions`);
    set(reactionsRef, payload);
  }

  async updateRoomMeta(newMetaPartial) {
    if (!this.roomId) return;
    if (this.useLocalBus) {
      this.updateLocalBusMeta(newMetaPartial);
      return;
    }

    const metaRef = ref(this.db, `rooms/${this.roomId}/meta`);
    const snap = await get(metaRef);
    const current = snap.val() || {};
    await set(metaRef, {
      ...current,
      ...newMetaPartial
    });
  }

  async undoMyLastStroke(allStrokesMap) {
    if (!this.roomId) return null;
    const myStrokeKeys = Object.entries(allStrokesMap || {})
      .filter(([, s]) => s && s.uid === this.uid)
      .sort((a, b) => (a[1].timestamp || 0) - (b[1].timestamp || 0));

    if (myStrokeKeys.length === 0) return null;
    const [lastKey, lastStroke] = myStrokeKeys[myStrokeKeys.length - 1];

    if (this.useLocalBus) {
      this.removeLocalBusStroke(lastKey);
      return lastStroke;
    }

    const strokeRef = ref(this.db, `rooms/${this.roomId}/strokes/${lastKey}`);
    await remove(strokeRef);
    return lastStroke;
  }

  async clearMyStrokes(allStrokesMap) {
    if (!this.roomId) return;
    if (this.useLocalBus) {
      this.clearLocalBusStrokes(this.uid);
      return;
    }

    const entries = Object.entries(allStrokesMap || {});
    const promises = entries
      .filter(([, s]) => s && s.uid === this.uid)
      .map(([key]) => remove(ref(this.db, `rooms/${this.roomId}/strokes/${key}`)));
    await Promise.all(promises);
  }

  // ==========================================================================
  // نظام معرض "لوحة الأسبوع" + إرسال اللوحات للمشرف + لوحة التحكم (Admin)
  // ==========================================================================
  subscribeGlobalFeeds() {
    for (const u of this.globalUnsubscribers) {
      try { u(); } catch (_) {}
    }
    this.globalUnsubscribers = [];

    if (!this.useLocalBus && this.db) {
      const featRef = ref(this.db, "weeklyFeatured");
      const unsubFeat = onValue(featRef, (snap) => {
        const data = snap.val() || {};
        this.callbacks.onWeeklyFeaturedChange?.(data);
      });
      this.globalUnsubscribers.push(unsubFeat);

      const subRef = ref(this.db, "submissions");
      const unsubSub = onValue(subRef, (snap) => {
        const data = snap.val() || {};
        this.callbacks.onSubmissionsChange?.(data);
      });
      this.globalUnsubscribers.push(unsubSub);
    } else {
      const emitLocalFeeds = () => {
        const feat = JSON.parse(localStorage.getItem(FEATURED_LOCAL_KEY) || "{}");
        const subs = JSON.parse(localStorage.getItem(SUBMISSIONS_LOCAL_KEY) || "{}");
        this.callbacks.onWeeklyFeaturedChange?.(feat);
        this.callbacks.onSubmissionsChange?.(subs);
      };
      emitLocalFeeds();
      this.globalChannel.onmessage = () => emitLocalFeeds();
    }
  }

  // إرسال اللوحة من قِبل اللاعبين لتصل إلى صفحة الإدارة السرية الخاصة بك
  async submitArtworkForWeeklyReview({ title, artists, imageDataUrl, mode, templateTitle }) {
    const item = {
      title: title || "لوحة ثنائية مشتركة",
      artists: artists || "ثنائي مبدع",
      imageDataUrl,
      mode: mode || "sketch",
      templateTitle: templateTitle || "رسم حر",
      likes: 1,
      createdAt: Date.now()
    };

    if (!this.useLocalBus && this.db) {
      const newRef = push(ref(this.db, "submissions"));
      await set(newRef, item);
      return;
    }

    const subs = JSON.parse(localStorage.getItem(SUBMISSIONS_LOCAL_KEY) || "{}");
    const id = "sub_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6);
    subs[id] = item;
    localStorage.setItem(SUBMISSIONS_LOCAL_KEY, JSON.stringify(subs));
    this.callbacks.onSubmissionsChange?.(subs);
    this.globalChannel.postMessage({ type: "updated" });
  }

  // للأدمن فقط: اعتماد لوحة من المرسلات لتصبح في قائمة "لوحة الأسبوع" لجميع الزوار
  async promoteSubmissionToWeeklyFeatured(subId, submissionData, badgeLabel = "لوحة الأسبوع الفائزة") {
    const featuredItem = {
      ...submissionData,
      badge: badgeLabel,
      featuredAt: Date.now(),
      likes: submissionData.likes || 12
    };

    if (!this.useLocalBus && this.db) {
      const featRef = ref(this.db, `weeklyFeatured/${subId}`);
      await set(featRef, featuredItem);
      return;
    }

    const feat = JSON.parse(localStorage.getItem(FEATURED_LOCAL_KEY) || "{}");
    feat[subId] = featuredItem;
    localStorage.setItem(FEATURED_LOCAL_KEY, JSON.stringify(feat));
    this.callbacks.onWeeklyFeaturedChange?.(feat);
    this.globalChannel.postMessage({ type: "updated" });
  }

  // للأدمن فقط: حذف لوحة من المرسلات أو من قائمة لوحة الأسبوع
  async deleteGalleryItem(collectionName, itemId) {
    if (!this.useLocalBus && this.db) {
      await remove(ref(this.db, `${collectionName}/${itemId}`));
      return;
    }

    const key = collectionName === "weeklyFeatured" ? FEATURED_LOCAL_KEY : SUBMISSIONS_LOCAL_KEY;
    const store = JSON.parse(localStorage.getItem(key) || "{}");
    delete store[itemId];
    localStorage.setItem(key, JSON.stringify(store));
    if (collectionName === "weeklyFeatured") {
      this.callbacks.onWeeklyFeaturedChange?.(store);
    } else {
      this.callbacks.onSubmissionsChange?.(store);
    }
    this.globalChannel.postMessage({ type: "updated" });
  }

  // إعجاب الزوار بلوحة في معرض لوحة الأسبوع
  async likeFeaturedArtwork(featId, currentLikes = 0) {
    if (!this.useLocalBus && this.db) {
      const likesRef = ref(this.db, `weeklyFeatured/${featId}/likes`);
      await set(likesRef, currentLikes + 1);
      return;
    }

    const feat = JSON.parse(localStorage.getItem(FEATURED_LOCAL_KEY) || "{}");
    if (feat[featId]) {
      feat[featId].likes = (feat[featId].likes || 0) + 1;
      localStorage.setItem(FEATURED_LOCAL_KEY, JSON.stringify(feat));
      this.callbacks.onWeeklyFeaturedChange?.(feat);
      this.globalChannel.postMessage({ type: "updated" });
    }
  }

  leaveRoom() {
    for (const unsub of this.unsubscribers) {
      try { unsub(); } catch (_) {}
    }
    this.unsubscribers = [];
    if (this.localChannel) {
      this.localChannel.close();
      this.localChannel = null;
    }
    this.roomId = null;
  }

  // ==========================================================================
  // المزامنة الفورية عبر Local Bus عند العمل على نفس المتصفح
  // ==========================================================================
  joinLocalBusRoom(code, initialMeta) {
    const storageKey = `duo_art_room_state_${code}`;
    let roomObj = null;
    try {
      roomObj = JSON.parse(localStorage.getItem(storageKey));
    } catch (_) {}

    if (!roomObj) {
      roomObj = {
        meta: {
          mode: initialMeta?.mode || "sketch",
          templateId: initialMeta?.templateId || "floating_islands",
          splitLock: initialMeta?.splitLock ?? true,
          paperId: initialMeta?.paperId || "cream",
          createdAt: Date.now(),
          hostUid: this.uid
        },
        players: {},
        strokes: {}
      };
    }

    const existingPlayers = roomObj.players || {};
    const uids = Object.keys(existingPlayers);
    if (!existingPlayers[this.uid] && uids.length >= 2) {
      throw new Error("هذه الغرفة مكتملة العدد (تضم لاعبين حالياً).");
    }

    if (existingPlayers[this.uid]) {
      this.playerSide = existingPlayers[this.uid].side;
    } else {
      const takenSides = Object.values(existingPlayers).map((p) => p.side);
      this.playerSide = takenSides.includes("left") ? "right" : "left";
    }

    roomObj.players[this.uid] = {
      name: this.playerName,
      side: this.playerSide,
      online: true,
      lastSeen: Date.now()
    };

    localStorage.setItem(storageKey, JSON.stringify(roomObj));

    this.localChannel = new BroadcastChannel(`duo_art_channel_${code}`);
    this.localChannel.onmessage = (ev) => {
      const msg = ev.data;
      if (!msg) return;
      if (msg.type === "sync_room") {
        const latest = JSON.parse(localStorage.getItem(storageKey) || "{}");
        this.callbacks.onMetaChange?.(latest.meta);
        this.callbacks.onPlayersChange?.(latest.players || {}, this.uid);
        this.callbacks.onStrokesSync?.(latest.strokes || {});
      } else if (msg.type === "liveStroke") {
        const liveMap = msg.stroke ? { [msg.uid]: msg.stroke } : {};
        this.callbacks.onLiveStrokesChange?.(liveMap, this.uid);
      } else if (msg.type === "cursor") {
        this.callbacks.onCursorsChange?.({ [msg.uid]: msg.cursor }, this.uid);
      } else if (msg.type === "reaction") {
        this.callbacks.onReactionReceived?.(msg.payload);
      }
    };

    setTimeout(() => {
      this.callbacks.onMetaChange?.(roomObj.meta);
      this.callbacks.onPlayersChange?.(roomObj.players, this.uid);
      this.callbacks.onStrokesSync?.(roomObj.strokes || {});
      this.localChannel?.postMessage({ type: "sync_room" });
    }, 20);

    return {
      roomId: code,
      playerSide: this.playerSide,
      uid: this.uid
    };
  }

  pushLocalBusStroke(payload) {
    const storageKey = `duo_art_room_state_${this.roomId}`;
    const roomObj = JSON.parse(localStorage.getItem(storageKey) || "{}");
    roomObj.strokes = roomObj.strokes || {};
    const strokeKey = "st_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6);
    roomObj.strokes[strokeKey] = payload;
    localStorage.setItem(storageKey, JSON.stringify(roomObj));
    this.callbacks.onStrokesSync?.(roomObj.strokes);
    this.localChannel?.postMessage({ type: "sync_room" });
    this.localChannel?.postMessage({ type: "liveStroke", uid: this.uid, stroke: null });
  }

  updateLocalBusMeta(newMetaPartial) {
    const storageKey = `duo_art_room_state_${this.roomId}`;
    const roomObj = JSON.parse(localStorage.getItem(storageKey) || "{}");
    roomObj.meta = { ...(roomObj.meta || {}), ...newMetaPartial };
    localStorage.setItem(storageKey, JSON.stringify(roomObj));
    this.callbacks.onMetaChange?.(roomObj.meta);
    this.localChannel?.postMessage({ type: "sync_room" });
  }

  removeLocalBusStroke(strokeKey) {
    const storageKey = `duo_art_room_state_${this.roomId}`;
    const roomObj = JSON.parse(localStorage.getItem(storageKey) || "{}");
    if (roomObj.strokes && roomObj.strokes[strokeKey]) {
      delete roomObj.strokes[strokeKey];
      localStorage.setItem(storageKey, JSON.stringify(roomObj));
      this.callbacks.onStrokesSync?.(roomObj.strokes);
      this.localChannel?.postMessage({ type: "sync_room" });
    }
  }

  clearLocalBusStrokes(uid) {
    const storageKey = `duo_art_room_state_${this.roomId}`;
    const roomObj = JSON.parse(localStorage.getItem(storageKey) || "{}");
    if (roomObj.strokes) {
      for (const [k, v] of Object.entries(roomObj.strokes)) {
        if (v.uid === uid) delete roomObj.strokes[k];
      }
      localStorage.setItem(storageKey, JSON.stringify(roomObj));
      this.callbacks.onStrokesSync?.(roomObj.strokes);
      this.localChannel?.postMessage({ type: "sync_room" });
    }
  }
}
