import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu.'
    return { hasError: true, message }
  }

  componentDidCatch(error: unknown, errorInfo: ErrorInfo) {
    console.error('UI crash:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
          <div className="max-w-3xl mx-auto card p-6">
            <h1 className="text-xl font-bold text-red-300">Uygulama Hatası</h1>
            <p className="text-gray-300 mt-2">Sayfa beklenmeyen bir hata nedeniyle render edilemedi.</p>
            <p className="text-sm text-amber-300 mt-3">Detay: {this.state.message}</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
