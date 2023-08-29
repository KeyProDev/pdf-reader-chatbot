import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/solid';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import ChatForm from './ChatForm';
import MessageList from './MessageList';
import { useKeys } from '@/hooks';
import Context from '@/context/context';
import { ConversationMessage } from '@/types/ConversationMessage';
import { useChats } from '@/hooks';

const Chatbot: React.FC = () => {
    const [showChat, setShowChat] = useState(false);
    const [query, setQuery] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
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

    const { fileName, fileType, setFileUri, setFileType, setFile, setFileName } = useContext(Context)

    const { openAIapiKey } = useKeys();
    const { updateConversation } = useChats();

    const scrollRef = useRef();

    const { messages, history } = conversation;

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

        const container = scrollRef.current; // Get a reference to the container
        const maxScrollHeight = container.scrollHeight;

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
                fileType
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
        scrollRef.current?.scrollTo({ top: maxScrollHeight, behavior: "smooth" })
    }

    const handleEnter = (e: any) => {
        if (e.key === 'Enter' && query) {
            handleSubmit(e);
        } else if (e.key == 'Enter') {
            e.preventDefault();
        }
    };

    return (
        <div className="z-1000">
            {showChat && (
                <div
                    className="items-end rounded-xl overflow-auto bg-gray-800 text-white fixed p-3 bottom-20 right-20 z-10"
                    style={{ height: '600px', width: '350px' }}
                >
                    <MessageList
                        messages={messages}
                        loading={loading}
                        scrollRef={scrollRef}
                    />
                    <ChatForm
                        loading={loading}
                        error={error}
                        query={query}
                        setQuery={setQuery}
                        handleSubmit={handleSubmit}
                        handleEnter={handleEnter}
                    />
                </div>
            )}

            <button
                className="rounded-full bg-indigo-600 text-white fixed p-3 bottom-5 right-20 z-10"
                onClick={toggleChat}>
                <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6" />
            </button>
        </div>
    );
};

export default Chatbot;
