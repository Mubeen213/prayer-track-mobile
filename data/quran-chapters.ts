const chapters = [
  {
    number: 1,
    chapter: "الفاتحة",
  },
  {
    number: 2,
    chapter: "البقرة",
  },
  {
    number: 3,
    chapter: "آل عمران",
  },
  {
    number: 4,
    chapter: "النساء",
  },
  {
    number: 5,
    chapter: "المائدة",
  },
  {
    number: 6,
    chapter: "الأنعام",
  },
  {
    number: 7,
    chapter: "الأعراف",
  },
  {
    number: 8,
    chapter: "الأنفال",
  },
  {
    number: 9,
    chapter: "التوبة",
  },
  {
    number: 10,
    chapter: "يونس",
  },
  {
    number: 11,
    chapter: "هود",
  },
  {
    number: 12,
    chapter: "يوسف",
  },
  {
    number: 13,
    chapter: "الرعد",
  },
  {
    number: 14,
    chapter: "ابراهيم",
  },
  {
    number: 15,
    chapter: "الحجر",
  },
  {
    number: 16,
    chapter: "النحل",
  },
  {
    number: 17,
    chapter: "الإسراء",
  },
  {
    number: 18,
    chapter: "الكهف",
  },
  {
    number: 19,
    chapter: "مريم",
  },
  {
    number: 20,
    chapter: "طه",
  },
  {
    number: 21,
    chapter: "الأنبياء",
  },
  {
    number: 22,
    chapter: "الحج",
  },
  {
    number: 23,
    chapter: "المؤمنون",
  },
  {
    number: 24,
    chapter: "النور",
  },
  {
    number: 25,
    chapter: "الفرقان",
  },
  {
    number: 26,
    chapter: "الشعراء",
  },
  {
    number: 27,
    chapter: "النمل",
  },
  {
    number: 28,
    chapter: "القصص",
  },
  {
    number: 29,
    chapter: "العنكبوت",
  },
  {
    number: 30,
    chapter: "الروم",
  },
  {
    number: 31,
    chapter: "لقمان",
  },
  {
    number: 32,
    chapter: "السجدة",
  },
  {
    number: 33,
    chapter: "الأحزاب",
  },
  {
    number: 34,
    chapter: "سبإ",
  },
  {
    number: 35,
    chapter: "فاطر",
  },
  {
    number: 36,
    chapter: "يس",
  },
  {
    number: 37,
    chapter: "الصافات",
  },
  {
    number: 38,
    chapter: "ص",
  },
  {
    number: 39,
    chapter: "الزمر",
  },
  {
    number: 40,
    chapter: "غافر",
  },
  {
    number: 41,
    chapter: "فصلت",
  },
  {
    number: 42,
    chapter: "الشورى",
  },
  {
    number: 43,
    chapter: "الزخرف",
  },
  {
    number: 44,
    chapter: "الدخان",
  },
  {
    number: 45,
    chapter: "الجاثية",
  },
  {
    number: 46,
    chapter: "الأحقاف",
  },
  {
    number: 47,
    chapter: "محمد",
  },
  {
    number: 48,
    chapter: "الفتح",
  },
  {
    number: 49,
    chapter: "الحجرات",
  },
  {
    number: 50,
    chapter: "ق",
  },
  {
    number: 51,
    chapter: "الذاريات",
  },
  {
    number: 52,
    chapter: "الطور",
  },
  {
    number: 53,
    chapter: "النجم",
  },
  {
    number: 54,
    chapter: "القمر",
  },
  {
    number: 55,
    chapter: "الرحمن",
  },
  {
    number: 56,
    chapter: "الواقعة",
  },
  {
    number: 57,
    chapter: "الحديد",
  },
  {
    number: 58,
    chapter: "المجادلة",
  },
  {
    number: 59,
    chapter: "الحشر",
  },
  {
    number: 60,
    chapter: "الممتحنة",
  },
  {
    number: 61,
    chapter: "الصف",
  },
  {
    number: 62,
    chapter: "الجمعة",
  },
  {
    number: 63,
    chapter: "المنافقون",
  },
  {
    number: 64,
    chapter: "التغابن",
  },
  {
    number: 65,
    chapter: "الطلاق",
  },
  {
    number: 66,
    chapter: "التحريم",
  },
  {
    number: 67,
    chapter: "الملك",
  },
  {
    number: 68,
    chapter: "القلم",
  },
  {
    number: 69,
    chapter: "الحاقة",
  },
  {
    number: 70,
    chapter: "المعارج",
  },
  {
    number: 71,
    chapter: "نوح",
  },
  {
    number: 72,
    chapter: "الجن",
  },
  {
    number: 73,
    chapter: "المزمل",
  },
  {
    number: 74,
    chapter: "المدثر",
  },
  {
    number: 75,
    chapter: "القيامة",
  },
  {
    number: 76,
    chapter: "الانسان",
  },
  {
    number: 77,
    chapter: "المرسلات",
  },
  {
    number: 78,
    chapter: "النبإ",
  },
  {
    number: 79,
    chapter: "النازعات",
  },
  {
    number: 80,
    chapter: "عبس",
  },
  {
    number: 81,
    chapter: "التكوير",
  },
  {
    number: 82,
    chapter: "الإنفطار",
  },
  {
    number: 83,
    chapter: "المطففين",
  },
  {
    number: 84,
    chapter: "الإنشقاق",
  },
  {
    number: 85,
    chapter: "البروج",
  },
  {
    number: 86,
    chapter: "الطارق",
  },
  {
    number: 87,
    chapter: "الأعلى",
  },
  {
    number: 88,
    chapter: "الغاشية",
  },
  {
    number: 89,
    chapter: "الفجر",
  },
  {
    number: 90,
    chapter: "البلد",
  },
  {
    number: 91,
    chapter: "الشمس",
  },
  {
    number: 92,
    chapter: "الليل",
  },
  {
    number: 93,
    chapter: "الضحى",
  },
  {
    number: 94,
    chapter: "الشرح",
  },
  {
    number: 95,
    chapter: "التين",
  },
  {
    number: 96,
    chapter: "العلق",
  },
  {
    number: 97,
    chapter: "القدر",
  },
  {
    number: 98,
    chapter: "البينة",
  },
  {
    number: 99,
    chapter: "الزلزلة",
  },
  {
    number: 100,
    chapter: "العاديات",
  },
  {
    number: 101,
    chapter: "القارعة",
  },
  {
    number: 102,
    chapter: "التكاثر",
  },
  {
    number: 103,
    chapter: "العصر",
  },
  {
    number: 104,
    chapter: "الهمزة",
  },
  {
    number: 105,
    chapter: "الفيل",
  },
  {
    number: 106,
    chapter: "قريش",
  },
  {
    number: 107,
    chapter: "الماعون",
  },
  {
    number: 108,
    chapter: "الكوثر",
  },
  {
    number: 109,
    chapter: "الكافرون",
  },
  {
    number: 110,
    chapter: "النصر",
  },
  {
    number: 111,
    chapter: "المسد",
  },
  {
    number: 112,
    chapter: "الإخلاص",
  },
  {
    number: 113,
    chapter: "الفلق",
  },
  {
    number: 114,
    chapter: "الناس",
  },
];

export default chapters;
