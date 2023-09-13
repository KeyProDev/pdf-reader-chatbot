import { OpenAI } from 'langchain/llms/openai';
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { HNSWLib } from 'langchain/vectorstores/hnswlib';

const CONDENSE_PROMPT = `Given the chat history and a follow-up question, rephrase the follow-up question to be a standalone question that encompasses all necessary context from the chat history.
Chat History:
{chat_history}
Follow-up input: {question}
Make sure your standalone question is self-contained, clear, and specific. Rephrased standalone question:`;

// --------------------------------------------------

const QA_PROMPT = `You are an AI assistant knowledgeable about contract laws in the United States. You can provide information and answer questions related to contract laws in different states.

Context: {context}

Question: {question}`;

// Creates a ConversationalRetrievalQAChain object that uses an OpenAI model and a PineconeStore vectorstore
export const makeChain = (
  vectorstore: HNSWLib,
  returnSourceDocuments: boolean,
  modelTemperature: number,
  openAIapiKey: string,
) => {
  const model = new OpenAI({
    temperature: modelTemperature, // increase temepreature to get more creative answers
    modelName: 'gpt-3.5-turbo', //change this to gpt-4 if you have access
    // modelName: "text-davinci-003",
    openAIApiKey: openAIapiKey,
  });

  // Configures the chain to use the QA_PROMPT and CONDENSE_PROMPT prompts and to not return the source documents
  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorstore.asRetriever(),
    {
      qaTemplate: QA_PROMPT,
      questionGeneratorTemplate: CONDENSE_PROMPT,
      returnSourceDocuments,
    },
  );
  return chain;
};
