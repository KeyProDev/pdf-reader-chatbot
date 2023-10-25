import fs from 'fs';
import PDFDocument from 'pdfkit';
import { v4 as uuidv4 } from 'uuid';
import Cors from 'cors';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { RetrievalQAChain, loadQAStuffChain } from 'langchain/chains';
import { HNSWLib } from 'langchain/vectorstores/hnswlib';
import { PromptTemplate } from 'langchain/prompts';
import { OpenAI } from 'langchain/llms/openai';
import process from 'process';
import { DocxLoader } from 'langchain/document_loaders/fs/docx';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

const filePath = process.env.NODE_ENV === 'production' ? '' : 'tmp/';

export default async function handler(req, res) {
  const {
    date,
    city,
    state,
    country,
    personName1,
    companyName1,
    companyLocation1,
    personName2,
    companyName2,
    companyLocation2,
    psName,
    psTitle,
    psDescription,
    psQuantity,
    price,
    timeframes,
    paymentType,
    sellOffer,
    buyOffer,
    selectedCategory,
  } = req.body;

  const openAIapiKey = req.headers['x-openai-key'];

  if (!openAIapiKey) {
    return res.status(500).json({ error: 'OpenAI API key not set' });
  }

  try {
    const loader = new DocxLoader(`./template.docx`);
    const rawDocs = await loader.load();
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });
    const docs = await textSplitter.splitDocuments(rawDocs);

    const model = new OpenAI({
      temperature: 0.9, // increase temepreature to get more creative answers
      modelName: 'gpt-3.5-turbo', //change this to gpt-4 if you have access
      // modelName: "text-davinci-003",
      openAIApiKey: openAIapiKey,
    });

    const vectorStore = await HNSWLib.fromDocuments(
      docs,
      new OpenAIEmbeddings(),
    );
    console.log('generatepdf docs:', docs);

    const promptTemplate = `Given document is a contract template. Please use this template to generate a new contract with the below information. Ensure that the generated contract maintains the same size and style as the template contract.
    Type of Contract: ${selectedCategory}
    City: ${city}
    State: ${state}
    Country: ${country}
    Date: ${date?.startDate}
    Your Name: ${personName1}
    Your Company's Name: ${companyName1}
    Your Company's Location: ${companyLocation1}
    The Involved Person's Name: ${personName2}
    Involved Party's Company's Name: ${companyName2}
    Involved Party's Company's Location: ${companyLocation2}
    What Your Company Will Sell/What Your Company Will Buy: 
    Provider Name: ${psName}
    Service Name: ${psTitle}
    Service Description and Details: ${psDescription}
    Service Quantity: ${psQuantity}
    Price: ${price}
    Timeframes: ${timeframes}
    Type of Payment: ${paymentType}

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

    console.log('response:', response);

    const doc = new PDFDocument();
    const newFileName = uuidv4();

    // Set the appropriate HTTP headers for PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${newFileName}.pdf`,
    );

    // Create a write stream to save the PDF file
    const writeStream = fs.createWriteStream(`./tmp/${newFileName}.pdf`);

    // Pipe the PDF document to the write stream
    doc.pipe(writeStream);

    // Write content to the PDF
    doc.fontSize(18).text(response.text);
    // Finalize the PDF and close the write stream
    doc.end();
    writeStream.on('finish', async () => {
      const fileContents = await fs.readFileSync(`./tmp/${newFileName}.pdf`);
      res.status(200).json({
        message: 'PDF saved successfully',
        fileName: newFileName,
        file: fileContents,
      });
    });
    writeStream.on('error', (err) => {
      res.status(500).json({ error: 'Failed to save PDF', details: err });
    });
  } catch (error: any) {
    console.log('error:', error);
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
}
