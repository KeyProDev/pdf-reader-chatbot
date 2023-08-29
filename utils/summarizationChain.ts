import { OpenAI } from "langchain/llms/openai";
import { loadSummarizationChain } from "langchain/chains";

export const makeSummarizationChain = (
    modelTemperature: number,
    openAIapiKey: string,
) => {
    const model = new OpenAI({
        temperature: modelTemperature,
        modelName: 'gpt-3.5-turbo',
        openAIApiKey: openAIapiKey
    });

    const chain = loadSummarizationChain(model, { type: "map_reduce" });

    return chain;
}
