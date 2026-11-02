// مكتبة الألوان الاحترافية، الأدوات المتخصصة، أنواع الورق، وتخطيطات قلم الرصاص

export const COLOR_PALETTES = {
  pastel: {
    name: "باستيل مخملي",
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
  vintage: {
    name: "كلاسيكي هادئ",
    colors: [
      "#264653", "#287271", "#2A9D8F", "#8AB17D", "#BABB74",
      "#E9C46A", "#EFB366", "#F4A261", "#EE8959", "#E76F51",
      "#5F0F40", "#9A031E", "#CB793A", "#FCDC4D", "#3E5641",
      "#A24936", "#D36135", "#282B28", "#83BCA9", "#D6C9C9"
    ]
  },
  botanical: {
    name: "طبيعة وغابات",
    colors: [
      "#1B4332", "#2D6A4F", "#40916C", "#52B788", "#74C69D",
      "#95D5B2", "#B7E4C7", "#D8F3DC", "#344E41", "#3A5A40",
      "#588157", "#A3B18A", "#DAD7CD", "#606C38", "#283618",
      "#DDA15E", "#BC6C25", "#7F4F24", "#936639", "#A68A64"
    ]
  },
  oceanic: {
    name: "أعماق المحيط",
    colors: [
      "#03045E", "#023E8A", "#0077B6", "#0096C7", "#00B4D8",
      "#48CAE4", "#90E0EF", "#ADE8F4", "#CAF0F8", "#1D3557",
      "#457B9D", "#A8DADC", "#006D77", "#83C5BE", "#EDF6F9",
      "#FFDDD2", "#E29578", "#003049", "#669BBC", "#C1121F"
    ]
  },
  sunset: {
    name: "غروب وشفق",
    colors: [
      "#03071E", "#370617", "#6A040F", "#9D0208", "#D00000",
      "#DC2F02", "#E85D04", "#F48C06", "#FAA307", "#FFBA08",
      "#5F0F40", "#9A031E", "#FB8B24", "#E36414", "#0F4C5C",
      "#F7B267", "#F79D65", "#F4845F", "#F27059", "#F25C54"
    ]
  },
  skinAndEarth: {
    name: "بشرة وترابي",
    colors: [
      "#FFF0E5", "#FDE2CE", "#FAD2B8", "#F3BD9C", "#E5A07A",
      "#D1855C", "#B66B43", "#945231", "#713B21", "#4F2714",
      "#EDE0D4", "#E6CCB2", "#DDB892", "#B08968", "#7F5539",
      "#9C6644", "#582F0E", "#6F4E37", "#8B7355", "#C2B280"
    ]
  },
  sakura: {
    name: "زهور الساكورا",
    colors: [
      "#590D22", "#800F2F", "#A4133C", "#C9184A", "#FF4D6D",
      "#FF758F", "#FF8FA3", "#FFB3C1", "#FFCCD5", "#FFF0F3",
      "#641220", "#6E1423", "#85182A", "#A11D33", "#B21E35",
      "#C71F37", "#DA1E37", "#E01E37", "#F2BAC9", "#BAF2E9"
    ]
  },
  neonNight: {
    name: "إضاءة نيون",
    colors: [
      "#7400B8", "#6930C3", "#5E60CE", "#5390D9", "#4EA8DE",
      "#48BFE3", "#56CFE1", "#64DFDF", "#72EFDD", "#80FFDB",
      "#F72585", "#B5179E", "#7209B7", "#560BAD", "#480CA8",
      "#3A0CA3", "#3F37C9", "#4361EE", "#4895EF", "#4CC9F0"
    ]
  },
  monochrome: {
    name: "رصاص وفحم",
    colors: [
      "#FFFFFF", "#F8F9FA", "#E9ECEF", "#DEE2E6", "#CED4DA",
      "#ADB5BD", "#8D99AE", "#6C757D", "#495057", "#343A40",
      "#212529", "#111315", "#E5E0D8", "#D0C8B8", "#B5AA96",
      "#918673", "#6E6555", "#4D4639", "#302B23", "#1A1712"
    ]
  }
};

export const PAPER_THEMES = [
  { id: "cream", name: "ورق قطني كريمي", bg: "#FAF6F0", dot: "rgba(120, 105, 90, 0.08)", sketchColor: "rgba(58, 50, 42, 0.62)" },
  { id: "warm", name: "كانسون رملي دافئ", bg: "#F2E9DC", dot: "rgba(110, 92, 74, 0.10)", sketchColor: "rgba(52, 44, 36, 0.65)" },
  { id: "cold", name: "ورق مائي أبيض ناصع", bg: "#F9FBFC", dot: "rgba(95, 115, 135, 0.07)", sketchColor: "rgba(45, 55, 65, 0.60)" },
  { id: "kraft", name: "ورق كرافت كلاسيكي", bg: "#DFC9AC", dot: "rgba(85, 68, 50, 0.12)", sketchColor: "rgba(42, 32, 22, 0.72)" },
  { id: "night", name: "لوحة ليلية داكنة", bg: "#1C1E24", dot: "rgba(255, 255, 255, 0.06)", sketchColor: "rgba(235, 230, 220, 0.65)" }
];

export const BRUSH_TOOLS = [
  {
    id: "watercolor",
    category: "paint",
    name: "فرشاة مائية",
    desc: "تدرج لوني ناعم وحواف مائية",
    minSize: 6,
    maxSize: 100,
    defaultSize: 28,
    defaultOpacity: 0.42
  },
  {
    id: "oil",
    category: "paint",
    name: "فرشاة زيتية",
    desc: "تلوين غني وكثيف عالي التغطية",
    minSize: 4,
    maxSize: 90,
    defaultSize: 20,
    defaultOpacity: 0.95
  },
  {
    id: "marker",
    category: "paint",
    name: "ماركر فني (كوبك)",
    desc: "طبقات شفافة متراكبة",
    minSize: 6,
    maxSize: 80,
    defaultSize: 24,
    defaultOpacity: 0.60
  },
  {
    id: "pastel",
    category: "paint",
    name: "طباشير باستيل",
    desc: "ملمس طباشيري دافئ للخلفيات",
    minSize: 8,
    maxSize: 85,
    defaultSize: 26,
    defaultOpacity: 0.78
  },
  {
    id: "pencil",
    category: "sketch",
    name: "قلم رصاص تخطيط",
    desc: "خط حبيبي للتفاصيل والتظليل",
    minSize: 1,
    maxSize: 32,
    defaultSize: 4,
    defaultOpacity: 0.85
  },
  {
    id: "fineliner",
    category: "sketch",
    name: "حبر تحبير سائل",
    desc: "خطوط حادة ودقيقة لتحديد الرسم",
    minSize: 1,
    maxSize: 28,
    defaultSize: 3,
    defaultOpacity: 1.0
  },
  {
    id: "calligraphy",
    category: "sketch",
    name: "ريشة خط مائلة",
    desc: "سماكة متغيرة للخطوط والزخارف",
    minSize: 4,
    maxSize: 55,
    defaultSize: 14,
    defaultOpacity: 0.96
  },
  {
    id: "charcoal",
    category: "sketch",
    name: "فحم فني داكن",
    desc: "تظليل عميق وحواف دخانية",
    minSize: 5,
    maxSize: 70,
    defaultSize: 18,
    defaultOpacity: 0.72
  },
  {
    id: "airbrush",
    category: "effect",
    name: "بخاخ إضاءة وتظليل",
    desc: "رذاذ ناعم للإضاءة والظلال",
    minSize: 15,
    maxSize: 130,
    defaultSize: 48,
    defaultOpacity: 0.28
  },
  {
    id: "neon",
    category: "effect",
    name: "قلم ضوئي متوهج",
    desc: "خطوط مضيئة بتوهج خارجي",
    minSize: 2,
    maxSize: 45,
    defaultSize: 10,
    defaultOpacity: 0.92
  },
  {
    id: "bucket",
    category: "utility",
    name: "دلو تعبئة ذكي",
    desc: "تعبئة المساحات المغلقة بضغطة",
    minSize: 1,
    maxSize: 50,
    defaultSize: 15,
    defaultOpacity: 0.92
  },
  {
    id: "line",
    category: "shape",
    name: "مسطرة خط مستقيم",
    desc: "رسم خطوط هندسية مستقيمة",
    minSize: 1,
    maxSize: 40,
    defaultSize: 4,
    defaultOpacity: 0.95
  },
  {
    id: "circle",
    category: "shape",
    name: "أداة دائرة / بيضاوي",
    desc: "رسم دوائر متناسقة بالسحب",
    minSize: 1,
    maxSize: 40,
    defaultSize: 4,
    defaultOpacity: 0.95
  },
  {
    id: "rect",
    category: "shape",
    name: "أداة إطار ومستطيل",
    desc: "رسم مستطيلات ومربعات دقيقة",
    minSize: 1,
    maxSize: 40,
    defaultSize: 4,
    defaultOpacity: 0.95
  },
  {
    id: "eyedropper",
    category: "utility",
    name: "قطارة التقاط اللون",
    desc: "اسحب أي لون موجود على اللوحة",
    minSize: 1,
    maxSize: 10,
    defaultSize: 5,
    defaultOpacity: 1
  },
  {
    id: "eraser",
    category: "utility",
    name: "ممحاة احترافية",
    desc: "مسح التلوين مع بقاء تخطيط الرصاص",
    minSize: 4,
    maxSize: 100,
    defaultSize: 26,
    defaultOpacity: 1
  }
];

// 8 رسومات تخطيط بقلم الرصاص لطور ArtWorkout التعاوني (أبعاد اللوحة 1200×800، المنتصف X=600)
export const SKETCH_TEMPLATES = [
  {
    id: "floating_islands",
    title: "الجزيرتان العائمتان والجسر الحجري",
    subtitle: "نصف اليسار: جزيرة المنارة والصنوبر | نصف اليمين: جزيرة الطاحونة والشلال",
    suggestedPalette: "pastel",
    render(ctx) {
      drawCloud(ctx, 210, 120, 75);
      drawCloud(ctx, 430, 95, 55);
      drawCloud(ctx, 770, 100, 60);
      drawCloud(ctx, 990, 130, 80);

      // شمس متوسطة تربط النصفين
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

      ctx.beginPath();
      ctx.moveTo(150, 555);
      ctx.lineTo(285, 585);
      ctx.lineTo(420, 560);
      ctx.moveTo(285, 585);
      ctx.lineTo(285, 710);
      ctx.stroke();

      // المنارة
      ctx.beginPath();
      ctx.moveTo(220, 462);
      ctx.lineTo(238, 270);
      ctx.lineTo(292, 270);
      ctx.lineTo(310, 462);
      ctx.moveTo(232, 330);
      ctx.lineTo(298, 330);
      ctx.moveTo(226, 395);
      ctx.lineTo(304, 395);
      ctx.rect(244, 238, 42, 32);
      ctx.moveTo(235, 238);
      ctx.quadraticCurveTo(265, 195, 295, 238);
      ctx.stroke();

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

      ctx.beginPath();
      ctx.moveTo(780, 560);
      ctx.lineTo(915, 585);
      ctx.lineTo(1050, 560);
      ctx.moveTo(915, 585);
      ctx.lineTo(915, 710);
      ctx.stroke();

      // الطاحونة
      ctx.beginPath();
      ctx.moveTo(885, 462);
      ctx.lineTo(902, 290);
      ctx.lineTo(968, 290);
      ctx.lineTo(985, 462);
      ctx.moveTo(895, 290);
      ctx.quadraticCurveTo(935, 245, 975, 290);
      ctx.stroke();

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

      // الشلال
      ctx.beginPath();
      ctx.moveTo(815, 465);
      ctx.bezierCurveTo(805, 560, 795, 650, 790, 760);
      ctx.moveTo(845, 465);
      ctx.bezierCurveTo(835, 560, 830, 650, 828, 760);
      ctx.stroke();

      drawRoundTree(ctx, 1035, 466, 95);

      // الجسر المعلق
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
    subtitle: "تلوين متناظر لأجنحة الفراشة الملكية والزهور المحيطة",
    suggestedPalette: "vibrant",
    render(ctx) {
      ctx.beginPath();
      ctx.ellipse(600, 390, 16, 125, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(600, 248, 20, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(592, 230);
      ctx.bezierCurveTo(560, 150, 500, 140, 485, 165);
      ctx.moveTo(608, 230);
      ctx.bezierCurveTo(640, 150, 700, 140, 715, 165);
      ctx.stroke();

      for (const dir of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(600 + dir * 15, 310);
        ctx.bezierCurveTo(600 + dir * 180, 110, 600 + dir * 460, 120, 600 + dir * 440, 295);
        ctx.bezierCurveTo(600 + dir * 425, 390, 600 + dir * 210, 415, 600 + dir * 16, 385);
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(600 + dir * 240, 265, 95, 58, dir * -0.28, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(600 + dir * 365, 225, 32, 0, Math.PI * 2);
        ctx.moveTo(600 + dir * 395, 305);
        ctx.arc(600 + dir * 375, 305, 20, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(600 + dir * 16, 395);
        ctx.bezierCurveTo(600 + dir * 250, 410, 600 + dir * 370, 520, 600 + dir * 280, 625);
        ctx.bezierCurveTo(600 + dir * 200, 695, 600 + dir * 65, 595, 600 + dir * 14, 485);
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(600 + dir * 175, 525, 65, 42, dir * 0.4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(600 + dir * 245, 585, 22, 0, Math.PI * 2);
        ctx.stroke();

        drawFlowerCluster(ctx, 600 + dir * 445, 645, dir);
        drawFlowerCluster(ctx, 600 + dir * 465, 125, dir);
      }
    }
  },
  {
    id: "cozy_street",
    title: "الشارع الأوروبي الكلاسيكي (مقهى ومكتبة)",
    subtitle: "نصف اليسار: مقهى المخبوزات | نصف اليمين: مكتبة الكتب والزهور",
    suggestedPalette: "vintage",
    render(ctx) {
      ctx.beginPath();
      ctx.moveTo(40, 665);
      ctx.lineTo(1160, 665);
      ctx.moveTo(40, 710);
      ctx.lineTo(1160, 710);
      ctx.stroke();

      ctx.beginPath();
      ctx.rect(584, 625, 32, 40);
      ctx.moveTo(595, 625);
      ctx.lineTo(595, 230);
      ctx.moveTo(605, 625);
      ctx.lineTo(605, 230);
      ctx.moveTo(555, 245);
      ctx.quadraticCurveTo(600, 205, 645, 245);
      ctx.rect(540, 245, 28, 42);
      ctx.rect(632, 245, 28, 42);
      ctx.stroke();

      // المقهى الأيسر
      ctx.beginPath();
      ctx.rect(110, 175, 420, 490);
      ctx.moveTo(95, 175);
      ctx.lineTo(145, 115);
      ctx.lineTo(495, 115);
      ctx.lineTo(545, 175);
      ctx.closePath();
      ctx.stroke();

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
      ctx.beginPath();
      ctx.rect(145, 495, 110, 170);
      ctx.rect(285, 495, 210, 120);
      ctx.stroke();

      // المكتبة اليمنى
      ctx.beginPath();
      ctx.rect(670, 175, 420, 490);
      ctx.moveTo(655, 175);
      ctx.lineTo(880, 95);
      ctx.lineTo(1105, 175);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(880, 145, 20, 0, Math.PI * 2);
      ctx.stroke();

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

      ctx.beginPath();
      ctx.rect(705, 405, 350, 46);
      ctx.rect(705, 495, 210, 120);
      ctx.rect(945, 495, 110, 170);
      ctx.stroke();

      for (let bx = 720; bx <= 890; bx += 22) {
        ctx.beginPath();
        ctx.rect(bx, 545, 18, 68);
        ctx.stroke();
      }
    }
  },
  {
    id: "coral_reef",
    title: "عالم الشعاب المرجانية والمحيط",
    subtitle: "نصف اليسار: السلحفاة البحرية | نصف اليمين: الدلفين واللؤلؤة",
    suggestedPalette: "oceanic",
    render(ctx) {
      ctx.beginPath();
      for (let x = 40; x < 1160; x += 80) {
        ctx.moveTo(x, 85);
        ctx.quadraticCurveTo(x + 40, 60, x + 80, 85);
      }
      ctx.moveTo(40, 690);
      ctx.bezierCurveTo(350, 635, 850, 730, 1160, 675);
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(600, 650, 78, 32, 0, 0, Math.PI * 2);
      ctx.moveTo(522, 650);
      ctx.bezierCurveTo(525, 545, 675, 545, 678, 650);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(600, 638, 22, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(310, 310, 115, 82, -0.22, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(310, 310, 75, 50, -0.22, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(438, 275, 36, 26, -0.2, 0, Math.PI * 2);
      ctx.moveTo(360, 238);
      ctx.quadraticCurveTo(420, 145, 330, 175);
      ctx.lineTo(310, 232);
      ctx.moveTo(375, 372);
      ctx.quadraticCurveTo(445, 455, 355, 445);
      ctx.lineTo(325, 385);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(735, 330);
      ctx.bezierCurveTo(800, 195, 985, 205, 1055, 355);
      ctx.bezierCurveTo(1080, 410, 1040, 445, 1015, 405);
      ctx.bezierCurveTo(965, 325, 845, 320, 765, 365);
      ctx.closePath();
      ctx.moveTo(895, 235);
      ctx.quadraticCurveTo(935, 165, 955, 250);
      ctx.stroke();

      drawSeaweed(ctx, 130, 680, 210);
      drawSeaweed(ctx, 220, 675, 160);
      drawSeaweed(ctx, 980, 685, 190);
      drawSeaweed(ctx, 1070, 680, 230);

      for (const [bx, by, br] of [
        [485, 235, 12], [505, 195, 18], [475, 155, 9],
        [710, 260, 14], [690, 210, 20], [725, 165, 10]
      ]) {
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  },
  {
    id: "japanese_garden",
    title: "حديقة الساكورا والجسر الياباني",
    subtitle: "نصف اليسار: معبد الباغودا وأشجار الكرز | نصف اليمين: الفوانيس الحجرية وبحيرة الكوي",
    suggestedPalette: "sakura",
    render(ctx) {
      // جبل فوجي في الخلفية بالمنتصف تماماً
      ctx.beginPath();
      ctx.moveTo(220, 490);
      ctx.quadraticCurveTo(470, 420, 555, 200);
      ctx.lineTo(645, 200);
      ctx.quadraticCurveTo(730, 420, 980, 490);
      ctx.stroke();

      // الثلج أعلى قمة الجبل
      ctx.beginPath();
      ctx.moveTo(525, 270);
      ctx.lineTo(565, 295);
      ctx.lineTo(600, 260);
      ctx.lineTo(635, 295);
      ctx.lineTo(675, 270);
      ctx.stroke();

      // الجسر المقوس في المنتصف
      ctx.beginPath();
      ctx.moveTo(410, 580);
      ctx.quadraticCurveTo(600, 455, 790, 580);
      ctx.moveTo(410, 535);
      ctx.quadraticCurveTo(600, 410, 790, 535);
      ctx.stroke();
      for (let x = 440; x <= 760; x += 40) {
        const t = (x - 410) / 380;
        const y1 = (1 - t) * (1 - t) * 535 + 2 * (1 - t) * t * 410 + t * t * 535;
        const y2 = (1 - t) * (1 - t) * 580 + 2 * (1 - t) * t * 455 + t * t * 580;
        ctx.beginPath();
        ctx.moveTo(x, y1 - 12);
        ctx.lineTo(x, y2);
        ctx.stroke();
      }

      // معبد الباغودا على اليسار
      for (let tier = 0; tier < 3; tier++) {
        const y = 430 - tier * 75;
        const w = 110 - tier * 18;
        ctx.beginPath();
        ctx.rect(240 - w / 2, y, w, 50);
        ctx.moveTo(240 - w / 2 - 28, y);
        ctx.quadraticCurveTo(240, y - 32, 240 + w / 2 + 28, y);
        ctx.stroke();
      }

      // بوابة توري والفانوس الحجري على اليمين
      ctx.beginPath();
      ctx.rect(895, 295, 16, 195);
      ctx.rect(1005, 295, 16, 195);
      ctx.moveTo(855, 275);
      ctx.quadraticCurveTo(958, 295, 1060, 275);
      ctx.moveTo(870, 325);
      ctx.lineTo(1045, 325);
      ctx.stroke();

      // أزهار الساكورا المتناثرة
      for (const [fx, fy] of [[150, 160], [360, 140], [840, 150], [1040, 175]]) {
        drawFlowerCluster(ctx, fx, fy, 1);
      }
    }
  },
  {
    id: "royal_mandala",
    title: "الزخرفة الهندسية الأندلسية المتناظرة",
    subtitle: "تلوين زخرفي دقيق ومريح للأعصاب مقسوم بالتساوي بين اللاعبين",
    suggestedPalette: "sunset",
    render(ctx) {
      const cx = 600;
      const cy = 400;
      for (const r of [60, 120, 185, 250, 320]) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      // بتلات هندسية متناظرة (16 بتلة)
      for (let i = 0; i < 16; i++) {
        const a1 = (i * Math.PI) / 8;
        const a2 = ((i + 0.5) * Math.PI) / 8;
        const a3 = ((i + 1) * Math.PI) / 8;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a1) * 60, cy + Math.sin(a1) * 60);
        ctx.quadraticCurveTo(
          cx + Math.cos(a2) * 165,
          cy + Math.sin(a2) * 165,
          cx + Math.cos(a3) * 60,
          cy + Math.sin(a3) * 60
        );
        ctx.moveTo(cx + Math.cos(a1) * 185, cy + Math.sin(a1) * 185);
        ctx.quadraticCurveTo(
          cx + Math.cos(a2) * 310,
          cy + Math.sin(a2) * 310,
          cx + Math.cos(a3) * 185,
          cy + Math.sin(a3) * 185
        );
        ctx.stroke();
      }
      // زخارف الزوايا الأربع
      for (const [zx, zy] of [[140, 140], [140, 660], [1060, 140], [1060, 660]]) {
        ctx.beginPath();
        ctx.arc(zx, zy, 65, 0, Math.PI * 2);
        ctx.moveTo(zx + 40, zy);
        ctx.arc(zx, zy, 40, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  },
  {
    id: "space_odyssey",
    title: "رحلة الفضاء والمجرة الثنائية",
    subtitle: "نصف اليسار: رائد الفضاء والمحطة المدارية | نصف اليمين: الصاروخ وكوكب زحل",
    suggestedPalette: "neonNight",
    render(ctx) {
      // بوابة نجمية في المنتصف (X = 600)
      ctx.beginPath();
      ctx.arc(600, 400, 95, 0, Math.PI * 2);
      ctx.moveTo(665, 400);
      ctx.arc(600, 400, 65, 0, Math.PI * 2);
      ctx.stroke();

      // كوكب بحلقات في اليسار العلوي
      ctx.beginPath();
      ctx.arc(260, 210, 58, 0, Math.PI * 2);
      ctx.ellipse(260, 210, 125, 28, -0.25, 0, Math.PI * 2);
      ctx.stroke();

      // مركبة/قمر صناعي في اليسار السفلي
      ctx.beginPath();
      ctx.arc(310, 540, 46, 0, Math.PI * 2);
      ctx.rect(160, 522, 95, 36);
      ctx.rect(365, 522, 95, 36);
      ctx.stroke();

      // صاروخ فضائي على اليمين
      ctx.beginPath();
      ctx.moveTo(920, 170);
      ctx.quadraticCurveTo(985, 280, 970, 460);
      ctx.lineTo(870, 460);
      ctx.quadraticCurveTo(855, 280, 920, 170);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(920, 310, 28, 0, Math.PI * 2);
      ctx.moveTo(870, 410);
      ctx.lineTo(820, 485);
      ctx.lineTo(870, 460);
      ctx.moveTo(970, 410);
      ctx.lineTo(1020, 485);
      ctx.lineTo(970, 460);
      ctx.stroke();

      // سطح القمر في الأسفل
      ctx.beginPath();
      ctx.moveTo(50, 700);
      ctx.quadraticCurveTo(600, 610, 1150, 700);
      ctx.stroke();
    }
  },
  {
    id: "tree_of_seasons",
    title: "شجرة الفصول الأربعة العملاقة",
    subtitle: "نصف اليسار: أغصان الربيع والزهور | نصف اليمين: أغصان الخريف والطيور",
    suggestedPalette: "botanical",
    render(ctx) {
      // جذع الشجرة العملاق في المنتصف تماماً (X = 600)
      ctx.beginPath();
      ctx.moveTo(520, 720);
      ctx.quadraticCurveTo(565, 560, 560, 390);
      ctx.lineTo(640, 390);
      ctx.quadraticCurveTo(635, 560, 680, 720);
      ctx.closePath();
      ctx.stroke();

      // تاج الشجرة الأيسر والأيمن
      for (const dir of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(600, 390);
        ctx.bezierCurveTo(600 + dir * 120, 290, 600 + dir * 240, 250, 600 + dir * 360, 290);
        ctx.moveTo(600, 340);
        ctx.bezierCurveTo(600 + dir * 80, 220, 600 + dir * 190, 160, 600 + dir * 280, 175);
        ctx.stroke();

        // سحب أوراق الشجر الكثيفة
        for (const [ox, oy, or] of [
          [140, 320, 85], [280, 220, 95], [390, 330, 80], [210, 160, 75]
        ]) {
          ctx.beginPath();
          ctx.arc(600 + dir * ox, oy, or, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // تلال وأعشاب في الأسفل
      ctx.beginPath();
      ctx.moveTo(50, 720);
      ctx.quadraticCurveTo(320, 660, 600, 720);
      ctx.quadraticCurveTo(880, 660, 1150, 720);
      ctx.stroke();
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

// رسم طبقة التخطيط بقلم الرصاص مع دعم لون الورق المختار
export function renderPencilTemplate(canvas, templateId, showSplitDivider = true, paperId = "cream") {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!templateId || templateId === "none") return;

  const tpl = SKETCH_TEMPLATES.find((t) => t.id === templateId) || SKETCH_TEMPLATES[0];
  const paper = PAPER_THEMES.find((p) => p.id === paperId) || PAPER_THEMES[0];

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.strokeStyle = paperId === "night" ? "rgba(255,255,255,0.18)" : "rgba(88, 78, 68, 0.20)";
  ctx.lineWidth = 3.8;
  tpl.render(ctx);

  ctx.strokeStyle = paper.sketchColor;
  ctx.lineWidth = 1.65;
  tpl.render(ctx);

  if (showSplitDivider) {
    ctx.strokeStyle = paperId === "night" ? "rgba(255,255,255,0.28)" : "rgba(120, 108, 94, 0.35)";
    ctx.lineWidth = 1.4;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 16);
    ctx.lineTo(canvas.width / 2, canvas.height - 16);
    ctx.stroke();
  }

  ctx.restore();
}
