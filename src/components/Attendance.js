import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Toast from 'react-native-tiny-toast';
import ResponsiveSize from '../config/ResponsiveSize';
import config from '../config/config';
import {SafeAreaView} from 'react-native';
import {CustomHeader} from './CustomHeader';
import {Loader} from './Loader';
import {View} from 'react-native';
import {Image, BackHandler} from 'react-native';
import {styles} from '../auth/style';
import CustomFastImage from './common/CustomFastImage';
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};

export default class Attendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Loader: true,
      Attendance: [],
      Title: this.props.route.params
        ? this.props.route.params.title
          ? this.props.route.params.title
          : ''
        : '',
    };
  }
  componentDidMount() {
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
        //console.log(value);
        this.setState({Token: value}, function () {
          this.onLoadGetAttendance();
        });
      }
    } catch (error) {
      alert('Error retrieving data');
    }
  };
  onLoadGetAttendance = () => {
    const url = config.baseUrl + 'student/Attendance';
    console.log(url);
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.state.Token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('student/Attendance = ', responseJson);
        if (responseJson) {
          this.setState(
            {Loader: false, Attendance: responseJson},
            function () {},
          );
        } else {
          this.setState({Loader: false}, function () {
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
        console.log(error);
        this.setState({Loader: false}, function () {
          alert(error);
        });
      });
  };
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
          onPress={() => {
            this.props.navigation.navigate('DetailScreenMenu', {
              title: 'Attendance',
              subTitle: 'Custom Dates',
            });
          }}
          style={{
            width: '100%',
            alignSelf: 'center',
            height: 120,
            marginTop: 10,
            justifyContent: 'center',
          }}>
          <CustomFastImage
            style={{
              width: '95%',
              alignSelf: 'center',
              height: 120,
              position: 'absolute',
              resizeMode: 'stretch',
              marginBottom: 15,
            }}
            source={require('../assets/attendanceGreenBg.png')}
            resizeMode={'stretch'}
          />
          <View
            style={{
              width: '95%',
              alignSelf: 'center',
              height: '25%',
              justifyContent: 'center',
              paddingLeft: 48,
            }}>
            <Text style={styles.MainTitle}>Custom Dates</Text>
          </View>
          <View
            style={{
              width: '95%',
              alignSelf: 'center',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{width: '10%'}}></View>
            <View
              style={{
                width: '30%',
                borderRightWidth: 1,
                borderColor: 'white',
                padding: 10,
              }}>
              <Text style={styles.TitleText}>Total</Text>
              <Text style={styles.SubTitleText}>
                0
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    fontSize: ResponsiveSize(8),
                  }}>
                  D
                </Text>
              </Text>
            </View>
            <View
              style={{
                width: '30%',
                borderRightWidth: 1,
                borderColor: 'white',
                padding: 10,
              }}>
              <Text style={styles.TitleText}>Present</Text>
              <Text style={styles.SubTitleText}>
                0
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    fontSize: ResponsiveSize(8),
                  }}>
                  D
                </Text>
              </Text>
            </View>
            <View style={{width: '30%', padding: 10}}>
              <Text style={styles.TitleText}>Absent</Text>
              <Text style={styles.SubTitleText}>
                0
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    fontSize: ResponsiveSize(8),
                  }}>
                  D
                </Text>
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('AttendanceSemWise', {
              title: 'Attendance',
              subTitle: 'Semester',
            });
          }}
          style={{
            width: '100%',
            alignSelf: 'center',
            height: 120,
            marginTop: 10,
            justifyContent: 'center',
          }}>
          <CustomFastImage
            style={{
              width: '95%',
              alignSelf: 'center',
              height: 120,
              position: 'absolute',
              resizeMode: 'stretch',
              marginBottom: 15,
            }}
            source={require('../assets/attendancePurpleBg.png')}
            resizeMode={'stretch'}
          />
          <View
            style={{
              width: '95%',
              alignSelf: 'center',
              height: '25%',
              justifyContent: 'center',
              paddingLeft: 48,
            }}>
            <Text style={styles.MainTitle}>Semester</Text>
          </View>
          <View
            style={{
              width: '95%',
              alignSelf: 'center',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{width: '10%'}}></View>
            <View
              style={{
                width: '30%',
                borderRightWidth: 1,
                borderColor: 'white',
                padding: 10,
              }}>
              <Text style={styles.TitleText}>Total hours</Text>
              <Text style={styles.SubTitleText}>
                {this.state.Attendance.totalHours}
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    fontSize: ResponsiveSize(8),
                  }}>
                  H
                </Text>
              </Text>
            </View>
            <View
              style={{
                width: '30%',
                borderRightWidth: 1,
                borderColor: 'white',
                padding: 10,
              }}>
              <Text style={styles.TitleText}>Present</Text>
              <Text style={styles.SubTitleText}>
                {this.state.Attendance.totalHoursPresent}
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    fontSize: ResponsiveSize(8),
                  }}>
                  H
                </Text>
              </Text>
            </View>
            <View style={{width: '30%', padding: 10}}>
              <Text style={styles.TitleText}>Absent</Text>
              <Text style={styles.SubTitleText}>
                {this.state.Attendance.totalHourseAbsent}
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    fontSize: ResponsiveSize(8),
                  }}>
                  H
                </Text>
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
