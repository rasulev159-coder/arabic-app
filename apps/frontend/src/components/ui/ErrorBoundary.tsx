import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './Button';

interface Props { children: ReactNode; }
interface State { error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
          <p className="font-scheherazade text-6xl text-gold">⚠️</p>
          <h2 className="font-cinzel text-xl text-[#f0e6cc] tracking-widest">Что-то пошло не так</h2>
          <p className="font-raleway text-sm text-[#9a8a6a] max-w-xs leading-relaxed">
            {this.state.error.message}
          </p>
          <Button onClick={() => this.setState({ error: null })}>
            Попробовать снова
          </Button>
          <button
            onClick={() => window.location.href = '/'}
            className="font-cinzel text-xs text-[#9a8a6a] hover:text-gold transition-colors tracking-widest uppercase"
          >
            На главную
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
