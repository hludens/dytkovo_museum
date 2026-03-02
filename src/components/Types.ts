export type MenuItem = {
  key: string;
  name: string;
  icon: string;
};

export type GlobalInitData = {
  menu: MenuItem[];
};

export type MapPoint = {
  id: string;
  x: number;
  y: number;
  title: string;
  image: string;
  description: string;
};

export type Game = {
  title: string;
  screenshot: string;
  url: string;
};
export interface GamesProps {
  ShowWinAnim: () => void;
}
export type Slide = {
  title: string;
  image: string;
  text: string;
  type?: string;
  video?: string;
  height?: string;
  width?: string;
};

export type PageBase = {
  title: string;
  text?: string;
  image?: string;
  orientation?: string;
  thumbnail?: string;
  mapPoints?: MapPoint[];
  games?: Game[];
  video?: string;
  height?: string;
  width?: string;
  slideshow?: Slide[];
};

export type ChapterInitData = {
  pages: PageBase[];
  hideThumbnailScroll?: boolean;
};
