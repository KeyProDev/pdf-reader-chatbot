import React, { Fragment, useState } from 'react';
import { Transition } from '@headlessui/react';
import {
  XMarkIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from '@heroicons/react/24/outline';
import { Document } from 'langchain/document';

import { Dialog } from '@headlessui/react';

import SidebarList from '@/components/sidebar/SidebarList';
import Header from '@/components/header/Header';
import PdfEditor from '@/components/sidebar/components/PdfEditor';
import DocEditor from '@/components/sidebar/components/DocEditor';
import { registerLicense } from '@syncfusion/ej2-base';
import Context from '@/context/context';
import { EmptyState } from '@/components/main';
import Chatbot from '@/components/main/ChatBot';
import ContractForm from '@/components/main/ContractForm';

registerLicense(
  'Ngo9BigBOggjHTQxAR8/V1NGaF1cXGNCd0x0Rnxbf1xzZFRMZFRbQXZPMyBoS35RdUVrW3tecXFRR2lbUkZx',
);

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [file, setFile] = useState<File>();
  const [fileName, setFileName] = useState('');
  const [fileUri, setFileUri] = useState('');
  const [fileType, setFileType] = useState('');
  const [isNewContract, setIsNewContract] = useState(false);
  const [contractData, setContractData] = useState({});

  return (
    <Context.Provider
      value={{
        fileUri,
        setFileUri,
        fileType,
        setFileType,
        fileName,
        setFileName,
        file,
        setFile,
        isNewContract,
        setIsNewContract,
        contractData,
        setContractData,
      }}
    >
      <div className="h-full">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex flex-1 w-full max-w-xs mr-16">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 flex justify-center w-16 pt-5 left-full">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="w-6 h-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex flex-col px-6 pb-4 overflow-y-auto bg-gray-900 grow gap-y-5 ring-1 ring-white/10">
                    <div className="flex items-center h-16 shrink-0"></div>
                    <SidebarList />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <div className="hidden h-screen overflow-y-hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex flex-col h-full pb-4 bg-gray-900 border-r border-gray-800 grow">
            <div className="flex items-center h-8 shrink-0"></div>
            <SidebarList />
          </div>
        </div>

        <div className="h-screen lg:pl-72">
          {!!!fileType ? (
            isNewContract ? (
              <ContractForm />
            ) : (
              <div className="flex justify-center items-center px-4 min-h-full">
                <h1 className="text-xl md:text-3xl text-center font-semibold text-gray-100 mb-6">
                  CHOOSE YOUR DOCUMENT FILE
                </h1>
              </div>
            )
          ) : fileType === 'pdf' ? (
            <PdfEditor />
          ) : (
            <DocEditor />
          )}
          <div className="flex items-end justify-end fixed bottom-10 right-10 mt-6 mr-6 z-10">
            {fileType && <Chatbot />}
          </div>
        </div>
      </div>
    </Context.Provider>
  );
}
