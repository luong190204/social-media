window.global ||= window;
import SockJS from "sockjs-client/dist/sockjs";
import { over } from "stompjs";

let stompClient = null;

export const connectSocket = (conversationId, onMessageReceived) => {
  const token = localStorage.getItem("token");
  const socket = new SockJS(`http://localhost:8085/ws?token=${token}`);
  stompClient = over(socket);
  stompClient.connect({}, () => {
    console.log("Connect to WebSocket");

    // Subscribe đúng phòng
    stompClient.subscribe(`/topic/conversation/${conversationId}`, (msg) => {
      onMessageReceived(JSON.parse(msg.body));
    });
  });
};

export const disconnectSocket = () => {
  if (stompClient) stompClient.disconnect();
};
