import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import {SafeAreaView, StyleSheet, Image, BackHandler} from 'react-native';
import {View, Text, ScrollView} from 'react-native';
import DatePicker from 'react-native-datepicker';
import config from '../config/config';
import ResponsiveSize from '../config/ResponsiveSize';
import {CustomHeader} from './CustomHeader';
import {Loader} from './Loader';
import {FlatList} from 'react-native';

// import Orientation from 'react-native-orientation-locker';
import moment, {duration} from 'moment';
import {Dimensions} from 'react-native';
import {Linking} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-tiny-toast';
import CustomCheckBox from '../face/components/CustomCheckBox';
import {Checkbox} from 'react-native-paper';
import {TextInput} from 'react-native';
import {CustomButton} from './common/Button';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import CustomFastImage from './common/CustomFastImage';
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};
export default class StaffInternalMarkDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Title: this.props.route?.params?.title || '',
      TempIndex: -1,
      SNo: true,
      RollNo: true,
      RegNo: true,
      Name: true,
      Photo: true,
      GetCamSubjectStudentForEntry: [],
      ColorCode: this.props.route.params
        ? this.props.route.params.ColorCode
          ? this.props.route.params.ColorCode
          : ''
        : '',
      subjectName: this.props.route.params
        ? this.props.route.params.subjectName
          ? this.props.route.params.subjectName
          : ''
        : '',
      subjectNo: this.props.route.params
        ? this.props.route.params.subjectNo
          ? this.props.route.params.subjectNo
          : ''
        : '',
      batchYear: this.props.route.params
        ? this.props.route.params.batchYear
          ? this.props.route.params.batchYear
          : ''
        : '',
      degreeCode: this.props.route.params
        ? this.props.route.params.degreeCode
          ? this.props.route.params.degreeCode
          : ''
        : '',
      semester: this.props.route.params
        ? this.props.route.params.semester
          ? this.props.route.params.semester
          : ''
        : '',
      section: this.props.route.params
        ? this.props.route.params.section
          ? this.props.route.params.section
          : ''
        : '',
      subjectCode: this.props.route.params
        ? this.props.route.params.subjectCode
          ? this.props.route.params.subjectCode
          : ''
        : '',
      criteria: this.props.route.params
        ? this.props.route.params.criteria
          ? this.props.route.params.criteria
          : ''
        : '',
      MaxMarks: this.props.route.params
        ? this.props.route.params.MaxMarks
          ? this.props.route.params.MaxMarks
          : ''
        : '',
      examDate: this.props.route.params?.examDate || '',
      Loader: true,
      //AttendanceDate: moment().format('YYYY-MM-DD'),
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
          this.onPressGetCamSubjectStudentForEntry(
            this.props.route.params.criteria,
            this.props.route.params.subjectCode,
            this.props.route.params.batchYear,
            this.props.route.params.degreeCode,
            this.props.route.params.semester,
            this.props.route.params.section,
          );
        });
      }
    } catch (error) {
      alert('Error retrieving data');
    }
    try {
      const value = await AsyncStorage.getItem('staffCode');
      if (value !== null) {
        //alert(value);
        this.setState({staffCode: value}, function () {
          //console.log('staffCode = ', this.state.staffCode);
        });
      }
    } catch (error) {
      alert('Error retrieving data');
    }
  };
  onPressGetCamSubjectStudentForEntry = (
    testName,
    subjectCode,
    batchYear,
    degreeCode,
    sem,
    sec,
  ) => {
    const url = config.baseUrl2 + 'staff/GetCamSubjectStudentForEntry';
    //const url = config.baseUrl2 + 'staff/GetCamSubjectStudentForEntry';
    console.log(url);
    console.log(
      JSON.stringify({
        //testName: 'Assessment Test 1',
        //subjectCode: 'EE8552',
        testName: testName,
        subjectCode: subjectCode,
        //batchYear: batchYear.toString(),
        //degreeCode: degreeCode,
        //sem: sem,
        //sec: sec,
      }),
    );
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.state.Token,
      },
      body: JSON.stringify({
        //testName: 'Assessment Test 1',
        //subjectCode: 'EE8552',
        testName: testName,
        subjectCode: subjectCode,
        //batchYear: batchYear.toString(),
        //degreeCode: degreeCode,
        //sem: sem,
        //sec: sec,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('GetCamSubjectStudentForEntry = ', responseJson);
        if (responseJson) {
          this.setState(
            {
              Loader: false,
              GetCamSubjectStudentForEntry: responseJson,
              initialArr: responseJson,
            },
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
        this.setState({Loader: false}, function () {
          alert(error);
          //console.log(error);
        });
      });
  };
  onPressAddOrUpdateCamEntiry = () => {
    let Arr = this.state.GetCamSubjectStudentForEntry;
    let FinalArr = [];
    Arr.map((item) => {
      FinalArr.push({
        InternalTest: this.state.criteria,
        SubjectCode: this.state.subjectCode,
        rollno: item.rollNo,
        Studmark: item.studentMark,
        Staff: this.state.staffCode,
      });
    });
    const url = config.baseUrl2 + 'staff/AddOrUpdateCamEntiry';
    //console.log(url);
    //console.log(JSON.stringify(FinalArr));
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.state.Token,
      },
      body: JSON.stringify(FinalArr),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //console.log('AddOrUpdateCamEntiry = ', responseJson);
        if (responseJson.status == true) {
          this.setState({Loader: false}, function () {
            Toast.showSuccess('Marks added');
          });
        } else {
          this.setState(
            {
              Loader: false,
              GetCamSubjectStudentForEntry: this.state.initialArr,
            },
            function () {
              Toast.show(
                'Temporary error try again after some time',
                ToastData,
              );
            },
          );
        }
      })
      .catch((error) => {
        this.setState({Loader: false}, function () {
          alert(error);
        });
      });
  };
  renderItem = ({item, index}) => {
    let a = moment(item.camLockDate, 'DD/MM/YYYY', true).format();
    ('2016-12-01T00:00:00-06:00');
    let b = moment(this.state.examDate, 'DD/MM/YYYY', true).format();
    ('2016-12-01T00:00:00-06:00');
    ////console.log('item == ', item);
    let TempArr = this.state.GetCamSubjectStudentForEntry;
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({
            ActiveTextBox: true,
            TempActive: index,
            MarksObtained: '',
          });
        }}
        style={{
          width: '95%',
          alignSelf: 'center',
          //height: 50,
          justifyContent: 'center',
          marginVertical: 8,
          marginTop: 5,
          alignItems: 'center',
          borderRadius: 10,
          backgroundColor: index % 2 ? 'white' : '#DEFCFF',
        }}>
        <View
          style={{
            width: '100%',
            alignSelf: 'center',
            height: 50,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          {this.state.SNo ? (
            <View
              style={{
                width: '10%',
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
                  color:
                    TempArr[index].studentMark == -1 ||
                    TempArr[index].studentMark == 'AAA'
                      ? 'red'
                      : item.camLock == 0
                      ? this.state.ColorCode
                      : a > b
                      ? 'silver'
                      : 'black',
                }}>
                {/*{item.registrationNo}*/} {index + 1}
              </Text>
            </View>
          ) : null}

          {this.state.Photo ? (
            <View
              style={{
                width: '15%',
                //height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 10,
              }}>
              {item.photo ? (
                <CustomFastImage
                  resizeMode={'cover'}
                  defaultSource={require('../assets/avatar.png')}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 30,
                  }}
                  source={{
                    uri: `${item.photo}`,
                  }}
                />
              ) : (
                <CustomFastImage
                  resizeMode={'cover'}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 30,
                    resizeMode: 'cover',
                  }}
                  source={require('../assets/avatar.png')}
                />
              )}
            </View>
          ) : null}
          {this.state.RollNo ? (
            <View
              style={{
                //width: '25%',
                flex: 1,
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
                  color:
                    TempArr[index].studentMark == -1 ||
                    TempArr[index].studentMark == 'AAA'
                      ? 'red'
                      : item.camLock == 0
                      ? 'black'
                      : a > b
                      ? 'silver'
                      : 'black',
                }}>
                {/*{item.registrationNo}*/} {item.rollNo}
              </Text>
            </View>
          ) : null}
          {/*{this.state.RegNo ? (
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
                color: this.state.ColorCode,
              }}>
              {item.regNo}
            </Text>
          </View>
        ) : null}*/}
          {this.state.Name ? (
            <View
              style={{
                //width: '30%',
                flex: 1,
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
                  color:
                    TempArr[index].studentMark == -1 ||
                    TempArr[index].studentMark == 'AAA'
                      ? 'red'
                      : item.camLock == 0
                      ? this.state.ColorCode
                      : a > b
                      ? 'silver'
                      : 'black',
                }}>
                {item.studentName}
              </Text>
            </View>
          ) : null}
          <View
            style={{
              width: '20%',
              //height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '60%',
                height: '80%',
                borderWidth: 1,
                borderColor:
                  TempArr[index].studentMark == -1 ||
                  TempArr[index].studentMark == 'AAA'
                    ? 'red'
                    : item.camLock == 0
                    ? 'black'
                    : a > b
                    ? 'silver'
                    : 'black',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TextInput
                editable={item.camLock == 0 ? true : a > b ? false : true}
                ref={(input) => {
                  this.textInput = input;
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  textAlign: 'center',
                  color:
                    TempArr[index].studentMark == -1 ||
                    TempArr[index].studentMark == 'AAA'
                      ? 'red'
                      : item.camLock == 0
                      ? 'black'
                      : a > b
                      ? 'silver'
                      : 'black',
                  paddingHorizontal: 5,
                }}
                onChangeText={(text) => {
                  if (text > 100) {
                    TempArr[index].studentMark = '';
                    this.setState({GetCamSubjectStudentForEntry: TempArr});
                    Toast.show("Number can't be greater than 100", ToastData);
                    //alert(TempArr[index].studentMark);
                  } else if (text == 'A') {
                    TempArr[index].studentMark = '-1';
                    this.setState({GetCamSubjectStudentForEntry: TempArr});
                    //} else if (text == '-') {
                    //  TempArr[index].studentMark = text;
                    //  this.setState({GetCamSubjectStudentForEntry: TempArr});
                  } else if (text <= 100 && text >= 0) {
                    TempArr[index].studentMark = text;
                    this.setState({GetCamSubjectStudentForEntry: TempArr});
                  } else {
                    Toast.show('Enter Valid Number', ToastData);
                    TempArr[index].studentMark = '';
                    this.setState({GetCamSubjectStudentForEntry: TempArr});
                  }
                }}
                value={
                  TempArr[index].studentMark == '-1' ||
                  TempArr[index].studentMark == 'AAA'
                    ? 'A'
                    : TempArr[index].studentMark
                }
                blurOnSubmit={true}
                //autoFocus={true}
                maxLength={3}
                keyboardType="numbers-and-punctuation"
                returnKeyType="done"
              />
            </View>
          </View>
        </View>

        <View
          style={{
            width: '100%',
            //height: 35,
            alignSelf: 'center',
            borderRadius: 10,
            marginBottom: 10,
            justifyContent: 'center',
            alignItems: 'flex-end',
            marginRight: 25,
            //backgroundColor: 'silver',
            //index % 2 == 0 && index % 3 != 0
            //  ? '#7260E9'
            //  : index % 3 == 0
            //  ? '#23C4D7'
            //  : '#6397F2',
          }}>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: 'Poppins-Regular',
              color:
                TempArr[index].studentMark == -1 ||
                TempArr[index].studentMark == 'AAA'
                  ? 'red'
                  : item.camLock == 0
                  ? this.state.ColorCode
                  : a > b
                  ? 'silver'
                  : 'black',
              //textTransform: 'capitalize',
              fontWeight: '600',
              paddingLeft: 10,
              fontSize: ResponsiveSize(config.AppAllTextSize),
              //textAlign: 'center',
              lineHeight: 25,
            }}>
            {item.batchYear +
              (item.semester ? ' - ' : '') +
              item.semester +
              (item.sections ? ' - ' : '') +
              item.sections +
              (item.education ? ' - ' : '') +
              item.education +
              (item.degree ? ' - ' : '') +
              item.degree +
              (item.department ? ' (' : '') +
              item.department +
              (item.department ? ')' : '')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    return (
      <SafeAreaView>
        <Loader Loading={this.state.Loader} />
        <View
          style={[
            styles.SubjectMainContainer,
            {paddingBottom: 20, height: Dimensions.get('screen').height},
          ]}>
          <CustomHeader
            isHome={false}
            navigation={this.props.navigation}
            title="Internal Mark"
          />

          <View
            style={{
              width: '100%',
              height: '87%',
              paddingBottom: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                width: '98%',
                paddingTop: 10,
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                //flexWrap: 'wrap',
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
                <Checkbox
                  status={this.state.SNo ? 'checked' : 'unchecked'}
                  onPress={() => {
                    this.setState({SNo: !this.state.SNo});
                  }}
                  color={this.state.ColorCode}
                  uncheckedColor="silver"
                />
                <Text
                  style={{
                    color: this.state.SNo ? this.state.ColorCode : 'black',
                    fontFamily: 'Poppins-Regular',
                  }}>
                  S. No.
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.setState({RollNo: !this.state.RollNo});
                }}
                style={[
                  styles.CheckBoxContainer,
                  {
                    borderColor: 'silver',
                  },
                ]}>
                <Checkbox
                  status={this.state.RollNo ? 'checked' : 'unchecked'}
                  onPress={() => {
                    this.setState({RollNo: !this.state.RollNo});
                  }}
                  color={this.state.ColorCode}
                  uncheckedColor="silver"
                />
                <Text
                  style={{
                    color: this.state.RollNo ? this.state.ColorCode : 'black',
                    fontFamily: 'Poppins-Regular',
                  }}>
                  Roll No
                </Text>
              </TouchableOpacity>
              {/*<TouchableOpacity
                onPress={() => {
                  this.setState({RegNo: !this.state.RegNo});
                }}
                style={[
                  styles.CheckBoxContainer,
                  {
                    borderColor:'silver',
                  },
                ]}>
                <Checkbox
                  status={this.state.RegNo ? 'checked' : 'unchecked'}
                  onPress={() => {
                    this.setState({RegNo: !this.state.RegNo});
                  }}
                  color={this.state.ColorCode}
                  uncheckedColor="silver"
                />
                <Text
                  style={{
                    color: this.state.RegNo ? this.state.ColorCode : 'black',
                  }}>
                  Reg. No.
                </Text>
              </TouchableOpacity>*/}
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
                <Checkbox
                  status={this.state.Name ? 'checked' : 'unchecked'}
                  onPress={() => {
                    this.setState({Name: !this.state.Name});
                  }}
                  color={this.state.ColorCode}
                  uncheckedColor="silver"
                />
                <Text
                  style={{
                    color: this.state.Name ? this.state.ColorCode : 'black',
                    fontFamily: 'Poppins-Regular',
                  }}>
                  Name
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
                <Checkbox
                  status={this.state.Photo ? 'checked' : 'unchecked'}
                  onPress={() => {
                    this.setState({Photo: !this.state.Photo});
                  }}
                  color={this.state.ColorCode}
                  uncheckedColor="silver"
                />
                <Text
                  style={{
                    color: this.state.Photo ? this.state.ColorCode : 'black',
                    fontFamily: 'Poppins-Regular',
                  }}>
                  Photo
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.IndentityView}>
              <View
                style={[
                  styles.signals,
                  {backgroundColor: 'red', marginRight: 10},
                ]}></View>
              <Text numberOfLines={1} style={styles.IndentityViewText}>
                Enter A For Absent
              </Text>
            </View>
            {/*<TouchableOpacity
              style={{
                backgroundColor: this.state.ColorCode,
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
            </TouchableOpacity>*/}
            {this.state.GetCamSubjectStudentForEntry.length ? (
              <View
                style={{
                  width: '95%',
                  alignSelf: 'center',
                  //flexGrow: 1,
                  //height: '100%',
                  flex: 1,
                  marginVertical: 10,
                  backgroundColor: '#DEFCFF',
                  borderRadius: 10,
                  //paddingBottom: 20,
                  //marginBottom: 20,
                }}>
                <View
                  style={{
                    width: '100%',
                    alignSelf: 'center',
                    //height: 40,
                    paddingVertical: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    borderRadius: 10,
                    paddingHorizontal: 10,
                    backgroundColor: this.state.ColorCode,
                  }}
                  key={Math.random()}>
                  {this.state.SNo ? (
                    <View
                      style={{
                        width: '10%',
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
                        S.No.
                      </Text>
                    </View>
                  ) : null}

                  {this.state.Photo ? (
                    <View
                      style={{
                        width: '15%',
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
                  ) : null}
                  {this.state.RollNo ? (
                    <View
                      style={{
                        flex: 1,
                        //width: '25%',
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
                        Roll. No.
                      </Text>
                    </View>
                  ) : null}
                  {/*{this.state.RegNo ? (
                    <View
                      style={{
                        width: '20%',
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
                  ) : null}*/}
                  {this.state.Name ? (
                    <View
                      style={{
                        flex: 1,
                        //width: '30%',
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
                        S.Name
                      </Text>
                    </View>
                  ) : null}
                  <View
                    style={{
                      width: '20%',
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
                      Out of {this.state.MaxMarks}
                    </Text>
                  </View>
                </View>
                {this.state.GetCamSubjectStudentForEntry.length > 0 &&
                this.state.GetCamSubjectStudentForEntry.length > 0 ? (
                  <View
                    style={{
                      flex: 1,
                      width: '100%',
                      paddingBottom: 10,
                    }}>
                    <FlatList
                      data={this.state.GetCamSubjectStudentForEntry}
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
            ) : (
              !this.state.Loader && (
                <View
                  key={Math.random()}
                  duration={400}
                  style={[styles.header, {width: '95%', alignSelf: 'center'}]}
                  transition="backgroundColor">
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    No Data Available
                  </Text>
                </View>
              )
            )}
            {/*<View
              style={{
                //height: '10%',
                width: '100%',
                paddingVertical: 10,
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
              }}>*/}
            {this.state.GetCamSubjectStudentForEntry.length ? (
              <CustomButton
                title="Save"
                color={this.state.ColorCode}
                onPress={() => {
                  this.setState({Loader: true}, function () {
                    this.onPressAddOrUpdateCamEntiry();
                  });
                }}
              />
            ) : null}
            {/*</View>*/}
          </View>
        </View>
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
  AttendanceCustomDateTextView: {
    height: 60,
    width: '75%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    backgroundColor: 'white',
    elevation: 3,
    borderRadius: 10,
    shadowColor: 'silver',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.6,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  CheckBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
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
  },
  IndentityView: {
    width: '95%',
    alignSelf: 'center',
    //height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  signals: {
    width: 12,
    height: 12,
    borderRadius: 12,
    marginRight: 5,
  },
  IndentityViewText: {
    fontFamily: 'Poppins-Regular',
    fontWeight: '600',
  },
});
