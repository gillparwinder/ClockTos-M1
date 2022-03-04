import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {ScrollView} from 'react-native';
import {BackHandler} from 'react-native';
import {Image} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {SafeAreaView, StyleSheet, TextInput} from 'react-native';
import {View, Text} from 'react-native';
import config from '../../config/config';
import {CustomHeader} from '../CustomHeader';
import * as Animatable from 'react-native-animatable';
import {Loader} from '../Loader';
import ResponsiveSize from '../../config/ResponsiveSize';
import {Checkbox} from 'react-native-paper';
import {CustomButton} from '../common/Button';
import Toast from 'react-native-tiny-toast';
import {AnimatedCheckBox} from '../common/AnimatedCheckBox';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Dimensions} from 'react-native';
import {ActivityIndicator} from 'react-native';
import {
  NativeEventEmitter,
  PermissionsAndroid,
  Switch,
  Alert,
  NativeModules,
  Button,
} from 'react-native';
import {sha512} from 'js-sha512';
//const {PayUBizSdk} = NativeModules;
import moment from 'moment';
import PickerElement from '../../face/components/Picker';
import MultiSelect from 'react-native-multiple-select';
import {widthPercentageToDP} from 'react-native-responsive-screen';
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};
export default class PayOnline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Loader: true,
      subTitle: this.props.route.params
        ? this.props.route.params.subTitle
          ? this.props.route.params.subTitle
          : ''
        : '',
      Date: new Date(),
      Loader3: false,
      selectedValue: '',
      LoadFeeSemester: [],
      SelectedFees: [],
      GetStudentOnlineFees: [],
      GetOnlinePaymentGateway: [],
      GetOnlinePaymentQuery: [],
      Token: '',
      SelectedPaymentGetway: '',
      Title: this.props.route.params
        ? this.props.route.params.title
          ? this.props.route.params.title
          : ''
        : '',

      key: '',
      Salt: '',
      amount: '10',
      productInfo: 'product_info',
      firstName: 'firstname',
      email: 'test@gmail.com',
      phone: '9999999999',
      ios_surl: 'https://payu.herokuapp.com/ios_success',
      ios_furl: 'https://payu.herokuapp.com/ios_failure',
      android_surl: 'https://payu.herokuapp.com/success',
      android_furl: 'https://payu.herokuapp.com/failure',
      environment: 0 + '',
      udf1: 'udf1',
      udf2: 'udf2',
      udf3: 'udf3',
      udf4: 'udf4',
      udf5: 'udf5',
      merchantSalt: 'g0nGFe03',
      userCredential: 'umang:arya',
      primaryColor: '#aabbcc',
      secondaryColor: '#000000',
      //Need to check how we can set default Value in textField from state
      merchantName: 'Rashan vala',
      merchantLogo: 'Jio',
      showExitConfirmationOnCheckoutScreen: true,
      showExitConfirmationOnPaymentScreen: true,
      cartDetails: [{Order: 'Value'}, {'Key Name': 'Value1'}],
      paymentModesOrder: [{UPI: 'TEZ'}, {Cards: 'PAYTM'}, {EMI: ''}],
      surePayCount: 1,
      merchantResponseTimeout: 10000,
      autoSelectOtp: true,
      // Android specific property
      showCbToolbar: true,
      autoApprove: true,
      merchantSMSPermission: true,

      showAlert: false,
    };
  }
  //displayAlert = (title, value) => {
  //  if (this.state.showAlert == false) {
  //    //console.log('displayAlert ' + title + ' ' + value);
  //    this.setState({showAlert: true}, () => Alert.alert(title, value));
  //  }
  //  this.state.showAlert = false;
  //};
  //toggleAutoApproveOTP = (value) => {
  //  this.setState({autoApprove: value});
  //};
  //toggleSelectOTP = (value) => {
  //  this.setState({autoSelectOtp: value});
  //};
  //toggleViewPort = (value) => {
  //  this.setState({viewPortWideEnable: value});
  //};
  //togglePermission = (value) => {
  //  this.setState({merchantSMSPermission: value});
  //  this.requestSMSPermission();
  //};

  //requestSMSPermission = async () => {
  //  try {
  //    const granted = await PermissionsAndroid.request(
  //      PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
  //      {
  //        title: 'Sample App SMS Permission',
  //        message:
  //          'Clocktos App needs access to your sms to autofill OTP on Bank Pages ',
  //        buttonNeutral: 'Ask Me Later',
  //        buttonNegative: 'Cancel',
  //        buttonPositive: 'OK',
  //      },
  //    );
  //    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //      //console.log('You can use the camera');
  //    } else {
  //      //console.log('Camera permission denied');
  //    }
  //  } catch (err) {
  //    console.warn(err);
  //  }
  //};
  //onPaymentSuccess = (e) => {
  //  //console.log(e.merchantResponse);
  //  //console.log(e.payuResponse);
  //  this.displayAlert('onPaymentSuccess', JSON.stringify(e));
  //};
  //onPaymentFailure = (e) => {
  //  //console.log(e);
  //  //console.log(e.merchantResponse);
  //  //console.log(e.payuResponse);
  //  this.displayAlert('onPaymentFailure', JSON.stringify(e));
  //};
  //onPaymentCancel = (e) => {
  //  //console.log('onPaymentCancel isTxnInitiated -' + e);
  //  this.displayAlert('onPaymentCancel', JSON.stringify(e));
  //};
  //onError = (e) => {
  //  //console.log(e);
  //  this.displayAlert('onError', JSON.stringify(e));
  //};
  //generateHash = (e) => {
  //  //console.log(e.hashName);
  //  //console.log(e.hashString);
  //  this.sendBackHash(e.hashName, e.hashString + this.state.merchantSalt);
  //};
  componentDidMount() {
    //console.log('Payonline screen');
    this.retrieveData();
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );

    //const eventEmitter = new NativeEventEmitter(PayUBizSdk);

    //this.iOSOnPaymentSuccess = eventEmitter.addListener(
    //  'onPaymentSuccess',
    //  this.onPaymentSuccess,
    //);
    //this.iOSOnPaymentFailure = eventEmitter.addListener(
    //  'onPaymentFailure',
    //  this.onPaymentFailure,
    //);
    //this.iOSOnPaymentCancel = eventEmitter.addListener(
    //  'onPaymentCancel',
    //  this.onPaymentCancel,
    //);
    //this.iOSOnError = eventEmitter.addListener('onError', this.onError);
    //this.iOSGenerateHash = eventEmitter.addListener(
    //  'generateHash',
    //  this.generateHash,
    //);
  }
  componentWillUnmount() {
    this.backHandler.remove();

    //this.iOSOnPaymentSuccess.remove();
    //this.iOSOnPaymentFailure.remove();
    //this.iOSOnPaymentCancel.remove();
    //this.iOSOnError.remove();
    //this.iOSGenerateHash.remove();
  }
  //createPaymentParams = () => {
  //  let tempName = this.state.SelectedFees;
  //  let finalName = [];
  //  tempName.map((item) => {
  //    finalName.push(item.name);
  //  });
  //  let tempKey = this.state.GetOnlinePaymentQuery;
  //  let finalKey = [];
  //  tempKey.map((item) => {
  //    finalKey.push(item.key);
  //  });
  //  this.setState({key: finalKey[0]});
  //  //console.log('key = ', JSON.stringify(this.state.key));
  //  let finalSalt = [];
  //  tempKey.map((item) => {
  //    finalSalt.push(item.salt);
  //  });
  //  this.setState({Salt: finalSalt[0]});
  //  //console.log('Salt = ', JSON.stringify(this.state.Salt));

  //  const TotalAmount = this.state.SelectedFees.reduce(
  //    (total, currentValue) => (total = total + currentValue.feeAmount),
  //    0,
  //  );
  //  var txnid = new Date().getTime().toString();
  //  var paymentHash = this.calculateHash(
  //    this.state.key +
  //      '|' +
  //      txnid +
  //      '|' +
  //      TotalAmount.toString() +
  //      '|' +
  //      this.state.productInfo +
  //      '|' +
  //      this.state.merchantName +
  //      '|' +
  //      this.state.email +
  //      '|' +
  //      this.state.udf1 +
  //      '|' +
  //      this.state.udf2 +
  //      '|' +
  //      this.state.udf3 +
  //      '|' +
  //      this.state.udf4 +
  //      '|' +
  //      this.state.udf5 +
  //      '||||||' +
  //      this.state.Salt,
  //  );
  //  var vasHash = this.calculateHash(
  //    this.state.key +
  //      '|vas_for_mobile_sdk|' +
  //      'default' +
  //      '|' +
  //      this.state.Salt,
  //  );
  //  var paymentDetailsHash = this.calculateHash(
  //    this.state.key +
  //      '|payment_related_details_for_mobile_sdk|' +
  //      this.state.userCredential +
  //      '|' +
  //      this.state.Salt,
  //  );

  //  var payUPaymentParams = {
  //    key: this.state.key,
  //    transactionId: txnid,
  //    amount: TotalAmount.toString(),
  //    productInfo: this.state.productInfo,
  //    firstName: this.state.merchantName,
  //    //firstName: this.state.firstName,
  //    email: this.state.email,
  //    phone: this.state.phone,
  //    ios_surl: this.state.ios_surl,
  //    ios_furl: this.state.ios_furl,
  //    android_surl: this.state.android_surl,
  //    android_furl: this.state.android_furl,
  //    environment: this.state.environment,
  //    userCredential: this.state.userCredential,
  //    additionalParam: {
  //      udf1: this.state.udf1,
  //      udf2: this.state.udf2,
  //      udf3: this.state.udf3,
  //      udf4: this.state.udf4,
  //      udf5: this.state.udf5,
  //      // payment_related_details_for_mobile_sdk: paymentDetailsHash,
  //      // vas_for_mobile_sdk: vasHash,
  //      // payment: paymentHash
  //    },
  //  };

  //  var payUCheckoutProConfig = {
  //    primaryColor: this.state.primaryColor,
  //    secondaryColor: this.state.secondaryColor,
  //    merchantName: this.state.merchantName,
  //    //merchantName: finalName,
  //    merchantLogo: this.state.merchantLogo,
  //    showExitConfirmationOnCheckoutScreen: this.state
  //      .showExitConfirmationOnCheckoutScreen,
  //    showExitConfirmationOnPaymentScreen: this.state
  //      .showExitConfirmationOnPaymentScreen,
  //    cartDetails: this.state.cartDetails,
  //    paymentModesOrder: this.state.paymentModesOrder,
  //    surePayCount: this.state.surePayCount,
  //    merchantResponseTimeout: this.state.merchantResponseTimeout,
  //    autoSelectOtp: this.state.autoSelectOtp,
  //    // Android specific property
  //    autoApprove: this.state.autoApprove,
  //    merchantSMSPermission: this.state.merchantSMSPermission,
  //    showCbToolbar: this.showCbToolbar,
  //  };
  //  return {
  //    payUPaymentParams: payUPaymentParams,
  //    payUCheckoutProConfig: payUCheckoutProConfig,
  //  };
  //};
  //Used to send back hash generated to SDK
  //sendBackHash = (hashName, hashData) => {
  //  //console.log(hashName);
  //  var hashValue = this.calculateHash(hashData);
  //  var result = {[hashName]: hashValue};
  //  //console.log(result);
  //  PayUBizSdk.hashGenerated(result);
  //};
  //calculateHash = (data) => {
  //  //console.log(data);
  //  var result = sha512(data);
  //  //console.log(result);
  //  return result;
  //};
  //paymentModes = () => {
  //  //let Date = this.state.Date;
  //  //let TransactionId =
  //  //  moment(Date).format('ddMMyyy') + moment(Date).format('HHMMss');
  //  ////console.log(TransactionId);
  //  //console.log('Method launched amount =' + this.state.TotalAmount);
  //  ////console.log('Method launched amount =' + this.state.amount);
  //  PayUBizSdk.openCheckoutScreen(this.createPaymentParams());
  //};

  handleBackPress = () => {
    this.props.navigation.goBack(null);
    return true;
  };
  retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        //alert(value)
        //console.log(value);
        this.setState({Token: value}, function () {});
      }
    } catch (error) {
      alert('Error retrieving data');
    }
    try {
      const value = await AsyncStorage.getItem('collegeCode');
      //alert(value);
      if (value !== null) {
        this.setState({collegeCode: parseInt(value)}, function () {
          //console.log('collegeCode = ', value);
          this.onLoadGetLoadFeeSemester();
          this.onPressGetOnlinePaymentGateway();
          this.onLoadGetOnlinePaymentQuery();
        });
      } else {
        this.setState({Loader: false});
        Toast.show(
          'Unable To Fetch College Code! Please Login Again',
          ToastData,
        );
      }
    } catch (error) {
      //console.log(error);
      alert('Error retrieving data');
    }
    try {
      const value = await AsyncStorage.getItem('email');
      //console.log('email = ', value);
      if (value !== null) {
        //alert(value);
        this.setState({email: value}, function () {});
      }
    } catch (error) {
      alert('Error retrieving data');
    }
    try {
      const value = await AsyncStorage.getItem('name');
      if (value !== null) {
        //alert(value);
        this.setState({name: value}, function () {});
      }
    } catch (error) {
      alert('Error retrieving data');
    }
    try {
      const value = await AsyncStorage.getItem('mobile');
      if (value !== null) {
        //alert(value);
        this.setState({mobile: value}, function () {});
      }
    } catch (error) {
      alert('Error retrieving data');
    }

    try {
      const value = await AsyncStorage.getItem('rollNo');
      if (value !== null) {
        //alert(value);
        //console.log('rollno = ', value);
        this.setState({rollNo: value.toString()}, function () {});
      }
    } catch (error) {
      alert('Error retrieving data');
    }
    try {
      const value = await AsyncStorage.getItem('sem');
      if (value !== null) {
        //alert(value);
        this.setState({sem: parseInt(value)}, function () {
          //  this.onLoadGetStudentFeedbackBasedOnSem();
        });
      }
    } catch (error) {
      alert('Error retrieving data');
    }
    try {
      const value = await AsyncStorage.getItem('applicationNo');
      if (value !== null) {
        //alert(value);
        //console.log('applicationNo = ', value);
        this.setState({appNo: value}, function () {
          //  this.onLoadGetStudentFeedbackBasedOnSem();
        });
      }
    } catch (error) {
      alert('Error retrieving data');
    }
  };
  onLoadGetOnlinePaymentQuery = () => {
    const url = config.baseUrl + 'student/GetOnlinePaymentQuery';
    //console.log(url);
    //console.log(
    //  JSON.stringify({
    //    collegeCode: this.state.collegeCode,
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
        collegeCode: this.state.collegeCode,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //console.log('GetOnlinePaymentQuery = ' + JSON.stringify(responseJson));
        if (responseJson) {
          //console.log('salt = ', responseJson);
          this.setState(
            {
              Loader: false,
              GetOnlinePaymentQuery: responseJson,
            },
            function () {
              //this.setState({Key: '3TnMpV', Salt: 'g0nGFe03'});
            },
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
          //console.log(error);
          alert(error);
        });
      });
  };
  onLoadGetLoadFeeSemester = () => {
    const url = config.baseUrl + 'student/LoadFeeSemester';
    console.log(url);
    //console.log(
    //  JSON.stringify({
    //    collegeCode: this.state.collegeCode,
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
        collegeCode: this.state.collegeCode,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('LoadFeeSemester = ' + JSON.stringify(responseJson));
        if (responseJson.length) {
          let newArr = [];
          responseJson.map((item) => {
            newArr.push({id: item.textCode, name: item.semester});
          });
          this.setState({Loader: false, LoadFeeSemester: newArr}, function () {
            alert(JSON.stringify(this.state.LoadFeeSemester));
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
          //console.log(error);
          alert(error);
        });
      });
  };
  onLoadGetReceiptNo = () => {
    const url = config.baseUrl + 'student/GetReceiptNo';
    //console.log(url);
    //console.log(
    //  JSON.stringify({
    //    collegeCode: this.state.collegeCode,
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
        collegeCode: this.state.collegeCode,
        headerFK: 'headerFK',
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //console.log('GetReceiptNo = ' + JSON.stringify(responseJson));
        if (responseJson) {
          this.setState({Loader: false}, function () {
            alert(responseJson.message);
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
          //console.log(error);
          alert(error);
        });
      });
  };
  onLoadGePartAmountChecking = () => {
    const url = config.baseUrl + 'student/GePartAmountChecking';
    //console.log(url);

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.state.Token,
      },
      body: JSON.stringify({
        semYear: this.state.selectedSem,
        headerFK: 'headerFK',
        ledgerFK: 'ledgerFK',
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //console.log('GePartAmountChecking = ' + JSON.stringify(responseJson));
        if (responseJson) {
          this.setState(
            {Loader: false, GePartAmountChecking: responseJson},
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
          //console.log(error);
          alert(error);
        });
      });
  };
  onLoadSaveOnlineFee = () => {
    const url = config.baseUrl + 'student/SaveOnlineFee';
    //console.log(url);

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.state.Token,
      },
      body: JSON.stringify({
        transKey: 'string',
        appNo: 0,
        collegeCode: 0,
        transDate: this.state.Date,
        feecategory: 0,
        payamount: 0,
        month: 0,
        fineflag: 0,
        year: 0,
        paymentmode: 0,
        headerFK: 'headerFK',
        ledgerFK: 'ledgerFK',
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //console.log('SaveOnlineFee = ' + JSON.stringify(responseJson));
        if (responseJson) {
          this.setState(
            {Loader: false, SaveOnlineFee: responseJson},
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
          //console.log(error);
          alert(error);
        });
      });
  };
  onLoadGetStudentOnlineFees = (sem) => {
    this.setState({Loader: true});
    const url = config.baseUrl + 'student/GetStudentOnlineFees';
    //console.log(url);
    //console.log(
    //  JSON.stringify({
    //    semYear: sem,
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
        //semYear: '4',
        semYear: sem,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //console.log('GetStudentOnlineFees = ' + JSON.stringify(responseJson));
        if (responseJson) {
          this.setState(
            {
              Loader: false,
              GetStudentOnlineFees: responseJson,
              //GetStudentOnlineFees: [
              //  {
              //    semester: '1',
              //    header: 'abcd',
              //    name: 'college fee',
              //    feeType: 'string',
              //    total: '10000',
              //    paid: '2000',
              //    balance: '8000',
              //    headerFK: 'qwerty',
              //    ledgerFK: 'ytrewq',
              //    priority: 'string',
              //    feeAmount: 8000,
              //    deductAmount: 'string',
              //    chlTakAmt: 'string',
              //    textCode: 'string',
              //    govt: 'string',
              //    feeallotpk: 'string',
              //    atomProductId: 'string',
              //  },
              //  {
              //    semester: '2',
              //    header: 'abcd',
              //    name: 'college election fee',
              //    feeType: 'string',
              //    total: '20000',
              //    paid: '2000',
              //    balance: '18000',
              //    headerFK: 'qwerty',
              //    ledgerFK: 'ytrewq',
              //    priority: 'string',
              //    feeAmount: 18000,
              //    deductAmount: 'string',
              //    chlTakAmt: 'string',
              //    textCode: 'string',
              //    govt: 'string',
              //    feeallotpk: 'string',
              //    atomProductId: 'string',
              //  },
              //  {
              //    semester: '3',
              //    header: 'abcd',
              //    name: 'college fee',
              //    feeType: 'string',
              //    total: '10000',
              //    paid: '2000',
              //    balance: '8000',
              //    headerFK: 'qwerty',
              //    ledgerFK: 'ytrewq',
              //    priority: 'string',
              //    feeAmount: 8000,
              //    deductAmount: 'string',
              //    chlTakAmt: 'string',
              //    textCode: 'string',
              //    govt: 'string',
              //    feeallotpk: 'string',
              //    atomProductId: 'string',
              //  },
              //],
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
        this.setState({Loader: false}, function () {
          //console.log(error);
          alert(error);
        });
      });
  };
  onPressGetOnlinePaymentGateway = (sem) => {
    this.setState({Loader3: true});
    const url = config.baseUrl + 'student/GetOnlinePaymentGateway';
    //console.log(url);
    //console.log(
    //  JSON.stringify({
    //    college_code: this.state.collegeCode,
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
        college_code: this.state.collegeCode,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //console.log(
        //  'GetOnlinePaymentGateway = ' + JSON.stringify(responseJson),
        //);
        if (responseJson) {
          this.setState(
            {
              Loader3: false,
              Loader: false,
              GetOnlinePaymentGateway: responseJson,
            },
            function () {
              //responseJson.map((item, index) => {
              //  return item.bank == 'PayUBiz'
              //    ? this.paymentModes(item.bank)
              //    : Toast.show('Other payment mode selected');
              //});
              //this.props.navigation.navigate('Payment', {
              //  subTitle: 'Pay Online',
              //  title: 'Payment ',
              //  SelectedFees: this.state.SelectedFees,
              //});
            },
          );
        } else {
          this.setState({Loader3: false, Loader: false}, function () {
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
        this.setState({Loader3: false, Loader: false}, function () {
          //console.log('error = ', error);
          alert(error);
        });
      });
  };

  render() {
    return (
      <SafeAreaView
        style={{width: '100%', height: '100%', backgroundColor: 'white'}}>
        <Loader
          Loading={this.state.Loader ? true : false}
          onPressCancel={() => {
            this.setState({Loader: false});
          }}
        />
        <CustomHeader
          isHome={false}
          title={'Pay Online'}
          navigation={this.props.navigation}
        />
        <View style={{width: '100%', flex: 1}}>
          <Text
            numberOfLines={2}
            style={[
              styles.MainTitle,
              {
                color: '#8075EA',
                //  : '#5289E6',
                padding: 10,
                alignSelf: 'center',
                fontSize: ResponsiveSize(config.AppAllHeaderSize),
              },
            ]}>
            Total Dues 500000
          </Text>
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              justifyContent: 'space-evenly',
              flexDirection: 'row',
              marginVertical: 10,
              alignItems: 'center',
              //backgroundColor: 'red',
            }}>
            <PickerElement
              uniqueKey={'semester'}
              title={'Semester'}
              placeholder={'Semester'}
              width={150}
              style={[styles.item]}
              options={items}
              //options={this.state.LoadFeeSemester}
              onValueChange={(value) => {
                this.setState({selectedSem: value}, function () {
                  let filterredValue = value.split(' ');
                  let finalFilterredValue = filterredValue[0];
                  //console.log('filterredValue = ', finalFilterredValue);
                  //console.log('value = ', value.split(" "));
                  this.onLoadGetStudentOnlineFees(finalFilterredValue);
                });
              }}
              selectedValue={this.state.selectedSem}
              color={'#8075EA'}
              textColor={'black'}
              single={true}
              hideTags={true}
            />

            {/*<Picker
             //note
             mode="dropdown"
             //placeholder="Semester"
             //placeholderIconColor="#8075EA"
             style={{width: 150}}
             selectedValue={this.state.selectedSem}
             onStartShouldSetResponder={() => {
               //console.log('hit');
             }}
             onValueChange={(value) => {
               this.setState({selectedSem: value}, function () {
                 let filterredValue = value.split(' ');
                 let finalFilterredValue = filterredValue[0];
                 //console.log('filterredValue = ', finalFilterredValue);
                 //console.log('value = ', value.split(" "));
                 this.onLoadGetStudentOnlineFees(finalFilterredValue);
               });
             }}>
             <Picker.Item label="Semester" value="0" />
             {this.state.LoadFeeSemester.map((item) => {
               return (
                 <Picker.Item
                   label={item.semester}
                   value={item.semester}
                   //key={item.textCode}
                 />
               );
             })}
            </Picker>*/}

            <View
              style={{
                //width: '50%',
                //backgroundColor: 'blue',
                alignSelf: 'center',
                //flexDirection: 'row',
              }}>
              <View style={styles.textContainer}>
                <Text style={styles.text}>Amount</Text>
              </View>
              <View
                style={[
                  styles.item,
                  {
                    width: 100,

                    color: '#8075EA',
                  },
                ]}>
                <TextInput
                  style={{
                    width: '100%',
                    borderRadius: 5,
                    height: '40%',
                    borderWidth: 1,
                    borderRadius: 10,
                    paddingHorizontal: 5,
                    backgroundColor: 'white',
                    //fontSize: ResponsiveSize(config.AppAllHeaderSize),
                  }}
                  onChangeText={(text) => {
                    this.setState({Amount: text});
                  }}
                  placeholder="0"
                  value={this.state.Amount}
                  blurOnSubmit={true}
                  keyboardType="numeric"
                  returnKeyType="done"
                />
              </View>
            </View>
          </View>
          <View style={styles.SubjectMainContainer}>
            <KeyboardAwareScrollView
              resetScrollToCoords={{x: 0, y: 0}}
              contentContainerStyle={{
                height: Dimensions.get('window').height,
                display: 'flex',
                //paddingBottom: 20,
              }}
              scrollEnabled={true}>
              {this.state.GetStudentOnlineFees.length ? (
                this.state.GetStudentOnlineFees.map((item, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        let SelectedFees = this.state.SelectedFees;
                        if (SelectedFees.indexOf(item) > -1) {
                          SelectedFees.splice(SelectedFees.indexOf(item), 1);
                        } else {
                          SelectedFees.push(item);
                        }
                        this.setState({SelectedFees}, function () {
                          //console.log(this.state.SelectedFees);
                        });
                      }}
                      //activeOpacity={1}
                      style={[
                        styles.FeedbackView,
                        {
                          backgroundColor:
                            index % 2 == 0 && index % 3 != 0
                              ? '#E9F9FB'
                              : index % 3 == 0
                              ? '#EFEDFB'
                              : '#EFF5FE',
                        },
                      ]}>
                      <View
                        style={{
                          width: '100%',
                          alignItems: 'center',
                          flexDirection: 'row',
                        }}>
                        <View style={{width: '15%', alignItems: 'center'}}>
                          <View
                            style={{
                              width: 35,
                              height: 35,
                              backgroundColor:
                                index % 2 == 0 && index % 3 != 0
                                  ? '#BBE5E9'
                                  : index % 3 == 0
                                  ? '#E7E5F8'
                                  : '#B5CAEF',
                              borderRadius: 35,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={[
                                styles.MainTitle,
                                {
                                  color:
                                    index % 2 == 0 && index % 3 != 0
                                      ? '#2BB9CA'
                                      : index % 3 == 0
                                      ? '#8075EA'
                                      : '#5289E6',
                                  fontSize: 18,
                                  fontWeight: 'bold',
                                },
                              ]}>
                              {index + 1}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            width: '80%',
                            //height: '100%',
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <View style={{width: '85%'}}>
                            <Text
                              numberOfLines={2}
                              style={[
                                styles.MainTitle,
                                {
                                  color:
                                    index % 2 == 0 && index % 3 != 0
                                      ? '#2BB9CA'
                                      : index % 3 == 0
                                      ? '#8075EA'
                                      : '#5289E6',
                                  paddingLeft: 10,
                                  fontSize: ResponsiveSize(
                                    config.AppAllHeaderSize,
                                  ),
                                },
                              ]}>
                              {item.name}
                            </Text>
                          </View>
                          <View style={{width: '20%'}}>
                            <AnimatedCheckBox
                              size={25}
                              disableBuiltInState={true}
                              isChecked={
                                this.state.SelectedFees.indexOf(item) > -1
                                  ? true
                                  : false
                              }
                              fillColor={
                                index % 2 == 0 && index % 3 != 0
                                  ? '#2BB9CA'
                                  : index % 3 == 0
                                  ? '#8075EA'
                                  : '#5289E6'
                              }
                              unfillColor={'white'}
                              //text="Custom Checkbox"
                              iconStyle={{
                                borderRadius: 5,
                                borderColor:
                                  index % 2 == 0 && index % 3 != 0
                                    ? '#2BB9CA'
                                    : index % 3 == 0
                                    ? '#8075EA'
                                    : '#5289E6',
                              }}
                              textStyle={{fontFamily: 'Poppins-Regular'}}
                              onPress={() => {
                                let SelectedFees = this.state.SelectedFees;
                                if (SelectedFees.indexOf(item) > -1) {
                                  SelectedFees.splice(
                                    SelectedFees.indexOf(item),
                                    1,
                                  );
                                } else {
                                  SelectedFees.push(item);
                                }
                                this.setState({SelectedFees}, function () {
                                  //console.log(this.state.SelectedFees);
                                });
                              }}
                            />
                          </View>
                        </View>
                      </View>
                      <Text
                        numberOfLines={2}
                        style={[
                          styles.MainTitle,
                          {
                            color:
                              index % 2 == 0 && index % 3 != 0
                                ? '#2BB9CA'
                                : index % 3 == 0
                                ? '#8075EA'
                                : '#5289E6',
                            padding: 10,
                            fontSize: ResponsiveSize(config.AppAllSubTitle),
                          },
                        ]}>
                        Fee Type :
                        <Text
                          style={{
                            fontSize: ResponsiveSize(config.AppAllHeaderSize),
                            fontWeight: '300',
                            fontFamily: 'Poppins-Regular',
                          }}>
                          {item.feeType}
                        </Text>
                      </Text>
                      <View
                        style={{
                          width: '100%',
                          alignSelf: 'center',
                          alignItems: 'center',
                          flexDirection: 'row',
                          justifyContent: 'space-evenly',
                          borderTopWidth: 0.5,
                          borderTopColor: 'gray',
                        }}>
                        <View style={styles.partition}>
                          <Text
                            numberOfLines={2}
                            style={[
                              styles.MainTitle,
                              {
                                color:
                                  index % 2 == 0 && index % 3 != 0
                                    ? '#2BB9CA'
                                    : index % 3 == 0
                                    ? '#8075EA'
                                    : '#5289E6',
                                fontWeight: '300',
                              },
                            ]}>
                            <Text style={{fontWeight: '300'}}> Total </Text>
                          </Text>
                          <Text
                            numberOfLines={2}
                            style={[
                              styles.MainTitle,
                              {
                                color:
                                  index % 2 == 0 && index % 3 != 0
                                    ? '#2BB9CA'
                                    : index % 3 == 0
                                    ? '#8075EA'
                                    : '#5289E6',
                                lineHeight: 45,
                                fontSize: ResponsiveSize(
                                  config.AppAllHeaderSize,
                                ),
                              },
                            ]}>
                            {item.total}
                          </Text>
                        </View>
                        <View style={styles.partition}>
                          <Text
                            numberOfLines={2}
                            style={[
                              styles.MainTitle,
                              {
                                color:
                                  index % 2 == 0 && index % 3 != 0
                                    ? '#2BB9CA'
                                    : index % 3 == 0
                                    ? '#8075EA'
                                    : '#5289E6',
                                fontWeight: '300',
                              },
                            ]}>
                            <Text style={{fontWeight: '300'}}>Paid</Text>
                          </Text>
                          <Text
                            numberOfLines={2}
                            style={[
                              styles.MainTitle,
                              {
                                color:
                                  index % 2 == 0 && index % 3 != 0
                                    ? '#2BB9CA'
                                    : index % 3 == 0
                                    ? '#8075EA'
                                    : '#5289E6',
                                lineHeight: 45,
                                fontSize: ResponsiveSize(
                                  config.AppAllHeaderSize,
                                ),
                              },
                            ]}>
                            {item.paid}
                          </Text>
                        </View>
                        <View style={styles.partition}>
                          <Text
                            numberOfLines={2}
                            style={[
                              styles.MainTitle,
                              {
                                color:
                                  index % 2 == 0 && index % 3 != 0
                                    ? '#2BB9CA'
                                    : index % 3 == 0
                                    ? '#8075EA'
                                    : '#5289E6',
                                fontWeight: '300',
                              },
                            ]}>
                            <Text style={{fontWeight: '300'}}>Balance</Text>
                          </Text>
                          <Text
                            numberOfLines={2}
                            style={[
                              styles.MainTitle,
                              {
                                color:
                                  index % 2 == 0 && index % 3 != 0
                                    ? '#2BB9CA'
                                    : index % 3 == 0
                                    ? '#8075EA'
                                    : '#5289E6',
                                lineHeight: 45,
                                fontSize: ResponsiveSize(
                                  config.AppAllHeaderSize,
                                ),
                              },
                            ]}>
                            {item.balance}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.partition,
                            {borderRightWidth: 0, width: '30%'},
                          ]}>
                          <Text
                            numberOfLines={2}
                            style={[
                              styles.MainTitle,
                              {
                                color:
                                  index % 2 == 0 && index % 3 != 0
                                    ? '#2BB9CA'
                                    : index % 3 == 0
                                    ? '#8075EA'
                                    : '#5289E6',
                                fontWeight: '300',
                              },
                            ]}>
                            <Text style={{fontWeight: '300'}}>Pay Amount</Text>
                          </Text>

                          <TextInput
                            style={{
                              width: '80%',
                              borderRadius: 5,
                              height: 45,
                              paddingHorizontal: 5,
                              backgroundColor: 'white',
                              fontSize: ResponsiveSize(config.AppAllHeaderSize),
                            }}
                            onSubmitEditing={() => {
                              let SelectedFees = this.state.SelectedFees;

                              SelectedFees.push(item);

                              this.setState({SelectedFees}, function () {
                                //console.log(this.state.SelectedFees);
                              });
                            }}
                            onFocus={() => {
                              let SelectedFees = this.state.SelectedFees;
                              if (SelectedFees.indexOf(item) > -1) {
                                SelectedFees.splice(
                                  SelectedFees.indexOf(item),
                                  1,
                                );
                              } else {
                                //console.log('not selected yet');
                              }
                              this.setState({SelectedFees}, function () {
                                //console.log(this.state.SelectedFees);
                              });
                            }}
                            onChangeText={(text) => {
                              let GetStudentOnlineFees = this.state
                                .GetStudentOnlineFees;
                              this.setState(
                                {EnteredAmount: parseInt(text)},
                                function () {
                                  (GetStudentOnlineFees[
                                    index
                                  ].feeAmount = parseInt(text)),
                                    this.setState({
                                      GetStudentOnlineFees,
                                    });
                                },
                              );
                            }}
                            value={item.feeAmount}
                            blurOnSubmit={true}
                            keyboardType="numeric"
                            returnKeyType="done"
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
              ) : !this.state.Loader ? (
                <Animatable.View
                  key={Math.random()}
                  duration={400}
                  style={{width: '95%', alignSelf: 'center', marginTop: 20}}
                  transition="backgroundColor">
                  <Text style={{fontFamily: 'Poppins-Regular'}}>
                    No Fees Available
                  </Text>
                </Animatable.View>
              ) : null}
            </KeyboardAwareScrollView>
          </View>
          <ScrollView>
            <Text
              style={[
                styles.MainTitle,
                {
                  color: '#8075EA',
                  //  : '#5289E6',
                  paddingLeft: 10,
                  fontSize: ResponsiveSize(config.AppAllHeaderSize),
                },
              ]}>
              Payment Getways
            </Text>
            <View
              style={{
                width: '95%',
                alignSelf: 'center',
                marginVertical: 10,
                alignItems: 'center',
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
              {!this.state.Loader3 &&
              this.state.GetOnlinePaymentGateway.length > 0 ? (
                this.state.GetOnlinePaymentGateway.map((item, index) => {
                  return (
                    <View
                      style={{
                        margin: 5,
                        //width: '100%',
                        justifyContent: 'center',
                      }}>
                      <AnimatedCheckBox
                        size={25}
                        disableBuiltInState={true}
                        isChecked={
                          this.state.SelectedPaymentGetway == item.bank
                            ? true
                            : false
                        }
                        fillColor={
                          index % 2 == 0 && index % 3 != 0
                            ? '#2BB9CA'
                            : index % 3 == 0
                            ? '#8075EA'
                            : '#5289E6'
                        }
                        unfillColor={'white'}
                        text={item.bank}
                        iconStyle={{
                          borderRadius: 5,
                          borderColor:
                            index % 2 == 0 && index % 3 != 0
                              ? '#2BB9CA'
                              : index % 3 == 0
                              ? '#8075EA'
                              : '#5289E6',
                        }}
                        textStyle={{
                          fontFamily: 'Poppins-Regular',
                          color:
                            index % 2 == 0 && index % 3 != 0
                              ? '#2BB9CA'
                              : index % 3 == 0
                              ? '#8075EA'
                              : '#5289E6',
                        }}
                        onPress={() => {
                          this.setState(
                            {SelectedPaymentGetway: item.bank},
                            function () {
                              //console.log(this.state.SelectedPaymentGetway);
                            },
                          );
                        }}
                      />
                    </View>
                  );
                })
              ) : (
                <ActivityIndicator />
              )}
            </View>
          </ScrollView>
          <View style={{width: '100%', marginVertical: 10}}>
            <CustomButton
              width={'50%'}
              title="Make Payment"
              onPress={() => {
                this.state.SelectedPaymentGetway != '' &&
                this.state.SelectedFees.length &&
                this.state.key &&
                this.state.Salt
                  ? this.paymentModes(this.state.SelectedFees)
                  : Toast.show(
                      this.state.SelectedPaymentGetway == ''
                        ? 'Select Payment Getway'
                        : this.state.key && this.state.Salt
                        ? 'Temporary error ! Try again later'
                        : 'Select atleast one fee / Entered Payment is greater than 0',
                      {
                        position: Toast.position.CENTER,
                      },
                    );
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textContainer: {
    paddingHorizontal: 6,
    marginBottom: 5,
  },
  text: {
    fontFamily: 'Poppins-Regular',
    fontSize: ResponsiveSize(13),
    fontWeight: '500',
    lineHeight: 24,
    color: '#120E66',
  },
  innerTextDropdown: {margin: '1%', height: 40},
  DropdownStyle: {
    elevation: 2,
    shadowColor: 'silver',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingLeft: 15,
    borderWidth: 1,
  },
  DropdownCOntainer: {
    marginTop: '4%',
    marginLeft: '4%',
    marginRight: '4%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  SubjectMainContainer: {
    width: '100%',
    height: '50%',
    //flex: 1,
  },
  FeedbackView: {
    width: '95%',
    alignSelf: 'center',
    height: 200,
    justifyContent: 'space-evenly',
    marginTop: 10,
    borderRadius: 15,
    padding: 10,
  },
  MainTitle: {
    fontFamily: 'Poppins-Regular',
    color: 'white',
    fontWeight: 'bold',
    lineHeight: 30,
    fontSize: ResponsiveSize(config.AppAllSubTitle),
  },
  partition: {
    width: '22%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRightWidth: 0.5,
    marginVertical: 10,
    borderColor: 'gray',
  },
  item: {
    borderRadius: 5,
    backgroundColor: 'white',
    width: 150,
    height: 100,
    //borderColor: '#8075EA',
    //borderWidth: 1,
  },
  contentContainerStyle: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    marginTop: 50,
    marginBottom: 20,
  },
  category: {
    fontSize: 14,
    textAlign: 'left',
  },
  values: {
    fontSize: 14,
    textAlign: 'right',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  cell: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
  },
  textContainer: {
    paddingHorizontal: 6,
    marginBottom: 5,
  },
  text: {
    fontFamily: 'Poppins-Regular',
    fontSize: ResponsiveSize(13),
    fontWeight: '500',
    lineHeight: 24,
    color: '#120E66',
  },
});
const items = [
  {
    id: '92iijs7yta',
    name: 'Ondo',
  },
  {
    id: 'a0s0a8ssbsd',
    name: 'Ogun',
  },
  {
    id: '16hbajsabsd',
    name: 'Calabar',
  },
  {
    id: 'nahs75a5sg',
    name: 'Lagos',
  },
  {
    id: '667atsas',
    name: 'Maiduguri',
  },
  {
    id: 'hsyasajs',
    name: 'Anambra',
  },
  {
    id: 'djsjudksjd',
    name: 'Benue',
  },
  {
    id: 'sdhyaysdj',
    name: 'Kaduna',
  },
  {
    id: 'suudydjsjd',
    name: 'Abuja',
  },
];
