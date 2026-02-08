import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f97316',
          borderRadius: '32px',
        }}
      >
        <span
          style={{
            fontSize: '120px',
            fontWeight: 900,
            color: '#ffffff',
            lineHeight: 1,
          }}
        >
          F
        </span>
      </div>
    ),
    { ...size }
  )
}
