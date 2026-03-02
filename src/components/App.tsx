import { useState, useEffect } from 'react';
import BackgroundEffects from './BackgroundEffects';
import Nav from './Nav';
import ContentArea from './ContentArea';
import NavButton from './NavButton';
import ThumbnailScroll from './ThumbnailScroll';
import type {GlobalInitData,ChapterInitData , MenuItem } from './Types';
import Game15 from './games/game15';
import PuzzleGame from './games/puzzleGame';
import RotateGame from './games/RotateGame';
import Confetti from './games/Confetti';
import ShiftGame from './games/shiftGame';



function App() {
const [globalData, setGlobalData] = useState<GlobalInitData | null>(null);
const [chapterData, setChapterData] = useState<ChapterInitData | null>(null);
const [gameName, setgameName] = useState("");
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [currentChapter, setCurrentChapter] = useState('about');
  const [isLoading, setIsLoading ] = useState(true);
  const [isWin,setIsWin ] = useState(true);
  const TIMEOUT_DURATION = 5 * 60 * 1000; // 5 минут в миллисекундах
  
  
  let timeoutId: NodeJS.Timeout;
  const resetTimer = () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      loadChapter("about");
    }, TIMEOUT_DURATION);
    
  };
const handleUserActivity = () => {
    resetTimer();
  };
  
  useEffect(() => {
    
  
  window.addEventListener('touchstart', handleUserActivity, { passive: true });
  window.addEventListener('mouseup', handleUserActivity, { passive: true });
  

  // Инициализация таймера при монтировании
  resetTimer();
  // Загрузка глобального конфига
    fetch('/global_init.json')
      .then((res) => res.json())
      .then((data) => {
        setGlobalData(data);
        loadChapter(currentChapter);
      })
      .catch(() => {
        alert('Ошибка загрузки global_init.json');
        setIsLoading(false);
      });
     
  }, []);
  const setGameName=(key:string)=>{setgameName(key);};

  // Загрузка данных раздела
  const fullscreen = () => {
 if (document.documentElement.requestFullscreen) {document.documentElement.requestFullscreen();}
    var bt=document.getElementById("fullscreenBtn");
    if(bt)bt.style.display = 'none';
  };
    var btf=document.getElementById("fullscreenBtn");
    if(btf)btf.onclick=fullscreen;
  const loadChapter = (chapterKey:string) => {
    setIsLoading(true);
    setGameName("");
    setIsWin(false);
    fetch(`/chapters/${chapterKey}/chapter_init.json`)
      .then((res) => res.json())
      .then((data) => {
        setChapterData(data);
        setCurrentPageIndex(0);
        setCurrentChapter(chapterKey);
        setIsLoading(false);
       })
      .catch(() => {
        alert(`Ошибка загрузки chapter_init.json для ${chapterKey}`);
        setIsLoading(false);
      });
      
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Загрузка...</div>
      </div>
    );
  }

  const currentChapterName =
    globalData?.menu.find((item: MenuItem) => item.key === currentChapter)?.name || '';
  const currentPage = chapterData?.pages[currentPageIndex];
  const maniPage = chapterData?.pages.length !== 1;
  const showThumbnail = maniPage && (chapterData?.hideThumbnailScroll !== true);

  const goToPage = (direction: number) => {
    setCurrentPageIndex((prev) => {
      if (!chapterData) return prev;
      const newIndex = prev + direction;
      if (newIndex < 0 || newIndex >= chapterData.pages.length) return prev;
      return newIndex;
    });
  };
  
  const ShowWinAnim=()=>{
    
    setIsWin(true)
    
    setTimeout(() => {
      setIsWin(false);
    }, 5000);
    
  }
if(globalData === null || chapterData === null) return null;

if(gameName!=""){
  
  return (
      <div className="gameapp-container">
      <BackgroundEffects />
      <Nav menu={globalData.menu} currentChapter={currentChapter} onSelect={loadChapter} />
  <div className='gameDiv'>
    <Confetti 
        isActive={isWin}
        particleCount={150}
        duration={19000}
      />
    {gameName=="15"?<Game15 ShowWinAnim={ShowWinAnim}/>:null}
    {gameName=="puzzle"?<PuzzleGame  ShowWinAnim={ShowWinAnim}/>:null}
    {gameName=="rotate"?<RotateGame  ShowWinAnim={ShowWinAnim}/>:null}
    {gameName=="shift"?<ShiftGame  ShowWinAnim={ShowWinAnim}/>:null}
  
  </div>
  </div>);
}

  return (
    <div className="app-container">
      <BackgroundEffects />
      <Nav menu={globalData.menu} currentChapter={currentChapter} onSelect={loadChapter} />
      
      <main className="main-content">
        <div className="section-title">
          <h1>{currentChapterName}: <span className="page-title">{currentPage?.title}</span></h1>
        </div>
      
        <div key={currentPageIndex} className="content-wrapper">
          <ContentArea page={currentPage} setGameName={setGameName} />
        </div>
      </main>
      

      {showThumbnail && <ThumbnailScroll
        pages={chapterData?.pages}
        currentPageIndex={currentPageIndex}
        selectThumbnail={setCurrentPageIndex}
      />}

      {maniPage && <NavButton direction="left" onClick={() => goToPage(-1)} />}
      {maniPage && <NavButton direction="right" onClick={() => goToPage(1)} />}
    </div>
  );
}

export default App;