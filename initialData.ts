import { User, Story, Episode, Category, Review, AppSettings, UserStoryRelation, ListeningProgress } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-romance', name: 'Romance', description: 'Passionate tales of love, destiny, and heartbreak', display_order: 1 },
  { id: 'cat-fantasy', name: 'Fantasy', description: 'Epic realms, monarchs, magic, and supernatural powers', display_order: 2 },
  { id: 'cat-thriller', name: 'Thriller', description: 'High-stakes suspense, conspiracies, and gripping twists', display_order: 3 },
  { id: 'cat-mystery', name: 'Mystery', description: 'Intricate detective cases, cold mysteries, and noir puzzles', display_order: 4 },
  { id: 'cat-horror', name: 'Horror', description: 'Chilling supernatural encounters, cursed towns, and psychological dread', display_order: 5 },
  { id: 'cat-drama', name: 'Drama', description: 'Intense family secrets, power struggles, and emotional journeys', display_order: 6 },
  { id: 'cat-comedy', name: 'Comedy', description: 'Lighthearted romantic mishaps, witty banter, and satire', display_order: 7 },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin-1',
    name: 'Dhiraj Pant (Admin)',
    email: 'admin@dkfm.com',
    role: 'admin',
    profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    created_at: '2025-01-10T08:00:00Z',
    status: 'active'
  },
  {
    id: 'user-listener-1',
    name: 'Aarav Sharma',
    email: 'aarav@listener.com',
    role: 'listener',
    profile_image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    created_at: '2025-02-14T11:20:00Z',
    status: 'active'
  },
  {
    id: 'user-listener-2',
    name: 'Sophia Chen',
    email: 'sophia@creative.io',
    role: 'listener',
    profile_image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    created_at: '2025-03-01T15:45:00Z',
    status: 'active'
  }
];

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story-1',
    title: "The Billionaire's Secret Heir",
    short_description: "A sudden legacy, a ruthless empire, and an undeniable attraction hidden behind high-rise glass.",
    synopsis: "Julian Vance was known as the merciless architect of Manhattan's elite real estate dynasty. But when an unsigned trust surfaces after twenty years, Eliza Reed finds herself dragged into a gilded web of corporate betrayal, forbidden passion, and a child destined to inherit an empire. As rival magnates close in, every touch becomes dangerous and every whisper an ultimatum.",
    cover_image_url: '/src/assets/images/story_billionaire_secret_1792061350911.jpg',
    author: 'Eliza Reed',
    narrator: 'Julian Vance & Victoria Bell',
    category_id: 'cat-romance',
    language: 'English',
    status: 'published',
    access_type: 'free',
    release_date: '2025-04-12',
    total_views: 184500,
    rating: 4.8,
    review_count: 1420,
    is_featured: true,
    is_trending: true,
    created_at: '2025-04-10T10:00:00Z'
  },
  {
    id: 'story-2',
    title: 'Shadow Realm: Rebirth of the Monarch',
    short_description: 'Betrayed by his kingdom, he returns from the cosmic rift wielding celestial purple blades.',
    synopsis: "For three centuries, Lord Kaelen served the imperial high court until the grand council sealed him inside the Void Maw. But the abyss did not swallow him; it yielded. Now awakened in an era where magic has corrupted the realm, Kaelen awakens the forgotten sovereign army to reclaim his throne and shatter the tyrannical seal.",
    cover_image_url: '/src/assets/images/story_shadow_monarch_1792061351672.jpg',
    author: 'Dante Cross',
    narrator: 'Marcus Thorne',
    category_id: 'cat-fantasy',
    language: 'English',
    status: 'published',
    access_type: 'premium',
    release_date: '2025-05-01',
    total_views: 312000,
    rating: 4.9,
    review_count: 2890,
    is_featured: true,
    is_trending: true,
    created_at: '2025-04-28T12:00:00Z'
  },
  {
    id: 'story-3',
    title: 'Midnight Murders in Prague',
    short_description: 'A relentless investigator stalks a phantom murderer leaving chess pieces in cobblestone alleys.',
    synopsis: "Autumn fog grips the Charles Bridge as inspector Liam Richter receives a blood-stained pawn inscribed with his sister's name. As Richter races across catacombs and clock towers, the killer known as The Grandmaster orchestrates a psychological duel where every solved riddle costs another innocent soul.",
    cover_image_url: '/src/assets/images/story_midnight_detective_1792061351083.jpg',
    author: 'Henrik Vane',
    narrator: 'Liam Campbell',
    category_id: 'cat-mystery',
    language: 'English',
    status: 'published',
    access_type: 'free',
    release_date: '2025-03-18',
    total_views: 94000,
    rating: 4.7,
    review_count: 850,
    is_featured: true,
    is_trending: false,
    created_at: '2025-03-15T09:30:00Z'
  },
  {
    id: 'story-4',
    title: 'Whispers in Blackwood Hollow',
    short_description: 'An abandoned manor in the mist hums with the voices of travelers who never returned.',
    synopsis: "When architectural restorer Clara Finch arrives at Blackwood Manor, the locals warn her never to keep a lantern lit past midnight. Deep within the timber foundations lies a music box carved from iron that plays on its own, awakening dormant apparitions that demand a living sacrifice to break their timeless curse.",
    cover_image_url: '/src/assets/images/story_whispers_in_hollow_1792061351596.jpg',
    author: 'Cassandra Graves',
    narrator: 'Eleanor Sterling',
    category_id: 'cat-horror',
    language: 'English',
    status: 'published',
    access_type: 'free',
    release_date: '2025-02-28',
    total_views: 128400,
    rating: 4.6,
    review_count: 1110,
    is_featured: false,
    is_trending: true,
    created_at: '2025-02-25T14:15:00Z'
  },
  {
    id: 'story-5',
    title: "The King's Secret",
    short_description: 'A clandestine encounter in the tavern leads to a crown in jeopardy and a forgotten covenant.',
    synopsis: "In the kingdom of Eldoria, old prophecies warn of a heir whose blood can bend iron. When a humble blacksmith shields a cloaked stranger from royal pursuers, he unravels a royal secret that threatens to plunge three sovereign nations into rebellion.",
    cover_image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    author: 'R. K. Sterling',
    narrator: 'David O’Connor',
    category_id: 'cat-thriller',
    language: 'English',
    status: 'published',
    access_type: 'free',
    release_date: '2025-01-20',
    total_views: 89000,
    rating: 4.5,
    review_count: 670,
    is_featured: false,
    is_trending: false,
    created_at: '2025-01-15T18:00:00Z'
  }
];

