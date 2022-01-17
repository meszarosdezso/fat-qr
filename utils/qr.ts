import QRCodeStyling from 'qr-code-styling'
import { v4 } from 'uuid'

let QrCode: typeof QRCodeStyling | null = null

export async function createCode(count: number) {
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
        dotsOptions: {
          color: '#f47820',
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
