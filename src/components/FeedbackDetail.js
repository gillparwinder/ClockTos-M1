//}

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {StyleSheet, ScrollView, BackHandler} from 'react-native';
import {Text, TouchableOpacity} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-tiny-toast';
import ResponsiveSize from '../config/ResponsiveSize';
import config from '../config/config';
import {ImageBackground} from 'react-native';
import {SafeAreaView} from 'react-native';
import {CustomHeader} from './CustomHeader';
import {Loader} from './Loader';
import {View} from 'react-native';
import {Rating, AirbnbRating} from 'react-native-elements';
import {Image, Animated} from 'react-native';
import ProgressCircle from 'react-native-progress-circle';
import {CustomButton} from './common/Button';
import {Textarea} from 'native-base';
import CustomFastImage from './common/CustomFastImage';
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};
let filterredStarsData = [];
export default class FeedbackDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Loader: true,
      subTitle: this.props.route.params
        ? this.props.route.params.subTitle
          ? this.props.route.params.subTitle
          : ''
        : '',
      staffCode: this.props.route.params
        ? this.props.route.params.staffCode
          ? this.props.route.params.staffCode
          : ''
        : '',
      subjectCode: this.props.route.params
        ? this.props.route.params.subjectCode
          ? this.props.route.params.subjectCode
          : ''
        : '',
      selectedColor: this.props.route.params
        ? this.props.route.params.selectedColor
          ? this.props.route.params.selectedColor
          : ''
        : '',
      selectedColor2: this.props.route.params
        ? this.props.route.params.selectedColor2
          ? this.props.route.params.selectedColor2
          : ''
        : '',
      selectedImage: this.props.route.params
        ? this.props.route.params.selectedImage
          ? this.props.route.params.selectedImage
          : ''
        : '',
      StaffDetail: [],
      StarsData: [],
      Position: 50,
      selectedPage: 1,
      PageCount: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      selectedPage: 1,
      Token: '',
      Title: this.props.route.params
        ? this.props.route.params.title
          ? this.props.route.params.title
          : ''
        : '',
      data: this.props.route.params
        ? this.props.route.params.data
          ? this.props.route.params.data
          : []
        : [],
    };
  }
  componentDidMount() {
    //console.log('props = ', this.props);
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
      const value = await AsyncStorage.getItem('rollNo');
      if (value !== null) {
        //alert(value);
        this.setState({rollNo: value.toString()}, function () {});
      }
    } catch (error) {
      alert('Error retrieving data');
    }
    try {
      const value = await AsyncStorage.getItem('sem');
      //alert(value);
      if (value !== null) {
        this.setState({sem: parseInt(value)}, function () {
          //this.props.route.params.data &&
          this.onLoadGetStudentFeedbackBasedOnSubject();
        });
      }
    } catch (error) {
      alert('Error retrieving data');
    }
  };
  onLoadGetStudentFeedbackBasedOnSubject = () => {
    const url = config.baseUrl + 'student/GetStudentFeedbackBasedOnSubject';
    //console.log(url);
    //console.log(
    //  JSON.stringify({
    //    rollNo: this.state.rollNo,
    //    subejctCode: this.state.subjectCode,
    //    feedBackName: this.state.staffCode,
    //    semester: this.state.sem,
    //    staffCode: this.state.staffCode,
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
        rollNo: this.state.rollNo,
        subejctCode: this.state.subjectCode,
        feedBackName: this.state.data.feedBackName,
        semester: this.state.sem,
        staffCode: this.state.staffCode,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.onLoadGetStudentFeedbackBasedOnAnswerType();
        //console.log(
        //  'GetStudentFeedbackBasedOnSubject = ' + JSON.stringify(responseJson),
        //);
        if (responseJson) {
          this.setState(
            {
              StaffDetail: responseJson,
              //PageCount:responseJson.length+2
            },
            function () {},
          );
        } else {
          //this.setState({Loader: false}, function () {
          Toast.show(
            responseJson.title
              ? responseJson.title
              : 'Temporary error try again after some time',
            ToastData,
          );
          //});
        }
      })
      .catch((error) => {
        this.onLoadGetStudentFeedbackBasedOnAnswerType();
        //this.setState({Loader: false}, function () {
        //console.log(error);
        alert(error);
        //});
      });
  };
  onLoadGetStudentFeedbackBasedOnAnswerType = () => {
    const url = config.baseUrl + 'student/GetStudentFeedbackBasedOnAnswerType';
    //console.log(url);

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.state.Token,
      },
      body: JSON.stringify({
        rollNo: this.state.rollNo,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //console.log(
        //  'GetStudentFeedbackBasedOnAnswerType = ' +
        //    JSON.stringify(responseJson),
        //);
        if (responseJson) {
          this.setState(
            {Loader: false, StarsData: responseJson},
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
          //console.log(error);
          alert(error);
        });
      });
  };
  onLoadAddUpdateFeedbackBasedOnSubject = () => {
    const url = config.baseUrl + 'student/AddUpdateFeedbackBasedOnSubject';
    //console.log(url);
    //console.log(
    //  JSON.stringify({
    //    rollNo: this.state.rollNo,
    //    subejctCode: this.state.subjectCode,
    //    feedBackName: this.state.data.feedBackName,
    //    staffCode: this.state.staffCode,
    //    questionMasterfk: 'common lyi kive select kr hou?',
    //    markMasterPk: 'string',
    //    comments: this.state.Comment,

    //    //"rollNo": "A101",
    //    //"subejctCode": "613AMP03",
    //    //"feedbackMasterFk": "1448",
    //    //"staffCode": "1016",
    //    //"questionMasterfk": "10",
    //    //"markMasterPk": "string",
    //    //"comments": "testing"
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
        rollNo: this.state.rollNo,
        subejctCode: this.state.data.feedBackMasterPK,
        feedBackName: this.state.data.feedBackName,
        semester: this.state.sem,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //console.log(
        //  'AddUpdateFeedbackBasedOnSubject = ' + JSON.stringify(responseJson),
        //);
        if (responseJson) {
          this.setState(
            {Loader: false, AddUpdateFeedbackBasedOnSubject: responseJson},
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
          //console.log(error);
          alert(error);
        });
      });
  };

  render() {
    return (
      <SafeAreaView style={{width: '100%', height: '100%'}}>
        <Loader
          Loading={this.state.Loader ? true : false}
          onPressCancel={() => {
            this.setState({Loader: false});
          }}
        />
        <CustomHeader
          isHome={false}
          title={this.state.Title}
          navigation={this.props.navigation}
        />
        <Text
          style={[
            styles.MainTitle,
            {
              color: this.state.selectedColor,
              alignSelf: 'center',
              marginHorizontal: 20,
              marginVertical: 10,
            },
          ]}>
          {this.state.subTitle}
        </Text>
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            height: 50,
            //marginBottom: 60,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}>
          <TouchableOpacity
            onPress={() => {
              if (
                //(this.state.selectedPage > 0 && this.state.Position > 50) ||
                this.state.selectedPage > 1
              ) {
                //console.log('before = ', this.state.selectedPage);
                this.setState(
                  {
                    selectedPage: this.state.selectedPage - 1,
                    //Position: this.state.Position - 50,
                    showCommentBox: false,
                  },
                  function () {
                    //if (this.state.Position > 50) {
                    //this.scrollView.scrollTo({
                    //  x: -this.state.Position,
                    //  animated: true,
                    //});
                    //}
                  },
                );
              } else {
                Toast.show('Minimum value reached');
              }
            }}
            style={{
              width: 35,
              height: 35,
              borderRadius: 25,
              backgroundColor: 'white',
              elevation: 3,
              shadowColor: 'silver',
              shadowOffset: {width: 1, height: 1},
              shadowOpacity: 0.6,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <CustomFastImage
              style={{width: 15, height: 15, resizeMode: 'contain'}}
              source={require('../assets/left.png')}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              marginHorizontal: 20,
              //  width: 150,
              height: 35,
              borderRadius: 25,
              backgroundColor: 'white',
              elevation: 3,
              shadowColor: 'silver',
              shadowOffset: {width: 1, height: 1},
              shadowOpacity: 0.6,
              justifyContent: 'space-evenly',
              alignItems: 'center',
              //  paddingHorizontal: 20,
              flexDirection: 'row',
            }}>
            {/*<ScrollView
              ref={(scrollView) => (this.scrollView = scrollView)}
              horizontal
              showsHorizontalScrollIndicator={false}>
              {this.state.PageCount.map((item, index) => {
                return (
                  <TouchableOpacity
                    activeOpacity={1}
                    disabled
                    //onPress={() => {
                    //  this.setState(
                    //    {
                    //      selectedPage: item,
                    //      Position: this.state.Position,
                    //    },
                    //    function () {
                    //      //  this.scrollView.scrollTo({x: 60, animated: true});
                    //    },
                    //  );
                    //}}
                    style={{
                      width: 25,
                      height: 25,
                      marginLeft: 20,
                      marginRight: 50,
                      borderRadius: 25,
                      backgroundColor:
                        this.state.selectedPage == item
                          ? this.state.selectedColor
                          : 'white',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={[
                        styles.TitleText,
                        {
                          color:
                            this.state.selectedPage == item
                              ? 'white'
                              : this.state.selectedColor,
                        },
                      ]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>*/}
            <TouchableOpacity
              activeOpacity={1}
              disabled
              style={{
                width: 25,
                height: 25,
                //marginLeft: 20,
                //marginRight: 50,
                borderRadius: 25,
                backgroundColor: this.state.selectedColor,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={[
                  styles.TitleText,
                  {
                    color: 'white',
                  },
                ]}>
                {this.state.selectedPage}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (
                this.state.selectedPage > 0 &&
                this.state.StaffDetail[this.state.selectedPage - 1].length
              ) {
                this.setState(
                  {
                    selectedPage: this.state.StaffDetail[
                      this.state.selectedPage - 1
                    ].length
                      ? this.state.selectedPage + 1
                      : 2,
                    //Position: this.state.Position + 50,
                    showCommentBox: this.state.StaffDetail[
                      this.state.selectedPage - 1
                    ].length
                      ? false
                      : true,
                  },
                  function () {
                    //this.scrollView.scrollTo({
                    //  x: this.state.Position,
                    //  animated: true,
                    //});
                    //console.log(
                    //  'this.state.selectedPage if = ',
                    //  this.state.selectedPage,
                    //  ' this.state.StaffDetail[this.state.selectedPage - 1].length = ',
                    //  this.state.StaffDetail[this.state.selectedPage - 1]
                    //    .length,
                    //);
                  },
                );
              } else {
                //console.log(
                //  'this.state.selectedPage else = ',
                //  this.state.selectedPage,
                //  ' this.state.StaffDetail[this.state.selectedPage - 1].length = ',
                //  Object.keys(
                //    this.state.StaffDetail[this.state.selectedPage - 1],
                //  ).length,
                //);
                Toast.show('Maximum value reached');
              }
            }}
            style={{
              width: 35,
              height: 35,
              borderRadius: 25,
              backgroundColor: 'white',
              elevation: 3,
              shadowColor: 'silver',
              shadowOffset: {width: 1, height: 1},
              shadowOpacity: 0.6,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <CustomFastImage
              style={{width: 15, height: 15}}
              source={require('../assets/right2.png')}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        </View>
        <ScrollView>
          {this.state.showCommentBox ? (
            //{this.state.PageCount.length == this.state.selectedPage ? (
            <View style={{width: '100%'}}>
              <Text
                style={[
                  styles.MainTitle,
                  {
                    color: this.state.selectedColor,
                    marginTop: 40,
                    marginLeft: 15,
                    alignSelf: 'flex-start',
                    textAlign: 'left',
                  },
                ]}>
                Write Your Comments
              </Text>
              <View style={[styles.item1]}>
                <Textarea
                  blurOnSubmit={true}
                  rowSpan={5}
                  placeholder="Write here..."
                  bordered
                  style={styles.textarea}
                  value={this.state.Comment}
                  onChangeText={(Comment) => {
                    this.setState({Comment});
                  }}
                />
              </View>
              <View
                style={{
                  width: '100%',
                  height: 100,
                  justifyContent: 'center',
                }}>
                <CustomButton
                  title="Save"
                  color={this.state.selectedColor}
                  onPress={() => {
                    this.onLoadAddUpdateFeedbackBasedOnSubject();
                  }}
                />
              </View>
            </View>
          ) : (
            <View>
              <View style={{height: 50, width: '100%'}}></View>
              <CustomFastImage
                style={styles.SubjectNameImageView}
                source={this.state.selectedImage}
                resizeMode={'stretch'}
              />
              <View style={styles.SubjectNameTextView}>
                <View
                  style={[
                    styles.CommonView,
                    {width: '35%', justifyContent: 'space-evenly'},
                  ]}>
                  <View
                    style={{
                      width: 100,
                      height: 100,
                      backgroundColor: this.state.selectedColor2,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 15,
                      marginTop: -50,
                    }}>
                    <CustomFastImage
                      style={{
                        width: '85%',
                        height: '85%',
                        resizeMode: 'cover',
                        borderRadius: 15,
                      }}
                      source={require('../assets/demoPic.png')}
                      resizeMode={'cover'}
                    />
                  </View>
                  <Text
                    numberOfLines={2}
                    style={[
                      styles.MainTitle,
                      {color: 'white', fontWeight: '500'},
                    ]}>
                    {this.state.StaffDetail.length &&
                    this.state.StaffDetail[this.state.selectedPage - 1].data
                      .length
                      ? this.state.StaffDetail[this.state.selectedPage - 1]
                          .data[this.state.selectedPage - 1].staffName
                      : null}
                  </Text>
                </View>
                <View style={[styles.FeedbackTextContainer, {width: '65%'}]}>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.MainTitle,
                      {color: 'white', fontWeight: '500'},
                    ]}>
                    Staff Code :{' '}
                    {this.state.StaffDetail.length &&
                    this.state.StaffDetail[this.state.selectedPage - 1].data
                      .length
                      ? this.state.StaffDetail[this.state.selectedPage - 1]
                          .data[this.state.selectedPage - 1].staffCode
                      : null}
                  </Text>
                  <Text
                    numberOfLines={3}
                    style={[
                      styles.MainTitle,
                      {color: 'white', fontWeight: '500'},
                    ]}>
                    Subject :{' '}
                    {this.state.StaffDetail.length &&
                    this.state.StaffDetail[this.state.selectedPage - 1].data
                      .length
                      ? this.state.StaffDetail[this.state.selectedPage - 1]
                          .data[this.state.selectedPage - 1].subjectName
                      : null}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.SubjectMainContainer,
                  {
                    backgroundColor: 'white',
                  },
                ]}>
                <View
                  style={[
                    styles.SubjectMainContainer2,
                    {
                      backgroundColor: this.state.selectedColor2,
                    },
                  ]}>
                  {this.state.StaffDetail.length &&
                  this.state.StaffDetail[this.state.selectedPage - 1].data
                    .length ? (
                    this.state.StaffDetail[
                      this.state.selectedPage - 1
                    ].data.map((item, index) => {
                      return (
                        <TouchableOpacity
                          activeOpacity={1}
                          disabled
                          //onPress={() => {
                          //  this.props.navigation.navigate('FeedbackDetail', {
                          //    subTitle: item.name,
                          //    title: 'Feedback ',
                          //    resultColor:
                          //      index % 2 == 0 && index % 3 != 0
                          //        ? '#7260E9'
                          //        : index % 3 == 0
                          //        ? '#23C4D7'
                          //        : '#6397F2',
                          //  });
                          //}}
                          //  key={index}
                          //onPress={() => {
                          //  this.props.navigation.navigate('DetailScreenMenu', {
                          //    title: 'Result',

                          //    resultColor:
                          //      index % 2 == 0 && index % 3 != 0
                          //        ? '#7260E9'
                          //        : index % 3 == 0
                          //        ? '#23C4D7'
                          //        : '#6397F2',
                          //  });
                          //}}
                          style={[
                            styles.FeedbackView,
                            {
                              backgroundColor: 'white',
                            },
                          ]}>
                          <View style={[styles.CommonView, {width: '25%'}]}>
                            <View
                              style={{
                                width: 60,
                                height: 60,
                                backgroundColor: this.state.selectedColor,
                                borderRadius: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <Text
                                style={[styles.MainTitle, {color: 'white'}]}>
                                {index + 1}
                              </Text>
                            </View>
                          </View>
                          <View
                            style={[
                              styles.FeedbackTextContainer,
                              {flexWrap: 'wrap'},
                            ]}>
                            <Text numberOfLines={2} style={styles.MainTitle}>
                              {item.feedBackName}
                            </Text>
                            <View
                              style={{
                                width: '100%',
                                height: '30%',
                                alignItems: 'flex-end',
                                flexDirection: 'row',
                              }}>
                              <AirbnbRating
                                count={item.point}
                                reviews={
                                  [
                                    //'Poor',
                                    //'Fair',
                                    //'Good',
                                    //'Very Good',
                                    //'Excellent',
                                  ]
                                }
                                //defaultRating={
                                //  this.state.StarsData.length &&
                                //  this.state.StarsData[index].point
                                //}
                                onFinishRating={(star) => {
                                  let StarsData = this.state.StarsData;
                                  filterredStarsData = StarsData.filter(
                                    function (item2) {
                                      ////console.log(item);
                                      return item2.answerID == item.answerId;
                                    },
                                  ).map(function ({
                                    answerID,
                                    answer,
                                    point,
                                    noOfStars,
                                  }) {
                                    return {
                                      answerID,
                                      answer,
                                      point,
                                      noOfStars,
                                    };
                                  });
                                  //console.log(
                                  //  'filterredStarsData = ',
                                  //  filterredStarsData,
                                  //);
                                  let subjectDetail = this.state.StaffDetail[
                                    this.state.selectedPage - 1
                                  ];
                                  subjectDetail.data[index].noOfStars = star;
                                  this.setState(
                                    {subjectDetail, TempIndex: index},
                                    function () {},
                                  );
                                }}
                                size={20}
                              />
                              <Text
                                numberOfLines={1}
                                style={[
                                  styles.MainTitle,
                                  {
                                    marginLeft: 20,
                                    color: filterredStarsData.length
                                      ? filterredStarsData[0].noOfStars > 3
                                        ? 'green'
                                        : filterredStarsData[0].noOfStars == 1
                                        ? 'red'
                                        : 'orange'
                                      : null,
                                  },
                                ]}>
                                {filterredStarsData.length &&
                                this.state.TempIndex == index
                                  ? filterredStarsData[0].answer
                                  : null}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    })
                  ) : !this.state.Loader ? (
                    <Animatable.View
                      key={Math.random()}
                      duration={400}
                      style={{width: '95%', alignSelf: 'center', marginTop: 20}}
                      transition="backgroundColor">
                      <Text style={{fontFamily: 'Poppins-Regular'}}>
                        No data available
                      </Text>
                    </Animatable.View>
                  ) : null}
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  SubjectMainContainer: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },
  SubjectMainContainer2: {
    width: '95%',
    //alignItems: "center",
    paddingBottom: 20,
    marginTop: 20,
    borderRadius: 15,
    alignSelf: 'center',
  },
  item1: {
    backgroundColor: '#ffffff',
    borderColor: '#f1f1f1',
    borderWidth: 0.3,
    elevation: 3,
    shadowOffset: {width: 0, height: 0},
    width: '95%',
    alignSelf: 'center',
    borderRadius: 10,
    marginVertical: 10,
  },
  textarea: {
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderRadius: 8,
  },
  FeedbackView: {
    width: '95%',
    alignSelf: 'center',
    height: 120,
    marginTop: 10,
    borderRadius: 15,
    alignItems: 'center',
    flexDirection: 'row',
  },
  CommonView: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  FeedbackTextContainer: {
    width: '75%',
    justifyContent: 'space-evenly',
    height: '100%',
    paddingVertical: 20,
    paddingRight: 20,
  },
  TitleText: {
    fontFamily: 'Poppins-Regular',
    color: 'white',
    fontSize: ResponsiveSize(12),
    marginTop: 5,
  },
  MainTitle: {
    fontFamily: 'Poppins-Regular',
    color: 'black',
    fontWeight: 'bold',
    fontSize: ResponsiveSize(config.AppAllHeaderSize),
  },
  SubjectNameImageView: {
    width: '95%',
    alignSelf: 'center',
    height: 120,
    resizeMode: 'stretch',
    position: 'relative',
    borderRadius: 15,
    marginVertical: 10,
  },
  SubjectNameTextView: {
    height: 120,
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: -130,
    flexDirection: 'row',
    alignItems: 'center',
  },
  SubjectNameTextStyle: {
    color: 'white',
    fontWeight: '500',
    fontSize: ResponsiveSize(config.AppAllHeaderSize),
    paddingHorizontal: 10,
    textTransform: 'uppercase',
    fontFamily: 'Poppins-Regular',
  },
});
