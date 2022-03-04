import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import Toast from 'react-native-tiny-toast';
import config from '../../config/config';
import {SafeAreaView} from 'react-native';
import {CustomHeader} from '../CustomHeader';
import {Loader} from '../Loader';
import {View} from 'react-native';
import {BackHandler} from 'react-native';
import DatePicker from 'react-native-datepicker';
import CommonFlatlist from '../common/CommonFlatList';
import CommonDatePicker from '../common/CommonDatePicker';
import CommonCheckBoxWithText from '../common/CommonCheckBoxWithText';
import {CustomTabs} from '../common/CustomTabs';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import CustomFastImage from '../common/CustomFastImage';
import moment from 'moment';
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};
const ThemeColor = '#6CCFDB';
const DarkThemeColor = '#008B9B';
const TabColor = '#7260E9';
export default class BlockBoxOther extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Loader: true,
      Attendance: [],
      isChecked: 'Not Posted',
      Title: this.props.route.params
        ? this.props.route.params.title
          ? this.props.route.params.title
          : ''
        : '',
      //activeTab: 'CAM',
      activeTab: 'Attendance',
      activeButton: 'Simple',
      //activeButton: 'Detailed',
      filterredArr: [],
      DataArr: [],
      EndDate: new Date(),
      StartDate: new Date(),
      isCam: false,
    };
  }
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
          let date = new Date();
          let finalCurrentDate = moment(date).format('YYYY-MM-DD');
          let newdate = date.setDate(date.getDate() - 7);
          var finalDate = moment(newdate).format('YYYY-MM-DD');
          this.setState(
            {
              EndDate: finalCurrentDate,
              StartDate: finalDate,
            },
            () => {
              this.onLoadGetAttendanceData();
            },
          );
        });
      }
    } catch (error) {
      alert('Error retrieving data');
    }
  };

  onLoadGetCamData = () => {
    const url = config.baseUrl2 + 'staff/GetStaffBlockBoxCamData';
    const bodyData = JSON.stringify({
      FromDate: this.state.StartDate,
      ToDate: this.state.EndDate,
      CamFlag: true,
    });
    //const bodyData = {};
    console.log(url);
    //console.log(this.state.Token);
    console.log(bodyData);
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.state.Token,
        //Authorization:
        //  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyZDgzMjQ2Ny1iYmZjLTQ4YTAtOTMzNy1jNDIzMTYwOGU5ZjUiLCJVc2VyTmFtZSI6IjEwMDMiLCJEQiI6IlI2djJIVFhvTStmbmgqZERkbVpGUjNSNFNqc3FFV3dnRmdSeFk2dWMxUm1IOWFmdms3TUhlR0prVjRnK2lQKytzR1l6TkMyRkRTeks4REk3T2hJdG5IMXBNT1VJeTE1NTJDQWRNWllvdlRWZkxhSVBvTnN4Y0wxVkR3MWJROGpGaFo4amFFUlAzMGd6MTM5MHRvYnhiU3JSZDBKQjVuK0FTbFQwaUtuM05UcjVqZXFmajRrVHlkazlOdjFnNmtrSEJHemJwbjRwNTUrVUhISGpSUzJNaEZMTTd4eG50ZkllcjZMcVdDbmVUOThGT0g5UWNYbjdKYjZpMTZGMjlmYlh6Rk5UNThrd3puVFRwZW9jelNJT2NOQ254ZmUwSHFhdHpvUWt0NzQwQ0psb3NYQzBERnY1RFNqakxGKnBrcjJoOXZPMHdOd2dQYUJ1ME1xSDI4NGZ0dz09IiwiSXNTY2hvb2wiOiJUcnVlIiwidXNlcl9pZCI6ImFubmFtYWhlc2giLCJ1c2VyX2NvZGUiOiIyNzgiLCJjb2xsZWdlX2NvZGUiOiIxMyIsImNvbGxlZ2VOYW1lIjoiQUJDIENvbGxlZ2UiLCJzdGFmZl9jb2RlIjoiMTAwMyIsIm5iZiI6MTY0NTA4NDI5MCwiZXhwIjoxNjQ1MDkxNDkwLCJpc3MiOiJwYWxwYXAtcHJvZC1lbnZpcm9ubWVudCIsImF1ZCI6InBhbHBhcHByb2R1c2VycyJ9.S5da7ik_wgk6VyZ24Rngk180yDDxrCkaJrYjTh6GXaU',
      },
      body: bodyData,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('GetStaffBlockBoxCamData = ', JSON.stringify(responseJson));
        if (responseJson) {
          this.setState(
            {
              Loader: false,
              refreshing: false,
              filterredArr: responseJson,
              DataArr: responseJson,
            },
            function () {
              //this.setState({filterredArr: this.state.DataArr, Loader: false});
            },
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
        //console.log(error);
        this.setState({Loader: false, refreshing: false}, function () {
          alert(error);
        });
      });
  };
  onLoadGetAttendanceData = () => {
    const url = config.baseUrl2 + 'staff/GetStaffBlockBoxData';
    const bodyData = JSON.stringify({
      FromDate: this.state.StartDate,
      ToDate: this.state.EndDate,
      CamFlag: this.state.isCam,
    });
    //const bodyData = {};
    console.log(url);
    //console.log(this.state.Token);
    console.log(bodyData);
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.state.Token,
        //Authorization:
        //  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyZDgzMjQ2Ny1iYmZjLTQ4YTAtOTMzNy1jNDIzMTYwOGU5ZjUiLCJVc2VyTmFtZSI6IjEwMDMiLCJEQiI6IlI2djJIVFhvTStmbmgqZERkbVpGUjNSNFNqc3FFV3dnRmdSeFk2dWMxUm1IOWFmdms3TUhlR0prVjRnK2lQKytzR1l6TkMyRkRTeks4REk3T2hJdG5IMXBNT1VJeTE1NTJDQWRNWllvdlRWZkxhSVBvTnN4Y0wxVkR3MWJROGpGaFo4amFFUlAzMGd6MTM5MHRvYnhiU3JSZDBKQjVuK0FTbFQwaUtuM05UcjVqZXFmajRrVHlkazlOdjFnNmtrSEJHemJwbjRwNTUrVUhISGpSUzJNaEZMTTd4eG50ZkllcjZMcVdDbmVUOThGT0g5UWNYbjdKYjZpMTZGMjlmYlh6Rk5UNThrd3puVFRwZW9jelNJT2NOQ254ZmUwSHFhdHpvUWt0NzQwQ0psb3NYQzBERnY1RFNqakxGKnBrcjJoOXZPMHdOd2dQYUJ1ME1xSDI4NGZ0dz09IiwiSXNTY2hvb2wiOiJUcnVlIiwidXNlcl9pZCI6ImFubmFtYWhlc2giLCJ1c2VyX2NvZGUiOiIyNzgiLCJjb2xsZWdlX2NvZGUiOiIxMyIsImNvbGxlZ2VOYW1lIjoiQUJDIENvbGxlZ2UiLCJzdGFmZl9jb2RlIjoiMTAwMyIsIm5iZiI6MTY0NTA4NDI5MCwiZXhwIjoxNjQ1MDkxNDkwLCJpc3MiOiJwYWxwYXAtcHJvZC1lbnZpcm9ubWVudCIsImF1ZCI6InBhbHBhcHByb2R1c2VycyJ9.S5da7ik_wgk6VyZ24Rngk180yDDxrCkaJrYjTh6GXaU',
      },
      body: bodyData,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('GetStaffBlockBoxData = ', JSON.stringify(responseJson));
        if (responseJson) {
          this.setState(
            {
              Loader: false,
              refreshing: false,
              filterredArr: responseJson,
              DataArr: responseJson,
            },
            function () {
              //this.setState({filterredArr: this.state.DataArr, Loader: false});
            },
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
        //console.log(error);
        this.setState({Loader: false, refreshing: false}, function () {
          alert(error);
        });
      });
  };
  filterredFuntion = (key) => {
    console.log(key);
    let data = [];
    let arr = [...this.state.DataArr];
    let newArr = arr.map((item, index) => {
      if (this.state.activeTab == 'CAM') {
        return {
          internalTestName: item.internalTestName,
          hours: item.hours,
          staffData: item.staffData.filter(
            (itemdata) => itemdata.status == key,
          ),
        };
      }
      return {
        date: item.date,
        hours: item.hours,
        staffData: item.staffData.filter((itemdata) => itemdata.status == key),
      };
    });
    let modifiedArr = newArr.filter((i) => {
      if (i.staffData.length != 0) {
        return i;
      }
    });
    console.log('data', JSON.stringify(modifiedArr));
    this.setState({filterredArr: modifiedArr});
  };

  renderItemForCam = ({item, index}) => {
    return (
      <View style={styles.listContainer}>
        <View style={styles.dateContainer}>
          <Text
            style={[styles.text, {color: DarkThemeColor, fontWeight: 'bold'}]}>
            {item.internalTestName}
          </Text>
        </View>
        {item.staffData.map((item2, index2) => {
          return (
            <View
              style={{
                width: '100%',
                borderTopWidth: 0.5,
                borderTopColor: 'silver',
                paddingVertical: 5,
              }}>
              <View style={styles.row}>
                <View
                  style={[
                    styles.row,
                    {
                      width: '50%',
                      borderColor: 'silver',
                      height: 80,
                      borderWidth: 1,
                      borderRadius: 10,
                      //paddingHorizontal: 10,
                      marginVertical: 10,
                      flexDirection: 'column',
                    },
                  ]}>
                  <View
                    style={[
                      styles.row,
                      {
                        width: '100%',
                        height: '50%',
                        justifyContent: 'center',
                      },
                    ]}>
                    <CustomFastImage
                      resizeMode={'contain'}
                      style={{
                        width: 20,
                        height: 20,
                        marginRight: 10,
                      }}
                      source={require('../../assets/timeTable.png')}
                    />
                    <Text
                      style={[
                        styles.text,
                        {color: 'black', textTransform: 'capitalize'},
                      ]}>
                      Entry Date {item2.entryDate}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.row,
                      {
                        width: '100%',
                        height: '50%',
                        justifyContent: 'center',
                        backgroundColor: DarkThemeColor,
                        borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10,
                      },
                    ]}>
                    <CustomFastImage
                      resizeMode={'contain'}
                      tintColor={'white'}
                      style={{
                        width: 20,
                        height: 20,
                        marginRight: 10,
                      }}
                      source={require('../../assets/timeTable.png')}
                    />
                    <Text
                      style={[
                        styles.text,
                        {color: 'white', textTransform: 'capitalize'},
                      ]}>
                      Exam Date {item2.examDate}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    width: '50%',
                    height: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {item2.status == 'Posted' || item2.status == 'posted' ? (
                    <Text
                      style={[
                        styles.text,
                        {color: '#45CC16', fontWeight: 'bold'},
                      ]}>
                      {' '}
                      ✓ Posted
                    </Text>
                  ) : (
                    <Text
                      style={[styles.text, {color: 'red', fontWeight: 'bold'}]}>
                      {' '}
                      ✕ Not Posted
                    </Text>
                  )}
                </View>
              </View>
              {item2.subjectData.map((item3, index3) => {
                return (
                  <View
                    style={[
                      styles.batchYearContainer,
                      {alignItems: 'flex-start'},
                    ]}>
                    <Text style={[styles.text, {color: 'white'}]}>
                      {item3.batchYear +
                        (item3.courseName ? ' | ' : '') +
                        item3.courseName +
                        (item3.department ? ' | ' : '') +
                        item3.department +
                        (item3.semester ? ' | Sem ' : '') +
                        item3.semester +
                        (item3.section ? ' | Sec ' : '') +
                        item3.section}
                    </Text>
                  </View>
                );
              })}
              <View style={styles.row}>
                <View
                  style={[
                    styles.row,
                    {
                      width: '50%',
                      height: 40,
                      //justifyContent: 'center',
                      marginVertical: 10,
                    },
                  ]}>
                  <CustomFastImage
                    resizeMode={'contain'}
                    style={{
                      width: 20,
                      height: 20,
                      marginRight: 10,
                    }}
                    source={require('../../assets/person.png')}
                  />
                  <Text
                    style={[
                      styles.text,
                      {color: 'black', textTransform: 'capitalize'},
                    ]}>
                    {item2.staffName}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.text,
                    {color: 'silver', textTransform: 'capitalize'},
                  ]}>
                  |
                </Text>
                <View
                  style={[
                    styles.row,
                    {
                      width: '50%',
                      height: 40,
                      //justifyContent: 'center',
                      marginVertical: 10,
                    },
                  ]}>
                  <CustomFastImage
                    resizeMode={'contain'}
                    style={{
                      width: 20,
                      height: 20,
                      marginHorizontal: 10,
                    }}
                    source={require('../../assets/case.png')}
                  />
                  <Text
                    style={[
                      styles.text,
                      {color: 'black', textTransform: 'capitalize'},
                    ]}>
                    {item2.designation}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.text,
                  {
                    color: DarkThemeColor,
                    textTransform: 'capitalize',
                    fontWeight: 'bold',
                  },
                ]}>
                {item2.subjectName}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };
  renderItem = ({item, index}) => {
    return (
      <View style={styles.listContainer}>
        <View style={styles.dateContainer}>
          <Text
            style={[styles.text, {color: DarkThemeColor, fontWeight: 'bold'}]}>
            {item.date}
          </Text>
        </View>
        {item.staffData.map((item2, index2) => {
          return (
            <View
              style={{
                width: '100%',
                borderTopWidth: 0.5,
                borderTopColor: 'silver',
                paddingVertical: 5,
                alignItems: 'flex-start',
              }}>
              {item2.subjectData.map((item3, index3) => {
                return (
                  <View
                    style={[
                      styles.batchYearContainer,
                      {backgroundColor: 'transparent', width: undefined},
                    ]}>
                    <Text style={[styles.text, {color: DarkThemeColor}]}>
                      {item3.batchYear +
                        ' | ' +
                        item3.courseName +
                        ' | ' +
                        item3.department +
                        ' | Sem ' +
                        item3.semester +
                        ' | Sec ' +
                        item3.section}
                    </Text>
                  </View>
                );
              })}
              <View
                style={[styles.row, {flexWrap: 'wrap', marginVertical: 10}]}>
                {item.hours.map((item4, index4) => {
                  return (
                    <View
                      style={[
                        styles.row,
                        {
                          width: '15%',
                          height: 30,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderWidth: 1,
                          borderColor:
                            item2.status == 'Posted' ? '#45CC16' : 'red',
                          borderRadius: 20,
                          marginTop: 10,
                          marginRight: 10,
                        },
                      ]}>
                      <Text
                        style={[
                          styles.text,
                          {color: item2.status == 'Posted' ? '#45CC16' : 'red'},
                        ]}>
                        H {item4}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>
    );
  };
  renderItemForDetailed = ({item, index}) => {
    return (
      <View style={styles.listContainer}>
        <View style={styles.dateContainer}>
          <Text
            style={[styles.text, {color: DarkThemeColor, fontWeight: 'bold'}]}>
            {item.date}
          </Text>
        </View>
        {item.staffData.map((item2, index2) => {
          return (
            <View
              style={{
                width: '100%',
                borderTopWidth: 0.5,
                borderTopColor: 'silver',
                paddingVertical: 5,
              }}>
              <View style={styles.row}>
                <View
                  style={[
                    styles.row,
                    {
                      width: '60%',
                      backgroundColor: DarkThemeColor,
                      height: 30,
                      borderRadius: 20,
                      paddingHorizontal: 10,
                      marginVertical: 10,
                    },
                  ]}>
                  <Text style={[styles.text, {color: 'white'}]}>
                    H{item2.subjectData[0].hour} ( 🕓 {item2.startTime} -{' '}
                    {item2.endTime})
                  </Text>
                </View>
                <View
                  style={[
                    styles.row,
                    {width: '50%', paddingLeft: 20, height: 40},
                  ]}>
                  {item2.status == 'Posted' || item2.status == 'posted' ? (
                    <Text
                      style={[
                        styles.text,
                        {color: '#45CC16', fontWeight: 'bold'},
                      ]}>
                      {' '}
                      ✓ Posted
                    </Text>
                  ) : (
                    <Text
                      style={[styles.text, {color: 'red', fontWeight: 'bold'}]}>
                      {' '}
                      ✕ Not Posted
                    </Text>
                  )}
                </View>
              </View>
              {item2.subjectData.map((item3, index3) => {
                return (
                  <View
                    style={[
                      styles.batchYearContainer,
                      {alignItems: 'flex-start'},
                    ]}>
                    <Text style={[styles.text, {color: 'white'}]}>
                      {item3.batchYear +
                        (item3.courseName ? ' | ' : '') +
                        item3.courseName +
                        (item3.department ? ' | ' : '') +
                        item3.department +
                        (item3.semester ? ' | Sem ' : '') +
                        item3.semester +
                        (item3.section ? ' | Sec ' : '') +
                        item3.section}
                    </Text>
                  </View>
                );
              })}
              <View style={styles.row}>
                <View
                  style={[
                    styles.row,
                    {
                      width: '50%',
                      height: 40,
                      //justifyContent: 'center',
                      marginVertical: 10,
                    },
                  ]}>
                  <CustomFastImage
                    resizeMode={'contain'}
                    style={{
                      width: 20,
                      height: 20,
                      marginRight: 10,
                    }}
                    source={require('../../assets/person.png')}
                  />
                  <Text
                    style={[
                      styles.text,
                      {color: 'black', textTransform: 'capitalize'},
                    ]}>
                    {item2.staffName}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.text,
                    {color: 'silver', textTransform: 'capitalize'},
                  ]}>
                  |
                </Text>
                <View
                  style={[
                    styles.row,
                    {
                      width: '50%',
                      height: 40,
                      //justifyContent: 'center',
                      marginVertical: 10,
                    },
                  ]}>
                  <CustomFastImage
                    resizeMode={'contain'}
                    style={{
                      width: 20,
                      height: 20,
                      marginHorizontal: 10,
                    }}
                    source={require('../../assets/case.png')}
                  />
                  <Text
                    style={[
                      styles.text,
                      {color: 'black', textTransform: 'capitalize'},
                    ]}>
                    {item2.designation}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.text,
                  {
                    color: DarkThemeColor,
                    textTransform: 'capitalize',
                    fontWeight: 'bold',
                  },
                ]}>
                {item2.subjectName}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <Loader
          Loading={this.state.Loader ? true : false}
          onPressCancel={() => {
            this.setState({Loader: false});
          }}
        />
        {this.state.Title ? (
          <CustomHeader
            isHome={false}
            title={this.state.Title}
            navigation={this.props.navigation}
          />
        ) : null}
        <View
          style={[styles.SubjectMainContainer, {backgroundColor: '#F5F5F5'}]}>
          <View
            style={{
              paddingHorizontal: 5,
              backgroundColor: 'white',
              width: '100%',
            }}>
            <CustomTabs
              borderRadius={0}
              height={50}
              width={'100%'}
              textSize={14}
              color={TabColor}
              textColor={'white'}
              backgroundColor={'transparent'}
              borderBottomColor={TabColor}
              ActiveTab={this.state.activeTab}
              type="bottom"
              //tab1Width={'50%'}
              //tab2Width={'50%'}
              tab1="Attendance"
              tab2="CAM"
              //scroll
              onPress={(value) => {
                this.setState(
                  {
                    activeTab: value,
                    filterredArr: [],
                    DataArr: [],
                    Loader: true,
                  },
                  () => {
                    if (value == 'CAM') {
                      this.setState({isCam: true}, () => {
                        this.onLoadGetCamData();
                      });
                    } else {
                      this.setState({isCam: false}, () => {
                        this.onLoadGetAttendanceData();
                      });
                    }
                  },
                );
              }}
            />
          </View>
          {this.state.activeTab == 'Attendance' ? (
            <View style={{width: '100%', alignItems: 'center'}}>
              <View style={[styles.row]}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      activeButton: 'Simple',
                      filterredArr: this.state.DataArr,
                    });
                  }}
                  style={[
                    styles.row,
                    {
                      width: '20%',
                      backgroundColor:
                        this.state.activeButton == 'Simple'
                          ? TabColor
                          : 'transparent',
                      height: 35,
                      borderRadius: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: 10,
                      borderColor: 'silver',
                      borderWidth: this.state.activeButton == 'Simple' ? 0 : 1,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.text,
                      {
                        color:
                          this.state.activeButton == 'Simple'
                            ? 'white'
                            : 'black',
                      },
                    ]}>
                    Simple
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      activeButton: 'Detailed',
                      filterredArr: this.state.DataArr,
                    });
                  }}
                  style={[
                    styles.row,
                    {
                      width: '20%',
                      backgroundColor:
                        this.state.activeButton == 'Detailed'
                          ? TabColor
                          : 'transparent',
                      height: 35,
                      borderRadius: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: 10,
                      borderColor: 'silver',
                      borderWidth:
                        this.state.activeButton == 'Detailed' ? 0 : 1,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.text,
                      {
                        color:
                          this.state.activeButton == 'Detailed'
                            ? 'white'
                            : 'black',
                      },
                    ]}>
                    Detailed
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.SubjectMainContainer]}>
                <View style={[styles.tabContainer]}>
                  <View
                    style={{
                      width: '70%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      height: '100%',
                      justifyContent: 'space-evenly',
                    }}>
                    <CommonDatePicker
                      style={{width: 90}}
                      borderColor={ThemeColor}
                      date={this.state.StartDate}
                      mode="date"
                      //placeholder={'from date'}
                      format="YYYY-MM-DD"
                      //minDate="2020-01-01"
                      maxDate={new Date()}
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      showIcon={false}
                      onDateChange={(date) => {
                        this.setState(
                          {
                            StartDate: date,
                            Loader: true,
                          },
                          function () {
                            this.state.StartDate != '' &&
                              this.state.EndDate != '' &&
                              this.onLoadGetAttendanceData();
                          },
                        );
                      }}
                    />
                    <CommonDatePicker
                      style={{width: 90}}
                      borderColor={ThemeColor}
                      date={this.state.EndDate}
                      mode="date"
                      //placeholder={'to date'}
                      format="YYYY-MM-DD"
                      //minDate="2020-01-01"
                      maxDate={new Date()}
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      showIcon={false}
                      onDateChange={(date) => {
                        this.setState(
                          {
                            EndDate: date,
                            Loader: true,
                          },
                          function () {
                            this.state.StartDate != '' &&
                              this.state.EndDate != '' &&
                              this.onLoadGetAttendanceData();
                          },
                        );
                      }}
                    />
                  </View>
                  <View
                    style={{
                      //width: '30%',
                      height: '100%',
                      justifyContent: 'center',
                    }}>
                    <CommonCheckBoxWithText
                      size={25}
                      disableBuiltInState={true}
                      isChecked={
                        this.state.isChecked == 'Not Posted' ? true : false
                      }
                      fillColor={ThemeColor}
                      unfillColor={this.props.unfillColor}
                      //text="Custom Checkbox"
                      iconStyle={{
                        borderRadius: 2,
                        borderColor: this.props.fillColor,
                      }}
                      textStyle={{fontFamily: 'Poppins-Regular'}}
                      onPress={() => {
                        if (this.state.isChecked == 'Posted') {
                          this.setState({isChecked: 'Not Posted'}, () => {
                            this.filterredFuntion(this.state.isChecked);
                          });
                        } else {
                          this.setState({isChecked: 'Posted'}, () => {
                            this.filterredFuntion(this.state.isChecked);
                          });
                        }
                      }}
                      text="Not Posted"
                      textColor="black"
                    />
                  </View>
                </View>
                <View style={{width: '100%', height: '81%'}}>
                  {this.state.activeButton == 'Simple' ? (
                    <CommonFlatlist
                      refreshing={this.state.refreshing}
                      _onRefresh={() => {
                        //this.apiname()
                        this.onLoadGetAttendanceData();
                      }}
                      data={this.state.filterredArr}
                      Loader={this.state.Loader}
                      renderItem={this.renderItem}
                    />
                  ) : (
                    <CommonFlatlist
                      refreshing={this.state.refreshing}
                      _onRefresh={() => {
                        //this.apiname()
                        this.onLoadGetAttendanceData();
                      }}
                      data={this.state.filterredArr}
                      Loader={this.state.Loader}
                      renderItem={this.renderItemForDetailed}
                    />
                  )}
                </View>
              </View>
            </View>
          ) : (
            <View style={[styles.SubjectMainContainer]}>
              <View style={styles.tabContainer}>
                <View
                  style={{
                    width: '70%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: '100%',
                    justifyContent: 'space-evenly',
                  }}>
                  <CommonDatePicker
                    style={{width: 90}}
                    borderColor={ThemeColor}
                    date={this.state.StartDate}
                    mode="date"
                    //placeholder={'from date'}
                    format="YYYY-MM-DD"
                    //minDate="2020-01-01"
                    maxDate={new Date()}
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    showIcon={false}
                    onDateChange={(date) => {
                      this.setState(
                        {
                          StartDate: date,
                          Loader: true,
                        },
                        function () {
                          this.state.StartDate != '' &&
                            this.state.EndDate != '' &&
                            this.onLoadGetCamData();
                        },
                      );
                    }}
                  />
                  <CommonDatePicker
                    style={{width: 90}}
                    borderColor={ThemeColor}
                    date={this.state.EndDate}
                    mode="date"
                    //placeholder={'to date'}
                    format="YYYY-MM-DD"
                    //minDate="2020-01-01"
                    maxDate={new Date()}
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    showIcon={false}
                    onDateChange={(date) => {
                      this.setState(
                        {
                          EndDate: date,
                          Loader: true,
                        },
                        function () {
                          this.state.StartDate != '' &&
                            this.state.EndDate != '' &&
                            this.onLoadGetCamData();
                        },
                      );
                    }}
                  />
                </View>
                <View
                  style={{
                    //width: '30%',
                    height: '100%',
                    justifyContent: 'center',
                  }}>
                  <CommonCheckBoxWithText
                    size={25}
                    disableBuiltInState={true}
                    isChecked={
                      this.state.isChecked == 'Not Posted' ? true : false
                    }
                    fillColor={ThemeColor}
                    unfillColor={this.props.unfillColor}
                    //text="Custom Checkbox"
                    iconStyle={{
                      borderRadius: 2,
                      borderColor: this.props.fillColor,
                    }}
                    textStyle={{fontFamily: 'Poppins-Regular'}}
                    onPress={() => {
                      if (this.state.isChecked == 'Posted') {
                        this.setState({isChecked: 'Not Posted'}, () => {
                          this.filterredFuntion(this.state.isChecked);
                        });
                      } else {
                        this.setState({isChecked: 'Posted'}, () => {
                          this.filterredFuntion(this.state.isChecked);
                        });
                      }
                    }}
                    text="Not Posted"
                    textColor="black"
                  />
                </View>
              </View>
              <View style={{width: '100%', height: '86%'}}>
                <CommonFlatlist
                  refreshing={this.state.refreshing}
                  _onRefresh={() => {
                    //this.apiname()
                    this.onLoadGetCamData();
                  }}
                  data={this.state.filterredArr}
                  Loader={this.state.Loader}
                  renderItem={this.renderItemForCam}
                />
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  SubjectMainContainer: {
    width: '100%',
    alignItems: 'center',
    //paddingBottom: 20,
  },

  AttendanceCustomDateTextView: {
    height: 60,
    width: '100%',
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
  pickerOuter: {
    borderColor: 'red',
    borderWidth: 1,
  },
  tabContainer: {
    width: '100%',
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    height: '8%',
    marginVertical: '1%',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  listContainer: {
    width: '100%',
    backgroundColor: 'white',
    minHeight: 20,
    padding: 10,
    marginBottom: 5,
  },
  dateContainer: {
    height: 30,
    justifyContent: 'center',
  },
  row: {width: '100%', flexDirection: 'row', alignItems: 'center'},
  text: {
    fontFamily: 'Poppins:Regular',
    //fontSize: heightPercentageToDP(1.8),
  },
  batchYearContainer: {
    width: '75%',
    backgroundColor: ThemeColor,
    minHeight: 40,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginTop: 5,
  },
});
