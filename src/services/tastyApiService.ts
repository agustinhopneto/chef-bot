import axios, { AxiosInstance } from 'axios';

export type Recipe = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  thumbnail_url: string;
  yields?: string;
  sections: {
    components: {
      raw_text: string;
    }[];
  }[];
  instructions: {
    display_text: string;
  }[];
  recipes?: {
    id: number;
  }[];
};

export class TastyApiService {
  private readonly api: AxiosInstance;

  constructor(url: string, host: string, key: string) {
    this.api = axios.create({
      baseURL: url,
      headers: {
        'x-rapidapi-host': host as string,
        'x-rapidapi-key': key as string,
      },
    });
  }

  async getRecipes(
    searchString?: string,
    fromId?: number,
    responseSize?: number,
  ): Promise<Recipe[]> {
    const {
      data: { results },
    } = await this.api.get<{ results: Recipe[] }>('/recipes/list', {
      params: {
        from: fromId || 0,
        size: responseSize || 5,
        q: searchString || '',
      },
    });

    return results;
  }

  async getRecipeById(recipeId: number): Promise<Recipe> {
    const { data } = await this.api.get<Recipe>('/recipes/get-more-info', {
      params: {
        id: recipeId,
      },
    });

    return data;
  }
}
