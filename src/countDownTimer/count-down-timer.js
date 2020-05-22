import React, { useEffect, useState } from "react";

export default function CountdownTimer({timeUpAt}) {
    const calculateTimeLeft = () => {
      const difference = +timeUpAt - +new Date();
      let timeLeft = {};
  
      if (difference > 0) {
        timeLeft = {
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.ceil((difference / 1000) % 60)
        };
      } 
  
      return timeLeft;
    };
  
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  
    useEffect(() => {
      setTimeout(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
    });
  
    const timerComponents = [];
  
    Object.keys(timeLeft).forEach(interval => {
      if (!timeLeft[interval]) {
        return;
      }
  
      timerComponents.push(
        <span key={interval}>
          {timeLeft[interval]} {interval}{" "}
        </span>
      );
    });
  
    return (
      <div>
        <h4>Time Left:</h4>
        {timerComponents.length ? timerComponents : <span>Time's up!</span>}
      </div>
    );
  }

