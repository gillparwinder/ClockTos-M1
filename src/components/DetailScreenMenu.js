import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, ScrollView, BackHandler} from 'react-native';
import {View, Text, TouchableOpacity} from 'react-native';
import {CustomHeader} from './CustomHeader';
import {Loader} from './Loader';
import DatePicker from 'react-native-datepicker';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-tiny-toast';
import ResponsiveSize from '../config/ResponsiveSize';
import config from '../config/config';
import moment from 'moment';
import ProgressCircle from 'react-native-progress-circle';
import {Header} from 'native-base';
import {Dimensions} from 'react-native';
import CommonFlatlist from './common/CommonFlatList';
import CustomFastImage from './common/CustomFastImage';
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const GreenColor = '#23C4D7';
const LightGreenColor = '#BBECF2';
const BlueColor = '#6397F2';
const PurpleColor = '#7260E9';
const LightPurpleColor = '#A99CFF';
export default class DetailScreenMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Loader: true,
      LibraryInfoDetails: [],
      HourCount: 5,
      LibraryCardInfo: [],
      ArrLengthEnd: 7,
      ArrLengthstart: 0,
      ApiRequestRequired: true,
      TempData: ['Exam Wise', 'Subject Wise'],
      AttendanceSem: this.props.route.params
        ? this.props.route.params.SemesterWiseAttendanceData
          ? this.props.route.params.SemesterWiseAttendanceData
          : ''
        : '',
      Attendance: [],
      Performance: [],
      InternalPerformance: [],
      InternalMarks: [],
      UniversityMarks: [],
      Colors2: [
        '#EDFDFF',
        '#BBECF2',
        '#EDFDFF',
        '#BBECF2',
        '#EDFDFF',
        '#BBECF2',
        '#EDFDFF',
        '#BBECF2',
        '#EDFDFF',
        '#BBECF2',
        '#EDFDFF',
        '#BBECF2',
        '#EDFDFF',
        '#BBECF2',
        '#EDFDFF',
        '#BBECF2',
        '#EDFDFF',
        '#BBECF2',
        '#EDFDFF',
        '#BBECF2',
        '#EDFDFF',
        '#BBECF2',
        '#EDFDFF',
        '#BBECF2',
        '#EDFDFF',
        '#BBECF2',
        '#EDFDFF',
        '#BBECF2',
      ],
      SemWiseAttendance: [],
      TempIndex: -1,
      AttendanceStartDate: '',
      AttendanceEndDate: '',
      CurrentDate: new Date(),
      Title: this.props.route.params
        ? this.props.route.params.title
          ? this.props.route.params.title
          : ''
        : '',
      subTitle: this.props.route.params
        ? this.props.route.params.subTitle
          ? this.props.route.params.subTitle
          : ''
        : '',
      //Token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MzE1MmMxYS02YTU1LTRkMDktODE1ZC1hYTk1ZDhhZjgyZDkiLCJBcHBObyI6IjIyNDQ3OSIsIklzU2Nob29sIjoidHJ1ZSIsIkRCIjoiYjdCUTExWlpyV2tHVEl0OVdqbGFURURaM0l2cHZxZVZJSElvMStBMVY5dSpLdzdtOXNCZFNoMm55MzNBdlBSU083QUFndE9pQU5LZjlyVTE4WEI3bGQrdmpHV1lUZSpNQVVVMFE4WHF1K1VhVzdKUDlPQm9GQUdnN3d4a2liWFk4YmM5ZFhNd3NuckRxK1JjenpJamlrMnQrbFlhN3dCZE5HUkgrWUl4aU56T3B5dzJGUmU4MTV3YTI4VzNLTEEwRTcrWVpwRHA2Q0hRUlFCdXFrVTVZcDFYMktMeU15QlpEWFdrVEIxcEZIc3BTZklYR1UyMGYqeGpNRTAzdGhKSThVZVVXRHk3Vnh6VmVMZUpBY1A0eHJSK0RxT2d0Kk1QZjBHSUpCemVZdm11NTRjc0gzU29ubEY1SWFaVVNVZ2orN25FRktaMHpkS3V4NVhLZUFEWktBPT0iLCJCYXRjaFllYXIiOiIyMDE4IiwiQ291cnNlTmFtZSI6IkIuQSIsIkN1cnJlbnRTZW1lc3RlciI6IjYiLCJDdXJyZW50WWVhciI6IiIsIkRlZ3JlZUNvZGUiOiI4NiIsIlJvbGxObyI6IjExOEVHMDEzNTIiLCJOYW1lIjoiQUdBTFlBIEQuIiwibmJmIjoxNjE0MjM5NjcyLCJleHAiOjE2NDU3NzU2NzIsImlzcyI6InBhbHBhcC1wcm9kLWVudmlyb25tZW50IiwiYXVkIjoicGFscGFwcHJvZHVzZXJzIn0.vDA0Ccf3vX7xiYNGIUIP6zyi7RAWUsgG9N4IzF6M2Uk"
    };
  }
  componentDidMount() {
    //console.log(
    //  'this.props.route.params.Subjects = ',
    //  this.props.route.params.Subjects,
    //);
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
  retrieveData = async (key) => {
    try {
      const value = await AsyncStorage.getItem('token');
      //console.log('token = ', value);
      if (value !== null) {
        this.setState({Token: value}, function () {
          if (this.state.Title == 'Attendance') {
            if (this.state.subTitle == 'semester') {
              this.onLoadGetSemWiseAttendance();
            } else if (this.state.subTitle == 'Custom Dates') {
              //alert("fgdsfgdf")
              //this.setState({ Loader: false });
              let date = new Date();
              let finalCurrentDate = moment(date).format('YYYY-MM-DD');
              let newdate = date.setDate(date.getDate() - 7);
              var finalDate = moment(newdate).format('YYYY-MM-DD');
              this.setState(
                {
                  AttendanceEndDate: finalCurrentDate,
                  AttendanceStartDate: finalDate,
                },
                function () {
                  this.onPressGetAttendance();
                },
              );
            }
          } else if (this.state.Title == 'Internal Marks') {
            this.onLoadGetInternalMarks();
          } else if (this.state.Title == 'University Marks') {
            this.onLoadGetUniversitylMarks();
          } else if (this.state.Title == 'Performance') {
            this.onLoadGetPerformance();
          } else {
            this.setState({Loader: false});
          }
        });
      }
    } catch (error) {
      alert('Error retrieving data');
    }
  };
  onLoadGetLibraryCardInfo = () => {
    const url = config.baseUrl + 'student/LibraryCardInfo';
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.state.Token,
      },
      //body: JSON.stringify({
      //    "mpin": this.state.Mpin
      //}),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson) {
          this.setState(
            {Loader: false, LibraryCardInfo: responseJson},
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
        this.setState({Loader: false}, function () {
          alert(error);
        });
      });
  };
  onLoadGetLibraryInfoDetails = () => {
    const url = config.baseUrl + 'student/LibraryInfoDetails';
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.state.Token,
      },
      //body: JSON.stringify({
      //    "mpin": this.state.Mpin
      //}),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson) {
          this.setState(
            {Loader: false, LibraryInfoDetails: responseJson},
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
        this.setState({Loader: false}, function () {
          alert(error);
        });
      });
  };

  onLoadGetInternalPerformance = () => {
    const url = config.baseUrl + 'student/StudentSubjectWiseInternalMarks';
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
        if (responseJson) {
          this.setState(
            {Loader: false, InternalPerformance: responseJson.semesterDetails},
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
        this.setState({Loader: false}, function () {
          alert(error);
        });
      });
  };
  onLoadGetPerformance = () => {
    const url = config.baseUrl + 'student/StudentSubjectWisePerformance';
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
        if (responseJson) {
          this.setState(
            {Loader: false, Performance: responseJson.semesterWiseDetails},
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
        this.setState({Loader: false}, function () {
          alert(error);
        });
      });
  };
  onLoadGetInternalMarks = () => {
    const url = config.baseUrl + 'student/InternalMarks';
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
        this.onLoadGetInternalPerformance();
        if (responseJson) {
          this.setState({InternalMarks: responseJson}, function () {});
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
        this.onLoadGetInternalPerformance();
        this.setState({}, function () {
          alert(error);
        });
      });
  };
  onLoadGetUniversitylMarks = () => {
    const url = config.baseUrl + 'student/UniversityMarks';
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
        if (responseJson) {
          this.setState(
            {Loader: false, UniversityMarks: responseJson},
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
        this.setState({Loader: false}, function () {
          alert(error);
        });
      });
  };
  onPressGetAttendance = () => {
    const url = config.baseUrl + 'student/Attendance';
    console.log(url);
    console.log(
      'body = ',
      JSON.stringify({
        fromDate: this.state.AttendanceStartDate,
        toDate: this.state.AttendanceEndDate,
      }),
    );
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
        console.log(responseJson);
        if (responseJson) {
          this.setState(
            {
              Loader: false,
              AttendanceData: responseJson,
              Attendance: responseJson?.studentAttendance,
              ApiRequestRequired: false,
              HourCount: responseJson?.noofHours || 6,
            },
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

  MarkAttendanceOfStudentOfParticularClass = (hour) => {
    const url =
      config.baseUrl + 'student/MarkAttendanceOfStudentOfParticularClass';

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.state.Token,
      },
      body: JSON.stringify([
        {
          date: new Date(),
          hour: parseInt(hour),
          attVal: '1',
        },
      ]),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //console.log(responseJson);
        if (responseJson) {
          this.setState(
            {
              Loader: false,
            },
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
        //console.log(error);
        this.setState({Loader: false}, function () {
          alert(error);
        });
      });
  };
  onLoadGetSemWiseAttendance = () => {
    let res = this.props.route.params
      ? this.props.route.params.SemesterWiseAttendanceData.semester.split('- ')
      : '';
    const url =
      config.baseUrl + 'student/Getsubjectwiseattendanceofcurrentsem/' + res[1];

    //console.log(res[1]);
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
        if (responseJson) {
          this.setState({Loader: false, refreshing: false}, function () {
            //let TempSemWiseAttendance = this.state.SemWiseAttendance.filter(
            //  (item) => {
            //    return item.sem == res[1];
            //  },
            //);
            ////console.log('TempSemWiseAttendance = ', TempSemWiseAttendance);
            this.setState({
              Loader: false,
              refreshing: false,
              SemWiseAttendance: responseJson,
            });
          });
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
        this.setState({Loader: false}, function () {
          alert(error);
          //console.log(error);
        });
      });
  };

  _onRefresh = async (apiCall) => {
    this.setState({refreshing: true}, () => {
      apiCall;
    });
  };

  renderPerformanceHeader = () => {
    let PerformanceArr = this.state.Performance;
    return PerformanceArr.length ? (
      PerformanceArr.map((item, index) => {
        return (
          <ScrollView contentContainerStyle={{paddingBottom: 10}}>
            <Animatable.View
              key={Math.random()}
              duration={400}
              style={[
                styles.header,
                {
                  width: '97%',
                  alignSelf: 'center',
                  backgroundColor:
                    this.state.PerformanceHeaderTempIndex == index
                      ? '#DCE8EE'
                      : '#F5FCFF',
                },
              ]}
              transition="backgroundColor">
              <TouchableOpacity
                activeOpacity={0.6}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  width: '100%',
                }}
                onPress={() => {
                  if (this.state.PerformanceHeaderTempIndex == index) {
                    this.setState({PerformanceHeaderTempIndex: -1});
                  } else {
                    this.setState({PerformanceHeaderTempIndex: index});
                  }
                }}>
                <View
                  style={{
                    width: '90%',
                    paddingLeft: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={[
                      styles.TimeTableText,
                      {textTransform: 'uppercase'},
                    ]}>
                    Semester {item.semester}
                  </Text>
                </View>
                <View
                  style={{
                    width: '10%',
                    borderRadius: 10,
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    padding: 10,
                  }}>
                  {this.state.PerformanceHeaderTempIndex == index ? (
                    <CustomFastImage
                      resizeMode={'contain'}
                      style={{
                        width: '60%',
                        height: 20,
                        borderRadius: 10,
                        marginTop: 20,
                      }}
                      source={require('../assets/upArrow.png')}
                    />
                  ) : (
                    <CustomFastImage
                      resizeMode={'contain'}
                      style={{
                        width: '60%',
                        height: 20,
                        borderRadius: 10,
                        marginTop: 20,
                      }}
                      source={require('../assets/downArrow.png')}
                    />
                  )}
                </View>
              </TouchableOpacity>
              {this.state.PerformanceHeaderTempIndex == index
                ? this.renderPerformanceContent(item.subjectDetails)
                : null}
            </Animatable.View>
          </ScrollView>
        );
      })
    ) : !this.state.Loader ? (
      <Animatable.View
        key={Math.random()}
        duration={400}
        style={[styles.header, {width: '100%', alignSelf: 'center'}]}
        transition="backgroundColor">
        <Text style={{fontFamily: 'Poppins-Regular', paddingLeft: 10}}>
          No data available
        </Text>
      </Animatable.View>
    ) : null;
  };

  renderPerformanceContent = (marks) => {
    let PerformanceMarksArr = marks;
    return PerformanceMarksArr.length ? (
      PerformanceMarksArr.map((item, index) => {
        return (
          <Animatable.View
            key={Math.random()}
            duration={400}
            style={[styles.header, {width: '100%', alignSelf: 'center'}]}
            transition="backgroundColor">
            <TouchableOpacity
              activeOpacity={0.6}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                width: '100%',
              }}
              onPress={() => {
                //if (this.state.PerformanceMarksTempIndex == index) {
                //    this.setState({ PerformanceMarksTempIndex: -1 })
                //} else {
                //    this.setState({ PerformanceMarksTempIndex: index, })
                //}
              }}>
              {/*<Text style={[styles.headerText, { marginRight: 10 }]}>{this.state.TempIndex == index ? "-" : "+"}</Text>*/}
              <View
                style={{
                  width: '100%',
                  paddingLeft: 10,
                  justifyContent: 'center',
                }}>
                {item.subjectType ? (
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    Subject Type : {item.subjectType}
                  </Text>
                ) : null}
                {item.subjectName ? (
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    Subject Name : {item.subjectName}
                  </Text>
                ) : null}
                {item.subjectCode ? (
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    Subject Code : {item.subjectCode}
                  </Text>
                ) : null}
                {item.examYear ? (
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    Exam Year: {item.examYear}
                  </Text>
                ) : null}
                {item.examMonth ? (
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    Exam Month : {item.examMonth}
                  </Text>
                ) : null}
                {item.attempt ? (
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    Attempt : {item.attempt}
                  </Text>
                ) : null}
                {item.internalMark ? (
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    Internal Mark : {item.internalMark}
                  </Text>
                ) : null}
                {item.externalMark ? (
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    External Mark : {item.externalMark}
                  </Text>
                ) : null}
                {item.total ? (
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    Total : {item.total}
                  </Text>
                ) : null}
                {item.totalMark ? (
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    Total Mark : {item.totalMark}
                  </Text>
                ) : null}
                {item.grade ? (
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    Grade : {item.grade}
                  </Text>
                ) : null}
                {item.result ? (
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    Result :
                    <Text
                      style={{
                        fontFamily: 'Poppins-Regular',
                        fontFamily: 'Poppins-Regular',
                        color: item.result == 'FAIL' ? 'red' : 'green',
                      }}>
                      {item.result}
                    </Text>
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>
          </Animatable.View>
        );
      })
    ) : !this.state.Loader ? (
      <Animatable.View
        key={Math.random()}
        duration={400}
        style={[styles.header, {width: '100%', alignSelf: 'center'}]}
        transition="backgroundColor">
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
            fontFamily: 'Poppins-Regular',
            paddingLeft: 10,
          }}>
          No data available
        </Text>
      </Animatable.View>
    ) : null;
  };

  renderInternalPerformanceSubHeader = (item) => {
    let PerformanceArr = this.state.InternalPerformance;
    //let PerformanceArr = item;
    return PerformanceArr.length ? (
      PerformanceArr.map((item, index) => {
        return item.subjectInternalMarksDetails.length ? (
          item.subjectInternalMarksDetails.map((item, index) => {
            return (
              <ScrollView contentContainerStyle={{paddingBottom: 10}}>
                <Animatable.View
                  key={Math.random()}
                  duration={400}
                  style={[
                    styles.header,
                    {
                      width: '97%',
                      alignSelf: 'center',
                      backgroundColor:
                        this.state.InternalPerformanceSubHeaderTempIndex ==
                        index
                          ? '#DCE8EE'
                          : '#F5FCFF',
                    },
                  ]}
                  transition="backgroundColor">
                  <TouchableOpacity
                    activeOpacity={0.6}
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                      width: '100%',
                    }}
                    onPress={() => {
                      if (
                        this.state.InternalPerformanceSubHeaderTempIndex ==
                        index
                      ) {
                        this.setState({
                          InternalPerformanceSubHeaderTempIndex: -1,
                        });
                      } else {
                        this.setState({
                          InternalPerformanceSubHeaderTempIndex: index,
                        });
                      }
                    }}>
                    {/*<Text style={[styles.headerText, { marginRight: 10 }]}>{this.state.TempIndex == index ? "-" : "+"}</Text>*/}
                    <View
                      style={{
                        width: '90%',
                        paddingLeft: 10,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={[
                          styles.TimeTableText,
                          {textTransform: 'uppercase'},
                        ]}>
                        Semester {item.subjectName}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '10%',
                        borderRadius: 10,
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        padding: 10,
                      }}>
                      {this.state.InternalPerformanceSubHeaderTempIndex ==
                      index ? (
                        <CustomFastImage
                          resizeMode={'contain'}
                          style={{
                            width: '60%',
                            height: 20,
                            borderRadius: 10,
                            marginTop: 20,
                          }}
                          source={require('../assets/upArrow.png')}
                        />
                      ) : (
                        <CustomFastImage
                          resizeMode={'contain'}
                          style={{
                            width: '60%',
                            height: 20,
                            borderRadius: 10,
                            marginTop: 20,
                          }}
                          source={require('../assets/downArrow.png')}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                  {this.state.InternalPerformanceSubHeaderTempIndex == index
                    ? this.renderInternalPerformanceContent(
                        item.internalExamMarks,
                      )
                    : null}
                </Animatable.View>
              </ScrollView>
            );
          })
        ) : !this.state.Loader ? (
          <Animatable.View
            key={Math.random()}
            duration={400}
            style={[styles.header, {width: '100%', alignSelf: 'center'}]}
            transition="backgroundColor">
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                paddingLeft: 10,
              }}>
              No data available
            </Text>
          </Animatable.View>
        ) : null;
      })
    ) : !this.state.Loader ? (
      <Animatable.View
        key={Math.random()}
        duration={400}
        style={[styles.header, {width: '100%', alignSelf: 'center'}]}
        transition="backgroundColor">
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
            fontFamily: 'Poppins-Regular',
            paddingLeft: 10,
          }}>
          No data available
        </Text>
      </Animatable.View>
    ) : null;
  };
  renderUniversityMarksHeader = () => {
    let TempSem = [{sem: '1'}, {sem: '2'}, {sem: '3'}];
    return TempSem.map((item, index) => {
      return (
        <ScrollView contentContainerStyle={{paddingBottom: 10}}>
          <Animatable.View
            key={Math.random()}
            duration={400}
            style={[
              styles.header,
              {
                width: '97%',
                alignSelf: 'center',
                backgroundColor:
                  this.state.UniversityMarksTempIndex == index
                    ? '#DCE8EE'
                    : '#F5FCFF',
              },
            ]}
            transition="backgroundColor">
            <TouchableOpacity
              activeOpacity={0.6}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                width: '100%',
              }}
              onPress={() => {
                if (this.state.UniversityMarksTempIndex == index) {
                  this.setState({UniversityMarksTempIndex: -1});
                } else {
                  this.setState({UniversityMarksTempIndex: index});
                }
              }}>
              {/*<Text style={[styles.headerText, { marginRight: 10 }]}>{this.state.TempIndex == index ? "-" : "+"}</Text>*/}
              <View
                style={{
                  width: '90%',
                  paddingLeft: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={[styles.TimeTableText, {textTransform: 'uppercase'}]}>
                  Semester {item.sem}
                </Text>
              </View>
              <View
                style={{
                  width: '10%',
                  borderRadius: 10,
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  padding: 10,
                }}>
                {this.state.UniversityMarksTempIndex == index ? (
                  <CustomFastImage
                    resizeMode={'contain'}
                    style={{
                      width: '60%',
                      height: 20,
                      borderRadius: 10,
                      marginTop: 20,
                    }}
                    source={require('../assets/upArrow.png')}
                  />
                ) : (
                  <CustomFastImage
                    resizeMode={'contain'}
                    style={{
                      width: '60%',
                      height: 20,
                      borderRadius: 10,
                      marginTop: 20,
                    }}
                    source={require('../assets/downArrow.png')}
                  />
                )}
              </View>
            </TouchableOpacity>
            {this.state.UniversityMarksTempIndex == index
              ? this.renderuniversityMarksContent(item.sem)
              : null}
          </Animatable.View>
        </ScrollView>
      );
    });
  };

  renderuniversityMarksContent = (sem) => {
    let UniversityMarksArr = this.state.UniversityMarks;
    var filterred = UniversityMarksArr.filter(function (item) {
      return item.semester == sem;
    }).map(function ({
      rollNo,
      regNo,
      studentName,
      semester,
      subjectType,
      subjectName,
      subjectCode,
      examYear,
      examMonth,
      internalMark,
      externalMark,
      totalMark,
      result,
      grade,
      examCode,
      subjectNo,
    }) {
      return {
        rollNo,
        regNo,
        studentName,
        semester,
        subjectType,
        subjectName,
        subjectCode,
        examYear,
        examMonth,
        internalMark,
        externalMark,
        totalMark,
        result,
        grade,
        examCode,
        subjectNo,
      };
    });
    return filterred.length ? (
      filterred.map((item, index) => {
        return (
          <Animatable.View
            key={Math.random()}
            duration={400}
            style={[styles.header, {width: '100%', alignSelf: 'center'}]}
            transition="backgroundColor">
            <TouchableOpacity
              activeOpacity={0.6}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                width: '100%',
              }}
              onPress={() => {
                if (this.state.InternalMarksContentTempIndex == index) {
                  this.setState({InternalMarksContentTempIndex: -1});
                } else {
                  this.setState({InternalMarksContentTempIndex: index});
                }
              }}>
              {/*<Text style={[styles.headerText, { marginRight: 10 }]}>{this.state.TempIndex == index ? "-" : "+"}</Text>*/}
              <View
                style={{
                  width: '100%',
                  paddingLeft: 10,
                  justifyContent: 'center',
                }}>
                {item.subjectCode ? (
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    Subject Code : {item.subjectCode}
                  </Text>
                ) : null}
                {item.subjectName ? (
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    Subject Name : {item.subjectName}
                  </Text>
                ) : null}
                {item.subjectType ? (
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    Subject Type : {item.subjectType}
                  </Text>
                ) : null}
                {item.internalMark ? (
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    Internal Mark : {item.internalMark}
                  </Text>
                ) : null}
                {item.externalMark ? (
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    External Mark : {item.externalMark}
                  </Text>
                ) : null}
                {item.grade ? (
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    Grade : {item.grade}
                  </Text>
                ) : null}
                {item.result ? (
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    Result : {item.result}
                  </Text>
                ) : null}
                <Text style={[styles.headerText, {textTransform: 'none'}]}>
                  GPA/CGPA : unavailable
                </Text>
              </View>
            </TouchableOpacity>
          </Animatable.View>
        );
      })
    ) : !this.state.Loader ? (
      <Animatable.View
        key={Math.random()}
        duration={400}
        style={[styles.header, {width: '100%', alignSelf: 'center'}]}
        transition="backgroundColor">
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
            fontFamily: 'Poppins-Regular',
            paddingLeft: 10,
          }}>
          No data available
        </Text>
      </Animatable.View>
    ) : null;
  };
  renderInternalPerformanceContent = (marks) => {
    let PerformanceMarksArr = marks;
    return PerformanceMarksArr.length ? (
      PerformanceMarksArr.map((item, index) => {
        return (
          <Animatable.View
            key={Math.random()}
            duration={400}
            style={[styles.header, {width: '100%', alignSelf: 'center'}]}
            transition="backgroundColor">
            <TouchableOpacity
              activeOpacity={0.6}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                width: '100%',
              }}
              onPress={() => {
                if (this.state.InternalPerformanceMarksTempIndex == index) {
                  this.setState({InternalPerformanceMarksTempIndex: -1});
                } else {
                  this.setState({InternalPerformanceMarksTempIndex: index});
                }
              }}>
              {/*<Text style={[styles.headerText, { marginRight: 10 }]}>{this.state.TempIndex == index ? "-" : "+"}</Text>*/}
              <View
                style={{
                  width: '100%',
                  paddingLeft: 10,
                  justifyContent: 'center',
                }}>
                {item.internalTestName ? (
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    Internal Test Name : {item.internalTestName}
                  </Text>
                ) : null}
                {item.examDate ? (
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    Exam Date : {item.examDate}
                  </Text>
                ) : null}
                {item.maximumMark ? (
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    Maximum Mark : {item.maximumMark}
                  </Text>
                ) : null}
                {item.minimumMark ? (
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    Minimum Mark : {item.minimumMark}
                  </Text>
                ) : null}
                {item.studentInternalMark ? (
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    Student Internal Mark : {item.studentInternalMark}
                  </Text>
                ) : null}
                {item.result ? (
                  <Text
                    style={[
                      styles.headerText,
                      {textTransform: 'none', fontWeight: '600'},
                    ]}>
                    Result :
                    <Text
                      style={{
                        fontFamily: 'Poppins-Regular',
                        fontFamily: 'Poppins-Regular',
                        textTransform: 'uppercase',
                        color: item.result == 'Fail' ? 'red' : 'green',
                      }}>
                      {item.result}
                    </Text>
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>
          </Animatable.View>
        );
      })
    ) : !this.state.Loader ? (
      <Animatable.View
        key={Math.random()}
        duration={400}
        style={[styles.header, {width: '100%', alignSelf: 'center'}]}
        transition="backgroundColor">
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
            fontFamily: 'Poppins-Regular',
            paddingLeft: 10,
          }}>
          No data available
        </Text>
      </Animatable.View>
    ) : null;
  };

  renderInternalMarksHeader = () => {
    var InternalMarksArr = this.state.InternalMarks;

    return InternalMarksArr.length ? (
      InternalMarksArr.map((item, index) => {
        return (
          <ScrollView contentContainerStyle={{paddingBottom: 10}}>
            <Animatable.View
              key={Math.random()}
              duration={400}
              style={[
                styles.header,
                {
                  width: '97%',
                  alignSelf: 'center',
                  backgroundColor:
                    this.state.InternalMarksTempIndex == index
                      ? '#DCE8EE'
                      : '#F5FCFF',
                },
              ]}
              transition="backgroundColor">
              <TouchableOpacity
                activeOpacity={0.6}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  width: '100%',
                }}
                onPress={() => {
                  if (this.state.InternalMarksTempIndex == index) {
                    this.setState({InternalMarksTempIndex: -1});
                  } else {
                    this.setState({InternalMarksTempIndex: index});
                  }
                }}>
                {/*<Text style={[styles.headerText, { marginRight: 10 }]}>{this.state.TempIndex == index ? "-" : "+"}</Text>*/}
                <View
                  style={{
                    width: '90%',
                    paddingLeft: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={[
                      styles.TimeTableText,
                      {textTransform: 'uppercase'},
                    ]}>
                    {item.criteria}
                  </Text>
                </View>
                <View
                  style={{
                    width: '10%',
                    borderRadius: 10,
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    padding: 10,
                  }}>
                  {this.state.InternalMarksTempIndex == index ? (
                    <CustomFastImage
                      resizeMode={'contain'}
                      style={{
                        width: '60%',
                        height: 20,
                        borderRadius: 10,
                        marginTop: 20,
                      }}
                      source={require('../assets/upArrow.png')}
                    />
                  ) : (
                    <CustomFastImage
                      resizeMode={'contain'}
                      style={{
                        width: '60%',
                        height: 20,
                        borderRadius: 10,
                        marginTop: 20,
                      }}
                      source={require('../assets/downArrow.png')}
                    />
                  )}
                </View>
              </TouchableOpacity>
              {this.state.InternalMarksTempIndex == index
                ? this.renderInternalMarksContent(item.criteriaDetails)
                : null}
            </Animatable.View>
          </ScrollView>
        );
      })
    ) : !this.state.Loader ? (
      <Animatable.View
        key={Math.random()}
        duration={400}
        style={[styles.header, {width: '100%', alignSelf: 'center'}]}
        transition="backgroundColor">
        <Text style={[styles.headerText, {textTransform: 'none'}]}>
          No data available
        </Text>
      </Animatable.View>
    ) : null;
  };
  renderInternalMarksContent = (subjectName) => {
    let InternalMarksArr = subjectName;
    return InternalMarksArr.length ? (
      InternalMarksArr.map((item, index) => {
        return (
          <Animatable.View
            key={Math.random()}
            duration={400}
            style={[styles.header, {width: '100%', alignSelf: 'center'}]}
            transition="backgroundColor">
            <TouchableOpacity
              activeOpacity={0.6}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                width: '100%',
              }}
              onPress={() => {
                if (this.state.InternalMarksContent2TempIndex == index) {
                  this.setState({InternalMarksContent2TempIndex: -1});
                } else {
                  this.setState({InternalMarksContent2TempIndex: index});
                }
              }}>
              {/*<Text style={[styles.headerText, { marginRight: 10 }]}>{this.state.TempIndex == index ? "-" : "+"}</Text>*/}
              <View
                style={{
                  width: '100%',
                  paddingLeft: 10,
                  justifyContent: 'center',
                }}>
                <Text style={[styles.headerText, {textTransform: 'none'}]}>
                  Serial No : {index + 1}
                </Text>
                {item.examCode ? (
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    Exam Date : {item.examDate}
                  </Text>
                ) : null}
                {item.examDate ? (
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    Exam Code : {item.examCode}
                  </Text>
                ) : null}
                {item.subjectName ? (
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    Subject Name : {item.subjectName}
                  </Text>
                ) : null}
                {item.subjectCode ? (
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    Subject Code : {item.subjectCode}
                  </Text>
                ) : null}
                {item.subjectNo ? (
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    Subject Number : {item.subjectNo}
                  </Text>
                ) : null}
                {item.maxMark ? (
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    Max Mark : {item.maxMark}
                  </Text>
                ) : null}
                {item.minMark ? (
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    Min Mark : {item.minMark}
                  </Text>
                ) : null}
                {item.mark ? (
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    Mark : {item.mark}
                  </Text>
                ) : null}
                {item.result ? (
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    Result : {item.result}
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>
          </Animatable.View>
        );
      })
    ) : !this.state.Loader ? (
      <Animatable.View
        key={Math.random()}
        duration={400}
        style={[styles.header, {width: '100%', alignSelf: 'center'}]}
        transition="backgroundColor">
        <Text style={[styles.headerText, {textTransform: 'none'}]}>
          No data available
        </Text>
      </Animatable.View>
    ) : null;
  };
  renderAttendanceHeader = () => {
    const startDate = moment(this.state.AttendanceStartDate);
    const timeEnd = moment(this.state.AttendanceEndDate);
    const diff = timeEnd.diff(startDate);
    const diffDuration = moment.duration(diff);
    const DaysDifference = diffDuration.days();
    return (
      <ScrollView contentContainerStyle={{paddingBottom: 10}}>
        <View style={styles.SubjectMainContainer}>
          <CustomFastImage
            resizeMode={'stretch'}
            style={styles.SubjectNameImageView}
            source={require('../assets/greenBg.png')}
          />
          <View style={styles.SubjectNameTextView}>
            <Text numberOfLines={1} style={styles.SubjectNameTextStyle}>
              {this.state.subTitle}
            </Text>
          </View>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: 'Poppins-Regular',
              color: 'black',
              textAlign: 'left',
              alignSelf: 'flex-start',
              marginLeft: 20,
              fontWeight: '600',
              fontFamily: 'Poppins-Regular',
              fontSize: ResponsiveSize(config.AppAllTextSize),
            }}>
            Select Dates
          </Text>

          <View style={styles.AttendanceCustomDateTextView}>
            <View
              style={{
                width: '90%',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <DatePicker
                date={this.state.AttendanceStartDate}
                mode="date"
                placeholder="from date"
                format="YYYY-MM-DD"
                //minDate="2020-01-01"
                maxDate={this.state.AttendanceEndDate}
                //maxDate={new Date()}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                showIcon={false}
                onDateChange={(date) => {
                  this.setState(
                    {
                      AttendanceStartDate: date,
                      ApiRequestRequired: true,
                      Loader: true,
                    },
                    function () {
                      this.state.AttendanceStartDate != '' &&
                      this.state.AttendanceEndDate != '' &&
                      this.state.ApiRequestRequired
                        ? this.onPressGetAttendance()
                        : null;
                    },
                  );
                }}
              />
              <Text style={{fontFamily: 'Poppins-Regular', color: 'gray'}}>
                -
              </Text>
              <DatePicker
                date={this.state.AttendanceEndDate}
                mode="date"
                placeholder="to date"
                format="YYYY-MM-DD"
                minDate={this.state.AttendanceStartDate}
                maxDate={new Date()}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                showIcon={false}
                onDateChange={(date) => {
                  this.setState(
                    {
                      AttendanceEndDate: date,
                      ApiRequestRequired: true,
                      Loader: true,
                    },
                    function () {
                      this.state.AttendanceStartDate != '' &&
                      this.state.AttendanceEndDate != '' &&
                      this.state.ApiRequestRequired
                        ? this.onPressGetAttendance()
                        : null;
                    },
                  );
                }}
              />
            </View>
            <CustomFastImage
              resizeMode={'contain'}
              style={{width: 20, height: 20}}
              source={require('../assets/calendar.png')}
            />
          </View>
          {this.state.AttendanceData ? (
            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 10,
              }}>
              <View
                style={{
                  width: '30%',
                  backgroundColor: 'white',
                  elevation: 3,
                  shadowColor: '#008B9B',
                  shadowOpacity: 0.3,
                  shadowOffset: {width: 1, height: 1},
                  borderRadius: 10,
                  borderLeftWidth: 3,
                  borderColor: GreenColor,
                  padding: 10,
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    color: '#008B9B',
                    fontSize: ResponsiveSize(config.AppAllTextSize),
                  }}>
                  Total
                </Text>
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    color: '#008B9B',
                    fontSize: ResponsiveSize(config.buttonSize),
                    fontWeight: '600',
                  }}>
                  {this.state.AttendanceData.totalHours
                    ? this.state.AttendanceData.totalHours
                    : '0'}
                  <Text
                    style={{
                      fontFamily: 'Poppins-Regular',
                      fontFamily: 'Poppins-Regular',
                      fontSize: ResponsiveSize(12),
                    }}>
                    H
                  </Text>
                </Text>
              </View>
              <View
                style={{
                  width: '30%',
                  backgroundColor: 'white',
                  elevation: 3,
                  shadowColor: '#23D76B',
                  shadowOpacity: 0.3,
                  shadowOffset: {width: 1, height: 1},
                  borderRadius: 10,
                  borderLeftWidth: 3,
                  borderColor: '#23D76B',
                  padding: 10,
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    color: '#23D76B',
                    fontSize: ResponsiveSize(config.AppAllTextSize),
                  }}>
                  Present
                </Text>
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    color: '#23D76B',
                    fontSize: ResponsiveSize(config.buttonSize),
                    fontWeight: '600',
                  }}>
                  {this.state.AttendanceData.totalHoursPresent
                    ? this.state.AttendanceData.totalHoursPresent
                    : '0'}
                  <Text
                    style={{
                      fontFamily: 'Poppins-Regular',
                      fontFamily: 'Poppins-Regular',
                      fontSize: ResponsiveSize(12),
                    }}>
                    H
                  </Text>
                </Text>
              </View>
              <View
                style={{
                  width: '30%',
                  backgroundColor: 'white',
                  elevation: 3,
                  shadowColor: 'red',
                  shadowOpacity: 0.3,
                  shadowOffset: {width: 1, height: 1},
                  borderRadius: 10,
                  borderLeftWidth: 3,
                  borderColor: 'red',
                  padding: 10,
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    color: 'red',
                    fontSize: ResponsiveSize(config.AppAllTextSize),
                  }}>
                  Absent
                </Text>
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    color: 'red',
                    fontSize: ResponsiveSize(config.buttonSize),
                    fontWeight: '600',
                  }}>
                  {this.state.AttendanceData.totalHourseAbsent
                    ? this.state.AttendanceData.totalHourseAbsent
                    : '0'}
                  <Text
                    style={{
                      fontFamily: 'Poppins-Regular',
                      fontFamily: 'Poppins-Regular',
                      fontSize: ResponsiveSize(12),
                    }}>
                    H
                  </Text>
                </Text>
              </View>
            </View>
          ) : null}

          <View
            style={{
              width: '95%',
              alignSelf: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              flexWrap: 'wrap',
              marginVertical: 10,
            }}>
            <View
              style={{
                //width: '33%',
                padding: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 10,
                  marginRight: 10,
                  backgroundColor: '#23D76B',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontFamily: 'Poppins-Regular', color: 'white'}}>
                  P
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  color: '#23D76B',
                  fontWeight: '600',
                }}>
                Present
              </Text>
            </View>
            <View
              style={{
                //width: '33%',
                padding: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 10,
                  marginRight: 10,
                  backgroundColor: 'red',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontFamily: 'Poppins-Regular', color: 'white'}}>
                  A
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  color: 'red',
                  fontWeight: '600',
                }}>
                Absent
              </Text>
            </View>
            <View
              style={{
                //width: '33%',
                padding: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 10,
                  marginRight: 10,
                  backgroundColor: 'silver',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontFamily: 'Poppins-Regular', color: 'white'}}>
                  N
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  color: 'silver',
                  fontWeight: '600',
                }}>
                Not Entered
              </Text>
            </View>
            <View
              style={{
                //width: '33%',
                padding: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 10,
                  marginRight: 10,
                  backgroundColor: 'silver',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontFamily: 'Poppins-Regular', color: 'white'}}>
                  OD
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  color: 'silver',
                  fontWeight: '600',
                }}>
                Organization Developement
              </Text>
            </View>
          </View>

          {!this.state.ApiRequestRequired && this.state.Attendance.length ? (
            //<ScrollView horizontal>
            //    {
            this.renderAttendanceContent()
          ) : //</View>}
          //</ScrollView>
          !this.state.Loader ? (
            <Animatable.View
              key={Math.random()}
              duration={400}
              style={[styles.header, {width: '100%', alignSelf: 'center'}]}
              transition="backgroundColor">
              <Text
                style={[
                  styles.headerText,
                  {textTransform: 'none', textAlign: 'center'},
                ]}>
                No data available
              </Text>
            </Animatable.View>
          ) : null}
        </View>
      </ScrollView>
    );
  };

  renderAttendanceContent = () => {
    let AttendanceArr = this.state.Attendance;
    return (
      <View
        style={{backgroundColor: '#EDFDFF', borderRadius: 15, marginTop: 10}}>
        <View
          style={{
            width: '95%',
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '25%',
              alignSelf: 'center',
              borderBottomLeftRadius: 15,
              borderBottomRightRadius: 15,
            }}>
            {AttendanceArr.length ? (
              <View
                style={{
                  width: '100%',
                  alignSelf: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-evenly',
                  backgroundColor: 'transparent',
                }}>
                <View
                  style={{
                    backgroundColor: GreenColor,
                    width: '100%',
                    height: ResponsiveSize(35),
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginHorizontal: 20,
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                  }}>
                  <Text style={{fontFamily: 'Poppins-Regular', color: 'white'}}>
                    Date
                  </Text>
                </View>
              </View>
            ) : null}
            {AttendanceArr.length
              ? AttendanceArr.slice(
                  this.state.ArrLengthstart,
                  this.state.ArrLengthEnd,
                ).map((item, index) => {
                  return (
                    <View
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                        backgroundColor:
                          index < 19
                            ? this.state.Colors2[index]
                            : this.state.Colors2[
                                Math.floor(
                                  Math.random() * this.state.Colors2.length,
                                )
                              ],
                      }}>
                      <View
                        style={{
                          backgroundColor: GreenColor,
                          width: '100%',
                          height: ResponsiveSize(35),
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginHorizontal: 20,
                          borderBottomLeftRadius:
                            index % 6 == 0 && index != 0 ? 15 : 0,
                          borderBottomRightRadius:
                            index % 6 == 0 && index != 0 ? 15 : 0,
                        }}>
                        <Text
                          style={{
                            fontFamily: 'Poppins-Regular',
                            color: 'white',
                          }}>
                          {item.attdate}
                        </Text>
                      </View>
                    </View>
                  );
                })
              : null}
          </View>
          {/*<ScrollView horizontal showsHorizontalScrollIndicator={false}>*/}
          <View
            style={{
              width: '70%',
              alignSelf: 'center',
              borderBottomLeftRadius: 15,
              borderBottomRightRadius: 15,
            }}>
            {AttendanceArr.length ? (
              <View
                style={{
                  width: '100%',
                  alignSelf: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-evenly',
                }}>
                {this.state.HourCount >= 1 ? (
                  <View
                    style={[
                      styles.AttendanceStatusView,
                      {backgroundColor: 'transparent'},
                    ]}>
                    <Text style={styles.Heading}>H1</Text>
                  </View>
                ) : null}
                {this.state.HourCount >= 2 ? (
                  <View
                    style={[
                      styles.AttendanceStatusView,
                      {backgroundColor: 'transparent'},
                    ]}>
                    <Text style={styles.Heading}>H2</Text>
                  </View>
                ) : null}
                {this.state.HourCount >= 3 ? (
                  <View
                    style={[
                      styles.AttendanceStatusView,
                      {backgroundColor: 'transparent'},
                    ]}>
                    <Text style={styles.Heading}>H3</Text>
                  </View>
                ) : null}
                {this.state.HourCount >= 4 ? (
                  <View
                    style={[
                      styles.AttendanceStatusView,
                      {backgroundColor: 'transparent'},
                    ]}>
                    <Text style={styles.Heading}>H4</Text>
                  </View>
                ) : null}
                {this.state.HourCount >= 5 ? (
                  <View
                    style={[
                      styles.AttendanceStatusView,
                      {backgroundColor: 'transparent'},
                    ]}>
                    <Text style={styles.Heading}>H5</Text>
                  </View>
                ) : null}
                {this.state.HourCount >= 6 ? (
                  <View
                    style={[
                      styles.AttendanceStatusView,
                      {backgroundColor: 'transparent'},
                    ]}>
                    <Text style={styles.Heading}>H6</Text>
                  </View>
                ) : null}
                {this.state.HourCount >= 7 ? (
                  <View
                    style={[
                      styles.AttendanceStatusView,
                      {backgroundColor: 'transparent'},
                    ]}>
                    <Text style={styles.Heading}>H7</Text>
                  </View>
                ) : null}
                {this.state.HourCount >= 8 ? (
                  <View
                    style={[
                      styles.AttendanceStatusView,
                      {backgroundColor: 'transparent'},
                    ]}>
                    <Text style={styles.Heading}>H8</Text>
                  </View>
                ) : null}
                {this.state.HourCount >= 9 ? (
                  <View
                    style={[
                      styles.AttendanceStatusView,
                      {backgroundColor: 'transparent'},
                    ]}>
                    <Text style={styles.Heading}>H9</Text>
                  </View>
                ) : null}
              </View>
            ) : null}

            {AttendanceArr.length ? (
              AttendanceArr.slice(
                this.state.ArrLengthstart,
                this.state.ArrLengthEnd,
              ).map((item, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      width: '100%',
                      alignSelf: 'center',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-evenly',
                    }}>
                    {this.state.HourCount >= 1 ? (
                      <View
                        style={[
                          styles.AttendanceStatusView,
                          {
                            backgroundColor:
                              item.h1 == 'P'
                                ? '#23D76B'
                                : item.h1 == 'A'
                                ? 'red'
                                : 'silver',
                          },
                        ]}>
                        <Text
                          style={{
                            fontFamily: 'Poppins-Regular',
                            color: 'white',
                          }}>
                          {item.h1 ? item.h1 : 'N'}
                        </Text>
                      </View>
                    ) : null}
                    {this.state.HourCount >= 2 ? (
                      <View
                        style={[
                          styles.AttendanceStatusView,
                          {
                            backgroundColor:
                              item.h2 == 'P'
                                ? '#23D76B'
                                : item.h2 == 'A'
                                ? 'red'
                                : 'silver',
                          },
                        ]}>
                        <Text
                          style={{
                            fontFamily: 'Poppins-Regular',
                            color: 'white',
                          }}>
                          {item.h2 ? item.h2 : 'N'}
                        </Text>
                      </View>
                    ) : null}
                    {this.state.HourCount >= 3 ? (
                      <View
                        style={[
                          styles.AttendanceStatusView,
                          {
                            backgroundColor:
                              item.h3 == 'P'
                                ? '#23D76B'
                                : item.h3 == 'A'
                                ? 'red'
                                : 'silver',
                          },
                        ]}>
                        <Text
                          style={{
                            fontFamily: 'Poppins-Regular',
                            color: 'white',
                          }}>
                          {item.h3 ? item.h3 : 'N'}
                        </Text>
                      </View>
                    ) : null}
                    {this.state.HourCount >= 4 ? (
                      <View
                        style={[
                          styles.AttendanceStatusView,
                          {
                            backgroundColor:
                              item.h4 == 'P'
                                ? '#23D76B'
                                : item.h4 == 'A'
                                ? 'red'
                                : 'silver',
                          },
                        ]}>
                        <Text
                          style={{
                            fontFamily: 'Poppins-Regular',
                            color: 'white',
                          }}>
                          {item.h4 ? item.h4 : 'N'}
                        </Text>
                      </View>
                    ) : null}
                    {this.state.HourCount >= 5 ? (
                      <View
                        style={[
                          styles.AttendanceStatusView,
                          {
                            backgroundColor:
                              item.h5 == 'P'
                                ? '#23D76B'
                                : item.h5 == 'A'
                                ? 'red'
                                : 'silver',
                          },
                        ]}>
                        <Text
                          style={{
                            fontFamily: 'Poppins-Regular',
                            color: 'white',
                          }}>
                          {item.h5 ? item.h5 : 'N'}
                        </Text>
                      </View>
                    ) : null}
                    {this.state.HourCount >= 6 ? (
                      <View
                        style={[
                          styles.AttendanceStatusView,
                          {
                            backgroundColor:
                              item.h6 == 'P'
                                ? '#23D76B'
                                : item.h6 == 'A'
                                ? 'red'
                                : 'silver',
                          },
                        ]}>
                        <Text
                          style={{
                            fontFamily: 'Poppins-Regular',
                            color: 'white',
                          }}>
                          {item.h6 ? item.h6 : 'N'}
                        </Text>
                      </View>
                    ) : null}
                    {this.state.HourCount >= 7 ? (
                      <View
                        style={[
                          styles.AttendanceStatusView,
                          {
                            backgroundColor:
                              item.h7 == 'P'
                                ? '#23D76B'
                                : item.h7 == 'A'
                                ? 'red'
                                : 'silver',
                          },
                        ]}>
                        <Text
                          style={{
                            fontFamily: 'Poppins-Regular',
                            color: 'white',
                          }}>
                          {item.h7 ? item.h7 : 'N'}
                        </Text>
                      </View>
                    ) : null}
                    {this.state.HourCount >= 8 ? (
                      <View
                        style={[
                          styles.AttendanceStatusView,
                          {
                            backgroundColor:
                              item.h8 == 'P'
                                ? '#23D76B'
                                : item.h8 == 'A'
                                ? 'red'
                                : 'silver',
                          },
                        ]}>
                        <Text
                          style={{
                            fontFamily: 'Poppins-Regular',
                            color: 'white',
                          }}>
                          {item.h8 ? item.h8 : 'N'}
                        </Text>
                      </View>
                    ) : null}
                    {this.state.HourCount >= 9 ? (
                      <View
                        style={[
                          styles.AttendanceStatusView,
                          {
                            backgroundColor:
                              item.h9 == 'P'
                                ? '#23D76B'
                                : item.h9 == 'A'
                                ? 'red'
                                : 'silver',
                          },
                        ]}>
                        <Text
                          style={{
                            fontFamily: 'Poppins-Regular',
                            color: 'white',
                          }}>
                          {item.h9 ? item.h9 : 'N'}
                        </Text>
                      </View>
                    ) : null}
                    {/*<View style={[styles.AttendanceStatusView, { backgroundColor: item.h10 == "P" ? "#23D76B" : (item.h10 == "A" ? "red" : "silver") }]}>
                                        <Text style={{ fontFamily: "Poppins-Regular", color: "white" }}>{item.h10 ? item.h10 : "N"}</Text>
                                    </View>
                                    <View style={[styles.AttendanceStatusView, { backgroundColor: item.h11 == "P" ? "#23D76B" : (item.h11 == "A" ? "red" : "silver") }]}>
                                        <Text style={{ fontFamily: "Poppins-Regular", color: "white" }}>{item.h11 ? item.h11 : "N"}</Text>
                                    </View>
                                    <View style={[styles.AttendanceStatusView, { backgroundColor: item.h12 == "P" ? "#23D76B" : (item.h12 == "A" ? "red" : "silver") }]}>
                                        <Text style={{ fontFamily: "Poppins-Regular", color: "white" }}>{item.h12 ? item.h12 : "N"}</Text>
                                    </View>
                                    <View style={[styles.AttendanceStatusView, { backgroundColor: item.h13 == "P" ? "#23D76B" : (item.h13 == "A" ? "red" : "silver") }]}>
                                        <Text style={{ fontFamily: "Poppins-Regular", color: "white" }}>{item.h13 ? item.h13 : "N"}</Text>
                                    </View>
                                    <View style={[styles.AttendanceStatusView, { backgroundColor: item.h14 == "P" ? "#23D76B" : (item.h14 == "A" ? "red" : "silver") }]}>
                                        <Text style={{ fontFamily: "Poppins-Regular", color: "white" }}>{item.h14 ? item.h14 : "N"}</Text>
                                    </View>
                                    <View style={[styles.AttendanceStatusView, { backgroundColor: item.h15 == "P" ? "#23D76B" : (item.h15 == "A" ? "red" : "silver") }]}>
                                        <Text style={{ fontFamily: "Poppins-Regular", color: "white" }}>{item.h15 ? item.h15 : "N"}</Text>
                                    </View>*/}
                  </View>
                );
              })
            ) : !this.state.Loader ? (
              <Animatable.View
                key={Math.random()}
                duration={400}
                style={[styles.header, {width: '100%', alignSelf: 'center'}]}
                transition="backgroundColor">
                <Text
                  style={[
                    styles.headerText,
                    {textTransform: 'none', textAlign: 'center'},
                  ]}>
                  No data available for selected time period
                </Text>
              </Animatable.View>
            ) : null}
          </View>
          {/*</ScrollView>*/}
        </View>

        {AttendanceArr.length ? (
          <View
            style={{
              alignSelf: 'center',
              height: 50,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                if (this.state.ArrLengthstart > 0) {
                  this.setState({
                    ArrLengthEnd: this.state.ArrLengthEnd - 7,
                    ArrLengthstart: this.state.ArrLengthstart - 7,
                  });
                } else {
                  Toast.show('Minimum value reached');
                }
              }}
              style={{
                marginRight: 50,
                width: 25,
                height: 25,
                borderRadius: 25,
                backgroundColor: 'white',
                elevation: 3,
                shadowColor: 'silver',
                shadowOffset: {width: 1, height: 1},
                shadowOpacity: 0.6,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <CustomFastImage
                resizeMode={'contain'}
                style={{width: 15, height: 15}}
                source={require('../assets/left.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  ArrLengthEnd: this.state.ArrLengthEnd + 7,
                  ArrLengthstart: this.state.ArrLengthstart + 7,
                });
              }}
              style={{
                marginLeft: 50,
                width: 25,
                height: 25,
                borderRadius: 25,
                backgroundColor: 'white',
                elevation: 3,
                shadowColor: 'silver',
                shadowOffset: {width: 1, height: 1},
                shadowOpacity: 0.6,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <CustomFastImage
                resizeMode={'contain'}
                style={{width: 15, height: 15}}
                source={require('../assets/right2.png')}
              />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  };

  renderLibraryHeader = () => {
    let PerformanceArr = ['Library Card Info', 'Libray Details'];
    return PerformanceArr.length ? (
      PerformanceArr.map((item, index) => {
        return (
          <ScrollView contentContainerStyle={{paddingBottom: 10}}>
            <Animatable.View
              key={Math.random()}
              duration={400}
              style={[
                styles.header,
                {
                  width: '97%',
                  alignSelf: 'center',
                  backgroundColor:
                    this.state.LibraryHeaderTempIndex == index
                      ? '#DCE8EE'
                      : '#F5FCFF',
                },
              ]}
              transition="backgroundColor">
              <TouchableOpacity
                activeOpacity={0.6}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  width: '100%',
                }}
                onPress={() => {
                  if (this.state.LibraryHeaderTempIndex == index) {
                    this.setState({LibraryHeaderTempIndex: -1});
                  } else {
                    if (item == 'Library Card Info') {
                      this.setState({Loader: true}, function () {
                        this.onLoadGetLibraryCardInfo();
                      });
                    } else if (item == 'Libray Details') {
                      this.setState({Loader: true}, function () {
                        this.onLoadGetLibraryInfoDetails();
                      });
                    }
                    this.setState({LibraryHeaderTempIndex: index});
                  }
                }}>
                {/*<Text style={[styles.headerText, { marginRight: 10 }]}>{this.state.TempIndex == index ? "-" : "+"}</Text>*/}
                <View
                  style={{
                    width: '90%',
                    paddingLeft: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={[
                      styles.TimeTableText,
                      {textTransform: 'uppercase'},
                    ]}>
                    {item}
                  </Text>
                </View>
                <View
                  style={{
                    width: '10%',
                    borderRadius: 10,
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    padding: 10,
                  }}>
                  {this.state.LibraryHeaderTempIndex == index ? (
                    <CustomFastImage
                      resizeMode={'contain'}
                      style={{
                        width: '60%',
                        height: 20,
                        borderRadius: 10,
                        marginTop: 20,
                      }}
                      source={require('../assets/upArrow.png')}
                    />
                  ) : (
                    <CustomFastImage
                      resizeMode={'contain'}
                      style={{
                        width: '60%',
                        height: 20,
                        borderRadius: 10,
                        marginTop: 20,
                      }}
                      source={require('../assets/downArrow.png')}
                    />
                  )}
                </View>
              </TouchableOpacity>
              {this.state.LibraryHeaderTempIndex == index
                ? this.renderLibraryContent(item)
                : null}
            </Animatable.View>
          </ScrollView>
        );
      })
    ) : !this.state.Loader ? (
      <Animatable.View
        key={Math.random()}
        duration={400}
        style={[styles.header, {width: '100%', alignSelf: 'center'}]}
        transition="backgroundColor">
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
            fontFamily: 'Poppins-Regular',
            paddingLeft: 10,
          }}>
          No data available
        </Text>
      </Animatable.View>
    ) : null;
  };
  renderLibraryContent = (id) => {
    if (id == 'Library Card Info') {
      let LibraryArr = this.state.LibraryCardInfo;

      return LibraryArr.length ? (
        LibraryArr.map((item, index) => {
          return (
            <Animatable.View
              key={Math.random()}
              duration={400}
              style={[styles.header, {width: '100%', alignSelf: 'center'}]}
              transition="backgroundColor">
              <TouchableOpacity
                activeOpacity={0.6}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  width: '100%',
                }}
                onPress={() => {}}>
                <View
                  style={{
                    width: '100%',
                    paddingLeft: 10,
                    justifyContent: 'center',
                  }}>
                  {item.studentName ? (
                    <Text style={[styles.headerText, {textTransform: 'none'}]}>
                      Student Name: {item.studentName}
                    </Text>
                  ) : null}
                  {item.departmentName ? (
                    <Text style={[styles.headerText, {textTransform: 'none'}]}>
                      Department Name : {item.departmentName}
                    </Text>
                  ) : null}
                  {item.cardNumber ? (
                    <Text style={[styles.headerText, {textTransform: 'none'}]}>
                      Card Number : {item.cardNumber}
                    </Text>
                  ) : null}
                  {item.cardStatus ? (
                    <Text style={[styles.headerText, {textTransform: 'none'}]}>
                      Card Status : {item.cardStatus}
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            </Animatable.View>
          );
        })
      ) : !this.state.Loader ? (
        <Animatable.View
          key={Math.random()}
          duration={400}
          style={[styles.header, {width: '100%', alignSelf: 'center'}]}
          transition="backgroundColor">
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              fontFamily: 'Poppins-Regular',
              paddingLeft: 10,
            }}>
            No data available
          </Text>
        </Animatable.View>
      ) : null;
    } else {
      let LibraryArr = this.state.LibraryInfoDetails;
      return LibraryArr.length ? (
        LibraryArr.map((item, index) => {
          return (
            <Animatable.View
              key={Math.random()}
              duration={400}
              style={[styles.header, {width: '100%', alignSelf: 'center'}]}
              transition="backgroundColor">
              <TouchableOpacity
                activeOpacity={0.6}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  width: '100%',
                }}
                onPress={() => {}}>
                <View
                  style={{
                    width: '100%',
                    paddingLeft: 10,
                    justifyContent: 'center',
                  }}>
                  {item.accountNumber ? (
                    <Text style={[styles.headerText, {textTransform: 'none'}]}>
                      Account Number : {item.accountNumber}
                    </Text>
                  ) : null}
                  {item.author ? (
                    <Text style={[styles.headerText, {textTransform: 'none'}]}>
                      Author : {item.author}
                    </Text>
                  ) : null}
                  {item.dueDate ? (
                    <Text style={[styles.headerText, {textTransform: 'none'}]}>
                      Due Date : {item.dueDate}
                    </Text>
                  ) : null}
                  {item.fine ? (
                    <Text style={[styles.headerText, {textTransform: 'none'}]}>
                      Fine: {item.fine}
                    </Text>
                  ) : null}
                  {item.issuedDate ? (
                    <Text style={[styles.headerText, {textTransform: 'none'}]}>
                      Issued Date : {item.issuedDate}
                    </Text>
                  ) : null}
                  {item.returnDate ? (
                    <Text style={[styles.headerText, {textTransform: 'none'}]}>
                      Return Date : {item.returnDate}
                    </Text>
                  ) : null}
                  {item.title ? (
                    <Text style={[styles.headerText, {textTransform: 'none'}]}>
                      Title : {item.title}
                    </Text>
                  ) : null}
                  {item.status ? (
                    <Text style={[styles.headerText, {textTransform: 'none'}]}>
                      Status : {item.status}
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            </Animatable.View>
          );
        })
      ) : !this.state.Loader ? (
        <Animatable.View
          key={Math.random()}
          duration={400}
          style={[styles.header, {width: '100%', alignSelf: 'center'}]}
          transition="backgroundColor">
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              fontFamily: 'Poppins-Regular',
              paddingLeft: 10,
            }}>
            No data available
          </Text>
        </Animatable.View>
      ) : null;
    }
  };
  flatListAttendanceSemCamRender = ({item, index}) => {
    return (
      <View
        style={{
          borderRadius: 15,
          elevation: 3,
          shadowColor: LightPurpleColor,
          shadowOffset: {width: 1, height: 1},
          borderColor: LightPurpleColor,
          shadowOpacity: 0.5,
          width: '95%',
          alignSelf: 'center',
          minHeight: 120,
          marginBottom: 10,
          alignItems: 'center',
          flexDirection: 'row',
          backgroundColor: index % 2 == 0 ? 'white' : '#E9E6FE',
        }}>
        <View style={{width: '100%', justifyContent: 'center'}}>
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              paddingLeft: 15,
              paddingRight: 10,
            }}>
            <View style={{width: '60%', justifyContent: 'center'}}>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontFamily: 'Poppins-Regular',
                  color: PurpleColor,
                  fontWeight: '600',
                  fontSize: ResponsiveSize(config.AppAllHeaderSize),
                }}>
                {item.subjectName}
              </Text>
            </View>
            <View style={{width: '40%', justifyContent: 'center'}}>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontFamily: 'Poppins-Regular',
                  color: '#909090',
                  fontWeight: '600',
                  fontSize: ResponsiveSize(config.AppAllTextSize),
                }}>
                Attendance{' '}
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    color: 'green',
                  }}>
                  {item.percentageBasedOnHourlyAttendace}%
                </Text>
              </Text>
            </View>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: '32%',
                borderRightWidth: 1,
                borderColor: LightPurpleColor,
                padding: 10,
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontFamily: 'Poppins-Regular',
                  color: '#909090',
                  fontSize: ResponsiveSize(config.AppAllSubTitle),
                }}>
                Total
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontFamily: 'Poppins-Regular',
                  color: PurpleColor,
                  fontSize: ResponsiveSize(config.AppAllHeaderSize),
                  fontWeight: '600',
                }}>
                {item.actualTotalInAttendance}
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    fontFamily: 'Poppins-Regular',
                    fontSize: ResponsiveSize(8),
                  }}>
                  H
                </Text>
              </Text>
            </View>
            <View
              style={{
                width: '32%',
                borderRightWidth: 1,
                borderColor: LightPurpleColor,
                padding: 10,
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontFamily: 'Poppins-Regular',
                  color: '#909090',
                  fontSize: ResponsiveSize(config.AppAllSubTitle),
                }}>
                Present
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontFamily: 'Poppins-Regular',
                  color: PurpleColor,
                  fontSize: ResponsiveSize(config.AppAllHeaderSize),
                  fontWeight: '600',
                }}>
                {item.totalPresentHours}
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    fontFamily: 'Poppins-Regular',
                    fontSize: ResponsiveSize(8),
                  }}>
                  H
                </Text>
              </Text>
            </View>
            <View style={{width: '32%', padding: 10}}>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontFamily: 'Poppins-Regular',
                  color: '#909090',
                  fontSize: ResponsiveSize(config.AppAllSubTitle),
                }}>
                Absent
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontFamily: 'Poppins-Regular',
                  color: 'red',
                  fontSize: ResponsiveSize(config.AppAllHeaderSize),
                  fontWeight: '600',
                }}>
                {item.totalAbsentHours}
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    fontFamily: 'Poppins-Regular',
                    fontSize: ResponsiveSize(8),
                  }}>
                  H
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  AttendanceSemContent = () => {
    //alert(JSON.stringify(this.state.AttendanceSem))
    return (
      <View key={Math.random()}>
        <View
          style={{
            width: '95%',
            alignSelf: 'center',
            height: 120,
            marginTop: 10,
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <CustomFastImage
            resizeMode={'stretch'}
            style={{
              width: '100%',
              alignSelf: 'center',
              height: 120,
              position: 'absolute',
              marginBottom: 15,
            }}
            source={require('../assets/purpleAtt.png')}
          />

          <View style={{width: '70%', height: 100, justifyContent: 'center'}}>
            <View
              style={{
                width: '100%',
                alignSelf: 'center',
                justifyContent: 'flex-end',
                paddingLeft: 35,
              }}>
              <Text style={styles.MainTitle}>
                {this.state.AttendanceSem.semester}
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View style={{width: '10%', padding: 10}}></View>
              <View
                style={{
                  width: '30%',
                  borderRightWidth: 1,
                  borderColor: 'white',
                  padding: 10,
                }}>
                <Text style={styles.TitleText}>Total</Text>
                <Text style={styles.SubTitleText}>
                  {this.state.AttendanceSem.totalHours}
                  <Text
                    style={{
                      fontFamily: 'Poppins-Regular',
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
                  {this.state.AttendanceSem.presentHours}
                  <Text
                    style={{
                      fontFamily: 'Poppins-Regular',
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
                  {this.state.AttendanceSem.absentHours}
                  <Text
                    style={{
                      fontFamily: 'Poppins-Regular',
                      fontFamily: 'Poppins-Regular',
                      fontSize: ResponsiveSize(8),
                    }}>
                    H
                  </Text>
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              width: '30%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ProgressCircle
              percent={this.state.AttendanceSem.percentage}
              radius={35}
              borderWidth={4}
              color="white"
              shadowColor="gray"
              bgColor={'#7260E9'}>
              <View
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: 45,
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    fontSize: ResponsiveSize(config.AppAllTextSize),
                    color: 'green',
                    fontWeight: 'bold',
                  }}>
                  {this.state.AttendanceSem.percentage}%
                </Text>
              </View>
            </ProgressCircle>
          </View>
        </View>
        {/*"#C6BEFB" */}
        <View
          style={{
            width: '100%',
            height: '79%',
            paddingVertical: 20,
          }}>
          {this.state.SemWiseAttendance.length > 0 ? (
            this.state.SemWiseAttendance[0].subjects.length ? (
              //this.state.SemWiseAttendance[0].subjects.map((item, index) => {
              <CommonFlatlist
                refreshing={this.state.refreshing}
                //_onRefresh={this._onRefresh.bind(this)}
                _onRefresh={() => {
                  this._onRefresh(this.onLoadGetSemWiseAttendance());
                }}
                renderItem={this.flatListAttendanceSemCamRender}
                data={this.state.SemWiseAttendance[0].subjects}
                Loader={this.state.Loader}
              />
            ) : //})
            !this.state.Loader ? (
              <Animatable.View
                key={Math.random()}
                duration={400}
                style={[styles.header, {width: '100%', alignSelf: 'center'}]}
                transition="backgroundColor">
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    paddingLeft: 10,
                  }}>
                  Subjectwise TimeTable / Attendance not entered.
                </Text>
              </Animatable.View>
            ) : null
          ) : !this.state.Loader ? (
            <Animatable.View
              key={Math.random()}
              duration={400}
              style={[styles.header, {width: '100%', alignSelf: 'center'}]}
              transition="backgroundColor">
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  paddingLeft: 10,
                }}>
                No data available
              </Text>
            </Animatable.View>
          ) : null}
        </View>
      </View>
    );
  };
  render() {
    return (
      <View
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: config.bgColor,
        }}>
        <Loader
          Loading={this.state.Loader ? true : false}
          onPressCancel={() => {
            this.setState({Loader: false});
          }}
        />

        <SafeAreaView style={{flex: 1}}>
          <CustomHeader
            isHome={false}
            title={this.state.Title}
            navigation={this.props.navigation}
          />
          {/*<ScrollView contentContainerStyle={{paddingBottom: 10}}>*/}

          {this.state.Title == 'Attendance'
            ? this.state.subTitle == 'semester'
              ? this.AttendanceSemContent()
              : this.state.subTitle == 'Custom Dates'
              ? this.renderAttendanceHeader()
              : null
            : null}

          {this.state.Title == 'Internal Marks'
            ? this.state.TempData.map((item, index) => {
                return (
                  <View>
                    <Animatable.View
                      key={Math.random()}
                      duration={400}
                      style={[
                        styles.header,
                        {
                          width: '97%',
                          alignSelf: 'center',
                          backgroundColor:
                            this.state.TempDataTempIndex == index
                              ? '#EFEFEF'
                              : '#F5FCFF',
                        },
                      ]}
                      transition="backgroundColor">
                      <TouchableOpacity
                        activeOpacity={0.6}
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexDirection: 'row',
                          width: '100%',
                        }}
                        onPress={() => {
                          if (this.state.TempDataTempIndex == index) {
                            this.setState({TempDataTempIndex: -1});
                          } else {
                            this.setState({TempDataTempIndex: index});
                          }
                        }}>
                        <View
                          style={{
                            width: '90%',
                            paddingLeft: 10,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <Text style={[styles.TimeTableText]}>{item}</Text>
                        </View>
                        <View
                          style={{
                            width: '10%',
                            borderRadius: 10,
                            alignItems: 'flex-end',
                            justifyContent: 'space-between',
                            padding: 10,
                          }}>
                          {this.state.TempDataTempIndex == index ? (
                            <CustomFastImage
                              resizeMode={'contain'}
                              style={{
                                width: '60%',
                                height: 20,
                                borderRadius: 10,
                                marginTop: 20,
                              }}
                              source={require('../assets/upArrow.png')}
                            />
                          ) : (
                            <CustomFastImage
                              resizeMode={'contain'}
                              style={{
                                width: '60%',
                                height: 20,
                                borderRadius: 10,
                                marginTop: 20,
                              }}
                              source={require('../assets/downArrow.png')}
                            />
                          )}
                        </View>
                      </TouchableOpacity>
                    </Animatable.View>
                    {item == 'Exam Wise' &&
                    this.state.TempDataTempIndex == index
                      ? this.renderInternalMarksHeader()
                      : null}
                    {item == 'Subject Wise' &&
                    this.state.TempDataTempIndex == index
                      ? this.renderInternalPerformanceSubHeader()
                      : null}
                  </View>
                );
              })
            : null}

          {this.state.Title == 'University Marks'
            ? this.renderUniversityMarksHeader()
            : null}
          {this.state.Title == 'Performance'
            ? this.renderPerformanceHeader()
            : null}
          {this.state.Title == 'Library' ? this.renderLibraryHeader() : null}

          {/*</ScrollView>*/}
        </SafeAreaView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  ProfileSubHeaderStyle: {
    fontFamily: 'Poppins-Regular',
    color: 'gray',
    marginBottom: 5,
  },
  ProfileSubHeaderAns: {
    fontFamily: 'Poppins-Regular',
    color: BlueColor,
    fontSize: ResponsiveSize(config.AppAllHeaderSize),
  },
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
  content2: {
    padding: 20,
    marginLeft: 10,
    backgroundColor: '#fff',
  },
  active: {
    backgroundColor: 'rgba(255,255,255,1)',
  },
  inactive: {
    backgroundColor: 'rgba(245,252,255,1)',
  },
  TimeTableText: {
    //alignSelf: "center",
    fontWeight: '600',
    fontSize: ResponsiveSize(config.AppAllHeaderSize),
    fontFamily: 'Poppins-Regular',
    textTransform: 'uppercase',
  },
  text: {
    textAlign: 'center',
    color: 'white',
    fontSize: ResponsiveSize(config.buttonSize),
    fontFamily: 'Poppins-Regular',
  },

  SubjectMainContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20,
  },
  SubjectNameImageView: {
    width: '95%',
    alignSelf: 'center',
    height: 60,
    resizeMode: 'stretch',
    position: 'relative',
    borderRadius: 15,
    marginVertical: 10,
  },
  SubjectNameTextView: {
    height: 60,
    width: '90%',
    justifyContent: 'center',
    position: 'absolute',
    marginVertical: 10,
    alignItems: 'center',
  },
  AttendanceCustomDateTextView: {
    height: 60,
    width: '90%',
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
  SubjectNameTextStyle: {
    color: 'white',
    fontWeight: '500',
    fontSize: ResponsiveSize(config.AppAllHeaderSize),
    paddingHorizontal: 10,
    textTransform: 'uppercase',
    fontFamily: 'Poppins-Regular',
  },
  StaffDetailTextStyle: {
    color: 'black',
    lineHeight: 20,
    fontFamily: 'Poppins-Regular',
  },
  SubjectNameContainer: {
    alignSelf: 'center',
    width: '95%',
    borderRadius: 15,
    paddingBottom: 10,
  },
  Heading: {
    color: '#008B9B',
    fontFamily: 'Poppins-Regular',
  },
  AttendanceStatusView: {
    width: ResponsiveSize(25),
    height: ResponsiveSize(25),
    borderRadius: ResponsiveSize(8),
    margin: ResponsiveSize(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  ProfileDataView: {
    //padding: 10,
    //paddingHorizontal: 20,
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0.3,
    borderColor: 'silver',
    minHeight: 70,
  },
  ProfileHeaderStyle: {
    color: 'black',
    lineHeight: 25,
    fontSize: ResponsiveSize(config.AppAllTextSize),
    fontFamily: 'Poppins-Regular',
  },
  ProfileContentStyle: {
    color: '#24B1EE',
    fontSize: ResponsiveSize(config.AppAllHeaderSize),
    lineHeight: 25,
    fontFamily: 'Poppins-Regular',
  },
  TitleText: {
    fontFamily: 'Poppins-Regular',
    color: 'white',
    fontSize: ResponsiveSize(config.AppAllSubTitle),
  },
  SubTitleText: {
    fontFamily: 'Poppins-Regular',
    color: 'white',
    fontSize: ResponsiveSize(config.AppAllHeaderSize),
    fontWeight: '600',
  },
  MainTitle: {
    fontFamily: 'Poppins-Regular',
    color: 'white',
    fontWeight: '600',
    textTransform: 'uppercase',
    fontSize: ResponsiveSize(config.buttonSize),
  },
});
