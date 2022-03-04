import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {StyleSheet, BackHandler, SafeAreaView} from 'react-native';
import {View, Text} from 'react-native';
import {CustomHeader} from './CustomHeader';
import {Loader} from './Loader';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-tiny-toast';
import ResponsiveSize from '../config/ResponsiveSize';
import config from '../config/config';
import moment from 'moment';
import {Dimensions} from 'react-native';
import CommonFlatlist from './common/CommonFlatList';
import CustomFastImage from './common/CustomFastImage';
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};
const BlueColor = '#6397F2';

export default class TimeTableToday extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colorPic: this.props.route.params
        ? this.props.route.params.colorPic
          ? this.props.route.params.colorPic
          : ''
        : '',
      refreshing: false,
      Loader: true,
      TodayTimeTable: [],
    };
  }
  componentDidMount() {
    //console.log(
    //  'this.props.route.params.Subjects = ',
    //  this.props.route.params.Subjects,
    //);
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
          this.onLoadGetTodayTimeTable();
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
  onLoadGetTodayTimeTable = () => {
    const url = config.baseUrl + 'student/StudentClassDetails';
    //console.log(url);
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.state.Token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson) {
          this.setState(
            {Loader: false, refreshing: false, TodayTimeTable: responseJson},
            function () {},
          );
        } else {
          this.setState({}, function () {
            this.setState({Loader: false, refreshing: false}, function () {
              Toast.show(
                responseJson.title
                  ? responseJson.title
                  : 'Temporary error try again after some time',
                ToastData,
              );
            });
          });
        }
      })
      .catch((error) => {
        this.setState({}, function () {
          this.setState({Loader: false, refreshing: false}, function () {
            alert(error);
          });
        });
      });
  };
  flatListTimeTableRender = ({item, index}) => {
    //console.log(item);
    return (
      <Animatable.View
        key={Math.random()}
        duration={400}
        style={{
          width: '95%',
          padding: 10,
          minHeight: 93,
          borderRadius: 10,
          marginBottom: 15,
          elevation: 3,
          borderColor: '#BBECF2',
          shadowColor: '#BBECF2',
          shadowOpacity: 0.6,
          shadowOffset: {width: 1, height: 3},
          alignSelf: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          //backgroundColor: index % 2 == 0 ? 'red' : 'white',
          backgroundColor: index % 2 ? 'white' : '#BBECF2',
          //  backgroundColor:
          //    index < 19
          //      ? this.state.Colors[index]
          //      : this.state.Colors[
          //          Math.floor(Math.random() * this.state.Colors.length)
          //        ],
        }}
        transition="backgroundColor">
        <View
          style={{
            width: '18%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#13A5B7',
            }}>
            {item.hour ? (
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: ResponsiveSize(config.AppAllHeaderSize),
                }}>
                H{item.hour}
              </Text>
            ) : null}
          </View>
        </View>
        <View style={{width: '38%', justifyContent: 'center'}}>
          {item.subject ? (
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                fontWeight: '600',
                color: '#13A5B7',
                fontSize: ResponsiveSize(config.AppAllHeaderSize),
                paddingRight: 10,
              }}>
              {item.subject}
            </Text>
          ) : null}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {item.subjectType ? (
              <CustomFastImage
                resizeMode={'contain'}
                style={{
                  width: 15,
                  height: 15,
                  marginRight: 10,
                }}
                source={require('../assets/practical.png')}
              />
            ) : null}
            {item.subjectType ? (
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  color: '#13A5B7',
                  marginVertical: 5,
                  fontSize: ResponsiveSize(config.AppAllTextSize),
                }}>
                {item.subjectType}
              </Text>
            ) : null}
          </View>
        </View>
        <View
          style={{
            width: '42%',
            justifyContent: 'center',
            paddingRight: 10,
          }}>
          <View style={{alignItems: 'center', flexDirection: 'row'}}>
            {item.startTime ? (
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontSize: ResponsiveSize(config.AppAllSubTitle),
                  paddingLeft: 25,
                }}>
                {moment(item.startTime).format('hh:mm:a')}
                {item.endTime && ' to '}
              </Text>
            ) : null}
            {item.endTime ? (
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontSize: ResponsiveSize(config.AppAllSubTitle),
                }}>
                {moment(item.endTime).format('hh:mm:a')}
              </Text>
            ) : null}
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 10,
              //backgroundColor: 'red',
            }}>
            <CustomFastImage
              resizeMode={'contain'}
              style={{
                width: 15,
                height: 15,
                marginRight: 10,
              }}
              source={require('../assets/person.png')}
            />
            {item.staffName ? (
              <Text
                style={{
                  width: 90,
                  fontFamily: 'Poppins-Regular',
                  color: '#13A5B7',
                  marginVertical: 5,
                  fontSize: ResponsiveSize(config.AppAllTextSize),
                }}>
                {item.staffName}
              </Text>
            ) : null}
            {/*<TouchableOpacity
                  //disabled={item.isMeetingEnabled ? false : true}
                  onPress={() => {
                    this.MarkAttendanceOfStudentOfParticularClass(
                      item.hour,
                    );
                    //Linking.openURL(item.meetingLink);
                  }}
                  style={{
                    marginLeft: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <CustomFastImage
          resizeMode={'contain'}
                    style={{
                      width: 30,
                      height: 30,
                      resizeMode: 'contain',
                    }}
                    source={
                      item.isMeetingEnabled
                        ? require('../assets/meetingActive.png')
                        : require('../assets/meetingInactive.png')
                    }/>
                </TouchableOpacity>*/}
          </View>
          {item.subjectCode ? (
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                //color: '#13A5B7',
                marginLeft: 22,
                fontSize: ResponsiveSize(config.AppAllTextSize),
              }}>
              {item.subjectCode}
            </Text>
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
          title={'Time Table'}
          navigation={this.props.navigation}
        />
        <Loader
          Loading={this.state.Loader ? true : false}
          onPressCancel={() => {
            this.setState({Loader: false});
          }}
        />
        <View style={styles.SubjectMainContainer}>
          <CustomFastImage
            resizeMode={'stretch'}
            style={styles.SubjectNameImageView}
            source={this.state.colorPic}
          />
          <View style={styles.SubjectNameTextView}>
            <Text numberOfLines={1} style={styles.SubjectNameTextStyle}>
              {'Today'}
            </Text>
          </View>
          <View style={{width: '100%', height: '87%'}}>
            <CommonFlatlist
              refreshing={this.state.refreshing}
              //_onRefresh={this._onRefresh.bind(this)}
              _onRefresh={() => {
                this._onRefresh(this.onLoadGetTodayTimeTable());
              }}
              renderItem={this.flatListTimeTableRender}
              data={this.state.TodayTimeTable.sort(
                (e1, e2) => e1.hour > e2.hour,
              )}
              Loader={this.state.Loader}
            />
          </View>
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
});
