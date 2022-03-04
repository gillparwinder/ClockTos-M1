import React, {Component} from 'react';
import {Text, View, TouchableOpacity, Dimensions} from 'react-native';
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;
import Toast from 'react-native-tiny-toast';
import {Loader} from '../components/Loader';
import config from '../config/config';
import {loginDetail} from '../actions/Detail';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {StatusBar, BackHandler} from 'react-native';
import {CustomButton} from '../components/common/Button';
import {styles} from './style';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import OTPInput from 'react-native-otp';
import AuthFastImage from './AuthFastImage';
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};
class SetMpin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Loader: false,
      Mpin: '',
      ConfirmMpin: '',
      Token: this.props.route?.params?.Token,
      isStudent: this.props.route?.params?.isStudent,
      Show: false,
      ShowConfirmCode: false,
    };
  }

  //storeData = async (key, value) => {
  //  try {
  //    await AsyncStorage.setItem(key, value);
  //  } catch (error) {
  //    // Error saving data
  //    alert('store data catched');
  //  }
  //};
  componentDidMount() {
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
  }

  submit = () => {
    if (this.state.Mpin == '') {
      this.setState({Loader: false}, function () {
        Toast.show('Please enter mpin', ToastData);
      });
    } else if (this.state.ConfirmMpin == '') {
      this.setState({Loader: false}, function () {
        Toast.show('Please confirm mpin', ToastData);
      });
    } else if (this.state.Mpin != this.state.ConfirmMpin) {
      this.setState({Loader: false}, function () {
        Toast.show('Mpin and confirm mpin should be same', ToastData);
      });
    } else {
      if (this.state.isStudent == 'true' || this.state.isStudent == true) {
        const url = config.baseUrl + 'student/RegisterMPIN';
        //console.log(url);
        fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.state.Token,
          },
          body: JSON.stringify({
            mpin: this.state.Mpin,
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson && responseJson.status == true) {
              this.setState({Loader: false}, function () {
                //this.storeData('mPin', this.state.Mpin);
                Toast.showSuccess(responseJson.message, {
                  duration: 50,
                  position: Toast.position.CENTER,
                });
                this.props.navigation.push('Login');
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
              //console.log('error = ', error);
            });
          });
      } else {
        const url = config.baseUrl2 + 'staff/RegisterMPIN';
        //console.log(url);
        fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.state.Token,
          },
          body: JSON.stringify({
            mpin: this.state.Mpin,
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            //console.log(responseJson);
            //alert(JSON.stringify(responseJson));
            if (responseJson && responseJson.status == true) {
              this.setState({Loader: false}, function () {
                //this.storeData('mPin', this.state.Mpin);
                Toast.showSuccess(responseJson.message, {
                  duration: 50,
                  position: Toast.position.CENTER,
                });
                this.props.navigation.push('Login');
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
              //console.log('error = ', error);
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
          <View style={styles.mainContainer}>
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
            <View
              style={[
                styles.ImageConatiner,
                {height: '25%', justifyContent: 'flex-start'},
              ]}>
              <AuthFastImage
                source={require('../assets/genrateOtp.png')}
                resizeMode={'contain'}
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
              Enter M-PIN
            </Text>
            <View
              style={[styles.emailOuter, {height: 80, alignSelf: 'center'}]}>
              {/*<CodeField
                {...this.props}
                value={this.state.Mpin}
                onChangeText={(text) =>
                  this.setState({Mpin: text}, function () {
                    if (this.state.Mpin.length == 4) {
                      this.secondTextInput.focus();
                    }
                    if (
                      this.state.ConfirmMpin.length == 4 &&
                      this.state.Mpin.length == 4
                    ) {
                      this.setState({Loader: true}, function () {
                        this.submit();
                      });
                    }
                  })
                }
                cellCount={4}
                autoFocus={true}
                returnKeyType="done"
                rootStyle={styles.codeFieldRoot}
                onSubmitEditing={() => {
                  this.secondTextInput.focus();
                }}
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
                value={this.state.Mpin}
                onChange={(text) => {
                  this.setState({Mpin: text}, function () {
                    if (this.state.Mpin.length == 4) {
                      //this.secondTextInput.focus();
                      this.setState({Show: true});
                    }
                    if (
                      this.state.ConfirmMpin.length == 4 &&
                      this.state.Mpin.length == 4
                    ) {
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
                value={this.state.Mpin}
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
                  this.setState({Mpin: text}, function () {
                    if (this.state.Mpin.length == 4) {
                      //this.secondTextInput.focus();
                      this.setState({Show: true});
                    }
                    if (
                      this.state.ConfirmMpin.length == 4 &&
                      this.state.Mpin.length == 4
                    ) {
                      this.setState({Loader: true}, function () {
                        this.submit();
                      });
                    }
                  });
                }}
              />*/}
            </View>
            {this.state.Show ? (
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
                Re-Enter M-PIN
              </Text>
            ) : null}
            {this.state.Show ? (
              <View
                style={[
                  styles.emailOuter,
                  {marginBottom: 40, height: 80, alignSelf: 'center'},
                ]}>
                {/*<CodeField
                {...this.props}
                ref={(input) => {
                  this.secondTextInput = input;
                }}
                autoFocus={this.state.Mpin.length == 4 ? true : false}
                value={this.state.ConfirmMpin}
                onChangeText={(text) =>
                  this.setState({ConfirmMpin: text}, function () {
                    if (
                      this.state.ConfirmMpin.length == 4 &&
                      this.state.Mpin.length == 4
                    ) {
                      this.setState({Loader: true}, function () {
                        this.submit();
                      });
                    }
                  })
                }
                cellCount={4}
                returnKeyType="done"
                blurOnSubmit={true}
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
                  value={this.state.ConfirmMpin}
                  onChange={(text) => {
                    this.setState({ConfirmMpin: text}, function () {
                      if (
                        this.state.ConfirmMpin.length == 4 &&
                        this.state.Mpin.length == 4
                      ) {
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
                  ref={(input) => {
                    this.secondTextInput = input;
                  }}
                  value={this.state.Mpin}
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
                    this.setState({ConfirmMpin: text}, function () {
                      if (
                        this.state.ConfirmMpin.length == 4 &&
                        this.state.Mpin.length == 4
                      ) {
                        this.setState({Loader: true}, function () {
                          this.submit();
                        });
                      }
                    });
                  }}
                />*/}
              </View>
            ) : null}
            <CustomButton
              title="REGISTER"
              onPress={() => {
                this.setState({Loader: true}, function () {
                  this.submit();
                });
              }}
            />
          </View>
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
  ////console.log("dispatch====" + dispatch);
  return {
    loginDetail: (key) => dispatch(loginDetail(key)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SetMpin);
