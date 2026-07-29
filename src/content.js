/* ══════════════════════════════════════════════════════════════════════
   EVERYTHING YOU MIGHT WANT TO CHANGE IS IN THIS ONE FILE.

   Prabhat — this is a first draft written from the dates you gave me.
   Read it, and rewrite anything that doesn't sound like you. The site
   picks up your changes the moment you save.

   Nothing here is code you can break. Just keep the quotes ' ' around
   the text, and the commas at the end of lines.
   ══════════════════════════════════════════════════════════════════════ */

/* ── 1. THE TWO OF YOU ─────────────────────────────────────────────── */
export const couple = {
  her: 'Shivani Priya',
  herShort: 'Shivani',
  me: 'Prabhat Kumar',
  meShort: 'Prabhat',
  initials: 'S & P',
};

/* ── 2. THE PASSWORD SCREEN ────────────────────────────────────────────
   The very first thing she sees — this one is in English on purpose.
   Everything after it is Hinglish.

   She has to type one of the `acceptedAnswers` to get in. Spaces, capitals
   and punctuation are ignored, so 'I Love You' and 'iloveyou' both work.  */
export const gate = {
  eyebrow: 'For Shivani Priya',
  heading: 'Say the three magic words',
  subheading: 'and all of this opens up, just for you',
  placeholder: 'Type it here...',
  button: 'Open My Heart',
  hint: 'Only you know the answer',
  error: "Hmm, that's not quite it... try again 🥺",
  acceptedAnswers: ['iloveyou', 'shivani', 'mainaapsepyaarkartahoon'],
};

/* ── 2b. HOW LONG SHE STAYS SIGNED IN ─────────────────────────────────
   After this many minutes of NOT touching anything, she's sent back to
   the password screen. Any tap, scroll or keypress resets the clock, so
   she'll never be kicked out while she's actually reading.

   Set idleLogout to false to stay signed in until the tab is closed.    */
export const session = {
  timeoutMinutes: 5,
  idleLogout: true,
};

/* ── 3. THE FIRST SCREEN (typed out letter by letter) ──────────────── */
export const hero = {
  preTitle: 'I Love You Jaan',
  title: 'Meri Shivani',
  titleEmoji: '❤️',
  subtitle: 'Kuch baatein hain jo main aapse kehna chahta tha.',
  cta: 'Dil Kholiye',
  scrollLabel: 'Scroll',
};

/* ── 4. THE POPUP THAT TYPES ITSELF OUT ───────────────────────────────
   Shows up once, right after the first screen finishes.
   An empty line '' makes a blank line in the poem.
   The photo used here is the first image in src/assets/photos/hero/    */
export const welcome = {
  heading: 'Sirf Aapke Liye 👑',
  caption: 'Meri Shivani ❤️',
  poem: [
    'Ek ladki hai — Shivani Priya.',
    '',
    'Jiski muskaan dekhkar dil dhadakna bhool jaaye,',
    'Jiski ek jhalak kaafi hai poora din bana dene ke liye.',
    '',
    'Masoomiyat aisi jaise subah ki pehli kiran,',
    'Aur khoobsurti aisi ki chaand bhi baadalon ke peeche chhup jaaye.',
    '',
    'Jo sabke liye pehle sochti hai, apne liye baad mein,',
    'Jiski aankhon mein ek poori kahaani hai,',
    'Aur jiski awaaz mein ghar ka sukoon hai.',
    '',
    '25 December 2025 ko maine unhe pehli baar dekha tha.',
    '13 March 2026 ko wo meri ho gayi.',
    '25 November 2026 ko main unka ho jaunga.',
    '',
    '✨ Wo hai… meri Shivani Priya.',
  ],
};

/* ── 5. THE MENU AT THE TOP ───────────────────────────────────────── */
export const nav = {
  logo: '♥ S & P',
  cta: 'Hamari Kahani',
  links: [
    { label: 'Ek Note',   href: '#love-message' },
    { label: 'Bas Aap',   href: '#gallery' },
    { label: 'Yaadein',   href: '#engagement' },
    { label: 'Video',     href: '#video' },
    { label: 'Kyun Aap',  href: '#reasons' },
    { label: 'Kahani',    href: '#timeline' },
  ],
};

