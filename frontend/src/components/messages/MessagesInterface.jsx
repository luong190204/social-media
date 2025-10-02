import React, { useEffect, useState } from 'react'
import { ChatSidebar } from './ChatSidebar';
import ChatHeader from './ChatHeader';
import ChatContainer from './ChatContainer';
import ChatInput from './ChatInput';
import NoChatSelected from './NoChatSelected';
import { useChatStore } from '@/store/useChatStore';

const MessagesInterface = () => {

  const {
    conversations,
    messages,
    selectConversation,
    fetchConversations,
    fetchMessages,
  } = useChatStore(); 
    
    useEffect(() => {
      fetchConversations();
    }, [fetchConversations]);

  const handleUserSelect = (conv) => {
    fetchMessages(conv);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Component 1: ChatSidebar */}
      <ChatSidebar
        users={conversations}
        selectedUser={selectConversation}
        onUserSelect={handleUserSelect}
      />

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectConversation ? (
          <>
            <ChatHeader
              user={{
                name: selectConversation.partnerName,
                avatar:
                  selectConversation.partnerAvatar || "/assets/avatar.jpg",
              }}
            />

            <ChatContainer messages={messages} />

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
