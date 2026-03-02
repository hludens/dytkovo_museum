import type { GamesProps } from '../Types';
import './cssGame/gameR.css';
import {  useEffect } from 'react';

const RotateGame = ( {ShowWinAnim}:GamesProps) => {
 useEffect(() => {
        initializeGame();
    }, []);
  const imageCount = 6;
        const imageBasePath =  "chapters/games/rotate/img/";
        let gridSize = 0;
        let pieces: HTMLDivElement[] = [];
        let solved = false;
        let imagePath = '';
        let menu:HTMLElement|null = null;
        let gameContainer:HTMLElement|null = null;
        let winMessage:HTMLElement|null = null;
        let puzzle:HTMLElement|null = null;

    const initializeGame = () => {
        pieces = [];
        menu = document.getElementById('menu');
        gameContainer = document.getElementById('gameContainer');
        winMessage = document.getElementById('winMessage');
        puzzle = document.getElementById('puzzleR');
        if (menu && gameContainer && winMessage) {
            gameContainer.classList.add('hidden');
            winMessage.classList.add('hidden');
        }

    }

    function startGame(size=0) {
     console.log(size);
          gridSize = size;
            
            menu?.classList.add('hidden');
            winMessage?.classList.add('hidden');
            gameContainer?.classList.remove('hidden');
            solved = false;

            const randomImageIndex = Math.floor(Math.random() * imageCount) + 1;
            imagePath = `${imageBasePath}${randomImageIndex}.jpg`;

            // Проверим, загружается ли изображение
            const imgTest = new Image();
            imgTest.onload = function() {
                initPuzzle();
            };
            imgTest.onerror = function() {
                // Заглушка на случай ошибки
                imagePath = 'localhost/logo.png' + randomImageIndex;
                initPuzzle();
            };
            imgTest.src = imagePath;
    }
  function initPuzzle() {
            
            if (!puzzle) return;
            puzzle.innerHTML = '';
            const pieceSize =Math.floor(( window.innerHeight-250 )/ gridSize ); // px
            puzzle.style.gridTemplateColumns = `repeat(${gridSize}, ${pieceSize}px)`;
            puzzle.style.gridTemplateRows = `repeat(${gridSize}, ${pieceSize}px)`;

            pieces = [];

            // const pieceWidth = 100 / gridSize;
            // const pieceHeight = 100 / gridSize;

            for (let row = 0; row < gridSize; row++) {
                for (let col = 0; col < gridSize; col++) {
                    const piece = document.createElement('div');
                    piece.className = 'piece';
                    piece.classList.add("bord");
                    piece.style.width = `${pieceSize}px`;
                    piece.style.height = `${pieceSize}px`;

                    // Фоновое изображение
                    piece.style.backgroundImage = `url('${imagePath}')`;
                    piece.style.backgroundSize = `${gridSize * pieceSize}px ${gridSize * pieceSize}px`;
                    piece.style.backgroundPosition = `-${col * pieceSize}px -${row * pieceSize}px`;
                    piece.style.backgroundRepeat = 'no-repeat';

                    // Случайный поворот
                    const rotations = [0, 90, 180, 270];
                    const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];
                    piece.style.transform = `rotate(${randomRotation}deg)`;
                    piece.dataset.rotation = String( randomRotation);
                    piece.dataset.row = String(row);
                    piece.dataset.col = String(col);

                    puzzle.appendChild(piece);
                    piece.addEventListener('click', rotatePiece);

                    pieces.push(piece);
                }
            }
        }

        function rotatePiece(event:any) {
            if (solved) return;

            const piece = event.target;
            const currentRotation = parseInt(piece.dataset.rotation);
            var newRotation = (currentRotation + 90);
            piece.dataset.rotation = newRotation;
            piece.style.transform = `rotate(${newRotation}deg)`;
            checkWin();
        }

        function checkWin() {
            const allAligned = pieces.every(piece => parseInt(piece.dataset.rotation as string)% 360 === 0);
            if (allAligned && !solved) {
                solved = true;
                winMessage?.classList.remove('hidden');
                ShowWinAnim();
            }
        }

        function resetGame() {
            gameContainer?.classList.add('hidden');
            winMessage?.classList.add('hidden');
            menu?.classList.remove('hidden') 
        }

    return (
        <div id="gamebody">
        <div id="menu">
        <p>Выберите уровень сложности:</p>
        <button onClick={() =>startGame(5)}>5×5</button>
        <button onClick={() =>startGame(7)}>7×7</button>
        <button onClick={() =>startGame(8)}>8×8</button>
    </div>

    <div id="gameContainer" className="hidden">
        <div  id="winMessage" className="hidden">Поздравляем! Вы собрали картинку!</div>
        <div id="puzzleR"></div>
        <button  id="reset-button" onClick={() =>resetGame()}>Начать заново</button>
    </div>
        </div>
    );
};

export default RotateGame;