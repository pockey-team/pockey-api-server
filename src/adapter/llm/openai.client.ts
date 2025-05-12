import { AIMessage, AIMessageChunk } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';
import { Injectable } from '@nestjs/common';

import { questionPrompt, recommendPrompt } from './prompt/';

export interface OpenAiModelConfig {
  modelName?: string;
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
}

@Injectable()
export class OpenAiClient {
  private model: ChatOpenAI;
  private recommendModel: ChatOpenAI;
  private questionPrompt = questionPrompt;
  private recommendPrompt = recommendPrompt;

  constructor() {
    const modelName = 'gpt-4.1-mini';
    const maxTokens = 10000;
    const timeout = 5_000;
    this.model = new ChatOpenAI({ modelName, temperature: 1.5, maxTokens, timeout });
    this.recommendModel = new ChatOpenAI({ modelName, temperature: 0.3, maxTokens, timeout });
  }

  async generateQuestion(text: string) {
    const chain = this.questionPrompt.pipe(this.model);
    const response = await chain.invoke({ input: text });

    if (typeof response === 'string') {
      return response;
    }

    if (response instanceof AIMessage) {
      return JSON.parse(response.content.toString());
    }

    if (response instanceof AIMessageChunk) {
      return JSON.parse(response.content.toString());
    }

    return JSON.parse(response);
  }

  async recommendGift(text: string) {
    const chain = this.recommendPrompt.pipe(this.recommendModel);
    const response = await chain.invoke({ input: text });
    const content =
      response instanceof AIMessage ? response.content.toString() : JSON.stringify(response);

    try {
      return JSON.parse(
        content
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim(),
      );
    } catch (error) {
      return JSON.stringify({
        gift: null,
        reason: content,
      });
    }
  }
}
