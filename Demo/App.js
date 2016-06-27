'use strict';

import React, { Component } from 'react';
import {
  Text,
  View,
  Dimensions,
  ScrollView
} from 'react-native';

import Image from 'react-native-transformable-image';

const {width, height} = Dimensions.get('window');
const uri1 = 'https://raw.githubusercontent.com/yoaicom/resources/master/images/game_of_thrones_1.jpg';
const uri2 = 'https://raw.githubusercontent.com/yoaicom/resources/master/images/game_of_thrones_2.jpg';

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      uri: uri1
    }
  }

  render() {
    return this.renderGallery();
    //return this.renderSingle();
    //return this.renderScrollView();
  }

  renderSingle() {
    return (
      <View
        style={{flex: 1, alignItems: 'center'}}>
        <Image
          style={{width: width, height: height}}
          source={{uri: this.state.uri}}
          //pixels={{width: 1920, height: 1080}}
        />

        <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center', position: 'absolute', left: 0, right: 0, bottom: 0, height: 50, backgroundColor: '#6666'}}>
          <Text style={{fontSize: 16, width: width / 2, textAlign: 'center'}}
                onPress={this.changeImage.bind(this, uri1)}>Image 1</Text>
          <Text style={{fontSize: 16, width: width / 2, textAlign: 'center'}}
                onPress={this.changeImage.bind(this, uri2)}>Image 2</Text>
        </View>
      </View>
    );
  }

  renderGallery() {
    return (
      <ScrollView
        onLayout={(e) => {
          console.log('onLayout...' + JSON.stringify(e.nativeEvent.layout))
        }}
        horizontal={true}
        pagingEnabled={true}>
        <Image
          disableTransform={true}
          style={{width: width, height: height}}
          source={{uri: 'http://p10.qhimg.com/t019e9cf51692f735be.jpg'}}/>
        <Image
          disableTransform={true}
          style={{width: width, height: height}}
          source={{uri: 'http://ww2.sinaimg.cn/mw690/714a59a7tw1dxqkkg0cwlj.jpg'}}/>
        <Image
          style={{width: width, height: height}}
          source={{uri: 'http://www.bz55.com/uploads/allimg/150122/139-150122145421.jpg'}}/>
      </ScrollView>
    );
  }

  renderScrollView() {
    return (
      <ScrollView
        style={{flex: 1}}>
        <View
          style={{height: 200}}
        />
        <Image
          style={{width: width, height: height}}
          source={{uri: 'http://p10.qhimg.com/t019e9cf51692f735be.jpg'}}/>
      </ScrollView>
    );
  }

  changeImage(uri) {
    this.setState({
      uri: uri
    })
  }
}