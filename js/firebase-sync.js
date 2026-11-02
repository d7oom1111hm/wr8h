// نظام الاتصال الجماعي عبر Firebase Realtime Database + Anonymous Auth
// يعمل بالكامل على GitHub Pages بدون أي خادم خاص (Serverless Client-Side)

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
// ضع إعدادات مشروعك في Firebase هنا قبل الرفع على GitHub Pages
// أو يمكنك إدخالها مباشرة من زر "إعدادات Firebase" داخل الموقع!
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

const STORAGE_CONFIG_KEY = "duo_art_firebase_config_v1";

export function getActiveFirebaseConfig() {
  try {
    const saved = localStorage.getItem(STORAGE_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.apiKey && parsed.databaseURL) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("تعذر قراءة إعدادات Firebase المحفوظة:", err);
  }
  return DEFAULT_FIREBASE_CONFIG;
}

export function saveCustomFirebaseConfig(configObj) {
  localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(configObj));
}

export function isFirebaseConfigured(cfg = getActiveFirebaseConfig()) {
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
    this.playerSide = "left"; // 'left' (اللاعب 1) أو 'right' (اللاعب 2)
    this.playerName = "فنان 1";
    this.unsubscribers = [];
    this.isLocalDemoMode = false;
    this.localChannel = null;
  }

  async init() {
    const config = getActiveFirebaseConfig();
    if (!isFirebaseConfigured(config)) {
      this.enableLocalFallbackMode();
      return { mode: "local_demo", uid: this.uid };
    }

    try {
      const existingApps = getApps();
      for (const a of existingApps) {
        await deleteApp(a);
      }

      this.app = initializeApp(config);
      this.auth = getAuth(this.app);
      this.db = getDatabase(this.app);
      this.isLocalDemoMode = false;

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
      if (this.callbacks.onAuthReady) {
        this.callbacks.onAuthReady(this.uid, false);
      }
      return { mode: "firebase", uid: this.uid };
    } catch (error) {
      console.error("خطأ في الاتصال بـ Firebase:", error);
      this.enableLocalFallbackMode();
      if (this.callbacks.onError) {
        this.callbacks.onError("تعذر الاتصال بـ Firebase، تم تفعيل وضع المزامنة عبر التبويبات المحلية مؤقتاً.");
      }
      return { mode: "local_demo", uid: this.uid, error };
    }
  }

  enableLocalFallbackMode() {
    this.isLocalDemoMode = true;
    let tabUid = sessionStorage.getItem("duo_art_demo_uid");
    if (!tabUid) {
      tabUid = "local_" + Math.random().toString(36).substring(2, 10);
      sessionStorage.setItem("duo_art_demo_uid", tabUid);
    }
    this.uid = tabUid;
    if (this.callbacks.onAuthReady) {
      this.callbacks.onAuthReady(this.uid, true);
    }
  }

  generateRoomCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  async createRoom({ playerName, mode, templateId, splitLock }) {
    const code = this.generateRoomCode();
    return this.joinRoom({
      roomId: code,
      playerName,
      initialMeta: {
        mode: mode || "sketch",
        templateId: templateId || "floating_islands",
        splitLock: splitLock !== undefined ? splitLock : true
      },
      isCreating: true
    });
  }

  async joinRoom({ roomId, playerName, initialMeta = null, isCreating = false }) {
    this.leaveRoom();
    const cleanCode = roomId.trim().toUpperCase();
    this.roomId = cleanCode;
    this.playerName = playerName?.trim() || "فنان";

    if (this.isLocalDemoMode) {
      return this.joinLocalDemoRoom(cleanCode, initialMeta, isCreating);
    }

    const roomRef = ref(this.db, `rooms/${cleanCode}`);
    const playersRef = ref(this.db, `rooms/${cleanCode}/players`);
    const metaRef = ref(this.db, `rooms/${cleanCode}/meta`);

    // التحقق من حالة الغرفة وعدد اللاعبين الحاليين
    const snapshot = await get(roomRef);
    const roomData = snapshot.val();

    if (!roomData && !isCreating && !initialMeta) {
      // إذا دخل عبر رابط مشاركة والغرفة غير موجودة بعد، ننشئها تلقائياً
      initialMeta = {
        mode: "sketch",
        templateId: "floating_islands",
        splitLock: true
      };
    }

    const existingPlayers = roomData?.players || {};
    const playerUids = Object.keys(existingPlayers);

    // التحقق من عدم وجود أكثر من لاعبين (إلا إذا كان اللاعب نفسه يعيد الاتصال بنفس الـ auth.uid)
    if (!existingPlayers[this.uid] && playerUids.length >= 2) {
      throw new Error("الغرفة ممتلئة! يوجد لاعبان بالفعل في هذه الغرفة.");
    }

    // تخصيص النصف (اللاعب الأول يأخذ اليسار، واللاعب الثاني يأخذ اليمين)
    if (existingPlayers[this.uid]) {
      this.playerSide = existingPlayers[this.uid].side || "left";
    } else {
      const takenSides = Object.values(existingPlayers).map((p) => p.side);
      this.playerSide = takenSides.includes("left") ? "right" : "left";
    }

    // إذا كانت الغرفة جديدة، نحفظ إعدادات الغرفة الأساسية بـ set
    if (!roomData?.meta) {
      await set(metaRef, {
        mode: initialMeta?.mode || "sketch",
        templateId: initialMeta?.templateId || "floating_islands",
        splitLock: initialMeta?.splitLock ?? true,
        createdAt: serverTimestamp(),
        hostUid: this.uid
      });
    }

    // تسجيل بيانات اللاعب الحالي باستخدام set و auth.uid
    const myPlayerRef = ref(this.db, `rooms/${cleanCode}/players/${this.uid}`);
    const myCursorRef = ref(this.db, `rooms/${cleanCode}/cursors/${this.uid}`);
    const myLiveStrokeRef = ref(this.db, `rooms/${cleanCode}/liveStroke/${this.uid}`);

    await set(myPlayerRef, {
      name: this.playerName,
      side: this.playerSide,
      online: true,
      lastSeen: serverTimestamp()
    });

    // مراقبة حالة الاتصال اللحظية عبر .info/connected
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

    // 1. الاستماع لتغييرات إعدادات الغرفة (النمط، الرسمة المختارة، تقسيم النصفين) عبر onValue
    const unsubMeta = onValue(metaRef, (snap) => {
      const meta = snap.val();
      if (meta && this.callbacks.onMetaChange) {
        this.callbacks.onMetaChange(meta);
      }
    });
    this.unsubscribers.push(unsubMeta);

    // 2. الاستماع لقائمة اللاعبين وحالة اتصالهما عبر onValue
    const unsubPlayers = onValue(playersRef, (snap) => {
      const players = snap.val() || {};
      if (this.callbacks.onPlayersChange) {
        this.callbacks.onPlayersChange(players, this.uid);
      }
    });
    this.unsubscribers.push(unsubPlayers);

    // 3. الاستماع لجميع الخطوط المرسومة في الغرفة عبر onValue
    const strokesRef = ref(this.db, `rooms/${cleanCode}/strokes`);
    const unsubStrokes = onValue(strokesRef, (snap) => {
      const strokesObj = snap.val() || {};
      if (this.callbacks.onStrokesSync) {
        this.callbacks.onStrokesSync(strokesObj);
      }
    });
    this.unsubscribers.push(unsubStrokes);

    // 4. الاستماع للخط الذي يرسمه اللاعب الآخر حالياً لحظة بلحظة عبر onValue
    const liveStrokesRef = ref(this.db, `rooms/${cleanCode}/liveStroke`);
    const unsubLive = onValue(liveStrokesRef, (snap) => {
      const liveAll = snap.val() || {};
      if (this.callbacks.onLiveStrokesChange) {
        this.callbacks.onLiveStrokesChange(liveAll, this.uid);
      }
    });
    this.unsubscribers.push(unsubLive);

    // 5. الاستماع لحركة مؤشر اللاعب الآخر عبر onValue
    const cursorsRef = ref(this.db, `rooms/${cleanCode}/cursors`);
    const unsubCursors = onValue(cursorsRef, (snap) => {
      const cursors = snap.val() || {};
      if (this.callbacks.onCursorsChange) {
        this.callbacks.onCursorsChange(cursors, this.uid);
      }
    });
    this.unsubscribers.push(unsubCursors);

    return {
      roomId: cleanCode,
      playerSide: this.playerSide,
      uid: this.uid
    };
  }

  // إرسال خط مكتمل إلى قاعدة البيانات باستخدام push و set
  async pushCompletedStroke(strokeData) {
    if (!this.roomId) return;
    const payload = {
      ...strokeData,
      uid: this.uid,
      side: this.playerSide,
      timestamp: Date.now()
    };

    if (this.isLocalDemoMode) {
      this.pushLocalDemoStroke(payload);
      return;
    }

    const strokesRef = ref(this.db, `rooms/${this.roomId}/strokes`);
    const newStrokeRef = push(strokesRef);
    await set(newStrokeRef, payload);

    // مسح الخط اللحظي المؤقت بعد اكتماله
    const myLiveStrokeRef = ref(this.db, `rooms/${this.roomId}/liveStroke/${this.uid}`);
    await remove(myLiveStrokeRef);
  }

  // بث النقاط أثناء السحب لحظيًا عبر set
  updateLiveStroke(strokeData) {
    if (!this.roomId) return;
    if (this.isLocalDemoMode) {
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

  // تحديث موقع مؤشر القلم لحظيًا عبر set
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

    if (this.isLocalDemoMode) {
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

  // تحديث نمط اللعب أو تغيير الرسمة العشوائية عبر set
  async updateRoomMeta(newMetaPartial) {
    if (!this.roomId) return;
    if (this.isLocalDemoMode) {
      this.updateLocalDemoMeta(newMetaPartial);
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

  // التراجع عن آخر خط رسمه اللاعب الحالي
  async undoMyLastStroke(allStrokesMap) {
    if (!this.roomId) return;
    const myStrokeKeys = Object.entries(allStrokesMap || {})
      .filter(([, s]) => s && s.uid === this.uid)
      .sort((a, b) => (a[1].timestamp || 0) - (b[1].timestamp || 0));

    if (myStrokeKeys.length === 0) return false;
    const [lastKey] = myStrokeKeys[myStrokeKeys.length - 1];

    if (this.isLocalDemoMode) {
      this.removeLocalDemoStroke(lastKey);
      return true;
    }

    const strokeRef = ref(this.db, `rooms/${this.roomId}/strokes/${lastKey}`);
    await remove(strokeRef);
    return true;
  }

  // مسح خطوط اللاعب الحالي (أو اللوحة)
  async clearMyStrokes(allStrokesMap) {
    if (!this.roomId) return;
    if (this.isLocalDemoMode) {
      this.clearLocalDemoStrokes(this.uid);
      return;
    }

    const entries = Object.entries(allStrokesMap || {});
    const promises = entries
      .filter(([, s]) => s && s.uid === this.uid)
      .map(([key]) => remove(ref(this.db, `rooms/${this.roomId}/strokes/${key}`)));
    await Promise.all(promises);
  }

  leaveRoom() {
    for (const unsub of this.unsubscribers) {
      try {
        unsub();
      } catch (_) {}
    }
    this.unsubscribers = [];
    if (this.localChannel) {
      this.localChannel.close();
      this.localChannel = null;
    }
    this.roomId = null;
  }

  // ==========================================================================
  // وضع المزامنة المحلية بين التبويبات (يعمل تلقائياً قبل إضافة إعدادات Firebase)
  // ==========================================================================
  joinLocalDemoRoom(code, initialMeta, isCreating) {
    const storageKey = `duo_art_demo_room_${code}`;
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
      throw new Error("الغرفة ممتلئة! يوجد لاعبان بالفعل في هذه الغرفة.");
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
      }
    };

    // إرسال التحديث الأولي
    setTimeout(() => {
      this.callbacks.onMetaChange?.(roomObj.meta);
      this.callbacks.onPlayersChange?.(roomObj.players, this.uid);
      this.callbacks.onStrokesSync?.(roomObj.strokes || {});
      this.localChannel?.postMessage({ type: "sync_room" });
    }, 30);

    return {
      roomId: code,
      playerSide: this.playerSide,
      uid: this.uid
    };
  }

  pushLocalDemoStroke(payload) {
    const storageKey = `duo_art_demo_room_${this.roomId}`;
    const roomObj = JSON.parse(localStorage.getItem(storageKey) || "{}");
    roomObj.strokes = roomObj.strokes || {};
    const strokeKey = "st_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6);
    roomObj.strokes[strokeKey] = payload;
    localStorage.setItem(storageKey, JSON.stringify(roomObj));
    this.callbacks.onStrokesSync?.(roomObj.strokes);
    this.localChannel?.postMessage({ type: "sync_room" });
    this.localChannel?.postMessage({ type: "liveStroke", uid: this.uid, stroke: null });
  }

  updateLocalDemoMeta(newMetaPartial) {
    const storageKey = `duo_art_demo_room_${this.roomId}`;
    const roomObj = JSON.parse(localStorage.getItem(storageKey) || "{}");
    roomObj.meta = { ...(roomObj.meta || {}), ...newMetaPartial };
    localStorage.setItem(storageKey, JSON.stringify(roomObj));
    this.callbacks.onMetaChange?.(roomObj.meta);
    this.localChannel?.postMessage({ type: "sync_room" });
  }

  removeLocalDemoStroke(strokeKey) {
    const storageKey = `duo_art_demo_room_${this.roomId}`;
    const roomObj = JSON.parse(localStorage.getItem(storageKey) || "{}");
    if (roomObj.strokes && roomObj.strokes[strokeKey]) {
      delete roomObj.strokes[strokeKey];
      localStorage.setItem(storageKey, JSON.stringify(roomObj));
      this.callbacks.onStrokesSync?.(roomObj.strokes);
      this.localChannel?.postMessage({ type: "sync_room" });
    }
  }

  clearLocalDemoStrokes(uid) {
    const storageKey = `duo_art_demo_room_${this.roomId}`;
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
