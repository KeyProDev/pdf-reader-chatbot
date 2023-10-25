import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import {
  DocumentArrowUpIcon,
  DocumentTextIcon,
  DocumentIcon,
  SpeakerWaveIcon,
} from '@heroicons/react/20/solid';
import { LoadingDots } from '../other';
import Button from '@/components/buttons/Button';
import { useKeys } from '@/hooks';
import Context from '@/context/context';
import Divider from '../other/Divider';
import { useRouter } from 'next/router';
import locales_data from '@/locales.json';
import { useSpeechSynthesis } from 'react-speech-kit';

const SidebarList = () => {
  const router = useRouter();
  const { locales, locale, asPath } = router;
  const { speak, cancel, speaking } = useSpeechSynthesis();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const { openAIapiKey, handleKeyChange, handleSubmitKeys } = useKeys();
  const {
    fileName,
    fileType,
    setFileUri,
    setFileType,
    setFile,
    setFileName,
    isNewContract,
    setIsNewContract,
  } = useContext(Context);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [paragraph, setParagraph] = useState('');
  const [page, setPage] = useState(0);
  const [summaryMode, setSummaryMode] = useState('file');

  const handleParagraphChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setParagraph(event.target.value);
  };

  const handleSummaryModeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSummaryMode(event.target.value);
  };

  const handleChooseFileClick = async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.doc,.docx,.pdf';
    fileInput.click();

    let file = '';
    fileInput.onchange = handleOpenFile;
  };

  const handleOpenFile = async (event: any) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append(`myfile`, file);

    fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        const fileName = data.fileName;
        if (file && fileName) {
          setFile(file);
          setFileName(fileName);
          const fileType = file.name.split('.').pop().toLowerCase();
          setFileType(fileType);
          const reader = new FileReader();
          reader.onload = function (evt) {
            setFileUri(evt?.target?.result as string);
          };

          reader.readAsDataURL(file);
        }
      });
  };

  const handleGetSummary = () => {
    if (summaryMode === 'page' && !page) {
      alert('Please input page number');
      return;
    }
    if (summaryMode === 'paragraph' && !paragraph) {
      alert('Please type paragraph');
      return;
    }
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
        paragraph,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setSummaryLoading(false);
        alert(data.summary);
      })
      .catch((err) => setSummaryLoading(false));
  };

  const handleLocaleChange = (e) => {
    const selectedLocale = e.target.value;
    router.push({ pathname: router.pathname, query: router.query }, undefined, {
      locale: selectedLocale,
    });
  };

  const speakDocument = () => {
    if (isSpeaking) {
      cancel();
      setIsSpeaking(false);
    } else {
      fetch('/api/extractText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName,
          fileType,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          speak({ text: data.text });
          setIsSpeaking(true);
        })
        .catch((err) => setSummaryLoading(false));
    }
  };

  return (
    <nav className="flex flex-col h-full">
      <div className="px-4">
        <form>
          <div>
            <p className="text-white text-sm mb-2 text-lg">
              {locales_data[locale]['language']}
            </p>
            <select
              id="language"
              value={locale} // Assuming you have `locale` value available
              onChange={handleLocaleChange} // Call the handleLocaleChange function on select change
              className="bg-gray-800 border-gray-700 text-white w-full rounded-md"
            >
              {locales?.map((langCode, i) => {
                return (
                  <option key={i} value={langCode}>
                    {locales_data[langCode]['lang']}
                  </option>
                );
              })}
            </select>
          </div>
        </form>
      </div>

      <Divider />

      <div>
        <div className="px-4 space-y-3">
          <Button
            buttonType="primary"
            buttonText={locales_data[locale]['choose_file']}
            icon={DocumentArrowUpIcon}
            onClick={handleChooseFileClick}
          />
        </div>
      </div>

      <Divider />

      <div className="px-4 ">
        <form>
          <div>
            <p className="text-white text-sm mb-2 text-lg">
              {locales_data[locale]['summarize_mode']}
            </p>
            <select
              id="summarize"
              value={summaryMode}
              onChange={handleSummaryModeChange}
              className=" bg-gray-800 border-gray-700 text-white w-full rounded-md"
            >
              <option value="file">
                {locales_data[locale]['entire_file']}
              </option>
              <option value="page">{locales_data[locale]['page']}</option>
              <option value="paragraph">
                {locales_data[locale]['paragraph']}
              </option>
            </select>
          </div>

          {summaryMode === 'paragraph' && (
            <div>
              <p className="text-white text-sm my-2 text-lg">
                {locales_data[locale]['paragraph']}
              </p>
              <textarea
                value={paragraph}
                onChange={handleParagraphChange}
                rows={7}
                className="bg-transparent text-white w-full rounded-lg border-gray-500 text-sm px-2 py-1"
                placeholder="Write the paragraph to get summary"
              />
            </div>
          )}

          {summaryMode === 'page' && (
            <div>
              <p className="text-white text-sm my-2 text-lg">
                {locales_data[locale]['page_number']}
              </p>
              <input
                type="number"
                className="w-full bg-transparent text-white rounded-lg px-2 py-1"
                value={page}
                onChange={(e) => setPage(e.target.value)}
              />
            </div>
          )}
        </form>
      </div>

      <div>
        {fileName && (
          <>
            <Divider />
            <div className="px-4 space-y-3">
              <Button
                buttonType="secondary"
                buttonText={locales_data[locale]['get_summary']}
                onClick={handleGetSummary}
                icon={
                  summaryLoading
                    ? () => <LoadingDots color="#04d9ff" className="" />
                    : DocumentTextIcon
                }
              />
            </div>
          </>
        )}
      </div>

      {!isNewContract && (
        <div>
          <Divider />
          <div className="px-4 space-y-3">
            <Button
              buttonType="primary"
              buttonText={locales_data[locale]['new_contract']}
              onClick={() => {
                setIsNewContract(!isNewContract);
              }}
              icon={DocumentIcon}
            />
          </div>
        </div>
      )}

      {fileName && (
        <div>
          <Divider />
          <div className="px-4 space-y-3">
            <Button
              buttonType="primary"
              buttonText={isSpeaking ? 'Stop' : 'Speak'}
              onClick={speakDocument}
              icon={SpeakerWaveIcon}
            />
          </div>
        </div>
      )}
    </nav>
  );
};
export default SidebarList;
