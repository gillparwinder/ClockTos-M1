import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {StyleSheet, ScrollView, BackHandler} from 'react-native';
import {Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-tiny-toast';
import ResponsiveSize from '../config/ResponsiveSize';
import config from '../config/config';
import {ImageBackground} from 'react-native';
import {SafeAreaView} from 'react-native';
import {CustomHeader} from './CustomHeader';
import {Loader} from './Loader';
import {Image} from 'react-native';
import {CustomImage} from './common/customImage';
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};

export default class TimeTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Loader: false,
      TempTimeTable: [
        {day: 'Today'},
        {day: 'Weekly'},
        {day: 'CAM'},
        {day: 'University'},
      ],
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
  // this.props.navigation.goBack(null)
  //  return true;
  //};
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        {this.state.Title ? (
          <CustomHeader
            isHome={false}
            title={this.state.Title}
            navigation={this.props.navigation}
          />
        ) : null}
        <Loader
          Loading={this.state.Loader ? true : false}
          onPressCancel={() => {
            this.setState({Loader: false});
          }}
        />
        <ScrollView>
          <Animatable.View
            key={Math.random()}
            duration={400}
            style={[styles.headerNew]}
            transition="backgroundColor">
            {this.state.TempTimeTable.map((item, index) => {
              return (
                <CustomImage
                  key={index}
                  title={item.day}
                  source={
                    index % 2 == 0 && index % 3 != 0
                      ? require('../assets/purpleBg.png')
                      : index % 3 == 0
                      ? require('../assets/greenBg.png')
                      : require('../assets/blueBg.png')
                  }
                  onPress={() => {
                    if (item.day == 'Today') {
                      this.props.navigation.navigate('TimeTableToday', {
                        colorPic:
                          index % 2 == 0 && index % 3 != 0
                            ? require('../assets/purpleBg.png')
                            : index % 3 == 0
                            ? require('../assets/greenBg.png')
                            : require('../assets/blueBg.png'),
                      });
                    } else if (item.day == 'Weekly') {
                      this.props.navigation.navigate('TimeTableWeekly', {
                        colorPic:
                          index % 2 == 0 && index % 3 != 0
                            ? require('../assets/purpleBg.png')
                            : index % 3 == 0
                            ? require('../assets/greenBg.png')
                            : require('../assets/blueBg.png'),
                      });
                    } else if (item.day == 'CAM') {
                      this.props.navigation.navigate('TimeTableCam', {
                        colorPic:
                          index % 2 == 0 && index % 3 != 0
                            ? require('../assets/purpleBg.png')
                            : index % 3 == 0
                            ? require('../assets/greenBg.png')
                            : require('../assets/blueBg.png'),
                      });
                    } else {
                      this.props.navigation.navigate('TimeTableUniversity', {
                        TimeTable: item,
                        colorCode:
                          index % 2 == 0 && index % 3 != 0
                            ? '#7260E9'
                            : index % 3 == 0
                            ? '#23C4D7'
                            : '#8F98FF',

                        colorPic:
                          index % 2 == 0 && index % 3 != 0
                            ? require('../assets/purpleBg.png')
                            : index % 3 == 0
                            ? require('../assets/greenBg.png')
                            : require('../assets/blueBg.png'),
                      });
                    }
                  }}
                />
              );
            })}
          </Animatable.View>
          <View
            style={{width: '100%', height: 120, backgroundColor: 'transparent'}}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  headerNew: {
    padding: 10,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 5,
  },
  headerTextNew: {
    //textAlign: 'center',
    fontSize: ResponsiveSize(config.AppAllHeaderSize),
    fontWeight: '600',
    lineHeight: 30,
    textTransform: 'uppercase',
    color: 'white',
    fontFamily: 'Poppins-Regular',
  },
});
