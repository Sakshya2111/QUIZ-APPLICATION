/**
 * QuizPulse - Curated Default Question Bank
 * Spans 6 rich categories with varying difficulties (Easy, Medium, Hard)
 * Types: 'single' (MCQ), 'multiple' (multi-select), 'boolean' (True/False), 'text' (Fill in the blank)
 */

export const CATEGORIES = [
  {
    id: 'web-dev',
    name: 'Web Dev & CS',
    icon: '💻',
    description: 'HTML5, CSS3, JavaScript, Algorithms & Architecture',
    color: '#3b82f6'
  },
  {
    id: 'science',
    name: 'Science & Cosmos',
    icon: '🔬',
    description: 'Physics, Astronomy, Chemistry, Biology & Quantum Realm',
    color: '#10b981'
  },
  {
    id: 'general-knowledge',
    name: 'General Knowledge',
    icon: '🌍',
    description: 'World Trivia, Culture, Global Landmarks & Curiosities',
    color: '#8b5cf6'
  },
  {
    id: 'history-geo',
    name: 'History & Geography',
    icon: '🏛️',
    description: 'Ancient Empires, Modern Epochs, Continents & Capitals',
    color: '#f59e0b'
  },
  {
    id: 'math-logic',
    name: 'Math & Logic',
    icon: '📐',
    description: 'Mathematical Puzzles, Probability, Sequences & Brain Teasers',
    color: '#ec4899'
  },
  {
    id: 'pop-culture',
    name: 'Cinema & Pop Culture',
    icon: '🎬',
    description: 'Iconic Movies, Music History, Gaming Legends & Literature',
    color: '#06b6d4'
  }
];

