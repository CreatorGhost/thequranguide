"use client";

import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import Link from "next/link";

/* ─── Dua Data ─── */
interface Dua {
  arabic: string;
  translation: string;
  reference: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  duas: Dua[];
}

const CATEGORIES: Category[] = [
  {
    id: "guidance",
    name: "Guidance",
    icon: "M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z",
    description: "Prayers for divine guidance and steadfastness on the right path",
    duas: [
      {
        arabic: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ",
        translation: "Guide us to the straight path.",
        reference: "Al-Fatihah 1:6",
      },
      {
        arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً ۚ إِنَّكَ أَنتَ ٱلْوَهَّابُ",
        translation: "Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy. Indeed, You are the Bestower.",
        reference: "Aal-E-Imran 3:8",
      },
      {
        arabic: "رَبِّ ٱشْرَحْ لِى صَدْرِى وَيَسِّرْ لِىٓ أَمْرِى وَٱحْلُلْ عُقْدَةً مِّن لِّسَانِى يَفْقَهُوا۟ قَوْلِى",
        translation: "My Lord, expand for me my chest, ease my task for me, and untie the knot from my tongue that they may understand my speech.",
        reference: "Ta-Ha 20:25-28",
      },
      {
        arabic: "رَبَّنَآ ءَاتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا",
        translation: "Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance.",
        reference: "Al-Kahf 18:10",
      },
    ],
  },
  {
    id: "protection",
    name: "Protection",
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    description: "Seeking Allah's protection from harm, evil, and trials",
    duas: [
      {
        arabic: "رَبَّنَا لَا تُؤَاخِذْنَآ إِن نَّسِينَآ أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَآ إِصْرًا كَمَا حَمَلْتَهُۥ عَلَى ٱلَّذِينَ مِن قَبْلِنَا",
        translation: "Our Lord, do not impose blame upon us if we have forgotten or erred. Our Lord, and lay not upon us a burden like that which You laid upon those before us.",
        reference: "Al-Baqarah 2:286",
      },
      {
        arabic: "رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِۦ ۖ وَٱعْفُ عَنَّا وَٱغْفِرْ لَنَا وَٱرْحَمْنَآ ۚ أَنتَ مَوْلَىٰنَا فَٱنصُرْنَا عَلَى ٱلْقَوْمِ ٱلْكَـٰفِرِينَ",
        translation: "Our Lord, and burden us not with that which we have no ability to bear. Pardon us, forgive us, and have mercy upon us. You are our protector, so give us victory over the disbelieving people.",
        reference: "Al-Baqarah 2:286",
      },
      {
        arabic: "رَبَّنَا لَا تَجْعَلْنَا فِتْنَةً لِّلْقَوْمِ ٱلظَّـٰلِمِينَ وَنَجِّنَا بِرَحْمَتِكَ مِنَ ٱلْقَوْمِ ٱلْكَـٰفِرِينَ",
        translation: "Our Lord, make us not a trial for the wrongdoing people, and save us by Your mercy from the disbelieving people.",
        reference: "Yunus 10:85-86",
      },
    ],
  },
  {
    id: "forgiveness",
    name: "Forgiveness",
    icon: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
    description: "Seeking Allah's forgiveness and mercy for our sins",
    duas: [
      {
        arabic: "رَبَّنَا ظَلَمْنَآ أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ ٱلْخَـٰسِرِينَ",
        translation: "Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.",
        reference: "Al-A'raf 7:23",
      },
      {
        arabic: "رَبِّ إِنِّى ظَلَمْتُ نَفْسِى فَٱغْفِرْ لِى",
        translation: "My Lord, indeed I have wronged myself, so forgive me.",
        reference: "Al-Qasas 28:16",
      },
      {
        arabic: "رَبَّنَا ٱغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِىٓ أَمْرِنَا وَثَبِّتْ أَقْدَامَنَا وَٱنصُرْنَا عَلَى ٱلْقَوْمِ ٱلْكَـٰفِرِينَ",
        translation: "Our Lord, forgive us our sins and the excess committed in our affairs and plant firmly our feet and give us victory over the disbelieving people.",
        reference: "Aal-E-Imran 3:147",
      },
      {
        arabic: "رَبَّنَا ٱغْفِرْ لِى وَلِوَٰلِدَىَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ ٱلْحِسَابُ",
        translation: "Our Lord, forgive me and my parents and the believers the Day the account is established.",
        reference: "Ibrahim 14:41",
      },
    ],
  },
  {
    id: "patience",
    name: "Patience",
    icon: "M12 8v4l3 3M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0z",
    description: "Prayers for patience, perseverance, and endurance through hardship",
    duas: [
      {
        arabic: "رَبَّنَآ أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَٱنصُرْنَا عَلَى ٱلْقَوْمِ ٱلْكَـٰفِرِينَ",
        translation: "Our Lord, pour upon us patience and plant firmly our feet and give us victory over the disbelieving people.",
        reference: "Al-Baqarah 2:250",
      },
      {
        arabic: "رَبَّنَآ أَفْرِغْ عَلَيْنَا صَبْرًا وَتَوَفَّنَا مُسْلِمِينَ",
        translation: "Our Lord, pour upon us patience and let us die as Muslims.",
        reference: "Al-A'raf 7:126",
      },
      {
        arabic: "حَسْبُنَا ٱللَّهُ وَنِعْمَ ٱلْوَكِيلُ",
        translation: "Sufficient for us is Allah, and He is the best Disposer of affairs.",
        reference: "Aal-E-Imran 3:173",
      },
    ],
  },
  {
    id: "gratitude",
    name: "Gratitude",
    icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 7a4 4 0 1 1 0 8 4 4 0 0 1 0-8z",
    description: "Expressing gratitude and thankfulness to Allah for His blessings",
    duas: [
      {
        arabic: "رَبِّ أَوْزِعْنِىٓ أَنْ أَشْكُرَ نِعْمَتَكَ ٱلَّتِىٓ أَنْعَمْتَ عَلَىَّ وَعَلَىٰ وَٰلِدَىَّ وَأَنْ أَعْمَلَ صَـٰلِحًا تَرْضَىٰهُ وَأَدْخِلْنِى بِرَحْمَتِكَ فِى عِبَادِكَ ٱلصَّـٰلِحِينَ",
        translation: "My Lord, enable me to be grateful for Your favor which You have bestowed upon me and upon my parents and to do righteousness of which You approve. And admit me by Your mercy into the ranks of Your righteous servants.",
        reference: "An-Naml 27:19",
      },
      {
        arabic: "ٱلْحَمْدُ لِلَّهِ ٱلَّذِى هَدَىٰنَا لِهَـٰذَا وَمَا كُنَّا لِنَهْتَدِىَ لَوْلَآ أَنْ هَدَىٰنَا ٱللَّهُ",
        translation: "Praise to Allah, who has guided us to this; and we would never have been guided if Allah had not guided us.",
        reference: "Al-A'raf 7:43",
      },
      {
        arabic: "رَبِّ أَوْزِعْنِىٓ أَنْ أَشْكُرَ نِعْمَتَكَ ٱلَّتِىٓ أَنْعَمْتَ عَلَىَّ وَعَلَىٰ وَٰلِدَىَّ وَأَنْ أَعْمَلَ صَـٰلِحًا تَرْضَىٰهُ وَأَصْلِحْ لِى فِى ذُرِّيَّتِىٓ ۖ إِنِّى تُبْتُ إِلَيْكَ وَإِنِّى مِنَ ٱلْمُسْلِمِينَ",
        translation: "My Lord, enable me to be grateful for Your favor which You bestowed upon me and upon my parents and to work righteousness of which You will approve and make righteous for me my offspring. Indeed, I have repented to You, and indeed, I am of the Muslims.",
        reference: "Al-Ahqaf 46:15",
      },
    ],
  },
  {
    id: "health",
    name: "Health",
    icon: "M22 12h-4l-3 9L9 3l-3 9H2",
    description: "Prayers for healing, health, and relief from affliction",
    duas: [
      {
        arabic: "رَبِّىٓ إِنِّى مَسَّنِىَ ٱلضُّرُّ وَأَنتَ أَرْحَمُ ٱلرَّٰحِمِينَ",
        translation: "Indeed, adversity has touched me, and You are the Most Merciful of the merciful.",
        reference: "Al-Anbiya 21:83",
      },
      {
        arabic: "لَّآ إِلَـٰهَ إِلَّآ أَنتَ سُبْحَـٰنَكَ إِنِّى كُنتُ مِنَ ٱلظَّـٰلِمِينَ",
        translation: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.",
        reference: "Al-Anbiya 21:87",
      },
      {
        arabic: "وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ",
        translation: "And when I am ill, it is He who cures me.",
        reference: "Ash-Shu'ara 26:80",
      },
    ],
  },
  {
    id: "family",
    name: "Family",
    icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9zM9 22V12h6v10",
    description: "Prayers for family, children, and righteous offspring",
    duas: [
      {
        arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَٰجِنَا وَذُرِّيَّـٰتِنَا قُرَّةَ أَعْيُنٍ وَٱجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
        translation: "Our Lord, grant us from among our wives and offspring comfort to our eyes and make us an example for the righteous.",
        reference: "Al-Furqan 25:74",
      },
      {
        arabic: "رَبِّ هَبْ لِى مِن لَّدُنكَ ذُرِّيَّةً طَيِّبَةً ۖ إِنَّكَ سَمِيعُ ٱلدُّعَآءِ",
        translation: "My Lord, grant me from Yourself a good offspring. Indeed, You are the Hearer of supplication.",
        reference: "Aal-E-Imran 3:38",
      },
      {
        arabic: "رَبِّ ٱجْعَلْنِى مُقِيمَ ٱلصَّلَوٰةِ وَمِن ذُرِّيَّتِى ۚ رَبَّنَا وَتَقَبَّلْ دُعَآءِ",
        translation: "My Lord, make me an establisher of prayer, and from my descendants. Our Lord, and accept my supplication.",
        reference: "Ibrahim 14:40",
      },
    ],
  },
  {
    id: "success",
    name: "Success",
    icon: "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3",
    description: "Prayers for success in this life and the Hereafter",
    duas: [
      {
        arabic: "رَبَّنَآ ءَاتِنَا فِى ٱلدُّنْيَا حَسَنَةً وَفِى ٱلْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ ٱلنَّارِ",
        translation: "Our Lord, give us in this world that which is good and in the Hereafter that which is good and protect us from the punishment of the Fire.",
        reference: "Al-Baqarah 2:201",
      },
      {
        arabic: "رَبِّ زِدْنِى عِلْمًا",
        translation: "My Lord, increase me in knowledge.",
        reference: "Ta-Ha 20:114",
      },
      {
        arabic: "رَبَّنَآ أَتْمِمْ لَنَا نُورَنَا وَٱغْفِرْ لَنَآ ۖ إِنَّكَ عَلَىٰ كُلِّ شَىْءٍ قَدِيرٌ",
        translation: "Our Lord, perfect for us our light and forgive us. Indeed, You are over all things competent.",
        reference: "At-Tahrim 66:8",
      },
      {
        arabic: "رَبَّنَا تَقَبَّلْ مِنَّآ ۖ إِنَّكَ أَنتَ ٱلسَّمِيعُ ٱلْعَلِيمُ",
        translation: "Our Lord, accept this from us. Indeed You are the Hearing, the Knowing.",
        reference: "Al-Baqarah 2:127",
      },
    ],
  },
];

