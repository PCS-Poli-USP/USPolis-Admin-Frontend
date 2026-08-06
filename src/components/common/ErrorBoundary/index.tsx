import { Component, ErrorInfo, ReactNode } from 'react';
import PageError from '../../../pages/pageError';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

// Catches render-time exceptions anywhere in the app (e.g. reading a field
// that doesn't exist) and replaces the crashed tree with a full "Erro" page
// instead of leaving the user on a blank white screen. Only render-phase
// errors are caught - errors thrown inside event handlers or async
// callbacks (promises, setTimeout, etc) do NOT reach this boundary.
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erro não tratado capturado pelo ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return <PageError error={this.state.error} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
