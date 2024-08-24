"use client";

import React, { useEffect, useState } from "react";

const DateTimeDisplay: React.FC = React.memo(() => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const formattedWeekday = currentTime.toLocaleDateString("en-US", {
    weekday: "short",
  });
  const formattedDate = currentTime.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <>
      <div className="text-[13.2px] text-black-200">
        {formattedWeekday} {formattedDate}
      </div>
      <div className="text-[13.2px] text-black-600">{formattedTime}</div>
    </>
  );
});

DateTimeDisplay.displayName = "DateTimeDisplay";

export default DateTimeDisplay;
