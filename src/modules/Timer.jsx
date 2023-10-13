import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../styles/Timer.css';

const Timer = () => {
  const [workTime, setWorkTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);
  const [cycles, setCycles] = useState(4);
  const [seconds, setSeconds] = useState(workTime * 60);

  const [timers, setTimers] = useState({
    work: {
      time: workTime * 60,
      isActive: false,
    },
    break: {
      time: breakTime * 60,
      isActive: false,
    },
    longBreak: {
      time: longBreakTime * 60,
      isActive: false,
    },
  });

  const [completedCycles, setCompletedCycles] = useState(0);

  useEffect(() => {
    let interval = null;
    if (timers.work.isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1);
      }, 1000);
      console.log(seconds);
    } else if (seconds === 0) {
      clearInterval(interval);
      handleCompleteCycle();
      handleToggleTimer();
    }

    return () => {
      clearInterval(interval);
    };
  }, [timers.work.isActive, seconds]);

  const handleStart = (timerKey) => {
    setTimers((prevTimers) => ({
      ...prevTimers,
      [timerKey]: { ...prevTimers[timerKey], isActive: true },
    }));
  };

  const handlePause = (timerKey) => {
    setTimers((prevTimers) => ({
      ...prevTimers,
      [timerKey]: { ...prevTimers[timerKey], isActive: false },
    }));
  };
  
  const handleReset = (timerKey) => {
    setTimers((prevTimers) => ({
      ...prevTimers,
      [timerKey]: {
        ...prevTimers[timerKey],
        isActive: false,
        time: timers[timerKey].time,
      },
    }));
  };

  const handleCompleteCycle = () => {
    setCompletedCycles(cycles => cycles + 1);
  };

  const handleToggleTimer = () => {
    // ポモドーロサイクルが指定した回数終了した場合
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
      if (!timers.work.isActive) {
        setSeconds(value * 60);
      }
    }
  };

  const handleBreakTimeChange = e => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setBreakTime(value);
      if (!timers.work.isActive && completedCycles % cycles !== 0) {
        setSeconds(value * 60);
      }
    }
  };

  const handleLongBreakTimeChange = e => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setLongBreakTime(value);
      if (!timers.work.isActive && completedCycles % cycles === 0) {
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
      <header>
        <h1>ポモドーロタイマー</h1>
      </header>
      <Row>
        <Col>
          <Row className='show-hours'>
            <Col>
              <div>Work Time</div>
              <h1 className={timers.work.isActive && seconds <= (workTime * 60 * 0.2) ? 'red' : ''}>
                {timers.work.isActive ? formatTime(seconds) : formatTime(workTime * 60)}</h1>
            </Col>
            <Col>
              <div>Break Time</div>
              <h1 className={timers.break.isActive && seconds <= (breakTime * 60 * 0.2) ? 'red' : ''}>
                {timers.break.isActive ? formatTime(seconds) : formatTime(breakTime * 60)}</h1>
            </Col>
            <Col>
              <div>Long Break Time</div>
              <h1 className={timers.longBreak.isActive && seconds <= (longBreakTime * 60 * 0.2) ? 'red' : ''}>
                {timers.longBreak.isActive ? formatTime(seconds) : formatTime(longBreakTime * 60)}</h1>
            </Col>
          </Row>
          <Row className='show-cycles'>
            <Col>
              <div>Pomodoro Cycles</div>
              <h1>{cycles}</h1>
            </Col>
            <Col>
              <div>Completed Cycles</div>
              <h1>{completedCycles}</h1>
            </Col>
          </Row>
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
          <Form>
            <div className='time-controller'>
              <Form.Group controlId="workTime">
                <Form.Label>Work Time (minutes)</Form.Label>
                <Form.Control
                  type="range"
                  min={1}
                  max={60}
                  value={workTime}
                  onChange={handleWorkTimeChange}
                />
              </Form.Group>

              <Form.Group controlId="breakTime">
                <Form.Label>Break Time (minutes)</Form.Label>
                <Form.Control
                  type="range"
                  min={1}
                  max={60}
                  value={breakTime}
                  onChange={handleBreakTimeChange}
                />
              </Form.Group>

              <Form.Group controlId="longBreakTime">
                <Form.Label>Long Break Time (minutes)</Form.Label>
                <Form.Control
                  type="range"
                  min={1}
                  max={60}
                  value={longBreakTime}
                  onChange={handleLongBreakTimeChange}
                />
              </Form.Group>

              <Form.Group controlId="cycles">
                <Form.Label>Cycles</Form.Label>
                <Form.Control
                  type="range"
                  min={1}
                  max={10}
                  value={cycles}
                  onChange={handleCyclesChange}
                />
              </Form.Group>

            </div>

            <br />
            <div className="button-container d-flex justify-content-between gap-3">
              <Button onClick={() => handleStart('work')} style={{width: '300px'}} className='start-button'>Start</Button>
              <Button onClick={() => handlePause('work')} style={{width: '300px'}} className='pause-button'>Pause</Button>
              <Button onClick={() => handleReset('work')} style={{width: '300px'}} className='reset-button'>Reset</Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Timer;
