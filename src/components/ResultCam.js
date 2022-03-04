import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {StyleSheet, ScrollView, BackHandler} from 'react-native';
import {Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-tiny-toast';
import ResponsiveSize from '../config/ResponsiveSize';
import config from '../config/config';
import {ImageBackground} from 'react-native';
import {SafeAreaView} from 'react-native';
import {CustomHeader} from './CustomHeader';
import {Loader} from './Loader';
import {View} from 'react-native';
import {Image, Animated} from 'react-native';
import ProgressCircle from 'react-native-progress-circle';
import CustomFastImage from './common/CustomFastImage';
import CommonFlatlist from './common/CommonFlatList';
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};

export default class ResultCam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Loader: true,
      Semesterarr: [],
      filterredArr: [],
      ResultArr: [],
      ResultData: [],
      subTitle: this.props.route.params
        ? this.props.route.params.subTitle
          ? this.props.route.params.subTitle
          : ''
        : '',

      arr: [],
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
        this.setState({Token: value}, function () {
          this.state.subTitle == 'CAM'
            ? this.onLoadGetInternalWiseResult()
            : this.onLoadGetSemesterWiseResult();
        });
      }
    } catch (error) {
      alert('Error retrieving data');
    }
  };
  onLoadGetSemesterWiseResult = () => {
    const url = config.baseUrl + 'student/StudentSubjectWisePerformance';
    console.log(url);
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
        console.log(JSON.stringify(responseJson));
        if (responseJson) {
          this.setState(
            {
              Loader: false,
              refreshing: false,
              Semesterarr: responseJson.semesterWiseDetails,
            },
            function () {},
          );
        } else {
          this.setState({Loader: false, refreshing: false}, function () {
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
        this.setState({Loader: false, refreshing: false}, function () {
          console.log(error);
          alert(error);
        });
      });
  };
  onLoadGetInternalWiseResult = () => {
    const url = config.baseUrl + 'student/InternalMarks';
    console.log(url);
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
        console.log('InternalMarks response = ', JSON.stringify(responseJson));
        if (responseJson) {
          this.setState(
            {Loader: false, refreshing: false, arr: responseJson},
            function () {},
          );
        } else {
          this.setState({Loader: false, refreshing: false}, function () {
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
        this.setState({Loader: false, refreshing: false}, function () {
          alert(error);
          //console.log(error);
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
    let ResultArr = item.subjectDetails;
    var filterredArr = ResultArr.filter(function (items) {
      return items.result == 'FAIL';
    });
    //console.log('filterredArr==', filterredArr);
    //let filterredArr = [{}, {}];
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          this.props.navigation.navigate('ResultDetails', {
            title: 'Result',
            resultData: item.semester,
            colorCode:
              index % 2 == 0 && index % 3 != 0
                ? '#7260E9'
                : index % 3 == 0
                ? '#23C4D7'
                : '#6397F2',

            colorPic:
              index % 2 == 0 && index % 3 != 0
                ? require('../assets/purpleAtt.png')
                : index % 3 == 0
                ? require('../assets/greenAtt.png')
                : require('../assets/blueAtt.png'),
            TotalSub: item.subjectDetails,
            failSubCount: filterredArr,
            subTitle: this.state.subTitle,
            resultColor:
              index % 2 == 0 && index % 3 != 0
                ? '#7260E9'
                : index % 3 == 0
                ? '#23C4D7'
                : '#6397F2',
          });
        }}
        style={{
          width: '95%',
          alignSelf: 'center',
          height: 120,
          marginTop: 10,
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <CustomFastImage
          style={{
            width: '100%',
            alignSelf: 'center',
            height: 120,
            position: 'absolute',
            marginBottom: 15,
          }}
          source={
            index % 2 == 0 && index % 3 != 0
              ? require('../assets/purpleAtt.png')
              : index % 3 == 0
              ? require('../assets/greenAtt.png')
              : require('../assets/blueAtt.png')
          }
          resizeMode={'stretch'}
        />
        <View
          style={{
            width: '100%',
            height: 120,
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              justifyContent: 'flex-end',
              paddingLeft: 35,
            }}>
            <Text style={styles.MainTitle}>Semester {item.semester}</Text>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{width: '10%', padding: 10}}></View>

            {/*{InternamMarksDetal = this.state.Semesterarr.filter(x => x.semester == item.semester).subjectInternalMarksDetails}*/}
            <View
              style={{
                width: '30%',
                borderRightWidth: 1,
                borderColor: 'white',
                padding: 10,
              }}>
              <Text style={styles.TitleText}>Total Sub</Text>
              <Text style={styles.SubTitleText}>
                {item.subjectDetails.length}
              </Text>
            </View>
            <View
              style={{
                width: '30%',
                borderRightWidth: 1,
                borderColor: 'white',
                padding: 10,
              }}>
              <Text style={styles.TitleText}>Pass Sub</Text>
              <Text style={styles.SubTitleText}>
                {item.subjectDetails.length - filterredArr.length}
              </Text>
            </View>
            <View style={{width: '30%', padding: 10}}>
              <Text style={styles.TitleText}>Fail Sub</Text>
              <Text style={styles.SubTitleText}>{filterredArr.length}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  renderItem2 = ({item, index}) => {
    let ResultArr = item.criteriaDetails;
    var filterredArr = ResultArr.filter(function (items) {
      return items.result == 'Fail';
    });
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          this.props.navigation.navigate('ResultDetails', {
            title: 'Result',
            colorCode:
              index % 2 == 0 && index % 3 != 0
                ? '#7260E9'
                : index % 3 == 0
                ? '#23C4D7'
                : '#6397F2',
            LightcolorCode:
              index % 2 == 0 && index % 3 != 0
                ? '#E9E6FE'
                : index % 3 == 0
                ? '#D1FAFF'
                : '#E0EBFF',

            colorPic:
              index % 2 == 0 && index % 3 != 0
                ? require('../assets/purpleAtt.png')
                : index % 3 == 0
                ? require('../assets/greenAtt.png')
                : require('../assets/blueAtt.png'),

            failSubCount: filterredArr,
            TotalSub: item.criteriaDetails,
            resultData: item.criteriaDetails,
            subTitle: item,
          });
        }}
        style={{
          width: '95%',
          alignSelf: 'center',
          height: 120,
          marginTop: 10,
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <CustomFastImage
          style={{
            width: '100%',
            alignSelf: 'center',
            height: 120,
            position: 'absolute',
            marginBottom: 15,
          }}
          source={
            index % 2 == 0 && index % 3 != 0
              ? require('../assets/purpleAtt.png')
              : index % 3 == 0
              ? require('../assets/greenAtt.png')
              : require('../assets/blueAtt.png')
          }
          resizeMode={'stretch'}
        />
        <View
          style={{
            width: '100%',
            height: 120,
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              justifyContent: 'flex-end',
              paddingLeft: 35,
            }}>
            <Text style={styles.MainTitle}>{item.criteria}</Text>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{width: '10%', padding: 10}}></View>
            <View
              style={{
                width: '30%',
                borderRightWidth: 1,
                borderColor: 'white',
                padding: 10,
              }}>
              <Text style={styles.TitleText}>Total Sub</Text>
              <Text style={styles.SubTitleText}>
                {item.criteriaDetails.length}
              </Text>
            </View>
            <View
              style={{
                width: '30%',
                borderRightWidth: 1,
                borderColor: 'white',
                padding: 10,
              }}>
              <Text style={styles.TitleText}>Pass Sub</Text>
              <Text style={styles.SubTitleText}>
                {item.criteriaDetails.length - filterredArr.length}
              </Text>
            </View>
            <View style={{width: '30%', padding: 10}}>
              <Text style={styles.TitleText}>Fail Sub</Text>
              <Text style={styles.SubTitleText}>{filterredArr.length}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    return (
      <SafeAreaView style={{flex: 1, height: '100%'}}>
        <Loader
          Loading={this.state.Loader ? true : false}
          onPressCancel={() => {
            this.setState({Loader: false});
          }}
        />
        {this.state.Title ? (
          <CustomHeader
            isHome={false}
            title={this.state.Title}
            navigation={this.props.navigation}
          />
        ) : null}

        <View style={styles.SubjectMainContainer}>
          <CustomFastImage
            style={styles.SubjectNameImageView}
            source={require('../assets/greenBg.png')}
            resizeMode={'stretch'}
          />
          <View style={styles.SubjectNameTextView}>
            <Text numberOfLines={1} style={styles.SubjectNameTextStyle}>
              {this.state.subTitle}
            </Text>
          </View>
          {this.state.subTitle == 'CAM' ? (
            <CommonFlatlist
              refreshing={this.state.refreshing}
              //_onRefresh={this._onRefresh.bind(this)}
              _onRefresh={() => {
                this._onRefresh(this.onLoadGetInternalWiseResult());
              }}
              renderItem={this.renderItem2}
              data={this.state.arr}
              Loader={this.state.Loader}
            />
          ) : (
            <CommonFlatlist
              refreshing={this.state.refreshing}
              //_onRefresh={this._onRefresh.bind(this)}
              _onRefresh={() => {
                this._onRefresh(this.onLoadGetSemesterWiseResult());
              }}
              renderItem={this.renderItem}
              data={this.state.Semesterarr}
              Loader={this.state.Loader}
            />
          )}
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  headerNew: {
    padding: 10,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 5,
  },
  headerTextNew: {
    //textAlign: 'center',
    width: '60%',
    fontSize: ResponsiveSize(config.AppAllHeaderSize),
    fontWeight: '400',
    lineHeight: 24,
    textTransform: 'uppercase',
    fontFamily: 'Poppins-Regular',
  },
  SubjectNameImageView: {
    width: '95%',
    alignSelf: 'center',
    height: 60,
    resizeMode: 'stretch',
    position: 'relative',
    borderRadius: 15,
    marginVertical: 10,
  },
  SubjectNameTextView: {
    height: 60,
    width: '90%',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 2,
    marginVertical: 10,
    alignItems: 'center',
  },
  SubjectNameTextStyle: {
    color: 'white',
    fontWeight: '500',
    fontSize: ResponsiveSize(config.buttonSize),
    paddingHorizontal: 10,
    textTransform: 'uppercase',
    fontFamily: 'Poppins-Regular',
  },
  SubjectMainContainer: {
    width: '100%',
    height: '95%',
    //alignItems: "center",
    paddingBottom: 20,
  },
  TitleText: {
    fontFamily: 'Poppins-Regular',
    color: 'white',
    fontSize: ResponsiveSize(config.AppAllSubTitle),
  },
  SubTitleText: {
    fontFamily: 'Poppins-Regular',
    color: 'white',
    fontSize: ResponsiveSize(config.AppAllHeaderSize),
    fontWeight: '600',
  },
  MainTitle: {
    fontFamily: 'Poppins-Regular',
    color: 'white',
    textTransform: 'uppercase',
    fontWeight: '600',
    fontSize: ResponsiveSize(config.AppAllHeaderSize),
  },
});
