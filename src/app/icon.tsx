export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

import { ImageResponse } from 'next/og'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'serif',
        }}
      >
        <div
          style={{
            color: '#c9a96e',
            fontSize: '18px',
            fontWeight: '600',
            letterSpacing: '-1px',
          }}
        >
          AS
        </div>
      </div>
    ),
    { ...size }
  )
}
