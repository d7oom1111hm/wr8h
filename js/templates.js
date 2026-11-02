// قوالب التخطيط بقلم الرصاص (Pencil Sketch Templates) + مجموعات الألوان المتخصصة

export const COLOR_PALETTES = {
  pastel: {
    name: "باستيل هادئ",
    colors: [
      "#F4A261", "#E76F51", "#E9C46A", "#A8DADC", "#457B9D",
      "#F2CC8F", "#81B29A", "#E07A5F", "#B5838D", "#6D6875",
      "#FFCDB2", "#FFB4A2", "#E5989B", "#BDE0FE", "#A2D2FF",
      "#CDB4DB", "#FFAFCC", "#CCD5AE", "#E9EDC9", "#FAEDCD"
    ]
  },
  vibrant: {
    name: "زاهي مشرق",
    colors: [
      "#FF595E", "#FF924C", "#FFCA3A", "#8AC926", "#52A675",
      "#1982C4", "#4267AC", "#6A4C93", "#B5179E", "#F72585",
      "#00BBF9", "#00F5D4", "#FEE440", "#9B5DE5", "#FB5607",
      "#3A86FF", "#8338EC", "#FF006E", "#FFBE0B", "#06D6A0"
    ]
  },
  botanical: {
    name: "طبيعة وأوراق",
    colors: [
      "#2D6A4F", "#40916C", "#52B788", "#74C69D", "#95D5B2",
      "#B7E4C7", "#D8F3DC", "#1B4332", "#344E41", "#3A5A40",
      "#588157", "#A3B18A", "#DAD7CD", "#606C38", "#283618",
      "#DDA15E", "#BC6C25", "#7F4F24", "#936639", "#A68A64"
    ]
  },
  sunset: {
    name: "غروب دافئ",
    colors: [
      "#03071E", "#370617", "#6A040F", "#9D0208", "#D00000",
      "#DC2F02", "#E85D04", "#F48C06", "#FAA307", "#FFBA08",
      "#5F0F40", "#9A031E", "#FB8B24", "#E36414", "#0F4C5C",
      "#F7B267", "#F79D65", "#F4845F", "#F27059", "#F25C54"
    ]
  },
  skinAndEarth: {
    name: "ترابي وبشرة",
    colors: [
      "#FDE2CE", "#FAD2B8", "#F3BD9C", "#E5A07A", "#D1855C",
      "#B66B43", "#945231", "#713B21", "#4F2714", "#33180B",
      "#EDE0D4", "#E6CCB2", "#DDB892", "#B08968", "#7F5539",
      "#9C6644", "#582F0E", "#6F4E37", "#8B7355", "#C2B280"
    ]
  },
  monochrome: {
    name: "رصاص وفحم",
    colors: [
      "#FFFFFF", "#F8F9FA", "#E9ECEF", "#DEE2E6", "#CED4DA",
      "#ADB5BD", "#8D99AE", "#6C757D", "#495057", "#343A40",
      "#212529", "#141619", "#E5E0D8", "#D0C8B8", "#B5AA96",
      "#918673", "#6E6555", "#4D4639", "#302B23", "#1A1712"
    ]
  }
};

