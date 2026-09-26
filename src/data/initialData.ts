import { User, Article, Edition, AppNotification, Category } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-creative-writing',
    name: 'Creative Writing',
    description: 'Fiction, short stories, narrative prose, speculative sci-fi, and creative writing.',
    color: 'purple',
    createdAt: '2026-01-01',
  },
  {
    id: 'cat-technical-research',
    name: 'Technical Research',
    description: 'Undergraduate papers, software development protocols, quantum studies, and technical dispatches.',
    color: 'amber',
    createdAt: '2026-01-01',
  },
  {
    id: 'cat-opinion',
    name: 'Opinion',
    description: 'Campus discourse, editorial commentaries, ethical inquiries, and cultural critiques.',
    color: 'sky',
    createdAt: '2026-01-01',
  },
  {
    id: 'cat-campus-life',
    name: 'Campus Life',
    description: 'Campus events, student society chronicles, hackathons, and collegiate culture.',
    color: 'emerald',
    createdAt: '2026-01-01',
  },
  {
    id: 'cat-poetry',
    name: 'Poetry',
    description: 'Lyric verse, free verse sequences, sonnets, and classical meter.',
    color: 'rose',
    createdAt: '2026-01-01',
  },
  {
    id: 'cat-visual-artwork',
    name: 'Visual Artwork & Critique',
    description: 'Print broadsides, architectural lithographs, photography, and art reviews.',
    color: 'stone',
    createdAt: '2026-01-01',
  },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-student-1',
    name: 'Kavya Krishnan',
    email: 'kavya.krishnan@campus.edu',
    role: 'student_contributor',
    department: 'Computer Science & Indic Computational Linguistics',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    bio: 'Junior researcher investigating Paninian generative grammars, Dhvani theory, and semantic resonance in contemporary computational poetics.',
    studentId: 'ST-2023-8891',
    publicationsCount: 3,
  },
  {
    id: 'user-student-2',
    name: 'Arjun Ramanathan',
    email: 'arjun.ramanathan@campus.edu',
    role: 'student_contributor',
    department: 'Applied Physics & Quantum Condensed Matter',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80',
    bio: 'Senior undergraduate investigator studying Bose-Einstein condensation, topological superconductivity, and cryogenic instrumentation.',
    studentId: 'ST-2022-4109',
    publicationsCount: 2,
  },
  {
    id: 'user-student-3',
    name: 'Devika Nambiar',
    email: 'devika.nambiar@campus.edu',
    role: 'student_contributor',
    department: 'Comparative Literature & Philosophy of Science',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    bio: 'Undergraduate essayist and poet exploring monsoon aesthetics, archival memory, and linguistic translation.',
    studentId: 'ST-2024-3012',
    publicationsCount: 2,
  },
  {
    id: 'user-student-4',
    name: 'Rohan Deshmukh',
    email: 'rohan.deshmukh@campus.edu',
    role: 'student_contributor',
    department: 'Environmental Robotics & Sensor Systems',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    bio: 'Investigating distributed IoT telemetry for river basin aquifers and open-hardware microclimate sensors.',
    studentId: 'ST-2023-5520',
    publicationsCount: 1,
  },
  {
    id: 'user-admin-1',
    name: 'Prof. Gayatri Sengupta',
    email: 'gayatri.sengupta@campus.edu',
    role: 'editorial_admin',
    department: 'Department of English & Comparative Aesthetics (Faculty Chair)',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
    bio: 'Faculty Advisor and Editor-in-Chief of Pratidhwani. Oversees peer review integrity and cross-disciplinary standards.',
  },
  {
    id: 'user-admin-2',
    name: 'Dr. Anand Vardhan',
    email: 'anand.vardhan@campus.edu',
    role: 'editorial_admin',
    department: 'Managing Editor · Institute for Science, Technology & Society',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    bio: 'Oversees the print broadside compiler, copyediting board, and technical dispatch verification.',
  }
];