/* ── 6. THE SWIPEABLE LOVE NOTES ──────────────────────────────────────
   She drags each card sideways to see the next one.
   The last line of each note is the one that glows gold.               */
export const notes = [
  {
    signature: 'Aapka Prabhat',
    lines: [
      '25 December 2025 — us din maine socha tha bas ek mulaqat hai.',
      'Pata nahi tha ki wahi din meri poori zindagi ka sabse zaroori din ban jaayega.',
      'Aap mil gayi, aur sab set ho gaya. ❤️',
    ],
  },
  {
    signature: 'Aapka Hone Wala Pati',
    lines: [
      'Log kehte hain rishta pehle tay hota hai, pyaar baad mein aata hai.',
      'Mere case mein dono ek hi din ho gaya.',
      'Main us din se hi aapka ho gaya tha. 🌙',
    ],
  },
  {
    signature: 'Aapka Prabhat, hamesha',
    lines: [
      'Aapki ek "khana kha liya?" wali message se poora din theek ho jaata hai.',
      'Office ki thakan, deadlines, tension — sab.',
      'Aap meri sabse sukoon wali jagah ho. ✨',
    ],
  },
  {
    signature: 'Aapka Pagal Pati',
    lines: [
      '13 March 2026 — ring pehnate waqt haath kaanp rahe the mere.',
      'Aapne dekh liya tha, aur haske chhupa liya tha.',
      'Us hansi ke liye main kuch bhi kar sakta hoon. 💍',
    ],
  },
  {
    signature: 'Sirf Aapka',
    lines: [
      'Log poochte hain — itni jaldi kaise pata chal gaya?',
      'Main kya batau, kuch cheezein bas pata chal jaati hain.',
      'Aap meri thi, ho, aur rahogi. 🌹',
    ],
  },
  {
    signature: 'Aapka Prabhat Kumar',
    lines: [
      '25 November 2026 ka intezaar hai.',
      'Us din ke baad har subah aapke saath shuru hogi.',
      'Aur main aapka, poori zindagi ke liye. ❤️',
    ],
  },
];

export const loveMessage = {
  badge: 'Ek chhota note',
  headingBefore: 'Meri',
  headingHighlight: 'Rani',
  headingEmoji: '👑',
  subheading: 'Dil ke sabse andar wale kone se',
  swipeHint: 'agli note ke liye swipe kijiye →',
  endTitle: 'Bas itna hi... filhaal, Biwi Ji.',
  endButton: 'Phir se padhiye ↺',
  cta: 'Dekhiye main kyun pyaar karta hoon',
};

/* ── 7. THE PHOTO GALLERY ─────────────────────────────────────────────
   You do NOT list photos here. Just drop them into the folders:

     src/assets/photos/hero/               ← 1-2 best photos of you both
     src/assets/photos/first-meet/         ← 25 Dec 2025
     src/assets/photos/birthday/           ← 4 Feb, her birthday
     src/assets/photos/families-said-yes/  ← 8 Feb 2026
     src/assets/photos/engagement/         ← 13 Mar 2026
     src/assets/photos/us/                 ← anything else

   Any filename works. .jpg .jpeg .png .webp .avif are supported.
   iPhone .heic files will NOT show — convert them to .jpg first.

   Below is only the *caption* for each folder. If you want to name one
   specific photo, add its filename to `photoCaptions` at the bottom.   */
export const galleryGroups = [
  {
    key: 'engagement',
    tag: '13 Mar 2026',
    labels: ['Sagai Ka Din', 'Ring Ceremony', 'Wo Muskaan', 'Hamari Sagai', 'Officially Meri'],
  },
  {
    key: 'first-meet',
    tag: '25 Dec 2025',
    labels: ['Pehli Mulaqat', 'Wo Pehla Din', 'Jab Sab Tay Hua', 'Shuruaat'],
  },
  {
    key: 'families-said-yes',
    tag: '8 Feb 2026',
    labels: ['Dono Gharon Ki Haan', 'Wo Din', 'Parivaar', 'Haan Ho Gayi'],
  },
  {
    key: 'birthday',
    tag: '4 Feb',
    labels: ['Aapka Birthday', 'Cake Aur Aap', 'Happy Birthday Ji'],
  },
  {
    key: 'us',
    tag: 'Hum Dono',
    labels: ['Hum Dono', 'Bas Aap', 'Chhoti Chhoti Khushiyan', 'Yaadein', 'Aap Aur Main'],
  },
];

