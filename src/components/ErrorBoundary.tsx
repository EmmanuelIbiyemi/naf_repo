import React, { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };
  private resetError = () => this.setState({ hasError: false });

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    // Here you could log the error to an external service
  }

  componentDidMount(): void {
    window.addEventListener("online", this.resetError);
  }

  componentWillUnmount(): void {
    window.removeEventListener("online", this.resetError);
  }

  render() {
    if (this.state.hasError) {
      const isOffline =
        typeof navigator !== "undefined" && navigator.onLine === false;

      return (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            display: "grid",
            gap: "0.75rem",
            justifyItems: "center",
            maxWidth: 560,
            margin: "0 auto",
          }}
        >
          <h2 style={{ margin: 0 }}>
            {isOffline ? "You are offline" : "Something went wrong."}
          </h2>
          <p style={{ margin: 0, color: "#5b5f6b" }}>
            {isOffline
              ? "Reconnect to the internet to continue using the dashboard. Once you are back online we will restore your page."
              : "We hit an unexpected error. You can try again or reload the page to continue."}
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button
              style={{
                padding: "0.6rem 1.2rem",
                borderRadius: "10px",
                border: "none",
                background:
                  "linear-gradient(135deg, rgba(2,54,120,1), rgba(0,102,195,1))",
                color: "#fff",
                cursor: "pointer",
              }}
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
            <button
              style={{
                padding: "0.6rem 1.2rem",
                borderRadius: "10px",
                border: "1px solid #d1d4de",
                background: "#f6f7fb",
                color: "#1e2433",
                cursor: "pointer",
              }}
              onClick={this.resetError}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