export const INITIAL_EDITION: Edition = {
  id: 'vol-28-issue-1',
  volume: 28,
  issue: 1,
  academicYear: '2025–2026',
  title: 'Silicon & Stanzas: The 2026 Annual Edition',
  subtitle: 'Dialogues on Algorithmic Solitude, Quantum Coherence, and Contemporary Campus Poetics',
  coverImage: '/src/assets/images/spotlight_magazine_cover_1790412809281.jpg',
  publicationDate: 'March 2026',
  editorInChief: 'Prof. Gayatri Sengupta',
  managingEditor: 'Dr. Anand Vardhan',
  themeDescription: 'The 28th Annual Edition explores the fertile intersection of computational logic and subjective human inquiry. Featuring 18 peer-reviewed student manuscripts across experimental physics, philosophical treatises, and sonnet cycles.',
  editorialLetter: `To the Campus Community,

When we founded Pratidhwani forty-two years ago in the basement of the old Science Hall, the premise was simple: that a campus should not be partitioned into two uncommunicative hemispheres of technical precision and literary contemplation.

In this twenty-eighth volume, we present work that embodies that reciprocal challenge. Our student authors grapple not with computational machinery as a novelty, but as a lens into human alienation, thermodynamic limits, and linguistic reinvention. 

We invite you to spend deliberate time with these pieces—whether in the physical broadsheet edition or through our digital reading room.

In collegiality,
Prof. Gayatri Sengupta & Dr. Anand Vardhan
The Editorial Board of Pratidhwani`,
  tableOfContents: [
    {
      sectionTitle: 'Spotlight Feature',
      articleIds: ['art-1', 'art-2', 'art-5', 'art-7'],
    },
    {
      sectionTitle: 'Technical Dispatches',
      articleIds: ['art-4', 'art-6'],
    },
    {
      sectionTitle: 'Poetic Anthology',
      articleIds: ['art-3'],
    }
  ],
  isCurrentSpotlight: true,
};

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Dhvani in the Digital Age',
    subtitle: 'Anandavardhana’s aesthetics, semantic suggestion, and the limits of probabilistic verse in generative neural models.',
    authorId: 'user-student-1',
    authorName: 'Kavya Krishnan',
    authorDepartment: 'Computer Science & Indic Computational Linguistics',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    category: 'Technical Research',
    coverImage: '/src/assets/images/article_neural_poetry_1790412823487.jpg',
    readTimeMinutes: 7,
    tags: ['software development', 'Computational Poetics', 'Dhvani Theory', 'NLP', 'Aesthetics'],
    status: 'published',
    editionId: 'vol-28-issue-1',
    sectionName: 'Spotlight Feature',
    createdAt: '2026-02-12',
    publishedAt: '2026-03-01',
    likesCount: 96,
    likedBy: ['user-student-2', 'user-admin-1'],
    abstract: 'Applying Anandavardhana’s 9th-century Dhvanyaloka to modern transformer architectures, interrogating whether next-token probabilistic models can evoke true poetic resonance (vyangyartha) or merely mimic literal syntax.',
    content: `In the ninth century, the Kashmiri aesthetician Anandavardhana formulated a foundational treatise on poetic suggestion titled the Dhvanyaloka. He argued that poetry does not achieve greatness merely through explicit denotation (vacyartha) or metaphoric extension (laksanartha); rather, true poetic resonance resides in dhvani—the unsaid, evocative frequency that reverberates in the receptive reader's consciousness like the lingering resonance of a struck bronze bell.

Fast-forward twelve centuries to the era of large autoregressive language models trained on trillions of token sequences. The machine executes the axis of lexical selection with startling mathematical fluency. It can output Shakespearean blank verse, Urdu couplets, or free-verse stanzas adhering to intricate prosodic constraints.

Yet, when subjected to close aesthetic evaluation under the lens of dhvani, a profound theoretical boundary emerges.

Autoregressive transformer models predict the next sub-word token by calculating dot-product attention probabilities across massive contextual weight matrices. The model maximizes the likelihood of tokens based on surface frequencies and semantic co-occurrence. In contrast, dhvani operates precisely at the coordinates where literal meaning breaks open under subjective existential pressure. 

In our student experiments within the university computational linguistics laboratory, we analyzed prompt completions across classical lyric forms. The algorithmic outputs consistently master the abhidha (literal meaning) and generate superficially pleasing figures of speech (alamkara). But the machine lacks what the Indian tradition terms hrdayasamvada—the empathetic resonance of an embodied heart that has known winter, grief, or mortality.

The model calculates the statistical probability of longing; the human poet endures the silence between two breaths.

As student technologists and writers working at the confluence of silicon hardware and comparative poetics, our mandate is neither techno-cynicism nor uncritical awe. Recognizing dhvani in the digital age reminds us that the algorithm is not an autonomous oracle of poetic soul; it is a mirrorscape of our collective lexical past, challenging us to discover new modes of human suggestion that no statistical distribution can forecast.`,
    comments: [
      {
        id: 'c-1',
        articleId: 'art-1',
        articleTitle: 'Dhvani in the Digital Age',
        authorId: 'user-admin-1',
        authorName: 'Prof. Gayatri Sengupta',
        authorRole: 'Editorial Board Admin',
        authorDepartment: 'Department of English & Aesthetics',
        content: 'A breathtaking and rigorously theorized essay, Kavya. Your framing of Anandavardhana’s Dhvanyaloka against transformer attention mechanisms sets an exemplary benchmark for Pratidhwani.',
        createdAt: '2026-03-02',
        isReadByAuthor: true,
      },
      {
        id: 'c-2',
        articleId: 'art-1',
        articleTitle: 'Dhvani in the Digital Age',
        authorId: 'user-student-2',
        authorName: 'Arjun Ramanathan',
        authorRole: 'Student Contributor',
        authorDepartment: 'Applied Physics',
        content: 'The acoustic metaphor of the struck bronze bell (anuranana-dhvani) parallels how coherent modes sustain resonance in low-temperature physics. Truly illuminating!',
        createdAt: '2026-03-04',
        isReadByAuthor: false,
      }
    ],
    editorialFeedback: {
      reviewerName: 'Prof. Gayatri Sengupta',
      decision: 'approved',
      notes: 'Unanimously accepted for the Volume 28 Lead Spotlight Feature. Exceptional cross-disciplinary scholarship.',
      date: '2026-02-28',
      targetSection: 'Spotlight Feature',
    },
    aiAnalysis: {
      readabilityScore: 72,
      gradeLevel: 'Collegiate Scholarly / Literary Journal Standard',
      clarityScore: 95,
      toneAssessment: 'Nuanced scholarly cadence fusing classical Indian poetics with contemporary neural architecture theory.',
      grammarIssues: [],
      vocabularyElevations: [],
      editorialCommendation: 'Superb conceptual cohesion between Sanskrit aesthetic philosophy and transformer probability distributions.',
      revisionTip: 'Maintain this disciplined and evocative scholarly voice.',
    }
  },
  {
    id: 'art-2',
    title: 'Bose-Einstein Statistics and the Architecture of Cryogenic Silence',
    subtitle: 'Reflections on Satyendra Nath Bose’s legacy, macro-quantum coherence, and the stillness of dilution refrigerators.',
    authorId: 'user-student-2',
    authorName: 'Arjun Ramanathan',
    authorDepartment: 'Applied Physics & Quantum Condensed Matter',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80',
    category: 'Technical Research',
    coverImage: '/src/assets/images/article_quantum_computing_1790412835682.jpg',
    readTimeMinutes: 9,
    tags: ['software development', 'Condensed Matter', 'Bose Statistics', 'Quantum Optics', 'Cryogenics'],
    status: 'published',
    editionId: 'vol-28-issue-1',
    sectionName: 'Spotlight Feature',
    createdAt: '2026-02-18',
    publishedAt: '2026-03-01',
    likesCount: 78,
    likedBy: ['user-student-1'],
    abstract: 'Exploring how Satyendra Nath Bose’s 1924 statistical formulation re-envisions quantum indistinguishability, examined through the tactile lens of contemporary cryogenic lab machinery.',
    content: `In June 1924, a young reader in physics at the University of Dacca named Satyendra Nath Bose mailed a short manuscript to Albert Einstein in Berlin. The paper, written without institutional fanfare, derived Planck's radiation law without relying on classical electrodynamics by treating photons as fundamentally indistinguishable particles.

A century later, three floors below the campus central quad in our Low-Temperature Physics Laboratory, that indistinguishability ceases to be a mathematical abstraction; it becomes tangible cold matter.

Suspended inside our helium dilution refrigerator is a golden, multi-tiered chandelier. To observe quantum condensation, one must purge all thermal frenzy from the atomic lattice. At room temperature, gas particles resemble an agitated crowd of individuals, each possessing a distinct velocity vector. But as we pump liquid helium-3 and helium-4 across the mixing chamber, cooling the sample down to 12 millikelvin, the thermal de Broglie wavelength expands until it exceeds the interatomic spacing.

Suddenly, individual identities dissolve. Thousands of atoms coalesce into a single macroscopic wave function—a solitary, unified quantum entity humming with zero entropy.

In our undergraduate experiments with rubidium vapors and topological superconductor heterostructures, the physical stillness required to preserve this state is humbling. Every microwave filter and copper braid is engineered to eliminate stray thermal photons. 

Sitting alone in the control booth at 2:00 AM, watching the thermometers stabilize at 0.015 Kelvin, one realizes that Satyendra Nath Bose's mathematics was not merely a mechanical breakthrough in statistical mechanics; it was a profound ontological revelation: that at the coldest thresholds of existence, separation is an illusion, and matter learns to sing in unison.`,
    comments: [
      {
        id: 'c-3',
        articleId: 'art-2',
        articleTitle: 'Bose-Einstein Statistics and the Architecture of Cryogenic Silence',
        authorId: 'user-admin-1',
        authorName: 'Prof. Gayatri Sengupta',
        authorRole: 'Editorial Board Admin',
        authorDepartment: 'Faculty Chair',
        content: 'Your portrayal of Bose\'s 1924 Dacca dispatch alongside the modern dilution fridge marries history of science with breathtaking prose.',
        createdAt: '2026-03-05',
        isReadByAuthor: true,
      }
    ],
    editorialFeedback: {
      reviewerName: 'Prof. Gayatri Sengupta',
      decision: 'approved',
      notes: 'Superb technical precision and historical reverence. Fits seamlessly into our annual spotlight feature.',
      date: '2026-02-27',
      targetSection: 'Spotlight Feature',
    }
  },
  {
    id: 'art-3',
    title: 'Varsha Ritu in the Central Archives: A Sequence in Free Verse',
    subtitle: 'On monsoon petrichor, Kalidasa’s Meghaduta, and the quiet camaraderie of late-night scholars.',
    authorId: 'user-student-3',
    authorName: 'Devika Nambiar',
    authorDepartment: 'Comparative Literature & Philosophy of Science',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    category: 'Poetry',
    readTimeMinutes: 4,
    tags: ['campus events', 'Lyric Poetry', 'Monsoon Poetics', 'Kalidasa', 'Campus Archives'],
    status: 'published',
    editionId: 'vol-28-issue-1',
    sectionName: 'Poetic Anthology',
    createdAt: '2026-02-20',
    publishedAt: '2026-03-01',
    likesCount: 51,
    likedBy: ['user-student-2'],
    abstract: 'A three-part poetic sequence recording petrichor rising from campus flagstones, damp cloth-bound folios, and the quiet rhythm of midnight study.',
    content: `I. THE SMELL OF RAIN ON DRY RED BRICK

Before the cloudburst breaks across the quad,
the earth gives up its petrichor—
geosmin rising like an unsealed letter
from the red clay between the paving stones.

Through the open clerestory windows of Room 204,
the scent drifts over tables of open notebooks,
rustling through pages of differential calculus
and half-translated verses of Kalidasa's cloud messenger.

II. FOLIO 41: THE HERBARIUM

In the deep basement stacks,
pressed between blotting paper from nineteen-twenty,
a sprig of mountain fern still holds its emerald ghost.
A student's hand in iron-gall ink had written:
"Collected at dusk near the Nilgiri foothills;
spores unopened, waiting for morning humidity."

A century later, my finger traces the dry vein.
Outside, lightning splits the university clocktower;
inside, time has been folded into cotton rag.

III. THE SHADOWS COMPILE

Across the scarred teak library table,
we drink cold chai from steel tumblers,
listening to the rain hammer the copper gutters.
The screen goes dark. The ink remains.`,
    comments: [],
    editorialFeedback: {
      reviewerName: 'Prof. Gayatri Sengupta',
      decision: 'approved',
      notes: 'Evocative imagery and profound sensory restraint. Accepted for Poetic Anthology.',
      date: '2026-02-26',
    }
  },
  {
    id: 'art-4',
    title: 'Kaveri-Ganga Basin Hydrology: Open-Source Sensor Mesh for Participatory Water Governance',
    subtitle: 'Bridging low-cost acoustic flow sensors, LoRa telemetry, and participatory agrarian water governance across village panchayats.',
    authorId: 'user-student-4',
    authorName: 'Rohan Deshmukh',
    authorDepartment: 'Environmental Robotics & Sensor Systems',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    category: 'Technical Research',
    readTimeMinutes: 6,
    tags: ['software development', 'Environmental Tech', 'Open Hardware', 'Hydrology', 'IoT'],
    status: 'published',
    editionId: 'vol-28-issue-1',
    sectionName: 'Technical Dispatches',
    createdAt: '2026-02-24',
    publishedAt: '2026-03-01',
    likesCount: 39,
    likedBy: [],
    abstract: 'A field report detailing an open-source acoustic flow meter network deployed by undergraduate researchers along agrarian drainage corridors.',
    content: `Groundwater depletion across seasonal monsoonal basins is frequently hindered by a data vacuum: industrial hydrometric stations are cost-prohibitive for village panchayats and local watershed committees.

Over the past three semesters, our student robotics team designed and field-tested an open-hardware acoustic Doppler flow sensor constructed with 3D-printed venturis and commodity piezo transducers. Transmitting over a sub-gigahertz LoRa mesh, each node consumes under 12 milliwatts while sampling hydrostatic head pressures at fifteen-minute intervals.

By making both the PCB schematics and the calibration firmware public under permissive CERN Open Hardware licenses, we demonstrate how collegiate research can bridge rigorous signal processing with direct civic empowerment.`,
    comments: [],
    editorialFeedback: {
      reviewerName: 'Dr. Anand Vardhan',
      decision: 'approved',
      notes: 'Timely policy inquiry for our campus community.',
      date: '2026-02-27',
    }
  },
  {
    id: 'art-5',
    title: 'Antariksha-7: The Sanskrit Sub-Orbital Compiler of Vikram Sarabhai Orbit',
    subtitle: 'A speculative sci-fi novelette exploring cosmic ray bit-flips, Paninian grammar, and deep-space code repositories.',
    authorId: 'user-student-3',
    authorName: 'Devika Nambiar',
    authorDepartment: 'Comparative Literature & Philosophy of Science',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    category: 'Creative Writing',
    coverImage: '/src/assets/images/spotlight_magazine_cover_1790412809281.jpg',
    readTimeMinutes: 8,
    tags: ['sci-fi', 'software development', 'Creative Writing', 'Speculative Fiction', 'Antariksha'],
    status: 'published',
    editionId: 'vol-28-issue-1',
    sectionName: 'Spotlight Feature',
    createdAt: '2026-02-27',
    publishedAt: '2026-03-01',
    likesCount: 64,
    likedBy: ['user-student-1', 'user-student-4'],
    abstract: 'In a decommissioned orbital station, two archivists discover that thirty years of cosmic ray radiation has rewritten an ancient operating system into a self-organizing Paninian poetry engine.',
    content: `The hum of the ion radiator was the only sound left on Antariksha Station Seven. Three hundred kilometers above the lunar terminator, the copper pipes rattled with the pulse of supercooled freon.

Dr. Vane adjusted her optical visor. On the terminal glowed eighteen thousand lines of Rust firmware written during the initial planetary survey of 2084. 

"The checksum doesn't match," she whispered across the telemetry bay.

Her apprentice looked up from a stack of magnetic tape cartridges. "Solar bit-flip?"

"Not random," Vane replied, running her finger over the phosphorescent cursor. "Cosmic radiation didn't corrupt the instruction set. It compiled it. The error handlers have mutated into Ashtadhyayi generative meters."

They watched in quiet fascination as the compiler looped through its memory registers. For decades, humanity had sought signs of alien consciousness in radio spectra and pulsar frequencies. They had never considered that the cosmos would simply use our own abandoned compilers to tell us how cold the vacuum truly was.`,
    comments: [
      {
        id: 'c-4',
        articleId: 'art-5',
        articleTitle: 'Antariksha-7: The Sanskrit Sub-Orbital Compiler of Vikram Sarabhai Orbit',
        authorId: 'user-student-1',
        authorName: 'Kavya Krishnan',
        authorRole: 'Student Contributor',
        authorDepartment: 'Indic Computational Linguistics',
        content: 'The synthesis of actual systems programming syntax with poetic estrangement is haunting. One of the best sci-fi pieces Pratidhwani has ever featured!',
        createdAt: '2026-03-03',
        isReadByAuthor: true,
      }
    ],
    editorialFeedback: {
      reviewerName: 'Prof. Gayatri Sengupta',
      decision: 'approved',
      notes: 'Exceptional craft in speculative sci-fi and technical metaphor.',
      date: '2026-02-28',
    }
  },
  {
    id: 'art-6',
    title: 'Cutting Chai, Code & Canteens: The 48-Hour Pratidhwani Hackathon',
    subtitle: 'An anthropological chronicle of student all-nighters, samosas, and frantic git commits inside the Old Engineering Atrium.',
    authorId: 'user-student-4',
    authorName: 'Rohan Deshmukh',
    authorDepartment: 'Environmental Robotics & Sensor Systems',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    category: 'Campus Life',
    coverImage: '/src/assets/images/campus_literary_society_1790412848157.jpg',
    readTimeMinutes: 5,
    tags: ['campus events', 'software development', 'Campus Life', 'Hackathon', 'Chai Culture'],
    status: 'published',
    editionId: 'vol-28-issue-1',
    sectionName: 'Technical Dispatches',
    createdAt: '2026-02-15',
    publishedAt: '2026-03-01',
    likesCount: 82,
    likedBy: ['user-student-3'],
    abstract: 'Documenting the sleepless solidarity, steaming cutting chai, and frantic git commits that define collegiate hackathons as modern rituals of campus belonging.',
    content: `At 3:42 AM inside the glass atrium of the Old Engineering Hall, the air smells of freshly poured cutting chai from the campus tapri, spicy samosas, dry-erase marker fumes, and the electric ozone of five hundred overheating laptop fans.

This is the annual Pratidhwani Hackathon—a rite of passage where undergraduate computer scientists, poets, and electrical engineers converge to build impossible contraptions in forty-eight hours.

What is captivating about this campus tradition is not merely the final git commits or the sponsor awards, but the raw culture of open mutual aid. When a team of freshman mechanical engineers burned out their motor controllers, a senior physics student two tables over immediately unclipped her own oscilloscope to diagnose their bridge rectifier.

In an era of hyper-individualized academic performance, the collegiate hackathon stands as an island of collective vulnerability and shared creation.`,
    comments: [],
    editorialFeedback: {
      reviewerName: 'Dr. Anand Vardhan',
      decision: 'approved',
      notes: 'Heartfelt reportage capturing the spirit of student engineering culture.',
      date: '2026-02-28',
    }
  },
  {
    id: 'art-7',
    title: 'Swaraj in Scholarship: The Case for Radical Open-Access in Indian Academia',
    subtitle: 'Why student academic research and creative portfolios must belong unconditionally to the public commons.',
    authorId: 'user-student-1',
    authorName: 'Kavya Krishnan',
    authorDepartment: 'Computer Science & Indic Computational Linguistics',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    category: 'Opinion',
    coverImage: '/src/assets/images/article_quantum_computing_1790412835682.jpg',
    readTimeMinutes: 6,
    tags: ['software development', 'campus events', 'Opinion', 'Academic Freedom', 'Swaraj in Ideas'],
    status: 'published',
    editionId: 'vol-28-issue-1',
    sectionName: 'Spotlight Feature',
    createdAt: '2026-02-10',
    publishedAt: '2026-03-01',
    likesCount: 47,
    likedBy: ['user-admin-2'],
    abstract: 'An opinion polemic invoking K.C. Bhattacharya’s ‘Swaraj in Ideas’ to argue against corporate journal paywalls and champion unpaywalled institutional repositories.',
    content: `When undergraduate researchers write novel algorithms or unearth archival manuscripts, their work is all too often swallowed by proprietary academic publishing houses that lock knowledge behind $45 PDF paywalls.

Invoking philosopher K.C. Bhattacharya’s seminal 1928 address ‘Swaraj in Ideas’, this essay argues that intellectual decolonization and scientific advancement require sovereign, open-access distribution channels. Pratidhwani demonstrates that rigorous peer review does not require predatory paywalls. By publishing our student scholarship openly with liberal attribution licenses, we ensure that collegiate research serves society directly, without tollgates or paywalls.`,
    comments: [],
    editorialFeedback: {
      reviewerName: 'Prof. Gayatri Sengupta',
      decision: 'approved',
      notes: 'Provocative and essential institutional critique.',
      date: '2026-02-25',
    }
  },

  // Submissions in queue for Admin review:
  {
    id: 'art-sub-1',
    title: 'C.V. Raman Phonon Dynamics in Carbon Nanotube Resonators at Sub-Kelvin Baselines',
    subtitle: 'Bridging Raman inelastic scattering, acoustic phonon modes, and cryogenic instrumentation at 20 millikelvin.',
    authorId: 'user-student-2',
    authorName: 'Arjun Ramanathan',
    authorDepartment: 'Applied Physics & Condensed Matter',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80',
    category: 'Technical Research',
    readTimeMinutes: 8,
    tags: ['software development', 'Nanotechnology', 'Raman Scattering', 'Phononics', 'Experimental Physics'],
    status: 'in_review',
    createdAt: '2026-03-10',
    likesCount: 0,
    likedBy: [],
    abstract: 'A pedagogical guide on measuring ultra-high Q-factors and Raman scattering modes in suspended carbon nanotubes cooled to cryogenic baselines.',
    content: `Carbon nanotubes (CNTs) represent one of the purest mechanical resonators known in materials science. When suspended over etched trenches and cooled to dilution-fridge temperatures, their flexural vibrational modes decouple from environmental thermal baths, yielding quality factors surpassing one million.

This primer describes the step-by-step assembly of an electrostatic actuation circuit and confocal Raman spectrometer capable of sensing sub-attometer displacements without inducing back-action decoherence.`,
    comments: [],
    aiAnalysis: {
      readabilityScore: 54,
      gradeLevel: 'Undergraduate Advanced',
      clarityScore: 88,
      toneAssessment: 'Rigorous and pedagogically structured.',
      grammarIssues: [],
      vocabularyElevations: [],
      editorialCommendation: 'Clear schematic explanation and sound mathematical definitions.',
      revisionTip: 'Add an introductory schematic figure description for non-specialist readers.',
    }
  },
  {
    id: 'art-sub-2',
    title: 'Raag Bhairavi at 3:00 AM: Fragments Written in the Campus Central Library',
    subtitle: 'A nocturne in nine strophes exploring insomnia, cutting chai, and the quiet camaraderie of late-night scholars.',
    authorId: 'user-student-3',
    authorName: 'Devika Nambiar',
    authorDepartment: 'Comparative Literature & Philosophy of Science',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    category: 'Campus Life',
    readTimeMinutes: 3,
    tags: ['campus events', 'Poetry', 'Campus Life', 'Nocturne', 'Raag Bhairavi'],
    status: 'in_review',
    createdAt: '2026-03-14',
    likesCount: 0,
    likedBy: [],
    abstract: 'An evocative poetic meditation composed during finals week over glasses of cutting chai in the reading room.',
    content: `The fluorescent tubes hum a steady B-flat.
Across the scarred maple table,
a student whose name I never asked
turns a blue page of organic synthesis.

We do not speak,
yet between our tilted chai glasses
exists a covenant older than the syllabus:
two lamps burning down the dark
before tomorrow's early morning examination.`,
    comments: [],
    aiAnalysis: {
      readabilityScore: 82,
      gradeLevel: 'General Literary',
      clarityScore: 96,
      toneAssessment: 'Quiet, empathetic, and visually vivid.',
      grammarIssues: [],
      vocabularyElevations: [],
      editorialCommendation: 'Touching intimacy and relatable campus atmosphere.',
      revisionTip: 'Consider extending the fourth strophe to deepen the imagery of the blue examination book.',
    }
  },
  {
    id: 'art-sub-3',
    title: 'Western Ghats Canopy Surveillance: Autonomous Micro-UAV Swarms for Tropical Flora Monitoring',
    subtitle: 'Sensor arrays, distributed Kalman filters, and indigenous rainforest canopy ecology.',
    authorId: 'user-student-4',
    authorName: 'Rohan Deshmukh',
    authorDepartment: 'Environmental Robotics & Sensor Systems',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    category: 'Technical Research',
    readTimeMinutes: 5,
    tags: ['software development', 'Robotics', 'Sensors', 'Ecology', 'Western Ghats'],
    status: 'revision_requested',
    createdAt: '2026-03-01',
    likesCount: 0,
    likedBy: [],
    abstract: 'Deploying micro-UAV swarms to map tropical canopy stress and biodiversity across Western Ghats research stations.',
    content: `Tropical forest canopies in the Western Ghats biodiversity hotspot suffer from acute microclimate shifts. By orchestrating quadcopter formations outfitted with multispectral lidar, we can autonomously chart chlorophyll fluorometry at centimeter resolution without disrupting arboreal fauna.`,
    comments: [],
    editorialFeedback: {
      reviewerName: 'Dr. Anand Vardhan',
      decision: 'revision_requested',
      notes: 'Promising technical core, but please expand on the privacy governance and avian wildlife safety protocols before approval.',
      date: '2026-03-06',
    }
  },
  {
    id: 'art-sub-4',
    title: 'Paninian Generative Grammars and the Syntax of Ancient Starlight',
    subtitle: 'Speculative explorations applying Ashtadhyayi generative algorithms to deep-sky radio telemetry from Sagittarius A*.',
    authorId: 'user-student-1',
    authorName: 'Kavya Krishnan',
    authorDepartment: 'Computer Science & Indic Computational Linguistics',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    category: 'Creative Writing',
    readTimeMinutes: 6,
    tags: ['sci-fi', 'software development', 'Creative Writing', 'Speculative Fiction', 'Paninian Grammar'],
    status: 'in_review',
    createdAt: '2026-03-18',
    likesCount: 0,
    likedBy: [],
    abstract: 'What happens when deep learning classifiers trained on Paninian Sanskrit generative rules are pointed toward astronomical radio pulses from Sagittarius A*?',
    content: `Astronomers in the radio telemetry bunker fed three petabytes of interstellar emissions into a recursive neural classifier designed originally for Paninian generative cadence analysis. 

Within twelve minutes, the weights settled not into Gaussian noise, but into an exact grammatical conjugate of an imperative invitation.`,
    comments: [],
    aiAnalysis: {
      readabilityScore: 78,
      gradeLevel: 'Speculative Scholarly',
      clarityScore: 92,
      toneAssessment: 'Imaginative and scientifically grounded speculative sci-fi.',
      grammarIssues: [],
      vocabularyElevations: [],
      editorialCommendation: 'Compelling fusion of linguistic structures and cosmic exploration.',
      revisionTip: 'Ideal submission for the upcoming Volume XXVIII speculative feature.',
    }
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    recipientUserId: 'user-student-1',
    type: 'comment',
    title: 'Editorial Commendation',
    message: 'Prof. Gayatri Sengupta commented on "Dhvani in the Digital Age": "A breathtaking and rigorously theorized essay, Kavya..."',
    timestamp: '1 hour ago',
    read: false,
    articleId: 'art-1',
  },
  {
    id: 'notif-2',
    recipientUserId: 'user-student-1',
    type: 'like',
    title: 'Article Liked',
    message: 'Your piece "Dhvani in the Digital Age" has crossed 90 likes from campus readers!',
    timestamp: '3 hours ago',
    read: false,
    articleId: 'art-1',
  },
  {
    id: 'notif-3',
    recipientUserId: 'user-student-1',
    type: 'editorial_note',
    title: 'Annual Edition Spotlight Selected',
    message: 'Congratulations! Your manuscript has been selected as the lead feature in Volume XXVIII.',
    timestamp: '3 days ago',
    read: true,
    articleId: 'art-1',
  },
  {
    id: 'notif-4',
    recipientUserId: 'user-student-2',
    type: 'editorial_note',
    title: 'Spotlight Feature Approved',
    message: 'Prof. Gayatri Sengupta approved your manuscript on Bose-Einstein Statistics for Volume 28 Spotlight.',
    timestamp: '2 days ago',
    read: true,
    articleId: 'art-2',
  }
];

export const BANNED_KEYWORDS = [
  'cheating service',
  'essay mill',
  'pay for exam',
  'doxxing',
  'pirated torrent',
  'hate speech',
  'academic dishonesty bot'
];
