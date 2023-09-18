import {
  ChatBubbleOvalLeftEllipsisIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
} from '@heroicons/react/24/solid';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { Document } from 'langchain/document';

import ChatForm from './ChatForm';
import MessageList from './MessageList';
import { useKeys } from '@/hooks';
import Context from '@/context/context';
import { ConversationMessage } from '@/types/ConversationMessage';

const Chatbot: React.FC = () => {
  const [showChat, setShowChat] = useState(false);
  const [query, setQuery] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [conversation, setConversation] = useState<{
    messages: ConversationMessage[];
    pending?: string;
    history: [string, string][];
    pendingSourceDocs?: Document[];
  }>({
    messages: [
      {
        message: 'Hi, what would you like to know about these documents?',
        type: 'apiMessage',
      },
    ],
    history: [],
  });

  const fullscreenHandle = useFullScreenHandle();

  const { fileName, fileType } = useContext(Context);

  useEffect(() => {
    setConversation({
      messages: [
        {
          message: 'Hi, what would you like to know about this document?',
          type: 'apiMessage',
        },
      ],
      history: [],
    });
  }, [fileName]);

  const { openAIapiKey } = useKeys();

  const scrollRef = useRef();

  const { messages, history } = conversation;

  useEffect(() => {
    const handleFullScreenChange = () => {
      const isFullScreen = Boolean(document.fullscreenElement);
      setFullscreen(isFullScreen);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
    document.addEventListener('mozfullscreenchange', handleFullScreenChange);
    document.addEventListener('MSFullscreenChange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener(
        'webkitfullscreenchange',
        handleFullScreenChange,
      );
      document.removeEventListener(
        'mozfullscreenchange',
        handleFullScreenChange,
      );
      document.removeEventListener(
        'MSFullscreenChange',
        handleFullScreenChange,
      );
    };
  }, []);
  const toggleChat = () => {
    setShowChat((prevShowChat) => !prevShowChat);
  };

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError(null);

    if (!query) {
      alert('Please input a question');
      return;
    }
    setConversation((conversation) => ({
      ...conversation,
      messages: [
        ...conversation.messages,
        {
          type: 'userMessage',
          message: question,
        } as ConversationMessage,
      ],
    }));
    const question = query.trim();

    setLoading(true);
    setQuery('');

    if (!openAIapiKey) {
      console.error('API keys not found.');
      return;
    }

    // const type = SidebarList.filetype;
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-OpenAI-Key': openAIapiKey,
      },
      body: JSON.stringify({
        question,
        history: [],
        fileName,
        fileType,
      }),
    });
    const data = await response.json();
    console.log('response>>>', data);
    setConversation((prevConversation) => {
      const updatedConversation = {
        ...prevConversation,
        messages: [
          ...prevConversation.messages,
          {
            type: 'apiMessage',
            message: data.text,
            sourceDocs: data.sourceDocuments
              ? data.sourceDocuments.map(
                  (doc: any) =>
                    new Document({
                      pageContent: doc.pageContent,
                      metadata: { source: doc.metadata.source },
                    }),
                )
              : undefined,
          } as ConversationMessage,
        ],
        history: [
          ...prevConversation.history,
          [question, data.text] as [string, string],
        ],
      };

      // updateConversation(selectedChatId, updatedConversation);
      return updatedConversation;
    });

    setLoading(false);
  }

  const handleEnter = (e: any) => {
    if (e.key === 'Enter' && query) {
      handleSubmit(e);
    } else if (e.key == 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <FullScreen handle={fullscreenHandle}>
      <div className="z-1000">
        {showChat && (
          <div
            className={`items-end rounded-xl overflow-auto bg-gray-800 text-white p-3 ${
              fullscreen ? 'relative' : 'fixed bottom-20 right-20 z-10'
            }`}
            style={{
              height: fullscreen ? '100vh' : '600px',
              width: fullscreen ? '100vw' : '350px',
            }}
          >
            <div
              className="flex justify-end pb-2 mb-2 border-b-2"
              style={{ height: '40px' }}
            >
              {fullscreen ? (
                <ArrowsPointingInIcon
                  className={`w-6 h-6 cursor-pointer`}
                  onClick={() => {
                    setFullscreen(!fullscreen);
                    if (!fullscreen) {
                      fullscreenHandle.enter();
                    } else {
                      fullscreenHandle.exit();
                    }
                  }}
                />
              ) : (
                <ArrowsPointingOutIcon
                  className={`w-6 h-6 cursor-pointer`}
                  onClick={() => {
                    setFullscreen(!fullscreen);
                    if (!fullscreen) {
                      fullscreenHandle.enter();
                    } else {
                      fullscreenHandle.exit();
                    }
                  }}
                />
              )}
            </div>
            <div
              className="w-full"
              style={{
                height: fullscreen ? '80vh' : '470px',
                overflow: 'auto',
              }}
            >
              <MessageList
                messages={messages}
                loading={loading}
                scrollRef={scrollRef}
              />
            </div>
            <div className={`w-full ${fullscreen ? 'absolute bottom-10' : ''}`}>
              <ChatForm
                loading={loading}
                error={error}
                query={query}
                setQuery={setQuery}
                handleSubmit={handleSubmit}
                handleEnter={handleEnter}
              />
            </div>
          </div>
        )}

        {!fullscreen && (
          <button
            className="rounded-full bg-indigo-600 text-white fixed p-3 bottom-5 right-20 z-10"
            onClick={toggleChat}
          >
            <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6" />
          </button>
        )}
      </div>
    </FullScreen>
  );
};

export default Chatbot;
