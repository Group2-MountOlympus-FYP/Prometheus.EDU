// app/api/tags/route.js
import {NextResponse} from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const {rows} = await pool.query('SELECT * FROM tags');
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching tags:', error);
        return NextResponse.json({error: 'Error fetching tags'}, {status: 500});
    }
}