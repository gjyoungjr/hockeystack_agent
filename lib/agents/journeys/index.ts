import { ChatOpenAI } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { HumanMessage } from "@langchain/core/messages";
import UserJourney from "../../data/user_journey.json";

// Initialize text splitter
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 0,
});

// Initialize language model
const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
});

// Function to convert JSON data into `Document` objects
const convertJSONToDocument = (data: any[]) => {
  return data.map(
    (item) => new Document({ pageContent: JSON.stringify(item), metadata: {} })
  );
};

// Main function to initialize retriever and document chain
let retriever: any;
let documentChain: any;

const initializeJourneyResearcher = async () => {
  const docs = convertJSONToDocument(UserJourney);
  const docSplits = await textSplitter.splitDocuments(docs);

  const vectorStore = await MemoryVectorStore.fromDocuments(
    docSplits,
    new OpenAIEmbeddings()
  );

  retriever = vectorStore.asRetriever({ k: 4 });

  const SYSTEM_TEMPLATE = `You are an expert in user journey analysis, specializing in extracting key insights from customer interactions. Your goal is to analyze the provided user journey data and generate actionable insights.

  ### **Context:**  
  The user journey consists of multiple steps that a customer takes while interacting with a product or service. These steps may include website visits, product page interactions, cart additions, purchases, support interactions, and other touchpoints. The objective is to understand user behavior, identify patterns, and provide data-driven insights.

  ### **Instructions:**  
  1. Carefully analyze the user journey data provided below.  
  2. Identify common patterns, conversion drivers, and drop-off points.  
  3. Highlight any behavioral trends, anomalies, or areas for improvement.  
  4. If applicable, suggest strategies to improve user engagement and conversion.  

  ### **User Journey Data:**  
  {context}  

  ### **Question:**  
  {question}  

  ### **Expected Output Format:**  
  - **Key Insights:** [Bullet points summarizing trends]  
  - **Drop-off Analysis:** [Where users leave and why]  
  - **Conversion Factors:** [What leads to successful conversions]  
  - **Improvement Suggestions:** [Actionable recommendations]  

  Please provide a structured response with clear, concise insights`;

  const questionAnsweringPrompt = ChatPromptTemplate.fromMessages([
    ["system", SYSTEM_TEMPLATE],
    new MessagesPlaceholder("messages"),
  ]);

  documentChain = await createStuffDocumentsChain({
    llm,
    prompt: questionAnsweringPrompt,
  });
};

// Function to process user queries
export const journeyResearcher = async (query: string) => {
  if (!retriever || !documentChain) {
    throw new Error(
      "journeyResearcher is not initialized. Call initializeJourneyResearcher() first."
    );
  }

  const similarDocs = await retriever.invoke(query);

  const response = await documentChain.invoke({
    messages: [new HumanMessage(query)],
    // @ts-ignore
    context: similarDocs.map((doc) => doc.pageContent).join("\n\n"),
  });

  return response;
};

// Export initialization function
export { initializeJourneyResearcher };
