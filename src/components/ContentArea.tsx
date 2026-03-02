import React from "react";
import Slideshow from "./Slideshow";
import GameGrid from "./GameGrid";
import MuseumMap from "./MuseumMap";
import type { PageBase } from "./Types";

interface ThumbnailScrollProps {
  page: PageBase|undefined
  setGameName: (key: string) => void
}
function ContentArea({ page,setGameName}: ThumbnailScrollProps) {
  if(!page) return (  <div className="page-transition card card--blue-glow content-full text-only ">
      <p>Нет данных для отображения page not found</p>
    </div>);
  const hasText = Boolean(page.text);
  const hasImage = Boolean(page.image);
  const hasVideo = Boolean(page?.video);
  const mSize = Boolean(page?.height)|| Boolean(page?.width);
  const hasSlideshow = Boolean(page?.slideshow && page?.slideshow.length > 0);
  const isMapPage = Boolean(page.mapPoints);
  const isGamesPage = Boolean(page.games && page.games.length > 0);
  const imageOrientation = page.orientation=="vertical"?"vertical":"horizontal";

  if (isMapPage) {
    return (
      <div className="page-transition card card--blue-glow ">
        {React.createElement(MuseumMap, { mapData: page  })}
      </div>
    );
  }

  if (isGamesPage) {
    return (
      <div className="page-transition card card--blue-glow ">
        {React.createElement(GameGrid, { games: page.games,setGameName: setGameName })}
      </div>
    );
  }
  var t=[<span>{page.text} </span>];
   
  if(hasText && (page.text as string).indexOf("<br>")>0){
    t=(page.text as string).split("<br>").map((item)=><p>{item}</p>)
  }

  if (hasImage && hasText && (hasVideo || hasSlideshow)) {
    
    return (
      <div className="page-transition card card--blue-glow content-grid-3 ">
        <div className="image-col">
          <img src={page.image} alt={page.title} className="full-width" />
        </div>
        <div className="text-col">
          <p>{t}</p>
        </div>
        <div className="media-col">
          {hasVideo ? (
            <video src={page.video} controls className="full-width-video" {...mSize && { height: page.height, width: page.width }} />
          ) : (
            React.createElement(Slideshow, { slides: page.slideshow })
          )}
        </div>
      </div>
    );
  }

  

  if (hasImage && hasText) {
    if (imageOrientation === 'horizontal') {
      return (
        <div className="page-transition card card--blue-glow content-vertical ">
          <div className="image-col">
          <img src={page.image}alt={page.title} className="full-width" />
          </div><div className="text-col">
          <br/><span>{t}</span><br/>
          </div>
        </div>
      );
    } else {
      return (
        <div className="page-transition card card--blue-glow content-horizontal ">
          <div className="image-col">
            <img src={page.image} alt={page.title} className="full-height" />
          </div>
          <div className="text-col">
            <br/><span>{t}</span><br/>
          </div>
        </div>
      );
    }
  }


  if (hasImage) {
    return (
      <div className="page-transition card card--blue-glow content-full ">
        <img src={page.image} alt={page.title}  className="full-width" />
        {hasText ? (<p>{t}</p>):( <br/>)}<br/>
      </div>
    );
  }

  if (hasVideo) {
    return (
      <div className="page-transition card card--blue-glow content-full ">
        <div><video src={page.video} controls className="full-width-video" {...mSize&& { height: page.height, width: page.width }}/>
        {hasText ? (<span>{t}</span>):( <br/>)}<br/></div>
      </div>
    );
  }

  if (hasSlideshow) {
    return (
      <div className="page-transition card card--blue-glow content-full ">
        {React.createElement(Slideshow, { slides: page.slideshow })}
        {hasText ? (<p>{t}</p>):( <br/>)}<br/>
      </div>
    );
  }

  if (hasText) {
    return (
      <div className="page-transition card card--blue-glow content-full text-only ">
        <br/><p>{t}</p><br/>
      </div>
    );
  }

  return (
    <div className="page-transition card card--blue-glow content-full text-only ">
      <p>Нет данных для отображения</p>
    </div>
  );
}

export default ContentArea;