import React from 'react';
import bganim from "../utils/helpers";

function BackgroundEffects() {
  React.useEffect(() => {
    
   bganim("bganim");
  }, []);

  return (
    <div className="background-effects">
      <section className="seperator-wrapper"><div className="seperator gradient"></div></section>
      <div id="bganim" className="top"></div>
      <div className="gradient-blob top-left"></div>
      <div className="gradient-blob bottom-right"></div>
    </div>
  );
}

export default BackgroundEffects;