import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {ImageBackground} from 'react-native';
import {
  Dimensions,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  View,
  Text,
  SafeAreaView,
  Image,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import config from '../config/config';
import CustomFastImage from './common/CustomFastImage';
const ScreenHeight = Dimensions.get('window').height;
const ScreenWidth = Dimensions.get('window').width;
export default class BottomTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Home: true,
      active: 'home',
    };
  }

  render() {
    const {navigation, active, onPress} = this.props;
    return this.props.isStudent == 'true' || this.props.isStudent == true ? (
      <View
        style={{
          width: '100%',
          backgroundColor: 'transparent',
          alignSelf: 'center',
          height: 100,
          borderRadius: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
        }}>
        {
          active == 'home' ? (
            //<SimpleAnimation style={{ width: "100%", height: "100%", resizeMode: "stretch", position: "absolute" }} delay={500} duration={1000} fade staticType='zoom'>
            <CustomFastImage
              style={{
                width: '95%',
                alignSelf: 'center',
                height: '100%',
                position: 'absolute',
              }}
              source={require('../assets/tab1.png')}
              resizeMode={'stretch'}
            />
          ) : //</SimpleAnimation>
          active == 'subject' ? (
            //<SimpleAnimation style={{ width: "100%", height: "100%", resizeMode: "stretch", position: "absolute" }} delay={500} duration={1000} fade staticType='zoom'>

            <CustomFastImage
              style={{
                width: '95%',
                alignSelf: 'center',
                height: '100%',
                position: 'absolute',
              }}
              source={require('../assets/tab2.png')}
              resizeMode={'stretch'}
            />
          ) : //</SimpleAnimation>
          active == 'Time Table' ? (
            // <SimpleAnimation style={{ width: "100%", height: "100%", resizeMode: "stretch", position: "absolute" }} delay={500} duration={1000} fade staticType='zoom'>
            <CustomFastImage
              style={{
                width: '95%',
                alignSelf: 'center',
                height: '100%',
                position: 'absolute',
              }}
              source={require('../assets/tab3.png')}
              resizeMode={'stretch'}
            />
          ) : //</SimpleAnimation>
          active == 'result' ? (
            // <SimpleAnimation style={{ width: "100%", height: "100%", resizeMode: "stretch", position: "absolute" }} delay={500} duration={1000} fade staticType='zoom'>
            <CustomFastImage
              style={{
                width: '95%',
                alignSelf: 'center',
                height: '100%',
                position: 'absolute',
              }}
              source={require('../assets/tab4.png')}
              resizeMode={'stretch'}
            />
          ) : (
            //</SimpleAnimation>
            //<SimpleAnimation style={{ width: "100%", height: "100%", resizeMode: "stretch", position: "absolute" }} delay={500} duration={1000} fade staticType='zoom'>
            <CustomFastImage
              style={{
                width: '95%',
                alignSelf: 'center',
                height: '100%',
                position: 'absolute',
              }}
              source={require('../assets/tab1.png')}
              resizeMode={'stretch'}
            />
          )
          //</SimpleAnimation>
        }
        <TouchableOpacity
          onPress={() => {
            onPress('home');
          }}
          style={{
            width: '25%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}></TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onPress('subject');
          }}
          style={{
            width: '25%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}></TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onPress('Time Table');
          }}
          style={{
            width: '25%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}></TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onPress('result');
          }}
          style={{
            width: '25%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}></TouchableOpacity>
      </View>
    ) : (
      <View
        style={{
          width: '100%',
          backgroundColor: 'transparent',
          alignSelf: 'center',
          height: 100,
          borderRadius: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
        }}>
        {
          active == 'home' ? (
            //<SimpleAnimation style={{ width: "100%", height: "100%", resizeMode: "stretch", position: "absolute" }} delay={500} duration={1000} fade staticType='zoom'>
            <CustomFastImage
              style={{
                width: '95%',
                alignSelf: 'center',
                height: '100%',
                position: 'absolute',
              }}
              source={require('../assets/tab1.png')}
              resizeMode={'stretch'}
            />
          ) : //</SimpleAnimation>
          active == 'subject' ? (
            //<SimpleAnimation style={{ width: "100%", height: "100%", resizeMode: "stretch", position: "absolute" }} delay={500} duration={1000} fade staticType='zoom'>

            <CustomFastImage
              style={{
                width: '95%',
                alignSelf: 'center',
                height: '100%',
                position: 'absolute',
              }}
              source={require('../assets/tab2.png')}
              resizeMode={'stretch'}
            />
          ) : //</SimpleAnimation>
          active == 'Time Table' ? (
            // <SimpleAnimation style={{ width: "100%", height: "100%", resizeMode: "stretch", position: "absolute" }} delay={500} duration={1000} fade staticType='zoom'>
            <CustomFastImage
              style={{
                width: '95%',
                alignSelf: 'center',
                height: '100%',
                position: 'absolute',
              }}
              source={require('../assets/tab3.png')}
              resizeMode={'stretch'}
            />
          ) : //</SimpleAnimation>
          active == 'result' ? (
            // <SimpleAnimation style={{ width: "100%", height: "100%", resizeMode: "stretch", position: "absolute" }} delay={500} duration={1000} fade staticType='zoom'>
            <CustomFastImage
              style={{
                width: '95%',
                alignSelf: 'center',
                height: '100%',
                position: 'absolute',
              }}
              source={require('../assets/tab4.png')}
              resizeMode={'stretch'}
            />
          ) : (
            //</SimpleAnimation>
            //<SimpleAnimation style={{ width: "100%", height: "100%", resizeMode: "stretch", position: "absolute" }} delay={500} duration={1000} fade staticType='zoom'>
            <CustomFastImage
              style={{
                width: '95%',
                alignSelf: 'center',
                height: '100%',
                position: 'absolute',
              }}
              source={require('../assets/tab1.png')}
              resizeMode={'stretch'}
            />
          )
          //</SimpleAnimation>
        }
        <TouchableOpacity
          onPress={() => {
            onPress('home');
          }}
          style={{
            width: '25%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}></TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onPress('subject');
          }}
          style={{
            width: '25%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}></TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onPress('Time Table');
          }}
          style={{
            width: '25%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}></TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onPress('result');
          }}
          style={{
            width: '25%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}></TouchableOpacity>
      </View>
    );
  }
}
