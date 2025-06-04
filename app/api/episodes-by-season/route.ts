import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const showId = searchParams.get('showId')
  const season = searchParams.get('season')

  if (!showId || !season) {
    return NextResponse.json({ error: 'Missing showId or season' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('episodes')
    .select('*')
    .eq('show_id', showId)
    .eq('season_number', Number(season))
    .order('episode_number')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
} 