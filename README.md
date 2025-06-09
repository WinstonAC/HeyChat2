# Hey Chat

A real-time chat platform for TV shows and podcasts. Users can join show-specific chat rooms, share thoughts, and engage with other viewers in real-time. Built with modern web technologies and a focus on performance.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database & Auth**: Supabase
- **Styling**: Tailwind CSS + Shadcn/UI
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- Supabase account

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/hey-chat.git
cd hey-chat

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit `http://localhost:3000` to see the app.

## Deployment

The app is configured for deployment on Vercel. Ensure the following environment variables are set in your Vercel project:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Core Features

- Real-time show-specific chat rooms
- User authentication
- Comment threading and reactions
- Mobile-first responsive design

## Support

For deployment or technical issues, please open an issue in the GitHub repository.

## Testing AI Ingested Comment API

You can test the AI ingestion endpoint locally with curl:

```sh
curl -X POST http://localhost:3000/api/ingest-comment \
  -H 'Content-Type: application/json' \
  -d '{
    "episode_id": "YOUR_EPISODE_ID",
    "source_url": "https://www.reddit.com/r/example/comments/abc123/example_post/",
    "source_type": "reddit"
  }'
```

Or use Postman with a POST request to `/api/ingest-comment` and a JSON body:

```
{
  "episode_id": "YOUR_EPISODE_ID",
  "source_url": "https://www.reddit.com/r/example/comments/abc123/example_post/",
  "source_type": "reddit"
}
```

Make sure your environment variables are set for `OPENAI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY`. 