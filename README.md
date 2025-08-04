# Embedding Comparison Server

A TypeScript Express server for creating and comparing text embeddings using OpenAI's API.

## Features

- 🚀 **TypeScript** - Full type safety and modern JavaScript features
- 🔄 **Hot Reloading** - Development server with automatic restarts
- 🏗️ **Clean Architecture** - Routes, Controllers, Services, Models structure
- 🔒 **Security** - Helmet, CORS, and input validation
- 📊 **Logging** - Morgan HTTP request logging
- 🎯 **Error Handling** - Comprehensive error handling middleware
- 🔍 **Embedding Operations** - Create, compare, and store embeddings

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Express middleware
├── models/          # Data models
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript type definitions
└── index.ts         # Application entry point
```

## Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy the environment file:

   ```bash
   cp env.example .env
   ```

4. Update `.env` with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   ```

## Development

Start the development server with hot reloading:

```bash
npm run dev
```

The server will start on `http://localhost:3000` with automatic restarts when files change.

## Production

Build the project:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## API Endpoints

### Health Check

- `GET /health` - Server health status

### Embeddings

- `POST /api/embeddings/create` - Create a new embedding
- `POST /api/embeddings/create-chunked` - Create embeddings for chunked text
- `POST /api/embeddings/compare` - Compare two embeddings
- `POST /api/embeddings/compare-chunked` - Compare chunked embeddings
- `GET /api/embeddings/stored` - Get all stored embeddings
- `GET /api/embeddings/stored/:id` - Get a specific embedding
- `DELETE /api/embeddings/stored/:id` - Delete an embedding

## Example Usage

### Create an Embedding

```bash
curl -X POST http://localhost:3000/api/embeddings/create \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello world",
    "model": "text-embedding-ada-002"
  }'
```

### Compare Embeddings

```bash
curl -X POST http://localhost:3000/api/embeddings/compare \
  -H "Content-Type: application/json" \
  -d '{
    "text1": "Hello world",
    "text2": "Hi there",
    "model": "text-embedding-ada-002"
  }'
```

### Create Chunked Embeddings

```bash
curl -X POST http://localhost:3000/api/embeddings/create-chunked \
  -H "Content-Type: application/json" \
  -d '{
    "text": "This is a long text that will be split into chunks before creating embeddings. Each chunk will be processed separately to handle large documents efficiently.",
    "model": "text-embedding-ada-002",
    "chunkingOptions": {
      "maxChunkSize": 500,
      "overlapSize": 50,
      "chunkBy": "words"
    }
  }'
```

### Compare Chunked Embeddings

```bash
curl -X POST http://localhost:3000/api/embeddings/compare-chunked \
  -H "Content-Type: application/json" \
  -d '{
    "text1": "First long document with multiple paragraphs and sentences.",
    "text2": "Second long document with different content but similar topics.",
    "model": "text-embedding-ada-002",
    "chunkingOptions": {
      "maxChunkSize": 1000,
      "overlapSize": 100,
      "chunkBy": "sentences"
    }
  }'
```

## Scripts

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run watch` - Watch TypeScript files and rebuild

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `OPENAI_API_KEY` - OpenAI API key (required)
- `CORS_ORIGIN` - CORS origin (default: http://localhost:3000)

## Technologies Used

- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **OpenAI** - AI embeddings and text generation
- **Nodemon** - Development hot reloading
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logging
