import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || 'player';

  // Fetch profile buat dapet avatar
  const { data: profile } = await supabase
    .from('profiles')
    .select('avatar_url')
    .eq('username', username)
    .single();

  const avatarUrl = profile?.avatar_url;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#141414',
          fontFamily: 'monospace',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, background: '#FF3B30' }} />

        {/* Avatar: gambar kalau ada, huruf depan kalau nggak */}
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            width={160}
            height={160}
            style={{
              borderRadius: '50%',
              border: '8px solid #FFFFFF',
              objectFit: 'cover',
              marginBottom: 32,
            }}
          />
        ) : (
          <div
            style={{
              width: 160,
              height: 160,
              borderRadius: '50%',
              background: '#FF3B30',
              border: '8px solid #FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 32,
            }}
          >
            <span style={{ fontSize: 72, color: '#FFFFFF', fontWeight: 'bold' }}>
              {username.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div style={{ fontSize: 48, color: '#FFCC00', fontWeight: 'bold', marginBottom: 16 }}>
          @{username}
        </div>

        <div style={{ fontSize: 28, color: '#FFFFFF' }}>
          LINKFORGE // INSERT COIN
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 8, background: '#FFCC00' }} />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}