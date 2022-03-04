import React, {Component} from 'react';
import {SafeAreaView} from 'react-native';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import OTPInput from 'react-native-otp';
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;
import Toast from 'react-native-tiny-toast';
import {Loader} from '../components/Loader';
import config from '../config/config';
import ResponsiveSize from '../config/ResponsiveSize';
import {loginDetail} from '../actions/Detail';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {StatusBar, BackHandler} from 'react-native';
import {CustomButton} from '../components/common/Button';
import {styles} from './style';
import AuthFastImage from './AuthFastImage';
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};
class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Email: '',
      Mobile: '',
      InstituteCode: '',
      ShowInstituteCode: false,
      Loader: false,
      secureTextEntry: true,
    };
  }

  componentDidMount() {
    this.props.navigation.addListener('blur', () => {
      this.setState({Mobile: '', InstituteCode: '', ShowInstituteCode: false});
    });
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
  }
  handleBackPress = () => {
    this.props.navigation.goBack(null);
    return true;
  };
  componentWillUnmount() {
    this.backHandler.remove();
    this.props.navigation.removeListener('blur', () => {
      this.setState({Mobile: '', InstituteCode: '', ShowInstituteCode: false});
    });
  }

  buttonAction = () => {
    var phoneno = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;

    if (this.state.Mobile == '') {
      this.setState({Loader: false}, function () {
        Toast.show('Mobile number required', ToastData);
      });
    } else if (this.state.Mobile.match(phoneno) == null) {
      this.setState({Loader: false}, function () {
        Toast.show('Enter valid Mobile number', ToastData);
      });
    } else if (
      !this.state.ShowInstituteCode &&
      this.state.Mobile &&
      this.state.InstituteCode == ''
    ) {
      this.onLoadGetInstitudeId();
    } else {
      //this.setState({Loader: false}, function () {
      if (this.state.InstituteCode.length != 6) {
        this.setState({Loader: false}, function () {
          Toast.show('Enter valid Institution Id', ToastData);
        });
      } else {
        this.onPressGetIsStudentOrStaff();
      }
      //});
    }
  };
  onLoadGetInstitudeId = () => {
    var phoneno = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (this.state.Mobile == '') {
      this.setState({Loader: false}, function () {
        Toast.show('Mobile number required', ToastData);
      });
    } else if (this.state.Mobile.match(phoneno) == null) {
      this.setState({Loader: false}, function () {
        Toast.show('Enter valid Mobile number', ToastData);
      });
    } else {
      console.log(
        config.baseUrl + 'usermanagment/IsInstituteMapped/' + this.state.Mobile,
      );
      const url =
        config.baseUrl + 'usermanagment/IsInstituteMapped/' + this.state.Mobile;
      fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          if (responseJson.status == true) {
            this.setState(
              {
                ShowInstituteCode: false,
                InstituteCode: responseJson.message,
              },
              function () {
                this.onPressGetIsStudentOrStaff();
              },
            );
          } else if (responseJson.status == false) {
            //alert('false');
            this.setState(
              {
                Loader: false,
                ShowInstituteCode: true,
              },
              function () {
                Toast.show(
                  responseJson.message
                    ? responseJson.message
                    : 'Please Enter Your Institute ID',
                  ToastData,
                );
              },
            );
          } else {
            this.setState(
              {Loader: false, ShowInstituteCode: false},
              function () {
                Toast.show(
                  responseJson.message
                    ? responseJson.message
                    : 'Temporary error try again after some time',
                  ToastData,
                );
              },
            );
          }
        })
        .catch((error) => {
          this.setState({Loader: false}, function () {
            console.log(error);
            alert(error);
          });
        });
    }
  };
  onPressGetIsStudentOrStaff = () => {
    var phoneno = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (this.state.Mobile == '') {
      this.setState({Loader: false}, function () {
        Toast.show('Mobile number required', ToastData);
      });
    } else if (this.state.Mobile.match(phoneno) == null) {
      this.setState({Loader: false}, function () {
        Toast.show('Enter valid Mobile number', ToastData);
      });
    } else {
      const url = config.baseUrl + 'usermanagment/GetIsStudentOrStaff';
      console.log(url);
      console.log(
        JSON.stringify({
          instituteCode: this.state.InstituteCode,
          emailId: 'string',
          mobileNumber: this.state.Mobile,
        }),
      );
      fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instituteCode: this.state.InstituteCode,
          emailId: 'string',
          mobileNumber: this.state.Mobile,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          if (responseJson.status == true) {
            this.setState(
              {
                Loader: false,
              },
              function () {
                this.submit(
                  responseJson.isStudent,
                  responseJson.staffCode,
                  responseJson.applicationNo,
                );
              },
            );
          } else if (responseJson.status == false) {
            this.setState({Loader: false}, function () {
              Toast.show(
                responseJson.message
                  ? responseJson.message
                  : 'Temporary error try again after some time',
                ToastData,
              );
            });
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
    }
  };

  submit = (isStudent, staffCode, applicationNo) => {
    this.props.navigation.navigate('GetProfile', {
      instituteCode: this.state.InstituteCode,
      mobileNumber: this.state.Mobile,
      hashKey: 'asd',
      isStudent,
      staffCode,
      applicationNo,
    });
  };

  render() {
    return (
      <KeyboardAwareScrollView
        resetScrollToCoords={{x: 0, y: 0}}
        contentContainerStyle={{height: ScreenHeight, display: 'flex'}}
        scrollEnabled={true}>
        <StatusBar barStyle="dark-content" />
        <Loader
          Loading={this.state.Loader ? true : false}
          onPressCancel={() => {
            this.setState({Loader: false});
          }}
        />
        <SafeAreaView style={styles.mainContainer}>
          <View style={[styles.ImageConatiner, {height: '38%'}]}>
            <AuthFastImage
              source={require('../assets/createPinLogo.png')}
              resizeMode={'stretch'}
              style={{width: '100%', height: '100%'}}
            />
          </View>
          <View
            style={[
              styles.emailConatiner,
              {height: '62%', alignItems: 'flex-start'},
            ]}>
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                color: config.themeColor,
                width: '60%',
                textAlign: 'left',
                marginLeft: 20,
                fontSize: ResponsiveSize(config.textSize),
              }}>
              Enter phone number for verification
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                color: config.themeColor,
                width: '90%',
                textAlign: 'left',
                marginLeft: 20,
                marginVertical: 5,
                fontSize: ResponsiveSize(config.AppAllTextSize),
                lineHeight: 20,
                color: '#6397F2',
              }}>
              Please enter your phone number to receive a verification code to
              login
            </Text>
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
                      if (this.state.Mobile.length == 10) {
                        this.setState({Loader: true}, function () {
                          this.onLoadGetInstitudeId();
                        });
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
            {this.state.ShowInstituteCode ? (
              <View
                style={[
                  styles.emailOuter2,
                  {
                    width: '87%',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    marginTop: 10,
                    marginBottom: 20,
                  },
                ]}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    color: config.themeColor,
                    textAlign: 'left',
                    fontSize: ResponsiveSize(config.AppAllTextSize),
                    lineHeight: 20,
                    marginTop: 5,
                    color: config.themeColor,
                    marginBottom: 10,
                    fontWeight: 'bold',
                  }}>
                  Institude ID
                </Text>

                {/*<CodeField
                  {...this.props}
                  value={this.state.InstituteCode}
                  onChangeText={(text) =>
                    this.setState({InstituteCode: text}, function () {
                      if (this.state.InstituteCode.length == 6) {
                        this.setState({Loader: true}, function () {
                          this.buttonAction();
                        });
                      }
                    })
                  }
                  //cellCount={6}
                  blurOnSubmit={true}
                  rootStyle={styles.codeFieldRoot}
                  keyboardType="default"
                  autoCapitalize="characters"
                  textContentType="oneTimeCode"
                  renderCell={({index, symbol, isFocused}) => (
                    <View
                      key={Math.random()}
                      style={{
                        backgroundColor: config.SubThemeColor,
                        borderRadius: 10,
                      }}>
                      <Text
                        key={index}
                        style={[
                          styles.cell,
                          {
                            width: 40,
                            height: 40,
                            lineHeight: 40,
                            color: 'white',
                          },
                          isFocused && styles.focusCell,
                        ]}>
                        {
                          (isFocused ? <Cursor /> : null,
                          symbol ? symbol : null)
                        }
                      </Text>
                    </View>
                  )}
                />*/}
                <View style={{width: '100%', alignItems: 'center'}}>
                  <OTPInput
                    keyboardType="email-address"
                    value={this.state.InstituteCode}
                    onChange={(text) => {
                      this.setState({InstituteCode: text}, function () {
                        if (this.state.InstituteCode.length == 6) {
                          this.setState({Loader: true}, function () {
                            this.buttonAction();
                          });
                        }
                      });
                    }}
                    tintColor={config.themeColor}
                    offTintColor={'white'}
                    otpLength={6}
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
                </View>
                {/*<OTPInputView
                  keyboardType="email-address"
                  value={this.state.InstituteCode}
                  style={{
                    width: '100%',
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  pinCount={6}
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
                    //console.log(`Code is ${text}, you are good to go!`);
                    this.setState({InstituteCode: text}, function () {
                      if (this.state.InstituteCode.length == 6) {
                        this.setState({Loader: true}, function () {
                          this.buttonAction();
                        });
                      }
                    });
                  }}
                />*/}
              </View>
            ) : (
              <View
                style={[
                  styles.emailOuter2,
                  {
                    width: '87%',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  },
                ]}></View>
            )}

            <CustomButton
              title="Next"
              onPress={() => {
                this.setState({Loader: true}, function () {
                  this.buttonAction();
                });
              }}
            />
            <Text
              onPress={() => {
                this.props.navigation.goBack();
              }}
              style={[
                styles.text,
                {
                  color: config.themeColor,
                  alignSelf: 'center',
                  marginTop: 10,
                  fontSize: ResponsiveSize(config.AppAllTextSize),
                },
              ]}>
              Already have an account ? Login here
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                color: config.themeColor,
                width: '80%',
                alignSelf: 'center',
                textAlign: 'center',
                fontSize: ResponsiveSize(config.AppAllTextSize),
                marginTop: 20,
                color: '#6397F2',
              }}>
              By providing my phone number, I hereby agree and accept the
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  color: 'black',
                  textDecorationLine: 'underline',
                }}>
                Terms of Service
              </Text>
              and
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  color: 'black',
                  textDecorationLine: 'underline',
                }}>
                Privacy Policy
              </Text>
              in use of the app.
            </Text>
          </View>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    //  Details: state.detailReducer.DetailList
  };
};

const mapDispatchToProps = (dispatch) => {
  ////console.log("dispatch====" + dispatch);
  return {
    loginDetail: (key) => dispatch(loginDetail(key)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
