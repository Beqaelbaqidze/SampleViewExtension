import axios from "axios";
import * as https from "https";

export class HttpClass {
  #options;

  constructor(options: {
    url: string;
    method: string;
    headers: { "Content-Type": string };
  }) {
    this.#options = options;
  }

  async request(options: {
    url: string;
    method: string;
    headers: { "Content-Type": string };
  }) {
    if (options) {
      this.#options = options;
    }

    // Creating an instance of https.Agent to bypass SSL certificate errors
    const agent = new https.Agent({
      rejectUnauthorized: false, // WARNING: This makes your HTTPS requests vulnerable to MITM attacks
    });

    // Using Axios for the HTTP request
    try {
      const response = await axios({
        url: this.#options.url,
        method: this.#options.method,
        headers: this.#options.headers,
        httpsAgent: agent,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
