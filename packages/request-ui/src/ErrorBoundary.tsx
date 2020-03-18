import React from "react";
import StackdriverErrorReporter from "stackdriver-errors-js";

interface IProps {
  stackdriverErrorReporterApiKey?: string;
  projectId?: string;
  service?: string;
  component: React.FunctionComponent<any>;
}

interface IState {
  hasError: boolean;
}

/**
 * Limits propagation of errors, and reports error in production using GoogleStackDriver
 */
export class ErrorBoundary extends React.Component<IProps, IState> {
  private reporter: StackdriverErrorReporter;
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
    this.reporter = new StackdriverErrorReporter();
  }

  async componentDidMount() {
    await this.reporter.start({
      key: this.props.stackdriverErrorReporterApiKey,
      projectId: this.props.projectId,
      service: this.props.service,
      disabled: window.location.hostname === "localhost",
    });
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    this.reporter.report(error);
  }

  render() {
    if (this.state.hasError) {
      const Component = this.props.component;
      return <Component />;
    }
    return this.props.children;
  }
}
