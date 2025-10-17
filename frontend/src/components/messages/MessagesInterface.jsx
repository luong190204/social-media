import React, { useEffect, useState } from 'react'
import { ChatSidebar } from './ChatSidebar';
import ChatHeader from './ChatHeader';
import ChatContainer from './ChatContainer';
import ChatInput from './ChatInput';
import NoChatSelected from './NoChatSelected';
import { useChatStore } from '@/store/useChatStore';
import { connectSocket, disconnectSocket } from '@/lib/socket';

const MessagesInterface = () => {

  const {
    conversations,
    messages,
    selectConversation,
    fetchConversations,
    fetchMessages,
    markConversationAsRead,
  } = useChatStore(); 
    
    useEffect(() => {
      fetchConversations();
    }, [fetchConversations]);

  const handleUserSelect = async (conv) => {
    // Update đã đọc nếu có unReadCount
    if (conv.unReadCount > 0) {
      markConversationAsRead(conv.id);
    }

    await fetchMessages(conv);

    // Ngắt kết nối WebSocket cũ (nếu có)
    disconnectSocket();

    // Kết nối WebSocket mới
    connectSocket(conv.id, (newMessage) => {
      useChatStore.setState((state) => ({
        messages: [...state.messages, newMessage],
      }));
    });
  };

  useEffect(() => {
    return () => {
      disconnectSocket();
    }
  }, []);

  return (
    <div className="flex h-[calc(100vh-64px)] mt-16 bg-white">
      {/* Component 1: ChatSidebar */}
      <ChatSidebar
        partner={conversations}
        selectedUser={selectConversation}
        onUserSelect={handleUserSelect}
      />

      {/* Chat Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {selectConversation ? (
          <>
            <ChatHeader
              user={{
                name: selectConversation.partnerName,
                avatar:
                  selectConversation.partnerAvatar || "/assets/avatar.jpg",
              }}
            />

            <div className="flex-1 overflow-y-auto">
              <ChatContainer messages={messages} />
            </div>

            <ChatInput selectConversation={selectConversation} />
          </>
        ) : (
          <NoChatSelected />
        )}
      </div>
    </div>
  );
}

export default MessagesInterface
