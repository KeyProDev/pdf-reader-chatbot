import Cors from 'cors';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { makeSummarizationChain } from '@/utils/summarizationChain';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { DocxLoader } from 'langchain/document_loaders/fs/docx';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { CSVLoader } from 'langchain/document_loaders/fs/csv';
import { Document } from 'langchain/document';

import 'jspdf-autotable';

const cors = Cors({
    methods: ['POST', 'GET', 'HEAD'],
})
const filePath = process.env.NODE_ENV === 'production' ? '/tmp' : 'tmp';

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(
    req: NextApiRequest,
    res: NextApiResponse,
    fn: Function
) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) {
                return reject(result)
            }

            return resolve(result)
        })
    })
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    // Run the middleware
    await runMiddleware(req, res, cors)

    const openAIapiKey = req.headers['x-openai-key'];
    const { fileUri } = req.body;
    // Load PDF, DOCS, TXT, CSV files from the specified directory
    const loader = new TextLoader(fileUri);

    const rawDocs = await loader.load();

    // Split the PDF documents into smaller chunks
    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });

    const docs = await textSplitter.splitDocuments(rawDocs);
    console.log('text', docs, rawDocs);
    const chain = makeSummarizationChain(0, openAIapiKey as string);
    const response = await chain.call({
        input_documents: docs,
    });

    console.log('summarization response', response);
    res
        .status(200)
        .json({ summary: response.text });
};
