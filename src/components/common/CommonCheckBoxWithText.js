import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {View, Text} from 'react-native';
import {AnimatedCheckBox} from './AnimatedCheckBox';

export default class CommonCheckBoxWithText extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <AnimatedCheckBox
          size={20}
          disableBuiltInState={true}
          isChecked={this.props.isChecked ? true : false}
          fillColor={this.props.fillColor}
          unfillColor={this.props.unfillColor}
          //text="Custom Checkbox"
          iconStyle={{
            borderRadius: 5,
            borderColor: this.props.fillColor,
          }}
          textStyle={{fontFamily: 'Poppins-Regular'}}
          onPress={() => {
            this.props.onPress();
          }}
        />
        <Text
          onPress={() => {
            this.props.onPress();
          }}
          style={{color: this.props.textColor, marginLeft: -10}}>
          {this.props.text}
        </Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({});
