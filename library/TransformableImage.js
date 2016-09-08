'use strict';

import React, { Component, PropTypes } from 'react';
import { Image, View, PixelRatio } from 'react-native';

import ViewTransformer from 'react-native-view-transformer';

let DEV = false;

export default class TransformableImage extends Component {

  static enableDebug() {
    DEV = true;
  }

  static propTypes = {
    pixels: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
    }),

    enableTransform: PropTypes.bool,
    enableScale: PropTypes.bool,
    enableTranslate: PropTypes.bool,
    initialScale: PropTypes.number,
    automaticInitialCoverScale: PropTypes.bool,
    onTransformGestureReleased: PropTypes.func,
    onViewTransformed: PropTypes.func
  };

  static defaultProps = {
    enableTransform: true,
    enableScale: true,
    enableTranslate: true,
    initialScale: null,
    updateTransform: false,
    automaticInitialCoverScale: false,
  };

  constructor(props) {
    super(props);

    this.setInitialCoverScale = this.setInitialCoverScale.bind(this);
    this.state = {
      width: 0,
      height: 0,

      initialScale: props.initialScale,
      imageLoaded: false,
      pixels: undefined,
      keyAcumulator: 1
    };
  }

  componentWillMount() {
    if (!this.props.pixels) {
      this.getImageSize(this.props.source);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!sameSource(this.props.source, nextProps.source)) {
      this.setState({ keyAcumulator: this.state.keyAcumulator + 1 })

      // Make sure new image resets its initial cover scale
      if (nextProps.automaticInitialCoverScale) {
        this.setState({ updateTransform: true })
      }

      // image source changed, clear last image's pixels info if any
      if (typeof nextProps.pixels == 'undefined') {
        this.getImageSize(nextProps.source);
      } else {
        this.setInitialCoverScale(this.state.width, this.state.height);
      }
    }
  }

  render() {
    let maxScale = 1;
    let contentAspectRatio = undefined;
    let { width, height } = this.getWidthAndHeight();
    let initialScale = this.state.initialScale;

    if (width && height) {
      contentAspectRatio = width / height;

      if (this.state.width && this.state.height) {
        maxScale = Math.max(width / this.state.width, height / this.state.height);
        maxScale = Math.max(1, maxScale);
      }

      if (maxScale < initialScale && initialScale != null) {
        maxScale = initialScale + 2
      }
    }

    if (initialScale == null && this.props.automaticInitialCoverScale) {
      return <View onLayout={this.onLayout.bind(this)} style={this.props.style} ></View>
    }

    return (
      <ViewTransformer
        ref='viewTransformer'
        key={'viewTransformer#' + this.state.keyAccumulator} //when image source changes, we should use a different node to avoid reusing previous transform state
        enableTransform={this.props.enableTransform && this.state.imageLoaded} //disable transform until image is loaded
        enableScale={this.props.enableScale}
        enableTranslate={this.props.enableTranslate}
        enableResistance={true}
        enableLimits={true}
        onTransformGestureReleased={this.props.onTransformGestureReleased}
        onViewTransformed={this.props.onViewTransformed}
        maxScale={maxScale}
        initialScale={initialScale == null ? 1 : initialScale}
        contentAspectRatio={contentAspectRatio}
        onLayout={this.onLayout.bind(this)}
        style={this.props.style}
      >
        <Image
          {...this.props}
          style={[this.props.style, {backgroundColor: 'transparent'}]}
          resizeMode={'contain'}
          onLoadStart={this.onLoadStart.bind(this)}
          onLoad={this.onLoad.bind(this)}
          capInsets={{left: 0.1, top: 0.1, right: 0.1, bottom: 0.1}} //on iOS, use capInsets to avoid image downsampling
        />
      </ViewTransformer>
    );
  }

  onLoadStart(e) {
    this.props.onLoadStart && this.props.onLoadStart(e);
    this.setState({
      imageLoaded: false
    });
  }

  onLoad(e) {
    this.props.onLoad && this.props.onLoad(e);
    this.setState({
      imageLoaded: true
    });
  }

  getWidthAndHeight() {
    let width, height;

    if (this.props.pixels) {
      // If provided via props
      width = this.props.pixels.width;
      height = this.props.pixels.height;
    } else if (this.state.pixels) {
      // If got using Image.getSize()
      width = this.state.pixels.width;
      height = this.state.pixels.height;
    }

    return { width, height }
  }

  setInitialCoverScale(viewWidth, viewHeight) {
    // automatic cover scale using a rule of three
    let { width, height } = this.getWidthAndHeight();

    if (
      viewWidth == 0 || viewHeight == 0 ||
      typeof width == 'undefined' || typeof height == 'undefined'
    ) {
      return
    }

    let initialScale = this.props.initialScale;

    viewHeight = PixelRatio.getPixelSizeForLayoutSize(viewHeight)
    viewWidth = PixelRatio.getPixelSizeForLayoutSize(viewWidth)

    if (this.props.automaticInitialCoverScale) {

      if (height > width) {
        var proportionalImageHeight = (viewHeight * width) / viewWidth;

        if (proportionalImageHeight > height) {
          initialScale = proportionalImageHeight / height;
        } else {
          initialScale = height / proportionalImageHeight;
        }
      } else {
        var proportionalImageWidth = (viewWidth * height) / viewHeight;

        if (proportionalImageWidth > width) {
          initialScale = proportionalImageWidth / width;
        } else {
          initialScale = width / proportionalImageWidth;
        }
      }
    }

    let newState = { initialScale: initialScale }
    if (this.state.updateTransform) {
      this.refs['viewTransformer'].updateTransform({
        scale: initialScale,
        translateX: 0,
        translateY: 0,
      });
      newState['updateTransform'] = false
    }

    this.setState(newState)
    return initialScale;
  }

  onLayout(e) {
    let { width, height } = e.nativeEvent.layout;

    if (this.state.width !== width || this.state.height !== height) {
      let newState = {
        width: width,
        height: height,
      };

      if (this.state.initialScale == null && this.props.automaticInitialCoverScale) {
        this.setInitialCoverScale(width, height);
      }

      this.setState(newState);
    }
  }

  getImageSize(source) {
    if(!source) return;

    DEV && console.log('getImageSize...' + JSON.stringify(source));

    if (typeof Image.getSize === 'function') {
      if (source && source.uri) {
        Image.getSize(
          source.uri,
          (width, height) => {
            DEV && console.log('getImageSize...width=' + width + ', height=' + height);
            if (width && height) {
              this.setState(
                {pixels: {width, height}},
                () => {
                  this.setInitialCoverScale(this.state.width, this.state.height)
                }
              );

              if (this.props.onSizeFound) {
                this.props.onSizeFound({width, height});
              }
            }
          },
          (error) => {
            console.error('getImageSize...error=' + JSON.stringify(error) + ', source=' + JSON.stringify(source));
          })
      } else {
        console.warn('getImageSize...please provide pixels prop for local images');
      }
    } else {
      console.warn('getImageSize...Image.getSize function not available before react-native v0.28');
    }
  }

  getViewTransformerInstance() {
    return this.refs['viewTransformer'];
  }
}

function sameSource(source, nextSource) {
  if (source === nextSource) {
    return true;
  }
  if (source && nextSource) {
    if (source.uri && nextSource.uri) {
      return source.uri === nextSource.uri;
    }
  }
  return false;
}
