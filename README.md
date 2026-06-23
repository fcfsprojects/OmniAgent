# OmniAgent — Universal AI Agent Framework

OmniAgent is a universal framework for deploying and managing AI agents. It supports **every major AI provider**, **every model**, and can be deployed on **any hosting** platform. Build, configure, and chat with AI agents using API keys from any provider.

## Features

- **Universal Provider Support** — OpenAI, Anthropic (Claude), Google (Gemini), Mistral, Groq, Cohere, Together AI, Fireworks AI, DeepSeek, Perplexity, OpenRouter, and custom/self-hosted endpoints
- **All Models Supported** — GPT-4o, Claude Sonnet/Opus, Gemini 2.5, Mistral Large, Llama 3.x, and more
- **Bring Your Own Key** — Use your API credits from any provider
- **Agent Management** — Create, configure, and manage multiple agents with different providers/models
- **Chat Interface** — Full-featured chat UI with conversation history
- **Quick Chat** — Test any provider/model instantly without creating an agent
- **Streaming Support** — Real-time streaming responses via SSE
- **Function Calling** — Tool/function calling support across providers
- **Mobile Ready** — Build as Android APK using Capacitor
- **Self-Hostable** — Deploy anywhere: VPS, Docker, Vercel, Railway, etc.

## Supported Providers

| Provider | Models | Features |
|----------|--------|----------|
| **OpenAI** | GPT-4o, GPT-4, o1, o3, o4-mini | Chat, Streaming, Tools, Vision, Embeddings, Images, Audio |
| **Anthropic** | Claude Sonnet 4, Claude Opus 4, Claude 3.5 | Chat, Streaming, Tools, Vision |
| **Google** | Gemini 2.5 Pro/Flash, Gemini 2.0, 1.5 | Chat, Streaming, Tools, Vision, Embeddings |
| **Mistral** | Large, Medium, Small, Codestral | Chat, Streaming, Tools, Embeddings |
| **Groq** | Llama 3.3, 3.1, 3.2, Mixtral, Gemma | Chat, Streaming, Tools |
| **Cohere** | Command R+, Command R, Embed | Chat, Streaming, Tools, Embeddings |
| **Together AI** | Llama 405B/70B/8B, Mixtral, Qwen | Chat, Streaming, Tools, Embeddings |
| **Fireworks AI** | Llama 3.1 405B/70B, Mixtral | Chat, Streaming, Tools |
| **DeepSeek** | DeepSeek Chat, Coder, Reasoner | Chat, Streaming, Tools |
| **Perplexity** | Sonar Pro, Sonar Reasoning | Chat, Streaming |
| **OpenRouter** | Access 100+ models via unified API | Chat, Streaming, Tools |
| **Custom** | Any OpenAI-compatible endpoint | Chat, Streaming |

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/fcfsprojects/OmniAgent.git
cd OmniAgent

# Install dependencies
npm install

# Start development servers (backend + frontend)
npm run dev
```

The app will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

### Configuration

Copy the environment example:

```bash
cp backend/.env.example backend/.env
```

## Building APK (Android)

OmniAgent can be packaged as an Android APK using Capacitor:

```bash
cd frontend

# Build the web app
npm run build

# Initialize Capacitor Android project
npx cap add android

# Sync web assets to Android
npx cap sync android

# Open in Android Studio (optional)
npx cap open android

# Build APK via command line
cd android && ./gradlew assembleDebug
```

The APK will be at `frontend/android/app/build/outputs/apk/debug/app-debug.apk`.

## API Reference

### Health Check
```
GET /api/health
```

### Providers
```
GET  /api/providers              # List all providers
GET  /api/providers/:id          # Get provider details
GET  /api/providers/:id/models   # List provider models
```

### Agents
```
GET    /api/agents               # List all agents
POST   /api/agents               # Create agent
GET    /api/agents/:id           # Get agent
PUT    /api/agents/:id           # Update agent
DELETE /api/agents/:id           # Delete agent
```

### Chat
```
POST   /api/chat/conversations                    # Create conversation
GET    /api/chat/conversations                     # List conversations
GET    /api/chat/conversations/:id                 # Get conversation
DELETE /api/chat/conversations/:id                 # Delete conversation
POST   /api/chat/conversations/:id/messages        # Send message
POST   /api/chat/conversations/:id/stream          # Stream message
POST   /api/chat/quick                             # Quick chat (no agent)
```

### Create Agent Example

```json
POST /api/agents
{
  "name": "My GPT Agent",
  "provider": "openai",
  "model": "gpt-4o",
  "apiKey": "sk-...",
  "systemPrompt": "You are a helpful coding assistant.",
  "temperature": 0.7,
  "maxTokens": 4096
}
```

## Deployment

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

### Vercel / Railway / Render

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Deploy

### Self-Hosted (VPS)

```bash
git clone https://github.com/fcfsprojects/OmniAgent.git
cd OmniAgent
npm install
npm run build
NODE_ENV=production npm start
```

## Architecture

```
OmniAgent/
├── backend/
│   └── src/
│       ├── config/          # Provider registry & defaults
│       ├── providers/       # Universal provider adapters
│       │   ├── base-provider.js      # Base adapter class
│       │   ├── anthropic-provider.js # Anthropic transformer
│       │   ├── google-provider.js    # Google/Gemini transformer
│       │   ├── cohere-provider.js    # Cohere transformer
│       │   └── index.js             # Provider factory
│       ├── agents/          # Agent CRUD & conversation management
│       ├── routes/          # Express API routes
│       ├── middleware/      # Error handling, rate limiting
│       ├── utils/           # Logger
│       └── server.js        # Express server entry
├── frontend/
│   └── src/
│       ├── components/      # Layout, shared UI
│       ├── pages/           # Dashboard, Agent config, Chat, Providers
│       ├── hooks/           # Custom React hooks
│       └── lib/             # API client
└── README.md
```

## License

MIT
