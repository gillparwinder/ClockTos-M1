import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  NativeModules,
  Alert,
  Switch,
  ScrollView,
  PermissionsAndroid,
  DeviceEventEmitter,
  NativeEventEmitter,
} from 'react-native';
import {sha512} from 'js-sha512';
const {PayUBizSdk} = NativeModules;

export default class Test extends Component {
  state = {
    key: '3TnMpV',
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
    merchantSMSPermission: false,

    showAlert: false,
  };

  displayAlert = (title, value) => {
    if (this.state.showAlert == false) {
      console.log('displayAlert ' + title + ' ' + value);
      this.setState({showAlert: true}, () => Alert.alert(title, value));
    }
    this.state.showAlert = false;
  };
  toggleAutoApproveOTP = (value) => {
    this.setState({autoApprove: value});
  };
  toggleSelectOTP = (value) => {
    this.setState({autoSelectOtp: value});
  };
  toggleViewPort = (value) => {
    this.setState({viewPortWideEnable: value});
  };
  togglePermission = (value) => {
    this.setState({merchantSMSPermission: value});
    this.requestSMSPermission();
  };

  requestSMSPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
        {
          title: 'Sample App SMS Permission',
          message:
            'Sample App needs access to your sms to autofill OTP on Bank Pages ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  //Register eventEmitters here
  componentDidMount() {
    const eventEmitter = new NativeEventEmitter(PayUBizSdk);

    this.iOSOnPaymentSuccess = eventEmitter.addListener(
      'onPaymentSuccess',
      this.onPaymentSuccess,
    );
    this.iOSOnPaymentFailure = eventEmitter.addListener(
      'onPaymentFailure',
      this.onPaymentFailure,
    );
    this.iOSOnPaymentCancel = eventEmitter.addListener(
      'onPaymentCancel',
      this.onPaymentCancel,
    );
    this.iOSOnError = eventEmitter.addListener('onError', this.onError);
    this.iOSGenerateHash = eventEmitter.addListener(
      'generateHash',
      this.generateHash,
    );
  }

  onPaymentSuccess = (e) => {
    console.log(e.merchantResponse);
    console.log(e.payuResponse);
    this.displayAlert('onPaymentSuccess', JSON.stringify(e));
  };
  onPaymentFailure = (e) => {
    console.log(e);
    console.log(e.merchantResponse);
    console.log(e.payuResponse);
    this.displayAlert('onPaymentFailure', JSON.stringify(e));
  };
  onPaymentCancel = (e) => {
    console.log('onPaymentCancel isTxnInitiated -' + e);
    this.displayAlert('onPaymentCancel', JSON.stringify(e));
  };
  onError = (e) => {
    console.log(e);
    this.displayAlert('onError', JSON.stringify(e));
  };
  generateHash = (e) => {
    console.log(e.hashName);
    console.log(e.hashString);
    this.sendBackHash(e.hashName, e.hashString + this.state.merchantSalt);
  };

  //Unregister eventEmitters here
  componentWillUnmount() {
    this.iOSOnPaymentSuccess.remove();
    this.iOSOnPaymentFailure.remove();
    this.iOSOnPaymentCancel.remove();
    this.iOSOnError.remove();
    this.iOSGenerateHash.remove();
  }
  render() {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.welcome}>???PayUCheckoutPro Sample App???</Text>
        <View style={styles.cell}>
          <Text style={styles.category}>Merchant Key</Text>
          <TextInput
            style={styles.values}
            defaultValue={this.state.key}
            onChangeText={(text) => {
              this.state.key = text;
            }}
          />
        </View>
        <View style={styles.cell}>
          <Text style={styles.category}>Merchant Salt</Text>
          <TextInput
            style={styles.values}
            defaultValue={this.state.merchantSalt}
            onChangeText={(text) => {
              this.state.merchantSalt = text;
            }}
          />
        </View>
        <View style={styles.cell}>
          <Text style={styles.category}>Environment</Text>
          <TextInput
            style={styles.values}
            defaultValue={this.state.environment}
            onChangeText={(text) => {
              this.state.environment = text;
            }}
          />
        </View>
        <View style={styles.cell}>
          <Text style={styles.category}>Enter transcation amount</Text>
          <TextInput
            style={styles.values}
            defaultValue={this.state.amount}
            onChangeText={(text) => {
              this.state.amount = text;
            }}
          />
        </View>
        <View style={styles.cell}>
          <Text style={styles.category}>Email</Text>
          <TextInput
            style={styles.values}
            defaultValue={this.state.email}
            onChangeText={(text) => {
              this.state.email = text;
            }}
          />
        </View>
        <View style={styles.cell}>
          <Text style={styles.category}>User Credential</Text>
          <TextInput
            style={styles.values}
            defaultValue={this.state.userCredential}
            onChangeText={(text) => {
              this.state.userCredential = text;
            }}
          />
        </View>
        <View style={styles.cell}>
          <Text style={styles.category}>UDF1</Text>
          <TextInput
            style={styles.values}
            defaultValue={this.state.udf1}
            onChangeText={(text) => {
              this.state.udf1 = text;
            }}
          />
        </View>
        <View style={styles.cell}>
          <Text style={styles.category}>UDF2</Text>
          <TextInput
            style={styles.values}
            defaultValue={this.state.udf2}
            onChangeText={(text) => {
              this.state.udf2 = text;
            }}
          />
        </View>
        <View style={styles.cell}>
          <Text style={styles.category}>UDF3</Text>
          <TextInput
            style={styles.values}
            defaultValue={this.state.udf3}
            onChangeText={(text) => {
              this.state.udf3 = text;
            }}
          />
        </View>
        <View style={styles.cell}>
          <Text style={styles.category}>UDF4</Text>
          <TextInput
            style={styles.values}
            defaultValue={this.state.udf4}
            onChangeText={(text) => {
              this.state.udf4 = text;
            }}
          />
        </View>
        <View style={styles.cell}>
          <Text style={styles.category}>UDF5</Text>
          <TextInput
            style={styles.values}
            defaultValue={this.state.udf5}
            onChangeText={(text) => {
              this.state.udf5 = text;
            }}
          />
        </View>
        <View style={styles.cell}>
          <Text style={styles.category}>Merchant Surl/Furl Timeout</Text>
          <TextInput
            style={styles.values}
            defaultValue={String(this.state.merchantResponseTimeout)}
            onChangeText={(text) => {
              this.state.merchantResponseTimeout = parseInt(text);
            }}
          />
        </View>
        <View style={styles.cell}>
          <Text style={styles.category}>Auto Select Otp</Text>
          <Switch
            style={styles.values}
            value={this.state.autoSelectOtp}
            onValueChange={this.toggleSelectOTP}
          />
        </View>
        <View style={styles.cell}>
          <Text style={styles.category}>SMS Permission</Text>
          <Switch
            style={styles.values}
            value={this.state.merchantSMSPermission}
            onValueChange={this.togglePermission}
          />
        </View>
        <View style={styles.cell}>
          <Text style={styles.category}>Auto Approve Otp</Text>
          <Switch
            style={styles.values}
            value={this.state.autoApprove}
            onValueChange={this.toggleAutoApproveOTP}
          />
        </View>
        <View style={styles.cell}>
          <Text style={styles.category}>SurePay (0-3)</Text>
          <TextInput
            style={styles.values}
            defaultValue={String(this.state.surePayCount)}
            onChangeText={(text) => {
              this.state.surePayCount = parseInt(text);
            }}
          />
        </View>
        <View style={styles.cell}>
          <Text style={styles.category}>Merchant Name</Text>
          <TextInput
            style={styles.values}
            defaultValue={this.state.merchantName}
            onChangeText={(text) => {
              this.state.merchantName = text;
            }}
          />
        </View>
        <Button title={'Pay Now'} onPress={this.launchPayU} />
      </ScrollView>
    );
  }
  createPaymentParams = () => {
    var txnid = new Date().getTime().toString();
    var paymentHash = this.calculateHash(
      this.state.key +
        '|' +
        txnid +
        '|' +
        this.state.amount +
        '|' +
        this.state.productInfo +
        '|' +
        this.state.firstName +
        '|' +
        this.state.email +
        '|' +
        this.state.udf1 +
        '|' +
        this.state.udf2 +
        '|' +
        this.state.udf3 +
        '|' +
        this.state.udf4 +
        '|' +
        this.state.udf5 +
        '||||||' +
        this.state.merchantSalt,
    );
    var vasHash = this.calculateHash(
      this.state.key +
        '|vas_for_mobile_sdk|' +
        'default' +
        '|' +
        this.state.merchantSalt,
    );
    var paymentDetailsHash = this.calculateHash(
      this.state.key +
        '|payment_related_details_for_mobile_sdk|' +
        this.state.userCredential +
        '|' +
        this.state.merchantSalt,
    );

    var payUPaymentParams = {
      key: this.state.key,
      transactionId: txnid,
      amount: this.state.amount,
      productInfo: this.state.productInfo,
      firstName: this.state.firstName,
      email: this.state.email,
      phone: this.state.phone,
      ios_surl: this.state.ios_surl,
      ios_furl: this.state.ios_furl,
      android_surl: this.state.android_surl,
      android_furl: this.state.android_furl,
      environment: this.state.environment,
      userCredential: this.state.userCredential,
      additionalParam: {
        udf1: this.state.udf1,
        udf2: this.state.udf2,
        udf3: this.state.udf3,
        udf4: this.state.udf4,
        udf5: this.state.udf5,
        // payment_related_details_for_mobile_sdk: paymentDetailsHash,
        // vas_for_mobile_sdk: vasHash,
        // payment: paymentHash
      },
    };

    var payUCheckoutProConfig = {
      primaryColor: this.state.primaryColor,
      secondaryColor: this.state.secondaryColor,
      merchantName: this.state.merchantName,
      merchantLogo: this.state.merchantLogo,
      showExitConfirmationOnCheckoutScreen: this.state
        .showExitConfirmationOnCheckoutScreen,
      showExitConfirmationOnPaymentScreen: this.state
        .showExitConfirmationOnPaymentScreen,
      cartDetails: this.state.cartDetails,
      paymentModesOrder: this.state.paymentModesOrder,
      surePayCount: this.state.surePayCount,
      merchantResponseTimeout: this.state.merchantResponseTimeout,
      autoSelectOtp: this.state.autoSelectOtp,
      // Android specific property
      autoApprove: this.state.autoApprove,
      merchantSMSPermission: this.state.merchantSMSPermission,
      showCbToolbar: this.showCbToolbar,
    };
    return {
      payUPaymentParams: payUPaymentParams,
      payUCheckoutProConfig: payUCheckoutProConfig,
    };
  };
  //Used to send back hash generated to SDK
  sendBackHash = (hashName, hashData) => {
    console.log(hashName);
    var hashValue = this.calculateHash(hashData);
    var result = {[hashName]: hashValue};
    console.log(result);
    PayUBizSdk.hashGenerated(result);
  };
  calculateHash = (data) => {
    console.log(data);
    var result = sha512(data);
    console.log(result);
    return result;
  };
  launchPayU = () => {
    console.log('Method launched amount =' + this.state.amount);
    PayUBizSdk.openCheckoutScreen(this.createPaymentParams());
  };
}

const styles = StyleSheet.create({
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
});
