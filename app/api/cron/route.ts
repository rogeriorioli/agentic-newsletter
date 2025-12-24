import { NextResponse } from 'next/server';
import { broadcastNewsletter } from '@/lib/broadcast';

export const maxDuration = 300; // 5 minutes timeout for long-running AI processes
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    console.log('Starting broadcast agent processing via Cron...');

    await broadcastNewsletter();

    return NextResponse.json({ success: true, message: 'Broadcast completed' });
  } catch (error: any) {
    console.error('Error in cron job:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
