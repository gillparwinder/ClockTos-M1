import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {
  StyleSheet,
  BackHandler,
  Linking,
  Alert,
  PermissionsAndroid,
  SafeAreaView,
} from 'react-native';
import {View, Text, TouchableOpacity} from 'react-native';
import {CustomHeader} from './CustomHeader';
import {Loader} from './Loader';
import DatePicker from 'react-native-datepicker';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-tiny-toast';
import ResponsiveSize from '../config/ResponsiveSize';
import config from '../config/config';
import moment from 'moment';
import {Dimensions} from 'react-native';
import CommonFlatlist from './common/CommonFlatList';
import CustomFastImage from './common/CustomFastImage';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import DocumentPicker from 'react-native-document-picker';
//import {DocumentPicker, DocumentPickerUtil} from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
// for file managing
import ImageView from 'react-native-image-viewing';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import {Overlay} from 'react-native-elements';
import FormForNotes from './common/FormForNotes';
import ButtonSwitcher from './common/ButtonSwitcher';
import FileList from './common/FileList';
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;
const urll =
  'https://github.com/vinzscam/react-native-file-viewer/raw/master/docs/react-native-file-viewer-certificate.pdf';
const localFile = `${RNFS.DocumentDirectoryPath}/temporaryfile.pdf`;
const file = 'file-to-open.doc';
const dest = `${RNFS.DocumentDirectoryPath}/${file}`;
const options = {
  fromUrl: urll,
  toFile: localFile,
};
var filterredUnitName = [];
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};
const LightGreenColor = '#BBECF2';
const BlueColor = '#6397F2';

