import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import {SafeAreaView, StyleSheet, Image, BackHandler} from 'react-native';
import {View, Text, ScrollView} from 'react-native';
import DatePicker from 'react-native-datepicker';
import config from '../config/config';
import ResponsiveSize from '../config/ResponsiveSize';
import {CustomHeader} from './CustomHeader';
import {Loader} from './Loader';
import {FlatList} from 'react-native';

// import Orientation from 'react-native-orientation-locker';
import moment from 'moment';
import {Dimensions} from 'react-native';
import {retrieveDataStaffAttendance} from '../config/apis';
import {Linking} from 'react-native';
import CustomFastImage from './common/CustomFastImage';
import {heightPercentageToDP} from 'react-native-responsive-screen';
const GreenColor = '';

export default class StaffSideAttendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Title: this.props.route?.params?.title || '',
      AttendanceData: [],
      loading: true,
      AttendanceDate: moment(new Date()).format('YYYY-MM-DD'),
      AttendanceDate1: moment(new Date()).format('DD-MM-YYYY'),
    };
  }

  // _onOrientationDidChange = (orientation) => {
  //   if (orientation == 'LANDSCAPE') {
  //     //do something with landscape left layout
  //     Orientation.lockToPortrait();
  //   } else {
  //     // Orientation.lockToPortrait();
  //     //do something with portrait layout
  //   }
  // };

  async componentDidMount() {
    //getTodayClassDetails
    await this.getData(false);

    //handle back button press
    //this.backHandler = BackHandler.addEventListener(
    //  'hardwareBackPress',
    //  this.handleBackPress,
    //);

    //reload data on screen focus
    this.focus = this.props.navigation.addListener('focus', () => {
      //console.log('attendacnce', this.state.AttendanceDate);
      if (this.state.AttendanceDate) this.getData(this.state.AttendanceDate);
    });
  }

  componentWillUnmount() {
    //this.backHandler.remove();
    this.props.navigation.removeListener(this.focus);
  }

  //handleBackPress = () => {
  //  this.props.navigation.goBack(null);
  //  return true;
  //};

  getData = async (key) => {
    //console.log('hit');
    this.setState({loading: true});
    try {
      const json = await retrieveDataStaffAttendance(key);
      console.log('json', json);
      if (!json) {
        alert('No classes for today!');
      }
      this.setState({AttendanceData: json}, () => {});
    } catch (error) {
      //console.log('error', error);
      alert('Error retrieving data');
    } finally {
      this.setState({loading: false});
    }
  };

  render() {
    return (
      <SafeAreaView>
        <Loader Loading={this.state.loading} />
        <View
          style={[
            styles.SubjectMainContainer,
            {
              //backgroundColor: 'red',
              paddingBottom: 20,
              height: Dimensions.get('screen').height,
            },
          ]}>
          {this.state.Title ? (
            this.props?.children == 'StaffSideAttendance' ? null : (
              <CustomHeader
                isHome={false}
                navigation={this.props.navigation}
                title="Attendance"
              />
            )
          ) : null}
          <Text
            numberOfLines={1}
            style={{
              fontFamily: 'Poppins-Regular',
              color: 'black',
              textAlign: 'left',
              alignSelf: 'flex-start',
              marginLeft: 20,
              marginTop: 20,
              fontWeight: '600',
              fontFamily: 'Poppins-Regular',
              fontSize: ResponsiveSize(config.AppAllTextSize),
            }}>
            Select Dates
          </Text>
          <View
            style={{
              width: '95%',
              alignSelf: 'center',
              flexDirection: 'row',
              marginBottom: 10,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={styles.AttendanceCustomDateTextView}>
              <View
                style={{
                  width: '90%',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <CustomFastImage
                  resizeMode={'contain'}
                  style={{width: 20, height: 20}}
                  source={require('../assets/calendar.png')}
                />
                <DatePicker
                  date={this.state.AttendanceDate}
                  mode="date"
                  placeholder="Today"
                  format="YYYY-MM-DD"
                  //minDate="2020-01-01"
                  maxDate={new Date()}
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  showIcon={false}
                  customStyles={{
                    dateInput: {
                      borderColor: 'transparent',
                      marginLeft: -11,
                    },
                  }}
                  onDateChange={(date) => {
                    this.setState(
                      {
                        AttendanceDate: date,
                        AttendanceDate1: moment(date).format('DD-MM-YYYY'),
                        ApiRequestRequired: true,
                        Loader: true,
                      },
                      function () {
                        this.getData(this.state.AttendanceDate);
                      },
                    );
                  }}
                />
              </View>
            </View>
            <TouchableOpacity activeOpacity={1} disabled>
              <CustomFastImage
                resizeMode={'stretch'}
                style={{width: 80, height: 60}}
                source={require('../assets/search.png')}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: '100%',
              height: '70%',
              //flex: 1,
              //marginBottom: heightPercentageToDP(3),
            }}>
            {this.state.AttendanceData.length ? (
              <FlatList
                keyExtractor={(item, index) => index.toString()}
                data={this.state.AttendanceData}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate(
                          'StaffSideAttendanceDetail',
                          {
                            title: item.subjectName,
                            hour: item.hour,
                            item: item,
                            AttendanceDate: this.state.AttendanceDate,
                            AttendanceDate1: this.state.AttendanceDate1,
                          },
                        );
                      }}
                      key={index}
                      style={{
                        flexDirection: 'row',
                        //  justifyContent: 'center',
                        width: '95%',
                        alignSelf: 'center',
                        elevation: 3,
                        shadowColor: 'silver',
                        shadowOffset: {width: 0, height: 0},
                        shadowOpacity: 0.8,
                        borderRadius: 15,
                        //height: ResponsiveSize(240),
                        marginBottom: 15,
                        //alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        backgroundColor: 'white',
                      }}>
                      <View
                        style={{
                          width: '1.5%',
                          //height: '100%',
                          backgroundColor: !item.isAttendanceTaken
                            ? item.schedule == 'Normal'
                              ? '#6397F2'
                              : 'purple'
                            : '#4CC35B',
                          borderTopLeftRadius: 15,
                          borderBottomLeftRadius: 15,
                          justifyContent: 'center',
                        }}></View>
                      <View
                        style={{
                          width: '100%',
                          //height: '100%',
                          alignSelf: 'center',
                          padding: 10,
                          //justifyContent: 'center',
                        }}>
                        <View
                          style={{
                            //height: '40%',
                            width: '100%',
                            alignSelf: 'center',
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <View
                            style={{
                              width: '30%',
                              //height: '100%',
                              //padding: 10,
                              justifyContent: 'space-between',
                            }}>
                            {item.hour ? (
                              <Text
                                numberOfLines={2}
                                style={{
                                  lineHeight: 25,
                                  fontFamily: 'Poppins-Regular',
                                  color: !item.isAttendanceTaken
                                    ? item.schedule == 'Normal'
                                      ? '#6397F2'
                                      : 'purple'
                                    : '#4CC35B',
                                  //color: item.isAttendanceTaken
                                  //  ? item.schedule == 'Normal'
                                  //    ? '#4CC35B'
                                  //    : 'purple'
                                  //  : index % 2 == 0 && index % 3 != 0
                                  //  ? '#7260E9'
                                  //  : index % 3 == 0
                                  //  ? '#23C4D7'
                                  //  : '#6397F2',
                                  fontSize: ResponsiveSize(config.buttonSize),
                                  fontWeight: 'bold',
                                }}>
                                {'H' + item.hour}
                              </Text>
                            ) : null}
                          </View>
                          {item.startTime && item.endTime ? (
                            <View
                              style={{
                                width: '70%',
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingRight: 10,
                                justifyContent: 'flex-end',
                                // height: '100%'
                              }}>
                              <CustomFastImage
                                resizeMode={'contain'}
                                style={{
                                  width: 20,
                                  height: 20,
                                  marginRight: 10,
                                }}
                                source={require('../assets/timer.png')}
                              />
                              <Text
                                numberOfLines={1}
                                style={{
                                  fontFamily: 'Poppins-Regular',
                                  fontWeight: '600',
                                  //lineHeight: 25,
                                  color: '#000072',
                                }}>
                                {moment(item.startTime).format('hh:mm A') +
                                  ' to ' +
                                  moment(item.endTime).format('hh:mm A')}
                              </Text>
                            </View>
                          ) : null}
                        </View>
                        {item.subjectName ? (
                          <Text
                            //numberOfLines={2}
                            style={{
                              lineHeight: 25,
                              textTransform: 'capitalize',
                              marginVertical: 5,
                              fontFamily: 'Poppins-Regular',
                              color: !item.isAttendanceTaken
                                ? item.schedule == 'Normal'
                                  ? '#6397F2'
                                  : 'purple'
                                : '#4CC35B',
                              fontSize: ResponsiveSize(config.buttonSize),
                              fontWeight: 'bold',
                            }}>
                            {item.subjectName}
                          </Text>
                        ) : null}
                        <View
                          style={{
                            width: '100%',
                            flexDirection: 'row',
                            marginVertical: 10,
                            alignItems: 'center',
                          }}>
                          <View
                            style={{
                              width: '55%',
                              minHeight: 70,
                              //justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            {item.classDetails.length > 0 &&
                              item.classDetails.map((item2, index2) => {
                                return (
                                  <View
                                    key={index2}
                                    style={{
                                      width: '100%',
                                      height: 35,
                                      alignSelf: 'center',
                                      borderRadius: 10,
                                      marginBottom: 10,
                                      justifyContent: 'center',
                                      //alignItems: 'center',
                                      backgroundColor: !item.isAttendanceTaken
                                        ? item.schedule == 'Normal'
                                          ? '#6397F2'
                                          : 'purple'
                                        : '#4CC35B',
                                    }}>
                                    <Text
                                      numberOfLines={1}
                                      style={{
                                        fontFamily: 'Poppins-Regular',
                                        color: 'white',
                                        //textTransform: 'capitalize',
                                        fontWeight: '600',
                                        paddingLeft: 10,
                                        fontSize: ResponsiveSize(
                                          config.AppAllTextSize,
                                        ),
                                        //textAlign: 'center',
                                        lineHeight: 25,
                                      }}>
                                      {item2}
                                    </Text>
                                  </View>
                                );
                              })}
                          </View>
                          <View
                            style={{
                              width: '45%',
                              minHeight: 70,
                              justifyContent: 'center',
                              alignItems: 'flex-end',
                              paddingRight: 10,
                            }}>
                            {item.subjectType ? (
                              <View
                                style={{
                                  width: '100%',
                                  alignItems: 'center',
                                  flexDirection: 'row',
                                  justifyContent: 'flex-end',
                                  marginBottom: 10,
                                }}>
                                <CustomFastImage
                                  resizeMode={'contain'}
                                  style={{
                                    width: 20,
                                    height: 20,
                                    marginRight: 10,
                                  }}
                                  source={
                                    item.subjectType == 'theory'
                                      ? require('../assets/book2.png')
                                      : require('../assets/practical2.png')
                                  }
                                />
                                <Text
                                  numberOfLines={2}
                                  style={{
                                    fontFamily: 'Poppins-Regular',
                                    color: 'black',
                                    width: '70%',
                                    textTransform: 'capitalize',
                                    fontWeight: '600',
                                    lineHeight: 25,
                                  }}>
                                  {item.subjectType}
                                </Text>
                              </View>
                            ) : null}
                            {item.studentCount.toString() ? (
                              <Text
                                numberOfLines={1}
                                style={{
                                  fontFamily: 'Poppins-Regular',
                                  color: 'gray',
                                  fontWeight: '600',
                                  lineHeight: 25,
                                }}>
                                Total Students : {item.studentCount.toString()}
                              </Text>
                            ) : null}
                          </View>
                        </View>
                        <View
                          style={{
                            width: '100%',
                            //height: '55%',
                            alignItems: 'center',
                          }}>
                          <View
                            style={{
                              width: '100%',
                              marginVertical: 5,
                              padding: 5,
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              flexDirection: 'row',
                            }}>
                            {/*<View
                              style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                              }}>
                              <TouchableOpacity
                                onPress={() =>
                                  this.props.navigation.navigate(
                                    'PhotoAttendance',
                                    {
                                      studentCount: item.studentCount.toString(),
                                      item,
                                    },
                                  )
                                }
                                style={{
                                  width: 30,
                                  height: 30,
                                  borderRadius: 30,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backgroundColor: '#7260E9',
                                }}>
                                <CustomFastImage
                                    resizeMode={'contain'}
                                  style={{
                                    width: 15,
                                    height: 15,
                                  }}
                                  source={require('../assets/cameraWhite.png')}/>
                              </TouchableOpacity>
                              <TouchableOpacity
                                disabled={
                                  item.isMeetingEnabled == true ? false : true
                                }
                                onPress={() => {
                                  Linking.openURL(item.meetingLink);
                                }}
                                style={{
                                  width: 30,
                                  height: 30,
                                  borderRadius: 30,
                                  marginLeft: 10,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backgroundColor: '#7260E9',
                                }}>
                                <CustomFastImage
                                    resizeMode={'contain'}
                                  style={{
                                    width: 30,
                                    height: 30,
                                  }}
                                  source={
                                    item.isMeetingEnabled == true
                                      ? require('../assets/meetingActive.png')
                                      : require('../assets/meetingInactive.png')
                                  }/>
                              </TouchableOpacity>
                            </View>*/}
                            {/* {item.absentCount ? ( */}
                            <View
                              style={{
                                width: '40%',
                                height: 35,
                                borderRadius: 35,
                                alignItems: 'center',
                                paddingHorizontal: 5,
                                backgroundColor: 'red',
                                flexDirection: 'row',
                              }}>
                              <CustomFastImage
                                resizeMode={'contain'}
                                style={{
                                  width: 25,
                                  height: 25,
                                }}
                                source={require('../assets/absent.png')}
                              />
                              <Text
                                numberOfLines={1}
                                style={{
                                  fontFamily: 'Poppins-Regular',
                                  color: 'white',
                                  flex: 1,
                                  textAlign: 'center',
                                  fontSize: ResponsiveSize(
                                    config.AppAllTextSize,
                                  ),
                                }}>
                                {item.absentCount
                                  ? item.absentCount.toString()
                                  : '0'}{' '}
                                Students
                              </Text>
                            </View>
                            {/* ) : null} */}
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            ) : !this.state.loading ? (
              <View
                key={Math.random()}
                duration={400}
                style={[styles.header, {width: '95%', alignSelf: 'center'}]}
                transition="backgroundColor">
                <Text style={[styles.headerText, {textTransform: 'none'}]}>
                  No Data Available
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  header: {
    backgroundColor: '#F5FCFF',
    padding: 10,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 5,
    margin: 5,
  },
  headerText: {
    //textAlign: 'center',
    fontSize: ResponsiveSize(config.AppAllTextSize),
    fontWeight: '500',
    textTransform: 'uppercase',
    fontFamily: 'Poppins-Regular',
  },

  SubjectMainContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20,
  },
  AttendanceCustomDateTextView: {
    height: 60,
    width: '75%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    backgroundColor: 'white',
    elevation: 3,
    borderRadius: 10,
    shadowColor: 'silver',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.6,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
});
