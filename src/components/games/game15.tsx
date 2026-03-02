
import type { GamesProps } from '../Types';
import './cssGame/game15.css';
import {  useEffect } from 'react';
const Game15 = ( {ShowWinAnim}:GamesProps) => {

  useEffect(() => {
        initializeGame();
    }, []);

    const initializeGame = () => {
         
        const puzzle: HTMLElement = document.getElementById('puzzle15') as HTMLDivElement;
        const shuffleBtn: HTMLElement|null = document.getElementById('reset-button');
        document.getElementById('winMessage')?.classList.add('hidden');
        if (!puzzle || !shuffleBtn) {
            return;
        }
const gridSize = 4;
const tileSize = 150;
let tiles: HTMLDivElement[] = [];
let emptyIndex = gridSize * gridSize - 1;

function createTiles() {

    var rand = Math.floor(Math.random() * 6) + 1;
    var fn = "chapters/games/15/img/" + rand + ".jpg";
    console.log(fn)
    puzzle.innerHTML = '';
    tiles = [];
    for (let i = 0; i < gridSize * gridSize; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.style.backgroundImage = 'url('+fn+')';
        if (i === emptyIndex) {
            tile.classList.add('empty');
        } else {
            const row = Math.floor(i / gridSize);
            const col = i % gridSize;
            tile.style.backgroundPosition = `-${col * tileSize}px -${row * tileSize}px`;
        }
        tile.dataset.index = String(i);
        tile.dataset.trueindex = String(i);;
        setPosition(tile, i);
        puzzle.appendChild(tile);
        tiles.push(tile);
    }
}

function setPosition(element: HTMLDivElement, index=0) {
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    element.style.top = `${row * tileSize}px`;
    element.style.left = `${col * tileSize}px`;
}

function shuffleTiles() {
    for (let i = 0; i < 200; i++) {
        const moves = getValidMoves(emptyIndex);
        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        swapTiles(emptyIndex, randomMove);
        emptyIndex = randomMove;
    }
     document.getElementById('winMessage')?.classList.add('hidden');
}

function getValidMoves(index=0) {
    const col = index % gridSize;
    const row = Math.floor(index / gridSize);
    const moves = [];

    if (col > 0) moves.push(index - 1); // left
    if (col < gridSize - 1) moves.push(index + 1); // right
    if (row > 0) moves.push(index - gridSize); // up
    if (row < gridSize - 1) moves.push(index + gridSize); // down

    return moves;
}

function swapTiles(i=0, j=0) {
    const tempIndex = tiles[i].dataset.index;
    tiles[i].dataset.index = tiles[j].dataset.index;
    tiles[j].dataset.index = tempIndex;

    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];

    // Плавное перемещение
    setPosition(tiles[i], i);
    setPosition(tiles[j], j);
}
function chekWin() {
    let win = true;
    for (let i = 0; i < gridSize * gridSize; i++) {
        if (tiles[i].dataset.trueindex !== String(i)) {
            win = false;
            break;
        }
    }
    if (win) {
        ShowWinAnim();
         document.getElementById('winMessage')?.classList.remove('hidden');
        
    }
}

puzzle.addEventListener('click', (e) => {
    var t=e.target as HTMLElement;
    if (!t|| t.classList.contains('tile')) return;
    var data=t.dataset;
    if (!data) return;
    const clickedIndex = parseInt(data?.index as string);
    if (getValidMoves(emptyIndex).includes(clickedIndex)) {
        swapTiles(emptyIndex, clickedIndex);
        emptyIndex = clickedIndex;
        chekWin();
    }
});

shuffleBtn.addEventListener('click', () => {
    puzzle.innerHTML = '';
    createTiles();
    shuffleTiles();
});
createTiles();
shuffleTiles();
        
    };

    return (
        <div id="gamebody">
        <div  id="winMessage" className="hidden">Поздравляем! Вы собрали картинку!</div>
        <img src='/chapters/games/15/img/logo.png' alt=""  id="logo"/>
        <img src='/chapters/games/15/img/logo.png' alt=""  id="logo2"/>
        <div id="puzzle15"></div>
        <button id="reset-button">Перемешать</button>
        
        </div>
    );
};

export default Game15;