/* Optional. Name a specific photo like this: 'engagement/ring.jpg': 'Wo Ring' */
export const photoCaptions = {
  // 'engagement/IMG_1234.jpg': 'Jab haath kaanp rahe the',
};

/* ── 7b. PHOTOS FROM GOOGLE DRIVE ─────────────────────────────────────
   These load straight from your Drive instead of from this project, so
   you can delete the originals off the company laptop.

   Each entry is a Drive file ID — the long code in a share link:
     https://drive.google.com/file/d/THIS_PART_HERE/view

   Drive photos appear FIRST in the gallery, then any local ones.

   ⚠️  Two things to know:
   1. The Drive folders must stay shared as "Anyone with the link".
      If that changes, every photo here goes blank.
   2. Serving images from Drive like this isn't something Google
      officially supports — it works today but could stop. Before the
      25 Nov wedding, move these into src/assets/photos/ instead.
      Everything is already built to handle both.                       */
export const drivePhotos = [
  {
    key: 'engagement',
    tag: '13 Mar 2026',
    labels: ['Sagai Ka Din', 'Ring Ceremony', 'Wo Muskaan', 'Hamari Sagai', 'Officially Meri'],
    /* 26 photos — folder 1oBQ1VBGRV-VttMMvsyUTTBVH4Mv0FOOd */
    ids: [
      '1mtXjqpEUF8ZLHeyLUby3L3kr0DRijnaq', // IMG-20260314-WA0235.jpg
      '1_ew9Hqm4ZT4tvRDZNZKaEFAJLCQfV6Lu', // IMG-20260314-WA0301.jpg
      '1mgUQIzJmAsJwDXc1OJP9vfFriR2j2fR3', // IMG-20260314-WA0309.jpg
      '1Tgcu4gfaUWVcrsPEDqDiYZK69hhVL4x7', // IMG-20260314-WA0311.jpg
      '1mp5z7BjStz02ekMMWODDQV-aMDZs0nnd', // IMG-20260314-WA0313.jpg
      '1XksqBilGfklWY536UzLIt3RoWv72mJE2', // IMG-20260314-WA0314.jpg
      '1feh7ul63uI0au92ZyhcUIS4j8GWhzsXT', // IMG-20260314-WA0316.jpg
      '17_yVeGhmo8e7qYZptIdvGOjI42DVFdUh', // IMG-20260314-WA0317.jpg
      '1w6GBeEtwuKH1hDKg_un8eAIsoNY8dNyR', // IMG-20260314-WA0371.jpg
      '1Vwge-eE0LbrPDP4apTtk99fCE2rUJDIF', // IMG-20260314-WA0377.jpg
      '1q6JRsdUdA8x3xh65DyC1NSbuEuwc5N2P', // IMG-20260314-WA0378.jpg
      '1h7YpU1ny1VM90EDsygz3FmWDf-Zk7zT3', // IMG-20260320-WA0024.jpg
      '1Y9TYqgLdrWopERFrGw1yu3NsPuu8iyRY', // IMG-20260320-WA0025.jpg
      '12K1UbKP-LSOszGtapGdnmZXeqx990Nb2', // IMG-20260320-WA0026.jpg
      '19HG5vK6QJCEKYWO6Wr8LzrIjPKCVgtSM', // IMG-20260320-WA0027.jpg
      '1lshQiuKTO0oqX8jInllZWvfvj9Sum2IP', // IMG-20260320-WA0029.jpg
      '1aYwpBhKw0nDwMrMyk-nAn4KeQApEywTK', // IMG-20260320-WA0030.jpg
      '10DFGtdrov38Rj7iiIYgKWWxsTN93uYkq', // IMG-20260320-WA0031.jpg
      '15jKATBZoib-y2KSOCav4Icm6QSAMi5ge', // IMG-20260320-WA0033.jpg
      '1slDPD6yu16VVj0TGdaMIACVo2lh2GDFM', // IMG-20260320-WA0034.jpg
      '1_ablVrAS30l1i7UvLOdra586OCGWoer6', // IMG-20260529-WA0030.jpg
      '1xQ_tmxHkmnkVEH6kdPh3k1egmyFpZU5n', // IMG-20260529-WA0031.jpg
      '1xD0k8my6xzcrp3zyk6YzBfq-I-YKWDJi', // IMG-20260529-WA0032.jpg
      '18OvDShcRlLV3DppQ-dUDzJvlHid7Pju3', // IMG-20260529-WA0035.jpg
      '1_EyPQHa-iW6cNzklZjQQ48LwiaNGKd67', // IMG-20260531-WA0008.jpg
      '12uLpn4DAcgoSKenPitrCCYRho6h_MY_w', // IMG-20260610-WA0006.jpg
    ],
  },
  {
    key: 'us',
    tag: 'Bas Aap',
    labels: ['Bas Aap', 'Meri Shivani', 'Wo Muskaan', 'Aap Aur Main', 'Yaadein', 'Khoobsurti'],
    /* 21 photos — folder 1RObPgsQaDUi61dBVN_hWOvpuMs4LTkQ9 */
    ids: [
      '1k1nnXawgR12X3-O_-j37kJkt-n-bPUs_', // IMG-20260304-WA0008.jpg
      '1T4xF8lAoIis9D34xK3-II8eb1Mw7yV8h', // IMG-20260312-WA0012.jpg
      '1SmstsHeLsOdLGmf6cFkp9PMEN2NsV60l', // IMG-20260324-WA0055.jpg
      '1nKxTXkxwllp1-BRttGSM6W3BejE1RrDi', // IMG-20260401-WA0019.jpg
      '1RtSLoludfjxrzi3mpmvKMd5ZiJACvumz', // IMG-20260412-WA0002.jpg
      '1XozfQCLCjqDZ2ok0TR1ujknRP-j8u8l3', // IMG-20260415-WA0020.jpg
      '1jx7avu8erLFENNwWj6dXScB5n5ewbTvh', // IMG-20260415-WA0022.jpg
      '19INYUAzwbpIiPp3pxeQPjRNtUwYaHw_N', // IMG-20260415-WA0024.jpg
      '1zCZUwR4HTCp1pxvBgVIQ2XlixTmTTWO5', // IMG-20260420-WA0025.jpg
      '18Di3NXzWCw0Fqu7S17_VXisOSaIbIjn5', // IMG-20260425-WA0048.jpg
      '1d_7Vvt1nsguR8OdrfXYxQNSjWqpN2vqP', // IMG-20260425-WA0050.jpg
      '1xnkiI4H8DkdGRJOPBjo4rfWU7ryRdSY-', // IMG-20260426-WA0002.jpg
      '1azLDRwBAJG5OI3HWXdPcWkYRVlx6jsOL', // IMG-20260426-WA0007.jpg
      '12ncp7uhk7wQ9nZsNwVg6dna19OF9SeBp', // IMG-20260426-WA0010.jpg
      '1_WW5gl5XuAoPqvbLCQUYF_APD2bMOfXS', // IMG-20260427-WA0022.jpg
      '1fIK8H1UgDVuribqq1wjxbWWdFkPECmr0', // IMG-20260427-WA0045.jpg
      '1n8y7jdZIctaBKKjJXhH80MrQi2swmTsK', // IMG-20260427-WA0112.jpg
      '1bKKGyKWXW0yV28o282Er49DELCcls1Oq', // IMG-20260517-WA0018.jpg
      '1pQKn_Gtw7H8u_VVre128G70iVBsmACW8', // IMG-20260518-WA0008.jpg
      '1QLP_znDlcW5YQUELj2izv5HR9jKDbbS9', // IMG-20260605-WA0017.jpg
      '1uqbf3Zuw0LqqDdovndQ-dhPSwKFBBDZ1', // IMG-20260608-WA0054.jpg
    ],
  },
];

