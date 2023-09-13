import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { RetrievalQAChain, loadQAStuffChain } from 'langchain/chains';
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
const filePath = process.env.NODE_ENV === 'production' ? '/tmp' : 'tmp';

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Run the middleware
  await runMiddleware(req, res, cors);

  const openAIapiKey = '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'; //req.headers['x-openai-key'];

  if (!openAIapiKey) {
    return res.status(500).json({ error: 'OpenAI API key not set' });
  }

  try {
    const loader = new DocxLoader(`${filePath}/template.docx`);
    const rawDocs = await loader.load();
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });
    const docs = await textSplitter.splitDocuments(rawDocs);

    const vectorStore = await HNSWLib.fromDocuments(
      docs,
      new OpenAIEmbeddings(),
    );

    const model = new OpenAI({
      temperature: 0.5, // increase temepreature to get more creative answers
      modelName: 'gpt-3.5-turbo', //change this to gpt-4 if you have access
      // modelName: "text-davinci-003",
      openAIApiKey: openAIapiKey,
    });

    const promptTemplate = `Given document is a contract template. Please use this template to generate a new contract with the below information. Ensure that the generated contract maintains the same size and style as the template contract.

    Type of Contract: Employment Contract
    City: Salt Lake City
    State: Utah
    Country: USA
    Date: Sept 11, 2023
    Your Name: Jack Falcon
    Your Company's Name: Capcom LLC
    Your Company's Location: 624 Skyrim Ave, Las Vegas, Nevada, zip 65876
    The Involved Person's Name: Michale Florence
    Involved Party's Company's Name: Disney Corp
    Involved Party's Company's Location: 824 Great Plaza Av, Miami, Florida, zip 34876
    What Your Company Will Sell/What Your Company Will Buy: 
    Provider Name: Videogame Headsets
    Service Name: Installation
    Service Description and Details: Videogame Headset Platform Management and Installation
    Service Quantity: N/A
    Price: $30000
    Timeframes: Starting May 1, 2023 to June 1, 2023
    Type of Payment: Direct deposit, Bank of America Acc 3982687245

    {context}

    Generate the new contract based on the given information:`;

    const prompt = PromptTemplate.fromTemplate(promptTemplate);

    const chain = new RetrievalQAChain({
      combineDocumentsChain: loadQAStuffChain(model, { prompt }),
      retriever: vectorStore.asRetriever(),
    });

    const response = await chain.call({
      query: 'Give me new contract same as template style.',
      maxTokens: null,
    });

    res.status(200).json({ data: response.text });
  } catch (error: any) {
    console.log('error', error);
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
}
