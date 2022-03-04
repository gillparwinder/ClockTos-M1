import React, {Component} from 'react';
import {SafeAreaView} from 'react-native';
import {Text, View, TouchableOpacity, Dimensions} from 'react-native';
import Toast from 'react-native-tiny-toast';
import {Loader} from '../components/Loader';
import config from '../config/config';
import ResponsiveSize from '../config/ResponsiveSize';
import {loginDetail} from '../actions/Detail';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Alert} from 'react-native';
import {styles} from './style';
import {CustomButton} from '../components/common/Button';
import {BackHandler} from 'react-native';
import AuthFastImage from './AuthFastImage';
import MultipleStudentAlert from './MultipleStudentAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ScreenHeight = Dimensions.get('window').height;
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};
class GetProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      staffCode: this.props.route.params
        ? this.props.route.params.staffCode
          ? this.props.route.params.staffCode
          : ''
        : '',
      applicationNo: this.props.route.params
        ? this.props.route.params.applicationNo
          ? this.props.route.params.applicationNo
          : ''
        : '',
      HashKey: this.props.route.params
        ? this.props.route.params.hashKey
          ? this.props.route.params.hashKey
          : ''
        : '',
      ShowInstituteCode: false,
      applicationNo: '',
      Loader: true,
      Email: '',
      secureTextEntry: true,
      ModalVisible: false,
      StudentArr: [
        {
          applicationNo: 'string',
          stud_name: 'string',
          reg_no: 'string',
          roll_no: '0',
        },
        //{
        //  applicationNo: 'string',
        //  stud_name: 'string',
        //  reg_no: 'string',
        //  roll_no: '1',
        //},
        //{
        //  applicationNo: 'string',
        //  stud_name: 'string',
        //  reg_no: 'string',
        //  roll_no: '2',
        //},
      ],
    };
  }
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
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
    ////console.log(this.props.route.params);
    this.props.route.params.isStudent
      ? this.onLoadGetDataByProfile()
      : this.onLoadGetStaffProfile();
  }
  componentWillUnmount() {
    this.backHandler.remove();
  }
  handleBackPress = () => {
    this.props.navigation.goBack(null);
    return true;
  };

  onLoadGetDataByProfile = () => {
    const url = config.baseUrl + 'usermanagment/StudentInfoByMobileNumber';
    console.log(url);
    //console.log(
    //  JSON.stringify({
    //    instituteCode: this.state.InstituteCode,
    //    emailId: this.state.Email,
    //    mobileNumber: this.state.Mobile,
    //  }),
    //);
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
        console.log(responseJson);
        if (responseJson.status == true) {
          this.setState(
            {
              Loader: false,
              isValidUser: true,
              CollegeData: responseJson.collegeInfo,
              StudentData: responseJson.studentInfo,
            },
            () => {
              //this.storeData(
              //  'collegeImage',
              //  responseJson?.collegeInfo?.banner || '',
              //);
            },
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
      .catch((err) => {
        console.log(err);
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
    console.log(url);
    console.log(
      JSON.stringify({
        instituteCode: this.state.InstituteCode,
        staffCode: this.state.staffCode,
        //instituteCode: 'SPUNI001',
        //staffCode: '1123',
      }),
    );
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
        if (responseJson) {
          this.setState(
            {
              Loader: false,
              staffData: responseJson,
              staffCode: responseJson.staffCode,
            },
            function () {},
          );
        }
      })
      .catch((error) => {
        this.setState({Loader: false}, function () {
          console.log(error);
          alert(error);
        });
      });
  };
  onLoadGetMultipleStudent = () => {
    const url = config.baseUrl + 'usermanagment/MultiUserLogin';
    console.log(url);
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        //'Authorization': 'Bearer ' + this.state.Token
      },
      body: JSON.stringify({
        //appNo: '0',
        //mpin: '0000',
        mobileNumber: this.state.Mobile,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //console.log(responseJson);
        if (responseJson) {
          this.setState(
            {
              Loader: false,
              //StudentArr:responseJson
            },
            function () {
              if (this.state.StudentArr.length > 1) {
                this.setState({ModalVisible: true});
              } else {
                this.setState(
                  {
                    applicationNo: this.state.StudentArr[0].applicationNo,
                    Loader: true,
                  },
                  () => {
                    this.onLoadGetDataByProfile();
                  },
                );
              }
            },
          );
        }
      })
      .catch((error) => {
        this.setState({Loader: false}, function () {
          //console.log(error);
          alert(error);
        });
      });
  };

  submit = () => {
    var phoneno = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    if (this.state.Mobile == '') {
      this.setState({Loader: false}, function () {
        Toast.show('Mobile number required', ToastData);
      });
    } else if (this.state.Mobile.match(phoneno) == null) {
      this.setState({Loader: false}, function () {
        Toast.show('Enter valid Mobile number', ToastData);
      });
    } else {
      if (this.state.isStudent) {
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
            ////console.log(responseJson);
            alert(JSON.stringify('Student Otp is ' + responseJson.message));
            if (responseJson && responseJson.status == true) {
              this.setState({Loader: false}, function () {
                this.props.navigation.navigate('Otp', {
                  instituteCode: this.state.InstituteCode,
                  emailId: this.state.Email,
                  mobileNumber: this.state.Mobile,
                  hashKey: this.state.HashKey,
                  isStudent: true,
                });
                //this.props.loginDetail(responseJson);
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
        //console.log(url);
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
            //console.log('staff response===', responseJson);
            alert(JSON.stringify('Staff Otp is ' + responseJson.message));
            if (responseJson && responseJson.status == true) {
              this.setState({Loader: false}, function () {
                this.props.navigation.navigate('Otp', {
                  instituteCode: this.state.InstituteCode,
                  emailId: this.state.staffData.email,
                  mobileNumber: this.state.Mobile,
                  hashKey: this.state.HashKey,
                  staffCode: this.state.staffCode,
                  isStudent: false,
                });
                //this.props.loginDetail(responseJson);
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
  dismiss = () => {
    this.setState({ModalVisible: false});
  };
  render() {
    return (
      <KeyboardAwareScrollView
        resetScrollToCoords={{x: 0, y: 0}}
        contentContainerStyle={{
          height: ScreenHeight,
          display: 'flex',
          paddingBottom: 20,
        }}
        scrollEnabled={true}>
        <Loader
          Loading={this.state.Loader ? true : false}
          onPressCancel={() => {
            this.setState({Loader: false});
          }}
        />
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
          <View style={[styles.ImageConatiner, {height: '50%'}]}>
            <View
              style={{
                width: '100%',
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'flex-end',
                height: '50%',
                alignSelf: 'flex-end',
                zIndex: 2,
              }}>
              {this.state.CollegeData && this.state.CollegeData.banner && (
                <AuthFastImage
                  source={`data:image/jpeg;base64,${this.state.CollegeData.banner}`}
                  resizeMode={'contain'}
                  style={{
                    width: '100%',
                    height: 100,
                    marginBottom: 20,
                  }}
                />
              )}
              <Text
                style={[
                  styles.title,
                  {
                    color: 'black',
                    fontSize: ResponsiveSize(config.AppAllHeaderSize),
                    lineHeight: 30,
                  },
                ]}>
                {this.state.CollegeData ? 'Welcome to' : ''}
              </Text>
              <Text
                numberOfLines={3}
                style={[
                  styles.title,
                  {
                    color: 'black',
                    fontSize: ResponsiveSize(config.textSize),
                    textAlign: 'center',
                    width: '70%',
                  },
                ]}>
                {this.state.CollegeData
                  ? this.state.CollegeData.university
                    ? this.state.CollegeData.university
                    : ''
                  : ''}
              </Text>
            </View>
            <AuthFastImage
              source={require('../assets/getProfilePic.png')}
              resizeMode={'stretch'}
              style={{width: '100%', height: '100%'}}
            />
          </View>
          {this.state.isStudent ? (
            <View style={styles.emailConatiner2}>
              <View>
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    color: 'white',
                    marginVertical: 20,
                    fontWeight: '600',
                    fontSize: ResponsiveSize(config.textSize),
                  }}>
                  Your Profile
                </Text>
                <View
                  style={{
                    width: '80%',
                    height: 55,
                    justifyContent: 'space-between',
                    //marginTop: 20,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Poppins-Regular',
                      color: 'black',
                      fontSize: ResponsiveSize(config.AppAllHeaderSize),
                    }}>
                    Student name
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Poppins-Regular',
                      color: 'white',
                      fontSize: ResponsiveSize(config.AppAllTextSize),
                      fontWeight: '600',
                    }}>
                    {this.state.StudentData ? this.state.StudentData.name : ''}
                  </Text>
                </View>
                <View style={styles.emailOuter2}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.title}>Batch year</Text>
                    <Text style={styles.titleData}>
                      {this.state.StudentData
                        ? this.state.StudentData.batchYear
                        : ''}
                    </Text>
                  </View>
                  <View style={[styles.titleContainer, {paddingLeft: 30}]}>
                    <Text style={styles.title}>Degree</Text>
                    <Text style={styles.titleData}>
                      {this.state.StudentData
                        ? this.state.StudentData.courseName
                        : ''}
                    </Text>
                  </View>
                </View>
                <View style={styles.emailOuter2}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.title}>Registration number</Text>
                    <Text style={styles.titleData}>
                      {this.state.StudentData
                        ? this.state.StudentData.rollNo
                        : ''}
                    </Text>
                  </View>
                  <View style={[styles.titleContainer, {paddingLeft: 30}]}>
                    <Text style={styles.title}>Semester</Text>
                    <Text style={styles.titleData}>
                      {this.state.StudentData
                        ? this.state.StudentData.currentSemester
                        : ''}
                    </Text>
                  </View>
                </View>
              </View>
              <CustomButton
                title="Generate OTP"
                onPress={() => {
                  this.setState({Loader: true}, function () {
                    this.submit();
                  });
                }}
              />
            </View>
          ) : (
            <View style={styles.emailConatiner2}>
              <View>
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    color: 'white',
                    marginVertical: 5,
                    fontWeight: '600',
                    fontSize: ResponsiveSize(config.textSize),
                  }}>
                  Your Profile
                </Text>

                <View style={styles.emailOuter2}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.title}>Staff Name</Text>
                    <Text style={styles.titleData}>
                      {this.state.staffData
                        ? this.state.staffData.staffName
                        : ''}
                    </Text>
                  </View>
                  <View style={[styles.titleContainer, {paddingLeft: 30}]}>
                    <Text style={styles.title}>Staff Code</Text>
                    <Text style={styles.titleData}>
                      {this.state.staffData
                        ? this.state.staffData.staffCode
                        : ''}
                    </Text>
                  </View>
                </View>
                <View style={styles.emailOuter2}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.title}>Deparment Name</Text>
                    <Text numberOfLines={2} style={styles.titleData}>
                      {this.state.staffData
                        ? this.state.staffData.deparmentName
                        : ''}
                    </Text>
                  </View>
                  <View style={[styles.titleContainer, {paddingLeft: 30}]}>
                    <Text style={styles.title}>Designation</Text>
                    <Text numberOfLines={2} style={styles.titleData}>
                      {this.state.staffData
                        ? this.state.staffData.desigName
                        : ''}
                    </Text>
                  </View>
                </View>
                <View style={styles.emailOuter2}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.title}>Category</Text>
                    <Text style={styles.titleData}>
                      {this.state.staffData
                        ? this.state.staffData.categoryName
                        : ''}
                    </Text>
                  </View>
                  <View
                    style={[styles.titleContainer, {paddingLeft: 30}]}></View>
                </View>
              </View>
              <CustomButton
                title="Generate OTP"
                onPress={() => {
                  this.setState({Loader: true}, function () {
                    this.submit();
                  });
                }}
              />
            </View>
          )}
          <View
            style={{
              width: '100%',
              height: '5%',
              backgroundColor: config.SubThemeColor,
            }}
          />
        </SafeAreaView>
        <MultipleStudentAlert
          Arr={this.state.StudentArr}
          dismiss={this.dismiss}
          onPress={(applicationNo) => {
            this.setState(
              {Loader: true, ModalVisible: false, applicationNo},
              function () {
                this.onLoadGetDataByProfile();
              },
            );
          }}
          ModalVisible={this.state.ModalVisible}
        />
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = () => {
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

export default connect(mapStateToProps, mapDispatchToProps)(GetProfile);
