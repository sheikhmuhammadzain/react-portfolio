import { Component } from "react";
import PropTypes from "prop-types";

// Last-resort safety net: if any render (including a lazy chunk that failed even
// after lazyWithRetry's reload) throws, show a recoverable message instead of a
// blank page.
class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("App crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center text-neutral-300">
          <p className="text-lg">Something went wrong loading the page.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-full bg-neutral-800 px-5 py-2 text-sm text-neutral-200 transition-colors hover:bg-neutral-700"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
};

export default ErrorBoundary;
