// Sample math challenges data
export const mathChallenges = [
  {
    id: 1,
    title: 'Arithmetic Basics',
    description: 'Master addition, subtraction, multiplication, and division',
    difficulty: 'Easy',
    difficultyColor: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/50',
    estimatedTime: '5 min',
    category: 'Arithmetic',
    image: '/images/challenges/arithmetic.svg',
    questions: [
      { id: 1, question: '15 + 23 = ?', answer: 38, options: [35, 38, 42, 48] },
      { id: 2, question: '100 - 45 = ?', answer: 55, options: [45, 50, 55, 60] },
      { id: 3, question: '12 × 7 = ?', answer: 84, options: [78, 81, 84, 88] },
      { id: 4, question: '144 ÷ 12 = ?', answer: 12, options: [10, 11, 12, 13] },
      { id: 5, question: '25 + 15 + 10 = ?', answer: 50, options: [45, 48, 50, 52] },
    ]
  },
  {
    id: 2,
    title: 'Algebra Fundamentals',
    description: 'Solve equations and work with variables',
    difficulty: 'Medium',
    difficultyColor: 'bg-amber-500 text-white shadow-lg shadow-amber-500/50',
    estimatedTime: '8 min',
    category: 'Algebra',
    image: '/images/challenges/algebra.svg',
    questions: [
      { id: 1, question: 'Solve: 2x + 5 = 15, x = ?', answer: 5, options: [3, 4, 5, 6] },
      { id: 2, question: 'Solve: 3x - 7 = 14, x = ?', answer: 7, options: [5, 6, 7, 8] },
      { id: 3, question: 'Solve: x² = 25, x = ?', answer: 5, options: [-5, 5, 10, 25] },
      { id: 4, question: 'Simplify: 2x + 3x = ?', answer: '5x', options: ['5x', '6x', 'x', '2x'] },
      { id: 5, question: 'Solve: 4x = 20, x = ?', answer: 5, options: [3, 4, 5, 6] },
    ]
  },
  {
    id: 3,
    title: 'Geometry Challenge',
    description: 'Calculate areas, perimeters, and angles',
    difficulty: 'Medium',
    difficultyColor: 'bg-amber-500 text-white shadow-lg shadow-amber-500/50',
    estimatedTime: '10 min',
    category: 'Geometry',
    image: '/images/challenges/geometry.svg',
    questions: [
      { id: 1, question: 'Area of rectangle: length=10, width=5 = ?', answer: 50, options: [30, 40, 50, 60] },
      { id: 2, question: 'Perimeter of square: side=8 = ?', answer: 32, options: [28, 30, 32, 36] },
      { id: 3, question: 'Area of circle: radius=5 (use π≈3.14) = ?', answer: '78.5', options: ['62.8', '70.5', '78.5', '90.2'] },
      { id: 4, question: 'Sum of angles in triangle = ?', answer: 180, options: [90, 180, 270, 360] },
      { id: 5, question: 'Area of triangle: base=10, height=8 = ?', answer: 40, options: [30, 35, 40, 50] },
    ]
  },
  {
    id: 4,
    title: 'Advanced Problem Solving',
    description: 'Complex multi-step problems and critical thinking',
    difficulty: 'Hard',
    difficultyColor: 'bg-rose-600 text-white shadow-lg shadow-rose-600/50',
    estimatedTime: '15 min',
    category: 'Problem Solving',
    image: '/images/challenges/advanced.svg',
    questions: [
      { id: 1, question: 'If 3 apples cost $5, how much do 7 apples cost?', answer: '11.67', options: ['10.50', '11.67', '12.50', '13.20'] },
      { id: 2, question: 'Train A travels 60 km/h, Train B travels 80 km/h. Starting from same point, distance after 2 hours?', answer: 40, options: [20, 30, 40, 50] },
      { id: 3, question: 'Solve: 2(x+3) = 16, x = ?', answer: 5, options: [3, 4, 5, 6] },
      { id: 4, question: 'Percentage: 30% of 200 = ?', answer: 60, options: [50, 55, 60, 65] },
      { id: 5, question: 'Pythagorean theorem: if a=3, b=4, c=?', answer: 5, options: [4, 5, 6, 7] },
    ]
  },
  {
    id: 5,
    title: 'Mental Math Speed',
    description: 'Quick calculations to test mental arithmetic',
    difficulty: 'Easy',
    difficultyColor: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/50',
    estimatedTime: '3 min',
    category: 'Arithmetic',
    image: '/images/challenges/mental-math.svg',
    questions: [
      { id: 1, question: '9 × 9 = ?', answer: 81, options: [72, 81, 90, 99] },
      { id: 2, question: '50 + 25 = ?', answer: 75, options: [65, 70, 75, 80] },
      { id: 3, question: '200 - 80 = ?', answer: 120, options: [100, 110, 120, 130] },
      { id: 4, question: '15 × 4 = ?', answer: 60, options: [50, 55, 60, 65] },
      { id: 5, question: '100 ÷ 5 = ?', answer: 20, options: [15, 18, 20, 25] },
    ]
  },
];
