'use strict';

import React, { Component } from 'react';
import { Image } from 'react-native';

import ViewTransformer from 'react-native-view-transformer';

export default class TransformableImage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      imageLoaded: false,
      pixels: undefined
    };
  }

  getImageSize(source) {
    console.log('getImageSize...' + JSON.stringify(source));

    let successCallback = ((width, height) => {
      console.log('getImageSize...width=' + width + ', height=' + height);
      if(width && height) {
        this.setState({
          pixels: {width, height}
        });
      }
    }).bind(this);

    if(typeof Image.getSize === 'function') {
      if (source && source.uri) {
        Image.getSize(source.uri, successCallback, (error) => {
          console.log('getImageSize...error=' + JSON.stringify(error));
        })
      } else {
        console.log('getImageSize...please provide pixels prop for local images');
      }
    } else {
      console.log('getImageSize...Image.getSize function not available before rn v0.28');
    }
  }

  componentWillMount() {
    if(!this.props.pixels) {
      this.getImageSize(this.props.source);
    }
  }

  componentWillReceiveProps(nextProps) {
    if(!this.sameSource(this.props.source, nextProps.source)) {
      //image source changed, clear last image's pixels info if any
      this.setState({
        pixels: undefined,
      })
      this.getImageSize(nextProps.source);
    }
  }

  sameSource(source, nextSource) {
    if(source === nextSource) {
      return true;
    }
    if(source && nextSource) {
      if(source.uri && nextSource.uri) {
        return source.uri === nextSource.uri;
      }
    }
    return false;
  }

  render() {
    let maxScale = 1;
    let contentAspectRatio = undefined;

    let width, height;
    if(this.props.pixels) {
      width = this.props.pixels.width;
      height = this.props.pixels.height;
    } else if(this.state.pixels) {
      width = this.state.pixels.width;
      height = this.state.pixels.height;
    }

    if (width && height) {
      contentAspectRatio = width / height;
      if (this.state.width && this.state.height) {
        maxScale = Math.max(width / this.state.width, height / this.state.height);
        maxScale = Math.max(1, maxScale);
      }
    }

    return (
      <ViewTransformer
        key={JSON.stringify(this.props.source)} //when image source changes, we should use a different node to avoid reusing previous transform state
        enableTransform={this.state.imageLoaded} //disable transform until image is loaded
        enableResistance={true}
        maxScale={maxScale}
        contentAspectRatio={contentAspectRatio}
        onLayout={this.onLayout.bind(this)}
        style={{backgroundColor: 'black'}}>
        <Image
          {...this.props}
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

  onLayout(e) {
    let {width, height} = e.nativeEvent.layout;
    this.setState({
      width: width,
      height: height
    });
  }
}