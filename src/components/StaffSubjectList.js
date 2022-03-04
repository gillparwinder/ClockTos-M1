import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-tiny-toast';
import ResponsiveSize from '../config/ResponsiveSize';
import config from '../config/config';
import {ImageBackground} from 'react-native';
import {SafeAreaView, BackHandler, Image} from 'react-native';
import {CustomHeader} from './CustomHeader';
import {Loader} from './Loader';
import {View} from 'react-native';
import {CustomImage} from './common/customImage';
import {CustomImageSubjects} from './common/CustomImageSubject';
import CommonFlatlist from './common/CommonFlatList';
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};

export default class StaffSubjectList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Loader: true,
      Subjects: [],
      refreshing: false,
      Title: this.props?.route?.params?.title || '',
      hour: this.props?.route?.params?.hour || '',
      AttendanceDate:
        this.props?.route?.params?.AttendanceDate ||
        moment(new Date()).format('YYYY-MM-DD'),
      isReuse: this.props?.isReuse || false,
    };
  }
  componentDidMount() {
    this.retrieveData();
    console.log('props == ', this.props.route.params);
    //console.log('this.props?.isReuse = ', this.props?.isReuse);
    //this.backHandler = BackHandler.addEventListener(
    //  'hardwareBackPress',
    //  this.handleBackPress,
    //);
  }
  //componentWillUnmount() {
  //  this.backHandler.remove();
  //}

  //handleBackPress = () => {
  //  this.props.navigation.goBack(null);
  //  return true;
  //};
  retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        //alert(value);
        this.setState({Token: value}, function () {
          this.onLoadGetSubjects();
        });
      }
    } catch (error) {
      alert('Error retrieving data');
    }
  };
  onLoadGetSubjects = () => {
    const url = config.baseUrl2 + 'staff/subjectList';
    console.log(url);
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
        console.log('Subjects = ', responseJson);
        if (responseJson) {
          this.setState(
            {Loader: false, refreshing: false, Subjects: responseJson},
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
        //console.log(error);
        this.setState({Loader: false, refreshing: false}, function () {
          alert(error);
        });
      });
  };
  _onRefresh = async (apiCall) => {
    this.setState({refreshing: true}, () => {
      apiCall;
      //this.setState({refreshing: false});
    });
  };
  renderItem = ({item, index}) => {
    //console.log('item = ', item);
    return (
      <CustomImageSubjects
        key={index}
        percentage={item.topicsCompletedPercentage}
        subjectName={item.subjectName}
        type={item.subjectType}
        number={item.mobile}
        staffImage={item.staffImage}
        mailId={item.mailId}
        staffName={item.staffName}
        colorCode={
          index % 2 == 0 && index % 3 != 0
            ? '#91B3EB'
            : index % 3 == 0
            ? '#6CCFDB'
            : '#9A90E4'
        }
        colorCode2={
          index % 2 == 0 && index % 3 != 0
            ? '#7260E9'
            : index % 3 == 0
            ? '#008B9B'
            : '#0047C3'
        }
        source={
          index % 2 == 0 && index % 3 != 0
            ? require('../assets/subjectPurpleBg.png')
            : index % 3 == 0
            ? require('../assets/subjectGreenBg.png')
            : require('../assets/subjectBlueBg.png')
        }
        onPress={() => {
          this.props.navigation.navigate('StaffSubjectsDetail', {
            isReuse: this.props?.isReuse,
            AttendanceDate: this.state.AttendanceDate,
            hour: this.state.hour,
            Subjects: item,
            title: 'Subjects',
            colorCode:
              index % 2 == 0 && index % 3 != 0
                ? '#7260E9'
                : index % 3 == 0
                ? '#23C4D7'
                : '#8F98FF',
            colorCode2:
              index % 2 == 0 && index % 3 != 0
                ? '#7260E9'
                : index % 3 == 0
                ? '#008B9B'
                : '#0047C3',
            colorPic:
              index % 2 == 0 && index % 3 != 0
                ? require('../assets/purpleBg.png')
                : index % 3 == 0
                ? require('../assets/greenBg.png')
                : require('../assets/blueBg.png'),
          });
        }}
      />
    );
  };
  render() {
    return (
      <SafeAreaView style={{flex: 1, width: '100%'}}>
        <Loader
          Loading={this.state.Loader ? true : false}
          onPressCancel={() => {
            this.setState({Loader: false});
          }}
        />
        <CommonFlatlist
          refreshing={this.state.refreshing}
          //_onRefresh={this._onRefresh.bind(this)}
          _onRefresh={() => {
            this._onRefresh(this.onLoadGetSubjects());
          }}
          renderItem={this.renderItem}
          data={this.state.Subjects}
          Loader={this.state.Loader}
        />
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  headerNew: {
    //padding: 10,
    width: '95%',
    alignSelf: 'center',
    borderRadius: 5,
  },
  BackgroundImageView: {
    width: '100%',
    height: 120,
    justifyContent: 'center',
    //alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 15,
  },
  // for content background image style

  BackgroundImage: {
    width: '100%',
    height: 120,
    resizeMode: 'stretch',
    position: 'absolute',
  },
  // for content background image inner view style

  BackgroundImageInnerView: {
    width: '100%',
    height: 120,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 5,
  },

  // for normal size text
  text: {
    textAlign: 'center',
    color: 'white',
    fontSize: ResponsiveSize(config.AppAllHeaderSize),
    fontFamily: 'Poppins-Regular',
  },
  headerTextNew: {
    color: 'white',
    fontSize: ResponsiveSize(config.AppAllHeaderSize),
    fontWeight: '400',
    //lineHeight: 24,
    padding: 10,
    textTransform: 'uppercase',
    fontFamily: 'Poppins-Regular',
  },
});
