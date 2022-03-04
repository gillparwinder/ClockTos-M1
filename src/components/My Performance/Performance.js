// using static value for data2 for testing purpose because it gives error
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {ScrollView} from 'react-native';
import {BackHandler} from 'react-native';
import {Image} from 'react-native';
import ProgressCircle from 'react-native-progress-circle';
import {TouchableOpacity} from 'react-native';
import {SafeAreaView, StyleSheet} from 'react-native';
import {View, Text} from 'react-native';
import config from '../../config/config';
import {CustomHeader} from '../CustomHeader';
import * as Animatable from 'react-native-animatable';
import {Loader} from '../Loader';
import ResponsiveSize from '../../config/ResponsiveSize';
import {Checkbox} from 'react-native-paper';
import {Item, Picker, Thumbnail} from 'native-base';
import {CustomButton} from '../common/Button';
import {FlatList} from 'react-native';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
import {StatusBar} from 'react-native';
import {Platform} from 'react-native';
import deviceInfo from 'react-native-device-info';
import CustomFastImage from '../common/CustomFastImage';
const data = {
  //  labels: ['Swim', 'Bike', 'Run'], // optional
  data: [0.4, 0.6, 0.8],
};
let data2 = [];
const chartConfig = {
  backgroundColor: 'white',
  backgroundGradientFrom: '#1E2923',
  backgroundGradientTo: '#08130D',
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  style: {
    borderRadius: 16,
  },
};

