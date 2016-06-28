# react-native-transformable-image

A transformable image component, like PhotoView or ImageViewer, supports gestures like pan, pinch, double tab and fling, is written in pure JavaScript, supports both iOS and Android.

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

### Attention

The **pixels** prop is used to align the edge of the image content with the view's boundry and to determine the max scale. 

This prop is **optional** if the image is remote (*like `source={{uri: 'http://remoteurl'}}`*) **AND** you are using react-native 0.28+. (**Image.getSize**(available since release [v0.28-rc](https://github.com/facebook/react-native/releases/tag/v0.28.0-rc.0)) is used to get pixels info both on iOS and Android when no pixels prop provided.

If your image is local (*like `source={require('...')}`*) or you are using react-native v0.27 and below, you should provide the **pixels** prop, wraping the image's width and height. (*You can ask your API server to provide image pixels info*).



## Image Gallery

If you are looking for an image gallery component, please refer to [**react-native-gallery**](https://github.com/ldn0x7dc/react-native-gallery), which is based on this component.