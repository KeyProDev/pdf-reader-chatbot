import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { DocumentArrowUpIcon, DocumentTextIcon } from '@heroicons/react/20/solid';
import { LoadingDots } from '../other';
import Button from '@/components/buttons/Button';
import { useKeys } from '@/hooks';
import Context from '@/context/context';
import Divider from '../other/Divider';

const SidebarList = () => {
  const { openAIapiKey, handleKeyChange, handleSubmitKeys } = useKeys();
  const { fileName, fileType, setFileUri, setFileType, setFile, setFileName } = useContext(Context)
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [paragraph, setParagraph] = useState('');
  const [page, setPage] = useState(0);
  const [summaryMode, setSummaryMode] = useState('file');

  const handleParagraphChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setParagraph(event.target.value);
  }

  const handleSummaryModeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSummaryMode(event.target.value);
  };

  const handleChooseFileClick = async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = ".doc,.docx,.pdf"
    fileInput.click();

    let file = '';
    fileInput.onchange = handleOpenFile;
  }

  const handleOpenFile = async (event: any) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append(`myfile`, file);

    fetch('/api/upload', {
      method: 'POST',
      body: formData
    }).then(res => res.json()).then(data => {
      const fileName = (data.fileName);
      if (file && fileName) {
        setFile(file)
        setFileName(fileName);
        const fileType = file.name.split('.').pop().toLowerCase();
        setFileType(fileType);
        const reader = new FileReader();
        reader.onload = function (evt) {
          setFileUri(evt?.target?.result as string);
        }

        reader.readAsDataURL(file);
      }
    })
  }

  const handleGetSummary = () => {
    if (summaryMode === 'page' && !page) { alert('Please input page number'); return; }
    if (summaryMode === 'paragraph' && !paragraph) { alert('Please type paragraph'); return; }
    setSummaryLoading(true);
    fetch('/api/getSummary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-OpenAI-Key': openAIapiKey,
      },
      body: JSON.stringify({
        fileName,
        fileType,
        summaryMode,
        page,
        paragraph
      }),
    }).then(res => res.json()).then(data => {
      setSummaryLoading(false);
      alert(data.summary)
    }).catch(err => setSummaryLoading(false));
  }

  return (
    <nav className="flex flex-col h-full">
      <div className='px-4'>
        <form >
          <div>
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

      <Divider />

      <div>
        <div className="px-4 space-y-3">
          <Button
            buttonType="primary"
            buttonText="Choose File"
            icon={DocumentArrowUpIcon}
            onClick={handleChooseFileClick}
          />
        </div>
      </div>

      <Divider />

      <div className='px-4 '>
        <form >
          <div>
            <p className="text-white text-sm mb-2 text-lg">
              Summarize mode
            </p>
            <select
              id='summarize'
              value={summaryMode}
              onChange={handleSummaryModeChange}
              className=' bg-gray-800 border-gray-700 text-white w-full rounded-md'
            >
              <option value='file'>Entire File</option>
              <option value='page'>Page</option>
              <option value='paragraph'>Paragraph</option>
            </select>
          </div>

          {
            summaryMode === 'paragraph' && (
              <div>
                <p className="text-white text-sm my-2 text-lg">
                  Paragraph
                </p>
                <textarea
                  value={paragraph}
                  onChange={handleParagraphChange}
                  rows={7}
                  className="bg-transparent text-white w-full rounded-lg border-gray-500 text-sm px-2 py-1"
                  placeholder="Write the paragraph to get summary"
                />
              </div>
            )
          }

          {
            summaryMode === 'page' && (
              <div>
                <p className="text-white text-sm my-2 text-lg">
                  Page Number
                </p>
                <input
                  type="number"
                  className='w-full bg-transparent text-white rounded-lg px-2 py-1'
                  value={page}
                  onChange={e => setPage(e.target.value)}
                />
              </div>
            )
          }
        </form>
      </div>

      <Divider />

      <div>
        <div className="px-4 space-y-3">
          {
            fileName && (
              <Button
                buttonType="secondary"
                buttonText="Get Summary"
                onClick={handleGetSummary}
                icon={summaryLoading ? () => <LoadingDots
                  color="#04d9ff"
                  className=""
                /> : DocumentTextIcon}
              />

            )
          }
        </div>
      </div>

    </nav>
  );
};
export default SidebarList;