/* The photo that shows in the welcome popup — the one of Shivani holding the
   roses. Just a Drive file ID, so it doesn't need to be one of the gallery
   photos (though this one is).

   A photo dropped into src/assets/photos/hero/ overrides this.              */
export const welcomeDrivePhoto = { id: '1jx7avu8erLFENNwWj6dXScB5n5ewbTvh' };

/* There are TWO photo sections, each with its own song.
   `gallery` = Shivani's photos.  `galleryEngagement` = the sagai photos.  */
export const gallery = {
  badge: 'Bas Aap',
  headingBefore: 'Meri',
  headingHighlight: 'Shivani',
  subheading: 'Kuch tasveerein, jo main baar baar dekhta hoon.',
  tapHint: 'Koi bhi photo kholiye — ek gaana bajega',
  seeMore: 'Saari Dekhiye',
  quote: '"Tujhe na dekhu toh chain mujhe aata nahi hai."',
  emptyTitle: 'Photos abhi add nahi hui hain',
  emptyHint: 'src/assets/photos/us/ mein photos daaliye',
};

export const galleryEngagement = {
  badge: 'Yaadein',
  headingBefore: 'Sagai Ki',
  headingHighlight: 'Yaadein',
  subheading: '13 March 2026 — har photo mein ek poori kahaani hai.',
  tapHint: 'Koi bhi photo kholiye — ek gaana bajega',
  seeMore: 'Saari Yaadein Dekhiye',
  quote: '"Yaadein hi wo cheez hain jo kabhi purani nahi hoti."',
  emptyTitle: 'Photos abhi add nahi hui hain',
  emptyHint: 'src/assets/photos/engagement/ mein photos daaliye',
};