export const INITIAL_EPISODES: Episode[] = [
  // The Billionaire's Secret Heir (story-1)
  {
    id: 'ep-1-1',
    story_id: 'story-1',
    episode_number: 1,
    title: 'The Uninvited Guest',
    description: 'Eliza arrives at the Vance gala unannounced, carrying documents that could ruin the family merger.',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 372,
    status: 'published',
    access_type: 'free',
    release_date: '2025-04-12T10:00:00Z',
    play_count: 45200,
    narration_text: "The rainfall against the panoramic glass of the penthouse sounded like shattering crystals. Eliza tightened her grip on the leather folder. Across the marble terrace, Julian Vance stood with his back turned, swirling amber whiskey in a cut crystal glass. 'You took a daring risk stepping into my private residence tonight, Miss Reed,' his deep voice cut through the stillness."
  },
  {
    id: 'ep-1-2',
    story_id: 'story-1',
    episode_number: 2,
    title: 'Contract of Silence',
    description: 'Faced with undeniable evidence, Julian proposes a dangerous condition: one month under his surveillance.',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 410,
    status: 'published',
    access_type: 'free',
    release_date: '2025-04-13T10:00:00Z',
    play_count: 38100,
    narration_text: "Julian laid the fountain pen on the mahogany table. 'Sign here, Eliza. You stay at the estate. You tell no one who fathered the boy, and in return, I ensure his security against the cartel.' She met his steel-grey gaze, heart pounding against her ribs."
  },
  {
    id: 'ep-1-3',
    story_id: 'story-1',
    episode_number: 3,
    title: 'Midnight Revelations',
    description: 'An intruder breaks into the estate vault, forcing Eliza and Julian into an uneasy alliance.',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 385,
    status: 'published',
    access_type: 'free',
    release_date: '2025-04-14T10:00:00Z',
    play_count: 31200,
    narration_text: "The security alarms shrieked at 2:15 AM. Julian pulled Eliza behind the reinforced bookshelf as silenced gunshots tore into the hallway. 'Stay close,' he whispered, his warm breath grazing her temple. 'Whoever sent them already knows the boy's lineage.'"
  },
  {
    id: 'ep-1-4',
    story_id: 'story-1',
    episode_number: 4,
    title: 'The Empire Shakes',
    description: 'The board of directors convenes an emergency vote as the secret heir identity is leaked to the press.',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: 440,
    status: 'published',
    access_type: 'premium',
    release_date: '2025-04-15T10:00:00Z',
    play_count: 24500,
    narration_text: "Flashbulbs blinded them as the elevator opened on the 64th floor. Journalists shouted over each other. Julian stepped in front of Eliza, placing a protective hand around her waist, and addressed the microphones with icy calm: 'The rumors are true. And I will burn this firm down before anyone touches my family.'"
  },

  // Shadow Realm: Rebirth of the Monarch (story-2)
  {
    id: 'ep-2-1',
    story_id: 'story-2',
    episode_number: 1,
    title: 'Awakening in the Void',
    description: 'Lord Kaelen breaks through the seal of three centuries, greeted by the ash of his former stronghold.',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    duration: 480,
    status: 'published',
    access_type: 'free',
    release_date: '2025-05-01T12:00:00Z',
    play_count: 78900,
    narration_text: "Dark celestial lightning tore through the crimson sky. Kaelen opened his eyes. The obsidian chains that held his soul for 300 years shattered into stardust. He reached into the ether, and the two twin purple blades ignited in his palms. 'I return,' his voice reverberated across the mountain peaks."
  },
  {
    id: 'ep-2-2',
    story_id: 'story-2',
    episode_number: 2,
    title: 'The Crimson Citadel',
    description: 'The usurpers hear the drums of the fallen monarch as beasts in the valley begin to kneel.',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    duration: 512,
    status: 'published',
    access_type: 'free',
    release_date: '2025-05-02T12:00:00Z',
    play_count: 65400,
    narration_text: "High atop the fortress ramparts, the usurper General saw the purple aura descending through the clouds. 'Raise the void barriers!' he screamed. But it was too late; the shadows answered only to one master."
  },
  {
    id: 'ep-2-3',
    story_id: 'story-2',
    episode_number: 3,
    title: 'Clash of the Five Houses',
    description: 'The ancient noble houses assemble their elite champions to halt the dark monarch’s ascent.',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    duration: 495,
    status: 'published',
    access_type: 'premium',
    release_date: '2025-05-03T12:00:00Z',
    play_count: 52100,
    narration_text: "Five grand warlords surrounded the ruined throne. Each commanded legions. Kaelen merely smiled, pointing his celestial blade at the lead grandmaster. 'You were children when I conquered this continent. Let us see if your courage matches your arrogance.'"
  },

  // Midnight Murders in Prague (story-3)
  {
    id: 'ep-3-1',
    story_id: 'story-3',
    episode_number: 1,
    title: 'The Black Pawn',
    description: 'Inspector Richter finds a carved ebony chess piece placed in the hands of an archivist.',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    duration: 360,
    status: 'published',
    access_type: 'free',
    release_date: '2025-03-18T09:30:00Z',
    play_count: 28000,
    narration_text: "The Old Town Clock chimed twelve. Snow fell softly on the cobblestones. Liam knelt beside the victim. In the dead man's clenched fist sat a polished black pawn with a note written in dried ink: 'The game has begun, Liam.'"
  },
  {
    id: 'ep-3-2',
    story_id: 'story-3',
    episode_number: 2,
    title: 'The Clock Tower Clue',
    description: 'Deciphering the astronomical clock dials reveals the address of the next planned strike.',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    duration: 390,
    status: 'published',
    access_type: 'free',
    release_date: '2025-03-19T09:30:00Z',
    play_count: 22400,
    narration_text: "The mechanical gears grooved with deafening grinding. Richter shone his flashlight into the gear casing. There, carved into the brass balance wheel, was a Roman numeral followed by a location that made his stomach drop."
  },

  // Whispers in Blackwood Hollow (story-4)
  {
    id: 'ep-4-1',
    story_id: 'story-4',
    episode_number: 1,
    title: 'The Gatekeeper’s Warning',
    description: 'The carriage driver leaves Clara at the gate, refusing to enter the forest after sundown.',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    duration: 340,
    status: 'published',
    access_type: 'free',
    release_date: '2025-02-28T14:15:00Z',
    play_count: 36000,
    narration_text: "'You have until dusk to change your mind, lady,' the driver muttered, his horses bucking nervously at the perimeter line. Clara stepped past the iron gates, and the heavy mist immediately swallowed the road behind her."
  },

  // The King's Secret (story-5)
  {
    id: 'ep-5-1',
    story_id: 'story-5',
    episode_number: 1,
    title: 'The Mysterious Stranger',
    description: 'A rain-soaked traveler seeks shelter in the blacksmith forge, bleeding from a silver dagger wound.',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 330,
    status: 'published',
    access_type: 'free',
    release_date: '2025-01-20T18:00:00Z',
    play_count: 29500,
    narration_text: "The forge fire hissed as cold rain swept through the wooden shutters. In stumbled a stranger wrapped in royal silk, clutching an ornate gold medallion bearing the crowned lion of Eldoria."
  },
  {
    id: 'ep-5-2',
    story_id: 'story-5',
    episode_number: 2,
    title: 'A Secret Revealed',
    description: 'The medallion opens to reveal an ancient scroll naming the illegitimate heir to the throne.',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 350,
    status: 'published',
    access_type: 'free',
    release_date: '2025-01-21T18:00:00Z',
    play_count: 24200,
    narration_text: "The parchment crinkled beneath calloused fingers. The king had died without a queen, but the document before them proved the blacksmith himself was the blood of the first monarchs."
  },
  {
    id: 'ep-5-3',
    story_id: 'story-5',
    episode_number: 3,
    title: 'The Hidden Kingdom',
    description: 'Fleeing the regent’s assassins, they seek shelter in the forgotten underground stronghold.',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 380,
    status: 'published',
    access_type: 'free',
    release_date: '2025-01-22T18:00:00Z',
    play_count: 21000,
    narration_text: "Carved into the living rock of Mount Korath, the forgotten city of Valador stretched out before them in a sea of glowing phosphor crystals."
  },
  {
    id: 'ep-5-4',
    story_id: 'story-5',
    episode_number: 4,
    title: 'The Final Promise',
    description: 'With the army gathered at dawn, the rightful heir must choose between conquest or sacrifice.',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: 420,
    status: 'published',
    access_type: 'premium',
    release_date: '2025-01-23T18:00:00Z',
    play_count: 18900,
    narration_text: "War horns sounded across the valley as dawn broke red over the battlements. 'I do not fight for the crown,' he proclaimed, drawing his blade into the golden light. 'I fight so that no child in this realm shall ever live in fear again.'"
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    user_id: 'user-listener-1',
    user_name: 'Aarav Sharma',
    user_avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    story_id: 'story-1',
    rating: 5,
    comment: 'The voice acting between Julian and Eliza is pure fire! Couldn’t stop listening after episode 2. Pocket FM style at its absolute best.',
    created_at: '2025-04-16T19:30:00Z'
  },
  {
    id: 'rev-2',
    user_id: 'user-listener-2',
    user_name: 'Sophia Chen',
    user_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    story_id: 'story-2',
    rating: 5,
    comment: 'Epic dark fantasy audio experience! The sound design and narrator Marcus Thorne make every sword swing feel visceral.',
    created_at: '2025-05-05T21:10:00Z'
  },
  {
    id: 'rev-3',
    user_id: 'user-listener-1',
    user_name: 'Aarav Sharma',
    user_avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    story_id: 'story-3',
    rating: 4,
    comment: 'Great noir detective atmosphere. The rainy cobblestone Prague ambience while walking to work had me on the edge of my seat.',
    created_at: '2025-03-22T08:45:00Z'
  }
];