export const BRUSH_TOOLS = [
  {
    id: "pencil",
    name: "قلم رصاص تخطيط",
    desc: "حبيبي خفيف للتفاصيل والتظليل",
    minSize: 1,
    maxSize: 28,
    defaultSize: 4,
    defaultOpacity: 0.82,
    blendMode: "source-over",
    smoothing: 0.35
  },
  {
    id: "fineliner",
    name: "حبر دقيق",
    desc: "خطوط ناعمة وحادة للتحبير",
    minSize: 1,
    maxSize: 24,
    defaultSize: 3,
    defaultOpacity: 0.98,
    blendMode: "source-over",
    smoothing: 0.65
  },
  {
    id: "marker",
    name: "ماركر فني",
    desc: "تلوين متجانس بطبقات شفافة",
    minSize: 6,
    maxSize: 65,
    defaultSize: 22,
    defaultOpacity: 0.55,
    blendMode: "multiply",
    smoothing: 0.55
  },
  {
    id: "watercolor",
    name: "فرشاة مائية",
    desc: "تدرج لوني ناعم وحواف رقيقة",
    minSize: 8,
    maxSize: 80,
    defaultSize: 30,
    defaultOpacity: 0.32,
    blendMode: "source-over",
    smoothing: 0.6
  },
  {
    id: "oil",
    name: "فرشاة زيتية",
    desc: "لون غني وكثيف للتلوين الأساسي",
    minSize: 4,
    maxSize: 75,
    defaultSize: 18,
    defaultOpacity: 0.94,
    blendMode: "source-over",
    smoothing: 0.5
  },
  {
    id: "airbrush",
    name: "بخاخ تظليل",
    desc: "إضاءة وتظليل متدرج ناعم",
    minSize: 14,
    maxSize: 110,
    defaultSize: 44,
    defaultOpacity: 0.25,
    blendMode: "source-over",
    smoothing: 0.5
  },
  {
    id: "eraser",
    name: "ممحاة",
    desc: "مسح التلوين مع الحفاظ على التخطيط",
    minSize: 4,
    maxSize: 90,
    defaultSize: 24,
    defaultOpacity: 1,
    blendMode: "destination-out",
    smoothing: 0.4
  }
];

