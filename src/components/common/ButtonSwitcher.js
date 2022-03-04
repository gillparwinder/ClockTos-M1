import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import config from '../../config/config';

export default class ButtonSwitcher extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View
        style={{
          width: this.props.width,
          alignSelf: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          //height: 40,
          //flexGrow: 1,
          borderRadius: 10,
          marginVertical: 5,
          borderWidth: 0.5,
          borderColor: this.props.color,
        }}>
        <TouchableOpacity
          onPress={() => {
            this.props.onPress();
          }}
          style={{
            flex: 1,
            margin: 1,
            paddingVertical: 10,
            backgroundColor:
              this.props.selected == this.props.title
                ? this.props.color
                : 'transparent',
            alignItems: 'center',
            borderRadius: 10,
            justifyContent: 'center',
          }}>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: 'Poppins-Regular',
              fontWeight: '600',
              lineHeight: 25,
              color:
                this.props.selected != this.props.title
                  ? this.props.color
                  : 'white',
            }}>
            {this.props.title}
          </Text>
        </TouchableOpacity>
        {this.props.title2 && (
          <TouchableOpacity
            onPress={() => {
              this.props.onPress2();
            }}
            style={{
              flex: 1,
              margin: 1,
              paddingVertical: 10,
              backgroundColor:
                this.props.selected == this.props.title2
                  ? this.props.color
                  : 'transparent',
              alignItems: 'center',
              borderRadius: 10,
              justifyContent: 'center',
            }}>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: 'Poppins-Regular',
                fontWeight: '600',
                lineHeight: 25,
                color:
                  this.props.selected != this.props.title2
                    ? this.props.color
                    : 'white',
              }}>
              {this.props.title2}
            </Text>
          </TouchableOpacity>
        )}
        {this.props.title3 && (
          <TouchableOpacity
            onPress={() => {
              this.props.onPress3();
            }}
            style={{
              flex: 1,
              margin: 1,
              paddingVertical: 10,
              backgroundColor:
                this.props.selected == this.props.title3
                  ? this.props.color
                  : 'transparent',
              alignItems: 'center',
              borderRadius: 10,
              justifyContent: 'center',
            }}>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: 'Poppins-Regular',
                fontWeight: '600',
                lineHeight: 25,
                color:
                  this.props.selected != this.props.title3
                    ? this.props.color
                    : 'white',
              }}>
              {this.props.title3}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
