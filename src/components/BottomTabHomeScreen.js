import React, {Component} from 'react';
import {
  Image,
  TouchableOpacity,
  SafeAreaView,
  View,
  Text,
  Dimensions,
  ScrollView,
  StyleSheet,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import {CustomHeader} from './CustomHeader';
import {Loader} from './Loader';
import {Fab} from 'native-base';
import config from '../config/config';
import Toast from 'react-native-tiny-toast';
import ResponsiveSize from '../config/ResponsiveSize';
import {FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomTab from './BottomTab';
import HomeScreen from './HomeScreen';
import SubjectList from './SubjectList';
import TimeTable from './TimeTable';
import {StatusBar, BackHandler, Animated, Alert} from 'react-native';
import Result from './Result';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import StaffSideAttendance from './StaffSideAttendance';
import StaffInternalMark from './StaffInternalMark';
import MyPerformance from './My Performance/MyPerformance';
import Circular from '../Circular/Circular';
import Dashboard from './Dashboard';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};
export default class BottomTabHomeScreen extends Component {
  constructor() {
    super();
    this.state = {
      Active: 'home',
      backClickCount: 0,
      Loader: true,
    };
    //this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
    this.springValue = new Animated.Value(100);
  }
  //forceUpdateHandler() {
  //  console.log('hitforceupdate');
  //  this.retrieveData();
  //}

  UNSAFE_componentWillMount() {
    this.unsubscribe;
  }
  retrieveData = async (key) => {
    try {
      const value = await AsyncStorage.getItem('isStudent');
      //console.log('iStudent = ', value);
      if (value !== null) {
        this.setState(
          {
            isStudent: value,
            Loader: false,
          },
          function () {},
        );
      }
    } catch (error) {
      this.setState({Loader: false});
      alert('Error retrieving data');
    }
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        //alert(value);
        this.setState({Token: value, Loader: false}, function () {
          //this.props.navigation.navigate("Login")
        });
      }
    } catch (error) {
      this.setState({Loader: false});
      alert('Error retrieving data');
    }
  };
  componentDidMount() {
    //alert('BottomTabHomescreen');
    //console.log('hit');
    this.retrieveData();
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      //console.log('Focus hit');
      this.retrieveData();
    });
    Keyboard.dismiss();
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButton.bind(this),
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButton.bind(this),
    );
  }
  _spring() {
    this.setState({backClickCount: 1}, () => {
      Animated.sequence([
        Animated.spring(this.springValue, {
          toValue: -0.05 * screenHeight,
          friction: 5,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(this.springValue, {
          toValue: 100,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        this.setState({backClickCount: 0});
      });
    });
  }

  handleBackButton = () => {
    this.state.backClickCount == 1
      ? this.setState({
          Active: 'home',
        })
      : this._spring();

    return true;
  };
  render() {
    //console.log('renderhit');
    return this.state.isStudent == 'true' || this.state.isStudent == true ? (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'flex-end',
          paddingBottom: 15,
        }}>
        <StatusBar barStyle="dark-content" />

        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: 'space-between',
            backgroundColor: 'white',
          }}>
          <CustomHeader
            isHome={true}
            title={this.state.Active}
            notification={true}
            navigation={this.props.navigation}
          />

          {this.state.Active == 'home' ? (
            <HomeScreen {...this.props}>{'home'}</HomeScreen>
          ) : null}
          {this.state.Active == 'subject' ? (
            <SubjectList {...this.props}>{'Subjects'}</SubjectList>
          ) : null}
          {this.state.Active == 'Time Table' ? (
            <TimeTable {...this.props}>{'Time Table'}</TimeTable>
          ) : null}
          {this.state.Active == 'result' ? (
            <Result {...this.props}>{'Result'}</Result>
          ) : null}
        </SafeAreaView>
        <View
          style={{
            width: '100%',
            height: heightPercentageToDP('12%'),
            backgroundColor: 'white',
          }}>
          {/*<View style={{ width: "100%", height: 120, backgroundColor: "transparent", position: "absolute", marginBottom: 10 }}>*/}
          <BottomTab
            isStudent={true}
            active={
              this.state.Active == 'home' ? 'HomeScreen' : this.state.Active
            }
            onPress={(props) => {
              this.setState({Active: props});
            }}
            navigation={this.props.navigation}
          />
        </View>
        <Animated.View
          style={[
            styles.animatedView,
            {transform: [{translateY: this.springValue}]},
          ]}>
          <Text style={styles.exitTitleText}>
            Press back again to exit the app
          </Text>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => BackHandler.exitApp()}>
            <Text style={styles.exitText}>Exit</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    ) : this.state.Loader ? (
      <Loader
        Loading={this.state.Loader ? true : false}
        onPressCancel={() => {
          this.setState({Loader: false});
        }}
      />
    ) : (
      //<View
      //  style={{
      //    width: '100%',
      //    height: '100%',
      //    alignItems: 'center',
      //    justifyContent: 'center',
      //    backgroundColor: 'white',
      //  }}>
      //  <ActivityIndicator color={config.themeColor} size="large" />
      //  <Text style={{marginTop: 10}}>Fetching Content...</Text>
      //</View>
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'flex-end',
          paddingBottom: 15,
        }}>
        <StatusBar barStyle="dark-content" />

        <SafeAreaView
          style={{
            //flex: 1,
            width: '100%',
            height: '100%',
            //justifyContent: 'space-between',
            backgroundColor: 'white',
          }}>
          <CustomHeader
            isHome={true}
            title={'Attendance'}
            navigation={this.props.navigation}
          />
          {/*<Dashboard {...this.props}></Dashboard>*/}
          <StaffSideAttendance {...this.props}>
            {'StaffSideAttendance'}
          </StaffSideAttendance>
          {/*{this.state.Active == 'home' ? (
            <MyPerformance {...this.props}>{'MyPerformance'}</MyPerformance>
          ) : null}
          {this.state.Active == 'subject' ? (
            <StaffSideAttendance {...this.props}>
              {'StaffSideAttendance'}
            </StaffSideAttendance>
          ) : null}
          {this.state.Active == 'Time Table' ? (
            <StaffInternalMark {...this.props}>
              {'StaffInternalMark'}
            </StaffInternalMark>
          ) : null}
          {this.state.Active == 'result' ? (
            <Circular {...this.props}>{'Circular'}</Circular>
          ) : null}*/}
        </SafeAreaView>
        {/*<View style={{width: '100%', height: 100, backgroundColor: 'white'}}>*/}
        {/*<View style={{ width: "100%", height: 120, backgroundColor: "transparent", position: "absolute", marginBottom: 10 }}>*/}
        {/*<BottomTab
            isStudent={false}
            active={
              this.state.Active == 'home' ? 'MyPerformance' : this.state.Active
            }
            onPress={(props) => {
              //alert(props);
              this.setState({Active: props});
            }}
            navigation={this.props.navigation}
          />*/}
        {/*</View>*/}
        <Animated.View
          style={[
            styles.animatedView,
            {transform: [{translateY: this.springValue}]},
          ]}>
          <Text style={styles.exitTitleText}>
            Press back again to exit the app
          </Text>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => BackHandler.exitApp()}>
            <Text style={styles.exitText}>Exit</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  FlatlistChildView: {
    width: '45%',
    height: 100,
    borderRadius: 10,
    flexDirection: 'column',
    backgroundColor: '#383E7B',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ChildViewImage: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    position: 'absolute',
    borderRadius: 10,
  },
  animatedView: {
    width: screenWidth - 10,
    alignSelf: 'center',
    backgroundColor: 'black',
    elevation: 2,
    position: 'absolute',
    bottom: 0,
    borderRadius: 5,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  exitTitleText: {
    textAlign: 'center',
    color: '#ffffff',
    marginRight: 10,
  },
  exitText: {
    color: '#e5933a',
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
});
