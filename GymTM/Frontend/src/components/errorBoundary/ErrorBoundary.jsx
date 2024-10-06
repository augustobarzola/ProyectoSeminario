import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error no controlado:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="d-flex flex-column justify-content-center align-items-center">
          <h1>Oops.</h1>
          <h2>Algo salió mal.</h2>
        </div>
      )
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;