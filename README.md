# Qryma JavaScript SDK

A JavaScript SDK for the Qryma Search API, providing a simple and intuitive interface for accessing Qryma's powerful search capabilities.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage Examples](#usage-examples)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Installation

You can install the Qryma JavaScript SDK using npm:

```bash
npm install qryma-javascript
```

Or using yarn:

```bash
yarn add qryma-javascript
```

## Quick Start

```javascript
// To install: npm i qryma-javascript
const { qryma } = require('qryma-javascript');

const client = qryma({ apiKey: "ak-********************" });

client.search("artificial intelligence", {
    lang: "en"
})
.then(console.log);
```

## Usage Examples

### Basic Search

```javascript
const { qryma } = require('qryma-javascript');

const client = qryma({ apiKey: "ak-********************" });

// Simple search with just query
client.search("python programming")
    .then(response => {
        // Access the organic results
        const results = response.organic || [];
        results.forEach(result => {
            console.log(result.title);
            console.log(result.link);
            console.log(result.snippet);
            console.log();
        });
    })
    .catch(error => {
        console.error(error);
    });
```

### Using Async/Await

```javascript
const { qryma } = require('qryma-javascript');

const client = qryma({ apiKey: "ak-********************" });

async function search() {
    try {
        const response = await client.search("python programming");

        // Access the organic results
        const results = response.organic || [];
        results.forEach(result => {
            console.log(result.title);
            console.log(result.link);
            console.log(result.snippet);
            console.log();
        });
    } catch (error) {
        console.error(error);
    }
}

search();
```

### Search with All Parameters

```javascript
const { qryma } = require('qryma-javascript');

const client = qryma({ apiKey: "ak-********************" });

// Search with all available parameters
client.search("machine learning tutorials", {
    lang: "en",
    start: 0,
    safe: false,
    detail: false
})
.then(response => {
    const results = response.organic || [];
    console.log(`Found ${results.length} results`);
});
```

### Custom Base URL and Timeout

```javascript
const { qryma } = require('qryma-javascript');

const client = qryma({
    apiKey: "ak-********************",
    baseUrl: "https://custom.qryma.com",
    timeout: 60
});

client.search("custom search").then(console.log);
```

### API Response Format

The `search()` method returns the raw API response in the following format:

```javascript
{
  "organic": [
    {
      "title": "Result Title",
      "date": "",
      "link": "https://example.com",
      "position": 1,
      "site_name": "Example.com",
      "snippet": "Description text..."
    }
  ]
}
```

**Field descriptions:**
- `title`: Search result title
- `date`: Publication date (if available)
- `link`: URL of the search result
- `position`: Position in the results list
- `site_name`: Name of the website
- `snippet`: Brief description or excerpt from the page

## API Reference

### qryma(config)

Factory function to create a Qryma client instance.

**Parameters:**
- `config.apiKey`: Your Qryma API key (required)
- `config.baseUrl`: Base URL for the API (optional, default: `https://search.qryma.com`)
- `config.timeout`: Request timeout in seconds (optional, default: 30)

**Returns:**
- `QrymaClient` instance

### QrymaClient.search(query, options?)

Perform a search with the given query and return the raw API response.

**Parameters:**
- `query`: Search query string (required)
- `options`: Search options (optional)
  - `lang`: Language code for search results (e.g., 'am' for Amharic, 'en' for English) (optional)
  - `start`: Starting position of results (optional, default: 0)
  - `safe`: Safe search mode: true or false (optional, default: false)
  - `detail`: Include detailed results (optional, default: false)

**Returns:**
- `Promise<QrymaResponse>`: Promise resolving to raw API response object containing the search results

### Alternative: Using QrymaClient class directly

If you prefer, you can still use the class directly:

```javascript
const { QrymaClient } = require('qryma-javascript');

const client = new QrymaClient("ak-********************");
client.search("artificial intelligence", { lang: "en" })
    .then(console.log);
```

## Configuration

### Environment Variables

You can configure the API key using environment variables:

```bash
export QRYMA_API_KEY="your-api-key"
```

Then in your code:

```javascript
const { qryma } = require('qryma-javascript');

const client = qryma({ apiKey: process.env.QRYMA_API_KEY });
```

## Error Handling

The SDK returns rejected promises for API errors:

```javascript
const { qryma } = require('qryma-javascript');

const client = qryma({ apiKey: "ak-********************" });

client.search("test query")
    .then(response => {
        const results = response.organic || [];
        // Process results...
    })
    .catch(error => {
        if (error.message.includes("timed out")) {
            console.error("Network timeout error");
        } else if (error.message.includes("API request failed")) {
            console.error("API error");
        } else {
            console.error("General error:", error.message);
        }
    });
```

Common error conditions:
- Invalid API key
- Rate limiting
- Network timeouts
- Invalid parameters

## Testing

The SDK includes a simple test file. To run the test:

1. First, replace the placeholder API key in `tests/test-search.js` with your actual API key
2. Then run the test:

```bash
npm run test
```

## Contributing

Contributions are welcome! Please see our contributing guide for more information.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please:

1. Check the [documentation](https://qryma.com/documentation.html)
2. Open an issue on GitHub
3. Contact support at support@qryma.com

## Changelog

### 0.1.0
- Basic search functionality
- Simple factory function `qryma()` for easy initialization
- Advanced search with SearchOptions
- Result extraction methods
- API status check
- Error handling
- Comprehensive data models
