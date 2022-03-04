import React, {Component} from 'react';
import {View, Text} from 'react-native';
import FastImage from 'react-native-fast-image';

export default class AuthFastImage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <FastImage
        style={this.props.style}
        source={this.props.source}
        resizeMode={this.props.resizeMode}
        //resizeMode={FastImage.resizeMode.this.props.resizeMode}
      />
    );
  }
}

// calling function

//<CustomFastImage
//              source={uriname}
//              resizeMode={'contain'}
//              style={{width: '100%', height: '100%'}}
//            />
