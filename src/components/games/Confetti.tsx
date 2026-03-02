import { useEffect, useCallback, useRef } from 'react';
import './cssGame/Confetti.css'; // Optional CSS file

type typePart = {
    x: number;
    y: number;
    radius: number;
    color: string;
    dx: number;
    dy: number;
    life: number;
    decay: number;
}

const Confetti = ({ isActive = true, particleCount = 150, duration = 5000 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesArr = useRef<typePart[]>([]);
    const animationFrameRef = useRef<number>(0);
    const startTime = useRef<number>(0);

    const initCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }, []);

    const launchConfetti = useCallback(() => {
        console.log("Launching confetti");
        const canvas = canvasRef.current;
        if (!canvas) return;

        particlesArr.current = [];
        startTime.current = Date.now();

        for (let i = 0; i < particleCount; i++) {
            const p: typePart = {
                x: canvas.width / 2+Math.random() * 100 - 50,
                y: canvas.height / 3+Math.random() * 100 - 50,
                radius: Math.random() * 4 + 2,
                color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                dx: (Math.random() - 0.5) * 15,
                dy: (Math.random() - 0.5) * 10,
                life: 1+Math.random()*2,
                decay: 0.005 + Math.random() * 0.005,
            };
            particlesArr.current.push(p);
        }

        animateConfetti();
    }, [particleCount]);

    const animateConfetti = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const currentTime = Date.now();
        const elapsed = currentTime - startTime.current;

        particlesArr.current.forEach((p, i) => {
            p.x += p.dx;
            p.y += p.dy;
            p.dy += 0.2; // gravity
            p.life -= p.decay;
            if(p.y > canvas.height) {
                p.y =canvas.height-1;
                p.dy = -0.8*p.dy;
            }
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life;
            ctx.fill();
            
            if (p.life <= 0) {
                particlesArr.current.splice(i, 1);
            }
        });

        // Stop animation when all particles are gone or duration exceeded
        if (particlesArr.current.length > 0 && elapsed < duration) {
            animationFrameRef.current = requestAnimationFrame(animateConfetti);
        } else {
            particlesArr.current = [];
        }
    }, [duration]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            initCanvas();
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, [initCanvas]);

    // Initialize canvas on mount
    useEffect(() => {
        initCanvas();
    }, [initCanvas]);

    // Start/stop confetti based on isActive prop
    useEffect(() => {
        if (isActive) {
            launchConfetti();
        } else {
            cancelAnimationFrame(animationFrameRef.current);
            particlesArr.current = [];
            
            // Clear canvas when not active
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (ctx && canvas) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }

        return () => {
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, [isActive, launchConfetti]);

    return (
        <canvas
            ref={canvasRef}
            className="confetti-canvas"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 9999,
            }}
        />
    );
};

export default Confetti;