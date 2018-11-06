import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, info);
    // console.log(
    //   'componentDidCatch. error: ',
    //   error,
    //   'info.componentStack: ',
    //   info.componentStack
    // );
  }

  render() {
    if (this.state.hasError) {
      return (
        <p>
          Sorry, something went wrong in this section. <br />Please try and
          refresh the page. <br />You can contact dev@xiaoju.io for support.
        </p>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
