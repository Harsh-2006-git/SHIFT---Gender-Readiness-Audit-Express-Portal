import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

// Ensure DB directory and file exist
async function ensureDb() {
  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    try {
      await fs.access(DB_PATH);
    } catch {
      await fs.writeFile(DB_PATH, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

export async function GET() {
  try {
    await ensureDb();
    const fileData = await fs.readFile(DB_PATH, 'utf-8');
    const data = JSON.parse(fileData);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read from database' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureDb();
    const payload = await request.json();
    
    // Read current data
    const fileData = await fs.readFile(DB_PATH, 'utf-8');
    const data = JSON.parse(fileData);
    
    // Add unique ID and timestamp
    const newSubmission = {
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      ...payload
    };
    
    data.push(newSubmission);
    
    // Write back
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    
    return NextResponse.json({ success: true, submission: newSubmission });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to write to database' }, { status: 500 });
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
    
    const fileData = await fs.readFile(DB_PATH, 'utf-8');
    let data = JSON.parse(fileData);
    
    data = data.filter((item: any) => item.id !== id);
    
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete from database' }, { status: 500 });
  }
}
