import React, {Component} from 'react';
import {
  TouchableOpacity,
  SafeAreaView,
  View,
  Text,
  Dimensions,
  ScrollView,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import config from '../config/config';
import Toast from 'react-native-tiny-toast';
import ResponsiveSize from '../config/ResponsiveSize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressCircle from 'react-native-progress-circle';
import {styles} from '../auth/style';
import moment from 'moment';
import {CustomImageSubjects} from './common/CustomImageSubject';
import CustomFastImage from './common/CustomFastImage';
import CommonFlatlist from './common/CommonFlatList';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};
const GreenColor = '#23C4D7';
const LightGreenColor = '#BBECF2';
const BlueColor = '#6397F2';
const LightBlueColor = '#E0EBFF';
const PurpleColor = '#7260E9';
const LightPurpleColor = '#A99CFF';
export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Loader: true,
      Loader2: true,
      Token: '',
      Name: 'User',
      FinalAttendance: '',
      Attendance: [],
      Subjects: [],
    };
  }
  componentDidMount() {
    //console.log('Home');
    console.log('hit did mount');
    this.retrieveData();
    this.keyboard = this.props.navigation.addListener('blur', () => {
      Keyboard.dismiss();
    });
    //this._focus = this.props.navigation.addListener('focus', () => {
    //  console.log('hit focus');
    //  this.retrieveData();
    //});
    //this.backHandler = BackHandler.addEventListener(
    //  'hardwareBackPress',
    //  this.handleBackPress,
    //);
  }
  componentWillUnmount() {
    //this.props.navigation.removeListener(this._focus);
    this.props.navigation.removeListener(this.keyboard);
  }

  //handleBackPress = () => {
  // this.props.navigation.goBack(null)
  //  return true;
  //};

  retrieveData = async (key) => {
    try {
      const value = await AsyncStorage.getItem('name');
      if (value !== null) {
        this.setState({Name: value});
      }
    } catch (error) {
      alert('Error retrieving data');
    }
    try {
      const value = await AsyncStorage.getItem('token');
      //console.log('token = ', value);
      if (value !== null) {
        this.setState({Token: value}, function () {
          this.onLoadGetSubjects();
        });
      }
    } catch (error) {
      alert('Error retrieving data');
    }
  };
  storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
      console.log('key = ', key, 'value = ', value);
    } catch (error) {
      // Error saving data
      alert('store data catched');
    }
  };
  onLoadGetSubjects = () => {
    const url = config.baseUrl + 'student/StudentSubjectList';
    //console.log(url);
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
        //console.log(responseJson);
        this.onLoadGetAttendance();
        if (responseJson) {
          this.setState({Subjects: responseJson, Loader: false}, function () {
            //this.storeData('EmergencyUpdate', responseJson?.update || 'true');
          });
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
        this.setState({Loader: false});
        //console.log(error);
        this.onLoadGetAttendance();
        alert(error);
        //Toast.show('Subject listing error', ToastData);
      });
  };
  onLoadGetAttendance = () => {
    let date = new Date();
    let finalCurrentDate = moment(date).format('YYYY-MM-DD');
    let newdate = date.setDate(date.getDate() - 30);
    var finalDate = moment(newdate).format('YYYY-MM-DD');
    this.setState(
      {
        AttendanceEndDate: finalCurrentDate,
        AttendanceStartDate: finalDate,
      },
      function () {},
    );
    const url = config.baseUrl + 'student/Attendance';
    //console.log(url);
    //console.log(
    //  JSON.stringify({
    //    fromDate: this.state.AttendanceStartDate,
    //    toDate: this.state.AttendanceEndDate,
    //  }),
    //);
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.state.Token,
      },
      body: JSON.stringify({
        fromDate: this.state.AttendanceStartDate,
        toDate: this.state.AttendanceEndDate,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //console.log(responseJson);
        if (responseJson) {
          this.setState(
            {Loader2: false, Attendance: responseJson},
            function () {
              if (
                this.state.Attendance.totalHoursPresent &&
                this.state.Attendance.totalHours
              ) {
                let totalAtt = this.state.Attendance.totalHoursPresent;
                let presentAtt = this.state.Attendance.totalHours;
                let TempAttendance = (totalAtt / presentAtt) * 100;
                let FinalAttendance = TempAttendance.toFixed(0);
                this.setState({FinalAttendance}, function () {});
              } else {
                this.setState({FinalAttendance: '0'}, function () {});
              }
            },
          );
        } else {
          this.setState({Loader2: false}, function () {
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
        this.setState({Loader2: false}, function () {
          //Toast.show('Attendance error', ToastData);
          //console.log(error);
        });
      });
  };
  renderItem = (item, index) => {
    return (
      <CustomImageSubjects
        key={index}
        percentage={item.topicsCompletedPercentage}
        subjectName={item.subjectName}
        type={item.subjectType}
        number={item.mobile}
        staffImage={item.staffImage}
        mailId={item.mailId}
        staffName={item.staffName}
        colorCode={
          index % 2 == 0 && index % 3 != 0
            ? '#91B3EB'
            : index % 3 == 0
            ? '#6CCFDB'
            : '#9A90E4'
        }
        colorCode2={
          index % 2 == 0 && index % 3 != 0
            ? '#7260E9'
            : index % 3 == 0
            ? '#008B9B'
            : '#0047C3'
        }
        source={
          index % 2 == 0 && index % 3 != 0
            ? require('../assets/subjectPurpleBg.png')
            : index % 3 == 0
            ? require('../assets/subjectGreenBg.png')
            : require('../assets/subjectBlueBg.png')
        }
        onPress={() => {
          this.props.navigation.navigate('SubjectsDetails', {
            Subjects: item,
            title: 'Subjects',
            colorCode:
              index % 2 == 0 && index % 3 != 0
                ? '#7260E9'
                : index % 3 == 0
                ? '#23C4D7'
                : '#8F98FF',
            colorCode2:
              index % 2 == 0 && index % 3 != 0
                ? '#7260E9'
                : index % 3 == 0
                ? '#008B9B'
                : '#0047C3',
            colorPic:
              index % 2 == 0 && index % 3 != 0
                ? require('../assets/purpleBg.png')
                : index % 3 == 0
                ? require('../assets/greenBg.png')
                : require('../assets/blueBg.png'),
          });
        }}
      />
    );
  };
  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: config.bgColor,
          justifyContent: 'flex-end',
        }}>
        {/*<Loader Loading={this.state.Loader ? true : false} />*/}
        <SafeAreaView style={{flex: 1, justifyContent: 'space-between'}}>
          <ScrollView nestedScrollEnabled={true}>
            <View
              style={{
                width: '100%',
                alignSelf: 'center',
                flex: 1,
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontSize: ResponsiveSize(config.buttonSize),
                  fontWeight: '500',
                  marginVertical: 10,
                  paddingHorizontal: 10,
                }}>
                Hey, {this.state.Name}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('TimeTable', {
                    title: 'Time Table',
                  });
                }}
                style={styles.HotNotificationView}>
                <View style={styles.HomescreenNotificationIconView}>
                  <CustomFastImage
                    style={{width: 20, height: 20}}
                    source={require('../assets/result3.png')}
                    resizeMode={'contain'}
                  />
                </View>
                <View style={styles.HomescreenNotificationTextView}>
                  <Text
                    style={{
                      fontFamily: 'Poppins-Regular',
                      color: BlueColor,
                      fontSize: ResponsiveSize(config.AppAllTextSize),
                    }}>
                    8 days left for internal exam 2
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('Result', {title: 'Result'});
                }}
                style={styles.HotNotificationView}>
                <View style={styles.HomescreenNotificationIconView}>
                  <CustomFastImage
                    style={{width: 20, height: 20}}
                    source={require('../assets/result4.png')}
                    resizeMode={'contain'}
                  />
                </View>
                <View style={styles.HomescreenNotificationTextView}>
                  <Text
                    style={{
                      fontFamily: 'Poppins-Regular',
                      color: GreenColor,
                      fontSize: ResponsiveSize(config.AppAllTextSize),
                    }}>
                    Result declare of internal exam 1
                  </Text>
                </View>
              </TouchableOpacity>
              <View
                style={{
                  width: '95%',
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: 50,
                  flexDirection: 'row',
                  borderRadius: 10,
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    color: 'black',
                    fontSize: ResponsiveSize(config.AppAllHeaderSize),
                    fontWeight: '500',
                  }}>
                  Subjects
                </Text>
                <Text
                  onPress={() => {
                    this.props.navigation.navigate('SubjectList', {
                      title: 'Subjects',
                    });
                  }}
                  style={{
                    fontFamily: 'Poppins-Regular',
                    color: 'black',
                    fontSize: ResponsiveSize(config.AppAllHeaderSize),
                  }}>
                  See all
                </Text>
              </View>
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginVertical: 10,
                }}>
                {!this.state.Loader ? (
                  //<CommonFlatlist
                  //  scrollEnabled={false}
                  //  refreshing={this.state.refreshing}
                  //  //_onRefresh={this._onRefresh.bind(this)}
                  //  _onRefresh={() => {
                  //    this.setState({refreshing: false});
                  //  }}
                  //  data={this.state.Subjects.slice(0, 3)}
                  //  Loader={this.state.Loader}
                  //  renderItem={this.renderItem}
                  ///>

                  this.state.Subjects.slice(0, 3).map((item, index) => {
                    return this.renderItem(item, index);
                  })
                ) : (
                  <View>
                    <ActivityIndicator color={config.themeColor} />
                    <Text
                      style={{
                        fontFamily: 'Poppins-Regular',
                        //fontSize: 8,
                        marginTop: 10,
                      }}>
                      Fetching Subject List...
                    </Text>
                  </View>
                )}
              </View>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  color: 'black',
                  fontSize: ResponsiveSize(config.AppAllHeaderSize),
                  fontWeight: '500',
                  marginHorizontal: 10,
                }}>
                Attendance
              </Text>

              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('Attendance', {
                    title: 'Attendance',
                  });
                }}
                style={{
                  elevation: 3,
                  shadowColor: 'silver',
                  backgroundColor: 'white',
                  borderRadius: 10,
                  shadowOpacity: 0.5,
                  shadowOffset: {width: 0, height: 0},
                  width: '95%',
                  alignSelf: 'center',
                  alignItems: 'center',
                  height: 150,
                  flexDirection: 'row',
                  marginTop: 10,
                }}>
                <View
                  style={{
                    width: '33%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                  }}>
                  <ProgressCircle
                    percent={85}
                    radius={50}
                    borderWidth={6}
                    color={'#6397F2'}
                    shadowColor="silver"
                    bgColor={'#F6F6F6'}>
                    <View
                      style={{
                        elevation: 3,
                        shadowColor: 'silver',
                        shadowOffset: {width: 0, height: 0},
                        shadowOpacity: 0.6,
                        width: 60,
                        height: 60,
                        borderRadius: 60,
                        backgroundColor: 'white',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      {this.state.Loader2 ? (
                        <View>
                          <ActivityIndicator color={config.themeColor} />
                          <Text
                            style={{
                              fontFamily: 'Poppins-Regular',
                              fontSize: 8,
                              marginTop: 3,
                            }}>
                            Fetching...
                          </Text>
                        </View>
                      ) : (
                        <Text
                          style={{
                            fontFamily: 'Poppins-Regular',
                            fontSize: ResponsiveSize(config.buttonSize),
                            color: '#6397F2',
                            fontWeight: 'bold',
                          }}>
                          {this.state.FinalAttendance
                            ? this.state.FinalAttendance + '%'
                            : ''}
                        </Text>
                      )}
                    </View>
                  </ProgressCircle>
                </View>
                <View
                  style={{
                    width: '33%',
                    justifyContent: 'center',
                    height: '100%',
                  }}>
                  <View
                    style={{
                      width: '100%',
                      height: '25%',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 10,
                        margin: 10,
                        backgroundColor: '#6397F2',
                      }}></View>
                    <Text
                      style={{
                        fontFamily: 'Poppins-Regular',
                        fontSize: ResponsiveSize(config.AppAllTextSize),
                      }}>
                      Present
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      height: '25%',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 10,
                        margin: 10,
                        backgroundColor: 'silver',
                      }}></View>
                    <Text
                      style={{
                        fontFamily: 'Poppins-Regular',
                        fontSize: ResponsiveSize(config.AppAllTextSize),
                      }}>
                      Absent
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    width: '33%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                  }}>
                  <View
                    style={{
                      width: '100%',
                      height: '25%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 50,
                        margin: 10,
                        backgroundColor: '#FFE9E9',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Poppins-Regular',
                          fontSize: ResponsiveSize(20),
                          color: 'red',
                          fontWeight: 'bold',
                        }}>
                        0
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontFamily: 'Poppins-Regular',
                        fontSize: ResponsiveSize(config.buttonSize),
                        color: 'red',
                        fontWeight: 'bold',
                      }}>
                      Backlogs
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: '100%',
                height: 30,
                backgroundColor: 'transparent',
              }}
            />
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
