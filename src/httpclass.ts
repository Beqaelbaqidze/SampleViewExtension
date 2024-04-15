import axios from "axios";
import * as https from "https";

export class HttpClass {
  private defaultOptions;

  constructor(options: {
    url: string;
    method: string;
    headers: { "Content-Type": string };
  }) {
    this.defaultOptions = options;
  }

  async request(
    options: {
      url?: string;
      method?: string;
      headers?: { "Content-Type": string };
    } = {}
  ) {
    const requestOptions = {
      url: options.url || this.defaultOptions.url,
      method: options.method || this.defaultOptions.method,
      headers: options.headers || this.defaultOptions.headers,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    };

    try {
      const response = await axios(requestOptions);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
