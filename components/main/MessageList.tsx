import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { LoadingDots } from '@/components/other';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/other/accordion/Accordion';
import remarkGfm from 'remark-gfm';
import { Message } from '@/types';
import fileDialog from 'file-dialog';
import NextNProgress from 'nextjs-progressbar';
import nProgress from 'nprogress';
import ProgressBar from '@ramonak/react-progress-bar';
import ReactLoading from 'react-loading';
import { saveAs } from 'file-saver';
interface MessageListProps {
  messages: Message[];
  loading: boolean;
  scrollRef: any;
}

function MessageList({ messages, loading, scrollRef }: MessageListProps) {
  const [filePath, setFilePath] = useState('');

  const handle_save = async (index_of_message: any) => {
    const blob = new Blob([messages[index_of_message].message], {
      type: 'text/plain;charset=utf-8',
    });

    saveAs(blob);
  };

  useEffect(() => {
    scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight });
  }, []);

  return (
    <div ref={scrollRef}>
      <div>
        {messages.map((message, index) => {
          const isApiMessage = message.type === 'apiMessage';
          const messageClasses = ` ${
            isApiMessage
              ? 'bg-gray-700/50 m-1 rounded-xl'
              : 'bg-indigo-700/50 m-1 rounded-xl'
          }`;

          return (
            <div key={`chatMessage-${index}`} className={messageClasses}>
              <div className="flex items-center justify-start max-w-full sm:max-w-4xl mx-auto overflow-hidden">
                <div className="flex flex-col w-full">
                  <div className="w-full text-gray-300 p-1 sm:p-2 overflow-wrap break-words">
                    <span
                      className={`mt-2 inline-flex items-center rounded-md px-2 py-1 text-xs sm:text-sm font-medium ring-1 ring-inset ${
                        isApiMessage
                          ? 'bg-indigo-400/10 text-indigo-400 ring-indigo-400/30'
                          : 'bg-purple-400/10 text-purple-400 ring-purple-400/30'
                      }`}
                    >
                      {isApiMessage ? 'AI' : 'YOU'}
                    </span>
                    <div className="mx-auto max-w-full flex justify-between">
                      <ReactMarkdown
                        linkTarget="_blank"
                        className="markdown text-xs sm:text-sm md:text-base leading-relaxed"
                        remarkPlugins={[remarkGfm]}
                      >
                        {message.message}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {loading && (
        <div className="flex items-center justify-center h-32 w-full bg-gray-700/50 rounded-xl">
          <div className="flex items-center justify-center max-w-full sm:max-w-4xl overflow-hidden px-2 sm:px-4 w-full">
            <ReactLoading type="balls" color="grey" />
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageList;
