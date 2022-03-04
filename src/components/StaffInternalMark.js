import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import {SafeAreaView, StyleSheet, Image, BackHandler} from 'react-native';
import {View, Text, ScrollView} from 'react-native';
import DatePicker from 'react-native-datepicker';
import config from '../config/config';
import ResponsiveSize from '../config/ResponsiveSize';
import {CustomHeader} from './CustomHeader';
import {Loader} from './Loader';
import {FlatList} from 'react-native';

// import Orientation from 'react-native-orientation-locker';
import moment from 'moment';
import {Dimensions} from 'react-native';
import {Linking} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-tiny-toast';
import CommonFlatlist from './common/CommonFlatList';
import CustomFastImage from './common/CustomFastImage';
const DarkGreenColor = '#008B9B';
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};
export default class StaffInternalMark extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Title: this.props.route?.params?.title || '',
      TempIndex: -1,
      GetCamDegreeSubject: [],
      GetSubjectTest: [],
      Loader: true,
      //AttendanceDate: moment().format('YYYY-MM-DD'),
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
        //alert(value);
        //console.log(value);
        this.setState({Token: value}, function () {});
      }
    } catch (error) {
      alert('Error retrieving data');
    }
    try {
      const value = await AsyncStorage.getItem('staffCode');
      if (value !== null) {
        //alert(value);
        this.setState({staffCode: value}, function () {
          this.onPressGetCamDegreeSubject();
          //console.log('staffCode = ', this.state.staffCode);
        });
      }
    } catch (error) {
      alert('Error retrieving data');
    }
  };
  onPressGetCamDegreeSubject = () => {
    const url =
      config.baseUrl2 +
      'staff/GetCamDegreeSubject?staffCode=' +
      this.state.staffCode;
    console.log(url);
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.state.Token,
      },
      body: JSON.stringify({
        //staffCode: '1013',
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('GetCamDegreeSubject = ', responseJson);
        if (responseJson) {
          this.setState(
            {Loader: false, GetCamDegreeSubject: responseJson},
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
          alert(error);
          console.log(error);
        });
      });
  };

  onPressGetSubjectTest = (staffCode, subjectNo, batchYear, sec) => {
    const url = config.baseUrl2 + 'staff/GetSubjectTest';
    console.log(url);
    //console.log(
    //  JSON.stringify({
    //    staffCode: staffCode,
    //    subjectNo: subjectNo,
    //    batchYear: batchYear.toString(),
    //    sections: sec,
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
        staffCode: staffCode,
        subjectNo: subjectNo,
        batchYear: batchYear.toString(),
        sections: sec,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('GetSubjectTest = ', responseJson);
        if (responseJson) {
          this.setState(
            {GetSubjectTest: responseJson, Loader: false},
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
          alert(error);
          console.log(error);
        });
      });
  };
  _onRefresh = async (apiCall) => {
    this.setState({refreshing: true}, () => {
      apiCall;
    });
  };
  render() {
    return (
      <SafeAreaView>
        <Loader Loading={this.state.Loader} />
        <View
          style={[
            styles.SubjectMainContainer,
            {
              paddingBottom: 20,
              height: Dimensions.get('screen').height,
              backgroundColor: 'white',
            },
          ]}>
          {this.state.Title ? (
            this.props?.children == 'StaffInternalMark' ? null : (
              <CustomHeader
                isHome={false}
                navigation={this.props.navigation}
                title="Internal Mark"
              />
            )
          ) : null}

          <View
            style={{
              width: '100%',
              height: '88%',
              paddingBottom: 20,
              backgroundColor: '#F5F5F5',
            }}>
            {this.state.GetCamDegreeSubject.length ? (
              <FlatList
                nestedScrollEnabled={true}
                keyExtractor={(item, index) => index.toString()}
                data={this.state.GetCamDegreeSubject}
                renderItem={({item, index}) => {
                  return (
                    <View
                      style={{
                        width: '92%',
                        marginTop: 25,
                        alignSelf: 'center',
                        backgroundColor: '#E1FCFF',
                        borderRadius: 2,
                        paddingHorizontal:
                          this.state.TempIndex == index ? 5 : 0,
                      }}>
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                          if (this.state.TempIndex == index) {
                            this.setState({TempIndex: -1});
                          } else {
                            this.setState(
                              {
                                TempIndex: index,
                                Loader: true,
                                GetSubjectTest: [],
                              },
                              function () {
                                this.onPressGetSubjectTest(
                                  this.state.staffCode,
                                  item.subjectNo,
                                  item.batchYear,
                                  item.section,
                                );
                              },
                            );
                          }
                        }}
                        key={index}
                        style={{
                          //  justifyContent: 'center',
                          width: '100%',
                          alignSelf: 'center',
                          elevation: 3,
                          shadowColor: 'silver',
                          shadowOffset: {width: 0, height: 0},
                          shadowOpacity: 0.8,
                          backgroundColor: 'white',
                          padding: 10,
                        }}>
                        <View
                          style={{
                            width: '50%',
                            minHeight: 30,
                            marginLeft: -20,
                            marginTop: -25,
                            backgroundColor: config.PrimaryColor,
                            alignItems: 'center',
                            justifyContent: 'center',
                            //transform: [
                            //{rotateX: '45deg'},
                            //{rotateZ: '0.785398rad'},
                            //],
                          }}>
                          <Text
                            numberOfLines={1}
                            style={{
                              textTransform: 'capitalize',
                              fontFamily: 'Poppins-Regular',
                              color: 'white',
                            }}>
                            Sub Code : {item.subjectCode.toString()}
                          </Text>
                        </View>
                        <View
                          style={{
                            width: 5,
                            height: 10,
                            marginLeft: -17,
                            marginTop: -5,
                            backgroundColor: config.PrimaryColor,
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: [
                              //{rotateX: '45deg'},
                              {rotateZ: '125deg'},
                              //{rotateZ: '0.985398rad'},
                            ],
                          }}></View>
                        {item.subjectName ? (
                          <Text
                            //numberOfLines={2}
                            style={{
                              lineHeight: 25,
                              textTransform: 'capitalize',
                              marginVertical: 5,
                              fontFamily: 'Poppins-Regular',

                              fontSize: ResponsiveSize(config.AppAllHeaderSize),
                              //fontWeight: 'bold',
                            }}>
                            {item.subjectName}{' '}
                          </Text>
                        ) : null}

                        <Text
                          numberOfLines={2}
                          style={{
                            fontFamily: 'Poppins-Regular',
                            color: 'gray',
                            fontSize: ResponsiveSize(config.AppAllTextSize),
                            //textAlign: 'center',
                            lineHeight: 25,
                          }}>
                          {item.batchYear +
                            (item.semester ? ' - ' : '') +
                            item.semester +
                            (item.section ? ' - ' : '') +
                            item.section +
                            (item.course ? ' - ' : '') +
                            item.course +
                            (item.department ? ' (' : '') +
                            item.department +
                            (item.department ? ')' : '')}
                        </Text>

                        <View
                          style={{
                            width: '100%',
                            alignSelf: 'center',
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginVertical: 10,
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                          }}>
                          <View
                            style={{
                              width: '50%',
                              alignItems: 'center',
                              flexDirection: 'row',
                              justifyContent: 'flex-start',
                            }}>
                            <CustomFastImage
                              resizeMode={'contain'}
                              style={{
                                width: 20,
                                height: 20,
                                marginRight: 10,
                              }}
                              source={require('../assets/user.png')}
                            />

                            {item.studentCount ? (
                              <Text
                                style={{
                                  fontFamily: 'Poppins-Regular',
                                  color: config.PrimaryColor,
                                  fontWeight: 'bold',
                                  fontSize: config.AppAllHeaderSize,
                                }}>
                                Total Student : {item.studentCount.toString()}
                              </Text>
                            ) : null}
                          </View>
                          <View
                            style={{
                              width: '50%',
                              alignItems: 'flex-end',
                              justifyContent: 'center',
                            }}>
                            {item.subjectType ? (
                              <Text
                                style={{
                                  fontFamily: 'Poppins-Regular',
                                  color: config.PrimaryColor,
                                  fontWeight: 'bold',
                                  fontSize: config.AppAllHeaderSize,
                                }}>
                                {'> '}
                                {item.subjectType}{' '}
                              </Text>
                            ) : null}
                          </View>
                        </View>
                        {/*</View>*/}
                      </TouchableOpacity>
                      {this.state.TempIndex == index ? (
                        !this.state.Loader &&
                        this.state.GetSubjectTest.length ? (
                          <View
                            style={{
                              width: '100%',
                              //  height: 300,
                              backgroundColor: '#E1FCFF',
                              padding: 10,
                            }}>
                            {/*{this.state.GetSubjectTest.map((item2.item, index2) => {*/}
                            <CommonFlatlist
                              refreshing={this.state.refreshing}
                              //_onRefresh={this._onRefresh.bind(this)}
                              _onRefresh={() => {
                                this._onRefresh(
                                  this.onPressGetSubjectTest(
                                    this.state.staffCode,
                                    item.subjectNo,
                                    item.batchYear,
                                    item.section,
                                  ),
                                );
                              }}
                              data={this.state.GetSubjectTest}
                              Loader={this.state.Loader}
                              renderItem={(item2) => {
                                let Duration = [];
                                if (item2.item.duration != null) {
                                  Duration = item2.item.duration.split(':');
                                }
                                return (
                                  <TouchableOpacity
                                    activeOpacity={0.5}
                                    onPress={() => {
                                      this.props.navigation.navigate(
                                        'StaffInternalMarkDetail',
                                        {
                                          ColorCode: config.PrimaryColor,
                                          subjectName: item.subjectName,
                                          subjectNo: item.subjectNo,
                                          batchYear: item.batchYear,
                                          degreeCode: item.degreeCode,
                                          semester: item.semester,
                                          section: item.section,
                                          subjectCode: item.subjectCode,
                                          criteria: item2.item.testName,
                                          MaxMarks: item2.item.maxMark,
                                          examDate: item2.item.examDate,
                                        },
                                      );
                                    }}
                                    key={item2.index}
                                    style={{
                                      width: '100%',
                                      backgroundColor: 'white',
                                      //borderRadius: 10,
                                      //height: 150,
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      paddingRight: 10,
                                      marginBottom: 10,
                                      padding: 10,
                                      borderWidth: 1,
                                      borderColor: config.PrimaryColor,
                                    }}>
                                    <View style={{width: '100%'}}>
                                      {item2.item.testName ? (
                                        <Text
                                          //numberOfLines={2}
                                          style={{
                                            lineHeight: 25,
                                            textTransform: 'uppercase',
                                            marginVertical: 5,
                                            fontFamily: 'Poppins-Regular',
                                            color: config.PrimaryColor,
                                            fontSize: ResponsiveSize(
                                              config.AppAllHeaderSize,
                                            ),
                                            fontWeight: 'bold',
                                          }}>
                                          {item2.item.testName}
                                        </Text>
                                      ) : null}

                                      <View
                                        style={{
                                          width: '100%',
                                          alignSelf: 'center',
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                          marginVertical: 10,
                                          flexWrap: 'wrap',
                                          justifyContent: 'space-between',
                                        }}>
                                        <View
                                          style={{
                                            width: '60%',
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            justifyContent: 'flex-start',
                                          }}>
                                          <CustomFastImage
                                            resizeMode={'contain'}
                                            style={{
                                              width: 20,
                                              height: 20,
                                              marginRight: 10,
                                            }}
                                            source={require('../assets/user.png')}
                                          />

                                          <Text
                                            style={{
                                              fontFamily: 'Poppins-Regular',
                                              color: config.PrimaryColor,
                                              fontWeight: 'bold',
                                              fontSize: config.AppAllHeaderSize,
                                            }}>
                                            Exam Date : {item2.item.examDate}
                                          </Text>
                                        </View>
                                        <View
                                          style={{
                                            width: '40%',
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            justifyContent: 'flex-end',
                                          }}>
                                          <CustomFastImage
                                            resizeMode={'contain'}
                                            style={{
                                              width: 20,
                                              height: 20,
                                              marginRight: 10,
                                            }}
                                            source={require('../assets/user.png')}
                                          />

                                          <Text
                                            style={{
                                              fontFamily: 'Poppins-Regular',
                                              color: config.PrimaryColor,
                                              fontWeight: 'bold',
                                              fontSize: config.AppAllHeaderSize,
                                            }}>
                                            Time : {item2.item.startTime}
                                          </Text>
                                        </View>
                                      </View>
                                      <View
                                        style={{
                                          width: '100%',
                                          alignItems: 'center',
                                          flexDirection: 'row',
                                          justifyContent: 'flex-start',
                                        }}>
                                        <CustomFastImage
                                          resizeMode={'contain'}
                                          style={{
                                            width: 20,
                                            height: 20,
                                            marginRight: 10,
                                          }}
                                          source={require('../assets/user.png')}
                                        />

                                        <Text
                                          style={{
                                            fontFamily: 'Poppins-Regular',
                                            color: config.PrimaryColor,
                                            fontWeight: 'bold',
                                            fontSize: config.AppAllHeaderSize,
                                          }}>
                                          Duration :{' '}
                                          {Duration[0]
                                            ? Duration[0] + ' hour'
                                            : ''}
                                          {Duration[1] != '00' &&
                                          Duration[1] != undefined
                                            ? ' ' + Duration[1] + ' min'
                                            : ''}
                                        </Text>
                                      </View>

                                      <View
                                        style={{
                                          width: '100%',
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                          paddingTop: 10,
                                          marginTop: 10,
                                          borderTopWidth: 0.5,
                                          borderTopColor: 'silver',
                                        }}>
                                        {item2.item.minMark ||
                                        item2.item.minMark == 0 ? (
                                          <View
                                            style={{
                                              width: '40%',
                                              height: 30,
                                              //marginLeft: 10,
                                              borderRadius: 25,
                                              justifyContent: 'center',
                                              alignItems: 'center',
                                              backgroundColor:
                                                config.PrimaryColor,
                                            }}>
                                            <Text
                                              style={{
                                                fontFamily: 'Poppins-Regular',
                                                fontSize: ResponsiveSize(
                                                  config.AppAllTextSize,
                                                ),
                                                color: 'white',
                                              }}>
                                              Min Mark : {item2.item.minMark}
                                            </Text>
                                          </View>
                                        ) : null}
                                        {item2.item.maxMark ? (
                                          <View
                                            style={{
                                              width: '40%',
                                              height: 30,
                                              marginLeft: 10,
                                              borderRadius: 25,
                                              justifyContent: 'center',
                                              alignItems: 'center',
                                              backgroundColor: DarkGreenColor,
                                            }}>
                                            <Text
                                              style={{
                                                fontFamily: 'Poppins-Regular',
                                                fontSize: ResponsiveSize(
                                                  config.AppAllTextSize,
                                                ),
                                                color: 'white',
                                              }}>
                                              Max Mark : {item2.item.maxMark}
                                            </Text>
                                          </View>
                                        ) : null}
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                );
                              }}
                            />
                          </View>
                        ) : !this.state.Loader ? (
                          <View
                            key={Math.random()}
                            duration={400}
                            style={[
                              styles.header,
                              {width: '95%', alignSelf: 'center'},
                            ]}
                            transition="backgroundColor">
                            <Text
                              style={[
                                styles.headerText,
                                {textTransform: 'none'},
                              ]}>
                              No Data Available
                            </Text>
                          </View>
                        ) : null
                      ) : null}
                    </View>
                  );
                }}
              />
            ) : !this.state.Loader ? (
              <View
                key={Math.random()}
                duration={400}
                style={[styles.header, {width: '95%', alignSelf: 'center'}]}
                transition="backgroundColor">
                <Text style={[styles.headerText, {textTransform: 'none'}]}>
                  No Data Available
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
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

  SubjectMainContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20,
  },
  AttendanceCustomDateTextView: {
    height: 60,
    width: '75%',
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
});
