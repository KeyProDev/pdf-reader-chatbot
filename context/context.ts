import React from 'react';

interface ContextProps {
  fileUri: string;
  setFileUri: (fileUri: string) => void;
  fileType: string;
  setFileType: (fileType: string) => void;
  fileName: string;
  setFileName: (fileName: string) => void;
  file: File;
  setFile: (file: File) => void;
  isNewContact: boolean;
  setIsNewContract: (isNewContact: boolean) => void;
  contractData: object;
  setContractData: (contractData: object) => void;
}

const Context = React.createContext<ContextProps | undefined>(undefined);

export default Context;
