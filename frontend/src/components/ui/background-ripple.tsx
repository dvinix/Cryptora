import React, { useEffect, useRef } from 'react';

interface BackgroundRippleProps {
  className?: string;
  duration?: number;
}

export const BackgroundRipple: React.FC<BackgroundRippleProps> = ({ 
  className = '', 
  duration = 200 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Create grid cells
    const cellSize = 50;
    const cols = Math.ceil(canvas.width / cellSize);
    const rows = Math.ceil(canvas.height / cellSize);
    
    interface Cell {
      x: number;
      y: number;
      opacity: number;
      animating: boolean;
      delay: number;
    }

    const cells: Cell[][] = [];
    for (let i = 0; i < rows; i++) {
      cells[i] = [];
      for (let j = 0; j < cols; j++) {
        cells[i][j] = {
          x: j * cellSize,
          y: i * cellSize,
          opacity: 0.4,
          animating: false,
          delay: 0,
        };
      }
    }

    // Animation loop
    let animationId: number;
    let lastTime = 0;

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Randomly trigger ripple animations
      if (Math.random() < 0.02) {
        const randomRow = Math.floor(Math.random() * rows);
        const randomCol = Math.floor(Math.random() * cols);
        if (cells[randomRow] && cells[randomRow][randomCol]) {
          triggerRipple(randomRow, randomCol);
        }
      }

      // Draw and update cells
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const cell = cells[i][j];
          
          if (cell.animating) {
            cell.delay -= deltaTime;
            if (cell.delay <= 0) {
              // Animate opacity
              const progress = (duration - Math.abs(cell.delay)) / duration;
              if (progress < 0.5) {
                cell.opacity = 0.4 + (0.4 * progress * 2);
              } else {
                cell.opacity = 0.8 - (0.4 * (progress - 0.5) * 2);
              }

              if (progress >= 1) {
                cell.animating = false;
                cell.opacity = 0.4;
              }
            }
          }

          // Draw cell
          ctx.fillStyle = `rgba(120, 119, 198, ${cell.opacity * 0.15})`;
          ctx.fillRect(cell.x, cell.y, cellSize - 1, cellSize - 1);
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    const triggerRipple = (row: number, col: number, depth = 0, maxDepth = 3) => {
      if (depth > maxDepth || !cells[row] || !cells[row][col]) return;

      const cell = cells[row][col];
      cell.animating = true;
      cell.delay = depth * 50;

      // Trigger neighboring cells
      setTimeout(() => {
        if (row > 0) triggerRipple(row - 1, col, depth + 1, maxDepth);
        if (row < rows - 1) triggerRipple(row + 1, col, depth + 1, maxDepth);
        if (col > 0) triggerRipple(row, col - 1, depth + 1, maxDepth);
        if (col < cols - 1) triggerRipple(row, col + 1, depth + 1, maxDepth);
      }, 0);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', setCanvasSize);
    };
  }, [duration]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  );
};
