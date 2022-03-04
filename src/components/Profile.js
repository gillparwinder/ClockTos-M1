import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component, Fragment} from 'react';
import {StyleSheet, ScrollView, BackHandler, SafeAreaView} from 'react-native';
import {View, Text, TouchableOpacity} from 'react-native';
import {Loader} from './Loader';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-tiny-toast';
import ResponsiveSize from '../config/ResponsiveSize';
import config from '../config/config';
import {Dimensions} from 'react-native';
import CustomFastImage from './common/CustomFastImage';
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};
const screenWidth = Dimensions.get('window').width;
const BlueColor = '#6397F2';
export function CommomView(props) {
  return (
    <View style={styles.ProfileDataView}>
      <Text style={styles.ProfileHeaderStyle}>{props.title}</Text>
      <Text style={styles.ProfileContentStyle}>{props.value}</Text>
    </View>
  );
}
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Loader: true,
      ProfileData: {},
      ScrollPosition: 0,
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
  retrieveData = async (key) => {
    try {
      const value = await AsyncStorage.getItem('token');
      //console.log('token = ', value);
      if (value !== null) {
        this.setState({Token: value}, function () {
          this.onLoadGetProfile();
        });
      }
    } catch (error) {
      alert('Error retrieving data');
    }
  };
  onLoadGetProfile = () => {
    const url = config.baseUrl + 'student/Profile';
    console.log(url);
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
        console.log(responseJson);
        if (responseJson) {
          this.setState(
            {Loader: false, ProfileData: responseJson},
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
          console.log('error = ', error);
        });
      });
  };

  render() {
    return (
      <Fragment>
        <SafeAreaView style={{flex: 0, backgroundColor: '#24B1EE'}} />
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: config.bgColor,
          }}>
          <Loader
            Loading={this.state.Loader ? true : false}
            onPressCancel={() => {
              this.setState({Loader: false});
            }}
          />
          <View
            style={{
              justifyContent: 'space-between',
              height: 45,
              paddingHorizontal: 10,
              flexDirection: 'row',
              alignItems: 'center',
              zIndex: 3,
              backgroundColor: '#24B1EE',
              width: screenWidth,
            }}>
            <TouchableOpacity
              style={{
                width: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                this.props.navigation.goBack();
              }}>
              <CustomFastImage
                resizeMode={'contain'}
                style={{width: 22, height: 22, resizeMode: 'contain'}}
                source={require('../assets/back3.png')}
              />
            </TouchableOpacity>
            {this.state.ScrollPosition > 150 ? (
              <View
                style={{
                  width: '60%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: 'Poppins-Regular',
                    fontSize: ResponsiveSize(config.AppAllHeaderSize),
                    color: 'white',
                    fontWeight: '600',
                    textAlign: 'center',
                  }}>
                  {this.state.ProfileData.name}
                </Text>
              </View>
            ) : null}
            {this.state.ScrollPosition > 150 ? (
              <View
                style={{
                  width: '20%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: ResponsiveSize(35),
                    height: ResponsiveSize(35),
                    borderRadius: ResponsiveSize(35),
                    backgroundColor: 'white',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <CustomFastImage
                    resizeMode={'cover'}
                    style={{
                      width: ResponsiveSize(30),
                      height: ResponsiveSize(30),
                      alignSelf: 'center',
                      borderRadius: ResponsiveSize(30),
                    }}
                    source={
                      this.state.ProfileData.studentImage
                        ? {
                            uri: `data:image/jpeg;base64,${this.state.ProfileData.studentImage}`,
                          }
                        : require('../assets/appLogo.png')
                    }
                  />
                </View>
              </View>
            ) : null}
          </View>
          <ScrollView
            scrollEventThrottle={16}
            onScroll={(event) => {
              this.setState({
                ScrollPosition: event.nativeEvent.contentOffset.y,
              });
            }}>
            {this.state.ProfileData ? (
              <View
                style={{
                  width: '100%',
                  flex: 1,
                  paddingTop: 10,
                  marginBottom: 20,
                }}>
                <CustomFastImage
                  resizeMode={'stretch'}
                  style={{
                    width: '100%',
                    height: ResponsiveSize(200),
                    position: 'absolute',
                  }}
                  source={require('../assets/profileBg.png')}
                />

                <View style={{width: '90%', alignSelf: 'center'}}>
                  <View
                    style={[
                      styles.imageBorderContainer,
                      {
                        alignSelf: 'center',
                        width: ResponsiveSize(95),
                        height: ResponsiveSize(95),
                        borderRadius: ResponsiveSize(95),
                      },
                    ]}>
                    <View style={styles.imageBorderContainer}>
                      <CustomFastImage
                        resizeMode={'cover'}
                        style={[
                          styles.imageBorderContainer,
                          {
                            width: ResponsiveSize(88),
                            height: ResponsiveSize(88),
                            alignSelf: 'center',
                            borderRadius: ResponsiveSize(85),
                          },
                        ]}
                        source={
                          this.state.ProfileData.studentImage
                            ? {
                                uri: `data:image/jpeg;base64,${this.state.ProfileData.studentImage}`,
                              }
                            : require('../assets/appLogo.png')
                        }
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      alignSelf: 'center',
                      height: ResponsiveSize(100),
                      padding: 15,
                    }}>
                    <Text numberOfLines={2} style={styles.textStyle}>
                      {this.state.ProfileData.name}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.textStyle,
                        {fontSize: ResponsiveSize(config.AppAllTextSize)},
                      ]}>
                      {this.state.ProfileData.registerNo}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.textStyle,
                        {fontSize: ResponsiveSize(config.AppAllTextSize)},
                      ]}>
                      {this.state.ProfileData.batchYear}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    width: '90%',
                    alignSelf: 'center',
                    height: 70,
                    justifyContent: 'space-around',
                    flexDirection: 'row',
                    marginTop: -25,
                  }}>
                  <View style={styles.courseStyle}>
                    <Text style={styles.ProfileSubHeaderStyle}>Course</Text>
                    <Text style={styles.ProfileSubHeaderAns}>
                      {this.state.ProfileData.courseName
                        ? this.state.ProfileData.courseName
                        : ''}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.courseStyle,
                      {
                        paddingHorizontal: 5,
                        width: '35%',
                        alignItems: 'center',
                      },
                    ]}>
                    <Text style={styles.ProfileSubHeaderStyle}>Semester</Text>
                    <Text style={styles.ProfileSubHeaderAns}>
                      {this.state.ProfileData.currentSemester
                        ? this.state.ProfileData.currentSemester
                        : ''}
                    </Text>
                  </View>
                </View>
                <View style={styles.outerView}>
                  <View
                    style={{
                      borderBottomWidth: 0.3,
                      borderColor: 'silver',
                      width: '90%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      alignSelf: 'center',
                      minHeight: 70,
                    }}>
                    <View
                      style={{
                        width: '50%',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={[styles.ProfileHeaderStyle, {marginRight: 20}]}>
                        Gender
                      </Text>
                      <Text style={styles.ProfileContentStyle}>
                        {this.state.ProfileData.gender
                          ? this.state.ProfileData.gender
                          : ''}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '50%',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={[styles.ProfileHeaderStyle, {marginRight: 20}]}>
                        Religion
                      </Text>
                      <Text style={styles.ProfileContentStyle}>
                        {this.state.ProfileData.religion
                          ? this.state.ProfileData.religion
                          : ''}
                      </Text>
                    </View>
                  </View>
                  {this.state.ProfileData.studentMobile ? (
                    <CommomView
                      title="Mobile"
                      value={this.state.ProfileData.studentMobile}
                    />
                  ) : null}
                  {this.state.ProfileData.emailId ? (
                    <CommomView
                      title="Email Id"
                      value={this.state.ProfileData.emailId}
                    />
                  ) : null}
                  {this.state.ProfileData.aadharcardNumber ? (
                    <CommomView
                      title="Aadhar Number"
                      value={this.state.ProfileData.aadharcardNumber}
                    />
                  ) : null}
                  {this.state.ProfileData.communicationAddress ? (
                    <View style={styles.ProfileDataView}>
                      <Text style={styles.ProfileHeaderStyle}>Address</Text>
                      <Text style={styles.ProfileContentStyle}>
                        {
                          (this.state.ProfileData.communicationAddress,
                          this.state.ProfileData.communicationStreet,
                          this.state.ProfileData.communicationCity,
                          this.state.ProfileData.communicationPincode,
                          this.state.ProfileData.communicationDistrict,
                          this.state.ProfileData.communicationState)
                        }
                      </Text>
                    </View>
                  ) : null}
                </View>

                <View style={styles.outerView}>
                  {this.state.ProfileData.fatherName ? (
                    <CommomView
                      title="Father Name"
                      value={this.state.ProfileData.fatherName}
                    />
                  ) : null}
                  {this.state.ProfileData.fatherOccupation ? (
                    <CommomView
                      title="Father Occupation"
                      value={this.state.ProfileData.fatherOccupation}
                    />
                  ) : null}
                  {this.state.ProfileData.fatherMobile ? (
                    <CommomView
                      title="Father Mobile"
                      value={this.state.ProfileData.fatherMobile}
                    />
                  ) : null}
                  {this.state.ProfileData.motherName ? (
                    <CommomView
                      title="Mother Name"
                      value={this.state.ProfileData.motherName}
                    />
                  ) : null}
                  {this.state.ProfileData.motherOccupation ? (
                    <CommomView
                      title="Mother Occupation"
                      value={this.state.ProfileData.motherOccupation}
                    />
                  ) : null}
                  {this.state.ProfileData.motherMobile ? (
                    <CommomView
                      title="Mother Mobile"
                      value={this.state.ProfileData.motherMobile}
                    />
                  ) : null}
                </View>
              </View>
            ) : (
              <Animatable.View
                key={Math.random()}
                duration={400}
                style={[styles.header, {width: '95%', alignSelf: 'center'}]}
                transition="backgroundColor">
                <Text style={[styles.headerText, {textTransform: 'none'}]}>
                  No data available
                </Text>
              </Animatable.View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Fragment>
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
  courseStyle: {
    paddingHorizontal: 20,
    width: '55%',
    height: '100%',
    backgroundColor: '#F6F6F6',
    borderRadius: 15,
    justifyContent: 'center',
    elevation: 3,
    shadowColor: 'silver',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
  },
  outerView: {
    paddingBottom: 20,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'white',
    marginTop: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: 'silver',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.6,
  },
  textStyle: {
    fontFamily: 'Poppins-Regular',
    fontSize: ResponsiveSize(config.AppAllHeaderSize),
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  imageBorderContainer: {
    width: ResponsiveSize(90),
    height: ResponsiveSize(90),
    borderRadius: ResponsiveSize(90),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