export default class Performance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Loader: false,
      chartType: 'pie',

      chartType: this.props.route.params
        ? this.props.route.params.chartType
          ? this.props.route.params.chartType
          : ''
        : '',
      StudentCount: this.props.route.params
        ? this.props.route.params.StudentCount
          ? this.props.route.params.StudentCount
          : ''
        : '',
      SubjectName: this.props.route.params
        ? this.props.route.params.data
          ? this.props.route.params.data
          : ''
        : '',
      filterredDataBelow40: this.props.route.params
        ? this.props.route.params.filterredDataBelow40
          ? this.props.route.params.filterredDataBelow40
          : ''
        : '',
      filterredDataBelow50: this.props.route.params
        ? this.props.route.params.filterredDataBelow50
          ? this.props.route.params.filterredDataBelow50
          : ''
        : '',
      filterredDataBelow65: this.props.route.params
        ? this.props.route.params.filterredDataBelow65
          ? this.props.route.params.filterredDataBelow65
          : ''
        : '',
      filterredDataBelow75: this.props.route.params
        ? this.props.route.params.filterredDataBelow75
          ? this.props.route.params.filterredDataBelow75
          : ''
        : '',
      filterredDataBelow90: this.props.route.params
        ? this.props.route.params.filterredDataBelow90
          ? this.props.route.params.filterredDataBelow90
          : ''
        : '',
      filterredDataBelow100: this.props.route.params
        ? this.props.route.params.filterredDataBelow100
          ? this.props.route.params.filterredDataBelow100
          : ''
        : '',
      filterredDataNA: this.props.route.params
        ? this.props.route.params.filterredDataNA
          ? this.props.route.params.filterredDataNA
          : ''
        : '',

      Show: 2,
      Show1: 5,
      Show2: 5,
      Show3: 5,
      Show4: 5,
      Show5: 5,

      Token: '',
    };
  }

  componentDidMount() {
    data2.push(
      {
        data:
          this.state.filterredDataBelow40.length == 0
            ? 1
            : this.state.filterredDataBelow40.length,
        color: '#007AFF',
      },
      {
        data:
          this.state.filterredDataBelow50.length == 0
            ? 1
            : this.state.filterredDataBelow50.length,
        color: '#CB5B66',
      },
      {
        data:
          this.state.filterredDataBelow65.length == 0
            ? 1
            : this.state.filterredDataBelow65.length,
        color: '#627281',
      },
      {
        data:
          this.state.filterredDataBelow75.length == 0
            ? 1
            : this.state.filterredDataBelow75.length,
        color: '#F39800',
      },
      {
        data:
          this.state.filterredDataBelow90.length == 0
            ? 1
            : this.state.filterredDataBelow90.length,
        color: '#B033AB',
      },
      {
        data:
          this.state.filterredDataBelow100.length == 0
            ? 1
            : this.state.filterredDataBelow100.length,
        color: '#17B6FF',
      },
      {
        data:
          this.state.filterredDataNA.length == 0
            ? 1
            : this.state.filterredDataNA.length,
        color: 'red',
      },
    );
    //data2.push(
    //  {data: this.state.filterredDataBelow40.length, color: '#007AFF'},
    //  {data: this.state.filterredDataBelow50.length, color: '#CB5B66'},
    //  {data: this.state.filterredDataBelow65.length, color: '#627281'},
    //  {data: this.state.filterredDataBelow75.length, color: '#F39800'},
    //  {data: this.state.filterredDataBelow90.length, color: '#B033AB'},
    //  {data: this.state.filterredDataBelow100.length, color: '#17B6FF'},
    //);
    //console.log(data2);
    ////console.log('Props = ', this.props.route.params);
    this.retrieveData();
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
  }
  componentWillUnmount() {
    data2 = [];
    //console.log('unmount');
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
        this.setState({sem: parseInt(value)}, function () {});
      }
    } catch (error) {
      alert('Error retrieving data');
    }
  };

  renderItem = () => {
    return (
      <View key={Math.random()}>
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
            fontSize: ResponsiveSize(config.AppAllHeaderSize),
            color: '#5182E9',
            padding: 10,
            fontWeight: 'bold',
            marginVertical: 10,
          }}>
          {'Range (00 - 40)'}
        </Text>
        <TouchableOpacity
          disabled
          activeOpacity={1}
          style={[
            styles.FeedbackView,
            {
              backgroundColor: '#CDDBF3',
              padding: 0,
              paddingVertical: 0,
              paddingBottom: 20,
            },
          ]}>
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              paddingVertical: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              borderRadius: 10,
              paddingHorizontal: 10,
              backgroundColor: '#5289E6',
            }}
            key={Math.random()}>
            <View
              style={{
                width: '15%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontWeight: '600',
                  lineHeight: 25,
                  color: 'white',
                }}>
                Photo
              </Text>
            </View>
            <View
              style={{
                width: '25%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontWeight: '600',
                  lineHeight: 25,
                  color: 'white',
                }}>
                Roll. No.
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
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontWeight: '600',
                  lineHeight: 25,
                  color: 'white',
                }}>
                Name
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
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontWeight: '600',
                  lineHeight: 25,
                  color: 'white',
                }}>
                Mark
              </Text>
            </View>
          </View>

          {this.state.filterredDataBelow40.length ? (
            this.state.filterredDataBelow40
              .slice(0, this.state.Show)
              .map((item, index) => {
                return (
                  <TouchableOpacity
                    disabled
                    activeOpacity={1}
                    style={{
                      width: '95%',
                      alignSelf: 'center',
                      height: 50,
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      borderRadius: 10,
                      backgroundColor: index % 2 ? 'white' : '#CDDBF3',
                    }}>
                    <View
                      style={{
                        width: '15%',
                        //height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <CustomFastImage
                        resizeMode={'cover'}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 30,
                          resizeMode: 'cover',
                        }}
                        source={require('../../assets/avatar.png')}
                      />
                    </View>
                    <View
                      style={{
                        width: '25%',
                        //height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily: 'Poppins-Regular',
                          fontWeight: '600',
                          lineHeight: 25,
                          color: '#5289E6',
                        }}>
                        {item.rollNo}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '40%',
                        //height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily: 'Poppins-Regular',
                          fontWeight: '600',
                          lineHeight: 25,
                          color: '#5289E6',
                        }}>
                        {item.studentName}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '20%',
                        //height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily: 'Poppins-Regular',
                          fontWeight: '600',
                          lineHeight: 25,
                          color: '#5289E6',
                        }}>
                        {item.studMark}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
          ) : (
            <Text
              numberOfLines={1}
              style={{
                fontFamily: 'Poppins-Regular',
                fontWeight: '600',
                lineHeight: 25,
                color: '#5289E6',
              }}>
              No data available
            </Text>
          )}
          <View style={{width: '100%', marginVertical: 10}}>
            <CustomButton
              width={'50%'}
              color={'#5289E6'}
              title={this.state.Show == 1000 ? 'Less' : 'View More'}
              onPress={() => {
                if (this.state.Show == 1000) {
                  this.setState({Show: 5});
                } else {
                  this.setState({Show: 1000});
                }
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  renderItem1 = () => {
    return (
      <View key={Math.random()}>
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
            fontSize: ResponsiveSize(config.AppAllHeaderSize),
            color: '#5182E9',
            padding: 10,
            fontWeight: 'bold',
            marginVertical: 10,
          }}>
          {'Range (41 - 50)'}
        </Text>
        <TouchableOpacity
          disabled
          activeOpacity={1}
          style={[
            styles.FeedbackView,
            {
              backgroundColor: '#CDDBF3',
              padding: 0,
              paddingVertical: 0,
              paddingBottom: 20,
            },
          ]}>
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              paddingVertical: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              borderRadius: 10,
              paddingHorizontal: 10,
              backgroundColor: '#5289E6',
            }}
            key={Math.random()}>
            <View
              style={{
                width: '15%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontWeight: '600',
                  lineHeight: 25,
                  color: 'white',
                }}>
                Photo
              </Text>
            </View>
            <View
              style={{
                width: '25%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontWeight: '600',
                  lineHeight: 25,
                  color: 'white',
                }}>
                Roll. No.
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
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontWeight: '600',
                  lineHeight: 25,
                  color: 'white',
                }}>
                Name
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
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontWeight: '600',
                  lineHeight: 25,
                  color: 'white',
                }}>
                Mark
              </Text>
            </View>
          </View>

          {this.state.filterredDataBelow50.length ? (
            this.state.filterredDataBelow50
              .slice(0, this.state.Show1)
              .map((item, index) => {
                return (
                  <TouchableOpacity
                    disabled
                    activeOpacity={1}
                    style={{
                      width: '95%',
                      alignSelf: 'center',
                      height: 50,
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      borderRadius: 10,
                      backgroundColor: index % 2 ? 'white' : '#CDDBF3',
                    }}>
                    <View
                      style={{
                        width: '15%',
                        //height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <CustomFastImage
                        resizeMode={'cover'}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 30,
                        }}
                        source={require('../../assets/avatar.png')}
                      />
                    </View>
                    <View
                      style={{
                        width: '25%',
                        //height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily: 'Poppins-Regular',
                          fontWeight: '600',
                          lineHeight: 25,
                          color: '#5289E6',
                        }}>
                        {item.rollNo}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '40%',
                        //height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily: 'Poppins-Regular',
                          fontWeight: '600',
                          lineHeight: 25,
                          color: '#5289E6',
                        }}>
                        {item.studentName}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '20%',
                        //height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily: 'Poppins-Regular',
                          fontWeight: '600',
                          lineHeight: 25,
                          color: '#5289E6',
                        }}>
                        {item.studMark}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
          ) : (
            <Text
              numberOfLines={1}
              style={{
                fontFamily: 'Poppins-Regular',
                fontWeight: '600',
                lineHeight: 25,
                color: '#5289E6',
              }}>
              No data available
            </Text>
          )}
          <View style={{width: '100%', marginVertical: 10}}>
            <CustomButton
              width={'50%'}
              color={'#5289E6'}
              title={this.state.Show1 == 1000 ? 'Less' : 'View More'}
              onPress={() => {
                if (this.state.Show1 == 1000) {
                  this.setState({Show1: 5});
                } else {
                  this.setState({Show1: 1000});
                }
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  renderItem2 = () => {
    return (
      <View key={Math.random()}>
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
            fontSize: ResponsiveSize(config.AppAllHeaderSize),
            color: '#5182E9',
            padding: 10,
            fontWeight: 'bold',
            marginVertical: 10,
          }}>
          {'Range (51 - 65)'}
        </Text>
        <TouchableOpacity
          disabled
          activeOpacity={1}
          style={[
            styles.FeedbackView,
            {
              backgroundColor: '#CDDBF3',
              padding: 0,
              paddingVertical: 0,
              paddingBottom: 20,
            },
          ]}>
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              paddingVertical: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              borderRadius: 10,
              paddingHorizontal: 10,
              backgroundColor: '#5289E6',
            }}
            key={Math.random()}>
            <View
              style={{
                width: '15%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontWeight: '600',
                  lineHeight: 25,
                  color: 'white',
                }}>
                Photo
              </Text>
            </View>
            <View
              style={{
                width: '25%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontWeight: '600',
                  lineHeight: 25,
                  color: 'white',
                }}>
                Roll. No.
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
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontWeight: '600',
                  lineHeight: 25,
                  color: 'white',
                }}>
                Name
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
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontWeight: '600',
                  lineHeight: 25,
                  color: 'white',
                }}>
                Mark
              </Text>
            </View>
          </View>

          {this.state.filterredDataBelow65.length ? (
            this.state.filterredDataBelow65
              .slice(0, this.state.Show2)
              .map((item, index) => {
                return (
                  <TouchableOpacity
                    disabled
                    activeOpacity={1}
                    style={{
                      width: '95%',
                      alignSelf: 'center',
                      height: 50,
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      borderRadius: 10,
                      backgroundColor: index % 2 ? 'white' : '#CDDBF3',
                    }}>
                    <View
                      style={{
                        width: '15%',
                        //height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <CustomFastImage
                        resizeMode={'cover'}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 30,
                        }}
                        source={require('../../assets/avatar.png')}
                      />
                    </View>
                    <View
                      style={{
                        width: '25%',
                        //height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily: 'Poppins-Regular',
                          fontWeight: '600',
                          lineHeight: 25,
                          color: '#5289E6',
                        }}>
                        {item.rollNo}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '40%',
                        //height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily: 'Poppins-Regular',
                          fontWeight: '600',
                          lineHeight: 25,
                          color: '#5289E6',
                        }}>
                        {item.studentName}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '20%',
                        //height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily: 'Poppins-Regular',
                          fontWeight: '600',
                          lineHeight: 25,
                          color: '#5289E6',
                        }}>
                        {item.studMark}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
          ) : (
            <Text
              numberOfLines={1}
              style={{
                fontFamily: 'Poppins-Regular',
                fontWeight: '600',
                lineHeight: 25,
                color: '#5289E6',
              }}>
              No data available
            </Text>
          )}
          <View style={{width: '100%', marginVertical: 10}}>
            <CustomButton
              width={'50%'}
              color={'#5289E6'}
              title={this.state.Show2 == 1000 ? 'Less' : 'View More'}
              onPress={() => {
                if (this.state.Show2 == 1000) {
                  this.setState({Show2: 5});
                } else {
                  this.setState({Show2: 1000});
                }
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  renderItem3 = () => {
    return (
      <View key={Math.random()}>
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
            fontSize: ResponsiveSize(config.AppAllHeaderSize),
            color: '#5182E9',
            padding: 10,
            fontWeight: 'bold',
            marginVertical: 10,
          }}>
          {'Range (66 - 75)'}
        </Text>
        <TouchableOpacity
          disabled
          activeOpacity={1}
          style={[
            styles.FeedbackView,
            {
              backgroundColor: '#CDDBF3',
              padding: 0,
              paddingVertical: 0,
              paddingBottom: 20,
            },
          ]}>
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              paddingVertical: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              borderRadius: 10,
              paddingHorizontal: 10,
              backgroundColor: '#5289E6',
            }}
            key={Math.random()}>
            <View
              style={{
                width: '15%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontWeight: '600',
                  lineHeight: 25,
                  color: 'white',
                }}>
                Photo
              </Text>
            </View>
            <View
              style={{
                width: '25%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontWeight: '600',
                  lineHeight: 25,
                  color: 'white',
                }}>
                Roll. No.
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
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontWeight: '600',
                  lineHeight: 25,
                  color: 'white',
                }}>
                Name
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
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontWeight: '600',
                  lineHeight: 25,
                  color: 'white',
                }}>
                Mark
              </Text>
            </View>
          </View>

          {this.state.filterredDataBelow75.length ? (
            this.state.filterredDataBelow75
              .slice(0, this.state.Show3)
              .map((item, index) => {
                return (
                  <TouchableOpacity
                    disabled
                    activeOpacity={1}
                    style={{
                      width: '95%',
                      alignSelf: 'center',
                      height: 50,
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      borderRadius: 10,
                      backgroundColor: index % 2 ? 'white' : '#CDDBF3',
                    }}>
                    <View
                      style={{
                        width: '15%',
                        //height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <CustomFastImage
                        resizeMode={'cover'}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 30,
                        }}
                        source={require('../../assets/avatar.png')}
                      />
                    </View>
                    <View
                      style={{
                        width: '25%',
                        //height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily: 'Poppins-Regular',
                          fontWeight: '600',
                          lineHeight: 25,
                          color: '#5289E6',
                        }}>
                        {item.rollNo}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '40%',
                        //height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily: 'Poppins-Regular',
                          fontWeight: '600',
                          lineHeight: 25,
                          color: '#5289E6',
                        }}>
                        {item.studentName}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '20%',
                        //height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily: 'Poppins-Regular',
                          fontWeight: '600',
                          lineHeight: 25,
                          color: '#5289E6',
                        }}>
                        {item.studMark}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
          ) : (
            <Text
              numberOfLines={1}
              style={{
                fontFamily: 'Poppins-Regular',
                fontWeight: '600',
                lineHeight: 25,
                color: '#5289E6',
              }}>
              No data available
            </Text>
          )}
          <View style={{width: '100%', marginVertical: 10}}>
            <CustomButton
              width={'50%'}
              color={'#5289E6'}
              title={this.state.Show3 == 1000 ? 'Less' : 'View More'}
              onPress={() => {
                if (this.state.Show3 == 1000) {
                  this.setState({Show3: 5});
                } else {
                  this.setState({Show3: 1000});
                }
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  renderItem4 = () => {
    return (
      <View key={Math.random()}>
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
            fontSize: ResponsiveSize(config.AppAllHeaderSize),
            color: '#5182E9',
            padding: 10,
            fontWeight: 'bold',
            marginVertical: 10,
          }}>
          {'Range (76 - 90)'}
        </Text>
        <TouchableOpacity
          disabled
          activeOpacity={1}
          style={[
            styles.FeedbackView,
            {
              backgroundColor: '#CDDBF3',
              padding: 0,
              paddingVertical: 0,
              paddingBottom: 20,
            },
          ]}>
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              paddingVertical: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              borderRadius: 10,
              paddingHorizontal: 10,
              backgroundColor: '#5289E6',
            }}
            key={Math.random()}>
            <View
              style={{
                width: '15%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontWeight: '600',
                  lineHeight: 25,
                  color: 'white',
                }}>
                Photo
              </Text>
            </View>
            <View
              style={{
                width: '25%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontWeight: '600',
                  lineHeight: 25,
                  color: 'white',
                }}>
                Roll. No.
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
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontWeight: '600',
                  lineHeight: 25,
                  color: 'white',
                }}>
                Name
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
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontWeight: '600',
                  lineHeight: 25,
                  color: 'white',
                }}>
                Mark
              </Text>
            </View>
          </View>

          {this.state.filterredDataBelow90.length ? (
            this.state.filterredDataBelow90
              .slice(0, this.state.Show4)
              .map((item, index) => {
                return (
                  <TouchableOpacity
                    disabled
                    activeOpacity={1}
                    style={{
                      width: '95%',
                      alignSelf: 'center',
                      height: 50,
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      borderRadius: 10,
                      backgroundColor: index % 2 ? 'white' : '#CDDBF3',
                    }}>
                    <View
                      style={{
                        width: '15%',
                        //height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <CustomFastImage
                        resizeMode={'cover'}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 30,
                        }}
                        source={require('../../assets/avatar.png')}
                      />
                    </View>
                    <View
                      style={{
                        width: '25%',
                        //height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily: 'Poppins-Regular',
                          fontWeight: '600',
                          lineHeight: 25,
                          color: '#5289E6',
                        }}>
                        {item.rollNo}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '40%',
                        //height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily: 'Poppins-Regular',
                          fontWeight: '600',
                          lineHeight: 25,
                          color: '#5289E6',
                        }}>
                        {item.studentName}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '20%',
                        //height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily: 'Poppins-Regular',
                          fontWeight: '600',
                          lineHeight: 25,
                          color: '#5289E6',
                        }}>
                        {item.studMark}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
          ) : (
            <Text
              numberOfLines={1}
              style={{
                fontFamily: 'Poppins-Regular',
                fontWeight: '600',
                lineHeight: 25,
                color: '#5289E6',
              }}>
              No data available
            </Text>
          )}
          <View style={{width: '100%', marginVertical: 10}}>
            <CustomButton
              width={'50%'}
              color={'#5289E6'}
              title={this.state.Show4 == 1000 ? 'Less' : 'View More'}
              onPress={() => {
                if (this.state.Show4 == 1000) {
                  this.setState({Show4: 5});
                } else {
                  this.setState({Show4: 1000});
                }
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  renderItem5 = () => {
    return (
      <View key={Math.random()}>
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
            fontSize: ResponsiveSize(config.AppAllHeaderSize),
            color: '#5182E9',
            padding: 10,
            fontWeight: 'bold',
            marginVertical: 10,
          }}>
          {'Range (91 - 100)'}
        </Text>
        <TouchableOpacity
          disabled
          activeOpacity={1}
          style={[
            styles.FeedbackView,
            {
              backgroundColor: '#CDDBF3',
              padding: 0,
              paddingVertical: 0,
              paddingBottom: 20,
            },
          ]}>
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              paddingVertical: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              borderRadius: 10,
              paddingHorizontal: 10,
              backgroundColor: '#5289E6',
            }}
            key={Math.random()}>
            <View
              style={{
                width: '15%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontWeight: '600',
                  lineHeight: 25,
                  color: 'white',
                }}>
                Photo
              </Text>
            </View>
            <View
              style={{
                width: '25%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontWeight: '600',
                  lineHeight: 25,
                  color: 'white',
                }}>
                Roll. No.
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
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontWeight: '600',
                  lineHeight: 25,
                  color: 'white',
                }}>
                Name
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
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontWeight: '600',
                  lineHeight: 25,
                  color: 'white',
                }}>
                Mark
              </Text>
            </View>
          </View>

          {this.state.filterredDataBelow100.length ? (
            this.state.filterredDataBelow100
              .slice(0, this.state.Show5)
              .map((item, index) => {
                return (
                  <TouchableOpacity
                    disabled
                    activeOpacity={1}
                    style={{
                      width: '95%',
                      alignSelf: 'center',
                      height: 50,
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      borderRadius: 10,
                      backgroundColor: index % 2 ? 'white' : '#CDDBF3',
                    }}>
                    <View
                      style={{
                        width: '15%',
                        //height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <CustomFastImage
                        resizeMode={'cover'}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 30,
                        }}
                        source={require('../../assets/avatar.png')}
                      />
                    </View>
                    <View
                      style={{
                        width: '25%',
                        //height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily: 'Poppins-Regular',
                          fontWeight: '600',
                          lineHeight: 25,
                          color: '#5289E6',
                        }}>
                        {item.rollNo}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '40%',
                        //height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily: 'Poppins-Regular',
                          fontWeight: '600',
                          lineHeight: 25,
                          color: '#5289E6',
                        }}>
                        {item.studentName}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '20%',
                        //height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily: 'Poppins-Regular',
                          fontWeight: '600',
                          lineHeight: 25,
                          color: '#5289E6',
                        }}>
                        {item.studMark}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
          ) : (
            <Text
              numberOfLines={1}
              style={{
                fontFamily: 'Poppins-Regular',
                fontWeight: '600',
                lineHeight: 25,
                color: '#5289E6',
              }}>
              No data available
            </Text>
          )}
          <View style={{width: '100%', marginVertical: 10}}>
            <CustomButton
              width={'50%'}
              color={'#5289E6'}
              title={this.state.Show5 == 1000 ? 'Less' : 'View More'}
              onPress={() => {
                if (this.state.Show5 == 1000) {
                  this.setState({Show5: 5});
                } else {
                  this.setState({Show5: 1000});
                }
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
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
        <View
          style={{
            width: '100%',
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 2,
            marginTop: deviceInfo.hasNotch() ? 45 : 0,
            position: 'absolute',
            flexDirection: 'row',
            height: 50,
            paddingHorizontal: 10,
            backgroundColor: '#1D35A2',
          }}>
          <TouchableOpacity
            onPress={() => {
              //  //console.log(DeviceInfo.hasNotch());
              this.props.navigation.goBack();
            }}>
            <CustomFastImage
              resizeMode={'contain'}
              square
              style={{width: 22, height: 22}}
              source={require('../../assets/back.png')}
            />
          </TouchableOpacity>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: 'Poppins-Regular',
              fontWeight: '600',
              lineHeight: 25,
              color: 'white',
              fontSize: ResponsiveSize(config.AppAllHeaderSize),
            }}>
            My Performance
          </Text>
          <View
            style={{
              width: 22,
              height: 22,
              backgroundColor: 'transparent',
            }}></View>
        </View>
        <View style={styles.SubjectMainContainer}>
          <ScrollView bounces={false}>
            <View style={styles.rangeView}>
              <ProgressCircle
                percent={95}
                radius={95}
                borderWidth={12}
                color={'#60CAF5'}
                shadowColor="#17298F"
                bgColor={'#1D35A2'}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    fontSize: ResponsiveSize(config.AppAllTextSize),
                    color: 'white',
                    marginBottom: 5,
                  }}>
                  Total Students
                </Text>
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    fontSize: ResponsiveSize(20),
                    color: 'white',
                    fontWeight: 'bold',
                  }}>
                  {this.state.StudentCount}
                </Text>
              </ProgressCircle>
            </View>
            <View style={styles.rangeView2}>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontSize: ResponsiveSize(config.AppAllHeaderSize),
                  color: '#5182E9',
                  padding: 10,
                  fontWeight: 'bold',
                  marginVertical: 10,
                }}>
                {this.state.SubjectName}
              </Text>
              <View
                style={{
                  width: '95%',
                  alignSelf: 'center',
                  borderColor: 'gray',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 15,
                  borderWidth: 0.5,
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    fontSize: ResponsiveSize(config.AppAllHeaderSize),
                    color: '#5182E9',
                    padding: 10,
                    fontWeight: 'bold',
                  }}>
                  Internal - 1
                </Text>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 20,
                  }}>
                  <View
                    style={{
                      width: '50%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    {/*<CustomFastImage
                                    resizeMode={'contain'}
                      style={{width: 100, height: 100}}
                      source={require('../../assets/graph.png')}
                    />*/}
                    {/*{this.state.chartType == 'progress' ? (
                      <ProgressChart
                        data={data}
                        count={6}
                        width={150}
                        height={150}
                        strokeWidth={5}
                        radius={35}
                        chartConfig={chartConfig}
                        hideLegend={true}
                      />
                    ) : (*/}
                    <PieChart
                      data={data2}
                      width={150}
                      height={150}
                      chartConfig={chartConfig}
                      accessor={'data'}
                      backgroundColor={'transparent'}
                      paddingLeft={'35'}
                      hasLegend={false}
                      center={[10, 10]}
                    />
                    {/*)}*/}
                  </View>
                  <View
                    style={{
                      width: '50%',
                      alignItems: 'center',
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                    }}>
                    <View style={styles.numberRangeView}>
                      <View
                        style={[
                          styles.colorView,
                          {backgroundColor: '#007AFF'},
                        ]}></View>
                      <View>
                        <Text>00 - 40</Text>
                      </View>
                    </View>
                    <View style={styles.numberRangeView}>
                      <View
                        style={[
                          styles.colorView,
                          {backgroundColor: '#CB5B66'},
                        ]}></View>
                      <View>
                        <Text>40 - 50</Text>
                      </View>
                    </View>
                    <View style={styles.numberRangeView}>
                      <View
                        style={[
                          styles.colorView,
                          {backgroundColor: '#627281'},
                        ]}></View>
                      <View>
                        <Text>50 - 65</Text>
                      </View>
                    </View>
                    <View style={styles.numberRangeView}>
                      <View
                        style={[
                          styles.colorView,
                          {backgroundColor: '#F39800'},
                        ]}></View>
                      <View>
                        <Text>65 - 75</Text>
                      </View>
                    </View>
                    <View style={styles.numberRangeView}>
                      <View
                        style={[
                          styles.colorView,
                          {backgroundColor: '#B033AB'},
                        ]}></View>
                      <View>
                        <Text>75 - 90</Text>
                      </View>
                    </View>
                    <View style={styles.numberRangeView}>
                      <View
                        style={[
                          styles.colorView,
                          {backgroundColor: '#17B6FF'},
                        ]}></View>
                      <View>
                        <Text>90 - 100</Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.numberRangeView,
                        //{alignSelf: 'flex-start'},
                      ]}>
                      <View
                        style={[
                          styles.colorView,
                          {backgroundColor: 'red'},
                        ]}></View>
                      <View>
                        <Text>NA {'      '}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View>
              {this.renderItem()}
              {this.renderItem1()}
              {this.renderItem2()}
              {this.renderItem3()}
              {this.renderItem4()}
              {this.renderItem5()}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  SubjectMainContainer: {
    width: '100%',
    height: '100%',
    paddingBottom: 10,
  },
  FeedbackView: {
    width: '95%',
    alignSelf: 'center',
    //height: 190,
    justifyContent: 'space-evenly',
    borderRadius: 15,
    paddingVertical: 20,
  },
  MainTitle: {
    fontFamily: 'Poppins-Regular',
    color: 'white',
    fontWeight: 'bold',
    fontSize: ResponsiveSize(config.AppAllSubTitle),
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
  rangeView: {
    width: '100%',
    height: 300,
    backgroundColor: '#1D35A2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rangeView2: {
    width: '100%',
    //height: 200,
    marginBottom: 20,
    backgroundColor: 'white',
    marginTop: -20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  numberRangeView: {
    width: '50%',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  colorView: {
    width: 10,
    height: 10,
    borderRadius: 10,
  },
});
