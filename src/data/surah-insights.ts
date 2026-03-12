/**
 * Comprehensive surah insights — deep scholarly content in accessible language.
 * V2: Full structure with historical context, surah flow, vocabulary, stories, connections, and more.
 */

/* ─── Types ─── */

export interface HistoricalContext {
  period: string;
  chronologicalOrder: number;
  background: string;
  occasionOfRevelation: string;
}

export interface CoreMessage {
  thesis: string;
  emotionalArc: string;
  buildUp: string;
}

export interface SurahSection {
  verseRange: string;
  title: string;
  summary: string;
  connectionToNext: string;
}

export interface KeyWord {
  arabic: string;
  transliteration: string;
  surfaceMeaning: string;
  deeperMeaning: string;
}

export interface Story {
  title: string;
  verseRange: string;
  narrative: string;
  lesson: string;
  connectionToMessage: string;
}

export interface Connection {
  surah: number;
  surahName: string;
  relationship: string;
}

export interface NotableVerse {
  ayah: number;
  arabic: string;
  translation: string;
  tafsirExcerpt: string;
  linguisticNote: string;
  practicalApplication: string;
  relatedHadith: string;
}

export interface LessonGroup {
  category: string;
  points: string[];
}

export interface SurahInsight {
  surah: number;
  historicalContext: HistoricalContext;
  audience: string;
  coreMessage: CoreMessage;
  sections: SurahSection[];
  keyVocabulary: KeyWord[];
  stories: Story[];
  connections: Connection[];
  notableVerses: NotableVerse[];
  lessons: LessonGroup[];
  scholarlyNotes: string;
}

/* ─── Data ─── */

