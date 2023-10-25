import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { makeChain } from '@/utils/makechain';
import { HNSWLib } from 'langchain/vectorstores/hnswlib';

import fs from 'fs';
import { PromptTemplate } from 'langchain/prompts';
import { OpenAI } from 'langchain/llms/openai';
import { LLMChain } from 'langchain/chains';
import xlsx from 'xlsx';
import axios from 'axios';
import process from 'process';

import { jsPDF } from 'jspdf';
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  AlignmentType,
} from 'docx';
import 'jspdf-autotable';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { DocxLoader } from 'langchain/document_loaders/fs/docx';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
});
const filePath = process.env.NODE_ENV === 'production' ? '' : 'tmp';

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function,
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

const getAPIkeyLimit = async (apikey: string) => {
  try {
    const response = await axios.get('https://api.openai.com/v1/usage', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apikey}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching API key limit:', error);
    return null;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Run the middleware
  await runMiddleware(req, res, cors);

  const { question, history, fileName, fileType } = req.body;

  const openAIapiKey = req.headers['x-openai-key'];

  if (!openAIapiKey) {
    return res.status(500).json({ error: 'OpenAI API key not set' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!question) {
    return res.status(400).json({ message: 'No question in the request' });
  }

  if (!fileName) {
    return res.status(400).json({ message: 'Not found file' });
  }

  if (!fileType) {
    return res.status(400).json({ error: 'Required file type' });
  }

  const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

  try {
    const loader =
      fileType === 'pdf'
        ? new PDFLoader(`${filePath}/${fileName}`)
        : new DocxLoader(`${filePath}/${fileName}`);
    const rawDocs = await loader.load();
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });
    const docs = await textSplitter.splitDocuments(rawDocs);

    const vectorStore = await HNSWLib.fromDocuments(
      docs,
      new OpenAIEmbeddings(),
    );

    const chain = makeChain(vectorStore, true, 0.5, openAIapiKey as string);

    const response = await chain.call({
      question: sanitizedQuestion,
      chat_history: history || [],
    });

    res
      .status(200)
      .json({ text: response.text, sourceDocuments: response.sourceDocuments });
  } catch (error: any) {
    console.log('error', error);
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
}
