import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, ScrollView, BackHandler} from 'react-native';
import {View, Text, TouchableOpacity} from 'react-native';
import {CustomHeader} from './CustomHeader';
import {Loader} from './Loader';
import DatePicker from 'react-native-datepicker';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-tiny-toast';
import ResponsiveSize from '../config/ResponsiveSize';
import config from '../config/config';
import moment from 'moment';
import ProgressCircle from 'react-native-progress-circle';
import {Header} from 'native-base';
import {Dimensions} from 'react-native';
import CommonFlatlist from './common/CommonFlatList';
import CustomFastImage from './common/CustomFastImage';
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const LightGreenColor = '#BBECF2';
const BlueColor = '#6397F2';
const PurpleColor = '#7260E9';
const LightPurpleColor = '#A99CFF';
export default class ResultDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Loader: false,
      Title: this.props.route.params
        ? this.props.route.params.title
          ? this.props.route.params.title
          : ''
        : '',
      TotalSub: this.props.route.params
        ? this.props.route.params.TotalSub
          ? this.props.route.params.TotalSub
          : []
        : [],
      resultData: this.props.route.params
        ? this.props.route.params.resultData
          ? this.props.route.params.resultData
          : []
        : [],
      failSubCount: this.props.route.params
        ? this.props.route.params.failSubCount
          ? this.props.route.params.failSubCount
          : []
        : [],
      subTitle: this.props.route.params
        ? this.props.route.params.subTitle
          ? this.props.route.params.subTitle
          : ''
        : '',
      colorPic: this.props.route.params
        ? this.props.route.params.colorPic
          ? this.props.route.params.colorPic
          : ''
        : '',
      colorCode: this.props.route.params
        ? this.props.route.params.colorCode
          ? this.props.route.params.colorCode
          : ''
        : '',
      LightcolorCode: this.props.route.params
        ? this.props.route.params.LightcolorCode
          ? this.props.route.params.LightcolorCode
          : ''
        : '',
    };
  }
  _onRefresh = async (apiCall) => {
    this.setState({refreshing: true}, () => {
      apiCall;
      //this.setState({refreshing: false});
    });
  };
  flatListResultCamRender = ({item, index}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          width: '95%',
          alignSelf: 'center',
          elevation: 3,
          shadowColor: this.state.colorCode,
          shadowOffset: {width: 0, height: 0},
          shadowOpacity: 0.3,
          borderRadius: 15,
          height: 150,
          marginBottom: 15,
          alignItems: 'center',
          flexDirection: 'row',
          backgroundColor: index % 2 ? this.state.LightcolorCode : 'white',
        }}>
        <View
          style={{
            width: '5%',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}>
          {item.result == 'Fail' ||
          item.result == 'fail' ||
          item.result == 'FAIL' ? (
            <View
              style={{
                width: 4,
                height: '75%',
                alignSelf: 'center',
                borderRadius: 10,
                backgroundColor: 'red',
              }}></View>
          ) : (
            <View
              style={{
                width: 4,
                height: '75%',
                alignSelf: 'center',
                borderRadius: 10,
                backgroundColor: this.state.colorCode,
              }}></View>
          )}
        </View>
        <View style={{width: '95%', height: 100, justifyContent: 'center'}}>
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              padding: 10,
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{width: '65%', justifyContent: 'center'}}>
              <Text
                numberOfLines={2}
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontFamily: 'Poppins-Regular',
                  color:
                    item.result == 'FAIL' ||
                    item.result == 'fail' ||
                    item.result == 'FAIL'
                      ? 'red'
                      : this.state.colorCode,
                  fontWeight: '600',
                  fontSize: ResponsiveSize(config.AppAllHeaderSize),
                }}>
                {item.subjectName}
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    color: this.state.colorCode,
                  }}>
                  {item.grade ? '|' : ''} {item.grade}
                </Text>
              </Text>
            </View>
            <View
              style={{
                width: '35%',
                justifyContent: 'center',
                alignItems: 'flex-end',
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontFamily: 'Poppins-Regular',
                  color: this.state.colorCode,
                  fontWeight: '600',
                  fontSize: ResponsiveSize(config.AppAllTextSize),
                }}>
                {item.examDate}
              </Text>
            </View>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '25%',
                borderRightWidth: 1,
                borderColor: this.state.colorCode,
                padding: 10,
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontFamily: 'Poppins-Regular',
                  color: 'gray',
                  fontSize: ResponsiveSize(config.AppAllSubTitle),
                }}>
                Result
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontFamily: 'Poppins-Regular',
                  color:
                    item.result == 'Fail' ||
                    item.result == 'fail' ||
                    item.result == 'FAIL'
                      ? 'red'
                      : '#32D56F',
                  fontSize: ResponsiveSize(16),
                  fontWeight: '600',
                }}>
                {item.result}
              </Text>
            </View>
            <View
              style={{
                width: '25%',
                borderRightWidth: 1,
                borderColor: this.state.colorCode,
                padding: 10,
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontFamily: 'Poppins-Regular',
                  color: 'gray',
                  fontSize: ResponsiveSize(config.AppAllSubTitle),
                }}>
                Min
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontFamily: 'Poppins-Regular',
                  color: 'black',
                  fontSize: ResponsiveSize(config.AppAllHeaderSize),
                  fontWeight: '600',
                }}>
                {item.minMark}
              </Text>
            </View>
            <View
              style={{
                width: '25%',
                borderRightWidth: 1,
                borderColor: this.state.colorCode,
                padding: 10,
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontFamily: 'Poppins-Regular',
                  color: 'gray',
                  fontSize: ResponsiveSize(config.AppAllSubTitle),
                }}>
                Max
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontFamily: 'Poppins-Regular',
                  color: 'black',
                  fontSize: ResponsiveSize(config.AppAllHeaderSize),
                  fontWeight: '600',
                }}>
                {item.maxMark}
              </Text>
            </View>
            <View style={{width: '25%', padding: 10}}>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontFamily: 'Poppins-Regular',
                  color: 'gray',
                  fontSize: ResponsiveSize(config.AppAllSubTitle),
                }}>
                Optained
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontFamily: 'Poppins-Regular',
                  color:
                    item.result == 'Fail' ||
                    item.result == 'fail' ||
                    item.result == 'FAIL'
                      ? 'red'
                      : '#32D56F',
                  fontSize: ResponsiveSize(config.AppAllHeaderSize),
                  fontWeight: '600',
                }}>
                {item.mark}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  renderSemResultContent() {
    return (
      <View style={styles.SubjectMainContainer}>
        <View
          style={{
            width: '95%',
            alignSelf: 'center',
            height: 120,
            marginVertical: 10,
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <CustomFastImage
            resizeMode={'stretch'}
            style={{
              width: '100%',
              alignSelf: 'center',
              height: 120,
              position: 'absolute',
              marginBottom: 15,
            }}
            source={this.state.colorPic}
          />

          <View style={{width: '100%', height: 120, justifyContent: 'center'}}>
            <View
              style={{
                width: '100%',
                alignSelf: 'center',
                justifyContent: 'flex-end',
                paddingLeft: 35,
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  color: 'white',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  fontSize: ResponsiveSize(config.AppAllHeaderSize),
                }}>
                Semester {this.state.resultData}
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View style={{width: '10%', padding: 10}}></View>
              <View
                style={{
                  width: '30%',
                  borderRightWidth: 1,
                  borderColor: 'white',
                  padding: 10,
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    color: 'white',
                    fontSize: ResponsiveSize(config.AppAllSubTitle),
                  }}>
                  Total Sub
                </Text>
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    color: 'white',
                    fontSize: ResponsiveSize(config.AppAllHeaderSize),
                    fontWeight: '600',
                  }}>
                  {this.state.TotalSub.length}
                </Text>
              </View>
              <View
                style={{
                  width: '30%',
                  borderRightWidth: 1,
                  borderColor: 'white',
                  padding: 10,
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    color: 'white',
                    fontSize: ResponsiveSize(config.AppAllSubTitle),
                  }}>
                  Pass Sub
                </Text>
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    color: 'white',
                    fontSize: ResponsiveSize(config.AppAllHeaderSize),
                    fontWeight: '600',
                  }}>
                  {this.state.TotalSub.length - this.state.failSubCount.length}
                </Text>
              </View>
              <View style={{width: '30%', padding: 10}}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    color: 'white',
                    fontSize: ResponsiveSize(config.AppAllSubTitle),
                  }}>
                  Fail Sub
                </Text>
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    color: 'white',
                    fontSize: ResponsiveSize(config.AppAllHeaderSize),
                    fontWeight: '600',
                  }}>
                  {this.state.failSubCount.length}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{width: '100%', height: '80%', alignItems: 'center'}}>
          <CommonFlatlist
            refreshing={this.state.refreshing}
            //_onRefresh={this._onRefresh.bind(this)}
            _onRefresh={() => {
              this.setState({refreshing: false});
            }}
            renderItem={this.renderItem}
            data={this.state.TotalSub}
            Loader={this.state.Loader}
          />
        </View>
      </View>
    );
  }
  renderItem = ({item, index}) => {
    return (
      <View
        key={index}
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          width: '95%',
          alignSelf: 'center',
          elevation: 3,
          shadowColor: LightGreenColor,
          shadowOffset: {width: 0, height: 0},
          shadowOpacity: 0.8,
          borderRadius: 15,
          height: 220,
          marginBottom: 15,
          alignItems: 'center',
          flexDirection: 'row',
          backgroundColor: 'white',
        }}>
        <View
          style={{
            width: '95%',
            height: 100,
            justifyContent: 'center',
          }}>
          <View
            style={{
              height: 140,
              width: '100%',
              alignSelf: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '55%',
                height: '100%',
                padding: 10,
                justifyContent: 'space-evenly',
              }}>
              <Text
                numberOfLines={2}
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontFamily: 'Poppins-Regular',
                  color: this.state.colorCode,
                  fontSize: ResponsiveSize(config.AppAllHeaderSize),
                  fontWeight: 'bold',
                }}>
                {item.subjectName}
              </Text>
              {item.attendance ? (
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: 'Poppins-Regular',
                    fontFamily: 'Poppins-Regular',
                    color: 'gray',
                    fontWeight: '600',
                  }}>
                  Attendance :
                  <Text
                    style={{
                      fontSize: ResponsiveSize(config.AppAllHeaderSize),
                      color: this.state.colorCode,
                    }}>
                    {' ' + item.attendance}
                    {item.attendance ? '%' : ''}
                  </Text>
                </Text>
              ) : null}
              {item.externalMark && item.ShowUniversityMark == '1' ? (
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: 'Poppins-Regular',
                    fontFamily: 'Poppins-Regular',
                    color: 'gray',
                    fontWeight: '600',
                  }}>
                  External Marks :
                  <Text
                    style={{
                      fontSize: ResponsiveSize(config.AppAllHeaderSize),
                      color: this.state.colorCode,
                    }}>
                    {' ' + item.externalMark}
                  </Text>
                </Text>
              ) : null}
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontFamily: 'Poppins-Regular',
                  color: 'gray',
                  fontWeight: '600',
                }}>
                {item.subjectCode}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontFamily: 'Poppins-Regular',
                  color: this.state.colorCode,
                  fontWeight: '600',
                }}>
                Subject Type : {item.subjectType}
              </Text>
            </View>
            <View
              style={{
                width: '45%',
                height: '90%',
                backgroundColor:
                  item.result == 'PASS' ||
                  item.result == 'Pass' ||
                  item.result == 'pass'
                    ? '#23D76B'
                    : 'red',
                justifyContent: 'space-evenly',
                borderRadius: 15,
                padding: 10,
              }}>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={{width: '50%', justifyContent: 'center'}}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: 'Poppins-Regular',
                      fontFamily: 'Poppins-Regular',
                      color: 'white',
                      fontWeight: '600',
                    }}>
                    Grade
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: 'Poppins-Regular',
                      fontFamily: 'Poppins-Regular',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: ResponsiveSize(config.AppAllHeaderSize),
                    }}>
                    {item.grade}
                  </Text>
                </View>
                <View
                  style={{
                    width: '50%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: 'Poppins-Regular',
                      fontFamily: 'Poppins-Regular',
                      color: 'white',
                      fontWeight: '600',
                    }}>
                    Result
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: 'Poppins-Regular',
                      fontFamily: 'Poppins-Regular',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: ResponsiveSize(config.AppAllHeaderSize),
                    }}>
                    {item.result}
                  </Text>
                </View>
              </View>
              <View>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: 'Poppins-Regular',
                    fontFamily: 'Poppins-Regular',
                    color: 'white',
                    fontSize: ResponsiveSize(config.AppAllSubTitle),
                  }}>
                  Exam Year :
                  <Text style={{color: 'black'}}>
                    {item.examMonth + ' , ' + item.examYear}
                  </Text>
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: 'Poppins-Regular',
                    fontFamily: 'Poppins-Regular',
                    color: 'white',
                    fontSize: ResponsiveSize(config.AppAllSubTitle),
                  }}>
                  Attempt :<Text style={{color: 'black'}}> {item.attempt}</Text>
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <ScrollView
              //showsHorizontalScrollIndicator={false}

              horizontal>
              {item.internalMarks.length ? (
                item.internalMarks.map((items, indexx) => {
                  let marks = items.mark.split('.');
                  return (
                    <View
                      style={{
                        width: 120,
                        borderLeftWidth: indexx != 0 ? 1 : 0,
                        borderColor: this.state.colorCode,
                        padding: 10,
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily: 'Poppins-Regular',
                          fontFamily: 'Poppins-Regular',
                          color: 'gray',
                          fontSize: ResponsiveSize(config.AppAllSubTitle),
                        }}>
                        {items.testName}
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Poppins-Regular',
                          fontFamily: 'Poppins-Regular',
                          color: this.state.colorCode,
                          fontSize: ResponsiveSize(config.AppAllHeaderSize),
                          fontWeight: '600',
                        }}>
                        {marks[0]}
                      </Text>
                    </View>
                  );
                })
              ) : !this.state.Loader ? (
                <Animatable.View
                  key={Math.random()}
                  duration={400}
                  style={[
                    styles.header,
                    {
                      width: '95%',
                      alignSelf: 'center',
                      backgroundColor: 'transparent',
                    },
                  ]}
                  transition="backgroundColor">
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    Internal Marks Is Not Avaiblabe
                  </Text>
                </Animatable.View>
              ) : null}
            </ScrollView>
          </View>
        </View>
      </View>
    );
  };
  renderResultContent() {
    const filterred = this.state.resultData;
    //const filterred = [
    //    { score: "120", totalScore: "120", passSub: "05", totalSub: "07", subName: "Biology", grade: "A+", date: "27/01/2020", result: "Pass", min: "20", max: "50", optained: "35" },
    //    { score: "120", totalScore: "120", passSub: "05", totalSub: "07", subName: "Maths", grade: "D", date: "27/01/2020", result: "Fail", min: "20", max: "50", optained: "35" },
    //    { score: "120", totalScore: "120", passSub: "05", totalSub: "07", subName: "History", grade: "B", date: "27/01/2020", result: "Pass", min: "20", max: "50", optained: "35" },
    //    { score: "120", totalScore: "120", passSub: "05", totalSub: "07", subName: "Biology", grade: "A+", date: "27/01/2020", result: "Pass", min: "20", max: "50", optained: "35" },
    //]
    return (
      <View style={styles.SubjectMainContainer}>
        <CustomFastImage
          resizeMode={'stretch'}
          style={styles.SubjectNameImageView}
          source={this.state.colorPic}
        />
        <View style={styles.SubjectNameTextView}>
          <Text numberOfLines={1} style={styles.SubjectNameTextStyle}>
            {this.state.subTitle.criteria}
          </Text>
        </View>
        <View
          style={{
            width: '95%',
            flexDirection: 'row',
            height: '15%',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            backgroundColor: this.state.colorCode,
            marginVertical: 10,
            borderRadius: 15,
          }}>
          <View style={{width: '50%', justifyContent: 'center', height: '90%'}}>
            <Text style={{fontFamily: 'Poppins-Regular', lineHeight: 25}}>
              Your Score
            </Text>
            <View
              style={{
                width: '100%',
                justifyContent: 'center',
                backgroundColor: '#120E66',
                height: '70%',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontSize: ResponsiveSize(28),
                  color: 'white',
                  fontWeight: '600',
                }}>
                {this.state.subTitle.marksAcquired}
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    fontSize: ResponsiveSize(22),
                  }}>
                  / {this.state.subTitle.totalMarks}
                </Text>
              </Text>
            </View>
          </View>
          <View style={{width: '35%', justifyContent: 'center', height: '90%'}}>
            <Text style={{fontFamily: 'Poppins-Regular', lineHeight: 25}}>
              Pass Subject
            </Text>
            <View
              style={{
                width: '100%',
                justifyContent: 'center',
                backgroundColor: 'white',
                height: '70%',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontSize: ResponsiveSize(28),
                  color: this.state.colorCode,
                  fontWeight: '600',
                }}>
                {this.state.TotalSub.length - this.state.failSubCount.length}
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    fontSize: ResponsiveSize(22),
                  }}>
                  / {this.state.TotalSub.length}
                </Text>
              </Text>
            </View>
          </View>
        </View>
        <View style={{width: '100%', height: '70%', alignItems: 'center'}}>
          <CommonFlatlist
            refreshing={this.state.refreshing}
            //_onRefresh={this._onRefresh.bind(this)}
            _onRefresh={() => {
              this.setState({refreshing: false});
            }}
            renderItem={this.flatListResultCamRender}
            data={filterred}
            Loader={this.state.Loader}
          />
        </View>
      </View>
    );
  }
  render() {
    return (
      <View
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: config.bgColor,
        }}>
        <Loader
          Loading={this.state.Loader ? true : false}
          onPressCancel={() => {
            this.setState({Loader: false});
          }}
        />

        <SafeAreaView style={{flex: 1}}>
          <CustomHeader
            isHome={false}
            title={this.state.Title}
            navigation={this.props.navigation}
          />
          {this.state.subTitle == 'Semester'
            ? this.renderSemResultContent()
            : this.renderResultContent()}
        </SafeAreaView>
      </View>
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
