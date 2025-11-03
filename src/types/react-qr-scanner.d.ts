declare module 'react-qr-scanner' {
  import { Component } from 'react'

  export interface QrScannerProps {
    delay?: number
    onError?: (error: any) => void
    onScan?: (data: any) => void
    style?: React.CSSProperties
    className?: string
    constraints?: MediaStreamConstraints
    legacyMode?: boolean
  }

  export default class QrScanner extends Component<QrScannerProps> {}
}
