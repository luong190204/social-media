import { useOnlineStore } from "@/store/useOnlineStore";
import { useEffect } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";

let stompClient = null;

export function useOnlineUsers (authUser) {
  const { setOnlineUsers } = useOnlineStore();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!authUser) return;

    const socket = new SockJS(`http://localhost:8085/ws?token=${token}`);
    stompClient = over(socket);

    stompClient.connect({}, () => {
      console.log("Websocket connected");

      // Subcribe danh sách user online, Lắng nghe danh sách broadcast chung
      stompClient.subscribe("/topic/onlineUsers", (message) => {
          const users = JSON.parse(message.body);
          setOnlineUsers([...users]);
        });

        // Lắng nghe danh sách riêng gửi ngay khi connect
        stompClient.subscribe("/user/queue/onlineUsers", (message) => {
        const users = JSON.parse(message.body);
        setOnlineUsers([...users]);
        });
    

    }, (error) => {
        console.log("Websocket error: ", error);
        }
    );

    return () => {
      if (stompClient && stompClient.connected) {
        stompClient.disconnect(() => {
            console.log("WebSocket disconnected");
        })
      }
    };
  }, [authUser, setOnlineUsers]);
}
