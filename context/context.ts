import React from 'react';

interface ContextProps {
    fileUri: string;
    setFileUri: (fileUri: string) => void;
    fileType: string;
    setFileType: (fileType: string) => void;
    file: File;
    setFile: (file: File) => void;
}

const Context = React.createContext<ContextProps | undefined>(undefined);

export default Context;
