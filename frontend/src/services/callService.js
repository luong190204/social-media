import axios from "axios"

export const callApi = {

  // Lấy lịch sử cuộc gọi
  getCallHistory: async (page = 0, size = 20) => {
    return axios.get(`/calls/history?page=${page}&size=${size}`);
  },

  // Lấy chi tiết cuộc gọi
  getCallDetail: async (callId) => {
    return axios.get(`/calls/${callId}`);
  },

  // Đếm số cuộc gọi nhỡ
  getMissedCallCount: async () => {
    return axios.get(`/calls/missed/count`);
  },
}