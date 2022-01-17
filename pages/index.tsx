import Head from 'next/head'
import { MutableRefObject, useRef, useState } from 'react'
import { createCode } from '../utils/qr'
import Zip from 'jszip'
import FileSaver from 'file-saver'
import { PuffLoader } from 'react-spinners'
import QRCodeStyling from 'qr-code-styling'

export default function Home() {
  const [loading, setLoading] = useState(false)

  const qrsRef = useRef<any>()
  const countRef = useRef<HTMLInputElement>()

  const handleCreateQr = async () => {
    setLoading(true)
    const start = performance.now()
    const count = parseInt(countRef.current?.value || '1')
    const codes: QRCodeStyling[] = []

    console.log(`Creating ${count} codes...`)

    for (let i = 0; i < Math.floor(count / 100); i += 1) {
      const chunk = await createCode(100)
      codes.push(...chunk)
      console.log(`Chunk ${i + 1} is ready.`)
    }

    const remaining = count % 100
    console.log(`${remaining} remaining...`)
    codes.push(...(await createCode(remaining)))

    console.log('Chunks created. Zipping files...')

    const zip = new Zip()

    for (const code of codes) {
      const name = `${code._options.data}.svg`
      const data = await code.getRawData('svg')
      if (data) zip.file(name, data)
    }

    console.log(`Zipped ${codes.length} files. Generating downloadable zip...`)

    const file = await zip.generateAsync({ type: 'blob' })

    console.log(
      `Created ${count} codes in ${(performance.now() - start) / 1000} seconds!`
    )
    FileSaver.saveAs(file, 'codes.zip')

    setLoading(false)
  }

  return (
    <main className="centered">
      <Head>
        <link rel="stylesheet" href="https://fat-ui.vercel.app/main.css" />
        <title>Create fancy QR codes for UUIDs | FAT Codes</title>
      </Head>

      <h1 className="mb-2">FAT Codes</h1>

      <p className="body-text mb-6">Create fancy QR codes for UUIDs.</p>

      {loading ? (
        <div>
          <PuffLoader color="#f47820" />
        </div>
      ) : (
        <div className="centered mb-2">
          <input
            className="mr-2 mb-2"
            placeholder="Count"
            ref={countRef as MutableRefObject<HTMLInputElement>}
            type="number"
          />

          <button className="royal" onClick={() => handleCreateQr()}>
            <img
              style={{ filter: 'invert(1)' }}
              width={24}
              src="/qr.png"
              alt="QR Icon"
            />
            Create
          </button>
        </div>
      )}

      <div className="my-8" ref={qrsRef}></div>

      <footer style={{ fontSize: '.6em', color: '#aaa' }}>
        Created with{' '}
        <a
          className="text-royal"
          target="_blank"
          rel="noopener noreferrer"
          href="https://fat-ui.vercel.app"
        >
          Fat UI
        </a>{' '}
        by{' '}
        <a
          className="text-royal"
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/meszarosdezso"
        >
          @meszarosdezso
        </a>
        <br />
        2022 © MIT License
      </footer>
    </main>
  )
}
