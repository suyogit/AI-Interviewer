"use client";
import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export function Timer({ initialTime = 45 * 60, onTimeEnd, isRunning }) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval;
    
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            clearInterval(interval);
            onTimeEnd && onTimeEnd();
          }
          return newTime;
        });
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, onTimeEnd]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (elapsedTime / initialTime) * 100;

  return (
    <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg p-2 shadow">
      <Clock size={18} className="text-gray-600 dark:text-gray-300" />
      <div className="flex-1">
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300 mb-1">
          <span>Time remaining: {formatTime(timeRemaining)}</span>
          <span>Elapsed: {formatTime(elapsedTime)}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
} 