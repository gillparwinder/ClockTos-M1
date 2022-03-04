import React, {Component} from 'react';
import {Image} from 'react-native';
import {SafeAreaView, AsyncStorage} from 'react-native';
import {TextInput} from 'react-native';
import {View, Text} from 'react-native';
import Toast from 'react-native-tiny-toast';
import {TouchableOpacity} from 'react-native-gesture-handler';
import config from '../config/config';
import ResponsiveSize from '../config/ResponsiveSize';
import {CustomHeader} from './CustomHeader';
import {Loader} from './Loader';
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};
export default class Support extends Component {
  constructor() {
    super();
    this.state = {Loader: false};
  }
  componentDidMount() {
    this.retrieveData();
    //setTimeout(() => {
    //    this.setState({ Loader: false })
    //}, 1000);
  }
  retrieveData = async (key) => {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        // alert (value);
        this.setState({Token: value}, function () {});
      }
    } catch (error) {
      alert('Error retrieving data');
    }
  };
  onPressFeedback = () => {
    const url = config.baseUrl + 'feedback';
    const formData = new FormData();
    formData.append('message', this.state.Message);
    fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.state.Token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson && responseJson.success == true) {
          Toast.showSuccess('Message sent successfully');
        } else if (responseJson && responseJson.success == false) {
          this.setState({Loader: false}, function () {
            Toast.show(responseJson.error, ToastData);
          });
        } else {
          this.setState({Loader: false}, function () {
            Toast.show(
              responseJson.error
                ? responseJson.error
                : 'Temporary error try again after some time',
              ToastData,
            );
          });
        }
      })
      .catch((error) => {
        this.setState({Loader: false}, function () {
          alert(error);
        });
      });
  };
  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <Loader
          Loading={this.state.Loader ? true : false}
          onPressCancel={() => {
            this.setState({Loader: false});
          }}
        />
        <SafeAreaView style={{flex: 1}}>
          <CustomHeader isHome={false} navigation={this.props.navigation} />
          <View
            style={{
              flex: 1,
              paddingHorizontal: 20,
              justifyContent: 'space-between',
            }}>
            <View style={{height: undefined}}>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontSize: ResponsiveSize(25),
                  fontWeight: '500',
                }}>
                Support
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  color: 'gray',
                  lineHeight: 30,
                }}>
                How can we help?
              </Text>
              <TextInput
                style={{
                  width: '100%',
                  borderBottomWidth: 1,
                  borderBottomColor: '#2CA1CE',
                  fontSize: ResponsiveSize(config.textSize),
                  marginTop: 50,
                  minHeight: 40,
                }}
                onChangeText={(text) => {
                  this.setState({Message: text});
                }}
                value={this.state.Message}
                blurOnSubmit={true}
                multiline={true}
                returnKeyType="done"
                placeholder="Enter message"
              />
            </View>
            <View
              style={{
                width: '100%',
                height: '10%',
                justifyContent: 'space-between',
              }}>
              <Text>
                Query?
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    color: '#2CA1CE',
                    textDecorationLine: 'underline',
                  }}>
                  support@canman.co
                  <Text
                    style={{
                      fontFamily: 'Poppins-Regular',
                      color: '#2CA1CE',
                      textDecorationLine: 'underline',
                    }}>
                    8147183580
                  </Text>
                </Text>
              </Text>
              <TouchableOpacity
                style={{
                  width: '100%',
                  backgroundColor: '#26265F',
                  paddingHorizontal: 20,
                  borderRadius: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 40,
                }}
                onPress={() => {
                  this.setState({Loader: true}, function () {
                    this.onPressFeedback();
                  });
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    textAlign: 'center',
                    color: 'white',
                    fontSize: ResponsiveSize(16),
                  }}>
                  SUBMIT
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
