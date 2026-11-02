# مرسم الثنائي (Duo Art Studio) — موقع رسم تعاوني لشخصين على GitHub Pages

موقع رسم وتلوين تعاوني متكامل يعمل بالكامل من المتصفح (Client-Side Serverless) ومصمم للاستضافة مباشرة على **GitHub Pages** مع مزامنة لحظية عبر **Firebase Realtime Database** و **Firebase Anonymous Authentication**.

## المميزات الأساسية
1. **النمط الأول (تخطيط بقلم رصاص عشوائي — بأسلوب ArtWorkout)**:
   - يولّد تخطيطاً فنياً بقلم رصاص خفيف ومفصل مقسوماً إلى نصفين متناغمين.
   - يلون اللاعب الأول النصف الأيسر ويلون اللاعب الثاني النصف الأيمن (مع إمكانية فتح أو قفل تقسيم النصفين في أي وقت).
   - شريط تقدم تعاوني مباشر يوضح نسبة إكمال كل نصف.
2. **النمط الثاني (مرسم حر كامل)**:
   - لوحة كاملة مفتوحة للرسم الحر المشترك بين اللاعبين بدون قيود.
3. **أدوات وأقلام متخصصة وألوان مريحة للعين**:
   - 7 أدوات رسم متخصصة: قلم رصاص تخطيط، حبر دقيق، ماركر فني (Multiply)، فرشاة مائية، فرشاة زيتية، بخاخ تظليل، وممحاة تحافظ على طبقة التخطيط.
   - 6 مجموعات لونية منتقاة بعناية (باستيل هادئ، زاهي مشرق، طبيعة وأوراق، غروب دافئ، ترابي وبشرة، رصاص وفحم) + منتقي ألوان مخصص.
4. **حفظ اللوحات النهائية**:
   - تصدير اللوحة بجودة عالية `PNG` (1200×800) مع خلفية ورق الرسم الكريمي وتوقيع أسماء الفنانين.

---

## خطوات التفعيل مع Firebase والرفع على GitHub Pages

### 1. إعداد مشروع Firebase
1. افتح [Firebase Console](https://console.firebase.google.com/) وأنشئ مشروعاً جديداً.
2. من القائمة الجانبية، ادخل إلى **Authentication** -> **Sign-in method** وفعّل خيار **Anonymous**.
3. ادخل إلى **Realtime Database** واضغط **Create Database**، ثم انسخ رابط قاعدة البيانات (`databaseURL`).
4. انتقل إلى تبويب **Rules** داخل Realtime Database والصق محتوى الملف [`database.rules.json`](./database.rules.json) ثم اضغط **Publish**.

### 2. وضع `firebaseConfig`
افتح الملف [`js/firebase-sync.js`](./js/firebase-sync.js) واستبدل `DEFAULT_FIREBASE_CONFIG` ببيانات مشروعك:
```javascript
export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```
*(أو يمكنك لصقها مباشرة من داخل الموقع عبر زر **إعدادات Firebase** في الشريط العلوي).*

### 3. الاستضافة على GitHub Pages
ارفع ملفات المجلد (`index.html`, `css/`, `js/`, `database.rules.json`) إلى مستودع GitHub، ثم من **Settings -> Pages** اختر الفرع `main` ليصبح موقعك متاحاً فوراً.
