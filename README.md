# react-native-transformable-image

A pure JavaScript written transformable image component, like PhotoView or ImageViewer, supports gestures like pan, pinch, double tab and fling, works with both iOS and Android.

![](Demo/demo.gif)



Written in pure JS, this component should be one of the most easy to use component among all the zoomable, scrollable PhotoView alike views on react-native. 

## Install

 `npm install --save react-native-transformable-image@latest`



## Usage

Quite same as the official **[Image](https://facebook.github.io/react-native/docs/image.html)**, as below shows:

```
import Image from 'react-native-transformable-image';
...
render() {
    return (
      ...
        <Image
          style={{width: width, height: height}}
          source={{uri: 'https://raw.githubusercontent.com/yoaicom/resources/master/images/game_of_thrones_1.jpg'}}
          //pixels={{width: 3607, height: 2400}}
        />
      ...
    );
  }
```

You can provide `enableTransform`, `enableScale` and `enableTranslate`  props to control corresponding features.

#### Other props

* `onTransformGestureReleased` and `onViewTransformed`: 

​	inherited from [react-native-view-transformer](https://github.com/ldn0x7dc/react-native-view-transformer)

### Attention

* If you are using  react-native v0.27 and below, or if the image source is local (`source={require('...')}`), you should provide the **pixels** prop, like `pixels={{width: 3607, height: 2400}}` (ask your API server to provide the pixels info for remote images). This prop is used to align the edge of the image content with the view's boundry and to determine the max scale.
* By default, the offical iOS Image component will downsample if the image is larger than the view size. `react-native-transformable-image` disables downsampling to keep more image details when zoomed in. This could cause memory issues if your image is too large.



## Image Gallery

If you are looking for an image gallery component, please refer to [**react-native-gallery**](https://github.com/ldn0x7dc/react-native-gallery), which is based on this component.