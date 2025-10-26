// src/components/CallHistory/CallHistoryList.jsx
import React, { useState, useEffect } from "react";
import {
  Phone,
  Video,
  PhoneIncoming,
  PhoneMissed,
  PhoneOutgoing,
} from "lucide-react";
import { callApi } from "../../services/api";

const CallHistoryItem = ({ call }) => {
  const isIncoming = call.isIncoming;
  const isMissed = call.status === "MISSED";
  const isRejected = call.status === "REJECTED";

  const getCallIcon = () => {
    if (call.type === "VIDEO") {
      return <Video className="w-5 h-5" />;
    }

    if (isMissed) {
      return <PhoneMissed className="w-5 h-5 text-red-500" />;
    }

    if (isIncoming) {
      return <PhoneIncoming className="w-5 h-5 text-green-500" />;
    }

    return <PhoneOutgoing className="w-5 h-5 text-blue-500" />;
  };

  const getCallStatus = () => {
    if (isMissed) return "Missed";
    if (isRejected) return "Rejected";
    if (call.durationSeconds > 0) {
      return formatDuration(call.durationSeconds);
    }
    return "No answer";
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const otherUserName = isIncoming ? call.callerName : call.calleeName;
  const otherUserAvatar = isIncoming ? call.callerAvatar : call.calleeAvatar;

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer rounded-lg">
      <div className="flex items-center flex-1">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 overflow-hidden">
          {otherUserAvatar ? (
            <img
              src={otherUserAvatar}
              alt={otherUserName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-600 font-medium">
              {otherUserName?.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Call Info */}
        <div className="flex-1">
          <div className="flex items-center">
            <span
              className={`font-medium ${
                isMissed ? "text-red-600" : "text-gray-900"
              }`}
            >
              {otherUserName}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            {getCallIcon()}
            <span className="ml-1">{getCallStatus()}</span>
          </div>
        </div>

        {/* Date */}
        <div className="text-xs text-gray-400">
          {formatDate(call.createdAt)}
        </div>
      </div>
    </div>
  );
};

const CallHistoryList = () => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadCallHistory();
  }, []);

  const loadCallHistory = async () => {
    try {
      setLoading(true);
      const response = await callApi.getCallHistory(page, 20);

      if (response.data.content.length === 0) {
        setHasMore(false);
      } else {
        setCalls((prev) => [...prev, ...response.data.content]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error loading call history:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Call History</h2>
      </div>

      <div className="divide-y">
        {calls.map((call) => (
          <CallHistoryItem key={call.callId} call={call} />
        ))}
      </div>

      {loading && (
        <div className="p-4 text-center text-gray-500">Loading...</div>
      )}

      {!loading && calls.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <Phone className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No call history yet</p>
        </div>
      )}

      {!loading && hasMore && calls.length > 0 && (
        <button
          onClick={loadCallHistory}
          className="w-full p-3 text-blue-600 hover:bg-blue-50 transition-colors"
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default CallHistoryList;