/* ── 8. THE ENGAGEMENT VIDEO ──────────────────────────────────────────
   Three ways to supply a video. Give each entry ONE of `driveId`,
   `youtubeId` or `file`:

   driveId    — the ID from a Drive share link. Plays in Drive's own
                player. Needs the file shared as "Anyone with the link".
                Zero extra work, but Google's player chrome shows and it
                can stall on a slow connection.

   youtubeId  — the code after `watch?v=` on YouTube. Upload as UNLISTED
                (not Private — private videos won't embed). Best playback
                by a wide margin; it adapts to her phone's signal.
                RECOMMENDED, and switching is a one-line change.

   file       — a .mp4 in public/videos/. Nicest-looking player, but the
                file has to live on this machine.                        */
export const videos = [
  {
    driveId: '1lVJwSJExRs3XA1cQUoqTc9be1mixI1uo',
    youtubeId: '',   // ← paste the YouTube code here and it switches over
    file: '',
    title: 'Sagai Ka Din',
    caption: '13 March 2026 — jo din main kabhi nahi bhool paunga.',
  },
];

export const videoSection = {
  badge: 'Sagai',
  headingBefore: 'Wo Din, Jo',
  headingHighlight: 'Reh Gaya',
  subheading: '13 March 2026. Dekhiye.',
  emptyTitle: 'Video abhi add nahi hui hai',
  emptyHint: 'public/videos/sagai.mp4 par apni video rakhiye',
};

/* ── 9. WHY YOU LOVE HER ──────────────────────────────────────────────
   Add, remove or rewrite freely — the counter at the top counts them
   automatically. Put in your real inside jokes; that's what she'll
   actually cry over.                                                   */
