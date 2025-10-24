import React from "react";
import { Phone } from "lucide-react";
import { useCall } from "../../context/CallContext";

const CallButton = ({ toUserId }) => {
  const { startCall } = useCall();

  return (
    <button
      onClick={() => startCall(toUserId)}
      className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
      title="Gọi video"
    >
      <Phone size={18} />
    </button>
  );
};

export default CallButton;
