import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';
export async function GET() {
    try {
        const { data, error } = await supabase
            .from('shows')
            .select('id, title, description');
        if (error) {
            console.error('Error fetching shows:', error);
            throw error;
        }
        return NextResponse.json({ shows: data }, { status: 200 });
    }
    catch (error) {
        console.error('API route error:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch shows' }, { status: 500 });
    }
}
