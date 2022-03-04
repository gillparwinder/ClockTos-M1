import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import ResponsiveSize from '../config/ResponsiveSize';
import config from '../config/config';
import {CustomButton} from './common/Button';
export class NotificationAlert extends Component {
  render() {
    let {
      navigation,
      onPressView,
      onPressCancel,
      body,
      title,
      Show,
    } = this.props;
    return !Show ? (
      <View style={styles.basicStyle}>
        <View
          style={[
            styles.basicHovorStyle,
            {
              minHeight: ResponsiveSize(20),
              width: '90%',
              //  position: 'absolute',
              //  zIndex: 2,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: 'white',
            },
          ]}>
          <Text
            style={[
              styles.textBasicStyle,
              {
                fontWeight: 'bold',
                marginVertical: 5,
                fontSize: ResponsiveSize(config.AppAllHeaderSize),
              },
            ]}>
            {title ? title : 'Push Notification'}
          </Text>
          <Text style={[styles.textBasicStyle]}>{body}</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'space-evenly',
              marginVertical: 10,
            }}>
            <CustomButton
              width={150}
              title="Cancel"
              onPress={() => {
                onPressCancel();
              }}
            />
            <CustomButton
              width={150}
              title="View"
              onPress={() => {
                onPressView();
              }}
            />
          </View>
        </View>
      </View>
    ) : null;
  }
}
const styles = StyleSheet.create({
  basicStyle: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBasicStyle: {
    fontFamily: 'Poppins-Regular',
    color: 'black',
    textTransform: 'capitalize',
    padding: 10,
  },
  basicHovorStyle: {
    elevation: 3,
    shadowColor: 'silver',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    backgroundColor: 'white',
    borderRadius: 10,
  },
});
