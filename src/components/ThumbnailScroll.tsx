import React from 'react';
import type { PageBase } from './Types';

interface ThumbnailScrollProps {
  pages: PageBase[];
  currentPageIndex: number;
  selectThumbnail: (index: number) => void;
  
}

function ThumbnailScroll({
  pages,
  currentPageIndex,
  selectThumbnail,
}: ThumbnailScrollProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeftPos, setScrollLeftPos] = React.useState(0);

  if (!pages || pages.length === 0) return null;

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX);
    if (scrollRef.current) {
      setScrollLeftPos(scrollRef.current.scrollLeft);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = x - startX;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeftPos - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="thumbnail-scroll-container">
      <button className="scroll-button left" onClick={scrollLeft}>
        <svg viewBox="0 0 48 48">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div
        className="thumbnail-scroll"
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="thumbnail-list">
          {pages.map((page, index) => (
            <button
  key={index}
  onClick={() => selectThumbnail(index)}
  className={`thumbnail ${currentPageIndex === index ? 'active-thumbnail' : ''}`}
  
> <div className="thumbnail-inner">
  <div className="thumbnail-content">
    <img src={page.thumbnail} alt={`Миниатюра ${page.title}`} />
    <div className="thumbnail-reflection" style={{ backgroundImage: `url(${page.thumbnail})` }}></div>
  </div>
  </div>
</button>
          ))}
        </div>
      </div>

      <button className="scroll-button right" onClick={scrollRight}>
        <svg viewBox="0 0 48 48">
          <path d="M9 18l-6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}

export default ThumbnailScroll;