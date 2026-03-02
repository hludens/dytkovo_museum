import type { GamesProps } from '../Types';
import './cssGame/gameshift.css';
import { useEffect, useState } from 'react';

const ShiftGame = ({ ShowWinAnim }: GamesProps) => {
    const [tiles, setTiles] = useState<number[]>([]);
    const gridSize = 4;
    let backgroundImage = "";
    

    useEffect(() => {
        
        document.getElementById('winMessage')?.classList.add('hidden');
        initializeGame();
    }, []);

    const initializeGame = () => {
        // Создаем массив от 0 до 15
        const initialTiles = Array.from({ length: gridSize * gridSize }, (_, i) => i);
        shuffleTiles();
        
        setTiles(initialTiles);
    };
    function setNewImage(){
        const imageNumber = Math.floor(Math.random() * 6) + 1;
        backgroundImage = `url(chapters/games/15/img/${imageNumber}.jpg)`;
        [...document.getElementsByClassName("tile")].map((tile) => (tile as HTMLDivElement).style.backgroundImage = backgroundImage);
    }

    const shuffleTiles = () => {
        let currentTiles = [...tiles];
        setNewImage();
         document.getElementById('winMessage')?.classList.add('hidden');
        // Выполняем 15-25 случайных сдвигов
        const shuffleCount = Math.floor(Math.random() * 11) + 15;
        
        for (let i = 0; i < shuffleCount; i++) {
            const isRowShift = Math.random() > 0.5;
            const index = Math.floor(Math.random() * gridSize);
            const direction = Math.random() > 0.5 ? 1 : -1;
            
            if (isRowShift) {
                currentTiles = shiftRow(currentTiles, index, direction);
            } else {
                currentTiles = shiftColumn(currentTiles, index, direction);
            }
        }
        
        setTiles(currentTiles);
    };

    const shiftRow = (currentTiles: number[], row: number, direction: number): number[] => {
        const newTiles = [...currentTiles];
        const rowStart = row * gridSize;
        const rowEnd = rowStart + gridSize;
        
        const rowElements = newTiles.slice(rowStart, rowEnd);
        
        if (direction === 1) {
            // Сдвиг вправо
            const lastElement = rowElements.pop();
            if (lastElement !== undefined) {
                rowElements.unshift(lastElement);
            }
        } else {
            // Сдвиг влево
            const firstElement = rowElements.shift();
            if (firstElement !== undefined) {
                rowElements.push(firstElement);
            }
        }
        
        // Вставляем измененную строку обратно
        for (let i = 0; i < gridSize; i++) {
            newTiles[rowStart + i] = rowElements[i];
        }
        
        return newTiles;
    };

    const shiftColumn = (currentTiles: number[], col: number, direction: number): number[] => {
        const newTiles = [...currentTiles];
        const columnElements: number[] = [];
        
        // Собираем элементы столбца
        for (let i = 0; i < gridSize; i++) {
            columnElements.push(newTiles[i * gridSize + col]);
        }
        
        if (direction === 1) {
            // Сдвиг вниз
            const lastElement = columnElements.pop();
            if (lastElement !== undefined) {
                columnElements.unshift(lastElement);
            }
        } else {
            // Сдвиг вверх
            const firstElement = columnElements.shift();
            if (firstElement !== undefined) {
                columnElements.push(firstElement);
            }
        }
        
        // Вставляем измененный столбец обратно
        for (let i = 0; i < gridSize; i++) {
            newTiles[i * gridSize + col] = columnElements[i];
        }
        
        return newTiles;
    };

    const handleRowShift = (row: number, direction: number) => {
        const newTiles = shiftRow(tiles, row, direction);
        setTiles(newTiles);
        checkWin(newTiles);
    };

    const handleColumnShift = (col: number, direction: number) => {
        const newTiles = shiftColumn(tiles, col, direction);
        setTiles(newTiles);
        checkWin(newTiles);
    };

    const checkWin = (currentTiles: number[]) => {
        const isWin = currentTiles.every((tile, index) => tile === index);
        if (isWin) {
            ShowWinAnim();
             document.getElementById('winMessage')?.classList.remove('hidden');
        }
    };

    const getTilePosition = (index: number) => {
        const trueIndex = tiles[index];
        const row = Math.floor(trueIndex / gridSize);
        const col = trueIndex % gridSize;
        return {
            backgroundPosition: `-${col * 150}px -${row * 150}px`
        };
    };

    // Выбираем случайное изображение
    

    return (
        <div id="gamebody">
            <div className="game-container">
                <div  id="winMessage" className="hidden">Поздравляем! Вы собрали картинку!</div>
                {/* Стрелки для столбцов (сверху) */}
                <div className="column-arrows top-arrows">
                    {Array.from({ length: gridSize }, (_, col) => (
                        <button
                            key={`top-${col}`}
                            className="arrow-btn up-arrow"
                            onClick={() => handleColumnShift(col, -1)}
                        >
                            ↑
                        </button>
                    ))}
                </div>

                <div className="puzzle-row">
                    {/* Стрелки для строк (слева) */}
                    <div className="row-arrows left-arrows">
                        {Array.from({ length: gridSize }, (_, row) => (
                            <button
                                key={`left-${row}`}
                                className="arrow-btn left-arrow"
                                onClick={() => handleRowShift(row, -1)}
                            >
                                ←
                            </button>
                        ))}
                    </div>

                    {/* Игровое поле */}
                    <div id="puzzleS">
                        {tiles.map((_, index) => (
                            <div
                                key={index}
                                className="tile"
                                style={{
                                    backgroundImage,
                                    ...getTilePosition(index)
                                }}
                            />
                        ))}
                    </div>

                    {/* Стрелки для строк (справа) */}
                    <div className="row-arrows right-arrows">
                        {Array.from({ length: gridSize }, (_, row) => (
                            <button
                                key={`right-${row}`}
                                className="arrow-btn right-arrow"
                                onClick={() => handleRowShift(row, 1)}
                            >
                                →
                            </button>
                        ))}
                    </div>
                </div>

                {/* Стрелки для столбцов (снизу) */}
                <div className="column-arrows bottom-arrows">
                    {Array.from({ length: gridSize }, (_, col) => (
                        <button
                            key={`bottom-${col}`}
                            className="arrow-btn down-arrow"
                            onClick={() => handleColumnShift(col, 1)}
                        >
                            ↓
                        </button>
                    ))}
                </div>
            </div>

            <button id="reset-button" onClick={shuffleTiles}>Перемешать</button>
        </div>
    );
};

export default ShiftGame;