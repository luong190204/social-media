import React, { useEffect, useState } from 'react'
import { ChatSidebar } from './ChatSidebar';
import ChatHeader from './ChatHeader';
import ChatContainer from './ChatContainer';
import ChatInput from './ChatInput';
import NoChatSelected from './NoChatSelected';
import { useChatStore } from '@/store/useChatStore';
import { connectSocket, disconnectSocket } from '@/lib/socket';
import { useNavigate, useParams } from 'react-router-dom';

const MessagesInterface = () => {

  const navigate = useNavigate();
  const { conversationId } = useParams();

  const {
    conversations,
    messages,
    selectConversation,
    fetchConversations,
    fetchMessages,
    markConversationAsRead,
    setSelectConversation,
  } = useChatStore(); 
    
  // Lấy danh sách cuộc trò chuyện khi vào trang 
    useEffect(() => {
      fetchConversations();
    }, [fetchConversations]);
  
  // Nếu có conversationId trên URL → chọn & fetch tin nhắn
  useEffect(() => {
    if ( !conversationId || conversations.length === 0 ) return;
    
    const selected = conversations.find((c) => c.id === conversationId);
    if (selected) {
      setSelectConversation(selected);
      fetchMessages(selected);
    }
  }, [conversationId, conversations])

  const handleUserSelect = async (conv) => {
    // Update đã đọc nếu có unReadCount
    if (conv.unReadCount > 0) {
      markConversationAsRead(conv.id);
    }
    
    navigate(`/messages/${conv.id}`);
  };

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
