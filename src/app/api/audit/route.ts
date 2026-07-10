import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

// Helper to determine if we should use Supabase
function useSupabase() {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
}

// Ensure DB directory and file exist (local fallback)
async function ensureDb() {
  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    try {
      await fs.access(DB_PATH);
    } catch {
      await fs.writeFile(DB_PATH, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (error) {
    console.error('Failed to initialize local database:', error);
  }
}

export async function GET() {
  try {
    if (useSupabase()) {
      const url = `${process.env.SUPABASE_URL}/rest/v1/audits?select=data`;
      const res = await fetch(url, {
        headers: {
          'apikey': process.env.SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          'Cache-Control': 'no-cache'
        }
      });
      if (!res.ok) {
        throw new Error(`Supabase error: ${res.statusText}`);
      }
      const rows = await res.json();
      const data = rows.map((r: any) => r.data);
      return NextResponse.json(data);
    } else {
      await ensureDb();
      const fileData = await fs.readFile(DB_PATH, 'utf-8');
      const data = JSON.parse(fileData);
      return NextResponse.json(data);
    }
  } catch (error: any) {
    console.error('GET database error:', error);
    return NextResponse.json({ error: error.message || 'Failed to read from database' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const newSubmission = {
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      ...payload
    };

    if (useSupabase()) {
      const url = `${process.env.SUPABASE_URL}/rest/v1/audits`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'apikey': process.env.SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ id: newSubmission.id, data: newSubmission })
      });
      if (!res.ok) {
        throw new Error(`Supabase error: ${res.statusText}`);
      }
      return NextResponse.json({ success: true, submission: newSubmission });
    } else {
      await ensureDb();
      const fileData = await fs.readFile(DB_PATH, 'utf-8');
      const data = JSON.parse(fileData);
      data.push(newSubmission);
      await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
      return NextResponse.json({ success: true, submission: newSubmission });
    }
  } catch (error: any) {
    console.error('POST database error:', error);
    return NextResponse.json({ error: error.message || 'Failed to write to database' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing ID param' }, { status: 400 });
    }

    if (useSupabase()) {
      const url = `${process.env.SUPABASE_URL}/rest/v1/audits?id=eq.${id}`;
      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          'apikey': process.env.SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
        }
      });
      if (!res.ok) {
        throw new Error(`Supabase error: ${res.statusText}`);
      }
      return NextResponse.json({ success: true });
    } else {
      await ensureDb();
      const fileData = await fs.readFile(DB_PATH, 'utf-8');
      let data = JSON.parse(fileData);
      data = data.filter((item: any) => item.id !== id);
      await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
      return NextResponse.json({ success: true });
    }
  } catch (error: any) {
    console.error('DELETE database error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete from database' }, { status: 500 });
  }
}
