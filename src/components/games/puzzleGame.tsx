import type { GamesProps } from '../Types';
import './cssGame/gamePuzzle.css';
import {  useEffect } from 'react';



const PuzzleGame = ( {ShowWinAnim}:GamesProps) => {



    function shuffle(array:String[]) {
        for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
        }
    return array;
    }
    let gridSize = { rows: 0, cols: 0 };
    let cards:HTMLElement[] = [];
    let flippedCards:HTMLElement[] = [];
    let attempts = 0;
    let lockBoard = false;
    let menu:HTMLElement|null=null;
    let game:HTMLElement|null=null;
    let gridContainer:HTMLElement|null=null;
    let attemptsDisplay:HTMLElement|null=null;
    let winScreen:HTMLElement|null=null;
    let winAttempts:HTMLElement|null=null;

    useEffect(() => {
        initializeGame();
    }, []);

    const initializeGame = () => {
        menu = document.getElementById('gamemenu');
        game = document.getElementById('game');
        gridContainer = document.getElementById('grid');
        attemptsDisplay = document.getElementById('attempts');
        winScreen = document.getElementById('winScreen');
        winAttempts = document.getElementById('winAttempts');
        menuShow(true);
        }

function menuShow(visible:boolean) {
    if(!menu||!game||!winScreen)return;
    menu.style.display = visible ? 'flex' : 'none';
    game.style.display = visible ? 'none' : 'flex';
    winScreen.style.display = 'none';
}


    function setupGrid(rows=0, cols=0) {
      if (rows * cols % 2 !== 0) {
        alert("Должно быть четное количество карточек");
        return;
      }
      gridSize = { rows, cols };
      resetGame();
      menuShow(false);
    }
     function resetGame() {
      if(!attemptsDisplay||!gridContainer||!game)initializeGame();
      console.log('reset game',attemptsDisplay,gridContainer,game);
      attempts = 0;
      
      setAttemptsDisplay();
      if (gridContainer) gridContainer.innerHTML = '';
      cards = [];
      flippedCards = [];
      lockBoard = false;

      const totalPairs = (gridSize.rows * gridSize.cols) / 2;
      const images = Array.from({ length: totalPairs }, (_, i) => `chapters/games/puzzle/img/${i + 1}.jpg`);
      const cardImages =shuffle( [...images, ...images].sort(() => Math.random() - 0.5));

      if (gridContainer) gridContainer.style.gridTemplateColumns = `repeat(${gridSize.cols}, 1fr)`;

      cardImages.forEach((src, index) => {
        const card = createCard(src as string, index);
        gridContainer?.appendChild(card);
        cards.push(card);
      });
    }
     function createCard(imageSrc:string, index=0) {
      const card = document.createElement('div');
      card.className = 'gamecard';
      card.dataset.index = index.toString();
      card.dataset.image = imageSrc;

      const inner = document.createElement('div');
      inner.className = 'gamecard-inner';

      const front = document.createElement('div');
      front.className = 'gamecard-front';
      front.style.backgroundImage = `url('${imageSrc}')`;

      const back = document.createElement('div');
      back.className = 'gamecard-back';

      inner.appendChild(front);
      inner.appendChild(back);
      card.appendChild(inner);

      card.addEventListener('click', () => flipCard(card));

      return card;
    }

        function flipCard(card:HTMLElement) {
      if (lockBoard || card.classList.contains('flipped') || flippedCards.length === 2) return;

      card.classList.add('flipped');
      flippedCards.push(card);

      if (flippedCards.length === 2) {
        attempts++;
        setAttemptsDisplay();
        const [card1, card2] = flippedCards;

        if (card1.dataset.image === card2.dataset.image) {
          flippedCards = [];
          checkWin();
        } else {
          lockBoard = true;
          setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            lockBoard = false;
          }, 1000);
        }
      }
    }
     function checkWin() {
      const unflipped = cards.some(card => !card.classList.contains('flipped'));
      if (!unflipped) {
        setAttemptsDisplay()
        if(winScreen) winScreen.style.display = 'flex';
        ShowWinAnim();
        }
    }
    function setAttemptsDisplay() {
      if(!attemptsDisplay||!winAttempts)return;
      var score=Math.max(0,1000+(gridSize.cols*gridSize.rows/2)*10 -(attempts-(gridSize.cols*gridSize.rows/2))*15);
      attemptsDisplay.textContent = `Попытки: ${attempts}`;
      winAttempts.textContent = `Попыток: ${attempts} Очков набрано:${score}` ;
    }

    function restartGame() {
      console.log('restart game');
      if(winScreen)  winScreen.style.display = 'none';
      resetGame();
    }




    return (
        <div id="gamebody">
  <div className="gamemenu" id="gamemenu">
    <h2>Инструкция</h2>
    <p>Открывайте по две карточки, чтобы найти пары.<br/>Если они не совпадают, они закроются снова.</p>
    <h2>Выберите уровень сложности</h2>
    <button onClick={()=>setupGrid(5,4)}>Легкий (5x4)</button>
    <button onClick={()=>setupGrid(6,5)}>Средний (6x5)</button>
    <button onClick={()=>setupGrid(6,6)}>Сложный (6x6)</button>
  </div>

  <div className="game" id="game">
    <div id="attempts">Попытки: 0</div>
    <div id="grid" className="gamegrid"></div>
    <button id="reset-button" onClick={()=>restartGame()}>Начать заново</button>
  </div>

  <div className="win-screen" id="winScreen">
    <h2>Вы выиграли!</h2>
    <p id="winAttempts">Попыток: 0</p>
    
  </div>

  
    </div>
    );
};

export default PuzzleGame;