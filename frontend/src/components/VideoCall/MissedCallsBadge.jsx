// src/components/MissedCallsBadge.jsx
import React, { useState, useEffect } from "react";
import { PhoneMissed } from "lucide-react";
import { callApi } from "../../services/callService";

export const MissedCallsBadge = () => {
  const [missedCount, setMissedCount] = useState(0);

  useEffect(() => {
    loadMissedCallsCount();

    // Poll every 30 seconds
    const interval = setInterval(loadMissedCallsCount, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadMissedCallsCount = async () => {
    try {
      const response = await callApi.getMissedCallCount();
      setMissedCount(response.data.count);
    } catch (error) {
      console.error("Error loading missed calls count:", error);
    }
  };

  if (missedCount === 0) return null;

  return (
    <div className="relative inline-block">
      <PhoneMissed className="w-5 h-5 text-red-500" />
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
        {missedCount > 9 ? "9+" : missedCount}
      </span>
    </div>
  );
};