export const INITIAL_PROGRESS: ListeningProgress[] = [
  {
    id: 'prog-1',
    user_id: 'user-admin-1',
    story_id: 'story-1',
    episode_id: 'ep-1-1',
    current_position: 185,
    duration: 372,
    completed: false,
    updated_at: '2025-05-10T14:20:00Z'
  },
  {
    id: 'prog-2',
    user_id: 'user-admin-1',
    story_id: 'story-2',
    episode_id: 'ep-2-1',
    current_position: 240,
    duration: 480,
    completed: false,
    updated_at: '2025-05-12T16:00:00Z'
  }
];

export const INITIAL_RELATIONS: UserStoryRelation[] = [
  {
    id: 'rel-1',
    user_id: 'user-admin-1',
    story_id: 'story-1',
    is_favorite: true,
    is_followed: true,
    created_at: '2025-04-12T11:00:00Z'
  },
  {
    id: 'rel-2',
    user_id: 'user-admin-1',
    story_id: 'story-2',
    is_favorite: true,
    is_followed: false,
    created_at: '2025-05-02T09:00:00Z'
  }
];

export const INITIAL_SETTINGS: AppSettings = {
  app_name: 'DK Fm',
  tagline: 'Pocket Audio Stories & Dramas',
  logo_url: '',
  supported_languages: ['English', 'Hindi', 'Spanish', 'French', 'German'],
  audio_upload_limit_mb: 50,
  maintenance_mode: false,
  terms_of_service: 'Welcome to DK Fm. By using our audio streaming service, you agree to respect copyrighted audio stories, maintain account security, and adhere to community standards.',
  privacy_policy: 'DK Fm respects user privacy. We save your listening progress locally and securely so you can resume where you left off across all devices.',
  featured_story_ids: ['story-1', 'story-2', 'story-3']
};
