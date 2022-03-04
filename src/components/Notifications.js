import React, {Component} from 'react';
import Toast from 'react-native-tiny-toast';
import Moment from 'moment';
import {
  TouchableOpacity,
  SafeAreaView,
  View,
  StyleSheet,
  Linking,
  Dimensions,
  Text,
} from 'react-native';
import {CustomHeader} from './CustomHeader';
import {BackHandler} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';
import config from '../config/config';
import ResponsiveSize from '../config/ResponsiveSize';
import {Loader} from './Loader';
import CustomFastImage from './common/CustomFastImage';
import CommonFlatlist from './common/CommonFlatList';
import {CustomTabs} from './common/CustomTabs';
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};

export default class Notifications extends Component {
  constructor() {
    super();
    this.state = {
      Notifications: [],
      refreshing: false,
      Loader: false,
      Show: false,
      activeTab: 'All',
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
        this.setState({Token: value}, function () {});
      }
    } catch (error) {
      alert('Error retrieving data');
    }
    try {
      const value = await AsyncStorage.getItem('isStudent');
      //alert(this.state.isStudent);
      if (value !== null) {
        this.setState({isStudent: value}, function () {
          this.state.isStudent
            ? this.onLoadGetStudentNotifications()
            : this.setState({Loader: false, Show: true});
          //console.log('isStudent = ', this.state.isStudent);
        });
      }
    } catch (error) {
      this.setState({Loader: false});
      alert('Error retrieving data');
    }
  };
  onLoadGetStudentNotifications = () => {
    this.setState({Loader: true});
    const url = config.baseUrl + 'student/GetNotifications';
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
        //console.log('GetNotifications response ===', responseJson);
        if (responseJson) {
          this.setState({
            Loader: false,
            Show: false,
            refreshing: false,
            Notifications: responseJson,
            TempNotifications: responseJson,
          });
        } else {
          this.setState({refreshing: false, Loader: false});
          Toast.show('Unknown error occured', ToastData);
        }
      })
      .catch((error) => {
        this.setState({refreshing: false, Loader: false});
        //console.log(error);
        alert(error);
      });
  };

  render() {
    return (
      <SafeAreaView style={{backgroundColor: 'white'}}>
        <CustomHeader
          title="Notifications"
          isHome={false}
          navigation={this.props.navigation}
        />
        <Loader
          Loading={this.state.Loader ? true : false}
          onPressCancel={() => {
            this.setState({Loader: false});
          }}
        />
        <View
          style={{
            width: '100%',
            height: '94%',
            backgroundColor: 'white',
            paddingVertical: 10,
          }}>
          {/*<Text style={{ fontWeight: "600", padding: 15, marginTop: 10, textAlign: "justify" }}>This is a history of all your Time Slots that were booked by customers as free, cash, club credit, debit card or credit card.</Text>*/}
          {this.state.isStudent ? (
            <View>
              <CustomTabs
                borderRadius={0}
                height={40}
                width={'100%'}
                textSize={14}
                color={config.themeColor}
                textColor={'black'}
                backgroundColor={'transparent'}
                borderBottomColor={config.themeColor}
                ActiveTab={this.state.activeTab}
                type="bottom"
                //tab1Width={'20%'}
                //tab2Width={'20%'}
                //tab3Width={'20%'}
                //tab4Width={'20%'}
                //tab5Width={'20%'}
                tab1="All"
                tab2="Academic"
                tab3="Events"
                tab4="Alerts"
                tab5="General"
                scroll
                onPress={(value) => {
                  this.setState({activeTab: value}, () => {
                    if (value == 'All') {
                      this.setState(
                        {Notifications: this.state.TempNotifications},
                        function () {
                          //console.log(data);
                        },
                      );
                    } else if (value == 'Academic') {
                      let TempArr1 = this.state.TempNotifications;
                      var filterredNotifications1 = TempArr1.filter(function (
                        item,
                      ) {
                        return item.category == 'Academic';
                      });
                      this.setState(
                        {Notifications: filterredNotifications1},
                        function () {
                          //this.onLoadGetBookingsHistory();
                        },
                      );
                    } else if (value == 'Events') {
                      let TempArr2 = this.state.TempNotifications;
                      var filterredNotifications2 = TempArr2.filter(function (
                        item,
                      ) {
                        return item.category == 'Event';
                      });
                      this.setState(
                        {Notifications: filterredNotifications2},
                        function () {
                          //this.onLoadGetBookingsHistory();
                        },
                      );
                    } else if (value == 'Alerts') {
                      let TempArr3 = this.state.TempNotifications;
                      var filterredNotifications3 = TempArr3.filter(function (
                        item,
                      ) {
                        return item.category == 'Alerts';
                      });
                      this.setState(
                        {Notifications: filterredNotifications3},
                        function () {
                          //this.onLoadGetBookingsHistory();
                        },
                      );
                    } else if (value == 'General') {
                      let TempArr4 = this.state.TempNotifications;
                      var filterredNotifications4 = TempArr4.filter(function (
                        item,
                      ) {
                        return item.category == 'General';
                      });
                      this.setState(
                        {Notifications: filterredNotifications4},
                        function () {
                          //this.onLoadGetBookingsHistory();
                        },
                      );
                    }
                  });
                }}
              />
              {/*{this.renderContent(this.state.Notifications)}*/}
              <CommonFlatlist
                refreshing={this.state.refreshing}
                //_onRefresh={this._onRefresh.bind(this)}
                _onRefresh={() => {
                  this._onRefresh(this.onLoadGetStudentNotifications());
                }}
                renderItem={this.renderItem}
                data={this.state.Notifications}
                Loader={this.state.Loader}
              />
            </View>
          ) : (
            !this.state.Loader &&
            this.state.Show && (
              <Text style={{alignSelf: 'center'}}>Staff Notifications</Text>
            )
          )}
        </View>
      </SafeAreaView>
    );
  }
  _onRefresh = async (apiCall) => {
    this.setState({refreshing: true}, () => {
      apiCall;
      //this.setState({refreshing: false});
    });
  };
  renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('NotificationDetails', {
            data: item,
            Notifications: this.state.Notifications,
          });
        }}
        style={[
          styles.NotificationsMainView,
          {
            backgroundColor: 'white',
            borderColor: index % 2 == 0 ? '#7260E9' : '#23C4D7',
          },
        ]}>
        <Text
          style={{
            alignSelf: 'flex-end',
            fontFamily: 'Poppins-Regular',
            color: 'gray',
            fontSize: ResponsiveSize(config.AppAllSubTitle),
          }}>
          {Moment(item.insertionTime).format('DD/MM/YYYY')} -
          {Moment(item.insertionTime).format('HH:MM A')}
        </Text>
        <View style={styles.PhotoAndNameView}>
          <View
            style={[
              styles.basicStyle,
              {
                width: '20%',
                height: '100%',
                borderRadius: 10,
                borderWidth: 2,
                backgroundColor: '#F6F6F6',
                borderColor: index % 2 == 0 ? '#7260E9' : '#23C4D7',
              },
            ]}>
            <CustomFastImage
              style={{
                width: '100%',
                borderRadius: 8,
                height: '100%',
              }}
              source={
                item.notificationImage || require('../assets/appLogo.png')
              }
              resizeMode={'cover'}
            />
          </View>
          <View
            style={{
              width: '80%',
              paddingLeft: 10,
              height: '100%',
            }}>
            <Text
              numberOfLines={4}
              style={{
                fontSize: ResponsiveSize(config.AppAllHeaderSize),
                fontWeight: '600',
                fontFamily: 'Poppins-Regular',
                color: index % 2 == 0 ? '#7260E9' : '#23C4D7',
              }}>
              {item.title}
            </Text>
          </View>
        </View>
        <View style={[styles.PhotoAndNameView, {height: '40%'}]}>
          <View
            style={[
              styles.basicStyle,
              {width: '75%', alignItems: 'flex-start'},
            ]}>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: 'Poppins-Regular',
                textTransform: 'capitalize',
                fontWeight: 'bold',
                fontSize: ResponsiveSize(config.AppAllTextSize),
              }}>
              {item.staffName}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: 'Poppins-Regular',
                textTransform: 'capitalize',
                fontSize: ResponsiveSize(config.AppAllSubTitle),
              }}>
              {item.designationName},{item.departmentName}
            </Text>
          </View>
          <View style={[styles.basicStyle, {width: '25%'}]}>
            <View
              style={[
                styles.basicStyle,
                {
                  width: '100%',
                  height: '50%',
                },
              ]}>
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                }}>
                {/*{item.circularAttachment? (
               <CustomFastImage
                      style={styles.IconStyle}
                      source={require('../assets/video.png')}
                      resizeMode={'contain'}
                    />
            ) : null}*/}
                {item.circularAttachment ? (
                  <TouchableOpacity
                    onPress={() => {
                      Linking.openURL(item.circularAttachment);
                    }}>
                    <CustomFastImage
                      style={styles.IconStyle}
                      source={require('../assets/file.png')}
                      resizeMode={'contain'}
                    />
                  </TouchableOpacity>
                ) : null}
                {/*{item.fileType == '3' || item.fileType == '4' ? (
                   <CustomFastImage
                      style={styles.IconStyle}
                      source={require('../assets/notes.png')}
                      resizeMode={'contain'}
                    />
            ) : null}*/}
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
}
const styles = StyleSheet.create({
  basicStyle: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  NotificationsMainView: {
    width: '95%',
    alignSelf: 'center',
    justifyContent: 'center',
    borderLeftWidth: 5,
    padding: 10,
    elevation: 3,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: 'silver',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    height: 150,
  },
  PhotoAndNameView: {
    width: '100%',
    height: '50%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  imgStyle: {width: '100%', height: '100%', resizeMode: 'contain'},
  IconStyle: {
    width: 25,
    height: 25,
    marginHorizontal: 3,
    resizeMode: 'contain',
    alignSelf: 'flex-end',
  },
});