export const SURAH_INSIGHTS: Record<number, SurahInsight> = {

  /* ═══════════════════════════════════════════════════════════════
     1 · AL-FATIHAH — The Opening
     ═══════════════════════════════════════════════════════════════ */
  1: {
    surah: 1,

    historicalContext: {
      period: "Early Meccan",
      chronologicalOrder: 5,
      background:
        "Al-Fatihah was revealed in the earliest days of Islam in Makkah, making it one of the first complete surahs the Prophet ﷺ received. At this point, the Muslim community was tiny — just a handful of believers meeting in secret at the house of Al-Arqam. There was no formal prayer structure yet, no public worship, no community. The Quraysh were the dominant power, and idol worship was the norm. Into this environment, Allah sent down a surah that would become the single most-recited passage in human history — a prayer that defines the entire relationship between the Creator and His creation. It was as if, before giving any laws or stories or warnings, Allah first taught humanity how to talk to Him.",
      occasionOfRevelation:
        "There is scholarly discussion about whether Al-Fatihah was revealed in Makkah or Madinah, but the majority opinion (held by Ibn Abbas, Qatadah, and Abu al-Aliyah) is that it was revealed in Makkah. Some scholars say it was revealed twice — once in Makkah and once in Madinah — which is why it is also called 'Al-Mathani' (the oft-repeated). The Prophet ﷺ was instructed to recite it in every unit of prayer, making it the only surah with this obligation. Jibreel (Gabriel) himself came to teach the Prophet ﷺ how to pray with it.",
    },

    audience:
      "Al-Fatihah is unique because it is not Allah speaking to humanity — it is humanity speaking to Allah. Every other surah is revelation coming down; Al-Fatihah is a prayer going up. The 'we' in 'Guide us' is deliberately plural — you are never praying alone, even when you stand in prayer by yourself. You are joining the collective voice of every believer who has ever lived. The first half (verses 1-4) is praise directed at Allah, and the second half (verses 5-7) is a request from the servant. In a hadith qudsi, Allah says: 'I have divided the prayer between Myself and My servant into two halves, and My servant shall have what he asks for.'",

    coreMessage: {
      thesis:
        "Before you ask Allah for anything, you must first understand who He is (the Lord, the Merciful, the Master of Judgment Day), what your relationship to Him is (total dependence), and only then are you qualified to make the greatest request possible: guidance to the straight path.",
      emotionalArc:
        "The surah moves from awe and gratitude (praising Allah's lordship and mercy) → to sobriety (remembering the Day of Judgment) → to humility (declaring complete dependence) → to hope (asking for guidance) → to awareness (recognizing that paths diverge, and you're asking to be on the right one).",
      buildUp:
        "The structure is deliberate and cannot be rearranged. You begin with Allah's name (Bismillah), then praise Him as Lord of everything that exists (verse 2), then acknowledge His mercy as His defining quality (verse 3), then face the reality of accountability (verse 4). Only after this progression — awe, mercy, accountability — do you arrive at the turning point in verse 5: 'You alone we worship, You alone we ask for help.' Now that the relationship is properly established, you're ready to make your request in verse 6: guide us. And verse 7 clarifies what that guidance looks like — the path of those who earned Your favor, not those who went astray.",
    },

    sections: [
      {
        verseRange: "1",
        title: "The Basmala — Beginning with Allah's Name",
        summary:
          "Bismillah-ir-Rahman-ir-Rahim. Before anything else — before praise, before request, before any act — you begin by invoking Allah's name and His two most emphasized attributes: Rahman (universally merciful to all creation) and Rahim (specifically merciful to the believers). This isn't just a formula; it's a worldview. Every action, every endeavor, every breath starts with the recognition that you operate within Allah's mercy, not your own power. The scholars debated whether the Basmala is a verse of Al-Fatihah (the Shafi'i position) or a separate opening (the Hanafi position), but all agree it is recited before the surah.",
        connectionToNext: "Having invoked Allah's name, you now turn to praising Him directly.",
      },
      {
        verseRange: "2",
        title: "Universal Praise — Lord of All Worlds",
        summary:
          "Al-hamdu lillahi Rabb-il-'Alamin. 'All praise belongs to Allah, Lord of all the worlds.' The word 'Rabb' is often translated as 'Lord,' but its Arabic meaning is far richer — it means the one who creates, sustains, nourishes, develops, and brings to maturity. A 'Rabb' doesn't just make something and leave it; He actively nurtures it at every stage. And this lordship isn't limited — it covers 'al-Alamin,' all the worlds: the world of humans, jinn, angels, animals, plants, galaxies, dimensions we don't even know about. The scope is total. By saying this verse, you're acknowledging that everything in existence is under His care, including you.",
        connectionToNext: "After recognizing His lordship over everything, you zoom into His most prominent quality.",
      },
      {
        verseRange: "3",
        title: "The Mercy Emphasis",
        summary:
          "Ar-Rahman-ir-Rahim. Allah chooses to re-emphasize His mercy immediately after His lordship. He could have highlighted His power, His knowledge, His majesty — but He chose mercy. Rahman is an intensive form meaning 'the one whose mercy encompasses everything right now' (a present, active, overwhelming mercy). Rahim means 'the one who will show specific mercy to those who seek it' (a future, targeted, earned mercy). The repetition from the Basmala is intentional — mercy is the lens through which everything else should be understood. Even when the Quran warns of punishment, it is framed within this: the default is mercy.",
        connectionToNext: "But mercy doesn't mean there are no consequences — which is why the next verse introduces accountability.",
      },
      {
        verseRange: "4",
        title: "The Day of Accountability",
        summary:
          "Maliki Yawm-id-Din. 'Master of the Day of Judgment.' After two verses of comfort (lordship and mercy), this verse introduces gravity. There is a Day when every action will be weighed. The word 'Malik' (Master/Owner/King) means Allah has absolute authority on that Day — no one else has any power, no one can intercede without His permission, no wealth or status matters. This verse prevents the previous emphasis on mercy from becoming complacency. Yes, Allah is merciful — but that mercy exists within a system of justice. You will be held accountable. This balance between hope (mercy) and fear (judgment) is the emotional foundation of Islamic spirituality.",
        connectionToNext: "Now that you understand who Allah is — Lord, Merciful, Judge — you're ready to define your relationship to Him.",
      },
      {
        verseRange: "5",
        title: "The Declaration — The Pivot of the Entire Surah",
        summary:
          "Iyyaka na'budu wa iyyaka nasta'in. 'You alone we worship, and You alone we ask for help.' This is the exact center of the surah and the most important sentence in Islamic theology. The Arabic structure is unusual — the object ('You') comes before the verb ('we worship'), which in Arabic grammar creates exclusivity. It doesn't just mean 'we worship You'; it means 'You and ONLY You do we worship.' The same structure repeats for seeking help. This is tawhid (monotheism) compressed into one verse. It's also a declaration of dependence — you can't even worship properly without His help, which is why 'we ask for help' immediately follows 'we worship.' Worship and seeking help are inseparable.",
        connectionToNext: "Having declared total dependence, you now make your one request.",
      },
      {
        verseRange: "6",
        title: "The Request — Guide Us",
        summary:
          "Ihdina-s-Sirat-al-Mustaqim. 'Guide us to the straight path.' After all that preamble — praise, mercy, judgment, declaration of worship — the actual request is remarkably simple: guide us. Not 'make us rich,' not 'destroy our enemies,' not 'give us power.' Just: guide us. The word 'ihdina' (guide us) in Arabic implies not just showing the way but actively leading someone along it, keeping them on it, and helping them progress further on it. Even if you're already on the path, you ask for more guidance — to go deeper, to not deviate, to stay firm. 'Sirat' (path) comes from a root meaning a wide, clear road — not a tightrope. The straight path isn't impossibly narrow; it's a broad road that's clear to anyone who genuinely looks for it.",
        connectionToNext: "But what does this path actually look like? The final verse answers by example.",
      },
      {
        verseRange: "7",
        title: "The Path Defined by Its Travelers",
        summary:
          "Sirat-alladhina an'amta 'alayhim, ghayril-maghdubi 'alayhim wa lad-dallin. 'The path of those You have blessed — not of those who earned Your anger, nor of those who went astray.' Instead of defining the straight path abstractly, Allah defines it by the people who walk it: the prophets, the truthful, the martyrs, the righteous (as Surah An-Nisa 4:69 elaborates). Then He contrasts it with two types of deviation — those who knew the truth but rebelled against it (earning anger), and those who lost the truth through ignorance or carelessness (going astray). Knowledge without action, and action without knowledge — both miss the path. You need both: to know the truth and to live by it.",
        connectionToNext: "",
      },
    ],

    keyVocabulary: [
      {
        arabic: "رَبّ",
        transliteration: "Rabb",
        surfaceMeaning: "Lord",
        deeperMeaning:
          "The one who creates, owns, sustains, nourishes, and develops something from its beginning to its completion. Unlike 'Ilah' (God to be worshipped), 'Rabb' emphasizes the nurturing, caregiving aspect of Allah. A parent raises a child — Allah is the Rabb of all existence.",
      },
      {
        arabic: "ٱلرَّحْمَـٰن",
        transliteration: "Ar-Rahman",
        surfaceMeaning: "The Most Merciful",
        deeperMeaning:
          "An intensive form (fa'lan pattern) indicating an overwhelming, all-encompassing mercy that covers every creature right now — believer or not, human or not. It's a mercy built into the fabric of creation itself: the air you breathe, the food that grows, the sun that rises — all Rahman.",
      },
      {
        arabic: "ٱلرَّحِيم",
        transliteration: "Ar-Rahim",
        surfaceMeaning: "The Especially Merciful",
        deeperMeaning:
          "A form (fa'il pattern) indicating a deliberate, specific mercy directed at those who seek it. While Rahman is the rain that falls on everyone, Rahim is the shade given specifically to the one who comes under it. This is the mercy of guidance, forgiveness, and paradise.",
      },
      {
        arabic: "ٱلصِّرَٰط ٱلْمُسْتَقِيم",
        transliteration: "As-Sirat al-Mustaqim",
        surfaceMeaning: "The Straight Path",
        deeperMeaning:
          "Sirat comes from a root meaning a clear, broad road — not a narrow tightrope. Mustaqim means upright, balanced, unwavering. Together they describe a way of life that is clear, direct, and consistent. It's not about never making mistakes — it's about always knowing which direction to face. Ibn al-Qayyim described it as the shortest distance between you and Allah.",
      },
      {
        arabic: "نَعْبُدُ",
        transliteration: "Na'budu",
        surfaceMeaning: "We worship",
        deeperMeaning:
          "From 'ibadah' — which doesn't just mean ritual prayer or fasting. 'Ibadah is anything done with the intention of pleasing Allah: your work, your kindness to your neighbor, how you treat your spouse, how you handle anger. The entire life becomes worship when the intention is right.",
      },
    ],

    stories: [],

    connections: [
      {
        surah: 2,
        surahName: "Al-Baqarah",
        relationship:
          "Al-Fatihah asks 'Guide us to the straight path' — Al-Baqarah opens with 'This is the Book in which there is no doubt, a guidance for the God-conscious.' The entire Quran is the answer to Al-Fatihah's prayer. Al-Fatihah is the question; the rest of the Quran is the answer.",
      },
      {
        surah: 4,
        surahName: "An-Nisa",
        relationship:
          "Verse 7 of Al-Fatihah mentions 'those You have blessed.' An-Nisa 4:69 defines exactly who they are: 'the prophets, the truthful, the martyrs, and the righteous — and what excellent companions they are.'",
      },
      {
        surah: 17,
        surahName: "Al-Isra",
        relationship:
          "Al-Fatihah is called 'As-Sab' al-Mathani' (the seven oft-repeated verses). This title appears in Al-Isra 17:87 and Al-Hijr 15:87, confirming its unique status as the most recited passage of the Quran.",
      },
    ],

    notableVerses: [
      {
        ayah: 2,
        arabic: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ",
        translation: "All praise is due to Allah, Lord of all the worlds.",
        tafsirExcerpt:
          "Ibn Kathir explains that 'al-hamd' encompasses both praise and gratitude — it is praising Allah for who He is (His attributes) AND thanking Him for what He does (His blessings). The definite article 'al' before 'hamd' means ALL praise, in its entirety, in every form, belongs to Allah. Even when you praise a person for something good, the ultimate praise returns to Allah who gave them that quality.",
        linguisticNote:
          "The sentence is nominal (jumlah ismiyyah) rather than verbal, which in Arabic indicates permanence and constancy. Praise for Allah isn't an event that happened; it is an eternal, unchanging reality. Also, 'lillahi' uses the 'lam' of possession — praise BELONGS to Allah by right, whether anyone offers it or not.",
        practicalApplication:
          "Begin everything with hamd — not just prayers, but conversations, meals, tasks. The Prophet ﷺ said: 'Any matter of importance that does not begin with al-hamdulillah is cut off (from blessing).' It's a mindset: before you see what's wrong in your life, acknowledge what's right.",
        relatedHadith:
          "The Prophet ﷺ said: 'The best dhikr (remembrance) is La ilaha illallah, and the best dua (supplication) is Al-hamdulillah.' (Tirmidhi). He also said: 'Allah is pleased with a servant who eats a morsel and praises Him for it, or drinks a sip and praises Him for it.' (Muslim)",
      },
      {
        ayah: 5,
        arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
        translation: "You alone we worship, and You alone we ask for help.",
        tafsirExcerpt:
          "Ibn Kathir calls this verse the essence of the entire Quran. The first half is a covenant from the servant to Allah (I will worship only You), and the second half is a request for Allah to fulfill His promise (help me do it). Al-Tabari notes that this verse refutes every form of shirk — you cannot worship Allah while relying on something else for your ultimate help. Ibn al-Qayyim wrote that this single verse, if truly understood and lived, would be sufficient for a person's entire spiritual life.",
        linguisticNote:
          "The object 'Iyyaka' (You) is placed before the verb 'na'budu' (we worship). In Arabic grammar, this fronting (taqdim) creates hasr — exclusivity and emphasis. It doesn't just mean 'we worship You'; it means 'it is You and ONLY You that we worship.' This structure appears twice, making the exclusivity absolute for both worship and seeking help.",
        practicalApplication:
          "This verse is your daily reset against all forms of dependence on other than Allah. When you feel anxious about a job interview, a medical result, or someone's approval — this verse recalibrates: the help comes from Allah, through whatever means He chooses. Rely on the Source, not the means.",
        relatedHadith:
          "The Prophet ﷺ said to Ibn Abbas: 'If the entire nation gathered to benefit you with something, they could not benefit you except with what Allah has already written for you. And if they gathered to harm you, they could not harm you except with what Allah has already written against you.' (Tirmidhi) — a direct commentary on the meaning of 'You alone we ask for help.'",
      },
      {
        ayah: 6,
        arabic: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ",
        translation: "Guide us to the straight path.",
        tafsirExcerpt:
          "Al-Tabari collects multiple interpretations of 'the straight path': it is Islam, it is the Quran, it is the Prophet ﷺ himself, it is the truth. All of these are correct — they are different facets of the same reality. Ibn al-Qayyim adds that 'guidance' has four levels: (1) general guidance given to all creation (instincts, natural order), (2) guidance of explanation (sending prophets and books), (3) guidance of tawfiq (the internal push to accept and act on truth), and (4) guidance in the Hereafter (to Paradise). When you say 'ihdina,' you are asking for all four.",
        linguisticNote:
          "The verb 'ihdina' can mean: show us the path, lead us onto the path, keep us on the path, and take us further along the path. All four meanings apply simultaneously. This is why even the most righteous person still says this prayer — there is always a higher level of guidance to seek. The path has no ceiling.",
        practicalApplication:
          "You say this at least 17 times a day in your five prayers. Treat it as a real request, not a recitation. Each time you say it, you're asking: keep me on track today, in this specific situation, with this specific challenge I'm facing. Make it personal every time.",
        relatedHadith:
          "The Prophet ﷺ used to make this dua: 'O Turner of hearts, keep my heart firm upon Your religion.' Umm Salamah asked why he made this dua so frequently, and he said: 'There is no human being except that his heart is between two fingers of Allah — He turns it however He wills.' (Tirmidhi) — showing that guidance is never guaranteed and must be continuously sought.",
      },
    ],

    lessons: [
      {
        category: "Personal Faith",
        points: [
          "Your relationship with Allah has a structure: first you know Him (verses 1-4), then you commit to Him (verse 5), then you ask from Him (verses 6-7). Skipping steps leads to a shallow faith.",
          "You need guidance every single day — not because you're lost, but because the path has infinite depth. A scholar needs guidance as much as a beginner, just at a different level.",
          "Mercy is Allah's defining attribute — He chose to emphasize it before power, knowledge, or sovereignty. Approach Him with hope, not just fear.",
        ],
      },
      {
        category: "Daily Practice",
        points: [
          "You recite Al-Fatihah 17+ times a day in obligatory prayers alone. If you understood it deeply, your entire salah would transform from routine to conversation.",
          "The Prophet ﷺ said: 'There is no prayer for the one who does not recite Al-Fatihah.' Invest time in understanding every word — it's the one surah you literally cannot skip.",
          "Start your day, your meals, your tasks with 'Alhamdulillah' — the surah teaches that praise comes before everything else.",
        ],
      },
      {
        category: "Worldview",
        points: [
          "Two types of people miss the path: those who know the truth but refuse it, and those who are sincere but misguided. You need both knowledge AND sincerity.",
          "The prayer is in the plural ('guide US') — Islam is not a solo journey. You're always part of a community, even in your most private worship.",
          "The entire Quran is the answer to 'Guide us.' When you open the Quran, you're reading Allah's response to the prayer you just made in Al-Fatihah.",
        ],
      },
    ],

    scholarlyNotes:
      "There are several scholarly discussions around Al-Fatihah worth noting. First, the question of whether 'Bismillah' is a verse of the surah (Shafi'i and Hanbali position) or a separate basmala (Hanafi and Maliki position) — this affects whether Al-Fatihah has 6 or 7 verses, and whether the Basmala is recited aloud in prayer. Second, the reading of verse 4 — 'Maliki' (King/Owner) vs 'Maliki' (Master/Sovereign) are both authentic qira'at (recitation styles) with slightly different theological emphases: ownership vs authority. Third, scholars have noted that saying 'Ameen' after Al-Fatihah is a sunnah, not part of the surah itself, and it means 'O Allah, answer our prayer.' The Prophet ﷺ said: 'When the Imam says Ameen, say Ameen, for whoever's Ameen coincides with the Ameen of the angels will have all their past sins forgiven.' (Bukhari)",
  },

  /* ═══════════════════════════════════════════════════════════════
     18 · AL-KAHF — The Cave
     ═══════════════════════════════════════════════════════════════ */
  18: {
    surah: 18,

    historicalContext: {
      period: "Late Meccan",
      chronologicalOrder: 69,
      background:
        "Al-Kahf was revealed during a critical period in Makkah when the Quraysh were actively trying to discredit the Prophet ﷺ. They had sent two of their men — An-Nadr ibn al-Harith and Uqbah ibn Abi Mu'ayt — to the Jewish rabbis in Madinah to get test questions that only a true prophet could answer. The rabbis told them: 'Ask him about three things. Ask about young men who disappeared in ancient times — what was their story? Ask about a man who traveled to the ends of the earth — what happened to him? And ask about the soul — what is it?' The Quraysh came back and posed these questions to the Prophet ﷺ. He said, 'I will tell you tomorrow,' but did not say 'Insha'Allah' (God willing). Revelation paused for fifteen days. The Quraysh mocked him, saying his God had abandoned him. Then Jibreel came with this surah — answering all three questions and gently correcting the Prophet ﷺ for not saying 'Insha'Allah,' which is addressed directly in verse 23-24.",
      occasionOfRevelation:
        "Beyond the specific trigger, Al-Kahf served a broader purpose. The Meccan Muslims were living as a persecuted minority — much like the youth of the cave. They needed reassurance that standing firm in faith, even when surrounded by a hostile majority, was the right path. Each of the four stories in the surah addresses a specific trial that every generation faces: the trial of faith (the cave), wealth (the two gardens), knowledge (Musa and Al-Khidr), and power (Dhul-Qarnayn). The Prophet ﷺ later gave this surah special status: 'Whoever recites Surah Al-Kahf on Friday, a light will shine for him between the two Fridays.' (Nasa'i)",
    },

    audience:
      "The surah shifts between multiple audiences. It opens addressing the Prophet ﷺ directly — 'Praise be to Allah who sent down the Book' — then speaks to the believers through the story of the cave youth, warning them about the temptations of this world. The parable of the two garden owners is aimed at the wealthy and arrogant. The Musa-Khidr story addresses those who think they know everything. And the Dhul-Qarnayn narrative speaks to anyone given power and authority. By the end, the surah addresses all of humanity: 'Say, I am only a man like you, to whom it has been revealed that your god is one God.' The genius of Al-Kahf is that no matter who you are — poor or rich, scholar or student, ruler or citizen — one of these four stories is directly about your situation.",

    coreMessage: {
      thesis:
        "This world is a temporary test decorated to look permanent. Every human faces four fundamental trials — threats to faith, seduction of wealth, limits of knowledge, and corruption of power. Al-Kahf teaches you how to pass each one: hold firm to faith even if you must flee, stay humble with wealth and attribute it to Allah, accept that your knowledge is always limited, and use power to serve justice, not yourself.",
      emotionalArc:
        "The surah moves through four emotional registers: (1) courage and sacrifice with the cave youth, (2) warning and loss with the garden parable, (3) humility and wonder with Musa's journey, and (4) justice and resolve with Dhul-Qarnayn. It opens with urgency ('warn those who say Allah has taken a son') and closes with intimacy ('whoever hopes for the meeting with his Lord, let him do righteous work'). The overall arc is from external trials to internal purification.",
      buildUp:
        "The surah is architecturally brilliant. It begins by establishing the Quran's authority (verses 1-8), then presents four stories in ascending scale: a small group hiding in a cave → an individual with his garden → a prophet's personal journey → a king spanning the globe. Between each story, Allah inserts direct commentary — reminders about the fleeting nature of this world, the reality of the Hereafter, and the danger of Iblis. The four stories are bookended by the same theme: this world is decoration (verse 7 and verse 46), and only deeds done for Allah's sake will last.",
    },

    sections: [
      {
        verseRange: "1-8",
        title: "Opening — The Quran's Authority & This World's Reality",
        summary:
          "The surah opens with praise for the Quran as a book with 'no crookedness' — it is straight, clear, and unapologetic. It warns those who claim 'Allah has taken a son' (a statement they make with no knowledge). Then comes the critical framing verse: 'Indeed, We have made that which is on the earth an adornment for it, that We may test them as to which of them is best in deed.' This one verse is the thesis of the entire surah. Everything on earth — beauty, wealth, power, knowledge — is decoration for a test. The surah then says: 'And indeed, We will make what is on it into a barren ground.' Everything you see will be stripped away. With this frame set, the four stories begin.",
        connectionToNext: "The first test is introduced: can you hold onto faith when everything around you pressures you to let go?",
      },
      {
        verseRange: "9-26",
        title: "Story 1: The Sleepers of the Cave — Trial of Faith",
        summary:
          "A group of young men in a polytheistic society realize the truth of monotheism and face a choice: conform to their people or flee. They choose to flee to a cave, trusting Allah completely. 'Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance' (verse 10) — this becomes their prayer. Allah puts them to sleep for 309 years. When they wake, the world has changed — their society has become believing. The story is filled with deliberate ambiguity: 'They were three, the fourth being their dog... five, the sixth being their dog... seven, and the eighth their dog' (verse 22). Allah then says: 'Say, my Lord knows best their number.' The exact number doesn't matter. What matters is their choice and Allah's response to it. The details about their dog, the direction of the sun, their turning in sleep — all show how precisely Allah cared for them once they committed to Him.",
        connectionToNext: "After showing how to protect your faith, Allah addresses the next trial: what happens when you're blessed with wealth?",
      },
      {
        verseRange: "27-44",
        title: "Story 2: The Two Gardens — Trial of Wealth",
        summary:
          "A man is given two lush gardens with rivers flowing through them, producing abundant fruit. Instead of gratitude, he becomes arrogant: 'I do not think this will ever perish, and I do not think the Hour will occur. And even if I am returned to my Lord, I will surely find better than this.' His companion (a believing friend) challenges him: 'Do you disbelieve in He who created you from dust, then from a sperm-drop, then proportioned you as a man?' The companion says the words that Al-Kahf teaches us to say when we see something we admire: 'Masha'Allah, la quwwata illa billah' — What Allah has willed; there is no power except through Allah (verse 39). Then Allah destroys the gardens overnight. The man is left wringing his hands: 'I wish I had not associated with my Lord anyone' (verse 42). But it's too late.",
        connectionToNext: "Allah inserts a powerful interlude (verses 45-46) comparing worldly life to rain that makes plants grow, then they become dry stubble scattered by wind. Then the third trial begins.",
      },
      {
        verseRange: "45-59",
        title: "Interlude — The Parable of Worldly Life + Warning",
        summary:
          "Between the second and third stories, Allah gives one of the most vivid parables in the Quran: 'And present to them the example of the life of this world: it is like rain which We send down from the sky, and the vegetation of the earth mingles with it and then becomes dry remnants, scattered by the winds. And Allah is Prevailing over all things.' Then: 'Wealth and children are the adornment of the worldly life. But the enduring good deeds are better to your Lord for reward and better for hope.' This interlude is not filler — it's the interpretive key connecting all four stories.",
        connectionToNext: "Now comes the most mysterious and challenging story: what happens when you think your knowledge is complete?",
      },
      {
        verseRange: "60-82",
        title: "Story 3: Musa and Al-Khidr — Trial of Knowledge",
        summary:
          "Prophet Musa — one of the greatest prophets who spoke directly to Allah — is told there is a servant of Allah who knows things Musa doesn't. Musa's humility drives him to seek this man out, despite his own enormous stature. He finds Al-Khidr and asks to follow him. Al-Khidr warns: 'You will never be able to have patience with me. And how can you have patience about what you do not encompass in knowledge?' Three events follow: Al-Khidr damages a boat, kills a young boy, and rebuilds a wall for free in a hostile town. Each time, Musa objects — because on the surface, these actions seem wrong. But Al-Khidr reveals the hidden wisdom: the boat was damaged to save it from a tyrant king who seized all good boats; the boy would have grown to drive his righteous parents to disbelief, so Allah would replace him with a better child; the wall hid treasure belonging to orphans, and if it collapsed before they grew up, the hostile townspeople would have stolen it.",
        connectionToNext: "After learning that divine wisdom transcends human understanding, the surah presents the final trial: how do you handle absolute power?",
      },
      {
        verseRange: "83-98",
        title: "Story 4: Dhul-Qarnayn — Trial of Power",
        summary:
          "Dhul-Qarnayn is given power and means to travel the earth. He goes west (finds a people at the setting sun — deals with them justly), goes east (finds a people with no shelter from the sun — leaves them be), then goes north and finds a people being terrorized by Yajuj and Majuj (Gog and Magog). They beg him for help and offer payment. He refuses the money — 'What my Lord has established for me is better' — and instead asks them to bring raw materials. He uses their labor and his resources to build an iron wall, sealed with molten copper, that blocks the invaders. Then he says: 'This is a mercy from my Lord, but when the promise of my Lord comes, He will make it level. And the promise of my Lord is ever true.' Even after building a massive structure, he attributes it to Allah and acknowledges it's temporary. Power used correctly: justly, selflessly, and with full awareness that even your greatest achievements are from Allah and will return to dust.",
        connectionToNext: "The surah closes by bringing everything back to the central message.",
      },
      {
        verseRange: "99-110",
        title: "Closing — The Hereafter & The Final Instruction",
        summary:
          "The surah ends with scenes of the Day of Judgment — the trumpet is blown, hell is brought forward, and those who ignored Allah's signs will face the consequences. Then comes the beautiful final verse: 'Say, I am only a man like you, to whom it has been revealed that your god is one God. So whoever hopes for the meeting with his Lord, let him do righteous work and not associate in the worship of his Lord anyone.' The entire surah — all four stories, all the trials — distills into this: do good work, and keep it purely for Allah. That's how you pass every test.",
        connectionToNext: "",
      },
    ],

    keyVocabulary: [
      {
        arabic: "فِتْنَة",
        transliteration: "Fitnah",
        surfaceMeaning: "Trial / Test",
        deeperMeaning:
          "Originally means melting gold to separate pure metal from impurities. When Allah tests you, He is purifying you — burning away what's false to reveal what's real. Every story in Al-Kahf is a fitnah: faith, wealth, knowledge, and power are all forms of purification.",
      },
      {
        arabic: "زِينَة",
        transliteration: "Zinah",
        surfaceMeaning: "Adornment / Decoration",
        deeperMeaning:
          "Used in verse 7 and 46 to describe everything on earth. Zinah is something beautiful placed on top of something else — like jewelry on a body. This world's pleasures are decoration on a test. They're real and beautiful, but they're not the substance. The substance is underneath: your deeds, your character, your relationship with Allah.",
      },
      {
        arabic: "مَا شَاءَ ٱللَّهُ",
        transliteration: "Masha'Allah",
        surfaceMeaning: "What Allah has willed",
        deeperMeaning:
          "This phrase originates from Al-Kahf 18:39, spoken by the believing companion to the arrogant garden owner. It's a recognition that everything good you have is from Allah's will, not your own cleverness. Saying it sincerely is a protection against the evil eye and against your own arrogance. It re-attributes blessings to their true source.",
      },
      {
        arabic: "صَبْر",
        transliteration: "Sabr",
        surfaceMeaning: "Patience",
        deeperMeaning:
          "Al-Khidr tells Musa he won't be able to have 'sabr.' In Arabic, sabr literally means to restrain or hold yourself back. It's not passive waiting — it's actively restraining your impulse to react, judge, or quit when you don't understand what's happening. Sabr is trusting the process even when the process makes no sense to you.",
      },
      {
        arabic: "رُشْد",
        transliteration: "Rushd",
        surfaceMeaning: "Right guidance",
        deeperMeaning:
          "The cave youth ask Allah for 'rushd' (verse 10). This is different from 'huda' (general guidance). Rushd means maturity of judgment — the ability to discern right from wrong and act on it. It implies not just knowing the right path but having the internal strength and wisdom to take it. They weren't asking to be shown the way; they were asking for the character to walk it.",
      },
    ],

    stories: [
      {
        title: "The Sleepers of the Cave (Ashab al-Kahf)",
        verseRange: "9-26",
        narrative:
          "In a city dominated by idol worship, a group of young men — tradition says between 3 and 7 — came to realize that their people's religion was false. 'Our Lord is the Lord of the heavens and the earth. Never will we invoke besides Him any deity. We would have certainly spoken then an excessive transgression' (verse 14). They faced an impossible choice: stay and be forced to worship idols (or worse, be killed), or leave everything — family, homes, status — for Allah's sake. They chose to flee to a cave in the mountains. Inside, they made a simple, powerful dua: 'Our Lord, grant us mercy from Yourself, and prepare for us right guidance in our affair.' Allah answered by putting them to sleep. The sun rose and set, their dog stretched at the entrance, and 309 years passed. When they woke, they thought it had been a day or part of a day. They sent one of their group to buy food with silver coins — ancient coins that revealed the miracle. The entire city had become monotheist in their absence.",
        lesson:
          "When your environment is toxic to your faith, you may need to remove yourself from it entirely — even if it means losing everything. But if you take that step for Allah's sake, He will take care of you in ways you cannot imagine.",
        connectionToMessage:
          "This is the trial of faith. The cave youth passed it by choosing Allah over comfort, community, and even their own families. The test is: when your faith costs you something, do you hold on?",
      },
      {
        title: "The Owner of the Two Gardens",
        verseRange: "32-44",
        narrative:
          "Allah presents a parable: two men, one given two magnificent gardens with grape vines, date palms, crops, and a river flowing between them. Everything he planted succeeded. He became so drunk on his success that he said to his less wealthy companion: 'I am greater than you in wealth and mightier in manpower.' He walked into his garden and said: 'I do not think this will ever perish.' He then went further: 'And I do not think the Hour will occur.' His companion — the believing friend — responded with one of the most important rebukes in the Quran: 'Do you disbelieve in He who created you from dust, then from a sperm-drop, then proportioned you as a man? But as for me, He is Allah, my Lord, and I do not associate with my Lord anyone.' He then told him: 'If only, when you entered your garden, you had said: Masha'Allah, la quwwata illa billah.' That night, Allah sent a calamity that destroyed everything. The man was left with nothing, saying: 'I wish I had not associated with my Lord anyone.'",
        lesson:
          "Wealth is not the problem — arrogance about wealth is. The moment you believe your success is from your own talent rather than Allah's provision, you've begun the path to losing it. Say 'Masha'Allah' not as a cultural habit but as a genuine acknowledgment.",
        connectionToMessage:
          "This is the trial of wealth. The garden owner failed because he attributed his success to himself. The test is: when you're blessed abundantly, do you become grateful or arrogant?",
      },
      {
        title: "Musa (Moses) and Al-Khidr",
        verseRange: "60-82",
        narrative:
          "Musa once gave a sermon to the Israelites, and someone asked: 'Is there anyone more knowledgeable than you?' Musa said no. Allah corrected him — there is a servant at the junction of the two seas who knows things Musa doesn't. Musa immediately set out to find him, saying: 'I will not cease until I reach the junction of the two seas or continue for a long period' (verse 60). When he found Al-Khidr, he asked to accompany him. Al-Khidr warned him three times that he wouldn't be able to stay patient. Musa promised he would. Then three events shattered that promise. First, Al-Khidr put a hole in a poor family's boat. Musa: 'Have you done it to drown its people?' Second, Al-Khidr killed a young boy. Musa: 'Have you killed a pure soul for other than having killed a soul?' Third, they came to a hostile town that refused them food, and Al-Khidr rebuilt a crumbling wall for free. Musa: 'If you wished, you could have taken payment for it.' Each time, the surface reality contradicted the hidden truth. The boat was damaged to save it from a tyrant. The boy would have grown into a source of misguidance for his parents. The wall protected orphans' treasure until they were old enough to claim it.",
        lesson:
          "Your understanding of events is always incomplete. Something that looks like a disaster may be protection. Something that looks like loss may be the seed of something better. Trust Allah's wisdom when life doesn't make sense — you're seeing one scene of a much longer film.",
        connectionToMessage:
          "This is the trial of knowledge. Even Musa — who spoke directly to Allah — had to learn that his knowledge was limited. The test is: can you accept that you don't see the full picture, and trust the One who does?",
      },
      {
        title: "Dhul-Qarnayn — The Just King",
        verseRange: "83-98",
        narrative:
          "Dhul-Qarnayn was given authority and resources to travel the earth. He went west and found a people living near a spring — he established justice among them, punishing wrongdoers and rewarding the good. He went east and found a people with no shelter — he left them in their condition (they needed no intervention). Then he went to a place between two mountain barriers where he found a people who could barely communicate, terrified of Yajuj and Majuj who were devastating their land. They offered him tribute to build a barrier. His response was extraordinary: 'What my Lord has established for me is better. So assist me with strength; I will make between you and them a dam.' He used iron blocks, filled the gaps with fire, then poured molten copper over it. When it was done — this massive feat of engineering and power — he said: 'This is a mercy from my Lord. But when the promise of my Lord comes, He will make it level. And ever is the promise of my Lord true.'",
        lesson:
          "Power is a means to serve, not to self-aggrandize. Dhul-Qarnayn had more power than almost anyone in history, yet he refused payment, gave credit to Allah, and acknowledged that even his greatest work was temporary. He used power to protect the vulnerable.",
        connectionToMessage:
          "This is the trial of power. Dhul-Qarnayn passed it by using his authority for justice, refusing personal glory, and staying humble before Allah. The test is: when you have the power to do anything, do you use it for yourself or for others?",
      },
    ],

    connections: [
      {
        surah: 17,
        surahName: "Al-Isra",
        relationship:
          "Al-Isra (the Night Journey) and Al-Kahf are often considered twin surahs — revealed close together and addressing related themes. Al-Isra focuses on the Prophet's journey and the Children of Israel; Al-Kahf provides the answers to the Jewish rabbis' test questions.",
      },
      {
        surah: 19,
        surahName: "Maryam",
        relationship:
          "Maryam follows Al-Kahf in the mushaf and continues themes of miraculous divine intervention and faith under impossible circumstances — from the cave youth to Maryam receiving Isa.",
      },
      {
        surah: 1,
        surahName: "Al-Fatihah",
        relationship:
          "Al-Fatihah asks for 'the straight path' — Al-Kahf shows you the four things that pull you off it (threats to faith, wealth, knowledge, power) and how to navigate each one.",
      },
      {
        surah: 112,
        surahName: "Al-Ikhlas",
        relationship:
          "Al-Kahf's final verse says 'do not associate in the worship of his Lord anyone' — the same core message of Al-Ikhlas, pure monotheism. The closing of Al-Kahf echoes the entirety of Al-Ikhlas.",
      },
    ],

    notableVerses: [
      {
        ayah: 10,
        arabic: "رَبَّنَآ ءَاتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا",
        translation: "Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance.",
        tafsirExcerpt:
          "Ibn Kathir notes that the youth asked for 'mercy from Yourself' (min ladunka) — emphasizing that they wanted mercy directly from Allah's special treasury, not through ordinary means. They also asked for 'rushd' — mature, sound guidance — not just any guidance, but the wisdom to handle their terrifying situation. They didn't ask for their enemies to be destroyed or for wealth or safety specifically — they trusted Allah to decide the form their rescue would take.",
        linguisticNote:
          "'Hayyi' lana' (prepare for us) comes from a root meaning to arrange, facilitate, and make easy. They're asking Allah to prepare the entire situation — to orchestrate events they can't control. 'Min amrina' means 'from our affair' — from this specific crisis we're in. It's a deeply personal, situational dua.",
        practicalApplication:
          "This is the perfect dua for any uncertain situation — a new job, a move, a difficult decision, a health crisis. You're not prescribing the solution to Allah; you're asking Him to arrange the best outcome from His knowledge. Use this dua whenever you face the unknown.",
        relatedHadith:
          "The Prophet ﷺ taught that the first ten verses of Al-Kahf are a protection from the Dajjal (Muslim). This dua, being in those first ten verses, carries special spiritual weight. The Dajjal is the ultimate fitnah — and the cave youth's dua is the antidote.",
      },
      {
        ayah: 39,
        arabic: "مَا شَآءَ ٱللَّهُ لَا قُوَّةَ إِلَّا بِٱللَّهِ",
        translation: "What Allah has willed; there is no power except through Allah.",
        tafsirExcerpt:
          "Al-Qurtubi explains this is the correct response when you see something you admire — whether it's your own blessing or someone else's. 'Masha'Allah' acknowledges that everything exists by Allah's will, and 'la quwwata illa billah' acknowledges that all power and ability to maintain blessings comes from Allah. The believing friend was teaching the garden owner the medicine for his arrogance, but he refused to take it.",
        linguisticNote:
          "The phrase 'la quwwata illa billah' uses the strongest form of negation in Arabic (la + indefinite noun), meaning there is absolutely no power of any kind from any source except through Allah. It's total, comprehensive, and admits no exception.",
        practicalApplication:
          "Make this phrase your default response to anything impressive — your child's success, your promotion, your new home, someone else's car. It's not superstition; it's a theological recalibration. It keeps you humble about your blessings and protects you from the arrogance that destroyed the garden.",
        relatedHadith:
          "The Prophet ﷺ said: 'The evil eye is real, and if anything were to overtake the divine decree, it would be the evil eye.' (Muslim). Saying 'Masha'Allah' is the prophetic protection against this.",
      },
      {
        ayah: 110,
        arabic: "فَمَن كَانَ يَرْجُوا۟ لِقَآءَ رَبِّهِۦ فَلْيَعْمَلْ عَمَلًا صَـٰلِحًا وَلَا يُشْرِكْ بِعِبَادَةِ رَبِّهِۦٓ أَحَدًا",
        translation: "So whoever hopes for the meeting with his Lord, let him do righteous work and not associate in the worship of his Lord anyone.",
        tafsirExcerpt:
          "Ibn Kathir says this is one of the most comprehensive verses in the Quran. It contains two conditions for any deed to be accepted: (1) it must be righteous — meaning done correctly according to the Sunnah, and (2) it must be purely for Allah — meaning free from any form of showing off or associating partners. If either condition is missing, the deed is rejected. A beautiful deed done for people's praise fails condition 2. A sincere deed done incorrectly fails condition 1. You need both.",
        linguisticNote:
          "The verse says 'man kana yarju' — whoever HOPES for the meeting. It doesn't say 'fears' the meeting. The relationship with Allah that this surah teaches is built on hope and longing, not terror. You meet Allah as someone you've been wanting to meet, not someone you've been running from.",
        practicalApplication:
          "Before any act of worship or good deed, ask yourself two questions: Am I doing this correctly? And am I doing this for Allah alone? These two filters — sincerity and correctness — are the summary of the entire surah and, arguably, the entire Quran.",
        relatedHadith:
          "The Prophet ﷺ said: 'The thing I fear most for you is minor shirk.' They asked what it was, and he said: 'Showing off (riya). Allah will say on the Day of Judgment: Go to those for whom you were showing off in the world and see if you find any reward with them.' (Ahmad). This hadith directly connects to the verse's warning against associating anyone in your worship.",
      },
    ],

    lessons: [
      {
        category: "Personal Faith",
        points: [
          "Your environment shapes your faith more than you realize. The cave youth had to physically remove themselves from a toxic society. If your surroundings are pulling you away from Allah, changing your environment isn't running away — it's strategic.",
          "Say 'Insha'Allah' for the future — the Prophet ﷺ himself was corrected for forgetting this (verses 23-24). Planning without acknowledging Allah's will is a form of arrogance.",
          "The final verse of the surah is the summary of everything: do good work and keep it purely for Allah. That's it. That's the whole religion.",
        ],
      },
      {
        category: "Wealth & Material Life",
        points: [
          "Every time you see something beautiful — your own success or someone else's — say 'Masha'Allah la quwwata illa billah.' This isn't cultural habit; it's Al-Kahf's prescription for protecting against arrogance and the evil eye.",
          "The worldly life is described as rain that makes plants grow, then they wither. Everything you own is in the 'growing' phase. The withering is guaranteed. Invest in what outlasts the withering: good deeds.",
          "Refusing payment when you have the power to help (like Dhul-Qarnayn) is one of the highest forms of generosity — helping without creating an obligation.",
        ],
      },
      {
        category: "Knowledge & Humility",
        points: [
          "If Musa — a prophet who spoke to Allah directly — was told there was someone who knew things he didn't, then you definitely don't know everything. Stay a student. Always.",
          "When life doesn't make sense — when you lose something, when bad things happen to good people, when plans fall apart — remember the Musa-Khidr story. You're seeing one frame of a million-frame movie.",
          "The three incidents with Al-Khidr teach that surface reality and deep reality often contradict each other. Don't judge situations (or people) based only on what you can see.",
        ],
      },
      {
        category: "Weekly Practice",
        points: [
          "The Prophet ﷺ specifically recommended reading Al-Kahf every Friday. Make it a non-negotiable weekly practice — it takes about 30-40 minutes and covers every major trial you'll face that week.",
          "Memorize the first 10 and last 10 verses — they're specifically mentioned as protection from the Dajjal (the greatest trial in human history).",
          "After reading, reflect: which of the four trials am I currently facing? Faith, wealth, knowledge, or power? What does this surah teach me about handling it?",
        ],
      },
    ],

    scholarlyNotes:
      "Several scholarly discussions surround Al-Kahf. The identity of Dhul-Qarnayn is debated — some scholars (Ibn Kathir's preference) identify him as a righteous king, not a prophet, while others link him to Alexander the Great or a pre-Islamic Yemeni king named As'ad Abu Karib. Al-Khidr's status is also debated: is he a prophet or a righteous servant? The majority of scholars lean toward him being a prophet, based on the fact that he received direct revelation ('mercy from Us and knowledge from Our presence,' verse 65). The 309 years is explicitly stated in the Quran (verse 25) — some scholars note that 300 solar years equals approximately 309 lunar years, showing the Quran's precision. The surah is also one of five that begins with 'Alhamdulillah' (along with surahs 1, 6, 34, and 35), and one of two that begins with both praise and a description of the Quran (the other being Surah 34, Saba).",
  },

  /* ═══════════════════════════════════════════════════════════════
     93 · AD-DUHA — The Morning Brightness
     ═══════════════════════════════════════════════════════════════ */
  93: {
    surah: 93,

    historicalContext: {
      period: "Early Meccan",
      chronologicalOrder: 11,
      background:
        "Ad-Duha was revealed during one of the most emotionally painful moments in the Prophet's early mission. After receiving regular revelation through Jibreel, there was a sudden pause — for days or weeks, the angel stopped coming. For the Prophet ﷺ, who had experienced the overwhelming presence of divine communication, this silence was devastating. It wasn't just a professional setback; it felt like being cut off from the most important relationship in his life. The Quraysh seized on this. A woman named Umm Jamil (the wife of Abu Lahab) reportedly taunted him: 'It seems your devil has forsaken you.' Others mocked openly: 'Muhammad's Lord has abandoned him and is displeased with him.' The Prophet ﷺ was in genuine emotional anguish — what we might today describe as a depressive episode triggered by spiritual abandonment. Into this darkness, this surah arrived like dawn breaking.",
      occasionOfRevelation:
        "The specific trigger was the pause in revelation (called 'fatrah al-wahy'). Scholars differ on how long it lasted — some say 12 days, some say 15, some say 40 days. Whatever the duration, it was long enough to cause the Prophet ﷺ real distress and give his enemies ammunition. The surah's opening oath — 'By the morning brightness and by the night when it is still' — is itself a commentary on the situation: the pause in revelation was like the stillness of the night, and this surah is the morning light returning. Every person who has experienced a spiritual low, a feeling that God is distant, or a dark period that seems to have no end — this surah was revealed for that exact feeling.",
    },

    audience:
      "Ad-Duha is one of the most intimate passages in the Quran — Allah speaking directly to Prophet Muhammad ﷺ in the second person singular: 'YOUR Lord has not abandoned YOU.' But its message universalizes. Every believer goes through periods where they feel spiritually disconnected — where prayers feel empty, where the Quran doesn't move them the way it used to, where they wonder if Allah even cares. This surah addresses that universal human experience through the specific lens of the Prophet's own pain. When you read it, you're meant to hear Allah speaking to you personally.",

    coreMessage: {
      thesis:
        "Allah has not abandoned you. The silence you're experiencing is not rejection — it's like the still of the night that always gives way to morning. Look at your own history: were you not lost and He guided you? Were you not in need and He provided? The pattern of your life proves His care. And what's coming is better than what's passed.",
      emotionalArc:
        "The surah moves through three emotional phases: (1) Reassurance — you are not abandoned, the future is brighter than the past (verses 1-5). (2) Evidence — remember your own life story as proof of Allah's care (verses 6-8). (3) Response — here's how to live now that you know this (verses 9-11). It moves from comfort → memory → action. You're not just soothed; you're given a purpose.",
      buildUp:
        "The structure is beautifully symmetrical. It opens with two oaths (morning brightness, still night), makes two negations (not abandoned, not detested), gives one promise (the Hereafter is better), then asks three rhetorical questions (were you not an orphan? lost? in need?), and closes with three commands (don't oppress orphans, don't repel those who ask, proclaim Allah's favor). The questions about the past become the basis for the commands about the future: because Allah took care of you then, you must take care of others now.",
    },

    sections: [
      {
        verseRange: "1-2",
        title: "The Twin Oaths — Dawn and Night",
        summary:
          "Allah swears by two things: the morning brightness (ad-duha) and the night when it becomes still (wal-layli idha saja). These are not random oaths — they're metaphors for the Prophet's situation. The night represents the pause in revelation, the silence, the darkness of feeling abandoned. The morning represents what's coming: the return of light, warmth, and communication. But notice: Allah swears by BOTH. The night is not a punishment. The night is necessary. Stillness is part of the cycle. Plants grow in darkness before they break through soil. The message is: the dark period you're in right now is not separate from Allah's plan — it IS part of Allah's plan.",
        connectionToNext: "With the stage set by the oaths, Allah delivers the core reassurance.",
      },
      {
        verseRange: "3-5",
        title: "The Reassurance — You Are Not Abandoned",
        summary:
          "Three statements that shatter the lie. 'Your Lord has not taken leave of you, nor has He detested you' (verse 3) — a direct response to the mockery of 'your Lord has abandoned you.' The word 'wadda'aka' (taken leave) implies a deliberate goodbye, a conscious departure. Allah is saying: I did not leave. I did not say goodbye. I am not gone. Then: 'And the Hereafter is better for you than the first [life]' (verse 4) — whatever you're going through now is temporary, and what's ahead is incomparably better. Then the promise: 'And your Lord is going to give you, and you will be satisfied' (verse 5) — not 'might give' but WILL give, and not 'you will receive' but 'you will be SATISFIED.' Complete, total satisfaction. This is one of the most absolute promises in the Quran.",
        connectionToNext: "But these aren't empty reassurances — Allah provides evidence from the Prophet's own life.",
      },
      {
        verseRange: "6-8",
        title: "The Evidence — Your Own Life Story",
        summary:
          "Allah asks three rhetorical questions that trace the Prophet's biography as proof of divine care. 'Did He not find you an orphan and give you refuge?' (verse 6) — Muhammad ﷺ lost his father before birth, his mother at age 6, and his grandfather at age 8. Yet at every stage, Allah provided someone: Abdul-Muttalib, then Abu Talib, then Khadijah. 'And He found you lost and guided you' (verse 7) — before revelation, the Prophet ﷺ knew the idolatry of his people was wrong but didn't know the way to the truth. Allah sent Jibreel with the Quran. 'And He found you poor and made you self-sufficient' (verse 8) — through Khadijah's support and Allah's provision, the Prophet ﷺ went from poverty to sufficiency. Each question says: look at your track record with Me. Have I ever actually abandoned you? The answer is always no.",
        connectionToNext: "Having established that Allah has always cared for you, the surah now tells you what to do with that knowledge.",
      },
      {
        verseRange: "9-11",
        title: "The Response — Pay It Forward",
        summary:
          "Three commands that mirror the three rhetorical questions perfectly. You were an orphan and Allah sheltered you → 'So as for the orphan, do not oppress him' (verse 9). You were lost and Allah guided you → 'And as for the one who asks, do not repel him' (verse 10). This refers to anyone who asks — for knowledge, for money, for help, for guidance. You were in need and Allah provided → 'And as for the favor of your Lord, report it' (verse 11) — talk about what Allah has done for you. Not to boast, but to proclaim. Gratitude isn't just felt; it's spoken. It's shared. It becomes a testimony that encourages others who are going through their own dark nights. The logic is profound: your pain wasn't random — it was preparation. Now that you know what abandonment FEELS like (even though it wasn't real), you're equipped to ensure others never feel it.",
        connectionToNext: "",
      },
    ],

    keyVocabulary: [
      {
        arabic: "ٱلضُّحَىٰ",
        transliteration: "Ad-Duha",
        surfaceMeaning: "The morning brightness / forenoon",
        deeperMeaning:
          "Duha is not sunrise and not midday — it's the specific time when the sun has risen enough to warm the earth, when the morning chill breaks and light fills everything. It's the moment the night is decisively over. Allah chose this precise moment to name the surah — not 'sunrise' (the beginning of hope) but 'morning brightness' (the moment hope becomes warmth and certainty).",
      },
      {
        arabic: "سَجَىٰ",
        transliteration: "Saja",
        surfaceMeaning: "Becomes still / covers with darkness",
        deeperMeaning:
          "This word is carefully chosen over alternatives like 'dhalaam' (darkness) or 'ghashaqa' (covers). Saja implies a gentle settling — like a calm sea becoming still, or a mother covering her child with a blanket. The night isn't described as harsh or terrifying; it's described as quiet. The silence of revelation wasn't violent abandonment — it was a gentle pause, a quiet settling, before the new dawn.",
      },
      {
        arabic: "وَدَّعَكَ",
        transliteration: "Wadda'aka",
        surfaceMeaning: "Taken leave of you / said goodbye",
        deeperMeaning:
          "From the root w-d-' which means to bid farewell deliberately, to leave consciously. Allah negates this specifically: He did not make a conscious decision to leave. The absence of revelation was not a farewell. It's the difference between someone leaving the room and someone who was never gone but was quiet for a moment.",
      },
      {
        arabic: "قَلَىٰ",
        transliteration: "Qala",
        surfaceMeaning: "Detested / hated",
        deeperMeaning:
          "This is one of the strongest words for dislike in Arabic — it implies disgust and active rejection. Allah negates this absolutely: not only has He not left, He does not even have negative feelings toward you. The Prophet ﷺ wasn't just worried about being abandoned; he feared being actively rejected by Allah. This verse addresses the deepest fear directly.",
      },
      {
        arabic: "فَحَدِّثْ",
        transliteration: "Fahaddith",
        surfaceMeaning: "Report / proclaim / speak about",
        deeperMeaning:
          "From 'hadith' — to narrate, to speak. The command is active and public: don't just feel grateful privately — TELL people about Allah's blessings. This is the Islamic concept of shahada (testimony) applied to personal experience. Your story of being lost and guided, poor and provided for, abandoned and embraced — that story is a service to others going through the same thing.",
      },
    ],

    stories: [],

    connections: [
      {
        surah: 94,
        surahName: "Ash-Sharh (The Relief)",
        relationship:
          "Ash-Sharh immediately follows Ad-Duha and continues the exact same theme — so much so that some scholars (including Imam Shafi'i in one narration) consider them one surah. Ad-Duha says 'You are not abandoned'; Ash-Sharh says 'With hardship comes ease.' Together they form a complete therapy session for spiritual darkness.",
      },
      {
        surah: 108,
        surahName: "Al-Kawthar",
        relationship:
          "Al-Kawthar was also revealed when the Prophet ﷺ was mocked and told he was 'cut off' (abtar). Ad-Duha addresses internal spiritual pain; Al-Kawthar addresses external social mockery. Both reassure: your enemies are wrong, and Allah's gifts to you are far greater than they imagine.",
      },
      {
        surah: 1,
        surahName: "Al-Fatihah",
        relationship:
          "Al-Fatihah asks 'Guide us to the straight path.' Ad-Duha verse 7 says 'He found you lost and guided you.' The prayer of Al-Fatihah and the testimony of Ad-Duha are the same reality from two angles: asking for guidance and confirming it was received.",
      },
      {
        surah: 12,
        surahName: "Yusuf",
        relationship:
          "Surah Yusuf was revealed during the 'Year of Sorrow' when the Prophet ﷺ lost Khadijah and Abu Talib — another low point. Like Ad-Duha, Yusuf was sent as comfort: a story proving that even decades of suffering lead to triumph for those who trust Allah. Both surahs are divine therapy for dark times.",
      },
    ],

    notableVerses: [
      {
        ayah: 3,
        arabic: "مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ",
        translation: "Your Lord has not taken leave of you, nor has He detested you.",
        tafsirExcerpt:
          "Ibn Kathir says this verse was the direct answer to the taunts of the Quraysh. Scholars note that Allah said 'your Lord' (Rabbuka) — using the possessive form — to emphasize closeness. He didn't say 'Allah has not abandoned you'; He said 'YOUR Lord' — the One who is specifically your nurturer, your caretaker, your guardian. The relationship is personal. Al-Qurtubi adds that 'ma qala' (nor detested) is mentioned second because it's an even worse fear than being left — the Prophet ﷺ didn't just fear absence, he feared active displeasure.",
        linguisticNote:
          "Both verbs are negated with 'ma' — the negation of past action. Allah isn't saying 'I won't abandon you in the future'; He's saying 'I never abandoned you even during the silence.' The silence that the Prophet ﷺ experienced as absence was never actually absence from Allah's perspective. He was present the entire time.",
        practicalApplication:
          "When you feel spiritually empty — when prayers feel like they're hitting the ceiling, when you can't cry in dua anymore, when the Quran doesn't move you — read this verse and understand: the feeling of absence is not actual absence. Allah does not abandon the people who seek Him. Your spiritual dryness is a 'night' that precedes a 'morning.'",
        relatedHadith:
          "The Prophet ﷺ said: 'Allah says: I am as My servant thinks of Me. So let him think of Me as he wishes.' (Bukhari & Muslim). If you think Allah has abandoned you, that assumption becomes your reality. If you trust that He is present even in the silence — that's what you'll find.",
      },
      {
        ayah: 5,
        arabic: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ",
        translation: "And your Lord is going to give you, and you will be satisfied.",
        tafsirExcerpt:
          "This verse is considered one of the most hopeful promises in the Quran. Ibn Kathir relates that the Prophet ﷺ, after this verse was revealed, said about his intercession on the Day of Judgment: 'Then I will be satisfied.' Meaning the ultimate fulfillment of this promise is the Prophet's intercession for his entire ummah. Some scholars wept when they heard this verse, saying: the Prophet ﷺ would not be satisfied while a single member of his ummah remains in the fire. Al-Hasan al-Basri said: this means Allah will give the Prophet ﷺ in the Hereafter until he is completely content — and his contentment includes the wellbeing of those who followed him.",
        linguisticNote:
          "'La-sawfa' is the strongest form of future promise in Arabic — 'la' is for emphasis and 'sawfa' indicates certainty of future occurrence (stronger than 'sa'). The combination means 'absolutely and certainly, in the future, this WILL happen.' And 'fatarda' (you will be satisfied) is in the definitive form — not 'you might be satisfied' but 'you WILL be satisfied.' It's a guarantee.",
        practicalApplication:
          "Hold this verse close in every difficult season of your life. Whatever you've lost, whatever you're waiting for, whatever seems impossible — Allah has made a promise here that is absolute: He will give you, and you will be satisfied. Not partially content. Satisfied. Trust the timeline even when you can't see the destination.",
        relatedHadith:
          "The Prophet ﷺ said: 'If you knew what I know, you would laugh little and weep much.' But regarding this verse, he was given a promise so immense that even he — who bore the heaviest burdens — would be fully satisfied. The scholars say this verse is one of the strongest proofs of the Prophet's intercession (shafa'ah) for his ummah on the Day of Judgment.",
      },
      {
        ayah: 11,
        arabic: "وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ",
        translation: "And as for the favor of your Lord, report it.",
        tafsirExcerpt:
          "The scholars have two main interpretations. First, 'the favor' refers to the Quran and prophethood — meaning: proclaim your message, don't keep it private out of fear. Second, it refers to all of Allah's blessings generally — meaning: express gratitude by talking about what Allah has given you. Both interpretations are correct and complementary. Ibn Kathir ties it to the previous verses: Allah reminded the Prophet ﷺ of being orphaned, lost, and poor — these memories aren't meant to shame him but to highlight how far Allah brought him. Now, share that journey.",
        linguisticNote:
          "The word 'haddith' is an imperative — it's a command, not a suggestion. Gratitude in Islam isn't just an internal feeling; it has an external, verbal component. You are commanded to speak about Allah's blessings. The Arabic root h-d-th (from which we get 'hadith') means to narrate, to share information. Your testimony of Allah's favor IS a form of hadith — a narration that benefits others.",
        practicalApplication:
          "Don't be shy about sharing how Allah helped you through a difficult time. Your testimony — 'I was struggling and Allah opened a door,' 'I was lost and the Quran brought me peace' — is not bragging. It's obedience to this verse. And it might be exactly what someone else needs to hear to keep going through their own dark night.",
        relatedHadith:
          "The Prophet ﷺ said: 'When Allah gives a blessing to a servant, He likes to see the traces of His blessings on him.' (Tirmidhi). This applies to both physical blessings (maintaining yourself well) and spiritual blessings (speaking about them). Hiding Allah's blessings, whether out of false humility or fear, contradicts this verse.",
      },
    ],

    lessons: [
      {
        category: "Spiritual Darkness & Recovery",
        points: [
          "Feeling spiritually disconnected is not a sign of failure — it's a universal experience that even the Prophet ﷺ went through. The night always ends. The morning always comes.",
          "The pause in revelation wasn't punishment — it was preparation. Sometimes Allah goes quiet in your life not because He's angry, but because the next chapter requires you to sit in the silence first.",
          "Your enemies will use your low moments against you. 'Your God has abandoned you.' Don't let external voices define your internal reality. Allah's word outranks anyone's mockery.",
        ],
      },
      {
        category: "Gratitude & Remembering Your Journey",
        points: [
          "When you feel hopeless, trace your own history. Were you not in a worse situation before and Allah rescued you? Your past rescues are evidence of your future ones.",
          "The surah's logic is life-changing: you were orphaned → He sheltered you. You were lost → He guided you. You were poor → He provided. The pattern hasn't changed. Why would it stop now?",
          "Talking about Allah's blessings isn't bragging — it's a Quranic command (verse 11). Your story of recovery and guidance might be the lifeline someone else needs.",
        ],
      },
      {
        category: "Compassion & Action",
        points: [
          "Your pain has a purpose: it makes you empathetic. Because the Prophet ﷺ was an orphan, he became the greatest advocate for orphans. Your difficult experiences are meant to make you kinder, not bitter.",
          "The surah's three commands are the minimum standard: don't oppress the vulnerable, don't turn away anyone who asks, and speak about Allah's favors. These aren't extraordinary acts — they're the baseline of a grateful life.",
          "The connection between receiving mercy and showing mercy is direct: God took care of you → now you take care of others. Gratitude without service is incomplete.",
        ],
      },
    ],

    scholarlyNotes:
      "Ad-Duha and the surah that follows it (Ash-Sharh, 94) are so thematically connected that some scholars, including a narration from Imam Shafi'i, treated them as one surah. In the Hanafi madhab, some authorities held they should not be separated in prayer — if you recite Ad-Duha in one rak'ah, you should recite Ash-Sharh in the next. The majority opinion, however, treats them as two separate surahs with a shared theme. The duration of the pause in revelation (fatrah al-wahy) is debated — reports range from 12 to 40 days. Some scholars distinguish between this pause and the longer initial pause after the very first revelation in the cave of Hira. The scholars also discuss who the 'one who asks' (as-sa'il) is in verse 10 — does it mean someone asking for money, or someone asking questions about religion? The consensus is both: you should not repel anyone who comes to you with a need, whether material or spiritual.",
  },
};

/** Check if a surah has curated insights */
export function hasCuratedInsight(surah: number): boolean {
  return surah in SURAH_INSIGHTS;
}

/** Get all curated surah numbers */
export function getCuratedSurahNumbers(): number[] {
  return Object.keys(SURAH_INSIGHTS).map(Number);
}
