import { trpc } from "@/lib/trpc";
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, MapPin, Calendar, BarChart3, Shield, AlertTriangle, Lock, Eye } from "lucide-react";
import { CATEGORIES } from "@shared/categories";
import { useEffect, useState, useRef } from "react";

// Sound effect generator using Web Audio API
const createBeep = (frequency: number, duration: number, volume: number = 0.3) => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
};

const playTacticalBeep = () => createBeep(800, 0.05, 0.2);
const playDataSound = () => createBeep(1200, 0.08, 0.15);
const playAlertTone = () => {
  createBeep(600, 0.1, 0.25);
  setTimeout(() => createBeep(800, 0.1, 0.25), 100);
};

export default function Statistics() {
  const { data: stats, isLoading } = trpc.statistics.getStats.useQuery();
  const [glitchActive, setGlitchActive] = useState(false);
  const [scanLine, setScanLine] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [introStep, setIntroStep] = useState(0);
  const [decryptProgress, setDecryptProgress] = useState(0);
  const [authProgress, setAuthProgress] = useState(0);
  const [terminalText, setTerminalText] = useState("");
  const hasPlayedIntroSound = useRef(false);

  // Terminal text sequence
  const terminalSequence = [
    "> INITIALIZING SECURE CONNECTION...",
    "> ESTABLISHING ENCRYPTED CHANNEL...",
    "> VERIFYING SECURITY CLEARANCE...",
    "> ACCESSING CLASSIFIED DATABASE...",
    "> DECRYPTING DATA STREAMS...",
    "> AUTHENTICATION COMPLETE",
    "> ACCESS GRANTED"
  ];

  useEffect(() => {
    if (!showIntro) {
      // Random glitch effect
      const glitchInterval = setInterval(() => {
        if (Math.random() > 0.95) {
          setGlitchActive(true);
          setTimeout(() => setGlitchActive(false), 100);
        }
      }, 2000);

      // Scan line animation
      const scanInterval = setInterval(() => {
        setScanLine(prev => (prev + 1) % 100);
      }, 50);

      return () => {
        clearInterval(glitchInterval);
        clearInterval(scanInterval);
      };
    }
  }, [showIntro]);

  // Intro sequence animation
  useEffect(() => {
    if (showIntro && !isLoading) {
      // Play initial beep
      if (!hasPlayedIntroSound.current) {
        playAlertTone();
        hasPlayedIntroSound.current = true;
      }

      // Step 1: Decryption progress (0-2s)
      const decryptInterval = setInterval(() => {
        setDecryptProgress(prev => {
          if (prev >= 100) {
            clearInterval(decryptInterval);
            setIntroStep(1);
            playTacticalBeep();
            return 100;
          }
          return prev + 2;
        });
      }, 30);

      // Step 2: Authentication progress (2-4s)
      setTimeout(() => {
        const authInterval = setInterval(() => {
          setAuthProgress(prev => {
            if (prev >= 100) {
              clearInterval(authInterval);
              setIntroStep(2);
              playDataSound();
              return 100;
            }
            return prev + 2;
          });
        }, 30);
      }, 2000);

      // Step 3: Terminal text typing (4-7s)
      setTimeout(() => {
        setIntroStep(3);
        let textIndex = 0;
        let charIndex = 0;
        
        const typeInterval = setInterval(() => {
          if (textIndex < terminalSequence.length) {
            if (charIndex < terminalSequence[textIndex].length) {
              setTerminalText(prev => prev + terminalSequence[textIndex][charIndex]);
              charIndex++;
              if (Math.random() > 0.7) playTacticalBeep();
            } else {
              setTerminalText(prev => prev + "\n");
              textIndex++;
              charIndex = 0;
              playDataSound();
            }
          } else {
            clearInterval(typeInterval);
            setTimeout(() => {
              playAlertTone();
              setTimeout(() => {
                setShowIntro(false);
              }, 500);
            }, 500);
          }
        }, 50);
      }, 4000);

      return () => {
        clearInterval(decryptInterval);
      };
    }
  }, [showIntro, isLoading]);

  // Intro sequence screen
  if (showIntro || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-radial from-red-950/20 via-black to-black" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        
        {/* Scan line */}
        <div 
          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent blur-sm pointer-events-none z-50"
          style={{ top: `${scanLine}%` }}
        />

        {/* Corner brackets */}
        <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-red-500 opacity-50" />
        <div className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-red-500 opacity-50" />
        <div className="absolute bottom-0 left-0 w-32 h-32 border-b-4 border-l-4 border-red-500 opacity-50" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-red-500 opacity-50" />
        
        <div className="relative z-10 w-full max-w-2xl px-8">
          {/* Loading state */}
          {isLoading && (
            <div className="text-center">
              <div className="text-red-500 text-2xl font-mono mb-4 animate-pulse tracking-widest">
                [ INITIALIZING SECURE CONNECTION ]
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
                <div className="w-3 h-3 bg-red-500 rounded-full animate-ping delay-100" />
                <div className="w-3 h-3 bg-red-500 rounded-full animate-ping delay-200" />
              </div>
            </div>
          )}

          {/* Intro sequence */}
          {!isLoading && (
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center border-2 border-red-600 p-6 bg-black/80">
                <Shield className="h-16 w-16 text-red-500 mx-auto mb-4 animate-pulse" />
                <h1 className="text-3xl font-black text-red-500 tracking-widest font-mono">
                  CLASSIFIED ACCESS PROTOCOL
                </h1>
                <p className="text-green-400 text-sm tracking-[0.3em] mt-2 font-mono">
                  SECURITY CLEARANCE: TOP SECRET
                </p>
              </div>

              {/* Decryption Progress */}
              {introStep >= 0 && (
                <div className="border border-red-600 p-6 bg-black/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-red-400 font-mono text-sm tracking-widest">
                      DECRYPTING DATABASE
                    </span>
                    <span className="text-green-400 font-mono text-sm">
                      {decryptProgress}%
                    </span>
                  </div>
                  <div className="w-full h-4 bg-gray-900 border border-red-900">
                    <div 
                      className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-100"
                      style={{ width: `${decryptProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Authentication Progress */}
              {introStep >= 1 && (
                <div className="border border-yellow-600 p-6 bg-black/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-yellow-400 font-mono text-sm tracking-widest">
                      AUTHENTICATING CREDENTIALS
                    </span>
                    <span className="text-green-400 font-mono text-sm">
                      {authProgress}%
                    </span>
                  </div>
                  <div className="w-full h-4 bg-gray-900 border border-yellow-900">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-100"
                      style={{ width: `${authProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Security Checks */}
              {introStep >= 2 && (
                <div className="border border-green-600 p-6 bg-black/80">
                  <div className="space-y-2 text-green-400 font-mono text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span>BIOMETRIC SCAN: VERIFIED</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span>ENCRYPTION KEY: VALIDATED</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span>SECURITY PROTOCOL: ACTIVE</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Terminal Output */}
              {introStep >= 3 && (
                <div className="border border-cyan-600 p-6 bg-black/90 font-mono text-sm">
                  <div className="text-cyan-400 whitespace-pre-wrap">
                    {terminalText}
                    <span className="animate-pulse">_</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500 font-mono text-xl tracking-widest border-2 border-red-500 px-8 py-4 animate-pulse">
          ⚠ ACCESS DENIED ⚠
        </div>
      </div>
    );
  }

  // Get colors from CATEGORIES
  const categoryColors = stats.byCategory.map(cat => {
    const category = CATEGORIES.find(c => c.label.toLowerCase() === cat.name.toLowerCase());
    return category?.color || "#ef4444";
  });

  return (
    <div className={`min-h-screen bg-black text-green-400 font-mono relative overflow-hidden ${glitchActive ? 'glitch-active' : ''}`}>
      {/* Cinematic background layers */}
      <div className="absolute inset-0 bg-gradient-radial from-red-950/10 via-black to-black" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10 animate-grid-scroll" />
      
      {/* Animated scan line */}
      <div 
        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent blur-sm pointer-events-none z-50"
        style={{ top: `${scanLine}%` }}
      />
      
      {/* Vignette effect */}
      <div className="absolute inset-0 shadow-vignette pointer-events-none z-40" />
      
      {/* Film grain overlay */}
      <div className="absolute inset-0 bg-film-grain opacity-10 pointer-events-none z-30 mix-blend-overlay" />

      {/* Corner HUD brackets */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-red-500 opacity-50 z-20" />
      <div className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-red-500 opacity-50 z-20" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-4 border-l-4 border-red-500 opacity-50 z-20" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-red-500 opacity-50 z-20" />

      <div className="relative z-10 p-8">
        {/* Top security header */}
        <div 
          className="mb-8 border-4 border-red-600 bg-black/90 p-6 relative overflow-hidden cursor-pointer"
          onMouseEnter={() => playTacticalBeep()}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 animate-pulse" />
          <div className="absolute -right-20 -top-10 text-red-600 text-[200px] font-black opacity-10 rotate-[-25deg]">
            CLASSIFIED
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Shield className="h-12 w-12 text-red-500 animate-pulse" />
              <div>
                <h1 className="text-4xl font-black text-red-500 tracking-widest uppercase glitch-text">
                  INTELLIGENCE ANALYTICS
                </h1>
                <p className="text-green-400 text-sm tracking-[0.3em] mt-1">
                  SECURITY CLEARANCE: TOP SECRET // EYES ONLY
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-red-500 mb-1">
                <Lock className="h-4 w-4" />
                <span className="text-xs tracking-widest">ENCRYPTED</span>
              </div>
              <div className="flex items-center gap-2 text-yellow-500">
                <Eye className="h-4 w-4" />
                <span className="text-xs tracking-widest">MONITORED</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 text-xs">
            <span className="text-gray-500">CLASSIFICATION: TS//SCI//NOFORN</span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-500">COMPARTMENT: UMBRA</span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-500">ORIGINATOR: GCHQ-NSA-JOINT</span>
          </div>
        </div>

        {/* Critical stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Events */}
          <div 
            className="bg-black border-2 border-red-600 p-6 relative overflow-hidden group hover:border-red-400 transition-all cursor-pointer"
            onMouseEnter={() => playTacticalBeep()}
          >
            <div className="absolute inset-0 bg-red-950/20" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <BarChart3 className="h-8 w-8 text-red-500" />
                <AlertTriangle className="h-5 w-5 text-yellow-500 animate-pulse" />
              </div>
              <p className="text-red-400 text-xs uppercase tracking-[0.3em] mb-2">TOTAL INCIDENTS</p>
              <p className="text-5xl font-black text-red-500 tracking-wider">{stats.total}</p>
              <div className="mt-3 text-[10px] text-gray-600 tracking-widest">
                THREAT LEVEL: ELEVATED
              </div>
            </div>
          </div>

          {/* Categories */}
          <div 
            className="bg-black border-2 border-yellow-600 p-6 relative overflow-hidden group hover:border-yellow-400 transition-all cursor-pointer"
            onMouseEnter={() => playTacticalBeep()}
          >
            <div className="absolute inset-0 bg-yellow-950/20" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent animate-pulse" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <TrendingUp className="h-8 w-8 text-yellow-500" />
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping" />
              </div>
              <p className="text-yellow-400 text-xs uppercase tracking-[0.3em] mb-2">CATEGORIES</p>
              <p className="text-5xl font-black text-yellow-500 tracking-wider">{stats.byCategory.length}</p>
              <div className="mt-3 text-[10px] text-gray-600 tracking-widest">
                CLASSIFICATION TYPES
              </div>
            </div>
          </div>

          {/* Boroughs */}
          <div 
            className="bg-black border-2 border-green-600 p-6 relative overflow-hidden group hover:border-green-400 transition-all cursor-pointer"
            onMouseEnter={() => playTacticalBeep()}
          >
            <div className="absolute inset-0 bg-green-950/20" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <MapPin className="h-8 w-8 text-green-500" />
                <div className="text-[10px] text-green-500 tracking-widest">ACTIVE</div>
              </div>
              <p className="text-green-400 text-xs uppercase tracking-[0.3em] mb-2">LOCATIONS</p>
              <p className="text-5xl font-black text-green-500 tracking-wider">{stats.byBorough.length}</p>
              <div className="mt-3 text-[10px] text-gray-600 tracking-widest">
                GEOGRAPHIC ZONES
              </div>
            </div>
          </div>

          {/* Time Span */}
          <div 
            className="bg-black border-2 border-cyan-600 p-6 relative overflow-hidden group hover:border-cyan-400 transition-all cursor-pointer"
            onMouseEnter={() => playTacticalBeep()}
          >
            <div className="absolute inset-0 bg-cyan-950/20" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <Calendar className="h-8 w-8 text-cyan-500" />
                <div className="text-[10px] text-cyan-500 tracking-widest animate-pulse">LIVE</div>
              </div>
              <p className="text-cyan-400 text-xs uppercase tracking-[0.3em] mb-2">TIME SPAN</p>
              <p className="text-5xl font-black text-cyan-500 tracking-wider">{stats.byMonth.length}<span className="text-2xl">mo</span></p>
              <div className="mt-3 text-[10px] text-gray-600 tracking-widest">
                TEMPORAL COVERAGE
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Events by Category - Pie Chart */}
          <div 
            className="bg-black border-2 border-red-600 p-6 relative overflow-hidden cursor-pointer"
            onMouseEnter={() => playDataSound()}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 to-transparent" />
            <div className="absolute -top-10 -right-10 text-red-600 text-[120px] font-black opacity-5 rotate-[-15deg]">
              CLASSIFIED
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-red-500 uppercase tracking-[0.3em]">
                  INCIDENT DISTRIBUTION
                </h2>
                <div className="flex items-center gap-2 text-[10px] text-red-500">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="tracking-widest">ANALYZING</span>
                </div>
              </div>
              <div className="border border-red-900/50 bg-black/50 p-4">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.byCategory}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(entry) => `${entry.name.toUpperCase()}: ${entry.count}`}
                      labelLine={{ stroke: '#ef4444', strokeWidth: 1 }}
                    >
                      {stats.byCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={categoryColors[index]} stroke="#000" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#000', 
                        border: '2px solid #ef4444',
                        borderRadius: '0',
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        color: '#22c55e'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-[10px] text-gray-600 tracking-widest text-center">
                THREAT ASSESSMENT BY CATEGORY // CONFIDENCE: 98.7%
              </div>
            </div>
          </div>

          {/* Top Boroughs - Bar Chart */}
          <div 
            className="bg-black border-2 border-yellow-600 p-6 relative overflow-hidden cursor-pointer"
            onMouseEnter={() => playDataSound()}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-950/20 to-transparent" />
            <div className="absolute -top-10 -right-10 text-yellow-600 text-[120px] font-black opacity-5 rotate-[-15deg]">
              RESTRICTED
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-yellow-500 uppercase tracking-[0.3em]">
                  HOT ZONES
                </h2>
                <div className="flex items-center gap-2 text-[10px] text-yellow-500">
                  <AlertTriangle className="h-3 w-3 animate-pulse" />
                  <span className="tracking-widest">HIGH PRIORITY</span>
                </div>
              </div>
              <div className="border border-yellow-900/50 bg-black/50 p-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.byBorough}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#422006" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#eab308"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      fontSize={10}
                      fontFamily="monospace"
                    />
                    <YAxis stroke="#eab308" fontFamily="monospace" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#000', 
                        border: '2px solid #eab308',
                        borderRadius: '0',
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        color: '#22c55e'
                      }}
                    />
                    <Bar dataKey="count" fill="#eab308" stroke="#000" strokeWidth={1} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-[10px] text-gray-600 tracking-widest text-center">
                GEOGRAPHIC THREAT DENSITY // TOP 10 ZONES
              </div>
            </div>
          </div>

          {/* Events Over Time - Line Chart */}
          <div 
            className="bg-black border-2 border-green-600 p-6 relative overflow-hidden lg:col-span-2 cursor-pointer"
            onMouseEnter={() => playDataSound()}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-950/20 to-transparent" />
            <div className="absolute -top-10 -right-10 text-green-600 text-[120px] font-black opacity-5 rotate-[-15deg]">
              SECRET
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-green-500 uppercase tracking-[0.3em]">
                  TEMPORAL ANALYSIS
                </h2>
                <div className="flex items-center gap-2 text-[10px] text-green-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="tracking-widest">REAL-TIME MONITORING</span>
                </div>
              </div>
              <div className="border border-green-900/50 bg-black/50 p-4">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.byMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#14532d" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#22c55e"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontFamily="monospace"
                      fontSize={10}
                    />
                    <YAxis stroke="#22c55e" fontFamily="monospace" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#000', 
                        border: '2px solid #22c55e',
                        borderRadius: '0',
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        color: '#22c55e'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ 
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        color: '#22c55e'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#22c55e" 
                      strokeWidth={3}
                      dot={{ fill: '#22c55e', r: 5, strokeWidth: 2, stroke: '#000' }}
                      activeDot={{ r: 8, strokeWidth: 2, stroke: '#000' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-[10px] text-gray-600 tracking-widest text-center">
                CHRONOLOGICAL INCIDENT FREQUENCY // PREDICTIVE MODEL: ACTIVE
              </div>
            </div>
          </div>
        </div>

        {/* Bottom security footer */}
        <div 
          className="mt-8 border-t-2 border-red-600 pt-6 text-center cursor-pointer"
          onMouseEnter={() => playAlertTone()}
        >
          <div className="flex items-center justify-center gap-8 text-[10px] text-gray-600 tracking-widest">
            <span>DOCUMENT ID: INTEL-STAT-{Date.now().toString().slice(-8)}</span>
            <span>|</span>
            <span>GENERATED: {new Date().toISOString()}</span>
            <span>|</span>
            <span>AUTHORITY: GCHQ/NSA/JOINT-OPS</span>
          </div>
          <div className="mt-4 text-red-500 text-xs tracking-[0.3em] animate-pulse">
            ⚠ UNAUTHORIZED ACCESS WILL BE PROSECUTED ⚠
          </div>
        </div>
      </div>

      <style>{`
        @keyframes grid-scroll {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        .animate-grid-scroll {
          animation: grid-scroll 20s linear infinite;
        }

        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        .shadow-vignette {
          box-shadow: inset 0 0 200px rgba(0, 0, 0, 0.9);
        }

        .bg-film-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--tw-gradient-stops));
        }

        .glitch-text {
          position: relative;
          animation: glitch-skew 1s infinite;
        }

        .glitch-active .glitch-text::before,
        .glitch-active .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          left: 0;
        }

        .glitch-active .glitch-text::before {
          animation: glitch-anim 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
          color: #0ff;
          z-index: -1;
        }

        .glitch-active .glitch-text::after {
          animation: glitch-anim2 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both infinite;
          color: #f0f;
          z-index: -2;
        }

        @keyframes glitch-anim {
          0% { clip-path: inset(40% 0 61% 0); transform: translate(0); }
          20% { clip-path: inset(92% 0 1% 0); transform: translate(-2px, 2px); }
          40% { clip-path: inset(43% 0 1% 0); transform: translate(-2px, -2px); }
          60% { clip-path: inset(25% 0 58% 0); transform: translate(2px, 2px); }
          80% { clip-path: inset(54% 0 7% 0); transform: translate(2px, -2px); }
          100% { clip-path: inset(58% 0 43% 0); transform: translate(0); }
        }

        @keyframes glitch-anim2 {
          0% { clip-path: inset(65% 0 15% 0); transform: translate(0); }
          20% { clip-path: inset(60% 0 15% 0); transform: translate(2px, -2px); }
          40% { clip-path: inset(10% 0 85% 0); transform: translate(2px, 2px); }
          60% { clip-path: inset(85% 0 5% 0); transform: translate(-2px, -2px); }
          80% { clip-path: inset(40% 0 43% 0); transform: translate(-2px, 2px); }
          100% { clip-path: inset(25% 0 15% 0); transform: translate(0); }
        }

        @keyframes glitch-skew {
          0% { transform: skew(0deg); }
          10% { transform: skew(0deg); }
          11% { transform: skew(2deg); }
          12% { transform: skew(0deg); }
          100% { transform: skew(0deg); }
        }

        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
      `}</style>
    </div>
  );
}