// رسومات تخطيط بقلم الرصاص (موزعة بتناظر فني أو مشهد متصل بين النصف الأيسر والأيمن)
// أبعاد اللوحة القياسية: 1200 × 800 (المنتصف عند X = 600)
export const SKETCH_TEMPLATES = [
  {
    id: "floating_islands",
    title: "الجزيرتان العائمتان والجسر الحجري",
    subtitle: "نصف اليسار: جزيرة المنارة والأشجار | نصف اليمين: جزيرة الطاحونة والشلال",
    suggestedPalette: "pastel",
    render(ctx) {
      // سحب في الأعلى
      drawCloud(ctx, 210, 120, 75);
      drawCloud(ctx, 430, 95, 55);
      drawCloud(ctx, 770, 100, 60);
      drawCloud(ctx, 990, 130, 80);

      // شمس/قمر في الوسط تماماً يربط النصفين
      ctx.beginPath();
      ctx.arc(600, 180, 68, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI) / 6;
        ctx.beginPath();
        ctx.moveTo(600 + Math.cos(angle) * 78, 180 + Math.sin(angle) * 78);
        ctx.lineTo(600 + Math.cos(angle) * 98, 180 + Math.sin(angle) * 98);
        ctx.stroke();
      }

      // الجزيرة اليسرى
      ctx.beginPath();
      ctx.moveTo(110, 470);
      ctx.quadraticCurveTo(280, 445, 470, 470);
      ctx.lineTo(420, 560);
      ctx.lineTo(350, 650);
      ctx.lineTo(285, 710);
      ctx.lineTo(210, 635);
      ctx.lineTo(150, 555);
      ctx.closePath();
      ctx.stroke();

      // طبقات صخرية للجزيرة اليسرى
      ctx.beginPath();
      ctx.moveTo(150, 555);
      ctx.lineTo(285, 585);
      ctx.lineTo(420, 560);
      ctx.moveTo(285, 585);
      ctx.lineTo(285, 710);
      ctx.stroke();

      // المنارة على اليسار
      ctx.beginPath();
      ctx.moveTo(220, 462);
      ctx.lineTo(238, 270);
      ctx.lineTo(292, 270);
      ctx.lineTo(310, 462);
      ctx.stroke();

      // خطوط المنارة وقبتها
      ctx.beginPath();
      ctx.moveTo(232, 330);
      ctx.lineTo(298, 330);
      ctx.moveTo(226, 395);
      ctx.lineTo(304, 395);
      ctx.rect(244, 238, 42, 32);
      ctx.moveTo(235, 238);
      ctx.quadraticCurveTo(265, 195, 295, 238);
      ctx.stroke();

      // شجرتا صنوبر على اليسار
      drawPineTree(ctx, 160, 466, 95);
      drawPineTree(ctx, 370, 464, 110);

      // الجزيرة اليمنى
      ctx.beginPath();
      ctx.moveTo(730, 470);
      ctx.quadraticCurveTo(920, 445, 1090, 470);
      ctx.lineTo(1050, 560);
      ctx.lineTo(985, 645);
      ctx.lineTo(915, 710);
      ctx.lineTo(845, 645);
      ctx.lineTo(780, 560);
      ctx.closePath();
      ctx.stroke();

      // طبقات صخرية للجزيرة اليمنى
      ctx.beginPath();
      ctx.moveTo(780, 560);
      ctx.lineTo(915, 585);
      ctx.lineTo(1050, 560);
      ctx.moveTo(915, 585);
      ctx.lineTo(915, 710);
      ctx.stroke();

      // طاحونة هوائية على اليمين
      ctx.beginPath();
      ctx.moveTo(885, 462);
      ctx.lineTo(902, 290);
      ctx.lineTo(968, 290);
      ctx.lineTo(985, 462);
      ctx.moveTo(895, 290);
      ctx.quadraticCurveTo(935, 245, 975, 290);
      ctx.stroke();

      // شفرات الطاحونة
      ctx.beginPath();
      ctx.arc(935, 310, 10, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 4; i++) {
        const a = Math.PI / 4 + (i * Math.PI) / 2;
        ctx.beginPath();
        ctx.moveTo(935, 310);
        ctx.lineTo(935 + Math.cos(a) * 85, 310 + Math.sin(a) * 85);
        ctx.lineTo(935 + Math.cos(a + 0.22) * 75, 310 + Math.sin(a + 0.22) * 75);
        ctx.closePath();
        ctx.stroke();
      }

      // شلال ينزل من الجزيرة اليمنى
      ctx.beginPath();
      ctx.moveTo(815, 465);
      ctx.bezierCurveTo(805, 560, 795, 650, 790, 760);
      ctx.moveTo(845, 465);
      ctx.bezierCurveTo(835, 560, 830, 650, 828, 760);
      ctx.stroke();

      // شجرة مورقة على اليمين
      drawRoundTree(ctx, 1035, 466, 95);

      // الجسر المعلق في المنتصف بين الجزيرتين
      ctx.beginPath();
      ctx.moveTo(470, 470);
      ctx.quadraticCurveTo(600, 520, 730, 470);
      ctx.moveTo(470, 435);
      ctx.quadraticCurveTo(600, 490, 730, 435);
      ctx.stroke();

      for (let x = 485; x <= 715; x += 26) {
        const t = (x - 470) / 260;
        const yBot = (1 - t) * (1 - t) * 470 + 2 * (1 - t) * t * 520 + t * t * 470;
        const yTop = (1 - t) * (1 - t) * 435 + 2 * (1 - t) * t * 490 + t * t * 435;
        ctx.beginPath();
        ctx.moveTo(x, yTop);
        ctx.lineTo(x, yBot);
        ctx.stroke();
      }
    }
  },
  {
    id: "royal_butterfly",
    title: "حديقة الفراشة الملكية المتناظرة",
    subtitle: "نصف اليسار: الجناح الأيسر وأزهار التوليب | نصف اليمين: الجناح الأيمن وأزهار اللوتس",
    suggestedPalette: "vibrant",
    render(ctx) {
      // جسم الفراشة في المنتصف
      ctx.beginPath();
      ctx.ellipse(600, 390, 16, 125, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(600, 248, 20, 0, Math.PI * 2);
      ctx.stroke();

      // قرون الاستشعار
      ctx.beginPath();
      ctx.moveTo(592, 230);
      ctx.bezierCurveTo(560, 150, 500, 140, 485, 165);
      ctx.moveTo(608, 230);
      ctx.bezierCurveTo(640, 150, 700, 140, 715, 165);
      ctx.stroke();

      // رسم الأجنحة بتناظر كامل
      for (const dir of [-1, 1]) {
        // الجناح العلوي
        ctx.beginPath();
        ctx.moveTo(600 + dir * 15, 310);
        ctx.bezierCurveTo(
          600 + dir * 180, 110,
          600 + dir * 460, 120,
          600 + dir * 440, 295
        );
        ctx.bezierCurveTo(
          600 + dir * 425, 390,
          600 + dir * 210, 415,
          600 + dir * 16, 385
        );
        ctx.stroke();

        // زخارف داخل الجناح العلوي
        ctx.beginPath();
        ctx.ellipse(600 + dir * 240, 265, 95, 58, dir * -0.28, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(600 + dir * 365, 225, 32, 0, Math.PI * 2);
        ctx.moveTo(600 + dir * 395, 305);
        ctx.arc(600 + dir * 375, 305, 20, 0, Math.PI * 2);
        ctx.stroke();

        // الجناح السفلي
        ctx.beginPath();
        ctx.moveTo(600 + dir * 16, 395);
        ctx.bezierCurveTo(
          600 + dir * 250, 410,
          600 + dir * 370, 520,
          600 + dir * 280, 625
        );
        ctx.bezierCurveTo(
          600 + dir * 200, 695,
          600 + dir * 65, 595,
          600 + dir * 14, 485
        );
        ctx.stroke();

        // زخارف الجناح السفلي
        ctx.beginPath();
        ctx.ellipse(600 + dir * 175, 525, 65, 42, dir * 0.4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(600 + dir * 245, 585, 22, 0, Math.PI * 2);
        ctx.stroke();

        // إكليل أزهار وأوراق في الزوايا
        drawFlowerCluster(ctx, 600 + dir * 445, 645, dir);
        drawFlowerCluster(ctx, 600 + dir * 465, 125, dir);
      }
    }
  },
  {
    id: "cozy_street",
    title: "الشارع الأوروبي الدافئ (مقهى ومكتبة)",
    subtitle: "نصف اليسار: مقهى المخبوزات الكلاسيكي | نصف اليمين: مكتبة الكتب والزهور",
    suggestedPalette: "sunset",
    render(ctx) {
      // رصيف الشارع الممتد
      ctx.beginPath();
      ctx.moveTo(40, 665);
      ctx.lineTo(1160, 665);
      ctx.moveTo(40, 710);
      ctx.lineTo(1160, 710);
      ctx.stroke();

      // عمود الإنارة الكلاسيكي في المنتصف تماماً (X = 600)
      ctx.beginPath();
      ctx.rect(584, 625, 32, 40);
      ctx.moveTo(595, 625);
      ctx.lineTo(595, 230);
      ctx.moveTo(605, 625);
      ctx.lineTo(605, 230);
      ctx.moveTo(555, 245);
      ctx.quadraticCurveTo(600, 205, 645, 245);
      ctx.stroke();
      // فانوس الإنارة المزدوج
      ctx.beginPath();
      ctx.rect(540, 245, 28, 42);
      ctx.rect(632, 245, 28, 42);
      ctx.stroke();

      // المبنى الأيسر: المقهى
      ctx.beginPath();
      ctx.rect(110, 175, 420, 490);
      ctx.stroke();
      // سقف القرميد الأيسر
      ctx.beginPath();
      ctx.moveTo(95, 175);
      ctx.lineTo(145, 115);
      ctx.lineTo(495, 115);
      ctx.lineTo(545, 175);
      ctx.closePath();
      ctx.stroke();

      // نوافذ الطابق العلوي للمقهى
      for (const wx of [165, 365]) {
        ctx.beginPath();
        ctx.rect(wx, 225, 105, 130);
        ctx.moveTo(wx + 52, 225);
        ctx.lineTo(wx + 52, 355);
        ctx.moveTo(wx, 290);
        ctx.lineTo(wx + 105, 290);
        ctx.rect(wx - 8, 355, 121, 16);
        ctx.stroke();
      }

      // مظلة المقهى المخططة
      ctx.beginPath();
      ctx.moveTo(125, 405);
      ctx.lineTo(515, 405);
      ctx.lineTo(530, 455);
      ctx.lineTo(110, 455);
      ctx.closePath();
      ctx.stroke();
      for (let x = 110; x < 520; x += 42) {
        ctx.beginPath();
        ctx.moveTo(x + 12, 405);
        ctx.lineTo(x, 455);
        ctx.arc(x + 21, 455, 21, Math.PI, 0, true);
        ctx.stroke();
      }

      // باب المقهى وواجهته الزجاجية
      ctx.beginPath();
      ctx.rect(145, 495, 110, 170);
      ctx.rect(285, 495, 210, 120);
      ctx.stroke();

      // المبنى الأيمن: المكتبة
      ctx.beginPath();
      ctx.rect(670, 175, 420, 490);
      ctx.stroke();
      // سقف المكتبة مع نافذة دائرية
      ctx.beginPath();
      ctx.moveTo(655, 175);
      ctx.lineTo(880, 95);
      ctx.lineTo(1105, 175);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(880, 145, 20, 0, Math.PI * 2);
      ctx.stroke();

      // شرفة الطابق العلوي للمكتبة
      for (const wx of [725, 925]) {
        ctx.beginPath();
        ctx.rect(wx, 225, 105, 130);
        ctx.moveTo(wx + 52, 225);
        ctx.lineTo(wx + 52, 355);
        ctx.moveTo(wx, 290);
        ctx.lineTo(wx + 105, 290);
        ctx.rect(wx - 8, 355, 121, 16);
        ctx.stroke();
      }

      // لافتة المكتبة وواجهة الكتب
      ctx.beginPath();
      ctx.rect(705, 405, 350, 46);
      ctx.rect(705, 495, 210, 120);
      ctx.rect(945, 495, 110, 170);
      ctx.stroke();

      // كتب داخل واجهة المكتبة
      for (let bx = 720; bx <= 890; bx += 22) {
        ctx.beginPath();
        ctx.rect(bx, 545, 18, 68);
        ctx.stroke();
      }
    }
  },
  {
    id: "coral_reef",
    title: "عالم الشعاب المرجانية البحري",
    subtitle: "نصف اليسار: السلحفاة البحرية والمرجان | نصف اليمين: الدلفين ونجم البحر",
    suggestedPalette: "botanical",
    render(ctx) {
      // أمواج السطح في الأعلى
      ctx.beginPath();
      for (let x = 40; x < 1160; x += 80) {
        ctx.moveTo(x, 85);
        ctx.quadraticCurveTo(x + 40, 60, x + 80, 85);
      }
      ctx.stroke();

      // قاع البحر المتموج
      ctx.beginPath();
      ctx.moveTo(40, 690);
      ctx.bezierCurveTo(350, 635, 850, 730, 1160, 675);
      ctx.stroke();

      // صدفة لؤلؤ كبيرة في المنتصف (X = 600)
      ctx.beginPath();
      ctx.ellipse(600, 650, 78, 32, 0, 0, Math.PI * 2);
      ctx.moveTo(522, 650);
      ctx.bezierCurveTo(525, 545, 675, 545, 678, 650);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(600, 638, 22, 0, Math.PI * 2);
      ctx.stroke();

      // السلحفاة البحرية في النصف الأيسر
      ctx.beginPath();
      ctx.ellipse(310, 310, 115, 82, -0.22, 0, Math.PI * 2);
      ctx.stroke();
      // نقوش صدفة السلحفاة
      ctx.beginPath();
      ctx.ellipse(310, 310, 75, 50, -0.22, 0, Math.PI * 2);
      ctx.stroke();
      // رأس السلحفاة وزعانفها
      ctx.beginPath();
      ctx.ellipse(438, 275, 36, 26, -0.2, 0, Math.PI * 2);
      ctx.moveTo(360, 238);
      ctx.quadraticCurveTo(420, 145, 330, 175);
      ctx.lineTo(310, 232);
      ctx.moveTo(375, 372);
      ctx.quadraticCurveTo(445, 455, 355, 445);
      ctx.lineTo(325, 385);
      ctx.stroke();

      // الدلفين في النصف الأيمن
      ctx.beginPath();
      ctx.moveTo(735, 330);
      ctx.bezierCurveTo(800, 195, 985, 205, 1055, 355);
      ctx.bezierCurveTo(1080, 410, 1040, 445, 1015, 405);
      ctx.bezierCurveTo(965, 325, 845, 320, 765, 365);
      ctx.closePath();
      ctx.stroke();
      // زعنفة ظهر الدلفين
      ctx.beginPath();
      ctx.moveTo(895, 235);
      ctx.quadraticCurveTo(935, 165, 955, 250);
      ctx.stroke();

      // أعشاب بحرية ومرجان على الجانبين
      drawSeaweed(ctx, 130, 680, 210);
      drawSeaweed(ctx, 220, 675, 160);
      drawSeaweed(ctx, 980, 685, 190);
      drawSeaweed(ctx, 1070, 680, 230);

      // فقاعات مائية
      for (const [bx, by, br] of [
        [485, 235, 12], [505, 195, 18], [475, 155, 9],
        [710, 260, 14], [690, 210, 20], [725, 165, 10]
      ]) {
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }
];

function drawCloud(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r * 0.55, Math.PI * 0.5, Math.PI * 1.5);
  ctx.arc(x + r * 0.45, y - r * 0.35, r * 0.5, Math.PI, Math.PI * 1.85);
  ctx.arc(x + r * 1.05, y - r * 0.15, r * 0.48, Math.PI * 1.2, Math.PI * 1.95);
  ctx.arc(x + r * 1.35, y + r * 0.1, r * 0.45, Math.PI * 1.5, Math.PI * 0.5);
  ctx.closePath();
  ctx.stroke();
}

function drawPineTree(ctx, x, baseY, h) {
  ctx.beginPath();
  ctx.rect(x - 8, baseY - 24, 16, 24);
  ctx.stroke();
  for (let i = 0; i < 3; i++) {
    const topY = baseY - h + i * 22;
    const botY = baseY - 22 - (2 - i) * 20;
    const w = 32 + i * 12;
    ctx.beginPath();
    ctx.moveTo(x, topY);
    ctx.lineTo(x - w, botY);
    ctx.lineTo(x + w, botY);
    ctx.closePath();
    ctx.stroke();
  }
}

function drawRoundTree(ctx, x, baseY, h) {
  ctx.beginPath();
  ctx.rect(x - 10, baseY - 36, 20, 36);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, baseY - h * 0.68, 42, 0, Math.PI * 2);
  ctx.moveTo(x - 28 + 30, baseY - h * 0.52);
  ctx.arc(x - 28, baseY - h * 0.52, 30, 0, Math.PI * 2);
  ctx.moveTo(x + 28 + 30, baseY - h * 0.52);
  ctx.arc(x + 28, baseY - h * 0.52, 30, 0, Math.PI * 2);
  ctx.stroke();
}

function drawFlowerCluster(ctx, cx, cy, dir) {
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, Math.PI * 2);
  ctx.stroke();
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    const px = cx + Math.cos(a) * 34;
    const py = cy + Math.sin(a) * 34;
    ctx.beginPath();
    ctx.arc(px, py, 18, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(cx - dir * 55, cy);
  ctx.quadraticCurveTo(cx - dir * 95, cy - 35, cx - dir * 130, cy);
  ctx.quadraticCurveTo(cx - dir * 95, cy + 35, cx - dir * 55, cy);
  ctx.stroke();
}

function drawSeaweed(ctx, x, baseY, h) {
  ctx.beginPath();
  ctx.moveTo(x, baseY);
  ctx.bezierCurveTo(x - 28, baseY - h * 0.35, x + 28, baseY - h * 0.65, x - 8, baseY - h);
  ctx.bezierCurveTo(x + 42, baseY - h * 0.65, x - 12, baseY - h * 0.35, x + 16, baseY);
  ctx.closePath();
  ctx.stroke();
}

// دالة رسم التخطيط بتأثير قلم الرصاص الحقيقي
export function renderPencilTemplate(canvas, templateId, showSplitDivider = true) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!templateId || templateId === "none") return;

  const tpl = SKETCH_TEMPLATES.find((t) => t.id === templateId) || SKETCH_TEMPLATES[0];

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // الطبقة الأولى: خط رصاص خفيف عريض قليلاً كظل تخطيط
  ctx.strokeStyle = "rgba(88, 78, 68, 0.22)";
  ctx.lineWidth = 3.6;
  tpl.render(ctx);

  // الطبقة الثانية: خط القلم الرصاص الأساسي الدقيق
  ctx.strokeStyle = "rgba(62, 54, 46, 0.58)";
  ctx.lineWidth = 1.65;
  tpl.render(ctx);

  // خط تقسيم النصفين الإرشادي الخفيف في الوسط (X = 600)
  if (showSplitDivider) {
    ctx.strokeStyle = "rgba(120, 108, 94, 0.35)";
    ctx.lineWidth = 1.4;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 16);
    ctx.lineTo(canvas.width / 2, canvas.height - 16);
    ctx.stroke();
  }

  ctx.restore();
}
