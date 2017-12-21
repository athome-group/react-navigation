// @flow

import * as React from 'react';
import { Dimensions, InteractionManager } from 'react-native';
import hoistNonReactStatic from 'hoist-non-react-statics';
import Orientation from 'react-native-orientation';

type WindowDimensions = {
  width: number,
  height: number,
};

type InjectedProps = {
  isLandscape: boolean,
};

type State = {
  isLandscape: boolean,
};

export const isOrientationLandscape = ({
  width,
  height,
}: WindowDimensions): boolean => width > height;

export default function<T: {}>(
  WrappedComponent: React.ComponentType<T & InjectedProps>
) {
  class withOrientation extends React.Component<T, State> {
    constructor() {
      super();

      const isLandscape = isOrientationLandscape(Dimensions.get('window'));
      this.state = { isLandscape };
    }

    componentDidMount() {
      Orientation.addOrientationListener(this.handleOrientationChange);

    }

    componentWillUnmount() {
      Orientation.removeOrientationListener(this.handleOrientationChange);

    }

    handleOrientationChange = orientation => {
      setTimeout(() => {
        this.setState({ isLandscape: orientation === "LANDSCAPE" });
      }, 0);
    };

    render() {
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  }

  return hoistNonReactStatic(withOrientation, WrappedComponent);
}
