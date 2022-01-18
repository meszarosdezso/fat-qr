import QRCodeStyling from 'qr-code-styling'
import { v4 } from 'uuid'

interface QrOptions {
  color?: string
}

let QrCode: typeof QRCodeStyling | null = null

export async function createCode(count: number, options?: QrOptions) {
  if (QrCode === null) {
    QrCode = (await import('qr-code-styling')).default
  }

  const ids = Array(count)
    .fill(0)
    .map((_) => v4())

  return ids.map(
    (id) =>
      new QrCode!({
        data: id,
        width: 360,
        height: 360,
        type: 'svg',
        qrOptions: {
          errorCorrectionLevel: 'H',
        },
        backgroundOptions: {
          color: '#0000',
        },
        dotsOptions: {
          color: `#${options?.color}`,
          type: 'dots',
        },
        cornersSquareOptions: {
          type: 'extra-rounded',
        },
        cornersDotOptions: {
          type: 'dot',
        },
        margin: 10,
        imageOptions: {
          crossOrigin: 'anonymous',
          margin: 20,
        },
      })
  )
}