export default class StaffSubjectsDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Syllabus: true,
      colorCode: this.props?.route?.params?.colorCode || '#23C4D7',
      colorCode2: this.props?.route?.params?.colorCode2 || '#23C4D7',
      Subjects: this.props?.route?.params?.item || {},
      isReuse: this.props?.isReuse || '',
      AttendanceDate: this.props?.route?.params?.AttendanceDate || new Date(),
      hour: this.props?.route?.params?.hour || '',
      refreshing: false,
      Loader: true,
      Arr: [],
      Arr2: [],
      Success: false,
      Notes: true,
      SubjectsDetail: [],
      Attachment: null,
      GetLessonData: [],
      filterredSubTempIndex: -1,
      filterredUnitNameTempIndex: -1,
      filterredSubUnitNameTempIndex: -1,
      filterredSubTempIndex2: -1,
      filterredUnitNameTempIndex2: -1,
      filterredSubUnitNameTempIndex2: -1,
      ModalVisible: false,
      ModalVisible2: false,
      ModalVisibleForFileView: false,
      ModalVisibleForFileView2: false,
      staffCode: '',
      userId: '',
      //  Indentifier: 'Homework',
      Indentifier: 'Notes',
      homeWorkStartDate: '',
      homeWorkEndDate: '',
      HomeworkData: [],
    };
  }
  componentDidMount() {
    console.log('this.props = ', this.props.route.params);
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
        this.setState({Token: value});
      }
    } catch (error) {
      alert('Error retrieving data');
    }
    try {
      const value = await AsyncStorage.getItem('staffCode');
      //console.log('token = ', value);
      if (value !== null) {
        this.setState({staffCode: value}, function () {});
      }
    } catch (error) {
      alert('Error retrieving data');
    }
    try {
      const value = await AsyncStorage.getItem('userId');
      //console.log('token = ', value);
      if (value !== null) {
        this.setState({userId: value}, function () {
          this.onPressGetSubjectsDetail();
          this.onLoadGetHomework();
        });
      }
    } catch (error) {
      alert('Error retrieving data');
    }
  };
  _onRefresh = async (apiCall) => {
    this.setState({refreshing: true}, () => {
      apiCall;
    });
  };
  openModel = () => {
    this.setState({ModalVisible: true, Notes: true});
  };
  openModel2 = () => {
    this.setState({ModalVisible2: true, Homework: true});
  };
  checkPermission = async (Filepathdata, splitpathdata) => {
    this.setState({Loader: true});
    let Filepath = Filepathdata;
    let splitpath = splitpathdata;
    console.log('Filepath=====', Filepath);
    if (Platform.OS === 'ios') {
      this.downloadFile(Filepath, splitpath);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message:
              'Application needs access to your storage to download File',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Start downloading
          this.downloadFile(Filepath, splitpath);
          //   console.log('Storage Permission Granted.');
        } else {
          // If permission denied then show alert
          Alert.alert('Error', 'Storage Permission Not Granted');
          this.setState({Loader: false});
        }
      } catch (err) {
        alert('Something Went Worng');
        this.setState({Loader: false});
        // To handle permission related exception
        console.log('++++' + err);
      }
    }
  };

  downloadFile = (Filepath, splitpath) => {
    console.log('hit download function');
    let date = new Date();
    //let FILE_URL = 'http://www.w3schools.com/xml/plant_catalog.xml';
    //let FILE_URL = 'http://www.africau.edu/images/default/sample.pdf';
    //let FILE_URL = 'https://cdn.wallpapersafari.com/15/0/P8KaFp.jpg';
    let FILE_URL = Filepath;
    let file_ext = this.getFileExtention(FILE_URL);
    file_ext = '.' + file_ext[0];
    const {config, fs} = RNFetchBlob;
    let RootDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path:
          RootDir +
          '/file_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          file_ext,
        description: 'downloading file...',
        notification: true,
        useDownloadManager: true,
      },
    };
    config(options)
      .fetch('GET', FILE_URL)
      .then((res) => {
        this.setState({Loader: false, Success: true});
        //this.DownloadFile(Filepath, splitpath);
        console.log('res -> ', JSON.stringify(res));
        Toast.showSuccess('Download Completed');
      })
      .catch((error) => {
        console.log('config error', error);
        this.setState({Loader: false});
      });
  };
  getFileExtention = (fileUrl, splitpath) => {
    // To get the file extension
    try {
      return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
    } catch {
      alert('Wrong Format');
    }
  };

  DownloadFile = (Filepath, splitpath) => {
    console.log('File Downloaded Successfully.');
    let localFile = `${RNFS.DocumentDirectoryPath}/` + splitpath;
    // alert(localFile)
    const options = {
      fromUrl: Filepath,
      toFile: localFile,
    };
    RNFS.downloadFile(options)
      .promise.then(
        () => console.log('success'),
        //   alert(JSON.stringify(data2)))
        //FileViewer.open(Filepath, {showOpenWithDialog: true}),
      )
      .then((data) => {
        console.log('error', data);
        this.setState({Loader: false});
      })
      .catch((error) => {
        console.log('error2', error);
        this.setState({Loader: false});
      });
  };
  onPressUploadNotes = (key, file, topicNo) => {
    //alert('hit');
    let TempArr = [];
    if (key == 1) {
      TempArr.push({
        insUpdDlt: key,
        degreeCode: this.state.Subjects.degCode.toString(),
        //semester: '1',
        semester: this.state.Subjects.sem.toString(),
        batchYear: this.state.Subjects.batchYear.toString(),
        date: this.state.AttendanceDate,
        section: this.state.Subjects.sections.toString(),
        subjectNo: this.state.Subjects.subno.toString(),
        topics: this.state.topicNumber.toString(),
        hour: this.state.hour,
        staffCode: this.state.staffCode.toString(),
        attachment: this.state.Attachment2,
      });
    } else {
      TempArr.push({
        insUpdDlt: key,
        degreeCode: this.state.Subjects.degCode.toString(),
        //semester: '1',
        semester: this.state.Subjects.sem.toString(),
        batchYear: this.state.Subjects.batchYear.toString(),
        date: this.state.AttendanceDate,
        section: this.state.Subjects.sections.toString(),
        subjectNo: this.state.Subjects.subno.toString(),
        topics: topicNo.toString(),
        hour: this.state.hour,
        staffCode: this.state.staffCode.toString(),
        attachment: file,
      });
    }

    const url = config.baseUrl2 + 'staff/AddorUpdateLessionPlanNotes';
    console.log(url);
    let bodyData = JSON.stringify(TempArr);
    console.log(bodyData);
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.state.Token,
      },
      body: bodyData,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);

        //alert(JSON.stringify(responseJson));
        if (responseJson.status == true) {
          this.setState({
            ModalVisibleForFileView: false,
            ModalVisibleForFileView2: false,
          });
          if (key == 0) {
            this.onPressGetSubjectsDetail();
            Toast.showSuccess(
              responseJson?.message || 'File Deleted Successfully',
            );
          } else {
            this.onPressGetSubjectsDetail();
            Toast.showSuccess(responseJson?.message || 'Uploaded Successfully');
          }
          //  this.setState(
          //    {Loader: false, LessionPlanNotes: responseJson, refreshing: false},
          //    function () {},
          //  );
        } else {
          this.setState({Loader: false, refreshing: false}, function () {
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
        this.setState({Loader: false, refreshing: false}, function () {
          alert(error);
          console.log(error);
        });
      });
  };

  onPressUploadHomework = (key, file, topicNo) => {
    let TempArr2 = [];
    if (key == 1) {
      TempArr2.push({
        inDel: key,
        subjectno: parseInt(this.state.Subjects.subno),
        date: this.state.AttendanceDate,
        homework: this.state.Description,
        section: this.state.Subjects.sections.toString(),
        heading: this.state.subject,
        attachment: this.state.Attachment,
        topics: this.state.topicNumber,
      });
    } else {
      TempArr2.push({
        inDel: key,
        subjectno: parseInt(this.state.Subjects.subno),
        date: this.state.AttendanceDate,
        homework: this.state.Description,
        section: this.state.Subjects.sections.toString(),
        heading: this.state.subject,
        attachment: this.state.Attachment,
        topics: this.state.topicNumber,
      });
    }

    //alert('hit');
    const url = config.baseUrl2 + 'staff/InsertStudentHomework';
    console.log(url);
    let bodyData = JSON.stringify(TempArr2);
    console.log(bodyData);
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.state.Token,
      },
      body: bodyData,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        //alert(JSON.stringify(responseJson));
        if (responseJson) {
          if (key == 0) {
            Toast.showSuccess('File Deleted Successfully');
            this.onLoadGetHomework();
          } else {
            this.onLoadGetHomework();
            Toast.showSuccess(responseJson?.message || 'Uploaded Successfully');
          }

          //  this.setState(
          //    {Loader: false, LessionPlanNotes: responseJson, refreshing: false},
          //    function () {},
          //  );
        } else {
          this.setState({Loader: false, refreshing: false}, function () {
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
        this.setState({Loader: false, refreshing: false}, function () {
          alert(error);
          console.log(error);
        });
      });
  };

  onPressGetSubjectsDetail = () => {
    //alert('hit');
    //const url = config.baseUrl + 'student/SubjectSyllabusDetails';
    const url = config.baseUrl2 + 'staff/getlessionplan';
    console.log(url);
    let bodyData = JSON.stringify({
      batchYear: this.state.Subjects.batchYear.toString(),
      degreeCode: this.state.Subjects.degCode.toString(),
      semester: this.state.Subjects.sem.toString(),
      //  semester: '1',
      section: this.state.Subjects.sections.toString(),
      subjectNo: this.state.Subjects.subno.toString(),
      attDate: this.state.AttendanceDate,
      //attDate: '2021-10-08',
      hour: this.state.hour.toString(),
      //  userId: this.state.userId.toString(),
    });
    console.log(bodyData);
    fetch(url, {
      //  method: 'GET',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        //Authorization:
        //  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkOTM1MDk0MC0zY2JkLTQ0MmEtYjdjNS1hYjZkZmFjMzUxZmEiLCJBcHBObyI6IjUzMzEyIiwiSXNTY2hvb2wiOiJ0cnVlIiwiREIiOiJldXEyZHZTcjA0aysxdUJ6aHVHZElhZ253VXJaZ3B2SXdCWWV3NEdJbzRMM3hjenhXY1ZEUHJwaTRpTkRBM0d3V2ZnNHVVbmtsSUFqV296Z0tGdGJRQ3FpN09rdnRKbWhOUW5VclVQckJaQW0wQjJjME5XRUp1QVNiMkxRRlJ1K2xFVVZnYVZpVGZ6cnd3cTh2YzduT1NYWlBZVmcwR1BUS0toWEZudVdUdUxOZHZnKm9tdnIyZFBzZUF4S0lPcldSVFhKVnZmV0JXVzBXMVZsU3dxMHBJdlo2NXYwRkxqemhlY3F0SG9sbjNYZ3dXTkdKQXJEaU5sdkFFRXZnSGcwNFdNQXpMSDhLeVBHc2NBRjRZNnV3T2IyUVZiK2p3aXgxZk5pQWJZT0ZKWENoTmRTZ2szTXpGUXBWT1BvdE1jb1NoSWlPRFlKKmdZMFYzUXBPZktITUE9PSIsIkJhdGNoWWVhciI6IjIwMjAiLCJDb3Vyc2VOYW1lIjoiQi5FLiIsIkN1cnJlbnRTZW1lc3RlciI6IjEiLCJDdXJyZW50WWVhciI6IiIsIkRlZ3JlZUNvZGUiOiIzNSIsIlJvbGxObyI6IkExMDEiLCJOYW1lIjoiTU9PUlRIWSBLIiwibmJmIjoxNjMzNTM2ODc0LCJleHAiOjE2MzM1NDQwNzQsImlzcyI6InBhbHBhcC1wcm9kLWVudmlyb25tZW50IiwiYXVkIjoicGFscGFwcHJvZHVzZXJzIn0.ugMJxccOrAhyVII_zyDanhToCHCQGoCDBRonfgX5vQE',
        Authorization: 'Bearer ' + this.state.Token,
      },
      body: bodyData,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(JSON.stringify(responseJson));
        //console.log(responseJson.length);
        if (responseJson) {
          //  alert(JSON.stringify(responseJson));
          this.setState(
            {Loader: false, SubjectsDetail: responseJson, refreshing: false},
            function () {},
          );
        } else {
          this.setState({Loader: false, refreshing: false}, function () {
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
        this.setState({Loader: false, refreshing: false}, function () {
          //  alert(error);
          console.log(error);
        });
      });
  };
  onLoadGetHomework = () => {
    this.setState({Loader: true});
    const url = config.baseUrl2 + 'staff/GetStudentHomework';
    console.log(url);
    let bodyData = JSON.stringify({
      batchYear: this.state.Subjects.batchYear.toString(),
      degreeCode: this.state.Subjects.degCode.toString(),
      semester: this.state.Subjects.sem.toString(),
      section: this.state.Subjects.sections.toString(),
      subjectNo: this.state.Subjects.subno.toString(),
      fromDate: this.state.AttendanceDate,
      hour: this.state.hour,
    });
    console.log(bodyData);
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.state.Token,
      },
      body: bodyData,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(JSON.stringify(responseJson));
        //alert(JSON.stringify(responseJson));
        if (responseJson) {
          this.setState(
            {
              Loader: false,
              HomeworkData: responseJson,
              refreshing: false,
            },
            function () {},
          );
        } else {
          this.setState({Loader: false, refreshing: false}, function () {
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
        this.setState({Loader: false, refreshing: false}, function () {
          alert(error);
          console.log(error);
        });
      });
  };

  subjectDetail() {
    return (
      <View style={styles.SubjectMainContainer}>
        <View style={{marginTop: 20, width: '100%', alignSelf: 'center'}}>
          {this.state.SubjectsDetail.length ? (
            this.renderContent()
          ) : !this.state.Loader ? (
            <Animatable.View
              key={Math.random()}
              duration={400}
              style={[
                styles.header,
                {width: '95%', alignSelf: 'center', height: 100},
              ]}
              transition="backgroundColor">
              <Text
                style={[
                  styles.headerText,
                  {textTransform: 'none', color: 'black'},
                ]}>
                No data available
              </Text>
            </Animatable.View>
          ) : null}
        </View>
      </View>
    );
  }
  subjectDetail2() {
    return (
      <View style={styles.SubjectMainContainer}>
        <View style={{marginTop: 20, width: '100%', alignSelf: 'center'}}>
          {this.state.SubjectsDetail.length ? (
            this.renderContent2()
          ) : !this.state.Loader ? (
            <Animatable.View
              key={Math.random()}
              duration={400}
              style={[
                styles.header,
                {width: '95%', alignSelf: 'center', height: 100},
              ]}
              transition="backgroundColor">
              <Text
                style={[
                  styles.headerText,
                  {textTransform: 'none', color: 'black'},
                ]}>
                No data available
              </Text>
            </Animatable.View>
          ) : null}
        </View>
      </View>
    );
  }

  renderContent() {
    let SubjectArr = this.state.SubjectsDetail;
    let subjectCode = this.state.Subjects.subjectCode;
    let filterredUnitName = [];
    var filterredSub = SubjectArr.filter(function (item) {
      //  console.log(item);
      //  return '613AMP03' == item.subjectCode;
      return subjectCode == item.subjectCode;
    });
    //console.log('filterredSub = ', filterredSub);

    filterredUnitName = filterredSub.filter(function (item) {
      //console.log(SubjectArr[0].parentCode);
      return SubjectArr[0].parent_code == item.parent_code;
    });
    let filterredUnitName2 = filterredSub.filter(function (item) {
      //console.log(SubjectArr[0].parentCode);
      return -1 == item.parent_code;
    });
    //console.log('filterredUnitName = ', filterredUnitName);
    return (
      <View>
        {filterredUnitName2.length ? (
          <CommonFlatlist
            refreshing={this.state.refreshing}
            //_onRefresh={this._onRefresh.bind(this)}
            _onRefresh={() => {
              this._onRefresh(this.onPressGetSubjectsDetail());
            }}
            data={filterredUnitName2}
            Loader={this.state.Loader}
            renderItem={({item, index}) => {
              return (
                <Animatable.View
                  key={Math.random()}
                  duration={400}
                  style={[
                    styles.SubjectNameContainer,
                    {
                      borderRadius: 10,
                      marginBottom:
                        this.state.filterredSubTempIndex == index ? 10 : 0,
                      //backgroundColor: 'transparent',
                      backgroundColor:
                        this.state.filterredSubTempIndex == index
                          ? this.state.colorCode
                          : 'transparent',
                    },
                  ]}
                  transition="backgroundColor">
                  <Animatable.View
                    key={Math.random()}
                    duration={400}
                    style={[
                      styles.SubjectNameContainer,
                      {backgroundColor: 'transparent', width: '100%'},
                    ]}
                    transition="backgroundColor">
                    <TouchableOpacity
                      activeOpacity={1}
                      style={{
                        width: '100%',
                        height: item.isCompleted ? 80 : 60,
                        backgroundColor: index % 2 ? '#BBECF2' : 'white',
                        elevation: 3,
                        shadowColor: this.state.colorCode,
                        shadowOpacity: 0.6,
                        borderColor: this.state.colorCode,
                        shadowOffset: {width: 0, height: 3},
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 5,
                        padding: 10,
                      }}>
                      <View
                        style={{
                          height: '80%',
                          width: '100%',
                          //marginVertical: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: 5,
                          justifyContent: 'space-between',
                        }}>
                        <View
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 30,
                            backgroundColor: this.state.colorCode,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              fontFamily: 'Poppins-Regular',
                              fontFamily: 'Poppins-Regular',
                              color: 'white',
                            }}>
                            {index + 1}
                          </Text>
                        </View>
                        <Text
                          numberOfLines={1}
                          style={{
                            fontFamily: 'Poppins-Regular',
                            flex: 1,
                            color: this.state.colorCode,
                            fontWeight: '400',
                            fontSize: ResponsiveSize(config.AppAllHeaderSize),
                            paddingHorizontal: 5,
                            marginLeft: 10,
                          }}>
                          {item.unit_name}
                        </Text>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          {item.file[0]?.filePath != '' ? (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({
                                  ModalVisibleForFileView: true,
                                  tempTopicNumber: item.topic_no,
                                  tempImagePath: item.file,
                                });
                              }}
                              style={styles.iconsStyles}>
                              <CustomFastImage
                                resizeMode={'cover'}
                                style={styles.icons}
                                source={require('../assets/notes.png')}
                              />
                              {item.file.length > 1 && (
                                <View
                                  style={{
                                    width: 15,
                                    height: 15,
                                    backgroundColor: 'gray',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'absolute',
                                    zIndex: 2,
                                    borderRadius: 10,
                                    marginTop: -10,
                                  }}>
                                  <Text style={{color: 'white', fontSize: 8}}>
                                    {item.file.length}
                                  </Text>
                                </View>
                              )}
                            </TouchableOpacity>
                          ) : null}
                          <TouchableOpacity
                            onPress={() => {
                              this.setState(
                                {
                                  topicNumber: item.topic_no,
                                  Attachment2: null,
                                  Attachment: null,
                                  subject: '',
                                  Description: '',
                                },
                                () => {
                                  this.openModel();
                                },
                              );
                            }}
                            style={styles.iconsStyles}>
                            <CustomFastImage
                              resizeMode={'cover'}
                              style={styles.icons}
                              source={require('../assets/camera.png')}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                      {item.isCompleted ? (
                        <Text
                          numberOfLines={1}
                          style={{
                            fontFamily: 'Poppins-Regular',
                            color: 'green',
                            fontWeight: '400',
                            fontWeight: 'bold',
                            textAlign: 'right',
                            alignSelf: 'flex-end',
                          }}>
                          Completed
                        </Text>
                      ) : null}
                    </TouchableOpacity>
                  </Animatable.View>
                </Animatable.View>
              );
            }}
          />
        ) : null}
        <CommonFlatlist
          refreshing={this.state.refreshing}
          //_onRefresh={this._onRefresh.bind(this)}
          _onRefresh={() => {
            this._onRefresh(this.onPressGetSubjectsDetail());
          }}
          data={filterredUnitName}
          Loader={this.state.Loader}
          renderItem={({item, index}) => {
            return (
              <Animatable.View
                key={Math.random()}
                duration={400}
                style={[
                  styles.SubjectNameContainer,
                  {
                    borderRadius: 10,
                    marginBottom:
                      this.state.filterredSubTempIndex == index ? 10 : 0,
                    //backgroundColor: 'transparent',
                    backgroundColor:
                      this.state.filterredSubTempIndex == index
                        ? this.state.colorCode
                        : 'transparent',
                  },
                ]}
                transition="backgroundColor">
                <Animatable.View
                  key={Math.random()}
                  duration={400}
                  style={[
                    styles.SubjectNameContainer,
                    {backgroundColor: 'transparent', width: '100%'},
                  ]}
                  transition="backgroundColor">
                  <TouchableOpacity
                    activeOpacity={1}
                    style={{
                      width: '100%',
                      height: item.isCompleted ? 80 : 60,
                      backgroundColor: index % 2 ? '#BBECF2' : 'white',
                      elevation: 3,
                      shadowColor: this.state.colorCode,
                      shadowOpacity: 0.6,
                      borderColor: this.state.colorCode,
                      shadowOffset: {width: 0, height: 3},
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 5,
                      padding: 10,
                    }}
                    onPress={() => {
                      if (this.state.filterredSubTempIndex == index) {
                        this.setState({
                          filterredSubTempIndex: -1,
                          filterredUnitNameTempIndex: -1,
                          filterredSubUnitNameTempIndex: -1,
                        });
                      } else {
                        this.setState({
                          filterredSubTempIndex: index,
                          filterredUnitNameTempIndex: index,
                          tempTopicNumber: item.topic_no,
                        });
                      }
                    }}>
                    <View
                      style={{
                        height: '80%',
                        width: '100%',
                        //marginVertical: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 5,
                        justifyContent: 'space-between',
                      }}>
                      <View
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 30,
                          backgroundColor: this.state.colorCode,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontFamily: 'Poppins-Regular',
                            fontFamily: 'Poppins-Regular',
                            color: 'white',
                          }}>
                          {index + 1}
                        </Text>
                      </View>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily: 'Poppins-Regular',
                          flex: 1,
                          color: this.state.colorCode,
                          fontWeight: '400',
                          fontSize: ResponsiveSize(config.AppAllHeaderSize),
                          paddingHorizontal: 5,
                          marginLeft: 10,
                        }}>
                        {item.unit_name}
                      </Text>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        {item.file[0]?.filePath != '' ? (
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({
                                ModalVisibleForFileView: true,
                                tempTopicNumber: item.topic_no,
                                tempImagePath: item.file,
                              });
                            }}
                            style={styles.iconsStyles}>
                            <CustomFastImage
                              resizeMode={'cover'}
                              style={styles.icons}
                              source={require('../assets/notes.png')}
                            />
                            {item.file.length > 1 && (
                              <View
                                style={{
                                  width: 15,
                                  height: 15,
                                  backgroundColor: 'gray',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  position: 'absolute',
                                  zIndex: 2,
                                  borderRadius: 10,
                                  marginTop: -10,
                                }}>
                                <Text style={{color: 'white', fontSize: 8}}>
                                  {item.file.length}
                                </Text>
                              </View>
                            )}
                          </TouchableOpacity>
                        ) : null}
                        <TouchableOpacity
                          onPress={() => {
                            this.setState(
                              {
                                topicNumber: item.topic_no,
                                Attachment2: null,
                                Attachment: null,
                                subject: '',
                                Description: '',
                              },
                              () => {
                                this.openModel();
                              },
                            );
                          }}
                          style={styles.iconsStyles}>
                          <CustomFastImage
                            resizeMode={'cover'}
                            style={styles.icons}
                            source={require('../assets/camera.png')}
                          />
                        </TouchableOpacity>
                      </View>
                      {this.state.filterredSubTempIndex == index ? (
                        <CustomFastImage
                          resizeMode={'contain'}
                          style={{width: 15, height: 15}}
                          source={require('../assets/ArrowUpBlack.png')}
                        />
                      ) : (
                        <CustomFastImage
                          resizeMode={'contain'}
                          style={{width: 15, height: 15}}
                          source={require('../assets/ArrowDownBlack.png')}
                        />
                      )}
                    </View>
                    {item.isCompleted ? (
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily: 'Poppins-Regular',
                          color: 'green',
                          fontWeight: '400',
                          fontWeight: 'bold',
                          textAlign: 'right',
                          alignSelf: 'flex-end',
                        }}>
                        Completed
                      </Text>
                    ) : null}
                  </TouchableOpacity>
                  <Animatable.View
                    key={Math.random()}
                    duration={400}
                    style={{
                      backgroundColor: 'white',
                      width: '95%',
                      alignSelf: 'center',
                      borderRadius: 5,
                      marginTop: 10,
                    }}
                    transition="backgroundColor">
                    {this.state.filterredUnitNameTempIndex == index
                      ? this.renderContent3(item.topic_no)
                      : null}
                  </Animatable.View>
                </Animatable.View>
              </Animatable.View>
            );
          }}
        />
      </View>
    );
  }
  renderContent2() {
    let SubjectArr = this.state.SubjectsDetail;
    let subjectCode = this.state.Subjects.subjectCode;
    let filterredUnitName = [];
    var filterredSub = SubjectArr.filter(function (item) {
      //  console.log(item);
      //  return '613AMP03' == item.subjectCode;
      return subjectCode == item.subjectCode;
    });
    //console.log('filterredSub = ', filterredSub);

    filterredUnitName = filterredSub.filter(function (item) {
      //console.log(SubjectArr[0].parentCode);
      return SubjectArr[0].parenT_CODE == item.parenT_CODE;
    });
    let filterredUnitName2 = filterredSub.filter(function (item) {
      //console.log(SubjectArr[0].parentCode);
      return -1 == item.parent_code;
    });
    //console.log('filterredUnitName = ', filterredUnitName);
    return (
      <View>
        {filterredUnitName2.length ? (
          <CommonFlatlist
            refreshing={this.state.refreshing}
            //_onRefresh={this._onRefresh.bind(this)}
            _onRefresh={() => {
              this._onRefresh(this.onPressGetSubjectsDetail());
            }}
            data={filterredUnitName2}
            Loader={this.state.Loader}
            renderItem={({item, index}) => {
              return (
                <Animatable.View
                  key={Math.random()}
                  duration={400}
                  style={[
                    styles.SubjectNameContainer,
                    {
                      borderRadius: 10,
                      marginBottom:
                        this.state.filterredSubTempIndex == index ? 10 : 0,
                      //backgroundColor: 'transparent',
                      backgroundColor:
                        this.state.filterredSubTempIndex == index
                          ? this.state.colorCode
                          : 'transparent',
                    },
                  ]}
                  transition="backgroundColor">
                  <Animatable.View
                    key={Math.random()}
                    duration={400}
                    style={[
                      styles.SubjectNameContainer,
                      {backgroundColor: 'transparent', width: '100%'},
                    ]}
                    transition="backgroundColor">
                    <TouchableOpacity
                      activeOpacity={1}
                      style={{
                        width: '100%',
                        height: item.isCompleted ? 80 : 60,
                        backgroundColor: index % 2 ? '#BBECF2' : 'white',
                        elevation: 3,
                        shadowColor: this.state.colorCode,
                        shadowOpacity: 0.6,
                        borderColor: this.state.colorCode,
                        shadowOffset: {width: 0, height: 3},
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 5,
                        padding: 10,
                      }}>
                      <View
                        style={{
                          height: '80%',
                          width: '100%',
                          //marginVertical: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: 5,
                          justifyContent: 'space-between',
                        }}>
                        <View
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 30,
                            backgroundColor: this.state.colorCode,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              fontFamily: 'Poppins-Regular',
                              fontFamily: 'Poppins-Regular',
                              color: 'white',
                            }}>
                            {index + 1}
                          </Text>
                        </View>
                        <Text
                          numberOfLines={1}
                          style={{
                            fontFamily: 'Poppins-Regular',
                            flex: 1,
                            color: this.state.colorCode,
                            fontWeight: '400',
                            fontSize: ResponsiveSize(config.AppAllHeaderSize),
                            paddingHorizontal: 5,
                            marginLeft: 10,
                          }}>
                          {item.unit_name}
                        </Text>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          {item.file[0]?.filePath != '' ? (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({
                                  ModalVisibleForFileView: true,
                                  tempTopicNumber: item.topic_no,
                                  tempImagePath: item.file,
                                });
                              }}
                              style={styles.iconsStyles}>
                              <CustomFastImage
                                resizeMode={'cover'}
                                style={styles.icons}
                                source={require('../assets/notes.png')}
                              />
                              {item.file.length > 1 && (
                                <View
                                  style={{
                                    width: 15,
                                    height: 15,
                                    backgroundColor: 'gray',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'absolute',
                                    zIndex: 2,
                                    borderRadius: 10,
                                    marginTop: -10,
                                  }}>
                                  <Text style={{color: 'white', fontSize: 8}}>
                                    {item.file.length}
                                  </Text>
                                </View>
                              )}
                            </TouchableOpacity>
                          ) : null}
                          <TouchableOpacity
                            onPress={() => {
                              this.setState(
                                {
                                  topicNumber: item.topic_no,
                                  Attachment2: null,
                                  Attachment: null,
                                  subject: '',
                                  Description: '',
                                },
                                () => {
                                  this.openModel();
                                },
                              );
                            }}
                            style={styles.iconsStyles}>
                            <CustomFastImage
                              resizeMode={'cover'}
                              style={styles.icons}
                              source={require('../assets/camera.png')}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                      {item.isCompleted ? (
                        <Text
                          numberOfLines={1}
                          style={{
                            fontFamily: 'Poppins-Regular',
                            color: 'green',
                            fontWeight: '400',
                            fontWeight: 'bold',
                            textAlign: 'right',
                            alignSelf: 'flex-end',
                          }}>
                          Completed
                        </Text>
                      ) : null}
                    </TouchableOpacity>
                  </Animatable.View>
                </Animatable.View>
              );
            }}
          />
        ) : null}
        <CommonFlatlist
          refreshing={this.state.refreshing}
          //_onRefresh={this._onRefresh.bind(this)}
          _onRefresh={() => {
            this._onRefresh(this.onLoadGetHomework());
          }}
          data={this.state.HomeworkData}
          Loader={this.state.Loader}
          renderItem={({item, index}) => {
            return (
              <Animatable.View
                key={Math.random()}
                duration={400}
                style={[
                  styles.SubjectNameContainer,
                  {
                    borderRadius: 10,
                    marginBottom:
                      this.state.filterredSubTempIndex2 == index ? 10 : 0,
                    //backgroundColor: 'transparent',
                    backgroundColor:
                      this.state.filterredSubTempIndex2 == index
                        ? this.state.colorCode
                        : 'transparent',
                  },
                ]}
                transition="backgroundColor">
                <Animatable.View
                  key={Math.random()}
                  duration={400}
                  style={[
                    styles.SubjectNameContainer,
                    {backgroundColor: 'transparent', width: '100%'},
                  ]}
                  transition="backgroundColor">
                  <TouchableOpacity
                    activeOpacity={1}
                    style={{
                      width: '100%',
                      height: item.isCompleted ? 80 : 60,
                      backgroundColor: index % 2 ? '#BBECF2' : 'white',
                      elevation: 3,
                      shadowColor: this.state.colorCode,
                      shadowOpacity: 0.6,
                      borderColor: this.state.colorCode,
                      shadowOffset: {width: 0, height: 3},
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 5,
                      padding: 10,
                    }}
                    onPress={() => {
                      if (this.state.filterredSubTempIndex2 == index) {
                        this.setState({
                          filterredSubTempIndex2: -1,
                          filterredUnitNameTempIndex2: -1,
                          filterredSubUnitNameTempIndex2: -1,
                        });
                      } else {
                        this.setState({
                          filterredSubTempIndex2: index,
                          filterredUnitNameTempIndex2: index,
                          tempTopicNumber: item.topic_no,
                        });
                      }
                    }}>
                    <View
                      style={{
                        height: '80%',
                        width: '100%',
                        //marginVertical: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 5,
                        justifyContent: 'space-between',
                      }}>
                      <View
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 30,
                          backgroundColor: this.state.colorCode,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontFamily: 'Poppins-Regular',
                            fontFamily: 'Poppins-Regular',
                            color: 'white',
                          }}>
                          {index + 1}
                        </Text>
                      </View>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily: 'Poppins-Regular',
                          flex: 1,
                          color: this.state.colorCode,
                          fontWeight: '400',
                          fontSize: ResponsiveSize(config.AppAllHeaderSize),
                          paddingHorizontal: 5,
                          marginLeft: 10,
                        }}>
                        {item.uniT_NAME}
                      </Text>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        {item.file[0]?.filePath != '' ? (
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({
                                ModalVisibleForFileView2: true,
                                tempTopicNumber: item.topic_no,
                                tempImagePath: item.file,
                              });
                            }}
                            style={styles.iconsStyles}>
                            <CustomFastImage
                              resizeMode={'cover'}
                              style={styles.icons}
                              source={require('../assets/notes.png')}
                            />
                            {item.file.length > 1 && (
                              <View
                                style={{
                                  width: 15,
                                  height: 15,
                                  backgroundColor: 'gray',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  position: 'absolute',
                                  zIndex: 2,
                                  borderRadius: 10,
                                  marginTop: -10,
                                }}>
                                <Text style={{color: 'white', fontSize: 8}}>
                                  {item.file.length}
                                </Text>
                              </View>
                            )}
                          </TouchableOpacity>
                        ) : null}
                        <TouchableOpacity
                          onPress={() => {
                            this.setState(
                              {
                                topicNumber: item.topic_no,
                                Attachment2: null,
                                Attachment: null,
                                subject: '',
                                Description: '',
                              },
                              () => {
                                this.openModel2();
                              },
                            );
                          }}
                          style={styles.iconsStyles}>
                          <CustomFastImage
                            resizeMode={'cover'}
                            style={styles.icons}
                            source={require('../assets/camera.png')}
                          />
                        </TouchableOpacity>
                      </View>
                      {this.state.filterredSubTempIndex2 == index ? (
                        <CustomFastImage
                          resizeMode={'contain'}
                          style={{width: 15, height: 15}}
                          source={require('../assets/ArrowUpBlack.png')}
                        />
                      ) : (
                        <CustomFastImage
                          resizeMode={'contain'}
                          style={{width: 15, height: 15}}
                          source={require('../assets/ArrowDownBlack.png')}
                        />
                      )}
                    </View>
                    {item.isCompleted ? (
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily: 'Poppins-Regular',
                          color: 'green',
                          fontWeight: '400',
                          fontWeight: 'bold',
                          textAlign: 'right',
                          alignSelf: 'flex-end',
                        }}>
                        Completed
                      </Text>
                    ) : null}
                  </TouchableOpacity>
                  <Animatable.View
                    key={Math.random()}
                    duration={400}
                    style={{
                      backgroundColor: 'white',
                      width: '95%',
                      alignSelf: 'center',
                      borderRadius: 5,
                      marginTop: 10,
                    }}
                    transition="backgroundColor">
                    {this.state.filterredUnitNameTempIndex2 == index
                      ? this.renderContent32(item.topic_no.toString())
                      : null}
                  </Animatable.View>
                </Animatable.View>
              </Animatable.View>
            );
          }}
        />

        {/*<TouchableOpacity
          onPress={() => {
            this.setState(
              {
                topicNumber: '',
                Attachment2: null,
                Attachment: null,
                subject: '',
                Description: '',
              },
              () => {
                this.openModel2();
              },
            );
          }}
          style={[styles.iconsStyles, {alignSelf: 'center'}]}>
          <CustomFastImage
            resizeMode={'cover'}
            style={styles.icons}
            source={require('../assets/camera.png')}
          />
        </TouchableOpacity>*/}
      </View>
    );
  }
  renderContent3(topicNumber) {
    console.log(topicNumber);
    let SubjectArr = this.state.SubjectsDetail;
    var filterredSubUnitName = SubjectArr.filter(function (item) {
      return item.parent_code == topicNumber;
    });
    console.log('filterredSubUnitName = ', filterredSubUnitName);
    return (
      <Animatable.View
        duration={400}
        style={{width: '95%', alignSelf: 'center'}}
        transition="backgroundColor">
        <CommonFlatlist
          refreshing={this.state.refreshing}
          //_onRefresh={this._onRefresh.bind(this)}
          _onRefresh={() => {
            this.setState({refreshing: false});
            //   this._onRefresh(this.onPressGetSubjectsDetail());
          }}
          data={filterredSubUnitName}
          Loader={this.state.Loader}
          renderItem={this.renderTopic}
        />
      </Animatable.View>
    );
  }
  renderContent32(topicNumber) {
    let SubjectArr = this.state.SubjectsDetail;
    var filterredSubUnitName = SubjectArr.filter(function (item) {
      return item.parenT_CODE == topicNumber;
    });
    //console.log('filterredSubUnitName = ', filterredSubUnitName);
    return (
      <Animatable.View
        duration={400}
        style={{width: '95%', alignSelf: 'center'}}
        transition="backgroundColor">
        <CommonFlatlist
          refreshing={this.state.refreshing}
          //_onRefresh={this._onRefresh.bind(this)}
          _onRefresh={() => {
            this.setState({refreshing: false});
            //   this._onRefresh(this.onPressGetSubjectsDetail());
          }}
          data={filterredSubUnitName}
          Loader={this.state.Loader}
          renderItem={this.renderTopic2}
        />
      </Animatable.View>
    );
  }
  renderTopic = ({item, index}) => {
    //filterredSubUnitName.map((item, index) => {
    return (
      <Animatable.View
        key={Math.random()}
        duration={400}
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
        transition="backgroundColor">
        <View style={{flex: 1}}>
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              textAlign: 'left',
              padding: 10,
            }}>
            {item.unit_name}
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {item.file[0]?.filePath != '' ? (
            <TouchableOpacity
              onPress={() => {
                //alert(item.file.filePath);
                this.setState({
                  ModalVisibleForFileView: true,
                  tempTopicNumber: item.topic_no,
                  tempImagePath: item.file,
                });
              }}
              style={styles.iconsStyles}>
              <CustomFastImage
                resizeMode={'contain'}
                style={styles.icons}
                source={require('../assets/file.png')}
              />
              {/*{this.state.Arr.length > 1 || item.filePath && (
                  <View
                    style={{
                      width: 15,
                      height: 15,
                      backgroundColor: 'gray',
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'absolute',
                      zIndex: 2,
                      borderRadius: 10,
                      marginTop: -10,
                    }}>
                    <Text style={{color: 'white', fontSize: 8}}>
                      {this.state.Arr.length}
                    </Text>
                  </View>
                )}*/}
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            onPress={() => {
              this.setState(
                {
                  topicNumber: item.topic_no,
                  Attachment2: null,
                  Attachment: null,
                  subject: '',
                  Description: '',
                },
                () => {
                  this.openModel();
                },
              );
            }}
            style={styles.iconsStyles}>
            <CustomFastImage
              resizeMode={'cover'}
              style={styles.icons}
              source={require('../assets/camera.png')}
            />
          </TouchableOpacity>
        </View>
      </Animatable.View>
    );
  };
  renderTopic2 = ({item, index}) => {
    //filterredSubUnitName.map((item, index) => {
    return (
      <Animatable.View
        key={Math.random()}
        duration={400}
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
        transition="backgroundColor">
        <View style={{flex: 1}}>
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              textAlign: 'left',
              padding: 10,
            }}>
            {item.uniT_NAME}
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {item.file[0]?.filePath != '' ? (
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  ModalVisibleForFileView2: true,
                  tempTopicNumber: item.topic_no,
                  tempImagePath: item.file,
                });
              }}
              style={styles.iconsStyles}>
              <CustomFastImage
                resizeMode={'cover'}
                style={styles.icons}
                source={require('../assets/notes.png')}
              />
              {/*{this.state.Arr2.length > 1 && (
                <View
                  style={{
                    width: 15,
                    height: 15,
                    backgroundColor: 'gray',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    zIndex: 2,
                    borderRadius: 10,
                    marginTop: -10,
                  }}>
                  <Text style={{color: 'white', fontSize: 8}}>
                    {this.state.Arr2.length}
                  </Text>
                </View>
              )}*/}
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            onPress={() => {
              this.setState(
                {
                  topicNumber: item.topic_no,
                  Attachment2: null,
                  Attachment: null,
                  subject: '',
                  Description: '',
                },
                () => {
                  this.openModel2();
                },
              );
            }}
            style={styles.iconsStyles}>
            <CustomFastImage
              resizeMode={'cover'}
              style={styles.icons}
              source={require('../assets/camera.png')}
            />
          </TouchableOpacity>
        </View>
      </Animatable.View>
    );
  };
  render() {
    return (
      <SafeAreaView
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: config.bgColor,
        }}>
        {!this.state.isReuse && (
          <CustomHeader
            isHome={false}
            title={this.state.Subjects.subjectName}
            navigation={this.props.navigation}
          />
        )}
        <Loader
          Loading={this.state.Loader ? true : false}
          onPressCancel={() => {
            this.setState({Loader: false});
          }}
        />
        <View style={[styles.SubjectMainContainer, {height: '93%'}]}>
          <ButtonSwitcher
            width="95%"
            selected={this.state.Indentifier}
            color={this.state.colorCode}
            title="Notes"
            title2="Homework"
            onPress={() => {
              this.setState({Indentifier: 'Notes'});
            }}
            onPress2={() => {
              this.setState({Indentifier: 'Homework'}, () => {
                //this.onLoadGetHomework();
              });
            }}
          />
          {this.state.Indentifier == 'Notes'
            ? this.subjectDetail()
            : this.subjectDetail2()}
        </View>

        <TouchableOpacity
          onPress={() => {
            this.setState(
              {
                topicNumber: '',
                Attachment2: null,
                Attachment: null,
                subject: '',
                Description: '',
              },
              () => {
                if (this.state.Indentifier == 'Homework') {
                  this.openModel2();
                } else {
                  this.openModel();
                }
              },
            );
          }}
          style={{
            width: 60,
            height: 60,
            borderRadius: 60,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: this.state.colorCode,
            position: 'absolute',
            bottom: 10,
            right: 10,
            zIndex: 2,
            marginLeft: Dimensions.get('window').width - 80,
            marginTop: Dimensions.get('window').height - 80,
            elevation: 3,
            shadowOffset: {width: 0, height: 0},
            shadowColor: config.themeColor,
            shadowOpacity: 0.5,
          }}>
          <Text
            style={[
              styles.text,
              {color: 'white', fontSize: 18, fontWeight: 'bold'},
            ]}>
            +
          </Text>
        </TouchableOpacity>
        {this.state.ImageView && (
          <ImageView
            images={[{uri: this.state.TempImg}]}
            imageIndex={0}
            visible={this.state.ImageView}
            onRequestClose={() => {
              this.setState({ImageView: false});
            }}
          />
        )}
        <Overlay
          isVisible={this.state.ModalVisible}
          overlayStyle={{
            margin: 10,
            borderRadius: 10,
            height: heightPercentageToDP('40%'),
            //height: heightPercentageToDP(this.state.Notes ? '40%' : '70%'),
            //marginVertical: 50,
            //  backgroundColor: config.bgColor,
          }}>
          <FormForNotes
            heading={'Notes'}
            Notes={true}
            send={(data) => {
              //  console.log(data);
              this.setState(
                {
                  ModalVisible: false,
                  Notes: false,
                  Attachment2: data.NotesAttachment,
                },
                () => {
                  this.setState({Loader: true}, () =>
                    this.onPressUploadNotes(1),
                  );
                },
              );
            }}
            dismiss={() => {
              this.setState({ModalVisible: false});
            }}
          />
        </Overlay>
        <Overlay
          isVisible={this.state.ModalVisible2}
          overlayStyle={{
            margin: 10,
            borderRadius: 10,
            height: heightPercentageToDP('70%'),
            //height: heightPercentageToDP(this.state.Notes ? '40%' : '70%'),
            //marginVertical: 50,
            //  backgroundColor: config.bgColor,
          }}>
          <FormForNotes
            Homework={true}
            heading={'Homework'}
            send={(data) => {
              //  console.log(data);
              this.setState(
                {
                  ModalVisible2: false,
                  Homework: false,
                  Attachment: data.HomeworkAttachment,
                  subject: data.subject,
                  Description: data.Description,
                  //  TempImg: data.HomeworkAttachment2.uri,
                },
                () => {
                  this.setState({Loader: true}, () =>
                    this.onPressUploadHomework(1),
                  );
                },
              );
            }}
            dismiss={() => {
              this.setState({ModalVisible2: false});
            }}
          />
        </Overlay>
        <Overlay
          isVisible={this.state.ModalVisibleForFileView}
          overlayStyle={{
            margin: 10,
            borderRadius: 10,
            height: heightPercentageToDP('50%'),
            //height: heightPercentageToDP(this.state.Notes ? '40%' : '70%'),
            //marginVertical: 50,
            //  backgroundColor: config.bgColor,
          }}>
          <FileList
            Arr={this.state.tempImagePath}
            onPress2={(data) => {
              Alert.alert('Confirmation', 'Are you sure to delete this file?', [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'No',
                },
                {
                  text: 'Yes',
                  onPress: () =>
                    //this.onPressUploadHomework(
                    //  0,
                    //  data,
                    //  this.state.tempTopicNumber,
                    //),
                    this.setState({Loader: true}, () =>
                      this.onPressUploadNotes(
                        0,
                        data,
                        this.state.tempTopicNumber,
                      ),
                    ),
                },
              ]);
            }}
            Loader={this.state.Loader}
            onPress={(file) => {
              //  alert('download');
              this.setState({Loader: true}, () =>
                this.checkPermission(file, file),
              );
            }}
            Success={this.state.Success}
            dismiss={() => {
              this.setState({ModalVisibleForFileView: false});
            }}
          />
        </Overlay>
        <Overlay
          isVisible={this.state.ModalVisibleForFileView2}
          overlayStyle={{
            margin: 10,
            borderRadius: 10,
            height: heightPercentageToDP('70%'),
            //height: heightPercentageToDP(this.state.Notes ? '40%' : '70%'),
            //marginVertical: 50,
            //  backgroundColor: config.bgColor,
          }}>
          <FileList
            Arr={this.state.tempImagePath}
            onPress2={(data) => {
              console.log('data img = ', data);
              Alert.alert('Confirmation', 'Are you sure to delete this file?', [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'No',
                },
                {
                  text: 'Yes',
                  onPress: () =>
                    this.setState({Loader: true}, () =>
                      this.onPressUploadHomework(
                        0,
                        data,
                        this.state.tempTopicNumber,
                      ),
                    ),
                },
              ]);
            }}
            Loader={this.state.Loader}
            onPress={(file) => {
              //  alert('download');
              this.setState({Loader: true}, () =>
                this.checkPermission(file, file),
              );
            }}
            Success={this.state.Success}
            dismiss={() => {
              this.setState({ModalVisibleForFileView2: false});
            }}
          />
        </Overlay>
      </SafeAreaView>
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
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
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
  iconsStyles: {
    marginTop: heightPercentageToDP('1%'),
    width: 35,
    height: 35,
    padding: 10,
    borderRadius: 35,
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    marginRight: 10,
  },
  icons: {
    width: 25,
    height: 25,
  },
});
