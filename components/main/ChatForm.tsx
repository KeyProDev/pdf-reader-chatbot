import React, { useCallback, useEffect, useRef } from 'react';
import {
  ExclamationCircleIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/solid';
import fs from 'fs';
import NProgress from 'nprogress';
import NextNProgress from 'nextjs-progressbar';

type ChatFormProps = {
  loading: boolean;
  error: string | null;
  query: string;
  handleEnter: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  setQuery: (query: string) => void;
};

const ChatForm = ({
  loading,
  error,
  query,
  handleEnter,
  handleSubmit,
  setQuery,
}: ChatFormProps) => {
  const otherRef = useRef<HTMLTextAreaElement>(null);

  const handleDoubleClick = () => {
    const input = document.createElement("input");
    input.type = 'file';
    input.accept = 'text/plain';
    input.click();

    let file = '';
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="items-center w-full justify-center flex pt-3"
    >
      <div className="flex w-full align-center justify-center max-w-3xl items-center rounded-lg bg-gray-170 shadow-2xl">
        <textarea
          disabled={loading}
          onKeyDown={handleEnter}
          onDoubleClick={handleDoubleClick}
          ref={otherRef}
          className="flex items-center justify-center w-full text-xs sm:text-sm md:text-base rounded-lg border bg-gray-900 border-gray-700 placeholder-gray-400 text-white focus:outline-none resize-none whitespace-pre-wrap overflow-y-auto"
          autoFocus={false}
          rows={1}
          maxLength={2048}
          id="userInput"
          name="userInput"
          placeholder={
            loading
              ? 'Waiting for response...'
              : error
                ? 'Error occurred. Try again.'
                : 'Type your question'
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="inline-flex justify-center p-2 rounded-full cursor-pointer text-blue-500 hover:text-blue-300"
      >
        {loading ? (
          <></>
        ) : error ? (
          <ExclamationCircleIcon className="h-6 w-6 text-red-500" />

        ) : (
          <PaperAirplaneIcon className="h-6 w-6" />
        )}
      </button>
    </form>
  );
};

export default ChatForm;
