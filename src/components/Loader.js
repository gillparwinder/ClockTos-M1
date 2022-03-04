import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {CustomButton} from './common/Button';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import config from '../config/config';
import FastImage from 'react-native-fast-image';
export class Loader extends Component {
  constructor() {
    super();
    this.state = {CancelAction: false};
  }

  render() {
    let {navigation, Loading, onPressCancel} = this.props;
    return Loading ? (
      <View
        style={{
          height: '100%',
          width: '100%',
          position: 'absolute',
          zIndex: 20,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, .2)',
        }}>
        <View
          style={{
            justifyContent: 'space-evenly',
            alignItems: 'center',
            width: this.state.CancelAction ? 250 : 150,
            minHeight: 100,
            padding: 10,
            //maxHeight: 200,
            backgroundColor: 'white',
            borderRadius: 15,
            shadowColor: 'gray',
            shadowOffset: {width: 1, height: 1},
            shadowOpacity: 0.7,
            elevation: 5,
          }}>
          <FastImage
            style={{height: 40, width: 100}}
            source={require('../assets/timeLoader.gif')}
            resizeMode={FastImage.resizeMode.contain}
          />
          <FastImage
            style={{height: 40, width: 100}}
            source={require('../assets/loading.gif')}
            resizeMode={FastImage.resizeMode.contain}
          />
          {this.state.CancelAction ? (
            <Text style={{color: 'red', marginVertical: 10}}>
              Network getting slow please wait...
            </Text>
          ) : null}
          {this.state.CancelAction ? (
            <CustomButton
              width={150}
              title="Cancel"
              onPress={() => {
                onPressCancel();
              }}
            />
          ) : null}
        </View>
        <CountdownCircleTimer
          size={1}
          strokeWidth={1}
          isPlaying={true}
          duration={100000}
          onComplete={() => {
            this.setState({CancelAction: true});
          }}
          //colors={[['transparent', 0.4]]}
          colors={[
            [config.themeColor, 0.4],
            [config.SubThemeColor, 0.2],
            ['#A30000', 0.2],
          ]}>
          {({remainingTime}) => (
            <Text style={{color: 'transparent'}}>{remainingTime}</Text>
          )}
        </CountdownCircleTimer>
      </View>
    ) : null;
  }
}
