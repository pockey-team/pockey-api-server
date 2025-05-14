import { ChatOpenAI } from '@langchain/openai';
import { Injectable } from '@nestjs/common';

import { questionPrompt } from './prompt/';

export interface OpenAiModelConfig {
  modelName?: string;
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
}

@Injectable()
export class OpenAiClient {
  private model: ChatOpenAI;
  private questionPrompt = questionPrompt;

  constructor() {
    const modelName = 'gpt-4.1-mini';
    const maxTokens = 10000;
    const timeout = 5_000;
    this.model = new ChatOpenAI({ modelName, temperature: 1.5, maxTokens, timeout });
  }

  async generateQuestion(text: string) {
    const chain = this.questionPrompt.pipe(this.model);
    const response = await chain.invoke({ input: text });

    if (typeof response === 'string') {
      return response;
    }

    return JSON.parse(response.content.toString());
  }
}
