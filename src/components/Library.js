import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-tiny-toast';
import ProgressCircle from 'react-native-progress-circle';
import ResponsiveSize from '../config/ResponsiveSize';
import config from '../config/config';
import {ImageBackground} from 'react-native';
import {SafeAreaView} from 'react-native';
import {CustomHeader} from './CustomHeader';
import {Loader} from './Loader';
import {ProgressBar, Colors} from 'react-native-paper';
import {View} from 'react-native';
import {Image, BackHandler} from 'react-native';
import moment from 'moment';
import CustomFastImage from './common/CustomFastImage';
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};
const GreenColor = '#6FD8E4';
export default class Library extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Loader: true,
      LibraryHeaderDetails: {},
      LibraryBookDetails: [],
      Title: this.props.route.params
        ? this.props.route.params.title
          ? this.props.route.params.title
          : ''
        : '',
      LibraryArr: [
        {
          subName: 'Advance computer science and structure',
          date: '09/03',
          dueDate: '12/03',
          fine: '0',
          daysLeft: 3,
        },
        {
          subName: 'Physics',
          date: '11/03',
          dueDate: '25/03',
          fine: '120',
          daysLeft: 14,
        },
        {
          subName: 'Maths',
          date: '09/03',
          dueDate: '12/03',
          fine: '100',
          daysLeft: 3,
        },
      ],
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
        this.setState({Token: value}, function () {
          this.onLoadGetLibraryHeaderDetails();
        });
      }
    } catch (error) {
      alert('Error retrieving data');
    }
  };
  onLoadGetLibraryBookDetails = () => {
    const url = config.baseUrl + 'student/GetLibraryBookDetails';
    //console.log(url);
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.state.Token,
      },
      //body: JSON.stringify({
      //    "mpin": this.state.Mpin
      //}),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //console.log('GetLibraryBookDetails===', responseJson);
        if (responseJson) {
          this.setState(
            {Loader: false, LibraryBookDetails: responseJson},
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
  onLoadGetLibraryHeaderDetails = () => {
    const url = config.baseUrl + 'student/GetLibraryHeaderDetails';
    //console.log(url);
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.state.Token,
      },
      //body: JSON.stringify({
      //    "mpin": this.state.Mpin
      //}),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.onLoadGetLibraryBookDetails();
        //console.log('GetLibraryHeaderDetails===', responseJson);
        if (responseJson) {
          this.setState({LibraryHeaderDetails: responseJson}, function () {});
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
        this.onLoadGetLibraryBookDetails();
        this.setState({}, function () {
          //console.log(error);
          alert(error);
        });
      });
  };
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        {this.state.Title ? (
          <CustomHeader
            isHome={false}
            title={this.state.Title}
            navigation={this.props.navigation}
          />
        ) : null}

        <View style={[styles.TotalCardView, {height: 150, paddingTop: 10}]}>
          <View
            style={{
              width: '33%',
              justifyContent: 'center',
              alignItems: 'center',
              height: '90%',
            }}>
            <View
              style={{
                width: '100%',
                height: '65%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ProgressCircle
                percent={100}
                //percent={this.state.LibraryHeaderDetails.totalCards}
                radius={40}
                borderWidth={15}
                color={'#7CDCE8'}
                shadowColor="#5645C6"
                //bgColor={"#7CDCE8"}
              >
                <View
                  style={{
                    elevation: 3,
                    shadowColor: 'silver',
                    shadowOffset: {width: 0, height: 0},
                    shadowOpacity: 0.6,
                    width: 60,
                    height: 60,
                    borderRadius: 60,
                    backgroundColor: 'white',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Poppins-Regular',
                      fontSize: ResponsiveSize(config.buttonSize),
                      color: '#5645C6',
                      fontWeight: 'bold',
                    }}>
                    {this.state.LibraryHeaderDetails.totalCards}
                  </Text>
                </View>
              </ProgressCircle>
            </View>
            <View style={{width: '100%', height: '35%', alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontSize: ResponsiveSize(config.AppAllHeaderSize),
                  color: 'white',
                  fontWeight: 'bold',
                }}>
                Total Card
              </Text>
            </View>
          </View>
          <View
            style={{width: '33%', justifyContent: 'center', height: '100%'}}>
            <View
              style={{
                width: '100%',
                height: '90%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: '100%',
                  height: '65%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 70,
                    margin: 10,
                    backgroundColor: '#5645C6',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Poppins-Regular',
                      fontSize: ResponsiveSize(config.buttonSize),
                      color: 'white',
                      fontWeight: 'bold',
                    }}>
                    {this.state.LibraryHeaderDetails.totalUsed}
                  </Text>
                </View>
              </View>
              <View
                style={{width: '100%', height: '35%', alignItems: 'center'}}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    fontSize: ResponsiveSize(config.AppAllHeaderSize),
                    color: 'white',
                    fontWeight: 'bold',
                  }}>
                  Used
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              width: '33%',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}>
            <View
              style={{
                width: '100%',
                height: '90%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: '100%',
                  height: '65%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 70,
                    margin: 10,
                    backgroundColor: '#5645C6',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Poppins-Regular',
                      fontSize: ResponsiveSize(config.buttonSize),
                      color: 'white',
                      fontWeight: 'bold',
                    }}>
                    {this.state.LibraryHeaderDetails.totalNotUsed}
                  </Text>
                </View>
              </View>
              <View
                style={{width: '100%', height: '35%', alignItems: 'center'}}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    fontSize: ResponsiveSize(config.AppAllHeaderSize),
                    color: 'white',
                    fontWeight: 'bold',
                  }}>
                  Not Used
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/*<View style={styles.notificationText}>
          <View
            style={{
              width: 35,
              height: 35,
              borderRadius: 35,
              backgroundColor: 'red',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                fontSize: ResponsiveSize(config.AppAllHeaderSize),
                color: 'white',
                fontWeight: 'bold',
              }}>
              {this.state.LibraryHeaderDetails.totalBooksDelayed}
            </Text>
          </View>
          <Text style={styles.TextStyle}>book is delay</Text>
        </View>*/}
        <ScrollView>
          <TouchableOpacity
            disabled
            onPress={() => {
              //this.props.navigation.navigate("ResultCam", { title: "Result", subTitle: "CAM" })
            }}
            style={[styles.TotalCardView2, {padding: 10}]}>
            {this.state.LibraryBookDetails.length ? (
              this.state.LibraryBookDetails.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      height: 120,
                      width: '100%',
                      borderRadius: 10,
                      backgroundColor: 'white',
                      borderRadius: 5,
                      marginTop: 10,
                    }}>
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        height: '100%',
                      }}>
                      <View
                        style={{
                          width: '20%',
                          height: '100%',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        {item.daysLeft < 5 ? (
                          <CustomFastImage
                            style={{
                              width: '100%',
                              height: '80%',
                            }}
                            source={require('../assets/bookReturn.png')}
                            resizeMode={'contain'}
                          />
                        ) : (
                          <CustomFastImage
                            style={{
                              width: '100%',
                              height: '80%',
                            }}
                            source={require('../assets/libraryBook.png')}
                            resizeMode={'contain'}
                          />
                        )}
                      </View>
                      <View
                        style={{
                          height: '100%',
                          width: '80%',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            width: '100%',
                            height: '50%',
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <View
                            style={{
                              width: '75%',
                              height: '100%',
                              justifyContent: 'center',
                              paddingHorizontal: 5,
                            }}>
                            <Text
                              numberOfLines={3}
                              style={{
                                fontFamily: 'Poppins-Regular',
                                color: 'black',
                                fontWeight: '600',
                                fontSize: ResponsiveSize(config.AppAllTextSize),
                              }}>
                              {item.title}
                            </Text>
                          </View>
                          <View
                            style={{
                              width: '25%',
                              height: '100%',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={{
                                fontFamily: 'Poppins-Regular',
                                color: '#7260E9',
                                fontWeight: '600',
                                fontSize: ResponsiveSize(config.AppAllTextSize),
                              }}>
                              {moment(item.issuedDate).format('DD/MM')}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            width: '100%',
                            height: '50%',
                            justifyContent: 'center',
                            paddingHorizontal: 5,
                          }}>
                          {item.daysLeft < 5 ? (
                            <View
                              style={{
                                width: '100%',
                                height: '60%',
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <View
                                style={{
                                  width: '50%',
                                  height: '100%',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <Text
                                  numberOfLines={1}
                                  style={{
                                    fontFamily: 'Poppins-Regular',
                                    color: 'red',
                                    fontSize: ResponsiveSize(
                                      config.AppAllTextSize,
                                    ),
                                  }}>
                                  Due : {moment(item.dueDate).format('DD/MM')}
                                </Text>
                                <View
                                  style={{
                                    marginLeft: 10,
                                    width: 20,
                                    height: 20,
                                    backgroundColor: 'red',
                                    alignItems: 'center',
                                    borderRadius: 20,
                                    justifyContent: 'center',
                                  }}>
                                  <Text
                                    numberOfLines={1}
                                    style={{
                                      fontFamily: 'Poppins-Regular',
                                      color: 'white',
                                      fontWeight: '600',
                                    }}>
                                    3
                                  </Text>
                                </View>
                              </View>
                              <View
                                style={{
                                  width: '50%',
                                  height: '100%',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  paddingLeft: 10,
                                }}>
                                <View
                                  style={{
                                    width: '70%',
                                    height: '60%',
                                    backgroundColor: '#FFEAEA',
                                    flexDirection: 'row',
                                    borderRadius: 20,
                                    alignItems: 'center',
                                  }}>
                                  <View
                                    style={{
                                      width: '50%',
                                      height: '100%',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}>
                                    <Text
                                      numberOfLines={1}
                                      style={{
                                        fontFamily: 'Poppins-Regular',
                                        color: 'red',
                                        fontSize: ResponsiveSize(
                                          config.AppAllTextSize,
                                        ),
                                      }}>
                                      Fine
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      width: '50%',
                                      height: '100%',
                                      backgroundColor: 'red',
                                      borderRadius: 20,
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}>
                                    <Text
                                      numberOfLines={1}
                                      style={{
                                        fontFamily: 'Poppins-Regular',
                                        color: 'white',
                                        fontSize: ResponsiveSize(
                                          config.AppAllTextSize,
                                        ),
                                      }}>
                                      {item.fine}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                          ) : (
                            <View
                              style={{
                                width: '100%',
                                height: '60%',
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <View
                                style={{
                                  width: '50%',
                                  height: '100%',
                                  justifyContent: 'center',
                                }}>
                                <Text
                                  numberOfLines={1}
                                  style={{
                                    fontFamily: 'Poppins-Regular',
                                    color: '#7260E9',
                                    fontSize: ResponsiveSize(
                                      config.AppAllTextSize,
                                    ),
                                  }}>
                                  Due : {moment(item.dueDate).format('DD/MM')}
                                </Text>
                              </View>
                              <View
                                style={{
                                  width: '50%',
                                  height: '100%',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  paddingLeft: 10,
                                }}>
                                {item.fine > 0 ||
                                (item.fine != '0' && item.fine) ? (
                                  <View
                                    style={{
                                      width: '70%',
                                      height: '60%',
                                      backgroundColor: '#FFEAEA',
                                      flexDirection: 'row',
                                      borderRadius: 20,
                                      alignItems: 'center',
                                    }}>
                                    <View
                                      style={{
                                        width: '50%',
                                        height: '100%',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                      }}>
                                      <Text
                                        numberOfLines={1}
                                        style={{
                                          fontFamily: 'Poppins-Regular',
                                          color: 'red',
                                          fontSize: ResponsiveSize(
                                            config.AppAllTextSize,
                                          ),
                                        }}>
                                        Fine
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        width: '50%',
                                        height: '100%',
                                        backgroundColor: 'red',
                                        borderRadius: 20,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                      }}>
                                      <Text
                                        numberOfLines={1}
                                        style={{
                                          fontFamily: 'Poppins-Regular',
                                          color: 'white',
                                          fontSize: ResponsiveSize(
                                            config.AppAllTextSize,
                                          ),
                                        }}>
                                        {item.fine}
                                      </Text>
                                    </View>
                                  </View>
                                ) : (
                                  <Text
                                    numberOfLines={1}
                                    style={{
                                      fontFamily: 'Poppins-Regular',
                                      color: '#7260E9',
                                      fontSize: ResponsiveSize(
                                        config.AppAllTextSize,
                                      ),
                                    }}>
                                    {item.daysLeft} days left
                                  </Text>
                                )}
                              </View>
                            </View>
                          )}
                          <View
                            style={{
                              width: '100%',
                              height: '40%',
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <ProgressBar
                              style={{height: 5, borderRadius: 10, width: 260}}
                              progress={item.daysLeft < 5 ? 0.9 : 0.5}
                              color={item.daysLeft < 5 ? 'red' : '#23D76B'}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })
            ) : (
              <Text
                style={{
                  alignSelf: 'center',

                  fontFamily: 'Poppins-Regular',
                }}>
                No data available
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  TotalCardView: {
    width: '95%',
    marginVertical: 20,
    alignSelf: 'center',
    borderRadius: 15,
    elevation: 3,
    shadowColor: 'silver',
    flexDirection: 'row',
    shadowOpacity: 0.3,
    alignItems: 'center',
    shadowOffset: {width: 0, height: 0},
    justifyContent: 'center',
    backgroundColor: '#B0A4FF',
  },
  TotalCardView2: {
    width: '95%',
    //marginVertical: 20,
    alignSelf: 'center',
    borderRadius: 15,
    elevation: 3,
    shadowColor: 'silver',
    shadowOpacity: 0.3,
    alignItems: 'center',
    shadowOffset: {width: 0, height: 0},
    justifyContent: 'center',
    backgroundColor: '#F6F5FF',
  },
  TextStyle: {
    color: 'black',
    fontSize: ResponsiveSize(config.AppAllTextSize),
    paddingHorizontal: 10,
    fontFamily: 'Poppins-Regular',
  },
  notificationText: {
    width: '95%',
    paddingHorizontal: 20,
    marginBottom: 20,
    alignSelf: 'center',
    borderRadius: 15,
    elevation: 3,
    shadowColor: 'silver',
    shadowOpacity: 0.3,
    flexDirection: 'row',
    alignItems: 'center',
    shadowOffset: {width: 0, height: 0},
    height: 50,
    //justifyContent: "center",
    backgroundColor: '#FFEAEA',
    fontFamily: 'Poppins-Regular',
  },
});
