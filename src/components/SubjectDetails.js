import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {
  StyleSheet,
  BackHandler,
  Linking,
  PermissionsAndroid,
  Platform,
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
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import ButtonSwitcher from './common/ButtonSwitcher';
var filterredUnitName = [];
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};
const LightGreenColor = '#BBECF2';
const BlueColor = '#6397F2';

export default class SubjectsDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Indentifier: 'Syllabus & Notes',
      colorCode: this.props?.route?.params?.colorCode || '',
      colorCode2: this.props?.route?.params?.colorCode2,
      Subjects: this.props?.route?.params?.Subjects || {},
      SubjectNo: this.props?.route?.params?.Subjects?.subjectNo || '',
      refreshing: false,
      homeWorkStartDate: '',
      homeWorkEndDate: '',
      HomeWorkData: [],
      Loader: true,
      Attachment: null,
      SubjectsDetail: [],
      GetLessonData: [],
      filterredSubTempIndex: -1,
      filterredSubUnitNameTempIndex: -1,
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
        this.setState({Token: value}, function () {
          //this.onPressGetSubjectsDetail();
          this.onLoadGetNotes();
          let date = new Date();
          let finalCurrentDate = moment(date).format('YYYY-MM-DD');
          let newdate = date.setDate(date.getDate() - 7);
          var finalDate = moment(newdate).format('YYYY-MM-DD');
          this.setState(
            {
              iClassEndDate: finalCurrentDate,
              iClassStartDate: finalDate,
            },
            function () {
              this.onPressGetIClassLesson();
            },
          );
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
        this.setState({Loader: false});
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
  onLoadGetNotes = () => {
    const url =
      config.baseUrl + 'student/GetStudentSubjectNotes/' + this.state.SubjectNo;
    console.log(url);
    //let bodyData = JSON.stringify({
    //  SubjectNo: this.state.SubjectNo.toString(),
    //});
    //console.log(bodyData);
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.state.Token,
      },
      //body: bodyData,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        //alert(JSON.stringify(responseJson));
        if (responseJson) {
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
          alert(error);
          console.log(error);
        });
      });
  };
  onLoadGetHomework = () => {
    this.setState({Loader: true});
    const url = config.baseUrl + 'student/GetStudentHomework';
    console.log(url);
    let bodyData = JSON.stringify({
      fromDate: this.state.homeWorkStartDate,
      toDate: this.state.homeWorkEndDate,
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
        console.log(responseJson);
        alert(JSON.stringify(responseJson));
        if (responseJson) {
          this.setState(
            {
              Loader: false,
              HomeWorkData: responseJson,
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
  //onPressGetSubjectsDetail = () => {
  //  const url = config.baseUrl + 'student/SubjectSyllabusDetails';
  //  //console.log(url);
  //  fetch(url, {
  //    method: 'GET',
  //    headers: {
  //      Accept: 'application/json',
  //      'Content-Type': 'application/json',
  //      Authorization: 'Bearer ' + this.state.Token,
  //    },
  //  })
  //    .then((response) => response.json())
  //    .then((responseJson) => {
  //      //console.log(responseJson);
  //      if (responseJson) {
  //        this.setState(
  //          {Loader: false, SubjectsDetail: responseJson, refreshing: false},
  //          function () {},
  //        );
  //      } else {
  //        this.setState({Loader: false, refreshing: false}, function () {
  //          Toast.show(
  //            responseJson.title
  //              ? responseJson.title
  //              : 'Temporary error try again after some time',
  //            ToastData,
  //          );
  //        });
  //      }
  //    })
  //    .catch((error) => {
  //      this.setState({Loader: false, refreshing: false}, function () {
  //        alert(error);
  //        console.log(error);
  //      });
  //    });
  //};
  onPressGetIClassLesson = () => {
    const url = config.baseUrl + 'student/GetLessonPlanData';
    console.log(url);
    //console.log(
    //  JSON.stringify({
    //    rollNo: this.props.route.params.Subjects.rollNo,
    //    subjectNo: this.props.route.params.Subjects.subjectNo,
    //    fromDate: this.state.iClassStartDate,
    //    toDate: this.state.iClassEndDate,
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
        rollNo: this.props.route.params.Subjects.rollNo,
        subjectNo: this.props.route.params.Subjects.subjectNo.toString(),
        fromDate: this.state.iClassStartDate,
        toDate: this.state.iClassEndDate,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('responseJson = ', responseJson);
        if (responseJson) {
          this.setState(
            {
              Loader: false,
              GetLessonData: responseJson,
              ApiRequestRequired2: false,
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
        console.log(error);
        this.setState({Loader: false, refreshing: false}, function () {
          alert(error);
        });
      });
  };

  iClassDetail() {
    return (
      <View style={[styles.SubjectMainContainer, {backgroundColor: '#F9F9F9'}]}>
        <View
          style={[
            styles.AttendanceCustomDateTextView,
            {marginTop: 10, marginBottom: 20},
          ]}>
          <View
            style={{
              width: '90%',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <DatePicker
              date={this.state.iClassStartDate}
              mode="date"
              placeholder="from date"
              format="YYYY-MM-DD"
              //minDate="2020-01-01"
              //maxDate={new Date()}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              showIcon={false}
              onDateChange={(date) => {
                this.setState(
                  {
                    iClassStartDate: date,
                    ApiRequestRequired2: true,
                    Loader: true,
                  },
                  function () {
                    this.state.iClassStartDate != '' &&
                    this.state.iClassEndDate != '' &&
                    this.state.ApiRequestRequired2
                      ? this.onPressGetIClassLesson()
                      : null;
                  },
                );
              }}
            />
            <Text style={{fontFamily: 'Poppins-Regular', color: 'gray'}}>
              -
            </Text>
            <DatePicker
              date={this.state.iClassEndDate}
              mode="date"
              placeholder="to date"
              format="YYYY-MM-DD"
              //minDate="2020-01-01"
              //maxDate={new Date()}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              showIcon={false}
              onDateChange={(date) => {
                this.setState(
                  {
                    iClassEndDate: date,
                    ApiRequestRequired2: true,
                    Loader: true,
                  },
                  function () {
                    this.state.iClassStartDate != '' &&
                    this.state.iClassEndDate != '' &&
                    this.state.ApiRequestRequired2
                      ? this.onPressGetIClassLesson()
                      : null;
                  },
                );
              }}
            />
          </View>
          <CustomFastImage
            resizeMode={'contain'}
            style={{width: 20, height: 20}}
            source={require('../assets/calendar.png')}
          />
        </View>
        <View style={{width: '100%', height: '85%'}}>
          <CommonFlatlist
            refreshing={this.state.refreshing}
            //_onRefresh={this._onRefresh.bind(this)}
            _onRefresh={() => {
              this._onRefresh(this.onPressGetIClassLesson());
            }}
            data={this.state.GetLessonData}
            Loader={this.state.Loader}
            renderItem={this.renderItem}
          />
        </View>
      </View>
    );
  }
  HomeworkDetail() {
    return (
      <View style={[styles.SubjectMainContainer, {backgroundColor: '#F9F9F9'}]}>
        <View style={{width: '100%', height: '85%'}}>
          <View
            style={[
              styles.AttendanceCustomDateTextView,
              {marginTop: 10, marginBottom: 20, alignSelf: 'center'},
            ]}>
            <View
              style={{
                width: '90%',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <DatePicker
                date={this.state.homeWorkStartDate}
                mode="date"
                placeholder="from date"
                format="YYYY-MM-DD"
                //minDate="2020-01-01"
                maxDate={
                  this.state.homeWorkEndDate == ''
                    ? new Date()
                    : this.state.homeWorkEndDate
                }
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                showIcon={false}
                onDateChange={(date) => {
                  this.setState(
                    {
                      homeWorkStartDate: date,
                    },
                    function () {
                      this.state.homeWorkStartDate != '' &&
                        this.state.homeWorkEndDate != '' &&
                        this.onLoadGetHomework();
                    },
                  );
                }}
              />
              <Text style={{fontFamily: 'Poppins-Regular', color: 'gray'}}>
                -
              </Text>
              <DatePicker
                date={this.state.homeWorkEndDate}
                mode="date"
                placeholder="to date"
                format="YYYY-MM-DD"
                minDate={
                  this.state.homeWorkStartDate == ''
                    ? '2010-01-01'
                    : this.state.homeWorkStartDate
                }
                maxDate={new Date()}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                showIcon={false}
                onDateChange={(date) => {
                  this.setState(
                    {
                      homeWorkEndDate: date,
                    },
                    function () {
                      this.state.homeWorkStartDate != '' &&
                        this.state.homeWorkEndDate != '' &&
                        this.onLoadGetHomework();
                    },
                  );
                }}
              />
            </View>
            <CustomFastImage
              resizeMode={'contain'}
              style={{width: 20, height: 20}}
              source={require('../assets/calendar.png')}
            />
          </View>

          {this.state.homeWorkStartDate != '' ||
          this.state.homeWorkEndDate != '' ? (
            <CommonFlatlist
              refreshing={this.state.refreshing}
              //_onRefresh={this._onRefresh.bind(this)}
              _onRefresh={() => {
                this._onRefresh(this.onLoadGetHomework());
              }}
              data={this.state.HomeWorkData}
              Loader={this.state.Loader}
              renderItem={this.renderItem}
            />
          ) : (
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
                You Need To Select Date Range For Getting Homework
              </Text>
            </Animatable.View>
          )}
        </View>
      </View>
    );
  }
  renderItem = ({item, index}) => {
    //console.log('item iclass = ', item);
    return (
      <View
        style={[
          styles.SubjectNameImageView,
          {
            width: '100%',
            height: 180,
            //marginTop: 30,

            justifyContent: 'center',
            //backgroundColor: 'red',
          },
        ]}>
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              width: '50%',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <CustomFastImage
              resizeMode={'contain'}
              style={{
                width: 20,
                height: 20,
                marginRight: 10,
              }}
              source={require('../assets/calendar.png')}
            />
            <Text
              numberOfLines={2}
              style={[
                styles.StaffDetailTextStyle,
                {color: this.state.colorCode},
              ]}>
              {moment(item.creationDateTime).format('DD MMM, YYYY')}
            </Text>
          </View>
          <View
            style={{
              width: '50%',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <CustomFastImage
              resizeMode={'contain'}
              style={{
                width: 20,
                height: 20,
                marginRight: 10,
              }}
              source={require('../assets/timer2.png')}
            />
            <Text
              numberOfLines={2}
              style={[
                styles.StaffDetailTextStyle,
                {color: this.state.colorCode},
              ]}>
              {moment(item.startTime).format('hh:mm a') + ' to '}
              {moment(item.endTime).format('hh:mm a')}
            </Text>
          </View>
        </View>
        <CustomFastImage
          resizeMode={'stretch'}
          style={[
            styles.SubjectNameImageView,
            {
              height: 180,
              width: '100%',
              position: 'absolute',
            },
          ]}
          source={
            this.state.colorCode2 == '#0047C3'
              ? require('../assets/blueBg1.png')
              : this.state.colorCode2 == '#008B9B'
              ? require('../assets/greenBg1.png')
              : this.state.colorCode2 == '#7260E9'
              ? require('../assets/purpleBg1.png')
              : require('../assets/purpleBg1.png')
          }
        />
        <View
          style={{
            width: '100%',
            height: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 10,
            alignItems: 'center',
            paddingBottom: 30,
          }}>
          <TouchableOpacity
            onPress={() => {
              if (item.videoUrl) {
                //let tempUrl = item.videoUrl;
                ////console.log('tempUrl = ', tempUrl);
                ////let tempUrl =
                ////  'https://www.youtube.com/watch?v=UhU-f3JAIsA';
                //let SplitedUrl = tempUrl.split('?v=');
                ////console.log('SplitedUrl = ', SplitedUrl);
                //let url = SplitedUrl[1].split('&');
                //let FinalUrl = url[0];
                ////console.log('FinalUrl = ', FinalUrl);
                //this.props.navigation.navigate('Youtube', {
                //  url: FinalUrl,
                //});
                this.props.navigation.navigate('Youtube', {
                  url: item.videoUrl,
                });
              } else {
                Toast.show('No Url Found', ToastData);
              }
            }}
            style={{
              width: '30%',
              height: '70%',
              justifyContent: 'center',
              alignItems: 'center',
              //alignItems: 'flex-end',
              marginBottom: 5,
              //backgroundColor: 'red',
              //padding: ResponsiveSize(8),
            }}>
            <View
              style={{
                width: '60%',
                height: '80%',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
              }}>
              <CustomFastImage
                resizeMode={'cover'}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 10,
                }}
                //source={{
                //  uri: `data:image/jpeg;base64,${this.state.Subjects.staffImage}`,
                //}}
                source={require('../assets/demoPic.png')}
              />
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  position: 'absolute',
                  zIndex: 2,
                }}
                onPress={() => {
                  if (item.videoUrl) {
                    //let tempUrl = item.videoUrl;
                    ////console.log('tempUrl = ', tempUrl);
                    ////let tempUrl =
                    ////  'https://www.youtube.com/watch?v=UhU-f3JAIsA';
                    //let SplitedUrl = tempUrl.split('?v=');
                    ////console.log('SplitedUrl = ', SplitedUrl);
                    //let url = SplitedUrl[1].split('&');
                    //let FinalUrl = url[0];
                    ////console.log('FinalUrl = ', FinalUrl);
                    //this.props.navigation.navigate('Youtube', {
                    //  url: FinalUrl,
                    //});
                    this.props.navigation.navigate('Youtube', {
                      url: item.videoUrl,
                    });
                  } else {
                    Toast.show('No Url Found', ToastData);
                  }
                }}>
                <CustomFastImage
                  resizeMode={'contain'}
                  style={{
                    width: 40,
                    height: 40,
                  }}
                  //source={{
                  //  uri: `data:image/jpeg;base64,${this.state.Subjects.staffImage}`,
                  //}}
                  source={require('../assets/videoIcon.png')}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          <View
            style={{
              width: '70%',
              height: '100%',
              justifyContent: 'center',
            }}>
            <View style={{width: '100%', height: '70%', paddingRight: 10}}>
              {/*{this.state.Subjects.staffName ? (*/}
              <Text
                numberOfLines={2}
                style={[
                  styles.StaffDetailTextStyle,
                  {color: this.state.colorCode},
                ]}>
                {item.topicName}
              </Text>
              {/*) : null}*/}

              {/*{this.state.Subjects.subjectType ? (*/}
              <Text
                numberOfLines={2}
                style={[styles.StaffDetailTextStyle, {color: 'gray'}]}>
                {item.videoTitle}
              </Text>
              {/*) : null}*/}
              {/*{this.state.Subjects.subjectType ? (*/}
              {/*<Text
                  numberOfLines={1}
                  style={[styles.StaffDetailTextStyle, {color: 'gray'}]}>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </Text>*/}
              {/*) : null}*/}
            </View>
          </View>
        </View>
      </View>
    );
  };
  subjectDetail() {
    return (
      <View style={styles.SubjectMainContainer}>
        <View style={{marginTop: 20, width: '100%', alignSelf: 'center'}}>
          {this.state.SubjectsDetail.length ? (
            this.renderContent()
          ) : !this.state.Loader && !this.state.SubjectsDetail.length ? (
            <Animatable.View
              key={Math.random()}
              duration={400}
              style={[styles.header, {width: '95%', alignSelf: 'center'}]}
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
    //console.log(SubjectArr);
    var filterredSub = SubjectArr.filter(function (item) {
      ////console.log(item);
      return subjectCode == item.subjectCode;
    });
    //console.log('filterredSub = ', filterredSub);
    //filterredSub.map((MainItem, MainIndex) => {
    //  return (

    filterredUnitName = filterredSub.filter(function (item) {
      console.log(SubjectArr[0].parent_code);
      //return 0 == item.parent_code;
      return SubjectArr[0].parent_code == item.parent_code;
    });

    //console.log('filterredUnitName = ', filterredUnitName);

    //  );
    //});
    return (
      <CommonFlatlist
        refreshing={this.state.refreshing}
        //_onRefresh={this._onRefresh.bind(this)}
        _onRefresh={() => {
          this._onRefresh(this.onLoadGetNotes());
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
                    //this.checkPermission(
                    //  'https://cdn.wallpapersafari.com/33/83/tMTyHl.jpg',
                    //  'jpg',
                    //);
                    if (this.state.filterredSubTempIndex == index) {
                      this.setState({
                        filterredSubTempIndex: -1,
                        filterredSubUnitNameTempIndex: -1,
                      });
                    } else {
                      this.setState({
                        tempParentCode: item.topic_no,
                        filterredSubTempIndex: index,
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
                {this.state.filterredSubTempIndex == index && (
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
                    {this.renderContent3(item.topic_no)}
                  </Animatable.View>
                )}
              </Animatable.View>
            </Animatable.View>
          );
        }}
      />
    );
  }
  renderContent3(topicNumber) {
    let tempParentCode = this.state.tempParentCode;
    let SubjectArr = this.state.SubjectsDetail;
    console.log('tempParentCode = ', tempParentCode);
    var filterredSubUnitName = SubjectArr.filter(function (item) {
      console.log('item.parent_code = ', item.parent_code);
      return tempParentCode == item.parent_code;
    });
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
          {item.filePath != '' ? (
            <TouchableOpacity
              onPress={() => {
                this.checkPermission(item.filePath, item.filePath);
              }}
              style={styles.iconsStyles}>
              <CustomFastImage
                resizeMode={'cover'}
                style={styles.icons}
                source={require('../assets/notes.png')}
              />
              {/*{item.filePath.length > 1 && (
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
                    {item.filePath.length}
                  </Text>
                </View>
              )}*/}
            </TouchableOpacity>
          ) : null}
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
        <CustomHeader
          isHome={false}
          title={this.state.Subjects.subjectName}
          navigation={this.props.navigation}
        />
        <Loader
          Loading={this.state.Loader ? true : false}
          onPressCancel={() => {
            this.setState({Loader: false});
          }}
        />
        <View style={[styles.SubjectMainContainer, {height: '92%'}]}>
          <ButtonSwitcher
            width="98%"
            selected={this.state.Indentifier}
            color={this.state.colorCode}
            title="Syllabus & Notes"
            title2="Homework"
            title3="I-Class"
            onPress={() => {
              this.setState({Indentifier: 'Syllabus & Notes'});
            }}
            onPress2={() => {
              this.setState({Indentifier: 'Homework'}, () => {
                //this.onLoadGetHomework();
              });
            }}
            onPress3={() => {
              this.setState({Indentifier: 'I-Class'}, () => {
                //this.onLoadGetHomework();
              });
            }}
          />
          {/*{this.state.Indentifier == 'Syllabus & Notes' && (
            <ButtonSwitcher
              width="95%"
              selected={this.state.Indentifier}
              color={this.state.colorCode2}
              title={'Syllabus & Notes'}
              //title2="Notes"
              title3="Homework"
              onPress={() => {
                this.setState({Indentifier: 'Syllabus & Notes'}, () => {
                  this.onLoadGetNotes();
                });
              }}
              //onPress2={() => {
              //  this.setState({Indentifier: 'Notes'}, () => {
              //    this.onLoadGetNotes();
              //  });
              //}}
              onPress3={() => {
                this.setState({Indentifier: 'Homework'}, () => {
                  //this.onLoadGetHomework();
                });
              }}
            />
          )}*/}
          {this.state.Indentifier == 'Syllabus & Notes'
            ? this.subjectDetail()
            : this.state.Indentifier == 'Homework'
            ? this.HomeworkDetail()
            : this.iClassDetail()}
        </View>
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
  iconsStyles: {
    marginTop: heightPercentageToDP('2%'),
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
