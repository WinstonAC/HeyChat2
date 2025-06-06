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