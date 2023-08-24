import React, { useContext, useEffect, useState } from 'react';
import { DocumentArrowUpIcon, PencilIcon, Square2StackIcon } from '@heroicons/react/20/solid';
import Button from '@/components/buttons/Button';
import { useKeys } from '@/hooks';
import Context from '@/context/context';

const SidebarList = () => {
  const { openAIapiKey, handleKeyChange, handleSubmitKeys } = useKeys();
  const { fileUri, setFileUri, setFileType, setFile } = useContext(Context)

  const handleChooseFileClick = async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.click();

    let file = '';
    fileInput.onchange = handleOpenFile;
  }

  const handleOpenFile = (event: any) => {
    const file = event.target.files[0];

    if (file) {
      setFile(file)
      const fileType = file.name.split('.').pop().toLowerCase();
      setFileType(fileType);
      const reader = new FileReader();
      reader.onload = function (evt) {
        setFileUri(evt?.target?.result as string);
      }

      reader.readAsDataURL(file);
    }
  }

  const handleGetSummary = async () => {
    console.log('openAIapiKey', openAIapiKey)
    const response = await fetch('/api/getSummary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-OpenAI-Key': openAIapiKey,
      },
      body: JSON.stringify({
        fileUri
      }),
    });
  }

  return (
    <nav className="flex flex-col h-full">
      <div className='px-4'>
        <form >
          <div className='relative'>
            <p className="text-white text-sm mb-2 text-lg">
              Language
            </p>
            <select
              id='language'
              value={''}
              onChange={(e) => { }}
              className=' bg-gray-800 border-gray-700 text-white w-full rounded-md'
            >
              <option value='english'>English</option>
              <option value='spanish'>Spanish</option>
              <option value='chinese'>Chinese</option>
              <option value='japanese'>Japanese</option>
              <option value='german'>German</option>
              <option value='french'>French</option>
            </select>
          </div>
        </form>
      </div>

      <div className='mt-5'>
        <div className="px-4 space-y-3">
          <Button
            buttonType="primary"
            buttonText="Choose File"
            icon={DocumentArrowUpIcon}
            onClick={handleChooseFileClick}
          />
        </div>
      </div>

      <div className='px-4 mt-5'>
        <form >
          <div className='relative'>
            <p className="text-white text-sm mb-2 text-lg">
              Summarize mode
            </p>
            <select
              id='summarize'
              value={''}
              onChange={(e) => { }}
              className=' bg-gray-800 border-gray-700 text-white w-full rounded-md'
            >
              <option value='paragraph'>Paragraph</option>
              <option value='page'>Page</option>
              <option value='file'>Entire File</option>
            </select>
          </div>
        </form>
      </div>

      <div className='mt-5'>
        <div className="px-4 space-y-3">
          <Button
            buttonType="secondary"
            buttonText="Edit File"
            onClick={handleGetSummary}
            icon={PencilIcon}
          />
        </div>
      </div>

      <div className='mt-5'>
        <div className="px-4 space-y-3">
          <Button
            buttonType="secondary"
            buttonText="Compare"
            onClick={() => { }}
            icon={Square2StackIcon}
          />
        </div>
      </div>
    </nav>
  );
};
export default SidebarList;
