import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {StyleSheet, BackHandler} from 'react-native';
import {Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-tiny-toast';
import ResponsiveSize from '../config/ResponsiveSize';
import config from '../config/config';
import {ImageBackground} from 'react-native';
import {SafeAreaView} from 'react-native';
import {CustomHeader} from './CustomHeader';
import {Loader} from './Loader';
import {View} from 'react-native';
import {Image} from 'react-native';
import CustomFastImage from './common/CustomFastImage';
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};

export default class Result extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Loader: false,
      Title: this.props.route.params
        ? this.props.route.params.title
          ? this.props.route.params.title
          : ''
        : '',
    };
  }
  //componentDidMount() {
  //  //this.retrieveData();
  //  this.backHandler = BackHandler.addEventListener(
  //    'hardwareBackPress',
  //    this.handleBackPress,
  //  );
  //}
  //componentWillUnmount() {
  //  this.backHandler.remove();
  //}

  //handleBackPress = () => {
  //  this.props.navigation.goBack(null);
  //  return true;
  //};
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <Loader
          Loading={this.state.Loader ? true : false}
          onPressCancel={() => {
            this.setState({Loader: false});
          }}
        />
        {this.state.Title ? (
          <CustomHeader
            isHome={false}
            title={this.state.Title}
            navigation={this.props.navigation}
          />
        ) : null}
        <TouchableOpacity
          onPress={() => {}}
          style={{
            width: '100%',
            alignSelf: 'center',
            height: 150,
            justifyContent: 'center',
          }}>
          <CustomFastImage
            style={{
              width: '100%',
              alignSelf: 'center',
              height: 150,
              position: 'absolute',
            }}
            source={require('../assets/resultAnnoucement.png')}
            resizeMode={'stretch'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('ResultCam', {
              title: 'Result',
              subTitle: 'CAM',
            });
          }}
          style={{
            width: '95%',
            alignSelf: 'center',
            height: 120,
            marginTop: 10,
            justifyContent: 'center',
          }}>
          <CustomFastImage
            style={{
              width: '100%',
              alignSelf: 'center',
              height: 120,
              position: 'absolute',
              marginBottom: 15,
            }}
            source={require('../assets/camResult.png')}
            resizeMode={'stretch'}
          />
          <View style={styles.SubjectNameTextView}>
            <Text numberOfLines={1} style={styles.SubjectNameTextStyle}>
              CAM
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('ResultCam', {
              title: 'Result',
              subTitle: 'Semester',
            });
          }}
          style={{
            width: '95%',
            alignSelf: 'center',
            height: 120,
            marginTop: 10,
            justifyContent: 'center',
          }}>
          <CustomFastImage
            style={{
              width: '100%',
              alignSelf: 'center',
              height: 120,
              position: 'absolute',
              marginBottom: 15,
            }}
            source={require('../assets/semResult.png')}
            resizeMode={'stretch'}
          />
          <View style={styles.SubjectNameTextView}>
            <Text numberOfLines={1} style={styles.SubjectNameTextStyle}>
              Semester
            </Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  SubjectNameTextView: {
    height: 60,
    width: '90%',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 2,
    marginVertical: 10,
    marginLeft: 40,
    //alignItems: "center",
  },
  SubjectNameTextStyle: {
    color: 'white',
    fontWeight: '500',
    textTransform: 'uppercase',
    fontSize: ResponsiveSize(config.buttonSize),
    paddingHorizontal: 10,
    fontFamily: 'Poppins-Regular',
  },
});
