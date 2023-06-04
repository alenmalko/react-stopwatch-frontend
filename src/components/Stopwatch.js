import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Stopwatch.css"; // Import the CSS file

const Stopwatch = () => {
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [savedTimes, setSavedTimes] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    getSavedStopwatchTimesFromDatabase();
  }, []);

  const getSavedStopwatchTimesFromDatabase = async () => {
    try {
      const allStopwatchTimes = await axios.get(
        "http://localhost:3000/api/stopwatch"
      );
      const onlyTimes = allStopwatchTimes.data.map((times) => times.time);
      setSavedTimes(onlyTimes);
    } catch (error) {
      console.error("Error fetching saved times:", error);
    }
  };

  const startStopwatch = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setStopwatchTime((prevTime) => prevTime + 1);
      }, 1);
    }
  };

  const stopStopwatch = () => {
    setIsRunning(false);
    setIsStopped(true);
    clearInterval(intervalRef.current);
  };

  const restartStopwatch = () => {
    console.log("reset");
    setIsStopped(false);
    setStopwatchTime(0);
    clearInterval(intervalRef.current);
  };

  const saveStopwatchTimeToDatabase = async () => {
    const savedTime = {
      time: stopwatchTime,
    };
    try {
      await axios.post(
        "http://localhost:3000/api/stopwatch/saveStopwatchTime",
        savedTime
      );
      getSavedStopwatchTimesFromDatabase();
    } catch (error) {
      console.error("Error saving stopwatch time:", error);
    }
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="stopwatch-container">
      <h1 className="stopwatch-heading">Stopwatch</h1>
      <div className="stopwatch-time">{stopwatchTime} ms</div>
      <div className="stopwatch-buttons">
        {isRunning ? (
          <button
            className="stopwatch-button stopwatch-stop"
            onClick={stopStopwatch}
          >
            Stop
          </button>
        ) : (
          <button
            className="stopwatch-button stopwatch-start"
            onClick={startStopwatch}
          >
            Start
          </button>
        )}
        <button
          className="stopwatch-button stopwatch-save"
          onClick={saveStopwatchTimeToDatabase}
          disabled={isRunning}
        >
          Save
        </button>
        <button
          className="stopwatch-button stopwatch-stop"
          onClick={restartStopwatch}
          disabled={!isStopped}
        >
          Reset
        </button>
      </div>
      <h2 className="saved-times-heading">Saved Times</h2>
      <ul className="saved-times-list">
        {savedTimes.map((savedTime, index) => (
          <li key={index} className="saved-times-item">
            {savedTime} ms or {savedTime / 1000} seconds
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Stopwatch;
