// ErrorBoundary.js
import React, { Component } from "react";
import PropTypes from "prop-types";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
          <div className="max-w-xl w-full bg-gray-800 rounded-lg p-6 shadow-xl">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Something went wrong.</h1>
            <div className="bg-black/50 p-4 rounded overflow-auto max-h-96">
              <p className="font-mono text-sm text-red-300 mb-2">{this.state.error?.toString()}</p>
              <pre className="font-mono text-xs text-gray-400 whitespace-pre-wrap">
                {this.state.errorInfo?.componentStack}
              </pre>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 bg-primary px-4 py-2 rounded hover:bg-primary/80 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
