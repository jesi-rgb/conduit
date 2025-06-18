# Conduit

A chat app designed for natural conversation flow with intelligent context branching.

![Conduit](/static/og-image.webp)

## Features

- **Branching Conversations**: Create tangent discussions without losing your main thread
- **Context Isolation**: Side conversations maintain their own context, keeping the main chat focused
- **Cost Efficient**: Reduced token usage through smart context management
- **Clean UI**: Built with modern design principles

## How It Works

When you want to explore a tangent, Conduit creates a linked branch from your current conversation. These branches:
- Maintain their own conversation history
- Don't pollute the main thread's context
- Allow you to explore ideas without derailing the primary discussion
- Reduce API costs by sending fewer messages per request

## Tech Stack

- **Frontend**: SvelteKit
- **Database**: Supabase with Drizzle ORM
- **Styling**: Tailwind CSS + DaisyUI
- **Components**: Bits UI

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase credentials

# Run development server
npm run dev
