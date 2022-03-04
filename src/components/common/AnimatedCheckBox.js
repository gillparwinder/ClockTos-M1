import React, {Component} from 'react';
import {Text, TouchableOpacity, View, Image} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

export class AnimatedCheckBox extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let {
      size,
      disableBuiltInState,
      isChecked,
      fillColor,
      unfillColor,
      text,
      iconStyle,
      textStyle,
      onPress,
    } = this.props;
    return (
      <BouncyCheckbox
        size={size}
        disableBuiltInState={disableBuiltInState}
        isChecked={isChecked}
        fillColor={fillColor}
        unfillColor={unfillColor}
        text={text}
        iconStyle={iconStyle}
        textStyle={textStyle}
        onPress={() => {
          onPress();
        }}
      />
    );
  }
}
