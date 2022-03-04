//}

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {StyleSheet, ScrollView, BackHandler} from 'react-native';
import {Text, TouchableOpacity} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-tiny-toast';
import ResponsiveSize from '../config/ResponsiveSize';
import config from '../config/config';
import {ImageBackground} from 'react-native';
import {SafeAreaView} from 'react-native';
import {CustomHeader} from './CustomHeader';
import {Loader} from './Loader';
import {View} from 'react-native';
import {Image, Animated} from 'react-native';
import ProgressCircle from 'react-native-progress-circle';
import CustomFastImage from './common/CustomFastImage';
import CommonFlatlist from './common/CommonFlatList';
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};

export default class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Loader: true,
      subTitle: this.props.route.params
        ? this.props.route.params.subTitle
          ? this.props.route.params.subTitle
          : ''
        : '',
      staffCode: this.props.route.params
        ? this.props.route.params.staffCode
          ? this.props.route.params.staffCode
          : ''
        : '',
      subjectCode: this.props.route.params
        ? this.props.route.params.subjectCode
          ? this.props.route.params.subjectCode
          : ''
        : '',

      FeedbackArr: [
        //{
        //  name: 'Academic-Feedback 1 2020-21',
        //  startTime: '15 June 2020',
        //  endTime: '25 June 2021',
        //  image: require('../assets/f1.png'),
        //},
        //{
        //  name: 'Academic-Feedback 2 2020-21',
        //  startTime: '16 June 2020',
        //  endTime: '26 June 2021',
        //  image: require('../assets/f2.png'),
        //},
        //{
        //  name: 'Academic-Feedback 3 2020-21',
        //  startTime: '17 June 2020',
        //  endTime: '27 June 2021',
        //  image: require('../assets/f3.png'),
        //},
      ],
      Token: '',
      Title: this.props.route.params
        ? this.props.route.params.title
          ? this.props.route.params.title
          : ''
        : '',
    };
  }
  componentDidMount() {
    //console.log('feedback screen');
    this.retrieveData();
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
  }
  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleBackPress = () => {
    this.props.navigation.goBack(null);
    return true;
  };
  retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        //alert(value);
        this.setState({Token: value}, function () {});
      }
    } catch (error) {
      alert('Error retrieving data');
    }
    try {
      const value = await AsyncStorage.getItem('rollNo');
      if (value !== null) {
        //alert(value);
        this.setState({rollNo: value.toString()}, function () {});
      }
    } catch (error) {
      alert('Error retrieving data');
    }
    try {
      const value = await AsyncStorage.getItem('sem');
      //alert(value);
      if (value !== null) {
        this.setState({sem: parseInt(value)}, function () {
          this.onLoadGetStudentFeedbackBasedOnSem();
        });
      }
    } catch (error) {
      alert('Error retrieving data');
    }
  };
  onLoadGetStudentFeedbackBasedOnSem = () => {
    const url = config.baseUrl + 'student/GetStudentFeedbackBasedOnSem';
    //console.log(url);
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.state.Token,
      },
      body: JSON.stringify({
        rollNo: this.state.rollNo,
        semester: this.state.sem,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //console.log(
        //  'GetStudentFeedbackBasedOnSem = ' + JSON.stringify(responseJson),
        //);
        if (responseJson) {
          this.setState(
            {Loader: false, refreshing: false, FeedbackArr: responseJson},
            function () {},
          );
        } else {
          this.setState({Loader: false, refreshing: false}, function () {
            Toast.show(
              responseJson.title
                ? responseJson.title
                : 'Temporary error try again after some time',
              ToastData,
            );
          });
        }
      })
      .catch((error) => {
        this.setState({Loader: false, refreshing: false}, function () {
          //console.log(error);
          alert(error);
        });
      });
  };
  _onRefresh = async (apiCall) => {
    this.setState({refreshing: true}, () => {
      apiCall;
      //this.setState({refreshing: false});
    });
  };
  renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('FeedbackDetail', {
            subTitle: item.feedBackName,
            staffCode: this.state.staffCode,
            subjectCode: this.state.subjectCode,
            title: 'Feedback ',
            data: item,
            selectedColor:
              index % 2 == 0 && index % 3 != 0
                ? '#7260E9'
                : index % 3 == 0
                ? '#23C4D7'
                : '#6397F2',
            selectedColor2:
              index % 2 == 0 && index % 3 != 0
                ? '#E0DEF8'
                : index % 3 == 0
                ? '#DEFBFE'
                : '#BBCAF3',
            selectedImage:
              index % 2 == 0 && index % 3 != 0
                ? require('../assets/purpleBg.png')
                : index % 3 == 0
                ? require('../assets/greenBg.png')
                : require('../assets/blueBg.png'),
          });
        }}
        style={[
          styles.FeedbackView,
          {
            backgroundColor:
              index % 2 == 0 && index % 3 != 0
                ? '#7260E9'
                : index % 3 == 0
                ? '#23C4D7'
                : '#6397F2',
          },
        ]}>
        <View style={[styles.CommonView, {width: '25%'}]}>
          <View
            style={{
              width: 60,
              height: 60,
              backgroundColor:
                index % 2 == 0 && index % 3 != 0
                  ? '#8075EA'
                  : index % 3 == 0
                  ? '#2BB9CA'
                  : '#5289E6',
              borderRadius: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <CustomFastImage
              style={{
                width: '60%',
                height: '60%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              source={
                index % 2 == 0 && index % 3 != 0
                  ? require('../assets/f1.png')
                  : index % 3 == 0
                  ? require('../assets/f2.png')
                  : require('../assets/f3.png')
              }
              resizeMode={'contain'}
            />
          </View>
        </View>
        <View style={styles.FeedbackTextContainer}>
          <Text numberOfLines={2} style={styles.MainTitle}>
            {item.feedBackName}
          </Text>
          <View
            style={{
              width: '100%',
              //height: '100%',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <CustomFastImage
              style={{
                width: 20,
                height: 20,
                marginRight: 10,
              }}
              source={require('../assets/calender.png')}
              resizeMode={'contain'}
            />
            <Text style={styles.TitleText}>
              {item.startDate}
              {item.endDate ? ' - ' + item.endDate : ''}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    return (
      <SafeAreaView style={{width: '100%', height: '100%'}}>
        <Loader
          Loading={this.state.Loader ? true : false}
          onPressCancel={() => {
            this.setState({Loader: false});
          }}
        />
        <CustomHeader
          isHome={false}
          title={this.state.Title}
          navigation={this.props.navigation}
        />

        <View style={styles.SubjectMainContainer}>
          <CommonFlatlist
            refreshing={this.state.refreshing}
            //_onRefresh={this._onRefresh.bind(this)}
            _onRefresh={() => {
              this._onRefresh(this.onLoadGetStudentFeedbackBasedOnSem());
            }}
            renderItem={this.renderItem}
            data={this.state.FeedbackArr}
            Loader={this.state.Loader}
          />
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  SubjectMainContainer: {
    width: '100%',
    height: '95%',
    //alignItems: "center",
    paddingBottom: 20,
  },
  FeedbackView: {
    width: '95%',
    alignSelf: 'center',
    height: 120,
    marginTop: 10,
    borderRadius: 15,
    alignItems: 'center',
    flexDirection: 'row',
  },
  CommonView: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  FeedbackTextContainer: {
    width: '75%',
    justifyContent: 'space-evenly',
    height: '100%',
    paddingVertical: 20,
    paddingRight: 20,
  },
  TitleText: {
    fontFamily: 'Poppins-Regular',
    color: 'white',
    fontSize: ResponsiveSize(12),
    marginTop: 5,
  },
  MainTitle: {
    fontFamily: 'Poppins-Regular',
    color: 'white',
    fontWeight: 'bold',
    fontSize: ResponsiveSize(config.AppAllHeaderSize),
  },
});
