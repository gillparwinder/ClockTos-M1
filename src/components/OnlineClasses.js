import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {SafeAreaView} from 'react-native';
import {ScrollView} from 'react-native';
import {Image} from 'react-native';
import {TextInput} from 'react-native';
import {BackHandler} from 'react-native';
import {Dimensions} from 'react-native';
import {Clipboard, FlatList} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {View, Text, StyleSheet} from 'react-native';
import Toast from 'react-native-tiny-toast';
import config from '../config/config';
import ResponsiveSize from '../config/ResponsiveSize';
import {CustomButton} from './common/Button';
import CustomFastImage from './common/CustomFastImage';
import {CustomHeader} from './CustomHeader';
import {Loader} from './Loader';
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;
export default class OnlineClasses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Loader: true,
      Token: '',
      SelectedPlatform: 'googleMeet',
      TempIndex: -1,
      ActiveTextBox: false,
      URL: '',
      page: 0,
      posts: [],
      dataPosts: [],
      Platforms: [
        {PlatformName: 'googleMeet', pic: require('../assets/googleMeet.png')},
        {PlatformName: 'zoom', pic: require('../assets/zoom.png')},
        {PlatformName: 'teams', pic: require('../assets/t.png')},
      ],
      ClassesArr: [],
    };
  }
  addRecords = (page) => {
    // assuming this.state.dataPosts hold all the records
    const newRecords = [];
    for (
      var i = page * 2, il = i + 2;
      i < il && i < this.state.dataPosts.length;
      i++
    ) {
      newRecords.push(this.state.dataPosts[i]);
    }
    this.setState({
      posts: [...this.state.posts, ...newRecords],
    });
  };
  onScrollHandler = () => {
    this.setState(
      {
        page: this.state.page + 1,
      },
      () => {
        //console.log('hit');
        this.addRecords(this.state.page);
      },
    );
  };
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
        //console.log('Token = ', value);
        this.setState({Token: value}, function () {
          this.getSubjectList();
        });
      }
    } catch (error) {
      alert('Error retrieving data');
    }
  };
  getSubjectList = () => {
    const url = config.baseUrl2 + 'staff/SubjectList';
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
        //console.log('getSubjectList response ===', responseJson);
        if (responseJson) {
          this.setState({Loader: false, ClassesArr: responseJson}, function () {
            this.setState(
              {
                page: 0,
                dataPosts: responseJson,
              },
              function () {
                // call the function to pull initial 12 records
                this.addRecords(0);
              },
            );
          });
        } else {
          this.setState({Loader: false});
          Toast.show('Unknown error occured', ToastData);
        }
      })
      .catch((error) => {
        this.setState({Loader: false});
        //console.log(error);
        alert(error);
      });
  };
  AddOrUpdateMeeting = (subNo, PlatformName) => {
    this.setState({Loader: true});
    if (
      PlatformName &&
      this.state.ClassesArr[this.state.TempIndex2].meetingLink
    ) {
      const url = config.baseUrl2 + 'staff/AddOrUpdateMeeting';
      //console.log(
      //  JSON.stringify({
      //    subjectNo: subNo.toString(),
      //    meetingSource: PlatformName,
      //    meetingUrl: this.state.ClassesArr[this.state.TempIndex2].meetingLink
      //      ? this.state.ClassesArr[this.state.TempIndex2].meetingLink
      //      : '',
      //  }),
      //);
      fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.state.Token,
        },
        body: JSON.stringify({
          subjectNo: subNo.toString(),
          meetingSource: PlatformName,
          meetingUrl: this.state.ClassesArr[this.state.TempIndex2].meetingLink
            ? this.state.ClassesArr[this.state.TempIndex2].meetingLink
            : '',
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          //console.log('AddOrUpdateMeeting response ===', responseJson);
          if (responseJson) {
            Toast.showSuccess(responseJson.message);
            this.setState({Loader: false});
          } else {
            this.setState({Loader: false});
            Toast.show('Unknown error occured', ToastData);
          }
        })
        .catch((error) => {
          this.setState({Loader: false});
          //console.log(error);
          alert(error);
        });
    } else {
      this.setState({Loader: false});
      Toast.show('Meeting Source / URL Is Compulsory', ToastData);
    }
  };
  renderItem = ({item, index}) => {
    let TempArr = this.state.ClassesArr;
    return (
      <View
        key={index}
        style={[
          styles.basicStyle,
          styles.basicHovorStyle,
          {
            height: undefined,
            justifyContent: 'flex-start',
            width: '95%',
            marginBottom: 20,
            padding: 10,
          },
        ]}>
        <View
          style={[
            styles.headerView,
            {
              backgroundColor: index % 2 == 0 ? '#23C4D7' : '#24B1EE',
              marginTop: 10,
              height: item.subjectName.length > 32 ? 160 : 130,
            },
          ]}>
          <View
            style={{
              width: '65%',
              height: '100%',
              justifyContent: 'space-evenly',
            }}>
            <Text
              numberOfLines={3}
              style={[
                styles.textBasicStyle,
                {color: 'white', paddingLeft: 10},
              ]}>
              {item.subjectName}
            </Text>

            <Text
              numberOfLines={3}
              style={[
                styles.textBasicStyle,
                {
                  fontSize: ResponsiveSize(config.AppAllSubTitle),
                  paddingLeft: 10,
                },
              ]}>
              Department : {item.department}
            </Text>
          </View>
          <View
            style={{
              width: '35%',
              justifyContent: 'space-evenly',
              height: '100%',
            }}>
            <Text
              numberOfLines={1}
              style={[
                styles.textBasicStyle,
                {fontSize: ResponsiveSize(config.AppAllSubTitle)},
              ]}>
              Course :{' '}
              <Text style={{textTransform: 'uppercase'}}>{item.course}</Text>
            </Text>
            <Text
              numberOfLines={1}
              style={[
                styles.textBasicStyle,
                {fontSize: ResponsiveSize(config.AppAllSubTitle)},
              ]}>
              Sections : {item.sections}
            </Text>

            <Text
              numberOfLines={1}
              style={[
                styles.textBasicStyle,
                {fontSize: ResponsiveSize(config.AppAllSubTitle)},
              ]}>
              Semester : {item.semester}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                styles.textBasicStyle,
                {fontSize: ResponsiveSize(config.AppAllSubTitle)},
              ]}>
              Batch Year : {item.batchYear}
            </Text>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                flexDirection: 'row',
                //justifyContent: 'center',
              }}>
              <CustomFastImage
                style={{
                  width: 20,
                  height: 20,
                  marginRight: 10,
                }}
                source={
                  item.subjectType == 'Practical'
                    ? require('../assets/practical2.png')
                    : require('../assets/book2.png')
                }
                resizeMode={'contain'}
              />
              <Text
                numberOfLines={1}
                style={[
                  styles.textBasicStyle,
                  {fontSize: ResponsiveSize(config.AppAllSubTitle)},
                ]}>
                {item.subjectType}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            width: '100%',
            //  height: '40%',
            marginVertical: 30,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          {this.state.Platforms.map((item1, index1) => {
            return (
              <TouchableOpacity
                key={index1}
                onPress={() => {
                  this.setState(
                    {
                      SelectedPlatform: item1.PlatformName,
                      TempIndex: index,
                      SubjectNumber: item.subjectNo,
                    },
                    function () {
                      TempArr[this.state.TempIndex].meetingSource =
                        item1.PlatformName;
                      this.setState({ClassesArr: TempArr});
                    },
                  );
                }}
                style={[
                  styles.meetingIconView,
                  styles.basicHovorStyle,
                  {
                    borderWidth:
                      //(this.state.SelectedPlatform ==
                      //  item1.PlatformName &&
                      //  this.state.TempIndex == index) ||
                      item.meetingSource == item1.PlatformName ? 1 : 0,
                    borderColor: '#24B1EE',
                    padding: 5,
                  },
                ]}>
                <CustomFastImage
                  style={{
                    width: 20,
                    height: 20,
                    marginRight: 10,
                  }}
                  source={
                    item.meetingSource == item1.PlatformName
                      ? require('../assets/circleFilled.png')
                      : require('../assets/circle.png')
                  }
                  resizeMode={'contain'}
                />
                <CustomFastImage
                  style={{
                    width: 50,
                    height: '60%',
                    marginRight: 10,
                  }}
                  source={item1.pic}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
            );
          })}
        </View>
        <View
          style={{
            width: '100%',
            //  height: '20%'
          }}>
          <Text style={{marginBottom: 5}}> URL</Text>

          {this.state.ActiveTextBox ? (
            <TextInput
              style={{
                width: '100%',
                borderRadius: 10,
                borderWidth: 1,
                //height: '80%',
                height: 35,
                paddingHorizontal: 5,
                marginVertical: 5,
                borderColor: 'silver',
              }}
              onChangeText={(text) => {
                //this.setState({URL: text}, function () {
                //TempArr[index].meetingLink = this.state.URL;
                TempArr[index].meetingLink = text;
                this.setState({ClassesArr: TempArr});
                //});
              }}
              onSubmitEditing={() => {
                this.setState({ActiveTextBox: false});
              }}
              value={TempArr[index].meetingLink}
              blurOnSubmit={true}
              keyboardType="url"
              returnKeyType="done"
            />
          ) : (
            <View
              style={{
                width: '100%',
                borderRadius: 10,
                borderWidth: 1,
                //height: '80%',
                height: 35,
                marginVertical: 5,
                justifyContent: 'center',
                borderColor: 'silver',
                //alignItems: 'center',
                //flexDirection: 'row',
                paddingHorizontal: 5,
              }}>
              <Text
                onLongPress={() => {
                  Clipboard.setString('item.meetingUrl');
                  Toast.showSuccess('Link copied', {
                    position: Toast.position.TOP,
                  });
                }}
                onPress={() => {
                  this.setState({
                    ActiveTextBox: true,
                    URL: item.meetingLink,
                  });
                }}
                numberOfLines={1}
                style={[
                  styles.textBasicStyle,
                  {
                    fontSize: ResponsiveSize(config.AppAllSubTitle),
                    textTransform: 'none',
                    textAlign: 'left',
                  },
                ]}>
                {item.meetingLink ? item.meetingLink : ''}
              </Text>
            </View>
          )}
        </View>
        <View style={{width: '100%', marginVertical: 20}}>
          <CustomButton
            width={'30%'}
            color={index % 2 == 0 ? '#23C4D7' : '#24B1EE'}
            title="Submit"
            onPress={() => {
              this.setState({TempIndex2: index}, function () {
                this.AddOrUpdateMeeting(
                  item.subjectNo,
                  this.state.SelectedPlatform,
                );
              });
            }}
          />
        </View>
      </View>
    );
  };
  render() {
    return (
      <SafeAreaView style={styles.mainConatiner}>
        <CustomHeader
          title="Online Classes"
          isHome={false}
          navigation={this.props.navigation}
        />
        <Loader
          Loading={this.state.Loader ? true : false}
          onPressCancel={() => {
            this.setState({Loader: false});
          }}
        />
        <ScrollView
          scrollEventThrottle={3}
          onScrollEndDrag={() => {
            this.onScrollHandler();
          }}
          contentContainerStyle={{
            width: ScreenWidth - 10,
            alignItems: 'center',
            paddingVertical: 20,
          }}>
          {/*{this.state.ClassesArr.map((item, index) => {*/}
          <FlatList
            scrollEnabled={false}
            data={this.state.posts}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index}
          />
          {/*})}*/}
        </ScrollView>
      </SafeAreaView>
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
    height: '100%',
    alignItems: 'center',
  },
  headerView: {
    width: '100%',
    alignSelf: 'center',
    //height: '20%',

    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'gray',
  },
  meetingIconView: {
    width: '30%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    //height: '80%',
    height: 63,
    flexDirection: 'row',
    borderRadius: 10,
  },
});
