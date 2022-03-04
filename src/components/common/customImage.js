import React, {Component} from 'react';
import {Text, TouchableOpacity, View, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import {styles} from '../../auth/style';
export class CustomImage extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let {onPress, title, source} = this.props;
    return (
      <View key={Math.random()} style={styles.BackgroundImageView}>
        <FastImage
          style={styles.BackgroundImage}
          source={source}
          resizeMode={FastImage.resizeMode.stretch}
        />
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.BackgroundImageInnerView}
          onPress={() => {
            onPress();
          }}>
          <Text style={styles.headerTextNew}>{title}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
