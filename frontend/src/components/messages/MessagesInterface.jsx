import React, { useState } from 'react'
import { ChatSidebar } from './ChatSidebar';
import ChatHeader from './ChatHeader';
import ChatContainer from './ChatContainer';
import ChatInput from './ChatInput';
import NoChatSelected from './NoChatSelected';
import { users, mockMessages } from "./MockData";

const MessagesInterface = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentMessages, setCurrentMessages] = useState([]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    // Load messages for selected user
    setCurrentMessages(user.id === 1 ? mockMessages : []);
  };

  const handleSendMessage = (content) => {
    const newMessage = {
      id: currentMessages.length + 1,
      type: "text",
      content: content,
      sender: "own",
      time: new Date().toLocaleTimeString(),
    };
    setCurrentMessages([...currentMessages, newMessage]);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Component 1: ChatSidebar */}
      <ChatSidebar
        users={users}
        selectedUser={selectedUser}
        onUserSelect={handleUserSelect}
      />

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Component 2: ChatHeader */}
            <ChatHeader user={selectedUser} />

            {/* Component 3: ChatContainer */}
            <ChatContainer messages={currentMessages} />

            {/* Component 4: ChatInput */}
            <ChatInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          /* Component 5: NoChatSelected */
          <NoChatSelected />
        )}
      </div>
    </div>
  );
}

export default MessagesInterface
