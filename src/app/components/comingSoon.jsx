import React, { useState, useEffect } from 'react';

const ComingSoonPage = () => {
  const [daysLeft, setDaysLeft] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setDaysLeft((prevDays) => (prevDays > 0 ? prevDays - 1 : 0));
    }, 86400000); // 24 hours in milliseconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-8 animate-pulse">
          Coming Soon
        </h1>
      </div>
    </div>
  );
};

export default ComingSoonPage;