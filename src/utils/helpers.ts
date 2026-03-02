interface PixelOptions {
  x: number;
  y: number;
  color: string;
  speed: number;
  delay: number;
  delayHide: number;
  step: number;
  boundSize: number;
}

class Pixel {
  x: number;
  y: number;
  color: string;
  speed: number;
  size: number;
  sizeStep: number;
  minSize: number;
  maxSizeAvailable: number;
  maxSize: number;
  sizeDirection: number;
  delay: number;
  delayHide: number;
  counter: number;
  counterHide: number;
  counterStep: number;
  isHidden: boolean;
  isFlicking: boolean;

  constructor({
    x,
    y,
    color,
    speed,
    delay,
    delayHide,
    step,
    boundSize,
  }: PixelOptions) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = speed * Math.random() * 0.5 + 0.1;
    this.size = 0;
    this.sizeStep = Math.random() * 0.5 + 0.1;
    this.minSize = 0.5;
    this.maxSizeAvailable = boundSize || 2;
    this.maxSize =
      Math.random() * (this.maxSizeAvailable - this.minSize) + this.minSize;
    this.sizeDirection = 1;
    this.delay = delay;
    this.delayHide = delayHide;
    this.counter = 0;
    this.counterHide = 0;
    this.counterStep = step;
    this.isHidden = false;
    this.isFlicking = false;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const centerOffset = this.maxSizeAvailable * 0.5 - this.size * 0.5;
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.x + centerOffset,
      this.y + centerOffset,
      this.size,
      this.size
    );
  }

  show(): void {
    this.isHidden = false;
    this.counterHide = 0;

    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }

    if (this.size >= this.maxSize) {
      this.isFlicking = true;
    }

    if (this.isFlicking) {
      this.flicking();
    } else {
      this.size += this.sizeStep;
    }
  }

  hide(): void {
    this.counter = 0;

    if (this.counterHide <= this.delayHide) {
      this.counterHide += this.counterStep;
      if (this.isFlicking) {
        this.flicking();
      }
      return;
    }

    this.isFlicking = false;

    if (this.size <= 0) {
      this.size = 0;
      this.isHidden = true;
      return;
    } else {
      this.size -= 0.05;
    }
  }

  flicking(): void {
    if (this.size >= this.maxSize) {
      this.sizeDirection = -1;
    } else if (this.size <= this.minSize) {
      this.sizeDirection = 1;
    }

    this.size += this.sizeDirection * this.speed;
  }
}

const rand = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

function bganim(contName: string): void {
  const container = document.getElementById(contName);
  if (!container) return;

  const canvas = document.createElement("canvas");
  const interval = 1000 / 60;

  container.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let pixels: Pixel[] = [];
  let request: number | null = null;
  let lastTime: number | null = null;
  let ticker = 0;
  let maxTicker = 360;
  let animationDirection = 1;

  const getDelay = (x: number, y: number, direction?: boolean): number => {
    const dx = x - width * 0.5;
    const dy = y - height;

    if (direction) {
      return Math.sqrt(dx ** 2 + dy ** 2);
    }

    return Math.sqrt(dx ** 2 + y ** 2);
  };

  const initPixels = (): void => {
    const h = Math.floor(rand(0, 360));
    const colorsLen = 5;
    const colors = Array.from(
      { length: colorsLen },
      (_, index) =>
        `hsl(${Math.floor(rand(h, h + (index + 1) * 10))} 100% ${rand(
          50,
          100
        )}%)`
    );

    const gap = 6;
    const step = (width + height) * 0.005;
    const speed = rand(0.008, 0.25);
    const maxSize = Math.floor(gap * 0.5);

    pixels = [];

    for (let x = 0; x < width; x += gap) {
      for (let y = 0; y < height; y += gap) {
        if (x + maxSize > width || y + maxSize > height) continue;

        const color = colors[Math.floor(Math.random() * colorsLen)];
        const delay = getDelay(x, y);
        const delayHide = getDelay(x, y, true);

        pixels.push(
          new Pixel({
            x,
            y,
            color,
            speed,
            delay,
            delayHide,
            step,
            boundSize: maxSize,
          })
        );
      }
    }
  };

  const animate = (): void => {
    request = requestAnimationFrame(animate);

    const now = performance.now();
    const diff = now - (lastTime || 0);

    if (diff < interval) return;

    lastTime = now - (diff % interval);

    ctx.clearRect(0, 0, width, height);

    if (ticker >= maxTicker) {
      animationDirection = -1;
    } else if (ticker <= 0) {
      animationDirection = 1;
    }

    let allHidden = true;

    pixels.forEach((pixel) => {
      if (animationDirection > 0) {
        pixel.show();
      } else {
        pixel.hide();
        allHidden = allHidden && pixel.isHidden;
      }

      pixel.draw(ctx);
    });

    ticker += animationDirection;

    if (animationDirection < 0 && allHidden) {
      ticker = 0;
    }
  };

  const resize = (): void => {
    const rect = container.getBoundingClientRect();
    width = Math.floor(rect.width);
    height = Math.floor(rect.height);
    canvas.width = width;
    canvas.height = height;
    initPixels();
    ticker = 0;
  };

  window.addEventListener("resize", () => {
    if (request !== null) cancelAnimationFrame(request);
    resize();
    request = requestAnimationFrame(animate);
  });

  resize();
  request = requestAnimationFrame(animate);
}

export default bganim;
