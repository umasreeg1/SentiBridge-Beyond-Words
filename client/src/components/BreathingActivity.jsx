import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Heart, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export default function BreathingActivity() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('Ready'); // Ready, Inhale, Hold, Exhale, Rest
  const [seconds, setSeconds] = useState(0);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [beforeRating, setBeforeRating] = useState(5);
  const [afterRating, setAfterRating] = useState(5);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((sec) => {
          const nextSec = sec + 1;
          const cycleTime = nextSec % 16; // 4s inhale, 4s hold, 4s exhale, 4s hold
          
          if (cycleTime < 4) {
            setPhase('Inhale slowly...');
          } else if (cycleTime < 8) {
            setPhase('Hold gently...');
          } else if (cycleTime < 12) {
            setPhase('Exhale slowly...');
          } else {
            setPhase('Rest...');
          }

          if (cycleTime === 0 && nextSec > 0) {
            setCyclesCompleted((c) => c + 1);
          }

          return nextSec;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const handleStart = () => {
    setIsActive(true);
    setIsFinished(false);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setSeconds(0);
    setCyclesCompleted(0);
    setPhase('Ready');
    setIsFinished(false);
  };

  const handleFinish = () => {
    setIsActive(false);
    setIsFinished(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      <div className="bg-white rounded-2xl border border-clinical-200 p-6 shadow-sm text-center space-y-6">
        
        <div>
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <h1 className="text-xl font-bold text-clinical-900">Guided Box Breathing & Grounding</h1>
          </div>
          <p className="text-xs text-clinical-500 mt-1">
            Optional 4-4-4-4 paced breathing exercise to help settle your nervous system before or after a session.
          </p>
        </div>

        {/* Animated Circle Container */}
        <div className="relative w-64 h-64 mx-auto flex items-center justify-center my-6">
          {/* Pulsing Outer Glow */}
          <div
            className={`absolute inset-0 rounded-full transition-all duration-1000 ${
              isActive ? 'animate-breathe' : 'bg-teal-100/50 scale-100'
            }`}
          />

          {/* Inner Circle displaying prompt */}
          <div className="relative z-10 w-48 h-48 rounded-full bg-clinical-900 text-white flex flex-col items-center justify-center shadow-lg border-4 border-teal-400 p-4 space-y-1">
            <span className="text-2xl font-extrabold text-teal-300">
              {seconds > 0 ? `${seconds}s` : 'Start'}
            </span>
            <span className="text-sm font-semibold tracking-wide text-white">
              {phase}
            </span>
            {cyclesCompleted > 0 && (
              <span className="text-[10px] bg-teal-800 text-teal-200 px-2.5 py-0.5 rounded-full font-medium">
                {cyclesCompleted} Cycles Done
              </span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-3 pt-2">
          {!isActive ? (
            <button
              onClick={handleStart}
              className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-md"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{seconds > 0 ? 'Resume Breathing' : 'Start Breathing'}</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-md"
            >
              <Pause className="w-4 h-4 fill-white" />
              <span>Pause</span>
            </button>
          )}

          <button
            onClick={handleReset}
            className="flex items-center space-x-1.5 bg-clinical-100 hover:bg-clinical-200 text-clinical-700 font-semibold text-xs py-3 px-4 rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>

          {seconds > 10 && (
            <button
              onClick={handleFinish}
              className="flex items-center space-x-1.5 bg-clinical-900 hover:bg-clinical-800 text-white font-semibold text-xs py-3 px-4 rounded-xl transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Finish & Reflect</span>
            </button>
          )}
        </div>

        {/* Voluntary Self-Reported Before & After Reflection */}
        <div className="bg-clinical-50 border border-clinical-200 rounded-2xl p-5 text-left space-y-4">
          <div className="flex items-center justify-between border-b border-clinical-200 pb-2">
            <h3 className="font-bold text-xs text-clinical-900 uppercase tracking-wider">
              Voluntary Self-Reported Check-In
            </h3>
            <span className="text-[10px] text-clinical-500 italic">Self-evaluation only (No diagnostic scoring)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-clinical-800 block">
                Felt level of body tension BEFORE: ({beforeRating}/10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={beforeRating}
                onChange={(e) => setBeforeRating(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-clinical-800 block">
                Felt level of body tension AFTER: ({afterRating}/10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={afterRating}
                onChange={(e) => setAfterRating(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>
          </div>

          {isFinished && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl p-3 text-xs font-medium flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Great job taking a moment for yourself! Participation recorded for your session check-in.</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
