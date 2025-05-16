import { ChatOpenAI } from '@langchain/openai';
import { Injectable } from '@nestjs/common';

import { questionPrompt, recommendPrompt } from './prompt/';
import { Product } from '../../domain/product';

export interface OpenAiModelConfig {
  modelName?: string;
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
}

@Injectable()
export class OpenAiClient {
  private questionModel: ChatOpenAI;
  private questionPrompt = questionPrompt;
  private recommendModel: ChatOpenAI;
  private recommendPrompt = recommendPrompt;

  constructor() {
    const modelName = 'gpt-4.1-mini';
    const maxTokens = 4096;
    const timeout = 30_000;
    this.questionModel = new ChatOpenAI({ modelName, temperature: 0.7, maxTokens, timeout });
    this.recommendModel = new ChatOpenAI({ modelName, temperature: 0.3, maxTokens, timeout });
  }

  async generateQuestion(text: string) {
    const chain = this.questionPrompt.pipe(this.questionModel);
    const response = await chain.invoke({ input: text });

    if (typeof response === 'string') {
      return response;
    }

    const content = response.content.toString();
    const cleanedContent = content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    return JSON.parse(cleanedContent);
  }

  async recommendGift(input: string, products: Product[]) {
    const chain = this.recommendPrompt.pipe(this.recommendModel);

    const gifts = products
      .map(gift =>
        `id: ${gift.id},
name: ${gift.name},
url: ${gift.url},
imageUrl: ${gift.imageUrl},
category: ${gift.category},
brand: ${gift.brand},
price: ${gift.price},
priceRange: ${gift.priceRange},
ageRange: ${gift.ageRange},
situation: ${gift.situation.join(', ')},
intention: ${gift.intention.join(', ')},
friendshipLevel: ${gift.friendshipLevel.join(', ')},
targetGender: ${gift.targetGender},
tags: ${gift.tags.join(', ')}`.trim(),
      )
      .join('\n');

    const response = await chain.invoke({ input, gifts });

    const content = response.content
      .toString()
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    return JSON.parse(content);
  }
}
