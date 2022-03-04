import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableWithoutFeedback,
  Image,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {Text, Card} from 'native-base';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';
import Nodata from './NoData';
import {Loader} from '../components/Loader';
import {CustomHeader} from '../components/CustomHeader';
const oldUrl = 'https://insproplus.com/palgeoapi/';
var moment = require('moment');
export default class CircularList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      user_id: '',
      bearer_token: '',
      institute_id: '',
      showAlert1: false,
      error_message: '',
    };
  }
  componentDidMount() {
    AsyncStorage.getItem('bearer_token').then((bearer_token) => {
      this.setState({bearer_token: bearer_token});
    });
    AsyncStorage.getItem('user_id').then((user_id) => {
      AsyncStorage.getItem('institute_id').then((institute_id) => {
        this.setState({user_id: user_id}, () => {
          this.getCircularList(user_id, institute_id);
        });
      });
    });
  }
  checkPermission = (file) => {
    this.props.navigation.navigate('ImageViewer', {
      url: file,
    });
  };
  getCircularList = (user_id, institute_id) => {
    this.setState({showAlert: true});
    fetch(oldUrl + 'api/Staff/StaffNotifications', {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        Authorization: this.state.bearer_token,
        Accept: 'text/plain',
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify({
        staffCode: user_id,
        instituteId: institute_id,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.length > 0) {
          this.setState({data: json, showAlert: false});
        } else {
          this.setState({data: [], showAlert: false});
        }
      })
      .catch((error) => {
        this.setState({showAlert: false});
      });
  };
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#ffffff'}}>
        <Loader
          Loading={this.state.Loader ? true : false}
          onPressCancel={() => {
            this.setState({Loader: false});
          }}
        />
        <AwesomeAlert
          show={this.state.showAlert}
          showProgress={true}
          title="Loading"
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
        />
        <AwesomeAlert
          show={this.state.showAlert1}
          showProgress={false}
          title="Attention"
          message={this.state.error_message}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          cancelText="Okay"
          onCancelPressed={() => {
            this.setState({showAlert1: false});
          }}
          cancelButtonColor="#f05760"
          cancelButtonTextStyle={{fontFamily: 'Poppins-Regular', fontSize: 13}}
          messageStyle={{fontFamily: 'Poppins-Regular', fontSize: 13}}
          titleStyle={{fontFamily: 'Poppins-Regular', fontSize: 14}}
        />
        <CustomHeader
          title="Notifications"
          isHome={false}
          navigation={this.props.navigation}
        />
        <FlatList
          data={this.state.data}
          keyExtractor={(item, index) => index}
          contentContainerStyle={{
            backgroundColor: '#ffffff',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          ListEmptyComponent={
            <View style={{marginTop: hp('40')}}>
              <Nodata title="No Notifications Found" />
            </View>
          }
          renderItem={({item, index}) => {
            var gmtDateTime = moment.utc(item.sentOn, 'YYYY-MM-DD HH');
            var local = gmtDateTime.local().format('DD-MMM-YYYY h:mm A');
            return (
              <Card style={styles.card}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    padding: '3%',
                  }}>
                  <View style={{justifyContent: 'center', width: wp('20')}}>
                    {item.notificationType == 7 ? (
                      <Image
                        source={require('../assets/bell.png')}
                        //source={require('../assets/loc.jpg')}
                        style={{width: 70, height: 70}}
                        resizeMode="contain"
                      />
                    ) : item.notificationType == 6 ? (
                      <Image
                        source={require('../assets/bell.png')}
                        //source={require('../assets/taskall.jpg')}
                        style={{width: 70, height: 70}}
                        resizeMode="contain"
                      />
                    ) : item.notificationType == 5 ? (
                      <Image
                        source={require('../assets/bell.png')}
                        //source={require('../assets/cir.jpg')}
                        style={{width: 70, height: 70}}
                        resizeMode="contain"
                      />
                    ) : item.notificationType == 4 ? (
                      <Image
                        source={require('../assets/bell.png')}
                        //source={require('../assets/late.jpg')}
                        style={{width: 70, height: 70}}
                        resizeMode="contain"
                      />
                    ) : item.notificationType == 3 ? (
                      <Image
                        source={require('../assets/bell.png')}
                        //source={require('../assets/late.jpg')}
                        style={{width: 70, height: 70}}
                        resizeMode="contain"
                      />
                    ) : item.notificationType == 2 ? (
                      <Image
                        source={require('../assets/bell.png')}
                        //source={require('../assets/early.jpg')}
                        style={{width: 70, height: 70}}
                        resizeMode="contain"
                      />
                    ) : item.notificationType == 1 ? (
                      <Image
                        source={require('../assets/bell.png')}
                        //source={require('../assets/early.jpg')}
                        style={{width: 70, height: 70}}
                        resizeMode="contain"
                      />
                    ) : null}
                  </View>
                  <View style={{width: wp('70'), marginLeft: '2%'}}>
                    <Text style={styles.subject}>{item.subject}</Text>
                    <Text style={styles.date}>{local}</Text>
                    <Text style={styles.text}>{item.message}</Text>
                  </View>
                </View>
                <View style={styles.row}>
                  {item.circularAttachment && (
                    <TouchableWithoutFeedback
                      onPress={() => {
                        this.checkPermission(item.circularAttachment);
                      }}>
                      <Text style={styles.attachText}>Attachment</Text>
                    </TouchableWithoutFeedback>
                  )}
                  {item.notificationImage && (
                    <TouchableWithoutFeedback
                      onPress={() => {
                        this.checkPermission(item.notificationImage);
                      }}>
                      <Text style={styles.attachText1}>Notification Image</Text>
                    </TouchableWithoutFeedback>
                  )}
                </View>
              </Card>
            );
          }}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  text: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    margin: '0.5%',
  },
  subject: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    margin: '0.5%',
  },
  date: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    margin: '0.5%',
    color: '#909090',
  },
  walletContainer: {
    margin: '3%',
    backgroundColor: '#f3f3f3',
    borderRadius: 10,
  },
  header: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#67747d',
  },
  headerVal: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#000000',
  },
  row: {
    flexDirection: 'row',
    paddingLeft: '4%',
    paddingTop: '1%',
    paddingBottom: '1%',
  },
  divider: {
    borderWidth: 1,
    borderColor: '#e2e2e2',
    margin: '2%',
  },
  divider1: {
    borderWidth: 1,
    borderColor: '#f3f3f3',
    margin: '2%',
  },
  card: {
    width: wp('95'),
    elevation: 4,
    borderRadius: 8,
  },
  attachText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    width: wp('30'),
    color: '#f05760',
    textDecorationLine: 'underline',
  },
  attachText1: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#f05760',
    textDecorationLine: 'underline',
  },
});
