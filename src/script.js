'use strict';

const questions = document.querySelector('.questions');
const btnNext = document.querySelector('.btn-next');
const btnRepeat = document.querySelector('.btn-repeat');
const scoreLabel = document.querySelector('.score-label');
const labelScore = document.querySelector('.score');
const labelTotalScore = document.querySelector('.total-score');
const correctionContainer = document.querySelector('.correction');

// Data
const data = [
  {
    id: 0,
    question: 'What is the best programming language in the world?',
    options: ['Java', 'Javascript', 'Python', 'C++'],
    correct: ['Javascript'],
  },
  {
    id: 1,
    question: 'Who created the UI library React?',
    options: ['Facebook', 'Google', 'Twitter', 'Microsoft'],
    correct: ['Facebook'],
  },
  {
    id: 2,
    question: 'What is the most popular React library in 2023?',
    options: ['NextJS', 'Angular', 'Svelte', 'VueJS'],
    correct: ['NextJS', 'VueJS'],
  },
  {
    id: 3,
    question: 'Who is the CEO of Facebook?',
    options: ['Elon Musk', 'Mark Zuckerberg', 'Bill Gates', 'Steve Jobs'],
    correct: ['Mark Zuckerberg'],
  },
  {
    id: 4,
    question: 'What is the capital of Morocco?',
    options: ['Meknes', 'Rabat', 'Marrakech', 'Tangier'],
    correct: ['Rabat'],
  },
];

// State
let score = 0;
let currentQuestion = 0;

const renderQuestion = function (questionId) {
  const questionLooked = data.find((entry) => entry.id === questionId);
  if (!questionLooked) return;

  const { id, question, options } = questionLooked;

  const html = `
    <div class="qa" data-id="${id}">
      <div class="question">${question}</div>
      <div class="options">
        ${options
          .map((option) => `<div class="option">${option}</div>`)
          .join('')}
      </div>
    </div>
  `;
  questions.innerHTML = '';
  questions.insertAdjacentHTML('beforeend', html);
};

const init = function () {
  renderQuestion(0);
};

const equalArrays = (arr1, arr2) =>
  Array.isArray(arr1) &&
  Array.isArray(arr2) &&
  arr1.length === arr2.length &&
  arr1.every((val, i) => val === arr2[i]);

const nextQuestion = (e) => {
  // Get current question
  const question = data.find((entry) => entry.id === currentQuestion);

  // Get selected options
  const selectedOptions = [...document.querySelectorAll('.option.active')].map(
    (optionEl) => optionEl.textContent
  );

  // Check if correct
  const areCorrect = equalArrays(selectedOptions, question.correct);

  // If correct, increment score and move to next question
  if (areCorrect)
    // increment score
    score++;

  // If last question
  if (currentQuestion === data.length - 1) {
    // Hide next button
    btnNext.classList.add('hidden');

    // Show repeat button
    btnRepeat.classList.remove('hidden');
    scoreLabel.classList.remove('hidden');

    labelScore.textContent = score;

    const totalScore = data.length;
    labelTotalScore.textContent = totalScore;

    // Good
    const average = totalScore / 2;
    if (score === totalScore || score >= average) {
      labelScore.classList.add('good');
    }

    // Bad
    if (score < average) {
      labelScore.classList.add('bad');
    }

    // TODO: Show correction
    const markup = data
      .map(({ id, question, correct }) => {
        return `
        <div class="qa" data-id="${id}">
          <div class="question">${question}</div>
          <div class="answers">
            ${correct.map((cor) => `<div class="option correct">${cor}</div>`)}
          </div>
        </div>
      `;
      })
      .join('');
    correctionContainer.insertAdjacentHTML('afterbegin', markup);

    console.log(selectedOptions);
  }
  // // move to next question
  currentQuestion++;
  renderQuestion(currentQuestion);
};

const repeat = (e) => {
  // Hide repeat button and show next button
  btnNext.classList.remove('hidden');
  btnRepeat.classList.add('hidden');

  // Hide score
  scoreLabel.classList.add('hidden');

  // Reset score
  score = 0;
  labelScore.classList.remove('bad');
  labelScore.classList.remove('good');

  // Reset current question
  currentQuestion = 0;

  // Render first question
  renderQuestion(0);
};

init();

questions.addEventListener('click', (e) => {
  const clickedQuestion = e.target.closest('.qa');
  if (!clickedQuestion) return;

  currentQuestion = +clickedQuestion.dataset.id;

  // Activate option
  if (e.target.classList.contains('option'))
    e.target.classList.toggle('active');
});

btnNext.addEventListener('click', nextQuestion);
btnRepeat.addEventListener('click', repeat);
