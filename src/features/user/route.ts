import { NextRequest, NextResponse } from 'next/server';

const NEXT_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  try {
    // Get access token from cookies
    const accessToken = request.cookies.get('accesstoken')?.value || '';
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Access token not found' }, { status: 401 });
    }

    const response = await fetch(`${NEXT_BASE_URL}/api/Account/Users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'AccessID': process.env.NEXT_PUBLIC_ACCESSID || '',
        'AccessToken': accessToken,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}