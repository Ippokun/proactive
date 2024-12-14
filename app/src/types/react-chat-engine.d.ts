declare module 'react-chat-engine' {
    import React from 'react';
  
    interface ChatEngineProps {
      height: string;
      projectID: string;
      userName: string;
      userSecret: string;
      renderChatList?: (state: any) => React.ReactNode;
      renderChatFeed?: (props: any) => React.ReactNode;
      renderNewMessageForm?: (creds: any, chatId: number) => React.ReactNode;
      onNewMessage?: (chatId: number, message: any) => void;
    }
  
    export const ChatEngine: React.FC<ChatEngineProps>;
  }
  