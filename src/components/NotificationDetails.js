import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {BackHandler, Image} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {ScrollView} from 'react-native';
import {View, Text} from 'react-native';
import Toast from 'react-native-tiny-toast';
import config from '../config/config';
import ResponsiveSize from '../config/ResponsiveSize';
import {CustomHeader} from './CustomHeader';
import Moment from 'moment';
import {Loader} from './Loader';
import CommonFlatlist from './common/CommonFlatList';
import CustomFastImage from './common/CustomFastImage';
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};
export default class NotificationDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      NotificationDetails: this.props.route.params
        ? this.props.route.params.data
          ? this.props.route.params.data
          : {}
        : {},
      Notifications: this.props.route.params
        ? this.props.route.params.Notifications
          ? this.props.route.params.Notifications
          : []
        : [],
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
  };

  renderItem = ({item, index}) => {
    return (
      this.state.NotificationDetails != item && (
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.replace('NotificationDetails', {
              data: item,
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
                resizeMode={'stretch'}
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
                  {item.fileType == '1' || item.fileType == '4' ? (
                    <CustomFastImage
                      style={[styles.IconStyle, {width: 25, height: 25}]}
                      source={require('../assets/video.png')}
                      resizeMode={'contain'}
                    />
                  ) : null}
                  {item.fileType == '2' || item.fileType == '4' ? (
                    <CustomFastImage
                      style={[styles.IconStyle, {width: 25, height: 25}]}
                      source={require('../assets/file.png')}
                      resizeMode={'contain'}
                    />
                  ) : null}
                  {item.fileType == '3' || item.fileType == '4' ? (
                    <CustomFastImage
                      style={[styles.IconStyle, {width: 25, height: 25}]}
                      source={require('../assets/notes.png')}
                      resizeMode={'contain'}
                    />
                  ) : null}
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )
    );
  };
  render() {
    return (
      <ScrollView nestedScrollEnabled={true}>
        <SafeAreaView>
          <Loader
            Loading={this.state.Loader ? true : false}
            onPressCancel={() => {
              this.setState({Loader: false});
            }}
          />
          <View
            style={{
              width: '100%',
              height: 60,
              position: 'absolute',
              zIndex: 2,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}
              style={[styles.basicStyle, {width: '10%'}]}>
              <CustomFastImage
                style={{width: 20, height: 20}}
                source={require('../assets/back.png')}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.textBasicStyle,
                {
                  textAlign: 'center',
                  color: 'white',
                  fontSize: ResponsiveSize(config.AppAllHeaderSize),
                },
              ]}>
              Notification Details
            </Text>
            <View
              style={{
                width: '20%',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                height: '100%',
              }}>
              <TouchableOpacity style={[styles.basicStyle, {width: '50%'}]}>
                <CustomFastImage
                  style={{width: 20, height: 20}}
                  source={require('../assets/share.png')}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.basicStyle, {width: '50%'}]}>
                <CustomFastImage
                  style={{width: 20, height: 20}}
                  source={require('../assets/tripleDots.png')}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
            </View>
          </View>
          {/*{this.state.NotificationDetails.notificationImage ? (*/}
          <View style={styles.imgContainer}>
            <CustomFastImage
              style={{
                width: '100%',
                height: 250,
              }}
              source={
                this.state.NotificationDetails.notificationImage ||
                require('../assets/appLogo.png')
              }
              resizeMode={'stretch'}
            />
          </View>
          {/*) : null}*/}
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              height: 60,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: 10,
            }}>
            <TouchableOpacity
              style={[styles.basicStyle, {width: '20%', borderRadius: 10}]}>
              <CustomFastImage
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 10,
                }}
                source={
                  this.state.NotificationDetails.notificationImage ||
                  require('../assets/appLogo.png')
                }
                resizeMode={'cover'}
              />
            </TouchableOpacity>
            <View style={{flex: 1}}>
              <Text
                numberOfLines={2}
                style={[
                  styles.textBasicStyle,
                  {
                    fontWeight: 'bold',
                    fontSize: ResponsiveSize(config.AppAllTextSize),
                  },
                ]}>
                {this.state.NotificationDetails
                  ? this.state.NotificationDetails.staffName
                  : ''}
              </Text>
              <Text
                numberOfLines={2}
                style={[
                  styles.textBasicStyle,
                  {
                    fontSize: ResponsiveSize(config.AppAllTextSize),
                  },
                ]}>
                {/*{this.state.NotificationDetails
                  ? this.state.NotificationDetails.designationName
                  : ''}
                ,*/}
                {this.state.NotificationDetails
                  ? this.state.NotificationDetails.departmentName
                  : ''}
              </Text>
            </View>
            <View
              style={{
                width: '40%',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                height: '100%',
              }}>
              <Text
                style={[
                  styles.textBasicStyle,
                  {
                    color: 'gray',
                    fontSize: ResponsiveSize(10),
                  },
                ]}>
                {this.state.NotificationDetails
                  ? Moment(this.state.NotificationDetails.insertionTime).format(
                      'DD/MM/YYYY',
                    )
                  : ''}{' '}
                -
                {this.state.NotificationDetails
                  ? Moment(this.state.NotificationDetails.insertionTime).format(
                      'hh:mm a',
                    )
                  : ''}
              </Text>
            </View>
          </View>
          <View
            style={{
              width: '100%',
              height: 40,
              marginVertical: 5,
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <CustomFastImage
                style={{
                  width: 15,
                  height: 15,
                  marginHorizontal: 10,
                }}
                source={require('../assets/building.png')}
                resizeMode={'contain'}
              />
              <Text
                numberOfLines={2}
                style={{
                  fontFamily: 'Poppins-Regular',
                  color: '#23C4D7',
                  fontSize: ResponsiveSize(config.AppAllSubTitle),
                }}>
                {this.state.NotificationDetails
                  ? this.state.NotificationDetails.title
                  : ''}
              </Text>
            </View>
          </View>
          <Text
            numberOfLines={2}
            style={{
              width: '95%',
              alignSelf: 'center',
              fontWeight: 'bold',
              fontFamily: 'Poppins-Regular',
              color: '#7260E9',
              marginBottom: 10,
              fontSize: ResponsiveSize(config.AppAllHeaderSize),
            }}>
            {this.state.NotificationDetails
              ? this.state.NotificationDetails.title
              : ''}
          </Text>
          <Text
            numberOfLines={6}
            style={{
              width: '95%',
              alignSelf: 'center',
              fontFamily: 'Poppins-Regular',
              fontSize: ResponsiveSize(config.AppAllSubTitle),
            }}>
            {this.state.NotificationDetails
              ? this.state.NotificationDetails.body
              : ''}
          </Text>

          <View
            style={[
              styles.basicHovorStyle,
              {
                width: '60%',
                backgroundColor: '#7260E9',
                alignSelf: 'center',
                alignItems: 'center',
                borderRadius: 10,
                height: 60,
                marginVertical: 20,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
              },
            ]}>
            <CustomFastImage
              style={styles.IconStyle}
              source={require('../assets/video2.png')}
              resizeMode={'contain'}
            />
            <CustomFastImage
              style={styles.IconStyle}
              source={require('../assets/file2.png')}
              resizeMode={'contain'}
            />
            <CustomFastImage
              style={styles.IconStyle}
              source={require('../assets/notes2.png')}
              resizeMode={'contain'}
            />
          </View>
          <Text
            style={{
              width: '95%',
              alignSelf: 'center',
              fontFamily: 'Poppins-Regular',
              marginBottom: 10,
              fontSize: ResponsiveSize(config.AppAllHeaderSize),
            }}>
            Relevant Notifications
          </Text>
          <CommonFlatlist
            refreshing={this.state.refreshing}
            //_onRefresh={this._onRefresh.bind(this)}
            _onRefresh={() => {
              this.setState({refreshing: false});
            }}
            renderItem={this.renderItem}
            data={this.state.Notifications}
            Loader={this.state.Loader}
          />
        </SafeAreaView>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  basicStyle: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBasicStyle: {
    fontFamily: 'Poppins-Regular',
    color: 'black',
    textTransform: 'capitalize',
    fontSize: ResponsiveSize(config.AppAllHeaderSize),
  },
  basicHovorStyle: {
    elevation: 3,
    shadowColor: 'silver',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  mainConatiner: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  imgContainer: {
    width: '100%',
    height: 250,
  },
  IconStyle: {
    width: 40,
    height: 40,
    marginHorizontal: 3,
    resizeMode: 'contain',
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
  IconStyle2: {
    width: 25,
    height: 25,
    marginHorizontal: 3,
    resizeMode: 'contain',
    alignSelf: 'flex-end',
  },
});
