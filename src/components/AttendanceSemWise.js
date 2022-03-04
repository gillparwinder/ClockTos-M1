import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {StyleSheet, ScrollView, FlatList} from 'react-native';
import {Text, BackHandler} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-tiny-toast';
import ResponsiveSize from '../config/ResponsiveSize';
import config from '../config/config';
import {SafeAreaView} from 'react-native';
import {CustomHeader} from './CustomHeader';
import {Loader} from './Loader';
import {View} from 'react-native';
import {Image} from 'react-native';
import ProgressCircle from 'react-native-progress-circle';
import Nodata from '../Circular/NoData';
import CustomFastImage from './common/CustomFastImage';
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};

export default class AttendanceSemWise extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Loader: true,
      Attendance: [],
      Token: '',
      Title: this.props.route.params
        ? this.props.route.params.title
          ? this.props.route.params.title
          : ''
        : '',
      subTitle: this.props.route.params
        ? this.props.route.params.subTitle
          ? this.props.route.params.subTitle
          : ''
        : '',
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
        this.setState({Token: value}, function () {
          this.onLoadGetAttendanceSemWise();
        });
      }
    } catch (error) {
      alert('Error retrieving data');
    }
  };
  onLoadGetAttendanceSemWise = () => {
    const url = config.baseUrl + 'student/SemesterWiseAttendance';
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
            {Loader: false, Attendance: responseJson},
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
  render() {
    return (
      <SafeAreaView style={{width: '100%', height: '100%'}}>
        {this.state.Title ? (
          <CustomHeader
            isHome={false}
            title={this.state.Title}
            navigation={this.props.navigation}
          />
        ) : null}
        <Loader
          Loading={this.state.Loader ? true : false}
          onPressCancel={() => {
            this.setState({Loader: false});
          }}
        />
        <View style={styles.SubjectMainContainer}>
          <CustomFastImage
            style={styles.SubjectNameImageView}
            source={require('../assets/purpleBg.png')}
            resizeMode={'stretch'}
          />
          <View style={styles.SubjectNameTextView}>
            <Text numberOfLines={1} style={styles.SubjectNameTextStyle}>
              {this.state.subTitle}
            </Text>
          </View>
          <View style={{width: '100%', height: '85%'}}>
            <FlatList
              data={this.state.Attendance}
              keyExtractor={(item, index) => index}
              contentContainerStyle={{
                backgroundColor: '#ffffff',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              ListEmptyComponent={
                <View style={{marginTop: 10}}>
                  <Nodata title="No Data Found" />
                </View>
              }
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      //if (index == 0) {
                      this.props.navigation.navigate('DetailScreenMenu', {
                        title: 'Attendance',
                        subTitle: 'semester',
                        SemesterWiseAttendanceData: item,
                      });
                      //} else {
                      //  Toast.show('No data available');
                      //}
                    }}
                    style={{
                      width: '95%',
                      alignSelf: 'center',
                      height: 120,
                      marginBottom: 10,
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <CustomFastImage
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        height: 120,
                        position: 'absolute',
                        marginBottom: 15,
                      }}
                      source={
                        index % 2 == 0 && index % 3 != 0
                          ? require('../assets/blueAtt.png')
                          : index % 3 == 0
                          ? require('../assets/purpleAtt.png')
                          : require('../assets/greenAtt.png')
                      }
                      resizeMode={'stretch'}
                    />
                    <View
                      style={{
                        width: '70%',
                        height: 120,
                        justifyContent: 'center',
                      }}>
                      <View
                        style={{
                          width: '100%',
                          alignSelf: 'center',
                          justifyContent: 'flex-end',
                          paddingLeft: 35,
                        }}>
                        <Text style={styles.MainTitle}>{item.semester}</Text>
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
                          <Text style={styles.TitleText}>Total</Text>
                          <Text style={styles.SubTitleText}>
                            {item.totalHours}
                            <Text
                              style={{
                                fontFamily: 'Poppins-Regular',
                                fontSize: ResponsiveSize(8),
                              }}>
                              {' '}
                              H
                            </Text>
                          </Text>
                        </View>
                        <View
                          style={{
                            width: '30%',
                            borderRightWidth: 1,
                            borderColor: 'white',
                            padding: 10,
                          }}>
                          <Text style={styles.TitleText}>Present</Text>
                          <Text style={styles.SubTitleText}>
                            {item.presentHours}
                            <Text
                              style={{
                                fontFamily: 'Poppins-Regular',
                                fontSize: ResponsiveSize(8),
                              }}>
                              {' '}
                              H
                            </Text>
                          </Text>
                        </View>
                        <View style={{width: '30%', padding: 10}}>
                          <Text style={styles.TitleText}>Absent</Text>
                          <Text style={styles.SubTitleText}>
                            {item.absentHours}
                            <Text
                              style={{
                                fontFamily: 'Poppins-Regular',
                                fontSize: ResponsiveSize(8),
                              }}>
                              {' '}
                              H
                            </Text>
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        width: '30%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <ProgressCircle
                        percent={item.percentage}
                        radius={35}
                        borderWidth={4}
                        color="white"
                        shadowColor="gray"
                        bgColor={
                          index % 2 == 0 && index % 3 != 0
                            ? '#6397F2'
                            : index % 3 == 0
                            ? '#7260E9'
                            : '#23C4D7'
                        }>
                        <View
                          style={{
                            width: 45,
                            height: 45,
                            borderRadius: 45,
                            backgroundColor: 'white',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              fontFamily: 'Poppins-Regular',
                              fontSize: ResponsiveSize(config.AppAllTextSize),
                              color: 'green',
                              fontWeight: 'bold',
                            }}>
                            {item.percentage}%
                          </Text>
                        </View>
                      </ProgressCircle>
                    </View>
                  </TouchableOpacity>
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
  headerNew: {
    padding: 10,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 5,
  },
  headerTextNew: {
    //textAlign: 'center',
    width: '60%',
    fontSize: ResponsiveSize(16),
    fontWeight: '400',
    lineHeight: 24,
    textTransform: 'uppercase',
    fontFamily: 'Poppins-Regular',
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
    zIndex: 2,
    marginVertical: 10,
    alignItems: 'center',
  },
  SubjectNameTextStyle: {
    color: 'white',
    fontWeight: '500',
    fontSize: ResponsiveSize(config.buttonSize),
    paddingHorizontal: 10,
    textTransform: 'uppercase',
    fontFamily: 'Poppins-Regular',
  },
  SubjectMainContainer: {
    width: '100%',
    //alignItems: "center",
    paddingBottom: 20,
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
