import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'primereact/button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('News component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="card flex flex-column justify-content-center align-items-center min-h-screen gap-4" data-testid="error-boundary">
          <i className="pi pi-exclamation-circle text-6xl text-red-500"></i>
          <h2 className="text-xl font-bold text-900">Something went wrong</h2>
          <p className="text-600">{this.state.error?.message}</p>
          <Button 
            label="Retry" 
            icon="pi pi-refresh" 
            onClick={() => {
              this.setState({ hasError: false, error: null });
              if (this.props.onRetry) {
                this.props.onRetry();
              }
            }} 
          />
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  onRetry: PropTypes.func
};

export default ErrorBoundary;
