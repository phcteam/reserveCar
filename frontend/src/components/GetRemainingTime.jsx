import { useState, useEffect } from "react";

function GetRemainingTime({ startTime }) {
  const [remainingTime, setRemainingTime] = useState("");

  useEffect(() => {
    const calculateRemainingTime = () => {
      const now = new Date();
      const start = new Date(startTime);
      const difference = start - now;

      if (difference <= 0) {
        setRemainingTime("หมดเวลา");
        clearInterval(timer);
        return;
      }

      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setRemainingTime(
        `เหลือเวลา ${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`
      );
    };

    calculateRemainingTime(); // Initial calculation
    const timer = setInterval(calculateRemainingTime, 1000);

    return () => clearInterval(timer); // Clean up on unmount
  }, [startTime]);

  return <span>{remainingTime}</span>;
}

export default GetRemainingTime;
