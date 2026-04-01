/** Qryma API Client implementation. */

import fetch from "node-fetch";
import { __version__ } from "./version";

export interface SearchOptions {
  lang?: string;
  start?: number;
  safe?: boolean;
  mode?: string;
  maxResults?: number;
}

export interface ClientConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

export interface QrymaResponse {
  [key: string]: any;
}

export class QrymaClient {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;
  private headers: Record<string, string>;

  /**
   * Client for interacting with the Qryma Search API.
   *
   * @param apiKey Qryma API key for authentication
   * @param baseUrl Base URL for the Qryma API (default: https://search.qryma.com)
   * @param timeout Request timeout in seconds (default: 30)
   */
  constructor(
    apiKey: string,
    baseUrl: string = "https://search.qryma.com",
    timeout: number = 30
  ) {
    if (!apiKey || apiKey.trim() === "") {
      throw new Error("API key must be provided");
    }

    this.apiKey = apiKey;
    this.baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    this.timeout = timeout * 1000; // Convert to milliseconds
    this.headers = {
      "X-Api-Key": apiKey,
      "Content-Type": "application/json",
      "User-Agent": `qryma-javascript/${__version__}`,
    };
  }

  /**
   * Perform a search using the Qryma API.
   *
   * @param query The search query string
   * @param options Search options (optional)
   * @param options.lang Language code for search results (e.g., 'am' for Amharic, 'en' for English) (optional)
   * @param options.start Starting position of results (default: 0)
   * @param options.safe Safe search mode: true or false (default: false)
   * @param options.mode Result detail mode: 'snippet' for brief descriptions or 'fulltext' for detailed content (default: 'snippet')
   * @returns Raw API response containing the search results
   * @throws Error If there's an error with the request or response processing
   */
  async search(query: string, options: SearchOptions = {}): Promise<QrymaResponse> {
    const url = `${this.baseUrl}/api/web`;

    // 设置默认值：如果 mode 为空，则默认使用 "snippet"
    let mode = options.mode || "snippet";
    // 确保 mode 值是有效的
    if (mode !== "snippet" && mode !== "fulltext") {
      mode = "snippet";
    }

    // 设置 maxResults：默认值为 5，限制在 1-10 之间
    let maxResults = options.maxResults || 5;
    if (maxResults < 1) {
      maxResults = 1;
    } else if (maxResults > 10) {
      maxResults = 10;
    }

    const payload = {
      query: query || "",
      lang: options.lang || "",
      start: options.start || 0,
      safe: options.safe || false,
      mode: mode,
      max_results: maxResults,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === "AbortError") {
        throw new Error(`Request timed out after ${this.timeout / 1000} seconds`);
      }

      throw new Error(`Error processing search: ${error.message}`);
    }
  }
}

/**
 * Create a Qryma client instance.
 *
 * @param config Client configuration
 * @param config.apiKey Qryma API key for authentication
 * @param config.baseUrl Base URL for the Qryma API (optional)
 * @param config.timeout Request timeout in seconds (optional)
 * @returns Qryma client instance
 *
 * @example
 * ```javascript
 * const { qryma } = require('qryma-javascript');
 *
 * const client = qryma({
 *   apiKey: "ak-********************"
 * });
 *
 * client.search("hello world", {
 *   lang: "en",
 *   safe: false
 * }).then(console.log);
 * ```
 */
export function qryma(config: ClientConfig): QrymaClient {
  return new QrymaClient(config.apiKey, config.baseUrl, config.timeout);
}

