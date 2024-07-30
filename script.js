//Код будет выполнен после полной загрузки DOM (до изображений и стилей)
document.addEventListener('DOMContentLoaded', () => {
  const words = ['apple', 'orange', 'grape', 'kiwi', 'peach', 'pear', 'apricot', 'lemon', 'mango', 'blackcurrant', 'strawberry', 'raspberry', 'quince'];
  let currentWord = ''; //Переменная, которая хранит текущее (рандомное) слово, которое пользователь должен ввести, является фиксированным
  let currentIndex = 0;

  let correctCount = 0;
  let wrongCount = 0;
  let mistakesCount = 0;

  let timerInterval;
  let minutes = 0;
  let seconds = 0;

  const wordElement = document.querySelector('.word'); //DOM-элемент, который отображает текущее слово (currentWord), обновляется при вводе пользователем
  const inputElement = document.querySelector('#input');

  const correctCountElement = document.querySelector('.correct-count');
  const wrongCountElement = document.querySelector('.wrong-count');
  const wordMistakesElement = document.querySelector('.word-mistakes');

  const timerElement = document.querySelector('#timer');

  //Функция для получения случайного слова из массива words
  function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
  }

  //Функция для отображения текущего слова в элементе .word (wordElement)
  function renderWord() {
    wordElement.innerHTML = ''; //Очистить содержимое .word
    for (let i = 0; i < currentWord.length; i++) {
      const span = document.createElement('span'); //Создать span для каждой буквы
      span.classList.add('symbol');
      span.textContent = currentWord[i]; //i из цикла является индексом текущего символа (буквы) текущего слова
      wordElement.append(span);
    }
  }

  //Функция для сброса значения в поле ввода
  function resetInput() {
    inputElement.value = '';
  }

  //Функция для нового слова
  function startNewWord() {
    currentWord = getRandomWord();
    currentIndex = 0;
    mistakesCount = 0;
    renderWord();
    resetInput();
    wordMistakesElement.textContent = mistakesCount;
  }

  //Функция для запуска таймера
  function startTimer() {
    minutes = 0; //Сбросить минуты
    seconds = 0;
    timerInterval = setInterval(() => {
      seconds++;
      if (seconds >= 60) {
        minutes++;
        seconds = 0;
      }
      let formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      let formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
      timerElement.textContent = `${formattedMinutes}:${formattedSeconds}`;
    }, 1000);
  }

  //Функция для обновления статистики
  function updateStats() {
    correctCountElement.textContent = correctCount;
    wrongCountElement.textContent = wrongCount;
  }

  //Функция для сброса игры
  function resetGame() {
    correctCount = 0;
    wrongCount = 0;
    updateStats();
    startNewWord();
    startTimer();
  }

  //Функция для проверки конца игры
  function checkEndGame() {
    if (correctCount >= 5) {
      setTimeout(() => {
        clearInterval(timerInterval); //Остановить таймер
        alert(`Победа! Ваше время: ${timerElement.textContent}`);
        resetGame();
      }, 1000); //Задержка 1 секунда
    } else if (wrongCount >= 5) {
      setTimeout(() => {
        clearInterval(timerInterval);
        alert('Вы проиграли!');
        resetGame();
      }, 1000);
    }
  }

  //Обработчик события для поля ввода
  inputElement.addEventListener('input', (event) => { //Функция выполняется при каждом изменении значения input
    const userInput = event.target.value.toLowerCase(); //Получить текущее значение ввода в нижнем регистре
    if (userInput.length > 0) { //Если пользователь что-то ввел
      const currentChar = currentWord[currentIndex]; //Получить текущий символ слова
      const spans = wordElement.querySelectorAll('.symbol'); //Получить все spanы символов

      if (userInput[userInput.length - 1] === currentChar) { //Если последний введенный символ совпадает с текущим символом слова
        spans[currentIndex].classList.remove('w');
        spans[currentIndex].classList.add('c');
        currentIndex++; //Увеличить индекс текущего слова
        resetInput();
      } else {
        spans[currentIndex].classList.add('w');
        mistakesCount++;
        wordMistakesElement.textContent = mistakesCount; //Обновить отображение ошибок
        wrongCount++;
        updateStats();
        resetInput();
      }

      if (currentIndex === currentWord.length) { //Если все символы текущего слова введены правильно
        correctCount++;
        updateStats();
        checkEndGame();
        setTimeout(startNewWord, 500); //Начать новое слова через пол секунды, иначе последняя буква не успевает окраситься в нужный цвет
      }
    }
  });

  startNewWord(); //Начать новое слово при запуске страницы
  startTimer(); //Запустить таймер при запуске страницы
});


/*
Вопросы:
1. Если нажать где-нибудь выше инпута, то autofocus перестает работать? Т.е. в таком случае становится невозможным вводить слово.
2. Важно ли брать значение минут и секунд таймера из html?
3. Функция для сброса игры:
Необходимо ли проверять был ли запущен таймер и очищать его, прежде чем запустить его снова?

if (timerInterval) {
  clearInterval(timerInterval);
}
startTimer();
*/