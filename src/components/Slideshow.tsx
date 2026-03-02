import React from "react";
import type { Slide } from "./Types";
interface SlideshowProps {
  slides: Slide[]|undefined
}

function Slideshow( {slides}: SlideshowProps) {
  if(!slides || slides.length === 0) return null;
  const [activeIndex, setActiveIndex] = React.useState(0);

  const goToSlide = (index:number) => {
    if (index < 0 || index >= slides.length) return;
    setActiveIndex(index);
  };

  const currentSlide = slides[activeIndex];
const mSize = Boolean(currentSlide?.height)|| Boolean(currentSlide?.width);
  return (
    <section className="slideshow-wrapper">
      {/* Контент слайда */}
      <div className="slide-item">
        {currentSlide.type === 'video' ? (
          <video src={currentSlide.video} controls className="full-width-video" {...mSize&&{ height: currentSlide.height, width: currentSlide.width }}/>
        ) : (
          <img src={currentSlide.image} alt={currentSlide.title} className="slide-image" />
        )}
        <div className="slide-caption">
          <h3>{currentSlide.title}</h3>
          <p>{currentSlide.text}</p>
        </div>
      </div>

      {/* Точки внизу слайда */}
      <div className="dots-container">
        {slides.map((_blank, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`dot ${activeIndex === idx ? 'active' : ''}`}
            aria-label={`Перейти к слайду ${idx + 1}`}
          ></button>
        ))}
      </div>
    </section>
  );
}

export default Slideshow;