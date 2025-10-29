# Social Media App  
Mini-ứng dụng mạng xã hội fullstack

## Giới thiệu  
Ứng dụng mạng xã hội cho phép người dùng đăng ký, đăng nhập, trao đổi tin nhắn realtime và quản lý hồ sơ cá nhân.  
Mục tiêu: học và triển khai end-to-end từ frontend tới backend, sử dụng ReactJS ở phía client và Spring Boot ở phía server.

## Thời gian thực hiện  
Từ **[08/2025]** đến **[11/2025]**.

## Công nghệ sử dụng  
### Frontend  
- ReactJS ( Zustand, React Router, Axios)  
- Tailwind CSS
- WebSocket client (cho realtime chat)  
- HTML5, CSS3, JavaScript (ES6+)

### Backend  
- Spring Boot (REST API, WebSocket, Spring Security, JWT Authentication)  
- Java 11 
- MongoDB
- WebSocket server để xử lý realtime chat  
- Maven (hoặc Gradle nếu mày dùng)  
- GitHub + Git

## Tính năng chính  
- Đăng ký & đăng nhập người dùng, xác thực bằng JWT.  
- Quản lý hồ sơ cá nhân: cập nhật tên, ảnh đại diện, thông tin cá nhân.  
- Nhắn tin realtime giữa người dùng thông qua WebSocket.  
- Hiển thị thông báo khi có tin nhắn mới.  
- (Đang phát triển) Gọi video bằng WebRTC – tính năng mở rộng trong tương lai.

## Vai trò của tôi  
Phát triển toàn bộ ứng dụng trong vai trò Fullstack Developer:  
- Thiết kế cơ sở dữ liệu và kiến trúc backend.  
- Xây dựng API REST và WebSocket server.  
- Thiết kế giao diện người dùng, tích hợp frontend với backend.  
- Viết test /Debug, triển khai môi trường dev.

## Cấu trúc thư mục  
```
├── backend/           # Mã nguồn server
│   ├── src/
│   └── pom.xml
└── frontend/          # Mã nguồn client
    ├── src/
    └── package.json
```
## Cách chạy dự án local  
1. Clone repository:  
   ```bash
   git clone https://github.com/luong190204/social-media.git
   cd social-media
   ```  
2. Chạy backend:  
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```  
3. Chạy frontend:  
   ```bash
   cd frontend
   npm install
   npm start
   ```  
4. Mở trình duyệt và truy cập: `http://localhost:5173` (frontend) và mặc định backend `http://localhost:8085`.

## 📈 Hướng phát triển tương lai  
- Thêm tính năng video call / voice call bằng WebRTC.  
- Triển khai bản production hoàn chỉnh với CI/CD.  
- Nâng cao bảo mật và hiệu năng cho lượng người dùng lớn.  
- Mở rộng chức năng nhóm chat, rooms

## 🤝 Liên hệ  
Nếu bạn có câu hỏi hoặc muốn đóng góp, liên hệ với tôi qua: [dinhluong19002004@gmail.com]  
Link dự án: https://github.com/luong190204/social-media