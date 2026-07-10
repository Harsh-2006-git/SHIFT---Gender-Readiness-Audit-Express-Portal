import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Pool } from 'pg';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

// Helper to determine if we should use PostgreSQL
const usePostgres = !!process.env.DATABASE_URL;

let pool: any = null;
if (usePostgres) {
  const globalPool = global as any;
  if (!globalPool.pgPool) {
    globalPool.pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
  }
  pool = globalPool.pgPool;
}

// Ensure database table or local file exists
async function ensureDb() {
  if (usePostgres) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS audits (
          id VARCHAR(255) PRIMARY KEY,
          submitted_at TIMESTAMP WITH TIME ZONE,
          data JSONB NOT NULL
        );
      `);
    } catch (error) {
      console.error('Failed to initialize PostgreSQL audits table:', error);
      throw error;
    }
  } else {
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
}

export async function GET() {
  try {
    await ensureDb();
    if (usePostgres) {
      const result = await pool.query('SELECT data FROM audits ORDER BY submitted_at DESC');
      const data = result.rows.map((row: any) => row.data);
      return NextResponse.json(data);
    } else {
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
    await ensureDb();
    const payload = await request.json();
    const newSubmission = {
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      ...payload
    };

    if (usePostgres) {
      await pool.query(
        'INSERT INTO audits (id, submitted_at, data) VALUES ($1, $2, $3) ON CONFLICT (id) DO UPDATE SET data = $3, submitted_at = $2',
        [newSubmission.id, newSubmission.submittedAt, JSON.stringify(newSubmission)]
      );
      return NextResponse.json({ success: true, submission: newSubmission });
    } else {
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
    await ensureDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing ID param' }, { status: 400 });
    }

    if (usePostgres) {
      await pool.query('DELETE FROM audits WHERE id = $1', [id]);
      return NextResponse.json({ success: true });
    } else {
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
