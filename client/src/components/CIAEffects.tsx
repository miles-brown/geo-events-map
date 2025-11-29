import { useEffect, useState } from "react";

export default function CIAEffects() {
  const [glitchActive, setGlitchActive] = useState(false);

  // Random glitch effect every 8-15 seconds
  useEffect(() => {
    const triggerGlitch = () => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
      
      const nextGlitch = 8000 + Math.random() * 7000;
      setTimeout(triggerGlitch, nextGlitch);
    };

    const initialDelay = setTimeout(triggerGlitch, 5000);
    return () => clearTimeout(initialDelay);
  }, []);

  return (
    <>
      {/* Scan Lines */}
      <div className="pointer-events-none fixed inset-0 z-50 scan-lines" />

      {/* Vignette */}
      <div className="pointer-events-none fixed inset-0 z-50 vignette" />

      {/* HUD Corner Brackets */}
      <div className="pointer-events-none fixed inset-0 z-50">
        {/* Top Left */}
        <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-cyan-500/50 hud-bracket" />
        
        {/* Top Right */}
        <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-cyan-500/50 hud-bracket" />
        
        {/* Bottom Left */}
        <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-cyan-500/50 hud-bracket" />
        
        {/* Bottom Right */}
        <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-cyan-500/50 hud-bracket" />
      </div>

      {/* Glitch Overlay */}
      {glitchActive && (
        <div className="pointer-events-none fixed inset-0 z-50 glitch-overlay" />
      )}

      {/* Matrix Data Stream (right side) */}
      <div className="pointer-events-none fixed top-0 right-0 h-full w-px z-40 overflow-hidden">
        <div className="matrix-stream" />
      </div>

      {/* Pulsing Grid Background */}
      <div className="pointer-events-none fixed inset-0 z-0 grid-background" />

      <style>{`
        /* Scan Lines Effect */
        .scan-lines {
          background: linear-gradient(
            to bottom,
            transparent 50%,
            rgba(0, 255, 255, 0.02) 50%
          );
          background-size: 100% 4px;
          animation: scan 8s linear infinite;
        }

        @keyframes scan {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 100%;
          }
        }

        /* Vignette Effect */
        .vignette {
          background: radial-gradient(
            ellipse at center,
            transparent 0%,
            transparent 60%,
            rgba(0, 0, 0, 0.3) 100%
          );
        }

        /* HUD Brackets Animation */
        .hud-bracket {
          animation: hud-pulse 3s ease-in-out infinite;
        }

        @keyframes hud-pulse {
          0%, 100% {
            opacity: 0.5;
            box-shadow: 0 0 10px rgba(6, 182, 212, 0.3);
          }
          50% {
            opacity: 1;
            box-shadow: 0 0 20px rgba(6, 182, 212, 0.6);
          }
        }

        /* Glitch Overlay */
        .glitch-overlay {
          background: repeating-linear-gradient(
            0deg,
            rgba(255, 0, 0, 0.1) 0px,
            transparent 2px,
            rgba(0, 255, 0, 0.1) 4px,
            transparent 6px,
            rgba(0, 0, 255, 0.1) 8px,
            transparent 10px
          );
          animation: glitch-anim 0.2s infinite;
        }

        @keyframes glitch-anim {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
          100% {
            transform: translate(0);
          }
        }

        /* Matrix Data Stream */
        .matrix-stream {
          position: absolute;
          top: 0;
          right: 0;
          width: 1px;
          height: 100%;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(6, 182, 212, 0.8) 50%,
            transparent 100%
          );
          animation: stream-flow 3s linear infinite;
        }

        @keyframes stream-flow {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }

        /* Grid Background */
        .grid-background {
          background-image: 
            linear-gradient(rgba(6, 182, 212, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: grid-pulse 4s ease-in-out infinite;
        }

        @keyframes grid-pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        /* Chromatic Aberration on Text */
        .text-glitch {
          position: relative;
          animation: text-glitch 0.3s infinite;
        }

        @keyframes text-glitch {
          0% {
            text-shadow: 
              0.05em 0 0 rgba(255, 0, 0, 0.75),
              -0.025em -0.05em 0 rgba(0, 255, 0, 0.75),
              0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
          }
          14% {
            text-shadow: 
              0.05em 0 0 rgba(255, 0, 0, 0.75),
              -0.025em -0.05em 0 rgba(0, 255, 0, 0.75),
              0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
          }
          15% {
            text-shadow: 
              -0.05em -0.025em 0 rgba(255, 0, 0, 0.75),
              0.025em 0.025em 0 rgba(0, 255, 0, 0.75),
              -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          49% {
            text-shadow: 
              -0.05em -0.025em 0 rgba(255, 0, 0, 0.75),
              0.025em 0.025em 0 rgba(0, 255, 0, 0.75),
              -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          50% {
            text-shadow: 
              0.025em 0.05em 0 rgba(255, 0, 0, 0.75),
              0.05em 0 0 rgba(0, 255, 0, 0.75),
              0 -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          99% {
            text-shadow: 
              0.025em 0.05em 0 rgba(255, 0, 0, 0.75),
              0.05em 0 0 rgba(0, 255, 0, 0.75),
              0 -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          100% {
            text-shadow: 
              -0.025em 0 0 rgba(255, 0, 0, 0.75),
              -0.025em -0.025em 0 rgba(0, 255, 0, 0.75),
              -0.025em -0.05em 0 rgba(0, 0, 255, 0.75);
          }
        }

        /* Status Indicators */
        .status-indicator {
          position: relative;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #00ff00;
          box-shadow: 0 0 10px #00ff00;
          animation: status-blink 2s ease-in-out infinite;
        }

        @keyframes status-blink {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }

        /* Tactical Border Glow */
        .tactical-border {
          position: relative;
        }

        .tactical-border::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          padding: 2px;
          background: linear-gradient(
            45deg,
            transparent,
            rgba(6, 182, 212, 0.5),
            transparent
          );
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box, 
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: border-flow 3s linear infinite;
        }

        @keyframes border-flow {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }
      `}</style>
    </>
  );
}