export const reasons = [
  {
    icon: '😊',
    title: 'Aapki Muskaan',
    desc: 'Pehli baar jab aap hansi thi, mujhe lagta hai wahi moment tha jab main haar gaya tha. Aaj bhi wahi effect hai.',
  },
  {
    icon: '👀',
    title: 'Aapki Aankhein',
    desc: 'Aap kuch bolti nahi ho, aankhein sab bata deti hain. Khushi ho ya gussa — dono mein khoobsurat.',
  },
  {
    icon: '🎵',
    title: 'Aapki Awaaz',
    desc: 'Phone pe sirf "hello" sun lu, din accha ho jaata hai. Itni meethi awaaz kahan se laati ho?',
  },
  {
    icon: '🍲',
    title: 'Aapka "Khana Kha Liya?"',
    desc: 'Duniya ka sabse chhota sawaal, aur mere liye sabse bada pyaar. Roz poochti ho, roz accha lagta hai.',
  },
  {
    icon: '🏠',
    title: 'Aapka Sabko Jodna',
    desc: 'Mere ghar walon ne aapko pehle din hi apna maan liya. Aise hi nahi hota ye — ye aapka kamaal hai.',
  },
  {
    icon: '🤗',
    title: 'Aapka Sabar',
    desc: 'Mera kaam, meri late nights, meri bakwaas — sab jhelti ho. Aur ek baar bhi shikayat nahi.',
  },
  {
    icon: '🌙',
    title: 'Raat Ki Baatein',
    desc: 'Neend aankhon mein hoti hai, phir bhi "ek aur baat" chalti rehti hai. Wahi baatein sabse achhi hain.',
  },
  {
    icon: '👗',
    title: 'Sagai Wale Din Ka Look',
    desc: 'Us din aap jo lagi thi... main baar baar dekhta reh gaya tha. Sach mein, saans ruk gayi thi.',
  },
  {
    icon: '🎁',
    title: 'Aapki Yaadash',
    desc: 'Aap chhoti chhoti baatein yaad rakh leti ho jo main khud bhool jaata hoon. Ye sabse bada pyaar hai.',
  },
  {
    icon: '😄',
    title: 'Aapka Bachpana',
    desc: 'Ek minute serious, dusre minute poori bachchi. Dono roop mujhe barabar pasand hain.',
  },
  {
    icon: '🙏',
    title: 'Aapka Dil',
    desc: 'Aap sabke liye pehle sochti ho, apne liye baad mein. Aisa dil aajkal milta nahi hai.',
  },
  {
    icon: '♾️',
    title: 'Aap, Bas Aap',
    desc: 'Reasons khatam ho jaayenge, wajah nahi. Aap ho — utna hi kaafi hai.',
  },
];

export const reasonsSection = {
  badge: 'Wajah',
  headingAfter: 'Wajah',
  subheading: 'Main Aapse Kyun Pyaar Karta Hoon',
  note: 'Ye toh bas kuch hain — asli list khatam hi nahi hoti.',
  quote: '"Aur hazaar wajahein, jo shabdon mein aa hi nahi sakti."',
  signature: '— Hamesha aapka',
};

/* ── 10. YOUR STORY, DATE BY DATE ─────────────────────────────────────
   `side` decides whether the card sits left or right of the line.
   Keep them alternating for the nicest look.                           */
export const timeline = [
  {
    date: '25 December 2025',
    title: 'Pehli Mulaqat',
    desc: 'Wo din jab sabne ek dusre ko chuna. Ghar wale baat kar rahe the, aur main chupke chupke bas aapko dekh raha tha. Ghar aake sabse pehle jo yaad tha — aapki muskaan.',
    icon: '🌟',
    side: 'left',
  },
  {
    date: '4 February 2026',
    title: 'Aapka Birthday, Aur Main',
    desc: 'Pehli baar aapka birthday aaya jab main aapko jaanta tha. Aur mazedaar baat — uske sirf 4 din baad ghar walon ne haan kar di. Us February ne meri zindagi badal di.',
    icon: '🎂',
    side: 'right',
  },
  {
    date: '8 February 2026',
    title: 'Dono Gharon Ki Haan',
    desc: 'Wo din jab tay hua ki hum shaadi karenge, aur dono parivaar ne khushi khushi haan kar di. Main us raat so nahi paaya tha — sach mein.',
    icon: '🤝',
    side: 'left',
  },
  {
    date: '13 March 2026',
    title: 'Sagai',
    desc: 'Ring pehnate waqt haath kaanp rahe the. Aapne dekh liya tha, aur haske chhupa liya. Us din se aap officially meri ho gayi.',
    icon: '💍',
    side: 'right',
  },
  {
    date: '25 November 2026',
    title: 'Shaadi',
    desc: 'Ab bas kuch mahine. Us din ke baad har subah aapke saath shuru hogi, aur har raat aapke saath khatam. Main din ginn raha hoon.',
    icon: '🎉',
    side: 'left',
  },
];

