import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {SafeAreaView, Keyboard} from 'react-native';
import {Text, View, Dimensions, TouchableOpacity} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-tiny-toast';
import {Loader} from '../components/Loader';
import config from '../config/config';
import ResponsiveSize from '../config/ResponsiveSize';
import {StatusBar, BackHandler, Animated} from 'react-native';
import {styles} from './style';
import OneSignal from 'react-native-onesignal';
import {CustomButton} from '../components/common/Button';
import DeviceInfo from 'react-native-device-info';
import AwesomeAlert from 'react-native-awesome-alerts';
import OTPInput from 'react-native-otp';
import AuthFastImage from './AuthFastImage';
import axios from 'axios';
import {TextInput} from 'react-native';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import ButtonSwitcher from '../components/common/ButtonSwitcher';
import MultipleStudentAlert from './MultipleStudentAlert';

const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};
let abortController = null;
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Mpin: '',
      Loader: false,
      Mobile: '',
      repeat: '0',
      //Mobile: '8056918189',
      mPin: '',
      loginToken: '',
      DeviceToken: '',
      backClickCount: 0,
      isStudent: true,
      autoFocus: false,
      ModalVisible: false,
      applicationNo: '',
      StudentArr: [],
    };
    this.springValue = new Animated.Value(100);
  }
  retrieveData = async (key) => {
    try {
      const value = await AsyncStorage.getItem('applicationNo');
      if (value !== null) {
        this.setState({applicationNo: value});
      }
    } catch (error) {
      alert('Error retrieving data');
    }
    try {
      const value = await AsyncStorage.getItem('mobile');
      if (value !== null) {
        this.setState({Mobile: value});
      }
    } catch (error) {
      alert('Error retrieving data');
    }
    try {
      const value = await AsyncStorage.getItem('repeat');
      if (value !== null) {
        this.setState({repeat: value});
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
  playerId = async (key) => {
    const playerId = await OneSignal.getDeviceState();
    this.storeData('playerId', playerId.userId ? playerId.userId : '');
    //console.log('playerId', playerId.userId);
  };
  componentDidMount() {
    this.retrieveData();
    DeviceInfo.getAndroidId().then((androidId) => {
      this.setState({DeviceToken: androidId});
      // androidId here
    });
    this.playerId();
    this.props.navigation.addListener('blur', () => {
      this.setState({Mpin: '', mpin: ''});
      Keyboard.dismiss();
    });
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButton.bind(this),
    );
  }

  componentWillUnmount() {
    this.props.navigation.removeListener('blur', () => {
      this.setState({Mpin: '', mpin: ''});
      Keyboard.dismiss();
    });
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButton.bind(this),
    );
  }
  handleBackButton = () => {
    this.state.backClickCount == 1
      ? this.setState({Active: 'home'})
      : this._spring();

    return true;
  };
  _spring() {
    this.setState({backClickCount: 1}, () => {
      Animated.sequence([
        Animated.spring(this.springValue, {
          toValue: -0.05 * ScreenHeight,
          friction: 5,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(this.springValue, {
          toValue: 100,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        this.setState({backClickCount: 0});
      });
    });
  }
  onLoadGetMultipleStudent = () => {
    if (this.state.Mobile == '') {
      this.setState({Loader: false}, function () {
        Toast.show('Please Enter Mobile Number', ToastData);
      });
    } else if (this.state.Mobile.length != 10) {
      this.setState({Loader: false}, function () {
        Toast.show('Mobile Number should be 10 digit', ToastData);
      });
    } else if (this.state.Mpin == '') {
      this.setState({Loader: false}, function () {
        Toast.show('Please enter mpin', ToastData);
      });
    } else if (this.state.Mpin.length != 4) {
      this.setState({Loader: false}, function () {
        Toast.show('Mpin should be 4 digit', ToastData);
      });
    } else {
      const url =
        config.baseUrl2 + 'usermanagment/MultiUserLogin/' + this.state.Mobile;
      console.log(url);
      fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          //'Authorization': 'Bearer ' + this.state.Token
        },
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          if (responseJson) {
            this.setState(
              {
                Loader: false,
                StudentArr: responseJson,
              },
              function () {
                if (this.state.StudentArr.length > 1) {
                  this.setState({ModalVisible: true});
                } else if (!this.state.StudentArr.length) {
                  //this.setState({ModalVisible: true});
                  Toast.show('No Data Available');
                } else {
                  this.setState(
                    {
                      applicationNo: this.state.StudentArr[0].applicationNo,
                      Loader: true,
                    },
                    () => {
                      this.storeData(
                        'applicationNo',
                        this.state.applicationNo || '',
                      );
                      this.submit();
                    },
                  );
                }
              },
            );
          }
        })
        .catch((error) => {
          this.setState({Loader: false}, function () {
            console.log(error);
            if (error == '[SyntaxError: JSON Parse error: Unexpected EOF]') {
              Toast.show(
                'Data is inaccessible for this mobile number please contact to your ERP coordinator',
                ToastData,
              );
            } else {
              alert(error);
            }
          });
        });
    }
  };
  submit = () => {
    //console.log('this.state.isStudent == ', this.state.isStudent);
    if (this.state.Mobile == '') {
      this.setState({Loader: false}, function () {
        Toast.show('Please Enter Mobile Number', ToastData);
      });
    } else if (this.state.Mobile.length != 10) {
      this.setState({Loader: false}, function () {
        Toast.show('Mobile Number should be 10 digit', ToastData);
      });
    } else if (this.state.Mpin == '') {
      this.setState({Loader: false}, function () {
        Toast.show('Please enter mpin', ToastData);
      });
    } else if (this.state.Mpin.length != 4) {
      this.setState({Loader: false}, function () {
        Toast.show('Mpin should be 4 digit', ToastData);
      });
    } else {
      const url = config.baseUrl2 + 'usermanagment/Login';
      let bodyData = JSON.stringify({
        mobileNo: this.state.Mobile,
        mpin: this.state.Mpin,
        appNo: Number(this.state.applicationNo) || 0,
      });
      let headerData = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      };
      console.log(url);
      console.log('bodyData = ', bodyData);
      axios
        .post(url, bodyData, headerData)
        .then((response) => {
          //alert(JSON.stringify(response));
          console.log('response = ', response.data);
          if (response.data && response.data.status == true) {
            this.setState({Loader: false}, function () {
              //this.storeData('logout', 'login');

              if (response.data?.is_staff == true) {
                console.log('staff');
                this.storeData('collegeName', response.data?.collegeName || '');
                this.storeData(
                  'collegeCode',
                  response.data.college_code.toString(),
                );
                this.storeData('desigName', response.data?.designation || '');
                this.storeData('email', response.data?.email || '');
                this.storeData('name', response.data?.full_name || '');
                this.storeData('userId', response.data?.user_id || '');
                this.storeData(
                  'isStudent',
                  response.data?.is_staff == true ? 'false' : 'true' || '',
                );
                this.storeData('token', response.data?.message || '');
                this.storeData('mobile', response.data?.mobileNo || '');
                this.storeData('image', response.data?.image || '');
                this.storeData('staffCode', response.data?.staff_code || '');
                this.props.navigation.replace('MainStack');
              } else {
                console.log('student');
                this.storeData('collegeCode', response.data?.collegeCode || '');
                this.storeData('course', response.data?.courseName || '');
                this.storeData('email', response.data?.emailId || '');
                this.storeData('name', response.data?.name || '');
                this.storeData('isStudent', 'true');
                this.storeData('token', response.data?.message || '');
                this.storeData('mobile', response.data?.studentMobile || '');
                this.storeData('image', response.data?.studentImage || '');
                this.storeData('sem', response.data?.currentSemester || '');
                this.storeData('rollNo', response.data?.rollNo || '');
                this.storeData('registerNo', response.data?.registerNo || '');
                this.props.navigation.replace('MainStack');
              }
            });
          } else {
            this.setState({Loader: false}, function () {
              Toast.show(response.data.message, ToastData);
            });
          }
        })
        .catch((error) => {
          this.setState({Loader: false}, function () {
            alert(error);
            console.log('error = ', error);
          });
        });
    }
  };
  handleChange = (text) => {
    this.setState({Mpin: text}, function () {
      if (this.state.Mpin.length == 4 && this.state.Mobile.length == 10) {
        this.setState({Loader: true}, function () {
          if (this.state.repeat == '1') {
            this.submit();
          } else {
            this.onLoadGetMultipleStudent();
          }
        });
      }
    });
  };
  dismiss = () => {
    this.setState({ModalVisible: false});
  };
  render() {
    return (
      <View style={{backgroundColor: 'white', flex: 1}}>
        <StatusBar barStyle="light-content" />
        <AwesomeAlert
          show={this.state.showAlert}
          showProgress={false}
          title="Attention"
          message={this.state.error_message}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          cancelText="Okay"
          onCancelPressed={() => {
            this.setState({showAlert: false});
          }}
          cancelButtonColor={config.themeColor}
          cancelButtonTextStyle={{
            fontFamily: 'Poppins-Regular',
            fontSize: 13,
          }}
          messageStyle={{fontFamily: 'Poppins-Regular', fontSize: 13}}
          titleStyle={{fontFamily: 'Poppins-Regular', fontSize: 14}}
        />
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
            <View style={[styles.ImageConatiner, {height: '45%'}]}>
              <AuthFastImage
                style={{width: '100%', height: '100%'}}
                source={require('../assets/loginLogo.png')}
                resizeMode={'stretch'}
              />
            </View>
            <View style={[styles.emailConatiner, {height: '55%'}]}>
              <View
                style={[
                  styles.emailOuter,
                  {
                    flex: 1,
                    justifyContent: 'space-evenly',
                    paddingVertical: heightPercentageToDP(2),
                    width: '90%',
                    alignSelf: 'center',
                  },
                ]}>
                {/*<ButtonSwitcher
                  title2={'Staff'}
                  title={'Student'}
                  isStudent={this.state.isStudent}
                  width="100%"
                  onPress={() => {
                    this.setState({isStudent: true});
                  }}
                  onPress2={() => {
                    this.setState({isStudent: false});
                  }}
                />*/}
                {this.state.repeat != '1' && (
                  <Text
                    style={[
                      styles.text,
                      {color: config.themeColor, alignSelf: 'flex-start'},
                    ]}>
                    Enter Mobile Number
                  </Text>
                )}
                {this.state.repeat != '1' && (
                  <View style={[styles.emailOuter2, {marginTop: 10}]}>
                    <View
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 52,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 2,
                        borderColor: 'white',
                        elevation: 5,
                        shadowColor: 'gray',
                        shadowOffset: {width: 1, height: 1},
                        shadowOpacity: 0.6,
                      }}>
                      <AuthFastImage
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 50,
                        }}
                        source={require('../assets/flag.png')}
                        resizeMode={'cover'}
                      />
                    </View>
                    <View style={styles.emailInputOuter}>
                      <TextInput
                        style={[styles.emailInput, {textAlign: 'center'}]}
                        onChangeText={(text) =>
                          this.setState({Mobile: text}, function () {
                            if (
                              this.state.Mpin.length == 4 &&
                              this.state.Mobile.length == 10
                            ) {
                              this.setState({Loader: true}, function () {
                                this.onLoadGetMultipleStudent();
                              });
                            } else if (this.state.Mobile.length == 10) {
                              this.setState({autoFocus: true}, () => {
                                console.log(this.state.autoFocus);
                              });
                              Keyboard.dismiss();
                            }
                          })
                        }
                        value={this.state.Mobile}
                        selectionColor="white"
                        placeholder="Phone Number"
                        returnKeyType="next"
                        blurOnSubmit={true}
                        autoFocus={true}
                        maxLength={10}
                        returnKeyType="done"
                        placeholderTextColor="silver"
                        keyboardType="phone-pad"
                      />
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            Mobile: '',
                            ShowInstituteCode: false,
                            InstituteCode: '',
                          });
                        }}>
                        <AuthFastImage
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 25,
                          }}
                          source={require('../assets/cross2.png')}
                          resizeMode={'cover'}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                <Text
                  style={[
                    styles.text,
                    {
                      color: config.themeColor,
                      alignSelf: 'flex-start',
                      marginTop: 15,
                    },
                  ]}>
                  Enter M-PIN
                </Text>
                {/*<OtpInputs
          clearTextOnFocus
          handleChange={handleChange}
          keyboardType="phone-pad"
          numberOfInputs={4}
          selectTextOnFocus={false}
        />*/}
                <OTPInput
                  value={this.state.Mpin}
                  onChange={(text) => {
                    this.handleChange(text);
                  }}
                  tintColor={config.themeColor}
                  offTintColor={'white'}
                  otpLength={4}
                  containerStyle={{
                    //width: '100%',
                    height: 50,
                    marginTop: -20,
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
                  value={this.state.Mpin}
                  style={{
                    width: '70%',
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  pinCount={4}
                  autoFocusOnLoad={this.state.autoFocus}
                  secureTextEntry={true}
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
                    this.setState({Mpin: text}, function () {
                      if (
                        this.state.Mpin.length == 4 &&
                        this.state.Mobile.length == 10
                      ) {
                        this.setState({Loader: true}, function () {
                          this.submit();
                        });
                      }
                    });
                  }}
                />*/}
              </View>
              <Text
                onPress={() => {
                  this.props.navigation.navigate('SignUp');
                }}
                style={[
                  styles.text,
                  {
                    color: config.themeColor,
                    marginBottom: 30,
                    fontSize: ResponsiveSize(config.AppAllTextSize),
                  },
                ]}>
                New user ? Register here
              </Text>
              {this.state.repeat == '1' && (
                <Text
                  onPress={() => {
                    this.setState({repeat: '0'});
                  }}
                  style={[
                    styles.text,
                    {
                      color: config.themeColor,
                      marginBottom: 30,
                      fontSize: ResponsiveSize(config.AppAllTextSize),
                      textTransform: 'capitalize',
                    },
                  ]}>
                  Try with another mobile number
                </Text>
              )}
              <CustomButton
                title="Next"
                onPress={() => {
                  this.setState({Loader: true}, function () {
                    this.submit();
                    //AsyncStorage.clear();
                  });
                }}
              />
              <Text
                style={[
                  styles.text,
                  {
                    color: config.themeColor,
                    fontSize: ResponsiveSize(config.AppAllTextSize),
                    marginTop: 10,
                  },
                ]}>
                Privacy Policy
              </Text>
            </View>
          </SafeAreaView>
        </KeyboardAwareScrollView>
        <Animated.View
          style={{
            transform: [{translateY: this.springValue}],
            width: ScreenWidth - 10,
            alignSelf: 'center',
            backgroundColor: 'black',
            elevation: 2,
            position: 'absolute',
            bottom: 0,
            borderRadius: 5,
            padding: 10,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: '#ffffff',
              marginRight: 10,
            }}>
            Press back again to exit the app
          </Text>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => BackHandler.exitApp()}>
            <Text
              style={{
                color: '#e5933a',
                paddingHorizontal: 10,
                paddingVertical: 3,
              }}>
              Exit
            </Text>
          </TouchableOpacity>
        </Animated.View>
        <MultipleStudentAlert
          Arr={this.state.StudentArr}
          dismiss={this.dismiss}
          onPress={(applicationNo) => {
            this.setState(
              {Loader: true, ModalVisible: false, applicationNo},
              function () {
                this.storeData('applicationNo', this.state.applicationNo || '');
                this.submit();
              },
            );
          }}
          ModalVisible={this.state.ModalVisible}
        />
      </View>
    );
  }
}
