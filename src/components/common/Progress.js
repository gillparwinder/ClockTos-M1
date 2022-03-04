import * as Progress from 'react-native-progress';
import React, {Component} from 'react';
import {Text, TouchableOpacity, View, Image} from 'react-native';

export class CustomProgress extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let {progress, width, color, count} = this.props;
    return (
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          height: '100%',
          alignItems: 'center',
        }}>
        <Progress.Bar
          color={color}
          progress={progress}
          width={width}></Progress.Bar>

        <Text
          style={{
            fontWeight: 'bold',
            color: color,
            marginLeft: 5,
          }}>
          {count.toFixed(0)}
        </Text>
      </View>
    );
  }
}
