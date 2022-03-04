import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {ScrollView} from 'react-native';
import {BackHandler} from 'react-native';
import {Image} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {SafeAreaView, StyleSheet} from 'react-native';
import {View, Text} from 'react-native';
import config from '../../config/config';
import {CustomHeader} from '../CustomHeader';
import * as Animatable from 'react-native-animatable';
import {Loader} from '../Loader';
import ResponsiveSize from '../../config/ResponsiveSize';
import {Checkbox} from 'react-native-paper';
import {Item, Picker} from 'native-base';
import {CustomButton} from '../common/Button';

export default class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Loader: false,
      subTitle: this.props.route.params
        ? this.props.route.params.subTitle
          ? this.props.route.params.subTitle
          : ''
        : '',

      SummaryItems: [
        {
          name: 'Receipt No',
          type: 'PEC2012424',
        },
        {
          name: 'Reference No',
          type: '764583276347572478632',
        },
        {
          name: 'Transaction Id',
          type: '352353',
        },
        {
          name: 'Transaction Date',
          type: '4/5/2021',
        },
        {
          name: 'Payment Detail',
          type: 'Online Fee Payment',
        },
      ],
      Fees: [
        {
          name: 'Admission Fee',
          type: 'Admission Fee',
          amount: 20.0,
        },
        {
          name: 'Admission Fee',
          type: 'Admission Fee',
          amount: 10.0,
        },
        {
          name: 'Admission Fee',
          type: 'Admission Fee',
          amount: 40.0,
        },
        {
          name: 'Admission Fee',
          type: 'Admission Fee',
          amount: 30.0,
        },
      ],
      Token: '',
      Title: this.props.route.params
        ? this.props.route.params.title
          ? this.props.route.params.title
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
        //alert(value);
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
      if (value !== null) {
        //alert(value);
        this.setState({sem: parseInt(value)}, function () {
          //  this.onLoadGetStudentFeedbackBasedOnSem();
        });
      }
    } catch (error) {
      alert('Error retrieving data');
    }
  };
  onLoadGetStudentFeedbackBasedOnSem = () => {
    const url = config.baseUrl + 'student/GetStudentFeedbackBasedOnSem';
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
        semester: this.state.sem,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //console.log(
        //  'GetStudentFeedbackBasedOnSem = ' + JSON.stringify(responseJson),
        //);
        if (responseJson) {
          this.setState(
            {Loader: false, FeesList: responseJson},
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
      <SafeAreaView
        style={{width: '100%', height: '100%', backgroundColor: 'white'}}>
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

        <View style={styles.SubjectMainContainer}>
          <ScrollView>
            <TouchableOpacity
              disabled
              activeOpacity={1}
              style={[
                styles.FeedbackView,
                {
                  backgroundColor: '#EFEDFB',
                  // '#E9F9FB'
                  // '#EFEDFB'
                  // '#EFF5FE'
                },
              ]}>
              <Text
                numberOfLines={1}
                style={[
                  styles.MainTitle,
                  {
                    color: '#8075EA',
                    //  '#8075EA'
                    // '#5289E6',
                    paddingLeft: 10,
                    fontSize: ResponsiveSize(config.AppAllHeaderSize),
                  },
                ]}>
                Summary
              </Text>
              {this.state.SummaryItems.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 10,
                    }}>
                    <View style={{width: '50%', justifyContent: 'center'}}>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.MainTitle,
                          {
                            color: '#8075EA',
                            //  '#8075EA'
                            // '#5289E6',

                            paddingLeft: 10,
                            fontSize: ResponsiveSize(config.AppAllTextSize),
                          },
                        ]}>
                        {item.name}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '50%',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                      }}>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.MainTitle,
                          {
                            color: '#8075EA',
                            //  '#8075EA'
                            // '#5289E6',
                            paddingLeft: 10,
                            fontSize: ResponsiveSize(config.AppAllTextSize),
                          },
                        ]}>
                        {item.type}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </TouchableOpacity>
            <TouchableOpacity
              disabled
              activeOpacity={1}
              style={[
                styles.FeedbackView,
                {
                  backgroundColor: '#EFF5FE',
                  // '#E9F9FB'
                  // '#EFEDFB'
                  // '#EFF5FE',
                  marginTop: 20,
                  padding: 0,
                  paddingVertical: 0,
                  paddingBottom: 20,
                },
              ]}>
              <View
                style={{
                  width: '100%',
                  borderRadius: 15,
                  height: 45,
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#5289E6',
                }}>
                <View
                  style={{
                    width: '40%',
                    justifyContent: 'center',
                    paddingLeft: 10,
                  }}>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.MainTitle,
                      {
                        paddingLeft: 10,
                        fontSize: ResponsiveSize(config.AppAllTextSize),
                      },
                    ]}>
                    Header Name
                  </Text>
                </View>
                <View
                  style={{
                    width: '40%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.MainTitle,
                      {
                        paddingLeft: 10,
                        fontSize: ResponsiveSize(config.AppAllTextSize),
                      },
                    ]}>
                    Lefger Name
                  </Text>
                </View>
                <View
                  style={{
                    width: '20%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.MainTitle,
                      {
                        paddingLeft: 10,
                        fontSize: ResponsiveSize(config.AppAllTextSize),
                      },
                    ]}>
                    Amount
                  </Text>
                </View>
              </View>
              {this.state.Fees.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 10,
                    }}>
                    <View
                      style={{
                        width: '40%',
                        justifyContent: 'center',
                        paddingLeft: 10,
                      }}>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.MainTitle,
                          {
                            color: '#5289E6',
                            paddingLeft: 10,
                            fontSize: ResponsiveSize(config.AppAllTextSize),
                          },
                        ]}>
                        {item.name}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '40%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.MainTitle,
                          {
                            color: '#5289E6',
                            paddingLeft: 10,
                            fontSize: ResponsiveSize(config.AppAllTextSize),
                          },
                        ]}>
                        {item.type}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '20%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.MainTitle,
                          {
                            color: '#5289E6',
                            paddingLeft: 10,
                            fontSize: ResponsiveSize(config.AppAllTextSize),
                          },
                        ]}>
                        {item.amount}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </TouchableOpacity>
            <View
              style={{
                width: '95%',
                alignSelf: 'center',
                borderRadius: 15,
                height: 45,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#E9F9FB',
                marginTop: 20,
              }}>
              <View
                style={{
                  width: '50%',
                  justifyContent: 'center',
                  paddingLeft: 10,
                }}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.MainTitle,
                    {
                      paddingLeft: 10,
                      color: '#2BB9CA',
                      fontSize: ResponsiveSize(config.AppAllTextSize),
                    },
                  ]}>
                  Total Amount Paid
                </Text>
              </View>
              <View
                style={{
                  width: '50%',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  paddingRight: 15,
                }}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.MainTitle,
                    {
                      paddingLeft: 10,
                      color: '#2BB9CA',
                      fontSize: ResponsiveSize(config.AppAllTextSize),
                    },
                  ]}>
                  $10/-
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={{width: '100%', marginVertical: 10}}>
          <CustomButton width={'50%'} title="Print" onPress={() => {}} />
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  SubjectMainContainer: {
    width: '100%',
    height: '70%',
  },
  FeedbackView: {
    width: '95%',
    alignSelf: 'center',
    //height: 190,
    justifyContent: 'space-evenly',
    marginTop: 10,
    borderRadius: 15,
    padding: 10,
    paddingVertical: 20,
  },
  MainTitle: {
    fontFamily: 'Poppins-Regular',
    color: 'white',
    fontWeight: 'bold',
    fontSize: ResponsiveSize(config.AppAllTextSize),
  },
  partition: {
    width: '22%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRightWidth: 0.5,
    marginVertical: 10,
    borderColor: 'gray',
  },
  item: {
    borderRadius: 5,
    backgroundColor: '#f2f2f2',
    width: 150,
    height: 45,
    borderColor: '#8075EA',
    borderWidth: 1,
  },
});
