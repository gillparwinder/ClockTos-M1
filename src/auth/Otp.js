import React, {Component} from 'react';
import {SafeAreaView} from 'react-native';
import {Text, View, TouchableOpacity, Dimensions, Animated} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;
import Toast from 'react-native-tiny-toast';
import config from '../config/config';
import ResponsiveSize from '../config/ResponsiveSize';
import {Loader} from '../components/Loader';
import {loginDetail} from '../actions/Detail';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Overlay} from 'react-native-elements';
import {StatusBar, Alert, BackHandler} from 'react-native';
import {styles} from './style';
import {CustomButton} from '../components/common/Button';
import OTPInput from 'react-native-otp';
import AuthFastImage from './AuthFastImage';

const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};
class Otp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      OTP: '',
      Token: '',
      WelcomeOverlayVisible: false,
      ResendOtp: false,
      Loader: false,

      InstituteCode: this.props.route.params
        ? this.props.route.params.instituteCode
          ? this.props.route.params.instituteCode
          : ''
        : '',
      Mobile: this.props.route.params
        ? this.props.route.params.mobileNumber
          ? this.props.route.params.mobileNumber
          : ''
        : '',
      isStudent: this.props.route.params
        ? this.props.route.params.isStudent
          ? this.props.route.params.isStudent
          : ''
        : '',
      Email: this.props.route.params
        ? this.props.route.params.emailId
          ? this.props.route.params.emailId
          : ''
        : '',
      staffCode: this.props.route.params
        ? this.props.route.params.staffCode
          ? this.props.route.params.staffCode
          : ''
        : '',
      HashKey: this.props.route.params
        ? this.props.route.params.hashKey
          ? this.props.route.params.hashKey
          : ''
        : '',
      mPin: '',
    };
  }

  componentDidMount() {
    this.NextStep();
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
  NextStep = () => {
    this.props.route?.params?.isStudent
      ? this.onLoadGetDataByProfile()
      : this.onLoadGetStaffProfile();

    this.storeData(
      'instituteCode',
      this.state.InstituteCode ? this.state.InstituteCode : '',
    );
  };
  onLoadGetDataByProfile = () => {
    const url = config.baseUrl + 'usermanagment/StudentInfoByMobileNumber';
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        //'Authorization': 'Bearer ' + this.state.Token
      },
      body: JSON.stringify({
        instituteCode: this.state.InstituteCode,
        emailId: this.state.Email,
        mobileNumber: this.state.Mobile,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //console.log('responseJson = ', responseJson);
        if (responseJson.status == true) {
          this.setState(
            {
              Loader: false,
              isValidUser: true,
              CollegeData: responseJson.collegeInfo,
              StudentData: responseJson.studentInfo,
            },
            function () {},
          );
        } else if (responseJson.status == false) {
          this.setState({Loader: false, isValidUser: false}, function () {
            Alert.alert(
              'Alert',
              'No data available with these details.Please check and try again',
              [
                {
                  text: 'Go Back',
                  onPress: () => this.props.navigation.goBack(),
                },
              ],
              {cancelable: false},
            );
          });
        } else {
          this.setState({Loader: false, isValidUser: false}, function () {
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
        this.setState({Loader: false, isValidUser: false}, function () {
          Alert.alert(
            'Alert',
            'No data available with these details.Please check and try again',
            [{text: 'Go Back', onPress: () => this.props.navigation.goBack()}],
            {cancelable: false},
          );
          Toast.show('No data available with these details.', ToastData);
        });
      });
  };
  onLoadGetStaffProfile = () => {
    const url = config.baseUrl2 + 'usermanagment/GetStaffProfile';
    //'http://insproplus.com/erpv2api/api/usermanagment/GetStaffProfile';
    console.log(url);
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        //'Authorization': 'Bearer ' + this.state.Token
      },
      body: JSON.stringify({
        instituteCode: this.state.InstituteCode,
        staffCode: this.state.staffCode,
        //instituteCode: 'SPUNI001',
        //staffCode: '1123',
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        //if (responseJson.status == true) {
        if (responseJson) {
          this.setState(
            {
              Loader: false,
              staffData: responseJson,
            },
            function () {},
          );
        } else {
          this.setState({Loader: false}, function () {
            Toast.show(
              responseJson.message
                ? responseJson.message
                : 'Temporary error try again after some time',
              ToastData,
            );
          });
        }
      })
      .catch((error) => {
        this.setState({Loader: false}, function () {
          console.log(error);
          alert(error);
        });
      });
  };
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

  ResendOtp = () => {
    var phoneno = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (this.state.InstituteCode == '') {
      this.setState({Loader: false}, function () {
        Toast.show('Please enter Institute Code', ToastData);
      });
    } else if (this.state.Mobile == '') {
      this.setState({Loader: false}, function () {
        Toast.show('Mobile number required', ToastData);
      });
    } else if (this.state.Mobile.match(phoneno) == null) {
      this.setState({Loader: false}, function () {
        Toast.show('Enter valid Mobile number', ToastData);
      });
    } else {
      if (this.state.isStudent) {
        //console.log('student');
        const url = config.baseUrl + 'usermanagment/GenerateOTP';
        fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            instituteCode: this.state.InstituteCode,
            emailId: this.state.Email,
            mobileNumber: this.state.Mobile,
            hashKey: this.state.HashKey,
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson && responseJson.status == true) {
              this.setState({Loader: false, OTP: ''}, function () {
                alert(JSON.stringify('your Otp is ' + responseJson.message));
                Toast.showSuccess('OTP sent successfully', {
                  duration: 50,
                  position: Toast.position.CENTER,
                });
              });
            } else if (responseJson && responseJson.status == false) {
              this.setState({Loader: false}, function () {
                Toast.show(responseJson.message, ToastData);
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
            this.setState({Loader: false}, function () {
              alert(error);
            });
          });
      } else {
        const url = config.baseUrl2 + 'usermanagment/GenerateOTP';
        //console.log('staff');
        fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            instituteCode: this.state.InstituteCode,
            staffCode: this.state.staffCode,
            hashKey: this.state.HashKey,
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson && responseJson.status == true) {
              this.setState({Loader: false, OTP: ''}, function () {
                alert(JSON.stringify('your Otp is ' + responseJson.message));
                Toast.showSuccess('OTP sent successfully', {
                  duration: 50,
                  position: Toast.position.CENTER,
                });
              });
            } else if (responseJson && responseJson.status == false) {
              this.setState({Loader: false}, function () {
                Toast.show(responseJson.message, ToastData);
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
            this.setState({Loader: false}, function () {
              alert(error);
            });
          });
      }
    }
  };
  submit = () => {
    if (this.state.OTP.length == '') {
      this.setState({Loader: false}, function () {
        Toast.show('Please Enter OTP', ToastData);
      });
    } else if (this.state.OTP.length != 4) {
      this.setState({Loader: false}, function () {
        Toast.show('OTP should be equal to 4 digit ', ToastData);
      });
    } else {
      this.storeData('mobile', this.state.Mobile ? this.state.Mobile : '');
      if (this.state.isStudent) {
        //console.log('student');
        const url = config.baseUrl + 'usermanagment/VerifyMobileOTP';
        //console.log(url);
        fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            instituteCode: this.state.InstituteCode,
            emailId: this.state.Email,
            mobileNumber: this.state.Mobile,
            otp: this.state.OTP,
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            //console.log(responseJson);
            //alert(responseJson.message);
            if (responseJson && responseJson.status == true) {
              this.setState(
                {
                  Loader: false,
                  WelcomeOverlayVisible: true,
                  Token: responseJson.message,
                },
                function () {},
              );
            } else if (responseJson && responseJson.status == false) {
              this.setState({Loader: false}, function () {
                Toast.show(responseJson.message, ToastData);
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
            //console.log(error);
            this.setState({Loader: false}, function () {
              alert(error);
            });
          });
      } else {
        const url = config.baseUrl2 + 'usermanagment/VerifyMobileOTP';
        //console.log(url);
        //console.log('staff');
        fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            instituteCode: this.state.InstituteCode,
            emailId: this.state.Email,
            mobileNumber: this.state.Mobile,
            otp: this.state.OTP,
            staffCode: this.state.staffCode,
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson && responseJson.status == true) {
              this.setState(
                {
                  Loader: false,
                  WelcomeOverlayVisible: true,
                  Token: responseJson.message,
                },
                function () {},
              );
            } else if (responseJson && responseJson.status == false) {
              this.setState({Loader: false}, function () {
                Toast.show(responseJson.message, ToastData);
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
            this.setState({Loader: false}, function () {
              alert(error);
            });
          });
      }
    }
  };
  render() {
    return (
      <View style={{backgroundColor: 'white', flex: 1}}>
        <StatusBar barStyle="dark-content" />
        <Loader
          Loading={this.state.Loader ? true : false}
          onPressCancel={() => {
            this.setState({Loader: false});
          }}
        />
        <KeyboardAwareScrollView
          resetScrollToCoords={{x: 0, y: 0}}
          contentContainerStyle={{height: ScreenHeight, display: 'flex'}}
          scrollEnabled={true}>
          <SafeAreaView style={styles.mainContainer}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}
              style={{
                width: 150,
                height: 150,
                alignSelf: 'flex-start',
                position: 'absolute',
                zIndex: 2,
              }}
            />
            <View style={[styles.ImageConatiner, {height: '45%'}]}>
              <AuthFastImage
                source={require('../assets/otp2.png')}
                resizeMode={'stretch'}
                style={{
                  width: '100%',
                  height: '100%',
                  alignSelf: 'flex-end',
                }}
              />
            </View>
            <Text
              style={[
                styles.text,
                {
                  color: config.themeColor,
                  alignSelf: 'center',
                  textAlign: 'center',
                  width: '90%',
                  marginTop: 30,
                  alignSelf: 'center',
                },
              ]}>
              Enter your OTP
            </Text>

            <View style={styles.emailOuter}>
              {/*<CodeField
                {...this.props}
                value={this.state.OTP}
                onChangeText={(text) =>
                  this.setState({OTP: text}, function () {
                    if (this.state.OTP.length == 4) {
                      this.setState({Loader: true}, function () {
                        this.submit();
                      });
                    }
                  })
                }
                cellCount={4}
                blurOnSubmit={true}
                autoFocus={true}
                returnKeyType="done"
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({index, symbol, isFocused}) => (
                  <View
                    key={Math.random()}
                    style={{backgroundColor: '#E9ECFE', borderRadius: 10}}>
                    <Text
                      key={index}
                      style={[styles.cell, isFocused && styles.focusCell]}>
                      {(isFocused ? <Cursor /> : null, symbol ? '*' : null)}
                    </Text>
                  </View>
                )}
              />*/}
              <OTPInput
                value={this.state.OTP}
                onChange={(text) => {
                  this.setState({OTP: text}, function () {
                    if (this.state.OTP.length == 4) {
                      this.setState({Loader: true}, function () {
                        this.submit();
                      });
                    }
                  });
                }}
                tintColor={config.themeColor}
                offTintColor={'white'}
                otpLength={4}
                containerStyle={{
                  //width: '100%',
                  height: 50,
                  marginTop: -30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                cellStyle={{
                  color: 'white',
                  //borderRadius: 10,
                  width: 40,
                  height: 40,
                  //marginRight: 5,
                  backgroundColor: config.SubThemeColor,
                }}
              />
              {/*<OTPInputView
                value={this.state.OTP}
                style={{
                  width: '70%',
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                pinCount={4}
                autoFocusOnLoad
                //secureTextEntry={true}
                codeInputFieldStyle={{
                  borderWidth: 1,
                  color: 'white',
                  borderRadius: 10,
                  borderColor: config.themeColor,
                  width: 40,
                  height: 40,
                  //marginRight: 5,
                  backgroundColor: config.SubThemeColor,
                }}
                codeInputHighlightStyle={{
                  borderColor: config.themeColor,
                }}
                onCodeFilled={(text) => {
                  this.setState({OTP: text}, function () {
                    if (this.state.OTP.length == 4) {
                      this.setState({Loader: true}, function () {
                        this.submit();
                      });
                    }
                  });
                }}
              />*/}
            </View>
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                color: 'gray',
                textAlign: 'center',
                marginBottom: 30,
                fontSize: ResponsiveSize(config.AppAllHeaderSize),
              }}>
              OTP Sent to {this.state.Mobile}
            </Text>
            <CustomButton
              title="Verify"
              onPress={() => {
                this.setState({Loader: true}, function () {
                  this.submit();
                });
              }}
            />

            <View style={styles.buttonsContainer2}>
              {this.state.ResendOtp ? (
                <TouchableOpacity
                  style={[styles.loginButton, {backgroundColor: 'transparent'}]}
                  onPress={() =>
                    this.setState(
                      {ResendOtp: false, Loader: true},
                      function () {
                        this.ResendOtp();
                      },
                    )
                  }>
                  <Text style={[styles.text, {color: config.themeColor}]}>
                    Resend Otp
                  </Text>
                </TouchableOpacity>
              ) : (
                <CountdownCircleTimer
                  size={30}
                  strokeWidth={3}
                  isPlaying={this.state.ResendOtp ? false : true}
                  duration={20}
                  onComplete={() => {
                    this.setState({ResendOtp: true});
                  }}
                  colors={[
                    [config.themeColor, 0.4],
                    [config.SubThemeColor, 0.2],
                    ['#A30000', 0.2],
                  ]}>
                  {({remainingTime, animatedColor}) => (
                    <Animated.Text style={{color: animatedColor}}>
                      {remainingTime}
                    </Animated.Text>
                  )}
                </CountdownCircleTimer>
              )}
            </View>
          </SafeAreaView>
          <Overlay
            isVisible={this.state.WelcomeOverlayVisible}
            overlayStyle={{
              width: ScreenWidth - 120,
              height: ScreenHeight / 2.5,
              borderRadius: 20,
              paddingBottom: 20,
              backgroundColor: config.bgColor,
            }}>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                height: '60%',
                marginVertical: 20,
                justifyContent: 'space-between',
              }}>
              <Text>OTP Verification successfully</Text>

              <AuthFastImage
                source={require('../assets/welcome.png')}
                resizeMode={'contain'}
                style={{width: '100%', height: '75%'}}
              />
              <Text>OTP Verification successfully</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.loginButton,
                {
                  alignSelf: 'center',
                  width: '80%',
                  height: 45,
                  marginVertical: 20,
                },
              ]}
              onPress={() =>
                this.setState({WelcomeOverlayVisible: false}, function () {
                  this.props.navigation.navigate('SetMpin', {
                    Token: this.state.Token,
                    isStudent: this.state.isStudent,
                  });
                })
              }>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  color: 'white',
                  fontWeight: '600',
                }}>
                Let's Set MPIN
              </Text>
            </TouchableOpacity>
          </Overlay>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  //  //console.log(state);
  return {
    //  Details: state.detailReducer.DetailList
  };
};

const mapDispatchToProps = (dispatch) => {
  //  //console.log('dispatch====' + JSON.stringify(dispatch));
  return {
    loginDetail: (key) => dispatch(loginDetail(key)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Otp);
