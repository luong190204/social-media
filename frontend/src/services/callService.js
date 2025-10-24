export const sendCallSignal = (stompClient, payload) => {
  if (!stompClient || !stompClient.connected) return;
  stompClient.send("/app/call.send", {}, JSON.stringify(payload));
};