export default function DuaPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const activeCat = CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <PageLayout currentPath="/dua" footerVariant="minimal">
      <style>{`
        .dua-category-card {
          background: var(--surface);
          border: 1px solid var(--border-subtle);
          border-radius: 16px;
          padding: 28px;
          position: relative;
          transition: all 0.25s ease-out;
          cursor: pointer;
          overflow: hidden;
        }
        .dua-category-card:hover {
          border-color: rgba(184,152,63,0.25);
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(184,152,63,0.08);
        }
        .dua-category-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(184,152,63,0.3), transparent);
          opacity: 0;
          transition: opacity 0.25s;
        }
        .dua-category-card:hover::before { opacity: 1; }

        .dua-icon-circle {
          width: 48px; height: 48px;
          border-radius: 50%;
          border: 1px solid rgba(184,152,63,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s;
          flex-shrink: 0;
          background: rgba(184,152,63,0.04);
        }
        .dua-category-card:hover .dua-icon-circle {
          border-color: rgba(184,152,63,0.35);
          background: rgba(184,152,63,0.08);
        }

        .dua-count-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 10px;
          border-radius: 12px;
          background: rgba(184,152,63,0.06);
          border: 1px solid rgba(184,152,63,0.1);
          font-size: 11px;
          color: rgba(184,152,63,0.5);
        }

        @keyframes dua-fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dua-animate-in {
          animation: dua-fadeIn 0.4s ease-out forwards;
        }
      `}</style>

      {/* Hero */}
      <section className="pt-32 pb-12 px-6 text-center relative z-10">
        <div className="tqg-divider max-w-sm mx-auto mb-6">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="2" y="2" width="8" height="8" transform="rotate(45 6 6)" stroke="#B8983F" strokeWidth="0.5" opacity="0.3"/>
          </svg>
        </div>

        <h1 className="tqg-heading tqg-gold-shimmer text-5xl md:text-7xl mb-4" style={{ fontWeight: 400 }}>
          Quranic Duas
        </h1>
        <p className="text-sm md:text-base max-w-lg mx-auto mb-3" style={{ color: '#8a8078' }}>
          Beautiful supplications from the Holy Quran, organized by theme.
        </p>
        <p className="tqg-arabic text-lg mb-6" style={{ color: 'rgba(184,152,63,0.4)' }}>
          وَقَالَ رَبُّكُمُ ٱدْعُونِىٓ أَسْتَجِبْ لَكُمْ
        </p>
        <p className="tqg-heading text-sm mb-8" style={{ color: '#8a8078', fontStyle: 'italic' }}>
          &ldquo;And your Lord says, Call upon Me; I will respond to you.&rdquo; &mdash; Ghafir 40:60
        </p>
        <div className="tqg-divider max-w-xs mx-auto">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <rect x="1" y="1" width="6" height="6" transform="rotate(45 4 4)" stroke="#B8983F" strokeWidth="0.5" opacity="0.25"/>
          </svg>
        </div>
      </section>

      {/* Category Grid */}
      {!activeCategory && (
        <section className="px-6 pb-32 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className="dua-category-card"
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <div className="dua-icon-circle mb-5">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B8983F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d={cat.icon} />
                    </svg>
                  </div>
                  <h3 className="tqg-heading text-xl mb-2" style={{ fontWeight: 500 }}>
                    {cat.name}
                  </h3>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: '#8a8078' }}>
                    {cat.description}
                  </p>
                  <div className="dua-count-badge">
                    {cat.duas.length} dua{cat.duas.length !== 1 ? "s" : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dua List */}
      {activeCat && (
        <section className="px-6 pb-32 relative z-10">
          <div className="max-w-3xl mx-auto">
            <button
              className="tqg-btn-ghost px-5 py-2 rounded-lg text-sm mb-10"
              onClick={() => setActiveCategory(null)}
            >
              &larr; All Categories
            </button>

            <div className="flex items-center gap-4 mb-3">
              <div className="dua-icon-circle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B8983F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={activeCat.icon} />
                </svg>
              </div>
              <h2 className="tqg-heading tqg-gold-gradient text-3xl md:text-4xl" style={{ fontWeight: 400 }}>
                {activeCat.name}
              </h2>
            </div>
            <p className="text-sm mb-10" style={{ color: '#8a8078' }}>
              {activeCat.description}
            </p>

            <div className="flex flex-col gap-8">
              {activeCat.duas.map((dua, i) => (
                <div
                  key={i}
                  className="tqg-card tqg-ornamental dua-animate-in"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {/* Dua number */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '20px',
                      fontFamily: "'EB Garamond', serif",
                      fontSize: '48px',
                      color: 'rgba(184,152,63,0.08)',
                      lineHeight: 1,
                      fontWeight: 400,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  {/* Arabic text */}
                  <p
                    className="tqg-arabic text-2xl md:text-3xl lg:text-4xl mb-6"
                    style={{ color: '#F5E8B0', textAlign: 'right', paddingRight: '4px' }}
                  >
                    {dua.arabic}
                  </p>

                  {/* Divider */}
                  <div
                    style={{
                      height: '1px',
                      background: 'linear-gradient(90deg, transparent, rgba(184,152,63,0.15) 20%, rgba(184,152,63,0.15) 80%, transparent)',
                      margin: '4px 0 16px',
                    }}
                  />

                  {/* Translation */}
                  <p
                    className="tqg-heading text-base md:text-lg mb-4"
                    style={{ color: '#e5e5e5', fontWeight: 400, lineHeight: 1.7, fontStyle: 'italic' }}
                  >
                    &ldquo;{dua.translation}&rdquo;
                  </p>

                  {/* Reference */}
                  <p className="text-xs tracking-wide" style={{ color: 'rgba(184,152,63,0.5)' }}>
                    {dua.reference}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageLayout>
  );
}
