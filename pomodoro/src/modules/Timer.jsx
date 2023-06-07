import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Timer = () => {
  const [workTime, setWorkTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);
  const [cycles, setCycles] = useState(4);
  const [seconds, setSeconds] = useState(workTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [completedCycles, setCompletedCycles] = useState(0);

  useEffect(() => {
    let interval = null;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      clearInterval(interval);
      handleCompleteCycle();
      handleToggleTimer();
    }

    return () => {
      clearInterval(interval);
    };
  }, [isActive, seconds]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setSeconds(workTime * 60);
    setIsActive(false);
    setCompletedCycles(0);
  };

  const handleCompleteCycle = () => {
    setCompletedCycles(cycles => cycles + 1);
  };

  const handleToggleTimer = () => {
    if (completedCycles > 0 && completedCycles % cycles === 0) {
      setSeconds(longBreakTime * 60);
    } else {
      setSeconds(breakTime * 60);
    }
  };

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleWorkTimeChange = e => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setWorkTime(value);
      if (!isActive) {
        setSeconds(value * 60);
      }
    }
  };

  const handleBreakTimeChange = e => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setBreakTime(value);
      if (!isActive && completedCycles % cycles !== 0) {
        setSeconds(value * 60);
      }
    }
  };

  const handleLongBreakTimeChange = e => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setLongBreakTime(value);
      if (!isActive && completedCycles % cycles === 0) {
        setSeconds(value * 60);
      }
    }
  };

  const handleCyclesChange = e => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setCycles(value);
    }
  };

  return (
    <div className="container">
      <h1>Pomodoro Timer</h1>
      <h2>{formatTime(seconds)}</h2>
      <Form>
        <Form.Group controlId="workTime">
          <Form.Label>Work Time (minutes): {workTime}</Form.Label>
          <Form.Control
            type="range"
            min={1}
            max={60}
            value={workTime}
            onChange={handleWorkTimeChange}
          />
        </Form.Group>

        <Form.Group controlId="breakTime">
          <Form.Label>Break Time (minutes): {breakTime}</Form.Label>
          <Form.Control
            type="range"
            min={1}
            max={60}
            value={breakTime}
            onChange={handleBreakTimeChange}
          />
        </Form.Group>

        <Form.Group controlId="longBreakTime">
          <Form.Label>Long Break Time (minutes): {longBreakTime}</Form.Label>
          <Form.Control
            type="range"
            min={1}
            max={60}
            value={longBreakTime}
            onChange={handleLongBreakTimeChange}
          />
        </Form.Group>

        <Form.Group controlId="cycles">
          <Form.Label>Cycles: {cycles}</Form.Label>
          <Form.Control
            type="range"
            min={1}
            max={10}
            value={cycles}
            onChange={handleCyclesChange}
          />
        </Form.Group>

        <Button onClick={handleStart}>Start</Button>
        <Button onClick={handlePause}>Pause</Button>
        <Button onClick={handleReset}>Reset</Button>

        <p>Completed Cycles: {completedCycles}</p>
      </Form>
    </div>
  );
};

export default Timer;