export const timelineSection = {
  badge: 'Hamari Kahani',
  headingBefore: 'Hamari',
  headingHighlight: 'Chhoti Si Duniya',
  subheading: 'Har pyaari kahani yaad rakhne layak hoti hai. Ye hamari hai.',
  endNote: 'Aur ye toh sirf shuruaat hai...',
};

/* ── 11. THE LAST SECTION — the "No" button that runs away ─────────── */
export const finale = {
  question: 'Kya aap hamesha meri rahogi?',
  questionHighlight: 'meri rahogi?',
  yesButton: 'HAAN! 💖',
  /* Every time she tries to press "No" the button runs away and says the next
     line. It works through the whole list in order and then stays on the last
     one — so keep the saddest, most pleading line at the end. */
  noTexts: [
    'Nahi...',
    'Kya? 😐',
    'Kyun 🤨',
    'Socha tha pyaar hai 😢',
    'Aise picha nahi chhutega 😤',
    'Ek baar soch lijiye 🥺',
    'Main ro dunga 😭',
    'Please haan bol do na 🥹',
  ],
  noCaught: 'Pata tha pyaar toh hai 😏',
  yesReply: 'Aapne meri zindagi ki sabse badi khushi unlock kar di. ❤️',
  headingBefore: 'Hamesha',
  headingHighlight: 'Aapka',
  closing: 'Kahin bhi ho — aapke dil mein hi milunga.',
  lines: ['💌 Prabhat ➜ Shivani', '📍 Aapke dil mein'],
  footerNote: 'Yahan jo bhi likha hai seedha dil se aaya hai.',
  footerCredit: '— Prabhat Kumar, hamesha aapka.',
};

/* ── 12. MUSIC ────────────────────────────────────────────────────────
   A different song for each photo group, and silence during the video.

   Each song's `file` can be EITHER:
     • a filename in public/songs/  e.g. 'janam-janam.mp3'
     • a full URL                   e.g. 'https://.../song.mp3'
       (a Google Drive share link works — it gets converted automatically)

   Leave a `file` empty ('') and that section simply plays nothing.

   How it behaves:
   • The song changes as she scrolls between the two photo sections,
     cross-fading rather than cutting.
   • Everything goes quiet when she reaches the engagement video, and
     comes back after she scrolls away.
   • Browsers block autoplay until she taps something. Her first tap is
     the password screen, so she never notices the delay.
   • There's a play/pause button bottom-left if she wants silence.

   `for` must match a `key` in drivePhotos / galleryGroups above, or be
   the literal 'video' to force silence in the video section.            */
export const soundtrack = [
  {
    for: 'us',
    /* "Tujhe Na Dekhu Toh Chain" — from Rang (1993),
       Kumar Sanu & Alka Yagnik. Same film as "Tumhein Dekhen Meri
       Aankhen", which is a different song — don't mix them up. */
    file: 'https://drive.google.com/file/d/14OUHVAc3nX2PaudJqGDcpYBV5kO1f2Eo/view',
    title: 'Tujhe Na Dekhu Toh Chain',
    volume: 0.5,
  },
  {
    for: 'engagement',
    /* "Janam Janam Jo Saath Nibhaye" — from Raja Bhaiya (2003),
       Udit Narayan & Alka Yagnik. NOT the Dilwale song of a similar name. */
    file: 'https://drive.google.com/file/d/1utqG8fzYroHJzzlv3gzkj0R-JXwjIK3i/view',
    title: 'Janam Janam Jo Saath Nibhaye',
    volume: 0.5,
  },
  {
    for: 'video',
    file: '',          // deliberately silent — your video has its own audio
    title: '',
    volume: 0,
  },
];

/* Nothing plays until she opens a photo. Set this to 'us' or 'engagement'
   if you'd rather a song started the moment she gets past the password. */
export const openingSong = '';
