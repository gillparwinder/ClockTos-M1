import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {StyleSheet, BackHandler, SafeAreaView} from 'react-native';
import {View, Text, TouchableOpacity} from 'react-native';
import {CustomHeader} from './CustomHeader';
import {Loader} from './Loader';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-tiny-toast';
import ResponsiveSize from '../config/ResponsiveSize';
import config from '../config/config';
import {Dimensions} from 'react-native';
import CommonFlatlist from './common/CommonFlatList';
import CustomFastImage from './common/CustomFastImage';
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};

const BlueColor = '#6397F2';
const PurpleColor = '#7260E9';
const LightPurpleColor = '#A99CFF';

export default class TimeTableCam extends Component {
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
      CamTimeTable: [],
      CamTimeTableTempIndex: -1,
    };
  }
  componentDidMount() {
    //console.log('cam');
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
          this.onLoadCamExamTimeTable();
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
  onLoadCamExamTimeTable = () => {
    const url = config.baseUrl + 'student/CamTimeTable';
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
        console.log('CamTimeTable response', JSON.stringify(responseJson));
        if (responseJson) {
          this.setState(
            {Loader: false, refreshing: false, CamTimeTable: responseJson},
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
        this.setState({Loader: false, refreshing: false}, function () {
          alert(error);
        });
      });
  };
  flatListTimeTableMainCamRender = ({item, index}) => {
    return (
      <View
        key={Math.random()}
        style={{
          width: '95%',
          alignSelf: 'center',
          alignItems: 'center',
          margin: this.state.CamTimeTableTempIndex == index ? 10 : 0,
          borderRadius: 10,
          backgroundColor:
            this.state.CamTimeTableTempIndex == index
              ? PurpleColor
              : 'transparent',
          marginBottom: 10,
          paddingBottom: 10,
        }}>
        <Animatable.View
          key={Math.random()}
          duration={400}
          style={{
            width: '100%',
            alignSelf: 'center',
            backgroundColor: index % 2 == 0 ? 'white' : '#E9E6FE',

            elevation: 3,
            borderColor: LightPurpleColor,
            shadowColor: LightPurpleColor,
            shadowOpacity: 0.6,
            shadowOffset: {width: 0, height: 3},
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            padding: 10,
            minHeight: 90,
          }}
          transition="backgroundColor">
          <TouchableOpacity
            activeOpacity={0.6}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              width: '100%',
            }}
            onPress={() => {
              if (this.state.CamTimeTableTempIndex == index) {
                this.setState({CamTimeTableTempIndex: -1});
              } else {
                this.setState({CamTimeTableTempIndex: index});
              }
            }}>
            <View
              style={{
                width: '100%',
                paddingLeft: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={{width: '60%', justifyContent: 'center'}}>
                <Text
                  style={[
                    styles.TimeTableText,
                    {
                      color: PurpleColor,
                      fontSize: ResponsiveSize(config.AppAllHeaderSize),
                    },
                  ]}>
                  {item.internalTestName}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '40%',
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={[
                      styles.headerText,
                      {textTransform: 'none', color: PurpleColor},
                    ]}>
                    {item.examStartDate}
                  </Text>
                  {item.examStartDate ? (
                    <Text
                      style={[
                        styles.headerText,
                        {
                          textTransform: 'none',
                          padding: 5,
                          color: PurpleColor,
                        },
                      ]}>
                      to
                    </Text>
                  ) : null}
                  <Text
                    style={[
                      styles.headerText,
                      {textTransform: 'none', color: PurpleColor},
                    ]}>
                    {item.examEndDate}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Animatable.View>
        {this.state.CamTimeTableTempIndex == index
          ? this.renderCamTestDetailsContent(
              item.testDetails,
              item.internalTestName,
            )
          : null}
      </View>
    );
  };
  renderCamTestDetailsContent = (testDetails, internalTestName) => {
    let CamExamArr = testDetails;
    var filterred = CamExamArr.filter(function (item) {
      return item.internalTestName == internalTestName;
    });
    return filterred.length ? (
      <CommonFlatlist
        refreshing={this.state.refreshing}
        //_onRefresh={this._onRefresh.bind(this)}
        _onRefresh={() => {
          this.setState({refreshing: false});
        }}
        renderItem={this.flatListTimeTableCamRender}
        data={filterred}
        Loader={this.state.Loader}
      />
    ) : //filterred.map((item, index) => {

    //})
    !this.state.Loader ? (
      <Animatable.View
        key={Math.random()}
        duration={400}
        style={[styles.header, {width: '100%', alignSelf: 'center'}]}
        transition="backgroundColor">
        <Text style={[styles.headerText, {textTransform: 'none'}]}>
          No data available
        </Text>
      </Animatable.View>
    ) : null;
  };
  flatListTimeTableCamRender = ({item, index}) => {
    let Duration = [];
    if (item.duration != null) {
      Duration = item.duration.split(':');
    }
    return (
      <Animatable.View
        key={Math.random()}
        duration={400}
        style={{
          width: '95%',
          alignSelf: 'center',
          padding: 10,
          minHeight: 75,
          backgroundColor: 'white',
          elevation: 3,
          shadowColor: 'silver',
          shadowOpacity: 0.6,
          shadowOffset: {width: 1, height: 1},
          marginTop: 10,
          borderRadius: 5,
        }}
        transition="backgroundColor">
        <View
          activeOpacity={1}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <View style={{width: '5%', justifyContent: 'center'}}>
            <CustomFastImage
              resizeMode={'cover'}
              style={{
                width: 3,
                height: 70,
                marginLeft: 5,
              }}
              source={require('../assets/purpleLine.png')}
            />
          </View>
          <View style={{width: '55%', justifyContent: 'center'}}>
            {item.subjectName ? (
              <Text
                style={[
                  styles.headerText,
                  {
                    textTransform: 'none',
                    color: PurpleColor,
                    fontSize: ResponsiveSize(14),
                  },
                ]}>
                {item.subjectName}
              </Text>
            ) : null}
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                flexDirection: 'row',
                marginTop: 5,
              }}>
              {item.startTime ? (
                <Text
                  style={[
                    styles.headerText,
                    {textTransform: 'none', color: LightPurpleColor},
                  ]}>
                  {item.startTime}{' '}
                </Text>
              ) : null}
              {item.startTime ? (
                <Text
                  style={[
                    styles.headerText,
                    {textTransform: 'none', color: LightPurpleColor},
                  ]}>
                  to
                </Text>
              ) : null}
              {item.endTime ? (
                <Text
                  style={[
                    styles.headerText,
                    {textTransform: 'none', color: LightPurpleColor},
                  ]}>
                  {' '}
                  {item.endTime}
                </Text>
              ) : null}
            </View>
          </View>
          <View
            style={{
              width: '40%',
              justifyContent: 'center',
              paddingHorizontal: 5,
            }}>
            {item.examDate ? (
              <Text style={[styles.headerText, {textTransform: 'none'}]}>
                {item.examDate}
              </Text>
            ) : null}
            {item.duration ? (
              <Text
                style={[
                  styles.headerText,
                  {textTransform: 'none', marginTop: 5},
                ]}>
                {Duration[0]}
                {Duration[1] != '00' ? ' : ' + Duration[1] : ''} hour
              </Text>
            ) : null}
            {item.staffCode ? (
              <Text
                style={[
                  styles.headerText,
                  {textTransform: 'none', marginTop: 5},
                ]}>
                {item.staffCode}
              </Text>
            ) : null}
          </View>
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
              {'CAM'}
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              height: '88%',
              alignItems: 'center',
            }}>
            <CommonFlatlist
              refreshing={this.state.refreshing}
              //_onRefresh={this._onRefresh.bind(this)}
              _onRefresh={() => {
                this._onRefresh(this.onLoadCamExamTimeTable());
              }}
              renderItem={this.flatListTimeTableMainCamRender}
              data={this.state.CamTimeTable}
              //  data={this.state.CamTimeTable.reverse()}
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
