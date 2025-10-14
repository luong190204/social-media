import SockJS from "sockjs-client";
import { over } from "stompjs";

let stompNotificationClient = null;
let isConnected = false;

export const connectNotificationSocket = (onNotificationReceived) => {
  if (isConnected) {
    console.log("Notification WebSocket already connected");
    return;
  }

  const token = localStorage.getItem("token");
  const socket = new SockJS(`http://localhost:8085/ws?token=${token}`);
  stompNotificationClient = over(socket);

  stompNotificationClient.connect(
    {},
    () => {
      isConnected = true;
      console.log("Connected to Notification WebSocket");

      stompNotificationClient.subscribe("/user/queue/notifications", (msg) => {
        const notification = JSON.parse(msg.body);
        console.log("New notification:", notification);
        onNotificationReceived(notification);
      });
    },
    (error) => {
      console.error("Notification socket error:", error);
      isConnected = false;
    }
  );
};

export const disconnectNotificationSocket = () => {
  if (stompNotificationClient && isConnected) {
    stompNotificationClient.disconnect(() => {
      console.log("Disconnected Notification WebSocket");
      isConnected = false;
    });
  } else {
    console.log("Tried to disconnect before connection was ready");
  }
};
