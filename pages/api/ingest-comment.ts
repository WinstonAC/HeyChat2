import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Correct server-side initialization
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { episode_id, source_url, source_type } = req.body;
  if (!episode_id || !source_url || !source_type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // 1. Simulate fetching content from source_url
  const simulatedContent = `Sample content from ${source_type} at ${source_url}`;

  // 2. Summarize with OpenAI
  const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an assistant that summarizes social media or podcast content into a short, opinionated comment as if it were written by a real person. Use a casual, conversational tone and attribute the source.'
        },
        {
          role: 'user',
          content: `Summarize this content into 1-2 sentences as a personal opinion, e.g. "Jan from Michigan on Reddit said...":\n${simulatedContent}`
        }
      ],
      max_tokens: 80,
      temperature: 0.8
    })
  });

  if (!openaiRes.ok) {
    const error = await openaiRes.json();
    return res.status(500).json({ error: 'OpenAI error', details: error });
  }

  const openaiData = await openaiRes.json();
  const aiSummary = openaiData.choices?.[0]?.message?.content?.trim() || 'AI summary unavailable.';

  // 3. Insert into Supabase
  const { data, error } = await supabase.from('comments').insert([
    {
      content: aiSummary,
      episode_id,
      source_type,
      source_url,
      ingested: true,
      relevance_score: Math.random() * 0.5 + 0.5 // 0.5–1.0
    }
  ]).select();

  if (error) {
    return res.status(500).json({ error: 'Supabase insert error', details: error });
  }

  return res.status(200).json({ comment: data?.[0] });
} 