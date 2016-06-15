'use strict';

import React, { Component } from 'react';
import {
  Text,
  View,
  Dimensions
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

  changeImage(uri) {
    this.setState({
      uri: uri
    })
  }
}