import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  BackHandler,
  Alert,
  Dimensions,
  TextInput,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import {CustomHeader} from '../components/CustomHeader';
import {Loader} from '../components/Loader';
import Toast from 'react-native-tiny-toast';
import {SafeAreaView} from 'react-native';
import config from '../config/config';
import {Checkbox, RadioButton} from 'react-native-paper';
import {CustomButton} from '../components/common/Button';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DocumentPicker from 'react-native-document-picker';
import {TouchableOpacity} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import CustomFastImage from '../components/common/CustomFastImage';
import {AnimatedCheckBox} from '../components/common/AnimatedCheckBox';
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};
const Color1 = '#23C4D7';
const Color2 = '#6397F2';
const oldUrl = 'https://insproplus.com/palgeoapi/';
export default class CircularStep3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Loader: false,
      Loader: false,
      isSMS: true,
      isEmail: true,
      isNotification: true,
      Academic: true,
      Event: false,
      Alert: false,
      General: false,
      studentList: this.props.route.params
        ? this.props.route.params.studentList
          ? this.props.route.params.studentList
          : ''
        : '',
      circular: '',
      subject: '',
      bearer_token: '',
      institute_id: '',
      showAlert1: false,
      error_message: '',
      org_id: '',
      collegeCode: [],
      NotificationAttachment: null,
      EmailAttachment: null,
      //NotificationAttachment: {
      //  FileName: '',
      //  FileType: '',
      //  Attachment: '',
      //},
      //EmailAttachment: {
      //  FileName: '',
      //  FileType: '',
      //  Attachment: '',
      //},
    };
  }
  //componentDidMount() {
  //  AsyncStorage.getItem('bearer_token').then((bearer_token) => {
  //    AsyncStorage.getItem('institute_id').then((institute_id) => {
  //      AsyncStorage.getItem('org_id').then((org_id) => {
  //        this.setState({
  //          bearer_token: bearer_token,
  //          institute_id: institute_id,
  //          org_id: org_id,
  //        });
  //      });
  //    });
  //  });
  //}
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
  retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        //console.log(value);
        this.setState({Token: value}, function () {
          //this.getData(bearer_token);
        });
      }
    } catch (error) {
      alert('Error retrieving data');
    }
    try {
      const value = await AsyncStorage.getItem('collegeCode');
      if (value !== null) {
        //console.log(value);
        let collegeCode = [];
        collegeCode.push(value);
        ////console.log(value);
        this.setState({collegeCode}, function () {
          //this.getData(bearer_token);
        });
      }
    } catch (error) {
      alert('Error retrieving data');
    }
  };

  send = () => {
    if (this.state.circular) {
      if (this.state.subject) {
        if (
          this.state.isSMS ||
          this.state.isEmail ||
          this.state.isNotification
        ) {
          this.setState({Loader: true});
          //console.log(
          //  'studentList',
          //  this.state.studentList,
          //  'subject',
          //  this.state.subject,
          //  'circular',
          //  this.state.circular,
          //  'isSMS',
          //  this.state.isSMS,
          //  'isEmail',
          //  this.state.isEmail,
          //  'isNotification',
          //  this.state.isNotification,
          //  'emailAttachment',
          //  this.state.EmailAttachment,
          //  'notificationAttachment',
          //  this.state.NotificationAttachment,
          //  'collegeCode',
          //  parseInt(this.state.collegeCode),
          //  //'isStaff',
          //  //false,
          //);
          fetch(config.baseUrl2 + 'staff/SendCircular', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + this.state.Token,
            },
            body: JSON.stringify({
              staffList: [],
              studentList: this.state.studentList,
              subject: this.state.subject,
              circular: this.state.circular,
              category: this.state.category,
              isSMS: this.state.isSMS,
              isEmail: this.state.isEmail,
              isNotification: this.state.isNotification,
              emailAttachment: this.state.EmailAttachment
                ? this.state.EmailAttachment
                : null,
              notificationAttachment: this.state.NotificationAttachment
                ? this.state.NotificationAttachment
                : null,
              //emailAttachment: this.state.EmailAttachment,
              //notificationAttachment: this.state.NotificationAttachment,
              collegeCode: parseInt(this.state.collegeCode),
              //isStaff: false,
            }),
          })
            .then((response) => response.json())
            .then((responseJson) => {
              this.setState({Loader: false});
              //console.log('Circular response ===', responseJson);
              if (responseJson.status == true) {
                Toast.showSuccess('Circular sent successfully');
              } else {
                Toast.show('Unknown error occured', ToastData);
              }
            })
            .catch((error) => {
              this.setState({Loader: false});
              alert(error);
            });
        } else {
          this.setState({Loader: false});
          Toast.show(
            'At least one method is selected for notifications',
            ToastData,
          );
        }
      } else {
        this.setState({Loader: false});
        Toast.show('Subject cannot be empty', ToastData);
      }
    } else {
      this.setState({Loader: false});
      Toast.show('Circular cannot be empty', ToastData);
    }
  };

  handleCheckbox1 = () => {
    var current = this.state.isSMS;
    this.setState({isSMS: !current}, function () {
      //alert(this.state.isSMS);
    });
  };
  handleCheckbox2 = () => {
    var current = this.state.isEmail;
    this.setState({isEmail: !current});
  };
  handleCheckbox3 = () => {
    var current = this.state.isNotification;
    this.setState({isNotification: !current});
  };
  SelectCircularImage = () => {
    try {
      ImagePicker.openPicker({
        cropping: true,
        includeBase64: true,
        compressImageQuality: 0.6,
      }).then((images) => {
        ////console.log(images);
        var Attachment = {
          FileName: 'CircularAttachment_' + new Date().getTime(),
          FileType: images.mime,
          Attachment: images.data,
        };
        this.setState({EmailAttachment: Attachment}, function () {
          ////console.log(this.state.EmailAttachment);
        });
      });
    } catch (err) {
      //console.log('Unknown Error: ' + JSON.stringify(err));
    }
  };
  selectNotificationImage = () => {
    try {
      ImagePicker.openPicker({
        cropping: true,
        includeBase64: true,
        compressImageQuality: 0.6,
      }).then((images) => {
        ////console.log(images);
        var Attachment = {
          FileName: 'NotificationAttachment_' + new Date().getTime(),
          FileType: images.mime,
          Attachment: images.data,
        };
        this.setState({NotificationAttachment: Attachment}, function () {
          //console.log(this.state.NotificationAttachment);
        });
      });
    } catch (err) {
      //console.log('Unknown Error: ' + JSON.stringify(err));
    }
  };
  SelectCircularFile = async () => {
    //Opening Document Picker for selection of one file
    try {
      const res = await DocumentPicker.pick({
        includeBase64: true,
        type: [DocumentPicker.types.allFiles],
        //There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
      });
      //Printing the log realted to the file
      //console.log('res : ' + JSON.stringify(res));
      //console.log('URI : ' + res.uri);
      //console.log('Type : ' + res.type);
      //console.log('File Name : ' + res.name);
      //console.log('File Size : ' + res.size);
      //Setting the state to show single file attributes
      let typeIdentifier = res.type.split('/');
      //console.log(typeIdentifier[1]);
      //alert(typeIdentifier[1]);
      RNFetchBlob.fs
        .readFile(res.uri, 'base64')
        .then((data) => {
          var Attachment = {
            FileName:
              'CircularAttachment_' +
              new Date().getTime() +
              '.' +
              typeIdentifier[1],
            FileType: res.type,
            Attachment: data,
          };

          this.setState({EmailAttachment: Attachment}, function () {
            //console.log(this.state.EmailAttachment);
          });
        })
        .catch((err) => {});
    } catch (err) {
      //console.log('Unknown Error: ' + JSON.stringify(err));
    }
  };
  //"FileType": "application/pdf"
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Loader
          Loading={this.state.Loader ? true : false}
          onPressCancel={() => {
            this.setState({Loader: false});
          }}
        />

        <AwesomeAlert
          show={this.state.showAlert1}
          showProgress={false}
          title="Attention"
          message={this.state.error_message}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          cancelText="Okay"
          onCancelPressed={() => {
            this.setState({showAlert1: false});
          }}
          cancelButtonColor={config.themeColor}
          cancelButtonTextStyle={{
            fontFamily: 'Poppins-Regular',
            fontSize: 13,
          }}
          messageStyle={{fontFamily: 'Poppins-Regular', fontSize: 13}}
          titleStyle={{fontFamily: 'Poppins-Regular', fontSize: 14}}
        />

        <CustomHeader
          title="E-Circular Step-3"
          isHome={false}
          navigation={this.props.navigation}
        />
        <View style={{width: '100%', flex: 1}}>
          <KeyboardAwareScrollView
            resetScrollToCoords={{x: 0, y: 0}}
            contentContainerStyle={{height: ScreenHeight, display: 'flex'}}
            scrollEnabled={true}>
            <View style={styles.cardContainer}>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.handleCheckbox1();
                    }}
                    style={[
                      styles.CheckBoxContainer,
                      {borderColor: this.state.isSMS ? Color2 : 'silver'},
                    ]}>
                    {/*<Checkbox
                      status={this.state.isSMS ? 'checked' : 'unchecked'}
                      onPress={() => {
                        this.handleCheckbox1();
                      }}
                      color={'#4D76F7'}
                    />*/}
                    {/*<RadioButton
                      value={this.state.isSMS}
                      color={Color2}
                      uncheckedColor={'silver'}
                      status={this.state.isSMS ? 'checked' : 'unchecked'}
                      onPress={() => this.handleCheckbox1()}
                    />*/}
                    <AnimatedCheckBox
                      size={20}
                      disableBuiltInState={true}
                      isChecked={this.state.isSMS ? true : false}
                      fillColor={Color2}
                      iconStyle={{
                        borderRadius: 50,
                        marginLeft: 5,
                      }}
                      textStyle={{
                        fontFamily: 'Poppins-Regular',
                      }}
                      onPress={() => this.handleCheckbox1()}
                    />
                    <Text style={{color: this.state.isSMS ? Color2 : 'black'}}>
                      SMS
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      this.handleCheckbox3();
                    }}
                    style={[
                      styles.CheckBoxContainer,
                      {
                        borderColor: this.state.isNotification
                          ? Color2
                          : 'silver',
                      },
                    ]}>
                    {/*<Checkbox
                      status={
                        this.state.isNotification ? 'checked' : 'unchecked'
                      }
                      onPress={() => this.handleCheckbox3()}
                      color={'#4D76F7'}
                    />*/}
                    {/*<RadioButton
                      value={this.state.isNotification}
                      color={Color2}
                      uncheckedColor={'silver'}
                      status={
                        this.state.isNotification ? 'checked' : 'unchecked'
                      }
                      onPress={() => this.handleCheckbox3()}
                    />*/}
                    <AnimatedCheckBox
                      size={20}
                      disableBuiltInState={true}
                      isChecked={this.state.isNotification ? true : false}
                      fillColor={Color2}
                      iconStyle={{
                        borderRadius: 50,
                        marginLeft: 5,
                      }}
                      textStyle={{
                        fontFamily: 'Poppins-Regular',
                      }}
                      onPress={() => this.handleCheckbox3()}
                    />
                    <Text
                      style={{
                        color: this.state.isNotification ? Color2 : 'black',
                      }}>
                      NOTIFICATION
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.handleCheckbox2();
                    }}
                    style={[
                      styles.CheckBoxContainer,
                      {borderColor: this.state.isEmail ? Color2 : 'silver'},
                    ]}>
                    {/*<Checkbox
                      status={this.state.isEmail ? 'checked' : 'unchecked'}
                      onPress={() => this.handleCheckbox2()}
                      color={'#4D76F7'}
                    />*/}
                    {/*<RadioButton
                      value={this.state.isEmail}
                      color={Color2}
                      uncheckedColor={'silver'}
                      status={this.state.isEmail ? 'checked' : 'unchecked'}
                      onPress={() => this.handleCheckbox2()}
                    />*/}
                    <AnimatedCheckBox
                      size={20}
                      disableBuiltInState={true}
                      isChecked={this.state.isEmail ? true : false}
                      fillColor={Color2}
                      iconStyle={{
                        borderRadius: 50,
                        marginLeft: 5,
                      }}
                      textStyle={{
                        fontFamily: 'Poppins-Regular',
                      }}
                      onPress={() => this.handleCheckbox2()}
                    />
                    <Text
                      style={{color: this.state.isEmail ? Color2 : 'black'}}>
                      EMAIL
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <Text
                  style={[styles.label, {color: Color1, marginVertical: 5}]}>
                  Notification Category
                </Text>
              </View>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        category: 'General',
                      });
                    }}
                    style={[
                      styles.CheckBoxContainer,
                      {
                        borderColor:
                          this.state.category == 'General' ? Color1 : 'silver',
                      },
                    ]}>
                    {/*<Checkbox
                      status={
                        this.state.category == 'General'
                          ? 'checked'
                          : 'unchecked'
                      }
                      onPress={() =>
                        this.setState({
                          category: 'General',
                        })
                      }
                      color={Color1}
                      uncheckedColor="silver"
                    />*/}
                    <AnimatedCheckBox
                      size={20}
                      disableBuiltInState={true}
                      isChecked={
                        this.state.category == 'General' ? true : false
                      }
                      fillColor={Color1}
                      iconStyle={{
                        borderRadius: 5,
                        marginLeft: 5,
                      }}
                      textStyle={{
                        fontFamily: 'Poppins-Regular',
                      }}
                      onPress={() =>
                        this.setState({
                          category: 'General',
                        })
                      }
                    />
                    <Text
                      style={{
                        color:
                          this.state.category == 'General' ? Color1 : 'black',
                      }}>
                      General
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        category: 'Event',
                      });
                    }}
                    style={[
                      styles.CheckBoxContainer,
                      {
                        borderColor:
                          this.state.category == 'Event' ? Color1 : 'silver',
                      },
                    ]}>
                    {/*<Checkbox
                      status={
                        this.state.category == 'Event' ? 'checked' : 'unchecked'
                      }
                      onPress={() =>
                        this.setState({
                          category: 'Event',
                        })
                      }
                      color={Color1}
                      uncheckedColor="silver"
                    />*/}
                    <AnimatedCheckBox
                      size={20}
                      disableBuiltInState={true}
                      isChecked={this.state.category == 'Event' ? true : false}
                      fillColor={Color1}
                      iconStyle={{
                        borderRadius: 5,
                        marginLeft: 5,
                      }}
                      textStyle={{
                        fontFamily: 'Poppins-Regular',
                      }}
                      onPress={() =>
                        this.setState({
                          category: 'Event',
                        })
                      }
                    />
                    <Text
                      style={{
                        color:
                          this.state.category == 'Event' ? Color1 : 'black',
                      }}>
                      Event
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        category: 'Academic',
                      });
                    }}
                    style={[
                      styles.CheckBoxContainer,
                      {
                        borderColor:
                          this.state.category == 'Academic' ? Color1 : 'silver',
                      },
                    ]}>
                    {/*<Checkbox
                      status={
                        this.state.category == 'Academic'
                          ? 'checked'
                          : 'unchecked'
                      }
                      onPress={() => {
                        this.setState({
                          category: 'Academic',
                        });
                      }}
                      color={Color1}
                      uncheckedColor="silver"
                    />*/}
                    <AnimatedCheckBox
                      size={20}
                      disableBuiltInState={true}
                      isChecked={
                        this.state.category == 'Academic' ? true : false
                      }
                      fillColor={Color1}
                      iconStyle={{
                        borderRadius: 5,
                        marginLeft: 5,
                      }}
                      textStyle={{
                        fontFamily: 'Poppins-Regular',
                      }}
                      onPress={() =>
                        this.setState({
                          category: 'Academic',
                        })
                      }
                    />
                    <Text
                      style={{
                        color:
                          this.state.category == 'Academic' ? Color1 : 'black',
                      }}>
                      Academic
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        category: 'Alerts',
                      });
                    }}
                    style={[
                      styles.CheckBoxContainer,
                      {
                        borderColor:
                          this.state.category == 'Alerts' ? Color1 : 'silver',
                      },
                    ]}>
                    {/*<Checkbox
                      status={
                        this.state.category == 'Alerts'
                          ? 'checked'
                          : 'unchecked'
                      }
                      onPress={() =>
                        this.setState({
                          category: 'Alerts',
                        })
                      }
                      color={Color1}
                      uncheckedColor="silver"
                    />*/}
                    <AnimatedCheckBox
                      size={20}
                      disableBuiltInState={true}
                      isChecked={this.state.category == 'Alerts' ? true : false}
                      fillColor={Color1}
                      iconStyle={{
                        borderRadius: 5,
                        marginLeft: 5,
                      }}
                      textStyle={{
                        fontFamily: 'Poppins-Regular',
                      }}
                      onPress={() =>
                        this.setState({
                          category: 'Alerts',
                        })
                      }
                    />
                    <Text
                      style={{
                        color:
                          this.state.category == 'Alerts' ? Color1 : 'black',
                      }}>
                      Alerts
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <View style={styles.labelContainer}>
                  <Text style={[styles.label, {color: Color2}]}>Subject</Text>
                </View>
                <View>
                  <View style={[styles.item, {borderColor: Color2}]}>
                    <TextInput
                      placeholder=""
                      style={styles.input}
                      value={this.state.subject}
                      onChangeText={(subject) => {
                        this.setState({subject: subject});
                      }}
                    />
                  </View>
                </View>
              </View>
              {
                <View>
                  <View style={styles.labelContainer}>
                    <View style={styles.row}>
                      <Text style={[styles.label, {color: Color2}]}>
                        Description
                      </Text>
                      <Text style={styles.optional}>
                        (Optional for only sms circular)
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.item1,
                      {borderWidth: 1, borderColor: Color2},
                    ]}>
                    <TextInput
                      blurOnSubmit={true}
                      multiline
                      style={styles.textarea}
                      value={this.state.circular}
                      onChangeText={(circular) => {
                        this.setState({circular: circular});
                      }}
                    />
                  </View>
                </View>
              }

              <View style={{marginTop: 20}}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    this.SelectCircularFile();
                  }}>
                  <View>
                    <View
                      disabled
                      style={[
                        styles.item,
                        {
                          borderColor: Color1,
                          color: Color1,
                          flexDirection: 'row',
                        },
                      ]}>
                      <View
                        style={{
                          width: 50,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#F6F6F8',
                          height: '80%',
                          borderRadius: 5,
                          margin: 5,
                        }}>
                        <CustomFastImage
                          resizeMode={'contain'}
                          style={{
                            width: 20,
                            height: 20,
                          }}
                          source={require('../assets/fileGreen.png')}
                        />
                      </View>
                      <TextInput
                        placeholder="Upload Circular Attachment"
                        placeholderTextColor={Color1}
                        style={styles.input}
                        value={
                          this.state.EmailAttachment
                            ? this.state.EmailAttachment.FileName
                            : ''
                        }
                        disabled
                      />
                      {this.state.EmailAttachment && (
                        <TouchableOpacity
                          style={{
                            width: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#FFF5F5',
                            height: '80%',
                            borderRadius: 5,
                            margin: 5,
                          }}
                          onPress={() => {
                            this.state.EmailAttachment
                              ? Alert.alert(
                                  'Confirmation',
                                  'Are you sure to delete this image?',
                                  [
                                    {
                                      text: 'Cancel',
                                      onPress: () =>
                                        console.log('Cancel Pressed'),
                                      style: 'No',
                                    },
                                    {
                                      text: 'Yes',
                                      onPress: () =>
                                        this.setState(
                                          {EmailAttachment: null},
                                          function () {
                                            //console.log(
                                            //  this.state.EmailAttachment,
                                            //);
                                          },
                                        ),
                                    },
                                  ],
                                )
                              : Toast.show(
                                  'No image is selected yet!',
                                  ToastData,
                                );
                          }}>
                          <CustomFastImage
                            resizeMode={'contain'}
                            style={{
                              width: 20,
                              height: 20,
                              //marginHorizontal: 5,
                            }}
                            source={require('../assets/delete.png')}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
              {this.state.isNotification && (
                <View style={{marginTop: 20}}>
                  <TouchableWithoutFeedback
                    onPress={this.selectNotificationImage}>
                    <View>
                      <View
                        disabled
                        style={[
                          styles.item,
                          {
                            borderColor: Color1,
                            color: Color1,
                            flexDirection: 'row',
                          },
                        ]}>
                        <View
                          style={{
                            width: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#F6F6F8',
                            height: '80%',
                            borderRadius: 5,
                            margin: 5,
                          }}>
                          <CustomFastImage
                            resizeMode={'contain'}
                            style={{
                              width: 20,
                              height: 20,
                            }}
                            source={require('../assets/fileGreen.png')}
                          />
                        </View>
                        <TextInput
                          placeholder="Upload Notification Background Image"
                          placeholderTextColor={Color1}
                          style={styles.input}
                          value={
                            this.state.NotificationAttachment
                              ? this.state.NotificationAttachment.FileName
                              : ''
                          }
                          disabled
                        />
                        {this.state.NotificationAttachment && (
                          <TouchableOpacity
                            style={{
                              width: 50,
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: '#FFF5F5',
                              height: '80%',
                              borderRadius: 5,
                              margin: 5,
                            }}
                            onPress={() => {
                              this.state.NotificationAttachment
                                ? Alert.alert(
                                    'Confirmation',
                                    'Are you sure to delete this image?',
                                    [
                                      {
                                        text: 'Cancel',
                                        onPress: () =>
                                          console.log('Cancel Pressed'),
                                        style: 'No',
                                      },
                                      {
                                        text: 'Yes',
                                        onPress: () =>
                                          this.setState(
                                            {NotificationAttachment: null},
                                            function () {
                                              //console.log(
                                              //  this.state
                                              //    .NotificationAttachment,
                                              //);
                                            },
                                          ),
                                      },
                                    ],
                                  )
                                : Toast.show(
                                    'No image is selected yet!',
                                    ToastData,
                                  );
                            }}>
                            <CustomFastImage
                              resizeMode={'contain'}
                              style={{
                                width: 20,
                                height: 20,
                              }}
                              source={require('../assets/delete.png')}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              )}
            </View>
          </KeyboardAwareScrollView>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: hp('3'),
          }}>
          <CustomButton
            title="Send"
            onPress={() => {
              this.send();
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: '#089bf9',
  },
  title: {
    fontFamily: 'Poppins-Regular',
    fontSize: 17,
    color: '#ffffff',
  },
  cardContainer: {
    marginTop: '5%',
    marginLeft: '3%',
    marginRight: '3%',
    justifyContent: 'center',
  },
  label: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#000000',
  },
  label1: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#c9c3c5',
    paddingLeft: wp('3'),
  },
  labelContainer: {
    marginTop: 10,
  },
  input: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderColor: 'transparent',
    borderWidth: 0,
    width: '80%',
  },
  //item: {
  //  borderRadius: 10,
  //  backgroundColor: '#ffffff',
  //  height: hp('7'),
  //  borderColor: '#f1f1f1',
  //  borderWidth: 1.5,
  //},
  item: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    marginTop: 10,
    height: 55,
    borderWidth: 1,
  },

  item1: {
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderColor: '#f1f1f1',
    borderWidth: 1.5,
    marginTop: 10,
  },
  textarea: {
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderRadius: 8,
    minHeight: 100,
  },
  footerText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    color: '#ffffff',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#f05760',
    borderRadius: 20,
    width: wp('30'),
    paddingRight: wp('7'),
    marginTop: '4%',
  },
  buttonText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#ffffff',
  },
  btImage: {
    width: 30,
    height: 30,
    marginRight: 10,
    padding: 20,
  },
  row: {
    flexDirection: 'row',
  },
  optional: {
    fontFamily: 'Poppins-Regular',
    color: 'red',
    fontSize: 12,
    margin: 2,
  },
  CheckBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 5,
    //elevation: 2,
    paddingRight: 10,
    paddingLeft: 5,
    height: 30,
    borderWidth: 1,
    backgroundColor: 'white',
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
});
