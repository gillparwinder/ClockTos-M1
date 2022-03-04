import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import {SafeAreaView, StyleSheet, Image, BackHandler} from 'react-native';
import {View, Text, ScrollView} from 'react-native';
import DatePicker from 'react-native-datepicker';
import config from '../config/config';
import ResponsiveSize from '../config/ResponsiveSize';
import {CustomHeader} from './CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Switch} from 'react-native';
import {Slider} from 'react-native-elements';
import {Loader} from './Loader';
import moment from 'moment';
import {Checkbox} from 'react-native-paper';
import CustomCheckBox from '../face/components/CustomCheckBox';
import {FlatList} from 'react-native';
import {Dimensions} from 'react-native';
import {AnimatedCheckBox} from './common/AnimatedCheckBox';
import TextTicker from 'react-native-text-ticker';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import CustomFastImage from './common/CustomFastImage';
import Toast from 'react-native-tiny-toast';
import SubjectList from './SubjectList';
import StaffSubjectList from './StaffSubjectList';
import StaffSubjectsDetail from './StaffSubjectsDetail';
const GreenColor = '#008B9B';
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};
export default class StaffSideAttendanceDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Loader: false,
      Title: this.props.route.params
        ? this.props.route.params.title
          ? this.props.route.params.title
          : ''
        : '',
      AttendanceDate1: this.props.route.params
        ? this.props.route.params.AttendanceDate
          ? this.props.route.params.AttendanceDate
          : moment(new Date()).format('DD-MM-YYYY')
        : moment(new Date()).format('DD-MM-YYYY'),
      AttendanceDate: this.props?.route?.params?.AttendanceDate,
      AttendanceData2: [],
      SelectedItem: this.props.route.params
        ? this.props.route.params.item
          ? this.props.route.params.item
          : ''
        : '',
      hour:
        (this.props.route.params && `H${this.props.route.params.hour}`) || '',
      serailNoSelected: false,
      AttendanceSelected: true,
      rollNoSelected: false,
      regNoSelected: true,
      nameSelected: true,
      photoSelected: true,
      AllowChecked: false,
      body: [
        // {
        //   RegNo: 'string',
        //   date: '2021-03-19T18:31:15.104Z',
        //   hour: 0,
        //   attVal: '0',
        // },
      ],
      AttendanceData: [],
      AbsentStudent: '',
      PresentStudent: '',
      OD: '',
      Token: null,
      students: [],
      ColorCode: '#DEFCFF',
      SNo: true,
      RegNo: true,
      Photo: false,
      Name: true,
    };
  }
  componentDidMount() {
    //console.log(
    //  ' this.props.route.params.AttendanceDate = ',
    //  this.props.route.params.AttendanceDate,
    //);
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
  retrieveData = async (key) => {
    this.setState({Loader: true});
    const item =
      (this.props.route.params && this.props.route.params.item) || {};
    const students =
      (this.props.route.params && this.props.route.params.students) || [];
    this.setState({students});
    ////console.log('item', item);
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        this.setState({Token: value}, function () {
          ////console.log(value);
        });
      }
      const configs = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + value,
        },
        body: JSON.stringify({
          batchYear: item.batchYear,
          degreeCode: item.degCode,
          semester: item.sem.toString(),
          section: item.sections,
          subjectNo: item.subno.toString(),
          attDate: moment(item.date, 'MM/DD/YYYY h:mm:ss a').format(
            'YYYY-MM-DD',
          ),
          //attDate: new Date().toISOString(),
          hour: item.hour.toString(),
        }),
      };
      //console.log('body ==>', configs.body);
      //console.log('url = ', config.baseUrl2 + 'staff/GetStudentDetails');

      const response = await fetch(
        config.baseUrl2 + 'staff/GetStudentDetails',
        configs,
      );
      const json = await response.json();
      //console.log('JSON ==>', json);
      let data = [];
      if (Object.keys(json).length) {
        this.setState(
          {
            AttendanceData: json.studentsList,
            AttendanceData2: json,
            Loader: false,
          },
          () => {
            console.log('AttendanceDataa', this.state.AttendanceData);
          },
        );
        if (json.studentsList.length) {
          json.studentsList.forEach((itemm) => {
            data.push({
              //RegNo: itemm.RegNo,
              registratioNumber: itemm.registrationNo,
              //date: moment(item.date).format('YYYY-MM-DD'),
              date: moment(item.date, 'MM/DD/YYYY h:mm:ss a').format(
                'YYYY-MM-DD',
              ),
              hour: Number(
                this.props.route.params && this.props.route.params.hour,
              ),
              attVal:
                itemm.attval === '3' ? '3' : itemm.attval === '2' ? '2' : '1',
              //attVal: itemm.attval === '' ? '2' : itemm.attval,
            });
          });

          this.setState({body: [...data]}, () => {
            this.AttendanceFilter(this.state.body);
            //this.submitHandler(1);
          });
          //console.log('body', this.state.body);
          // } else {
          //   this.setState({Loader: false}, function () {
          //     alert(
          //       'Not fetching all data from prevesion screen. Please try again',
          //     );
          //   });
          // }
        }
      } else {
        alert('Data Issue');
      }
    } catch (error) {
      this.setState({Loader: false});
      console.log(error);
      //alert('Unhandled exception occured. Please try again.');
      alert(error);
      this.setState({Loader: false});
    }
  };
  AttendanceFilter = async (Arr) => {
    let PresentStudent = Arr.filter(function (item) {
      return item.attVal == '1';
    });
    let AbsentStudent = Arr.filter(function (item) {
      return item.attVal == '2';
    });
    let OD = Arr.filter(function (item) {
      return item.attVal == '3';
    });
    this.setState(
      {
        PresentStudent: PresentStudent.length,
        AbsentStudent: AbsentStudent.length,
        OD: OD.length,
      },
      () => {
        if (!this.state.AllowChecked) {
          this.setState({checkedAll: false});
        }
        //console.log('Total students = ', Arr.length);
        //console.log('PresentStudent = ', this.state.PresentStudent);
        //console.log('AbsentStudent = ', this.state.AbsentStudent);
        //console.log('OD = ', this.state.OD);
      },
    );
  };
  submitHandler = async () => {
    if (this.state.body.length) {
      if (this.state.SelectedItem.bellTimeLock == 0) {
        //console.log('done', this.state.body);
        this.setState({Loader: true});
        try {
          const configs = {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + this.state.Token,
              // Authorization:
              //   'Bearer ' +
              //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0Mjg3Y2JlMy00M2FlLTQzODYtODcyYS1jZWFkMmJlYTM1YTIiLCJVc2VyTmFtZSI6IjExMjMiLCJEQiI6ImFUNXV4ZGd2empUQ1IwaWhrSkV6YVcrWCpOTVVBcERMNUVPa1lnZHA5d0NCUk1YOWc3am5iTkdOdVVieUlmd0FRbG1rVkx4c0xPKnVVRWpBaHhkN3V2YVljZVY5UWhiaEVUZVc5Kk1BTzJydjVDY3BWK3hxMEJ6RHpuOEt4M2lZb3AzKzFXSDl5MzhDKkVmZUxBRXQ0V3djSThnZ2hFaFFaRUZ2TjlZcG9VdkUxaXo3eHhMUXRVSllabUwqd3FRS0k0b0VqZWtkSUNPOCo1ckpMYVRCUFl6cTFrVDZzZlQqVFQwa2d4YjRqeEg2OEQwSmlLK1QrT2orYXhjdXdDTDNNQ24yWjkreGkyeXRLUnplUjZpOXJ2eTYyYW1HdWVKTjJteEpoRHpUcmhyOTlKNXM1aGUqTFlYbzY3MWtNeHdYMkRHME9IaTErUFFMMzNKRndPMXZ5UT09IiwiSXNTY2hvb2wiOiJUcnVlIiwidXNlcl9pZCI6InJhbWFiYWRyYW4iLCJ1c2VyX2NvZGUiOiIzMDkiLCJjb2xsZWdlX2NvZGUiOiIxMyIsImNvbGxlZ2VOYW1lIjoiIiwibmJmIjoxNjE2MTc1NDI2LCJleHAiOjE2MTYxODI2MjYsImlzcyI6InBhbHBhcC1wcm9kLWVudmlyb25tZW50IiwiYXVkIjoicGFscGFwcHJvZHVzZXJzIn0.ZiE5-dLDr7L33o_M64K5b9GuafauszbmJmNXW4hbgmQ',
            },
            body: JSON.stringify(this.state.body),
          };
          console.log('body ==>', configs.body);
          const response = await fetch(
            config.baseUrl2 + 'staff/MarkAttendanceOfStudentOfParticularClass',
            configs,
          );
          console.log(
            config.baseUrl2 + 'staff/MarkAttendanceOfStudentOfParticularClass',
          );
          const json = await response.json();
          console.log('JSON', json);
          this.setState({Loader: false}, () => {
            alert(json.message);
            if (json.status) {
              return this.props.navigation.navigate('StaffSideAttendance');
            }
          });
        } catch (e) {
          alert(e);
          //alert(
          //  'Unhandled exception occured while saving the data. Please try again.',
          //);
        }
      } else {
        Toast.show(
          'You Are Not Able To Mark Attendance For This Date',
          ToastData,
        );
      }
    } else {
      Toast.show('No Data Available');
    }
  };

  renderItem = ({item, index}) => {
    return (
      <View
        style={{
          width: '100%',
          alignSelf: 'center',
          //height: 90,
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 8,
          alignItems: 'center',
          borderRadius: 10,
          //paddingHorizontal: 5,
          backgroundColor: index % 2 ? 'white' : '#DEFCFF',
        }}>
        {this.state.SNo && (
          <View
            style={{
              //width: '10%',
              flex: 0.3,
              //height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontWeight: '600',
                  lineHeight: 25,
                  color: GreenColor,
                  paddingRight: 10,
                }}>
                {index + 1}
              </Text>
            }
          </View>
        )}
        {this.state.Photo && (
          <View
            style={{
              //width: '15%',
              flex: 0.5,
              //height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {item.photo ? (
              <CustomFastImage
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 30,
                }}
                source={{
                  uri: `${item.photo}`,
                }}
                resizeMode={'cover'}
              />
            ) : (
              <CustomFastImage
                resizeMode={'cover'}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 30,
                }}
                source={require('../assets/avatar.png')}
              />
            )}
          </View>
        )}
        {this.state.RegNo && (
          <View
            style={{
              //width: '25%',
              flex: 0.8,
              //height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TextTicker
              style={{
                fontFamily: 'Poppins-Regular',
                lineHeight: 25,
                color: GreenColor,
              }}
              duration={15000}
              loop
              //bounce
              //repeatSpacer={50}
              //marqueeDelay={1000}
            >
              {item.registrationNo}
            </TextTicker>
            {/*<Text
              numberOfLines={1}
              style={{
                fontFamily: 'Poppins-Regular',
                //fontWeight: '600',
                lineHeight: 25,
                color: GreenColor,
                //paddingRight: 10,
              }}>
              {item.registrationNo}
            </Text>*/}
          </View>
        )}
        {this.state.Name && (
          <View
            style={{
              //width: '35%',
              flex: 1,
              //height: '100%',
              justifyContent: 'center',
              //alignItems: 'center',
            }}>
            <TextTicker
              style={{
                fontFamily: 'Poppins-Regular',
                fontWeight: '600',
                lineHeight: 25,
                textTransform: 'uppercase',
                color: GreenColor,
              }}
              duration={15000}
              loop
              //bounce
              //repeatSpacer={50}
              //marqueeDelay={1000}
            >
              {item.studentName}
            </TextTicker>
            {/*<Text
              numberOfLines={1}
              style={{
                fontFamily: 'Poppins-Regular',
                fontWeight: '600',
                lineHeight: 25,
                textTransform: 'uppercase',
                color: GreenColor,
              }}>
              {item.studentName}
            </Text>*/}
          </View>
        )}
        {this.state.students.length === 0 && (
          <View
            style={{
              //width: '15%',
              flex: 0.3,
              //maxWidth: 70,
              paddingHorizontal: 5,
              //height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {/* <Switch value={item.appNo == 0 ? false : true} /> */}
            {/*<Slider
              value={Number(this.state.body[index].attVal)}
              //value={0}
              disabled={
                //this.state.AttendanceData[index].attval == '3' ||
                //this.state.AttendanceData[index].attVal == 3 ||
                this.state.SelectedItem.bellTimeLock == 1
              }
              onValueChange={(value) => {
                //alert(value);
                //console.log(
                //  'this.state.AttendanceData  = ',
                //  this.state.AttendanceData,
                //);
                //console.log(
                //  'this.state.AttendanceData[index].attval  = ',
                //  this.state.AttendanceData[index].attval,
                //  'index = ',
                //  index,
                //);
                this.state.body[index].attVal = value.toString();
                this.setState(
                  {
                    body: [...this.state.body],
                  },
                  () => this.AttendanceFilter(this.state.body),
                  //console.log('this.state.body = ', this.state.body),
                );
              }}
              maximumValue={ 2}
              minimumValue={}
              step={1}
              trackStyle={{
                height: 10,
                width:35,
                backgroundColor: 'transparent',
              }}
              thumbStyle={{
                height: 20,
                width: 20,
                backgroundColor:
                  //Number(this.state.AttendanceData[index].attval) == 3
                  //  ? 'gray'
                  //  : //:
                  this.state.SelectedItem.bellTimeLock == 1
                    ? 'silver'
                    : Number(this.state.body[index].attVal) == 2
                    ? 'red'
                    : Number(this.state.body[index].attVal) == 3
                    ? 'gray'
                    : 'green',
              }}
            />*/}

            {/*<Checkbox
              disabled={
                this.state.SelectedItem.bellTimeLock == 1 ? true : false
              }
              status={
                Number(this.state.body[index].attVal) === 1
                  ? 'checked'
                  : 'unchecked'
              }
              onPress={(value) => {
                if (
                  Number(this.state.body[index].attVal) == 3 ||
                  Number(this.state.body[index].attVal) == 2
                ) {
                  this.state.body[index].attVal = '1';
                  this.setState(
                    {
                      body: [...this.state.body],
                    },
                    () => this.AttendanceFilter(this.state.body),
                    //console.log('this.state.body = ', this.state.body),
                  );
                } else {
                  this.state.body[index].attVal = '2';
                  this.setState(
                    {
                      body: [...this.state.body],
                    },
                    () => this.AttendanceFilter(this.state.body),
                    //console.log('this.state.body = ', this.state.body),
                  );
                }
              }}
              color={GreenColor}
              uncheckedColor={
                Number(this.state.body[index].attVal) === 3 ? 'silver' : 'red'
              }
            />*/}
            <AnimatedCheckBox
              size={20}
              disableBuiltInState={true}
              isChecked={
                Number(this.state.body[index].attVal) === 1 ? true : false
              }
              fillColor={GreenColor}
              unfillColor={'white'}
              //text="Custom Checkbox"
              iconStyle={{
                borderRadius: 5,
                borderColor:
                  Number(this.state.body[index].attVal) === 1
                    ? GreenColor
                    : Number(this.state.body[index].attVal) === 3
                    ? 'silver'
                    : 'red',
              }}
              textStyle={{fontFamily: 'Poppins-Regular'}}
              onPress={() => {
                if (
                  Number(this.state.body[index].attVal) == 3 ||
                  Number(this.state.body[index].attVal) == 2
                ) {
                  this.state.body[index].attVal = '1';
                  this.setState(
                    {
                      body: [...this.state.body],
                    },
                    () => this.AttendanceFilter(this.state.body),
                    //console.log('this.state.body = ', this.state.body),
                  );
                } else {
                  this.state.body[index].attVal = '2';
                  this.setState(
                    {
                      body: [...this.state.body],
                    },
                    () => this.AttendanceFilter(this.state.body),
                    //console.log('this.state.body = ', this.state.body),
                  );
                }
              }}
            />
          </View>
        )}
        {/*<View
          style={{
            //width: '15%',
            flex: 0.3,
            //height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <AnimatedCheckBox
            size={20}
            disableBuiltInState={true}
            isChecked={
              Number(this.state.body[index].attVal) === 3 ? true : false
            }
            fillColor={GreenColor}
            unfillColor={'white'}
            //text="Custom Checkbox"
            iconStyle={{
              borderRadius: 5,
              borderColor:
                Number(this.state.body[index].attVal) === 3
                  ? GreenColor
                  : 'red',
            }}
            textStyle={{fontFamily: 'Poppins-Regular'}}
            onPress={() => {
              this.state.body[index].attVal = '3';
              this.setState(
                {
                  body: [...this.state.body],
                  checkedAll: false,
                },
                () => this.AttendanceFilter(this.state.body),
                //console.log('this.state.body = ', this.state.body),
              );
            }}
          />
          <Checkbox
            disabled={this.state.SelectedItem.bellTimeLock == 1 ? true : false}
            status={
              Number(this.state.body[index].attVal) === 3
                ? 'checked'
                : 'unchecked'
            }
            onPress={() => {
              this.state.body[index].attVal = '3';
              this.setState(
                {
                  body: [...this.state.body],
                  checkedAll: false,
                },
                () => this.AttendanceFilter(this.state.body),
                //console.log('this.state.body = ', this.state.body),
              );
            }}
            color={GreenColor}
            uncheckedColor={GreenColor}
          />
        </View>*/}
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView>
        <Loader
          Loading={this.state.Loader ? true : false}
          onPressCancel={() => {
            this.setState({Loader: false});
          }}
        />

        <CustomHeader
          isHome={false}
          navigation={this.props.navigation}
          title="Attendance"
        />

        <View
          style={{
            width: '95%',
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            //height: 40,
            //flexGrow: 1,
            borderRadius: 10,
            marginVertical: 10,
            borderWidth: 0.5,
            borderColor: GreenColor,
          }}>
          <TouchableOpacity
            onPress={() => {
              this.setState({AttendanceSelected: true});
            }}
            style={{
              width: '50%',
              //height: '95%',
              marginLeft: 2,
              paddingVertical: 10,
              backgroundColor: this.state.AttendanceSelected
                ? GreenColor
                : 'transparent',
              alignItems: 'center',
              borderRadius: 10,
              justifyContent: 'center',
            }}>
            <Text
              numberOfLines={1}
              style={[
                styles.selectionTextStyle,
                {
                  color: !this.state.AttendanceSelected ? GreenColor : 'white',
                },
              ]}>
              Attendance
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({AttendanceSelected: false});
            }}
            style={{
              width: '50%',
              //height: '95%',
              marginRight: 2,
              paddingVertical: 10,
              backgroundColor: !this.state.AttendanceSelected
                ? GreenColor
                : 'transparent',
              alignItems: 'center',
              borderRadius: 10,
              justifyContent: 'center',
            }}>
            <Text
              numberOfLines={1}
              style={[
                styles.selectionTextStyle,
                {
                  color: this.state.AttendanceSelected ? GreenColor : 'white',
                },
              ]}>
              Notes & Homework
            </Text>
          </TouchableOpacity>
        </View>
        {this.state.AttendanceSelected ? (
          <View
            style={[
              styles.SubjectMainContainer,

              {
                backgroundColor: 'white',
                height: '86%',
                //paddingBottom: 20,
              },
            ]}>
            <View
              style={{
                width: '95%',
                alignSelf: 'center',
                //height: 40,
                paddingVertical: 8,
                marginVertical: 10,
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 10,
                flexWrap: 'wrap',
                backgroundColor: '#DEFCFF',
              }}
              key={Math.random()}>
              <View style={styles.IndentityView}>
                <View
                  style={[styles.signals, {backgroundColor: 'green'}]}></View>
                <Text numberOfLines={1} style={styles.IndentityViewText}>
                  Present
                </Text>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.IndentityViewText,
                    {
                      fontWeight: 'bold',
                      fontSize: hp(2),
                      marginLeft: 5,
                      color: 'green',
                    },
                  ]}>
                  {this.state.PresentStudent}
                </Text>
              </View>
              <View style={styles.IndentityView}>
                <View style={[styles.signals, {backgroundColor: 'red'}]}></View>
                <Text numberOfLines={1} style={styles.IndentityViewText}>
                  Absent
                </Text>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.IndentityViewText,
                    {
                      fontWeight: 'bold',
                      fontSize: hp(2),
                      marginLeft: 10,
                      color: 'red',
                    },
                  ]}>
                  {this.state.AbsentStudent}
                </Text>
              </View>
              {/*<View style={styles.IndentityView}>
                <View
                  style={[styles.signals, {backgroundColor: 'gray'}]}></View>
                <Text numberOfLines={1} style={styles.IndentityViewText}>
                  OD
                </Text>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.IndentityViewText,
                    {
                      fontWeight: 'bold',
                      fontSize: hp(2),
                      marginLeft: 10,
                      color: 'gray',
                    },
                  ]}>
                  {this.state.OD}
                </Text>
              </View>*/}
              <View
                style={[styles.IndentityView, {flex: 0.5, marginRight: 10}]}>
                <View
                  style={[styles.signals, {backgroundColor: 'silver'}]}></View>
                <Text numberOfLines={1} style={styles.IndentityViewText}>
                  Lock
                </Text>
              </View>
              {/*<View style={styles.IndentityView}>
            <View
              style={[styles.signals, {backgroundColor: 'purple'}]}></View>
            <Text numberOfLines={1} style={styles.IndentityViewText}>
              On Duty
            </Text>
          </View>*/}
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: GreenColor,
                minWidth: '30%',
                alignSelf: 'center',
                alignItems: 'center',
                padding: 5,
                borderRadius: 20,
                marginVertical: 10,
              }}
              onPress={() => this.submitHandler()}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: config.fontFamily.regular,
                  fontWeight: '400',
                }}>
                Save
              </Text>
            </TouchableOpacity>
            <View
              style={{
                marginHorizontal: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '90%',
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontWeight: '600',
                  lineHeight: 25,
                  color: GreenColor,
                }}>
                Date : {this.state.AttendanceDate1}
              </Text>
              {this.state.SelectedItem.bellTimeLock == 0 && (
                <CustomCheckBox
                  text={' Present All  '}
                  width="40%"
                  textColor={GreenColor}
                  color={GreenColor}
                  alignSelf={'flex-end'}
                  status={this.state.checkedAll}
                  onPress={() => {
                    let data1 = [];
                    this.state.AttendanceData.forEach((itemm) => {
                      //console.log('attendaveValue', itemm.attval);
                      data1.push({
                        //RegNo: itemm.RegNo,
                        registratioNumber: itemm.registrationNo,
                        date:
                          this.props.route.params &&
                          this.props.route.params.item
                            ? moment(
                                this.props.route.params.item.date,
                                'MM/DD/YYYY h:mm:ss a',
                              ).format('YYYY-MM-DD')
                            : null,
                        //date: itemm.date,
                        //date: moment(itemm.date, 'MM/DD/YYYY h:mm:ss a').format(
                        //  'YYYY-MM-DD',
                        //),
                        hour: Number(
                          this.props.route.params &&
                            this.props.route.params.hour,
                        ),
                        attVal: itemm.attval,
                        //attVal: itemm.attval === '' ? '2' : itemm.attval,
                      });
                    });

                    this.setState({checkedAll: !this.state.checkedAll}, () => {
                      //console.log('data1 = ', data1);
                      let data = data1;
                      data.forEach((item, index) => {
                        item.attVal =
                          item.attVal == '3' || item.attVal == 3
                            ? '3'
                            : this.state.checkedAll
                            ? '1'
                            : '2';
                      });
                      this.setState(
                        {body: [...data], AllowChecked: true},
                        () => {
                          this.AttendanceFilter(this.state.body);
                          //console.log('checkbox body = ', this.state.body);
                        },
                      );
                    });
                  }}
                />
              )}
            </View>

            <View
              style={{
                flexDirection: 'row',
                width: '98%',
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                flexWrap: 'wrap',
                marginVertical: 10,
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({SNo: !this.state.SNo});
                }}
                style={[
                  styles.CheckBoxContainer,
                  {
                    borderColor: 'silver',
                  },
                ]}>
                <AnimatedCheckBox
                  size={20}
                  disableBuiltInState={true}
                  isChecked={this.state.SNo ? true : false}
                  fillColor={GreenColor}
                  unfillColor={'white'}
                  //text="Custom Checkbox"
                  iconStyle={{
                    borderRadius: 5,
                  }}
                  textStyle={{fontFamily: 'Poppins-Regular'}}
                  onPress={() => {
                    this.setState({SNo: !this.state.SNo});
                  }}
                />
                {/*<Checkbox
                  status={this.state.SNo ? 'checked' : 'unchecked'}
                  onPress={() => {
                    this.setState({SNo: !this.state.SNo});
                  }}
                  color={GreenColor}
                  uncheckedColor="silver"
                />*/}
                <Text
                  style={{
                    color: this.state.SNo ? GreenColor : 'black',
                  }}>
                  S. No.
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.setState({Photo: !this.state.Photo});
                }}
                style={[
                  styles.CheckBoxContainer,
                  {
                    borderColor: 'silver',
                  },
                ]}>
                {/*<Checkbox
                  status={this.state.Photo ? 'checked' : 'unchecked'}
                  onPress={() => {
                    this.setState({Photo: !this.state.Photo});
                  }}
                  color={GreenColor}
                  uncheckedColor="silver"
                />*/}
                <AnimatedCheckBox
                  size={20}
                  disableBuiltInState={true}
                  isChecked={this.state.Photo ? true : false}
                  fillColor={GreenColor}
                  unfillColor={'white'}
                  //text="Custom Checkbox"
                  iconStyle={{
                    borderRadius: 5,
                  }}
                  textStyle={{fontFamily: 'Poppins-Regular'}}
                  onPress={() => {
                    this.setState({Photo: !this.state.Photo});
                  }}
                />
                <Text
                  style={{
                    color: this.state.Photo ? GreenColor : 'black',
                  }}>
                  Photo
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.setState({RegNo: !this.state.RegNo});
                }}
                style={[
                  styles.CheckBoxContainer,
                  {
                    borderColor: 'silver',
                  },
                ]}>
                {/*<Checkbox
                  status={this.state.RegNo ? 'checked' : 'unchecked'}
                  onPress={() => {
                    this.setState({RegNo: !this.state.RegNo});
                  }}
                  color={GreenColor}
                  uncheckedColor="silver"
                />*/}
                <AnimatedCheckBox
                  size={20}
                  disableBuiltInState={true}
                  isChecked={this.state.RegNo ? true : false}
                  fillColor={GreenColor}
                  unfillColor={'white'}
                  //text="Custom Checkbox"
                  iconStyle={{
                    borderRadius: 5,
                  }}
                  textStyle={{fontFamily: 'Poppins-Regular'}}
                  onPress={() => {
                    this.setState({RegNo: !this.state.RegNo});
                  }}
                />
                <Text
                  style={{
                    color: this.state.RegNo ? GreenColor : 'black',
                  }}>
                  Reg.No.
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.setState({Name: !this.state.Name});
                }}
                style={[
                  styles.CheckBoxContainer,
                  {
                    borderColor: 'silver',
                  },
                ]}>
                {/*<Checkbox
                  status={this.state.Name ? 'checked' : 'unchecked'}
                  onPress={() => {
                    this.setState({Name: !this.state.Name});
                  }}
                  color={GreenColor}
                  uncheckedColor="silver"
                />*/}
                <AnimatedCheckBox
                  size={20}
                  disableBuiltInState={true}
                  isChecked={this.state.Name ? true : false}
                  fillColor={GreenColor}
                  unfillColor={'white'}
                  //text="Custom Checkbox"
                  iconStyle={{
                    borderRadius: 5,
                  }}
                  textStyle={{fontFamily: 'Poppins-Regular'}}
                  onPress={() => {
                    this.setState({Name: !this.state.Name});
                  }}
                />
                <Text
                  style={{
                    color: this.state.Name ? GreenColor : 'black',
                  }}>
                  Name
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: '95%',
                alignSelf: 'center',
                flex: 1,
                //flexGrow: 1,
                //height: '75%',
                marginTop: 10,
                backgroundColor: '#DEFCFF',
                borderRadius: 10,
              }}>
              <View
                style={{
                  width: '100%',
                  alignSelf: 'center',
                  //height: 40,
                  paddingVertical: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 5,
                  borderRadius: 10,
                  backgroundColor: GreenColor,
                }}
                key={Math.random()}>
                {this.state.SNo && (
                  <View
                    style={{
                      //width: '10%',
                      flex: 0.3,
                      ////height: '100%',
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
                      S.No
                    </Text>
                  </View>
                )}
                {this.state.Photo && (
                  <View
                    style={{
                      //width: '15%',
                      flex: 0.5,
                      ////height: '100%',
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
                )}
                {this.state.RegNo && (
                  <View
                    style={{
                      //width: '25%',
                      flex: 0.8,
                      ////height: '100%',
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
                      Reg. No.
                    </Text>
                  </View>
                )}
                {this.state.Name && (
                  <View
                    style={{
                      //width: '35%',
                      flex: 1,
                      ////height: '100%',
                      justifyContent: 'center',
                      //alignItems: 'center',
                      paddingLeft: 10,
                    }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontFamily: 'Poppins-Regular',
                        fontWeight: '600',
                        lineHeight: 25,
                        color: 'white',
                      }}>
                      S.Name
                    </Text>
                  </View>
                )}
                <View
                  style={{
                    //width: '15%',
                    flex: 0.3,
                    ////height: '100%',
                    //alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: 'Poppins-Regular',
                      fontWeight: '600',
                      lineHeight: 25,
                      color: 'white',
                    }}>
                    {'P/A'}
                  </Text>
                </View>
                {/*<View
                  style={{
                    //width: '15%',
                    flex: 0.3,
                    ////height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: 'Poppins-Regular',
                      fontWeight: '600',
                      lineHeight: 25,
                      color: 'white',
                    }}>
                    {'OD'}
                  </Text>
                </View>*/}
              </View>
              {this.state.AttendanceData.length > 0 &&
              this.state.body.length > 0 ? (
                <View
                  style={{
                    flex: 1,
                    width: '100%',
                  }}>
                  <FlatList
                    contentContainerStyle={{paddingBottom: 100}}
                    data={
                      this.props.route?.params?.students
                        ? this.props.route.params.students
                        : this.state.AttendanceData
                    }
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderItem}
                  />
                </View>
              ) : !this.state.Loader ? (
                <View
                  key={Math.random()}
                  duration={400}
                  style={[styles.header, {width: '95%', alignSelf: 'center'}]}
                  transition="backgroundColor">
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    No data available
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        ) : (
          <View
            style={[
              styles.SubjectMainContainer,

              {
                backgroundColor: 'white',
                height: '87%',
              },
            ]}>
            <StaffSubjectsDetail
              {...this.props}
              isReuse={true}></StaffSubjectsDetail>
          </View>
        )}
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  header: {
    backgroundColor: '#F5FCFF',
    padding: 10,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 5,
    margin: 5,
  },
  headerText: {
    //textAlign: 'center',
    fontSize: ResponsiveSize(config.AppAllTextSize),
    fontWeight: '500',
    textTransform: 'uppercase',
    fontFamily: 'Poppins-Regular',
  },

  SubjectMainContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20,
  },
  IndentityView: {
    //width: '33.33%',
    flex: 1,
    height: 35,
    ////height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  IndentityViewText: {
    fontFamily: 'Poppins-Regular',
    fontWeight: '600',
    //lineHeight: 25,
    color: GreenColor,
  },
  signals: {
    width: 12,
    height: 12,
    borderRadius: 12,
    marginRight: 5,
  },
  selectionTextStyle: {
    fontFamily: 'Poppins-Regular',
    fontWeight: '600',
    lineHeight: 25,
  },
  selectionStyle: {
    width: '20%',
    //height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  CheckBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 5,
    //elevation: 2,
    //paddingRight: 2,
    //paddingLeft: 2,
    height: 30,
    //borderWidth: 1,
    //backgroundColor: 'white',
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 10,
    flex: 1,
  },
});
