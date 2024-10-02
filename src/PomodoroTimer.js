import React, { useState, useEffect } from 'react';
import './PomodoroTimer.css';

const PomodoroTimer = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // Ubah menjadi 300 detik (5 menit)
  const [sessionType, setSessionType] = useState('Work');
  const [workDuration, setWorkDuration] = useState(5); // Durasi kerja awal
  const [breakDuration, setBreakDuration] = useState(workDuration / 5); // Durasi istirahat
  const [totalWorkTime, setTotalWorkTime] = useState(0);
  const [totalBreakTime, setTotalBreakTime] = useState(0);
  const [quote, setQuote] = useState('');

  const API_KEY = 'https://api.quotable.io/random';

  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (!isActive && timeLeft !== 0) {
      clearInterval(interval);
    }

    if (timeLeft === 0) {
      clearInterval(interval);
      if (sessionType === 'Work') {
        setTotalWorkTime((prev) => prev + workDuration);
        setTimeLeft(breakDuration * 60); // Durasi istirahat
        fetchQuote();
        setSessionType('Break');
      } else {
        setTotalBreakTime((prev) => prev + breakDuration);
        setTimeLeft(workDuration * 60); // Durasi kerja
        setSessionType('Work');
      }
      setIsActive(false);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, sessionType, workDuration, breakDuration]);

  const handleStart = () => {
    setIsActive(true);
    // Set waktu awal berdasarkan tipe sesi yang dipilih
    setTimeLeft(sessionType === 'Work' ? workDuration * 60 : breakDuration * 60);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(300); // Reset ke 5 menit
    setSessionType('Work');
    setTotalWorkTime(0);
    setTotalBreakTime(0);
  };

  const handleWorkDurationChange = (e) => {
    const duration = parseInt(e.target.value);
    setWorkDuration(duration);
    setBreakDuration(duration / 5); // Durasi istirahat
    if (!isActive) {
      setTimeLeft(duration * 60); // Reset waktu jika timer tidak aktif
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const fetchQuote = async () => {
    try {
      const response = await fetch(API_KEY);
      const data = await response.json();
      setQuote(data.content);
    } catch (error) {
      setQuote('Keep pushing forward!');
    }
  };

  return (
    <div className="container">
      <h1>{sessionType} Timer</h1>
      <h2 className="timer">{formatTime(timeLeft)}</h2>
      <button onClick={handleStart} disabled={isActive}>Start</button>
      <button onClick={handlePause} disabled={!isActive}>Pause</button>
      <button onClick={handleReset}>Reset</button>

      <div className="select-container">
        <label>
          Work Duration (minutes):
          <select value={workDuration} onChange={handleWorkDurationChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={25}>25</option>
            <option value={30}>30</option>
          </select>
        </label>
        <p>Break Duration (minutes): {breakDuration}</p>
      </div>

      <div className="stats">
        <p>Total Work Time: {totalWorkTime} minutes</p>
        <p>Total Break Time: {totalBreakTime} minutes</p>
      </div>
      {quote && <p style={{ marginTop: '20px', fontStyle: 'italic' }}>{quote}</p>}
    </div>
  );
};

export default PomodoroTimer;
