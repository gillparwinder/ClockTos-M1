import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Toast from 'react-native-tiny-toast';
import ResponsiveSize from '../config/ResponsiveSize';
import config from '../config/config';
import {SafeAreaView} from 'react-native';
import {Loader} from './Loader';
import {View} from 'react-native';
import CustomFastImage from './common/CustomFastImage';
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};
const MenuThemeColor = '#008B9B';
export default class DrawerScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {Loader: true};
    //this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
    this.retrieveData();
  }
  componentDidMount() {
    this.retrieveData();
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.setState({Loader: false}, () => {
        this.retrieveData();
      });
      //console.log('I ran');
    });
  }
  componentWillUnmount() {
    this.props.navigation.removeListener(this._unsubscribe);
  }
  //forceUpdateHandler() {
  //  this.retrieveData();
  //}
  storeData = async (key, value) => {
    //console.log('key = ', key, 'value = ', value);
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      // Error saving data
      //console.log(error);
      //alert('store data catched');
    }
  };
  ClearAsync = async () => {
    await AsyncStorage.clear();
    this.storeData('mobile', this.state.mobile || '');
    this.storeData('repeat', '1');
    this.props.navigation.replace('MainStack');
  };
  retrieveData = async (key) => {
    try {
      const value = await AsyncStorage.getItem('isStudent');
      this.setState({Loader: false});
      console.log('iStudent drawer = ', value);
      if (value !== null) {
        this.setState({isStudent: value, Loader: false});
      }
    } catch (error) {
      alert('Error retrieving data');
    }
    try {
      const value = await AsyncStorage.getItem('version');
      if (value !== null) {
        this.setState({version: value});
      }
    } catch (error) {
      alert('Error retrieving data');
    }
    try {
      const value = await AsyncStorage.getItem('mobile');
      if (value !== null) {
        this.setState({mobile: value, Loader: false});
      }
    } catch (error) {
      alert('Error retrieving data');
    }
    try {
      const value = await AsyncStorage.getItem('course');
      if (value !== null) {
        // alert (value);
        this.setState({Course: value});
      }
    } catch (error) {
      alert('Error retrieving data');
    }

    try {
      const value = await AsyncStorage.getItem('name');
      if (value !== null) {
        // alert (value);
        this.setState({Name: value});
      }
    } catch (error) {
      alert('Error retrieving data');
    }
    try {
      const value = await AsyncStorage.getItem('desigName');
      if (value !== null) {
        // alert (value);
        this.setState({desigName: value});
      }
    } catch (error) {
      alert('Error retrieving data');
    }
    try {
      const value = await AsyncStorage.getItem('image');
      if (value !== null) {
        // alert (value);
        this.setState({ProfileImage: value});
      }
    } catch (error) {
      alert('Error retrieving data');
    }
    try {
      const value = await AsyncStorage.getItem('collegeImage');
      if (value !== null) {
        // alert (value);
        this.setState({collegeImage: value});
      }
    } catch (error) {
      alert('Error retrieving data');
    }
  };
  render() {
    return this.state.isStudent == 'true' || this.state.isStudent == true ? (
      <SafeAreaView
        style={{width: '100%', height: '100%', backgroundColor: 'white'}}>
        <CustomFastImage
          style={{
            height: '110%',
            width: '100%',
            alignSelf: 'center',
            position: 'absolute',
          }}
          source={require('../assets/menuBg.png')}
          resizeMode={'stretch'}
        />
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              fontSize: ResponsiveSize(config.AppAllHeaderSize),
              fontWeight: '600',
              color: MenuThemeColor,
            }}>
            {this.state.version}
          </Text>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.closeDrawer();
            }}
            style={{justifyContent: 'center', alignItems: 'center'}}>
            <CustomFastImage
              style={{width: 30, height: 30}}
              source={require('../assets/crossWhite.png')}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        </View>

        <View style={{minHeight: '20%', width: '90%', alignSelf: 'center'}}>
          <View
            style={{
              width: '68%',
              height: 20,
              alignItems: 'flex-end',
              position: 'absolute',
              zIndex: 2,
            }}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('Profile', {
                  title: 'Student Profile',
                });
              }}
              style={{
                width: '15%',
                justifyContent: 'center',
                alignItems: 'center',
                //position: 'absolute',
                zIndex: 2,
              }}>
              <CustomFastImage
                style={{width: 25, height: 25}}
                source={require('../assets/edit.png')}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              alignSelf: 'center',
              width: 100,
              height: 100,
              borderRadius: 55,
              backgroundColor: '#2E3675',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('Profile', {
                  title: 'Student Profile',
                });
              }}
              style={{
                width: 96,
                height: 96,
                borderRadius: 55,
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <CustomFastImage
                style={{
                  width: '100%',
                  height: '100%',
                  alignSelf: 'center',
                  borderRadius: 100,
                  padding: 10,
                }}
                source={
                  this.state.ProfileImage
                    ? {
                        uri: `data:image/jpeg;base64,${this.state.ProfileImage}`,
                      }
                    : require('../assets/appLogo.png')
                }
                //source={
                //  `data:image/jpeg;base64,${this.state.ProfileImage}` ||
                //  require('../assets/noImg.png')
                //}
                resizeMode={'stretch'}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              alignSelf: 'center',
              height: 100,
              justifyContent: 'center',
              margin: 10,
            }}>
            <Text
              numberOfLines={2}
              style={{
                fontFamily: 'Poppins-Regular',
                marginBottom: 5,
                fontSize: ResponsiveSize(15),
                color: MenuThemeColor,
                fontWeight: '600',
                textAlign: 'center',
              }}>
              {this.state.Name}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: 'Poppins-Regular',
                fontWeight: '400',
                fontSize: ResponsiveSize(13),
                textAlign: 'center',
              }}>
              {this.state.Course} Student
            </Text>
          </View>
        </View>

        <ScrollView style={{flex: 1, marginLeft: 5, marginTop: 20}}>
          {/*<View style={Styles.RowStyle}>
            <TouchableOpacity
              style={Styles.button}
              onPress={() => {
                this.props.navigation.navigate('Test');
              }}>
              <View style={Styles.InnerView}>
                <CustomFastImage
                  resizeMode={'contain'}
                  style={Styles.IconStyle}
                  source={require('../assets/home2.png')}
                />
                <Text style={Styles.text}>Test</Text>
              </View>
            </TouchableOpacity>
          </View>*/}
          <View style={Styles.RowStyle}>
            <TouchableOpacity
              style={Styles.button}
              onPress={() => {
                //this.props.navigation.navigate('MainStack');
                this.props.navigation.closeDrawer();
              }}>
              <View style={Styles.InnerView}>
                <CustomFastImage
                  resizeMode={'contain'}
                  style={Styles.IconStyle}
                  source={require('../assets/home2.png')}
                />
                <Text style={Styles.text}>Home</Text>
                {/*<CustomFastImage
                                    resizeMode={'contain'}  style={Styles.IconStyle2} source={require('../assets/menuDown.png')} />*/}
              </View>
            </TouchableOpacity>
          </View>

          <View style={[Styles.RowStyle, {backgroundColor: 'transparent'}]}>
            <TouchableOpacity
              style={Styles.button}
              onPress={() => {
                this.props.navigation.navigate('SubjectList', {
                  title: 'Subjects',
                });
              }}>
              <View style={Styles.InnerView}>
                <CustomFastImage
                  resizeMode={'contain'}
                  style={Styles.IconStyle}
                  source={require('../assets/subjects.png')}
                />
                <Text style={Styles.text}>Subjects</Text>
              </View>
            </TouchableOpacity>
          </View>
          {/*<View style={[Styles.RowStyle, {backgroundColor: 'transparent'}]}>
            <TouchableOpacity
              style={Styles.button}
              onPress={() => {
                this.props.navigation.navigate('PayOnlineStack', {
                  title: 'Pay Online',
                });
                //this.props.navigation.navigate("DetailScreenMenu", { title: "Library" })
              }}>
              <View style={Styles.InnerView}>
                <CustomFastImage
                  resizeMode={'contain'}
                  style={Styles.IconStyle}
                  source={require('../assets/feedback.png')}
                />
                <Text style={Styles.text}>Pay Online</Text>
              </View>
            </TouchableOpacity>
          </View>*/}

          <View
            style={[
              Styles.RowStyle,
              {
                backgroundColor: this.state.TimeTableView
                  ? '#D1FAFF'
                  : 'transparent',
              },
            ]}>
            <TouchableOpacity
              style={Styles.button}
              onPress={() => {
                this.setState({TimeTableView: !this.state.TimeTableView});
                //this.props.navigation.navigate("DetailScreenMenu", { title: "Time Table" })
              }}>
              <View style={Styles.InnerView}>
                <CustomFastImage
                  resizeMode={'contain'}
                  style={Styles.IconStyle}
                  source={require('../assets/timeTable.png')}
                />
                <Text style={Styles.text}>Time Table</Text>
                {this.state.TimeTableView ? (
                  <CustomFastImage
                    resizeMode={'contain'}
                    style={Styles.IconStyle2}
                    source={require('../assets/menuUp.png')}
                  />
                ) : (
                  <CustomFastImage
                    resizeMode={'contain'}
                    style={Styles.IconStyle2}
                    source={require('../assets/menuDown.png')}
                  />
                )}
              </View>
            </TouchableOpacity>
            {this.state.TimeTableView ? (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('TimeTableToday', {
                      TimeTable: {day: 'Today'},
                      title: 'Time Table',
                      colorCode: '#23C4D7',
                      colorPic: require('../assets/greenBg.png'),
                    });
                    //this.props.navigation.navigate('DetailScreenMenu', {
                    //  TimeTable: {day: 'Today'},
                    //  title: 'Time Table',
                    //});
                  }}
                  style={Styles.ExpandedTitleStyle}>
                  <Text style={Styles.text2}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('TimeTableWeekly', {
                      TimeTable: {day: 'Weekly'},
                      title: 'Time Table',

                      colorCode: '#8F98FF',
                      colorPic: require('../assets/blueBg.png'),
                    });
                  }}
                  style={Styles.ExpandedTitleStyle}>
                  <Text style={Styles.text2}>Weekly</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('TimeTableCam', {
                      TimeTable: {day: 'CAM'},
                      title: 'Time Table',

                      colorCode: '#7260E9',
                      colorPic: require('../assets/purpleBg.png'),
                    });
                  }}
                  style={Styles.ExpandedTitleStyle}>
                  <Text style={Styles.text2}>CAM</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('TimeTableUniversity', {
                      TimeTable: {day: 'University'},
                      title: 'Time Table',
                      colorCode: '#23C4D7',
                      colorPic: require('../assets/greenBg.png'),
                    });
                  }}
                  style={Styles.ExpandedTitleStyle}>
                  <Text style={Styles.text2}>Semester</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
          <View
            style={[
              Styles.RowStyle,
              {
                backgroundColor: this.state.AttendanceView
                  ? '#D1FAFF'
                  : 'transparent',
              },
            ]}>
            <TouchableOpacity
              style={Styles.button}
              onPress={() => {
                this.setState({AttendanceView: !this.state.AttendanceView});
                //this.props.navigation.navigate("DetailScreenMenu", { title: "Attendance" })
              }}>
              <View style={Styles.InnerView}>
                <CustomFastImage
                  resizeMode={'contain'}
                  style={Styles.IconStyle}
                  source={require('../assets/attendance.png')}
                />
                <Text style={Styles.text}>Attendance</Text>
                {this.state.AttendanceView ? (
                  <CustomFastImage
                    resizeMode={'contain'}
                    style={Styles.IconStyle2}
                    source={require('../assets/menuUp.png')}
                  />
                ) : (
                  <CustomFastImage
                    resizeMode={'contain'}
                    style={Styles.IconStyle2}
                    source={require('../assets/menuDown.png')}
                  />
                )}
              </View>
            </TouchableOpacity>
            {this.state.AttendanceView ? (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('DetailScreenMenu', {
                      title: 'Attendance',
                      subTitle: 'Custom Dates',
                    });
                    //this.props.navigation.navigate("Attendance", { title: "Attendance" })
                  }}
                  style={Styles.ExpandedTitleStyle}>
                  <Text style={Styles.text2}>Custom Dates</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    //this.props.navigation.navigate("DetailScreenMenu", { TimeTable: { day: "Weekly" }, title: "Time Table" })
                  }}
                  style={Styles.ExpandedTitleStyle}></TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('AttendanceSemWise', {
                      title: 'Attendance',
                      subTitle: 'Semester',
                    });
                    //this.props.navigation.navigate("DetailScreenMenu", { TimeTable: { day: "University" }, title: "Time Table" })
                  }}
                  style={Styles.ExpandedTitleStyle}>
                  <Text style={Styles.text2}>Semester</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
          <View
            style={[
              Styles.RowStyle,
              {
                backgroundColor: this.state.ResultView
                  ? '#D1FAFF'
                  : 'transparent',
              },
            ]}>
            <TouchableOpacity
              style={Styles.button}
              onPress={() => {
                this.setState({ResultView: !this.state.ResultView});
                //this.props.navigation.navigate("DetailScreenMenu", { title: "Internal Marks" })
              }}>
              <View style={Styles.InnerView}>
                <CustomFastImage
                  resizeMode={'contain'}
                  style={Styles.IconStyle}
                  source={require('../assets/result2.png')}
                />
                <Text style={Styles.text}>Result</Text>
                {this.state.ResultView ? (
                  <CustomFastImage
                    resizeMode={'contain'}
                    style={Styles.IconStyle2}
                    source={require('../assets/menuUp.png')}
                  />
                ) : (
                  <CustomFastImage
                    resizeMode={'contain'}
                    style={Styles.IconStyle2}
                    source={require('../assets/menuDown.png')}
                  />
                )}
              </View>
            </TouchableOpacity>
            {this.state.ResultView ? (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('ResultCam', {
                      title: 'Result',
                      subTitle: 'CAM',
                    });
                  }}
                  style={Styles.ExpandedTitleStyle}>
                  <Text style={Styles.text2}>CAM</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('ResultCam', {
                      title: 'Result',
                      subTitle: 'Semester',
                    });
                  }}
                  style={Styles.ExpandedTitleStyle}>
                  <Text style={Styles.text2}>Semester</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>

          <View style={[Styles.RowStyle, {backgroundColor: 'transparent'}]}>
            <TouchableOpacity
              style={Styles.button}
              onPress={() => {
                this.props.navigation.navigate('Library', {title: 'Library'});
                //this.props.navigation.navigate("DetailScreenMenu", { title: "Library" })
              }}>
              <View style={Styles.InnerView}>
                <CustomFastImage
                  resizeMode={'contain'}
                  style={Styles.IconStyle}
                  source={require('../assets/libraryIcon.png')}
                />
                <Text style={Styles.text}>Library</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={[Styles.RowStyle, {backgroundColor: 'transparent'}]}>
            <TouchableOpacity
              style={Styles.button}
              onPress={() => {
                this.props.navigation.navigate('SubjectList', {
                  title: 'Feedback',
                });
                //this.props.navigation.navigate("DetailScreenMenu", { title: "Library" })
              }}>
              <View style={Styles.InnerView}>
                <CustomFastImage
                  resizeMode={'contain'}
                  style={Styles.IconStyle}
                  source={require('../assets/feedback.png')}
                />
                <Text style={Styles.text}>Feedback</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <TouchableOpacity
          style={[Styles.loginButton, {backgroundColor: 'transparent'}]}
          onPress={() => {
            this.ClearAsync();
          }}>
          <Text style={[Styles.text, {color: 'red', fontWeight: 'bold'}]}>
            LOGOUT
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    ) : this.state.Loader ? (
      <Loader
        Loading={this.state.Loader ? true : false}
        onPressCancel={() => {
          this.setState({Loader: false});
        }}
      />
    ) : (
      //<View
      //  style={{
      //    width: '100%',
      //    height: '100%',
      //    alignItems: 'center',
      //    justifyContent: 'center',
      //    backgroundColor: 'white',
      //  }}>
      //  <ActivityIndicator color={config.themeColor} size="large" />
      //  <Text style={{marginTop: 10}}>Fetching Content...</Text>
      //</View>
      <SafeAreaView
        style={{width: '100%', height: '100%', backgroundColor: 'white'}}>
        <CustomFastImage
          style={{
            height: '110%',
            width: '100%',
            alignSelf: 'center',
            position: 'absolute',
          }}
          source={require('../assets/menuBg.png')}
          resizeMode={'stretch'}
        />
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              fontSize: ResponsiveSize(config.AppAllHeaderSize),
              fontWeight: '600',
              color: MenuThemeColor,
            }}>
            {this.state.version}
          </Text>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.closeDrawer();
            }}
            style={{justifyContent: 'center', alignItems: 'center'}}>
            <CustomFastImage
              style={{width: 30, height: 30}}
              source={require('../assets/crossWhite.png')}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        </View>
        <View style={{minHeight: '20%', width: '90%', alignSelf: 'center'}}>
          <View
            style={{
              width: '68%',
              height: 20,
              alignItems: 'flex-end',
              position: 'absolute',
              zIndex: 2,
            }}>
            {/*<TouchableOpacity
              //onPress={() => {
              //  this.props.navigation.navigate('Profile', {
              //    title: 'Student Profile',
              //  });
              //}}
              style={{
                width: '15%',
                justifyContent: 'center',
                alignItems: 'center',
                //position: 'absolute',
                zIndex: 2,
              }}>
              <CustomFastImage
                style={{width: 25, height: 25}}
                source={require('../assets/edit.png')}
                resizeMode={'contain'}
              />
            </TouchableOpacity>*/}
          </View>
          <View
            style={{
              alignSelf: 'center',
              width: 100,
              height: 100,
              borderRadius: 55,
              backgroundColor: '#2E3675',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              //onPress={() => {
              //  this.props.navigation.navigate('Profile', {
              //    title: 'Student Profile',
              //  });
              //}}
              style={{
                width: 96,
                height: 96,
                borderRadius: 55,
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <CustomFastImage
                style={{
                  width: '100%',
                  height: '100%',
                  alignSelf: 'center',
                  borderRadius: 100,
                  padding: 10,
                }}
                //source={`data:image/jpeg;base64,${this.state.collegeImage}`}
                source={
                  this.state.ProfileImage
                    ? {
                        uri: `data:image/jpeg;base64,${this.state.ProfileImage}`,
                      }
                    : require('../assets/appLogo.png')
                }
                //source={
                //  `data:image/jpeg;base64,${this.state.ProfileImage}` ||
                //  require('../assets/noImg.png')
                //}
                resizeMode={'stretch'}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              alignSelf: 'center',
              height: 100,
              justifyContent: 'center',
              margin: 10,
            }}>
            <Text
              numberOfLines={2}
              style={{
                fontFamily: 'Poppins-Regular',
                marginBottom: 5,
                fontSize: ResponsiveSize(15),
                color: MenuThemeColor,
                fontWeight: '600',
                textAlign: 'center',
              }}>
              {this.state.Name}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: 'Poppins-Regular',
                fontWeight: '400',
                fontSize: ResponsiveSize(13),
                textAlign: 'center',
              }}>
              {this.state.desigName}
            </Text>
          </View>
        </View>

        <ScrollView style={{flex: 1, marginLeft: 5, marginTop: 20}}>
          {/*<View style={[Styles.RowStyle, {backgroundColor: 'transparent'}]}>
            <TouchableOpacity
              style={Styles.button}
              onPress={() => {
                //this.props.navigation.navigate('MainStack');
                this.props.navigation.closeDrawer();
                //this.props.navigation.navigate("DetailScreenMenu", { title: "Library" })
              }}>
              <View style={Styles.InnerView}>
                <CustomFastImage
                  resizeMode={'contain'}
                  style={Styles.IconStyle}
                  source={require('../assets/book.png')}
                />
                <Text style={Styles.text}>Dashboard</Text>
              </View>
            </TouchableOpacity>
          </View>*/}
          <View style={[Styles.RowStyle, {backgroundColor: 'transparent'}]}>
            <TouchableOpacity
              style={Styles.button}
              onPress={() => {
                this.props.navigation.navigate('StaffSideAttendance', {
                  title: 'StaffSideAttendance',
                });
                //this.props.navigation.navigate("DetailScreenMenu", { title: "Library" })
              }}>
              <View style={Styles.InnerView}>
                <CustomFastImage
                  resizeMode={'contain'}
                  style={Styles.IconStyle}
                  source={require('../assets/book.png')}
                />
                <Text style={Styles.text}>Attendance</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={[Styles.RowStyle, {backgroundColor: 'transparent'}]}>
            <TouchableOpacity
              style={Styles.button}
              onPress={() => {
                this.props.navigation.navigate('StaffInternalMark', {
                  title: 'StaffInternalMark',
                });
                //this.props.navigation.navigate("DetailScreenMenu", { title: "Library" })
              }}>
              <View style={Styles.InnerView}>
                <CustomFastImage
                  resizeMode={'contain'}
                  style={Styles.IconStyle}
                  source={require('../assets/book.png')}
                />
                <Text style={Styles.text}>Internal Mark</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={[Styles.RowStyle, {backgroundColor: 'transparent'}]}>
            <TouchableOpacity
              style={Styles.button}
              onPress={() => {
                this.props.navigation.navigate('PerformanceStack', {
                  title: 'My Performance',
                });
                //this.props.navigation.navigate("DetailScreenMenu", { title: "Library" })
              }}>
              <View style={Styles.InnerView}>
                <CustomFastImage
                  resizeMode={'contain'}
                  style={Styles.IconStyle}
                  source={require('../assets/feedback.png')}
                />
                <Text style={Styles.text}>Performance</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={[
              Styles.RowStyle,
              {
                backgroundColor: this.state.FaceRegisterView
                  ? '#D1FAFF'
                  : 'transparent',
              },
            ]}>
            <TouchableOpacity
              style={Styles.button}
              onPress={() => {
                this.setState({FaceRegisterView: !this.state.FaceRegisterView});
                //this.props.navigation.navigate("DetailScreenMenu", { title: "Internal Marks" })
              }}>
              <View style={Styles.InnerView}>
                <CustomFastImage
                  resizeMode={'contain'}
                  style={Styles.IconStyle}
                  source={require('../assets/person.png')}
                />
                <Text style={Styles.text}>Face Register</Text>
                {this.state.FaceRegisterView ? (
                  <CustomFastImage
                    resizeMode={'contain'}
                    style={Styles.IconStyle2}
                    source={require('../assets/menuUp.png')}
                  />
                ) : (
                  <CustomFastImage
                    resizeMode={'contain'}
                    style={Styles.IconStyle2}
                    source={require('../assets/menuDown.png')}
                  />
                )}
              </View>
            </TouchableOpacity>
            {this.state.FaceRegisterView ? (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('FaceRegister', {
                      title: 'Face Register',
                      subTitle: 'Face',
                    });
                  }}
                  style={Styles.ExpandedTitleStyle}>
                  <Text style={Styles.text2}>Student Face Register</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('StudentFace', {
                      title: 'Face Register',
                      subTitle: 'Face',
                    });
                  }}
                  style={Styles.ExpandedTitleStyle}>
                  <Text style={Styles.text2}>Staff Face Register</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>

          <View
            style={[
              Styles.RowStyle,
              {
                backgroundColor: this.state.BlockBoxView
                  ? '#D1FAFF'
                  : 'transparent',
              },
            ]}>
            <TouchableOpacity
              style={Styles.button}
              onPress={() => {
                this.setState({BlockBoxView: !this.state.BlockBoxView});
                //this.props.navigation.navigate("DetailScreenMenu", { title: "Internal Marks" })
              }}>
              <View style={Styles.InnerView}>
                <CustomFastImage
                  resizeMode={'contain'}
                  style={Styles.IconStyle}
                  source={require('../assets/person.png')}
                />
                <Text style={Styles.text}>BlackBox</Text>
                {this.state.BlockBoxView ? (
                  <CustomFastImage
                    resizeMode={'contain'}
                    style={Styles.IconStyle2}
                    source={require('../assets/menuUp.png')}
                  />
                ) : (
                  <CustomFastImage
                    resizeMode={'contain'}
                    style={Styles.IconStyle2}
                    source={require('../assets/menuDown.png')}
                  />
                )}
              </View>
            </TouchableOpacity>
            {this.state.BlockBoxView ? (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('BlockBoxSelf', {
                      title: 'Self',
                      subTitle: 'Self',
                    });
                  }}
                  style={Styles.ExpandedTitleStyle}>
                  <Text style={Styles.text2}>Self</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('BlockBoxOther', {
                      title: 'HOD',
                      subTitle: 'Other',
                    });
                  }}
                  style={Styles.ExpandedTitleStyle}>
                  <Text style={Styles.text2}>HOD</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>

          <View style={[Styles.RowStyle, {backgroundColor: 'transparent'}]}>
            <TouchableOpacity
              style={Styles.button}
              onPress={() => {
                this.props.navigation.navigate('Circular');
                //this.props.navigation.navigate("DetailScreenMenu", { title: "Library" })
              }}>
              <View style={Styles.InnerView}>
                <CustomFastImage
                  resizeMode={'contain'}
                  style={Styles.IconStyle}
                  source={require('../assets/book.png')}
                />
                <Text style={Styles.text}>Circular</Text>
              </View>
            </TouchableOpacity>
          </View>
          {/*<View style={[Styles.RowStyle, {backgroundColor: 'transparent'}]}>
            <TouchableOpacity
              style={Styles.button}
              onPress={() => {
                this.props.navigation.navigate('OnlineClasses');
                //this.props.navigation.navigate("DetailScreenMenu", { title: "Library" })
              }}>
              <View style={Styles.InnerView}>
                <CustomFastImage
                                    resizeMode={'contain'}
                  
                  style={Styles.IconStyle}
                  source={require('../assets/book.png')}/>
                <Text style={Styles.text}>Online Classes</Text>
              </View>
            </TouchableOpacity>
          </View>*/}
        </ScrollView>
        <TouchableOpacity
          style={[Styles.loginButton, {backgroundColor: 'transparent'}]}
          onPress={() => {
            this.ClearAsync();
          }}>
          <Text style={[Styles.text, {color: 'red', fontWeight: 'bold'}]}>
            LOGOUT
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
const Styles = StyleSheet.create({
  button: {
    width: '90%',
    alignSelf: 'center',
    minHeight: 50,

    //backgroundColor: '#EFEFEF',
    flexDirection: 'row',
  },
  text: {
    fontWeight: '500',
    textAlign: 'left',
    marginLeft: 20,
    flex: 1,
    fontFamily: 'Poppins-Regular',
    color: MenuThemeColor,
    fontSize: ResponsiveSize(config.AppAllHeaderSize),
  },
  text2: {
    fontWeight: '500',
    lineHeight: 30,
    flex: 1,
    fontFamily: 'Poppins-Regular',
    color: MenuThemeColor,
    fontSize: ResponsiveSize(config.AppAllTextSize),
  },
  InnerView: {
    alignItems: 'center',
    flexDirection: 'row',
    //justifyContent: "space-between",
    width: '95%',
    height: '100%',
    alignSelf: 'center',
  },
  IconStyle: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  IconStyle2: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
  RowStyle: {
    paddingBottom: 10,
    borderRadius: 10,
    marginBottom: 5,
    //borderBottomWidth: .5,
    //borderColor: MenuThemeColor,
    width: '90%',
    alignSelf: 'center',
  },
  ExpandedTitleStyle: {
    width: '95%',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    paddingLeft: 40,
  },
  loginButton: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    alignSelf: 'center',
    marginVertical: 5,
  },
  //text: {
  //  textAlign: "center",
  //  color: "white",
  //  fontSize: ResponsiveSize(config.buttonSize),
  //  fontFamily: "Poppins-Regular",
  //},
});
