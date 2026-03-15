import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Section name shown in the fallback UI */
  section?: string;
  /** Use compact fallback for individual sections (not full-page) */
  compact?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In production, send to error tracking (e.g. Sentry)
    console.error(`[ErrorBoundary] ${this.props.section ?? 'App'} crashed:`, error, info.componentStack);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    if (this.props.compact) {
      return (
        <div
          role="alert"
          className="flex items-center justify-center py-16 px-8 text-center"
          style={{ minHeight: '200px' }}
        >
          <div>
            <p className="text-sm text-gray-500 mb-3">
              Không thể tải phần <strong>{this.props.section}</strong>.
            </p>
            <button
              onClick={this.handleReset}
              className="text-xs underline text-[#1E2761] hover:text-[#E63946] transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      );
    }

    return (
      <div
        role="alert"
        className="min-h-screen flex items-center justify-center bg-[#F5F7FA] px-6"
      >
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-[#CADCFC] flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-[#1E2761]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl text-[#1E2761] mb-3">
            Đã xảy ra lỗi
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Trang gặp sự cố không mong muốn. Vui lòng tải lại trang hoặc thử lại sau.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary text-sm"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }
}