export const DEFAULT_QUESTIONS = [
  // ==========================================
  // WEB DEV & COMPUTER SCIENCE
  // ==========================================
  {
    id: 'wd-01',
    category: 'web-dev',
    difficulty: 'easy',
    type: 'single',
    question: 'In JavaScript, which keyword is used to declare a variable that cannot be reassigned?',
    options: ['var', 'let', 'const', 'static'],
    answer: 2,
    hint: 'It stands for "constant".',
    explanation: 'The "const" declaration creates block-scoped variables that cannot be reassigned through reassignment or redeclared.'
  },
  {
    id: 'wd-02',
    category: 'web-dev',
    difficulty: 'medium',
    type: 'single',
    question: 'What does the CSS property "box-sizing: border-box" do?',
    options: [
      'Adds a decorative 3D border around the element',
      'Includes padding and border in the element’s total width and height',
      'Forces the element to be rendered as a flex container',
      'Removes all margins from child boxes'
    ],
    answer: 1,
    hint: 'Think about how dimensions are calculated when padding is added.',
    explanation: '"border-box" ensures that width and height properties include content, padding, and borders, preventing layout blowouts.'
  },
  {
    id: 'wd-03',
    category: 'web-dev',
    difficulty: 'medium',
    type: 'multiple',
    question: 'Which of the following are valid primitive data types in modern JavaScript? (Select all that apply)',
    options: ['Symbol', 'BigInt', 'ArrayList', 'Undefined', 'Tuple'],
    answer: [0, 1, 3],
    hint: 'JavaScript primitives include 7 types: string, number, bigint, boolean, undefined, symbol, and null.',
    explanation: 'Symbol, BigInt, and Undefined are native JS primitive types. ArrayList and Tuple are not built-in JavaScript primitive types.'
  },
  {
    id: 'wd-04',
    category: 'web-dev',
    difficulty: 'hard',
    type: 'single',
    question: 'In the JavaScript Event Loop, what is the execution priority order for microtasks vs macrotasks?',
    options: [
      'Macrotasks execute first, microtasks are deferred to next tick',
      'Microtasks queue executes completely before the next macrotask runs',
      'Both run concurrently on separate threads',
      'Macrotasks always interrupt running microtasks'
    ],
    answer: 1,
    hint: 'Promises & queueMicrotask resolve before setTimeout/setInterval handlers.',
    explanation: 'The event loop processes all available microtasks (e.g., Promise callbacks, MutationObserver) until the microtask queue is empty before executing the next macrotask (e.g., setTimeout, I/O).'
  },
  {
    id: 'wd-05',
    category: 'web-dev',
    difficulty: 'easy',
    type: 'boolean',
    question: 'HTTP is a stateless protocol by design.',
    options: ['True', 'False'],
    answer: 0,
    hint: 'Does the server retain session context across separate requests automatically?',
    explanation: 'True. HTTP is stateless; each request from client to server is executed independently without the server keeping record of previous requests without cookies/sessions.'
  },
  {
    id: 'wd-06',
    category: 'web-dev',
    difficulty: 'medium',
    type: 'text',
    question: 'What is the acronym for the browser security mechanism that restricts resources requested from another domain?',
    acceptableAnswers: ['cors', 'cross-origin resource sharing', 'cross origin resource sharing'],
    hint: 'C _ _ S',
    explanation: 'CORS (Cross-Origin Resource Sharing) is a HTTP-header based security mechanism that allows a server to indicate any origins other than its own from which a browser should permit loading resources.'
  },
  {
    id: 'wd-07',
    category: 'web-dev',
    difficulty: 'hard',
    type: 'single',
    question: 'What is the average time complexity of searching for a value in a balanced Binary Search Tree (AVL / Red-Black)?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
    answer: 2,
    hint: 'Each step cuts the search space in half.',
    explanation: 'Because balanced BSTs maintain height proportional to log₂(n), search, insert, and delete operations have a time complexity of O(log n).'
  },
  {
    id: 'wd-08',
    category: 'web-dev',
    difficulty: 'easy',
    type: 'single',
    question: 'Which HTML5 element is used to specify a footer for a document or section?',
    options: ['<bottom>', '<section-end>', '<footer>', '<aside>'],
    answer: 2,
    hint: 'Standard semantic HTML5 tag.',
    explanation: 'The <footer> tag defines a footer for a document or section, typically containing authorship, copyright information, or related links.'
  },
  {
    id: 'wd-09',
    category: 'web-dev',
    difficulty: 'medium',
    type: 'single',
    question: 'Which Git command creates a new branch and switches to it in a single step (Git 2.23+)?',
    options: ['git branch -n <name>', 'git switch -c <name>', 'git goto -b <name>', 'git merge --new <name>'],
    answer: 1,
    hint: 'The modern alternative to git checkout -b.',
    explanation: '"git switch -c <name>" creates and switches to a new branch. (Equivalently "git checkout -b <name>" in older syntax).'
  },
  {
    id: 'wd-10',
    category: 'web-dev',
    difficulty: 'hard',
    type: 'multiple',
    question: 'Which of the following are valid CSS Grid properties? (Select all that apply)',
    options: ['grid-template-columns', 'grid-gap', 'flex-basis', 'grid-auto-flow', 'align-content'],
    answer: [0, 1, 3, 4],
    hint: 'flex-basis is specific to Flexbox layout.',
    explanation: 'grid-template-columns, grid-gap, grid-auto-flow, and align-content are all utilized in CSS Grid. flex-basis is a flex item property.'
  },

  // ==========================================
  // SCIENCE & COSMOS
  // ==========================================
  {
    id: 'sci-01',
    category: 'science',
    difficulty: 'easy',
    type: 'single',
    question: 'What is the most abundant gas in Earth’s atmosphere?',
    options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Argon'],
    answer: 1,
    hint: 'It accounts for approximately 78% of dry air.',
    explanation: 'Nitrogen makes up roughly 78.08% of Earth’s atmosphere, followed by Oxygen at around 20.95%.'
  },
  {
    id: 'sci-02',
    category: 'science',
    difficulty: 'medium',
    type: 'single',
    question: 'What is the speed of light in vacuum to the nearest thousand km/s?',
    options: ['150,000 km/s', '300,000 km/s', '450,000 km/s', '1,080,000 km/s'],
    answer: 1,
    hint: 'Approximately 299,792 km/s (or 3 × 10⁸ m/s).',
    explanation: 'The exact speed of light in vacuum is defined as 299,792,458 meters per second (~300,000 km/s).'
  },
  {
    id: 'sci-03',
    category: 'science',
    difficulty: 'easy',
    type: 'boolean',
    question: 'Light years are a measurement of time, not distance.',
    options: ['True', 'False'],
    answer: 1,
    hint: 'A light-year is how far a photon travels in one Julian year.',
    explanation: 'False. A light-year is a unit of astronomical distance equal to about 9.46 trillion kilometers (5.88 trillion miles).'
  },
  {
    id: 'sci-04',
    category: 'science',
    difficulty: 'hard',
    type: 'single',
    question: 'Which fundamental force of nature is carried by the particle known as a "gluon"?',
    options: ['Gravitational force', 'Electromagnetic force', 'Strong nuclear force', 'Weak nuclear force'],
    answer: 2,
    hint: 'It "glues" quarks together inside protons and neutrons.',
    explanation: 'Gluons act as exchange particles for the strong nuclear force between quarks, described by quantum chromodynamics (QCD).'
  },
  {
    id: 'sci-05',
    category: 'science',
    difficulty: 'medium',
    type: 'multiple',
    question: 'Which of the following elements are Noble Gases? (Select all that apply)',
    options: ['Neon', 'Chlorine', 'Argon', 'Krypton', 'Fluorine'],
    answer: [0, 2, 3],
    hint: 'Group 18 elements in the periodic table.',
    explanation: 'Helium, Neon, Argon, Krypton, Xenon, and Radon are noble gases. Chlorine and Fluorine are halogens (Group 17).'
  },
  {
    id: 'sci-06',
    category: 'science',
    difficulty: 'easy',
    type: 'text',
    question: 'What is the chemical symbol for Gold on the periodic table?',
    acceptableAnswers: ['au'],
    hint: 'Comes from the Latin word "Aurum".',
    explanation: 'Au (from Latin Aurum, meaning "shining dawn") is the chemical symbol for gold.'
  },
  {
    id: 'sci-07',
    category: 'science',
    difficulty: 'medium',
    type: 'single',
    question: 'What cellular organelle is colloquially known as the "powerhouse of the cell"?',
    options: ['Ribosome', 'Mitochondria', 'Golgi apparatus', 'Endoplasmic reticulum'],
    answer: 1,
    hint: 'Generates most of the chemical energy (ATP) needed by the cell.',
    explanation: 'Mitochondria generate adenosine triphosphate (ATP), the primary energy currency of biological cells.'
  },
  {
    id: 'sci-08',
    category: 'science',
    difficulty: 'hard',
    type: 'single',
    question: 'What phenomenon causes the boundary beyond which nothing, not even light, can escape a black hole?',
    options: ['Accretion Disk', 'Singularity', 'Event Horizon', 'Ergosphere'],
    answer: 2,
    hint: 'The point of no return.',
    explanation: 'The Event Horizon is the theoretical boundary around a black hole beyond which the escape velocity exceeds the speed of light.'
  },
  {
    id: 'sci-09',
    category: 'science',
    difficulty: 'medium',
    type: 'boolean',
    question: 'Sound waves can propagate through a vacuum space.',
    options: ['True', 'False'],
    answer: 1,
    hint: 'Sound requires a physical medium to travel.',
    explanation: 'False. Sound is a mechanical wave requiring a material medium (solid, liquid, or gas) to propagate. In a vacuum, there are no particles to vibrate.'
  },
  {
    id: 'sci-10',
    category: 'science',
    difficulty: 'hard',
    type: 'single',
    question: 'According to Heisenberg’s Uncertainty Principle, which pair of physical quantities cannot be simultaneously measured with arbitrary precision?',
    options: ['Mass and Charge', 'Position and Momentum', 'Energy and Temperature', 'Velocity and Acceleration'],
    answer: 1,
    hint: 'Δx · Δp ≥ ℏ / 2',
    explanation: 'The uncertainty principle states that the more precisely the position (x) of a particle is determined, the less precisely its momentum (p) can be known, and vice versa.'
  },

  // ==========================================
  // GENERAL KNOWLEDGE
  // ==========================================
  {
    id: 'gk-01',
    category: 'general-knowledge',
    difficulty: 'easy',
    type: 'single',
    question: 'How many time zones are there in total across the globe (standard 1-hour offsets)?',
    options: ['12', '24', '36', '48'],
    answer: 1,
    hint: 'Equal to the number of hours in one full day.',
    explanation: 'Standard time divides the world into 24 time zones of roughly 15 degrees longitude each, corresponding to the 24 hours in a day.'
  },
  {
    id: 'gk-02',
    category: 'general-knowledge',
    difficulty: 'medium',
    type: 'single',
    question: 'Which country has the most natural lakes in the world?',
    options: ['United States', 'Russia', 'Canada', 'Finland'],
    answer: 2,
    hint: 'Over 60% of all the world’s natural lakes are located in this country.',
    explanation: 'Canada contains approximately 879,800 natural lakes—more than all other countries combined.'
  },
  {
    id: 'gk-03',
    category: 'general-knowledge',
    difficulty: 'easy',
    type: 'boolean',
    question: 'The Great Wall of China is visible from low Earth orbit with the unaided human eye.',
    options: ['True', 'False'],
    answer: 1,
    hint: 'Confirmed false by NASA astronauts.',
    explanation: 'False. Astronauts and satellite imagery confirm that the Great Wall cannot be seen with the naked eye from orbit without telescopic aid, as it blends with natural terrain materials and is too narrow.'
  },
  {
    id: 'gk-04',
    category: 'general-knowledge',
    difficulty: 'medium',
    type: 'multiple',
    question: 'Which of the following are official languages of the United Nations? (Select all that apply)',
    options: ['Arabic', 'German', 'Spanish', 'Russian', 'Japanese'],
    answer: [0, 2, 3],
    hint: 'There are 6 UN official languages: Arabic, Chinese, English, French, Russian, and Spanish.',
    explanation: 'The 6 official languages of the UN are Arabic, Chinese, English, French, Russian, and Spanish.'
  },
  {
    id: 'gk-05',
    category: 'general-knowledge',
    difficulty: 'hard',
    type: 'single',
    question: 'What is the rarest naturally occurring blood type in the human ABO/Rh system?',
    options: ['O Negative', 'B Negative', 'AB Negative', 'A Negative'],
    answer: 2,
    hint: 'Found in less than 1% of the global human population.',
    explanation: 'AB Negative is the rarest blood type in the world, present in approximately 0.6% to 1% of the global population.'
  },
  {
    id: 'gk-06',
    category: 'general-knowledge',
    difficulty: 'easy',
    type: 'text',
    question: 'What is the capital city of Japan?',
    acceptableAnswers: ['tokyo'],
    hint: 'Home to the famous Shibuya crossing.',
    explanation: 'Tokyo is the vibrant capital city and most populous metropolitan area of Japan.'
  },
  {
    id: 'gk-07',
    category: 'general-knowledge',
    difficulty: 'medium',
    type: 'single',
    question: 'Which currency is the oldest still in continuous use today?',
    options: ['British Pound Sterling', 'US Dollar', 'Japanese Yen', 'Swiss Franc'],
    answer: 0,
    hint: 'Dating back over 1,200 years to Anglo-Saxon times.',
    explanation: 'The British Pound Sterling (GBP) originated around 775 AD during Anglo-Saxon King Offa’s reign and is the world’s oldest currency still in active use.'
  },
  {
    id: 'gk-08',
    category: 'general-knowledge',
    difficulty: 'hard',
    type: 'single',
    question: 'Which deep-sea trench holds the deepest known point on Earth, the Challenger Deep?',
    options: ['Java Trench', 'Puerto Rico Trench', 'Mariana Trench', 'Tonga Trench'],
    answer: 2,
    hint: 'Located in the western Pacific Ocean, reaching ~10,994 meters deep.',
    explanation: 'The Mariana Trench contains the Challenger Deep, reaching an astonishing depth of approximately 10,994 meters (36,070 ft).'
  },

  // ==========================================
  // HISTORY & GEOGRAPHY
  // ==========================================
  {
    id: 'hg-01',
    category: 'history-geo',
    difficulty: 'easy',
    type: 'single',
    question: 'In which year did the Apollo 11 mission successfully land the first humans on the Moon?',
    options: ['1965', '1969', '1972', '1975'],
    answer: 1,
    hint: '"One small step for man, one giant leap for mankind."',
    explanation: 'On July 20, 1969, Neil Armstrong and Buzz Aldrin landed the Apollo Lunar Module Eagle on the lunar surface.'
  },
  {
    id: 'hg-02',
    category: 'history-geo',
    difficulty: 'medium',
    type: 'single',
    question: 'What ancient civilization constructed the magnificent citadel of Machu Picchu in Peru?',
    options: ['Aztec Empire', 'Maya Civilization', 'Inca Empire', 'Olmec Culture'],
    answer: 2,
    hint: 'Built in the 15th century under Emperor Pachacuti.',
    explanation: 'Machu Picchu was built by the Inca Empire in the 15th century high in the Andes mountains of Peru.'
  },
  {
    id: 'hg-03',
    category: 'history-geo',
    difficulty: 'medium',
    type: 'multiple',
    question: 'Which of the following modern countries are traversed by the Equator? (Select all that apply)',
    options: ['Ecuador', 'Indonesia', 'Egypt', 'Kenya', 'Australia'],
    answer: [0, 1, 3],
    hint: 'Ecuador is named after the Equator; Indonesia and Kenya lie right on the line.',
    explanation: 'Ecuador, Indonesia, and Kenya lie directly on the Equator. Egypt is in Northern Africa, and Australia is in the Southern Hemisphere.'
  },
  {
    id: 'hg-04',
    category: 'history-geo',
    difficulty: 'hard',
    type: 'single',
    question: 'Who was the longest-reigning monarch in documented European history?',
    options: ['Queen Elizabeth II', 'Louis XIV of France', 'Franz Joseph I', 'Queen Victoria'],
    answer: 1,
    hint: 'The "Sun King" ruled for 72 years and 110 days.',
    explanation: 'King Louis XIV of France ruled for 72 years, 110 days (from 1643 to 1715), the longest verified reign of any sovereign monarch in history.'
  },
  {
    id: 'hg-05',
    category: 'history-geo',
    difficulty: 'easy',
    type: 'boolean',
    question: 'The city of Istanbul was historically known as Constantinople and Byzantium.',
    options: ['True', 'False'],
    answer: 0,
    hint: 'It bridges Europe and Asia across the Bosphorus Strait.',
    explanation: 'True. Founded as Byzantium in ancient Greece, it was renamed Constantinople in 330 AD by Roman Emperor Constantine, and officially became Istanbul in 1930.'
  },
  {
    id: 'hg-06',
    category: 'history-geo',
    difficulty: 'medium',
    type: 'text',
    question: 'What is the longest river in the world by general consensus?',
    acceptableAnswers: ['nile', 'nile river', 'the nile'],
    hint: 'Flows north through northeastern Africa into the Mediterranean Sea.',
    explanation: 'The Nile River is traditionally considered the longest river in the world, spanning approximately 6,650 kilometers (4,132 miles).'
  },
  {
    id: 'hg-07',
    category: 'history-geo',
    difficulty: 'hard',
    type: 'single',
    question: 'The Magna Carta, a landmark document establishing limits on royal authority, was signed in what year?',
    options: ['1066', '1215', '1492', '1689'],
    answer: 1,
    hint: 'Signed at Runnymede by King John of England.',
    explanation: 'The Magna Carta was agreed to by King John of England at Runnymede near Windsor on June 15, 1215.'
  },

  // ==========================================
  // MATHEMATICS & LOGIC
  // ==========================================
  {
    id: 'ml-01',
    category: 'math-logic',
    difficulty: 'easy',
    type: 'single',
    question: 'What is the only even prime number?',
    options: ['0', '2', '4', '6'],
    answer: 1,
    hint: 'Any larger even number is divisible by this number.',
    explanation: '2 is the smallest and only even prime number because every other even integer is divisible by 2 and thus composite.'
  },
  {
    id: 'ml-02',
    category: 'math-logic',
    difficulty: 'medium',
    type: 'single',
    question: 'What is the value of 5! (5 factorial)?',
    options: ['60', '100', '120', '720'],
    answer: 2,
    hint: '5 × 4 × 3 × 2 × 1 = ?',
    explanation: '5! = 5 × 4 × 3 × 2 × 1 = 120.'
  },
  {
    id: 'ml-03',
    category: 'math-logic',
    difficulty: 'medium',
    type: 'single',
    question: 'If a fair 6-sided die is rolled twice, what is the probability of rolling a sum of 7?',
    options: ['1/12', '1/6', '5/36', '1/4'],
    answer: 1,
    hint: 'Combinations yielding 7: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1). Total outcomes = 36.',
    explanation: 'There are 6 favorable outcomes out of 36 total permutations: 6/36 = 1/6 (~16.67%).'
  },
  {
    id: 'ml-04',
    category: 'math-logic',
    difficulty: 'hard',
    type: 'single',
    question: 'What is Euler’s Formula in complex analysis relating exponential functions to trigonometry?',
    options: [
      'e^(ix) = cos(x) + i·sin(x)',
      'e^(ix) = sin(x) + i·cos(x)',
      'e^(x) = ln(x) + iπ',
      'e^(ix) = cos(x) - sin(x)'
    ],
    answer: 0,
    hint: 'When x = π, it yields e^(iπ) + 1 = 0.',
    explanation: 'Euler’s formula states that for any real number x: e^(ix) = cos(x) + i·sin(x).'
  },
  {
    id: 'ml-05',
    category: 'math-logic',
    difficulty: 'easy',
    type: 'text',
    question: 'What is the next number in the Fibonacci sequence: 1, 1, 2, 3, 5, 8, 13, ?',
    acceptableAnswers: ['21'],
    hint: 'Add the last two numbers together (8 + 13).',
    explanation: 'Each number in the Fibonacci sequence is the sum of the two preceding numbers. 8 + 13 = 21.'
  },
  {
    id: 'ml-06',
    category: 'math-logic',
    difficulty: 'hard',
    type: 'multiple',
    question: 'Which of the following numbers are irrational? (Select all that apply)',
    options: ['π (Pi)', '√2 (Square root of 2)', '22/7', 'e (Euler\'s constant)', '0.75'],
    answer: [0, 1, 3],
    hint: 'Irrational numbers cannot be expressed as a ratio of two integers a/b.',
    explanation: 'π, √2, and e are irrational numbers with non-repeating infinite decimal expansions. 22/7 and 0.75 (3/4) are rational fractions.'
  },
  {
    id: 'ml-07',
    category: 'math-logic',
    difficulty: 'medium',
    type: 'boolean',
    question: 'A triangle can have two interior angles that are both obtuse (> 90°).',
    options: ['True', 'False'],
    answer: 1,
    hint: 'The sum of all three interior angles in Euclidean geometry is exactly 180°.',
    explanation: 'False. The interior angles of a triangle in Euclidean geometry sum to 180°. Two angles greater than 90° would sum to over 180° by themselves.'
  },

  // ==========================================
  // CINEMA & POP CULTURE
  // ==========================================
  {
    id: 'pc-01',
    category: 'pop-culture',
    difficulty: 'easy',
    type: 'single',
    question: 'Which film directed by Christopher Nolan features dream infiltration and a spinning totem top?',
    options: ['Interstellar', 'The Prestige', 'Inception', 'Tenet'],
    answer: 2,
    hint: 'Stars Leonardo DiCaprio as Dom Cobb.',
    explanation: 'Released in 2010, "Inception" explores dreams within dreams, using a spinning top as a reality check totem.'
  },
  {
    id: 'pc-02',
    category: 'pop-culture',
    difficulty: 'medium',
    type: 'single',
    question: 'What is the best-selling video game of all time with over 300 million copies sold?',
    options: ['Grand Theft Auto V', 'Minecraft', 'Tetris (EA)', 'Wii Sports'],
    answer: 1,
    hint: 'A voxel sandbox game created by Markus "Notch" Persson.',
    explanation: 'Minecraft, developed by Mojang Studios, has sold more than 300 million copies worldwide across all platforms.'
  },
  {
    id: 'pc-03',
    category: 'pop-culture',
    difficulty: 'hard',
    type: 'multiple',
    question: 'Which of the following films won the Academy Award for Best Picture? (Select all that apply)',
    options: ['Parasite (2019)', 'The Shawshank Redemption (1994)', 'Oppenheimer (2023)', 'The Lord of the Rings: The Return of the King (2003)', 'Inception (2010)'],
    answer: [0, 2, 3],
    hint: 'The Shawshank Redemption and Inception were nominated but did not win Best Picture.',
    explanation: 'Parasite, Oppenheimer, and LOTR: The Return of the King won Best Picture. The Shawshank Redemption lost to Forrest Gump in 1994, and Inception lost to The King\'s Speech in 2010.'
  },
  {
    id: 'pc-04',
    category: 'pop-culture',
    difficulty: 'easy',
    type: 'boolean',
    question: 'The character of Sherlock Holmes was created by Sir Arthur Conan Doyle.',
    options: ['True', 'False'],
    answer: 0,
    hint: 'First appeared in "A Study in Scarlet" in 1887.',
    explanation: 'True. British author Sir Arthur Conan Doyle created the legendary detective Sherlock Holmes and Dr. John Watson in 1887.'
  },
  {
    id: 'pc-05',
    category: 'pop-culture',
    difficulty: 'medium',
    type: 'text',
    question: 'In the Lord of the Rings, what is the name of the fictional volcanic mountain where the One Ring was forged and destroyed?',
    acceptableAnswers: ['mount doom', 'mt doom', 'orodruin'],
    hint: 'Located in the heart of Mordor.',
    explanation: 'Mount Doom (also known in Sindarin as Orodruin) is the volcanic mountain in Mordor where Sauron forged the One Ring.'
  },
  {
    id: 'pc-06',
    category: 'pop-culture',
    difficulty: 'hard',
    type: 'single',
    question: 'Which classic 1982 cyberpunk sci-fi movie was loosely based on Philip K. Dick’s novel "Do Androids Dream of Electric Sheep?"',
    options: ['Blade Runner', 'Total Recall', 'Minority Report', 'Akira'],
    answer: 0,
    hint: 'Directed by Ridley Scott and starring Harrison Ford as Rick Deckard.',
    explanation: 'Blade Runner (1982) was adapted from Philip K. Dick\'s 1968 dystopian science fiction novel.'
  }
];
