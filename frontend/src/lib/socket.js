window.global ||= window;
import SockJS from "sockjs-client/dist/sockjs";
import { over } from "stompjs";

let stompClient = null;

export const connectSocket = (userId, onMessageReceived) => {
  const token = localStorage.getItem("token");
  const socket = new SockJS(`http://localhost:8085/ws?token=${token}`);
  stompClient = over(socket);

  stompClient.connect({}, () => {
    console.log("Connect to WebSocket");

    // Subscribe đúng phòng
    stompClient.subscribe(`/topic/user/${userId}`, (msg) => {
      const newMessage = JSON.parse(msg.body);
      onMessageReceived(newMessage);
    });
  });

  stompClient.onclose = () => {
    console.warn("Message socket disconnected");
  };
};

export const disconnectSocket = () => {
  if (stompClient && stompClient.connected) {
    stompClient.disconnect();
    stompClient = null;
  }
};
