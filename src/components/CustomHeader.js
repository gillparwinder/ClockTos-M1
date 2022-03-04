import React, {Component} from 'react';
import {Text, View, TouchableOpacity, StatusBar} from 'react-native';
import ResponsiveSize from '../config/ResponsiveSize';
import config from '../config/config';
import Orientation from 'react-native-orientation-locker';
import CustomFastImage from './common/CustomFastImage';
export class CustomHeader extends Component {
  render() {
    let {
      navigation,
      isHome,
      title,
      notification,
      changeOrientation,
    } = this.props;
    return (
      <View
        style={{
          height: 50,
          flexDirection: 'row',
          borderBottomColor: 'silver',
          borderBottomWidth: 0.5,
          backgroundColor: 'transparent',
          alignItems: 'center',
        }}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"></StatusBar>
        {isHome ? (
          <TouchableOpacity
            onPress={() => {
              navigation.openDrawer();
            }}
            style={{
              width: '15%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <CustomFastImage
              style={{width: 25, height: 25}}
              source={require('../assets/menuIcon.png')}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        ) : isHome == null ? (
          <View
            style={{
              width: '15%',
              justifyContent: 'center',
              alignItems: 'center',
            }}></View>
        ) : (
          <TouchableOpacity
            style={{
              width: '15%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              if (changeOrientation) {
                Orientation.lockToPortrait();
              }
              navigation.goBack();
            }}>
            <CustomFastImage
              style={{width: 22, height: 22}}
              source={require('../assets/back2.png')}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        )}
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: 'Poppins-Regular',
              textTransform: 'uppercase',
              alignSelf: 'center',
              fontWeight: '400',
              fontSize: ResponsiveSize(config.AppAllHeaderSize),
            }}>
            {title}
          </Text>
        </View>
        {notification ? (
          <TouchableOpacity
            style={{
              width: '15%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              navigation.navigate('Notifications');
            }}>
            <CustomFastImage
              style={{width: 40, height: 40}}
              source={require('../assets/bell.png')}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            disabled
            style={{
              width: '15%',
              justifyContent: 'center',
              alignItems: 'center',
            }}></TouchableOpacity>
        )}
      </View>
    );
  }
}
