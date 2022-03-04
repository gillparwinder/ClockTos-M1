// using static value in data2 because of error

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {ScrollView} from 'react-native';
import {BackHandler} from 'react-native';
import {Image} from 'react-native';
import ProgressCircle from 'react-native-progress-circle';
import {TouchableOpacity} from 'react-native';
import {SafeAreaView, StyleSheet} from 'react-native';
import {View, Text} from 'react-native';
import config from '../../config/config';
import {ProgressBar, Colors} from 'react-native-paper';
import {CustomHeader} from '../CustomHeader';
import * as Animatable from 'react-native-animatable';
import {Loader} from '../Loader';
import ResponsiveSize from '../../config/ResponsiveSize';
import {Checkbox} from 'react-native-paper';
import {Item, Picker, Thumbnail} from 'native-base';
import {CustomButton} from '../common/Button';
import {FlatList} from 'react-native';
import * as Progress from 'react-native-progress';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
import {ActivityIndicator} from 'react-native';
import {Chart} from '../common/Chart';
import {CustomProgress} from '../common/Progress';
import CustomFastImage from '../common/CustomFastImage';
const data = {
  //  labels: ['Swim', 'Bike', 'Run'], // optional
  data: [0.4, 0.6, 0.8],
};
const chartConfig = {
  backgroundColor: 'white',
  backgroundGradientFrom: '#1E2923',
  backgroundGradientTo: '#08130D',
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  style: {
    borderRadius: 16,
  },
};

let groups = {};
let group = {};
let groupedShifts = [];
let examNameWiseResult = [];
let examNameRecord = [];
let Namegroups = {};
let Namegroup = {};
let NamegroupedShifts = [];
let StudentNameWiseResult = [];

export default class MyPerformance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Loader: true,
      ShowSubjectIndex: [],
      ShowSubjectIndex2: [],
      InternalExam: [],
      Att: true,
      Internal1: true,
      Internal2: false,
      Internal3: false,
      Photo: true,
      Name: true,
      RollNo: true,
      Dashboard: true,
      Token: '',
      page: 0,
      posts: [],
      dataPosts: [],
      page2: 0,
      posts2: [],
      dataPosts2: [],
      Loader2: false,
      GetSubjectWiseBlockBox: {},
      GetSubjectWiseBlockBoxData: [],
      //titleHidden: this.props?.children || '',

      //GetSubjectWiseBlockBox: {
      //  count: 51,
      //  data: [
      //    {
      //      rollNo: 'SP19CMU001',
      //      regNo: 'SP19CMU001',
      //      studentName: 'Abhi M',
      //      subjectName: 'INDIAN ECONOMY',
      //      subjectCode: '216UBCT05',
      //      totalHour: '60',
      //      present: '20',
      //      absent: '0',
      //      attendancePercentage: '33.33',
      //      examName: 'Attendance',
      //      examDate: '02/04/2020',
      //      minimummark: '0',
      //      maximumMark: '5',
      //      studMark: 3,
      //      percentage: '60',
      //      studResult: 'Pass',
      //      attSubjectNo: '650',
      //      examSubjectNo: '64874',
      //    },
      //    {
      //      rollNo: 'SP19CMU001',
      //      regNo: 'SP19CMU001',
      //      studentName: 'Abhi M',
      //      subjectName: 'INDIAN ECONOMY',
      //      subjectCode: '216UBCT05',
      //      totalHour: '60',
      //      present: '20',
      //      absent: '0',
      //      attendancePercentage: '33.33',
      //      examName: 'CAE - 1',
      //      examDate: '27/01/2020',
      //      minimummark: '25',
      //      maximumMark: '50',
      //      studMark: 22,
      //      percentage: '44',
      //      studResult: 'Fail',
      //      attSubjectNo: '650',
      //      examSubjectNo: '64874',
      //    },
      //    {
      //      rollNo: 'SP19CMU001',
      //      regNo: 'SP19CMU001',
      //      studentName: 'Abhi M',
      //      subjectName: 'INDIAN ECONOMY',
      //      subjectCode: '216UBCT05',
      //      totalHour: '60',
      //      present: '20',
      //      absent: '0',
      //      attendancePercentage: '33.33',
      //      examName: 'CAE -2',
      //      examDate: '24/02/2020',
      //      minimummark: '25',
      //      maximumMark: '50',
      //      studMark: 55,
      //      percentage: '44',
      //      studResult: 'Fail',
      //      attSubjectNo: '650',
      //      examSubjectNo: '64874',
      //    },
      //    {
      //      rollNo: 'SP19CMU001',
      //      regNo: 'SP19CMU001',
      //      studentName: 'Abhi M',
      //      subjectName: 'INDIAN ECONOMY',
      //      subjectCode: '216UBCT05',
      //      totalHour: '60',
      //      present: '20',
      //      absent: '0',
      //      attendancePercentage: '33.33',
      //      examName: 'Model',
      //      examDate: '17/03/2020',
      //      minimummark: '50',
      //      maximumMark: '100',
      //      studMark: 50,
      //      percentage: '56.00000000000001',
      //      studResult: 'Pass',
      //      attSubjectNo: '650',
      //      examSubjectNo: '64874',
      //    },
      //    {
      //      rollNo: 'SP19CMU001',
      //      regNo: 'SP19CMU001',
      //      studentName: 'Abhi M',
      //      subjectName: 'INDIAN ECONOMY',
      //      subjectCode: '216UBCT05',
      //      totalHour: '60',
      //      present: '20',
      //      absent: '0',
      //      attendancePercentage: '33.33',
      //      examName: 'Seminars/Assignment',
      //      examDate: '02/04/2020',
      //      minimummark: '0',
      //      maximumMark: '5',
      //      studMark: 40,
      //      percentage: '80',
      //      studResult: 'Pass',
      //      attSubjectNo: '650',
      //      examSubjectNo: '64874',
      //    },
      //    {
      //      rollNo: 'SP19CMU003',
      //      regNo: 'SP19CMU003',
      //      studentName: 'Abishek.E',
      //      subjectName: 'INDIAN ECONOMY',
      //      subjectCode: '216UBCT05',
      //      totalHour: '60',
      //      present: '26',
      //      absent: '0',
      //      attendancePercentage: '43.33',
      //      examName: 'Attendance',
      //      examDate: '02/04/2020',
      //      minimummark: '0',
      //      maximumMark: '5',
      //      studMark: 4,
      //      percentage: '40',
      //      studResult: 'Pass',
      //      attSubjectNo: '650',
      //      examSubjectNo: '64874',
      //    },
      //    {
      //      rollNo: 'SP19CMU003',
      //      regNo: 'SP19CMU003',
      //      studentName: 'Abishek.E',
      //      subjectName: 'INDIAN ECONOMY',
      //      subjectCode: '216UBCT05',
      //      totalHour: '60',
      //      present: '26',
      //      absent: '0',
      //      attendancePercentage: '43.33',
      //      examName: 'CAE - 1',
      //      examDate: '27/01/2020',
      //      minimummark: '25',
      //      maximumMark: '50',
      //      studMark: 2,
      //      percentage: '82',
      //      studResult: 'Pass',
      //      attSubjectNo: '650',
      //      examSubjectNo: '64874',
      //    },
      //    {
      //      rollNo: 'SP19CMU003',
      //      regNo: 'SP19CMU003',
      //      studentName: 'Abishek.E',
      //      subjectName: 'INDIAN ECONOMY',
      //      subjectCode: '216UBCT05',
      //      totalHour: '60',
      //      present: '26',
      //      absent: '0',
      //      attendancePercentage: '43.33',
      //      examName: 'CAE -2',
      //      examDate: '24/02/2020',
      //      minimummark: '25',
      //      maximumMark: '50',
      //      studMark: 43,
      //      percentage: '74',
      //      studResult: 'Pass',
      //      attSubjectNo: '650',
      //      examSubjectNo: '64874',
      //    },
      //    {
      //      rollNo: 'SP19CMU003',
      //      regNo: 'SP19CMU003',
      //      studentName: 'Abishek.E',
      //      subjectName: 'INDIAN ECONOMY',
      //      subjectCode: '216UBCT05',
      //      totalHour: '60',
      //      present: '26',
      //      absent: '0',
      //      attendancePercentage: '43.33',
      //      examName: 'Model',
      //      examDate: '17/03/2020',
      //      minimummark: '50',
      //      maximumMark: '100',
      //      studMark: 45,
      //      percentage: '89',
      //      studResult: 'Pass',
      //      attSubjectNo: '650',
      //      examSubjectNo: '64874',
      //    },
      //  ],
      //},

      SubjectList: [],
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
      loader: false,
    });
  };
  onScrollHandler = () => {
    this.setState(
      {
        loader: true,
        page: this.state.page + 1,
      },
      () => {
        //console.log('hit');
        this.addRecords(this.state.page);
      },
    );
  };
  addRecords2 = (page) => {
    // assuming this.state.dataPosts hold all the records
    const newRecords = [];
    for (
      var i = page * 2, il = i + 2;
      i < il && i < this.state.dataPosts2.length;
      i++
    ) {
      newRecords.push(this.state.dataPosts2[i]);
    }
    this.setState({
      posts2: [...this.state.posts2, ...newRecords],
      loader: false,
    });
  };
  onScrollHandler2 = () => {
    this.setState(
      {
        loader: true,
        page2: this.state.page2 + 1,
      },
      () => {
        //console.log('hit');
        this.addRecords2(this.state.page2);
      },
    );
  };

  componentDidMount() {
    //alert(JSON.stringify(this.props));
    this.retrieveData();
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
  }
  componentWillUnmount() {
    this.backHandler.remove();
    //data2 = [];
    //range40 = [];
    //range50 = [];
    //range65 = [];
    //range75 = [];
    //range90 = [];
    //range100 = [];
  }
  groupByHelper = (xs, key) => {
    //console.log('hit groupByHelper');
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };
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
          this.onLoadGetSubjectList();
        });
      }
    } catch (error) {
      alert('Error retrieving data');
    }
    try {
      const value = await AsyncStorage.getItem('rollNo');
      if (value !== null) {
        //alert(value);
        this.setState({rollNo: value.toString()}, function () {});
      }
    } catch (error) {
      alert('Error retrieving data');
    }
    try {
      const value = await AsyncStorage.getItem('sem');
      if (value !== null) {
        //alert(value);
        this.setState({sem: parseInt(value)}, function () {});
      }
    } catch (error) {
      alert('Error retrieving data');
    }
  };

  onLoadGetSubjectWiseBlockBox = (
    batchYear,
    degreeCode,
    semester,
    sections,
    subjectCode,
  ) => {
    groups = {};
    group = {};
    groupedShifts = [];
    examNameWiseResult = [];
    examNameRecord = [];
    Namegroups = {};
    Namegroup = {};
    NamegroupedShifts = [];
    StudentNameWiseResult = [];
    this.setState({Loader2: true});
    const url = config.baseUrl2 + 'dashboard/GetSubjectWiseBlockBox';
    console.log(url);
    console.log(
      JSON.stringify({
        batchYear: batchYear.toString(),
        degreeCode: degreeCode.toString(),
        sem: semester.toString(),
        sec: sections.toString(),
        subjectCode: subjectCode.toString(),
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
        //batchYear: '2017',
        //degreeCode: '36',
        //sem: '6',
        //sec: '',
        //subjectCode: '613EET01',

        batchYear: batchYear.toString(),
        degreeCode: degreeCode.toString(),
        sem: semester.toString(),
        sec: sections.toString(),
        subjectCode: subjectCode.toString(),
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('GetSubjectWiseBlockBox = ' + JSON.stringify(responseJson));
        if (responseJson) {
          this.setState(
            {
              Loader: false,
              GetSubjectWiseBlockBox: responseJson,
              GetSubjectWiseBlockBoxData: responseJson
                ? responseJson.data.length
                  ? responseJson.data
                  : []
                : [],
              StudentCount: responseJson.count ? responseJson.count : 1,
            },
            function () {
              this.setState(
                {
                  page2: 0,
                  InternalExam: [],

                  dataPosts2: responseJson
                    ? responseJson.data.length
                      ? responseJson.data
                      : []
                    : [],
                },
                function () {
                  // call the function to pull initial 12 records
                  this.addRecords2(0);
                },
              );
              function groupBy(array, f) {
                //let groups = {};
                array.forEach((o) => {
                  group = JSON.stringify(f(o));

                  groups[group] = groups[group] || [];
                  groups[group].push(o);
                });
                ////console.log(groups)
                return Object.keys(groups).map((group) => groups[group]);
              }

              groupedShifts = groupBy(
                this.state.GetSubjectWiseBlockBoxData,
                (o) => [o.examName],
              );
              ////console.log('group', groupedShifts)

              groupedShifts.forEach((element) => {
                element.forEach((item) => {
                  if (
                    examNameWiseResult.findIndex(
                      (x) => x.examName === item.examName,
                    ) > -1
                  ) {
                    examNameRecord = examNameWiseResult.find(
                      (x) => x.examName === item.examName,
                    );
                    if (examNameRecord) examNameRecord.data.push(item);
                  } else {
                    examNameWiseResult.push({
                      examName: item.examName,
                      data: [item],
                    });
                  }
                });
              });

              //console.log(
              //  'examNameWiseResult=',
              //  JSON.stringify(examNameWiseResult, null, 4),
              //);

              function groupByName(array, f) {
                Namegroups = {};
                array.forEach((o) => {
                  Namegroup = JSON.stringify(f(o));

                  Namegroups[Namegroup] = Namegroups[Namegroup] || [];
                  Namegroups[Namegroup].push(o);
                });
                ////console.log(groups)
                return Object.keys(Namegroups).map(
                  (Namegroup) => Namegroups[Namegroup],
                );
              }

              NamegroupedShifts = groupByName(
                this.state.GetSubjectWiseBlockBoxData,
                (o) => [o.rollNo],
              );
              ////console.log('group', groupedShifts)

              NamegroupedShifts.forEach((element) => {
                element.forEach((item) => {
                  if (
                    StudentNameWiseResult.findIndex(
                      (x) => x.rollNo === item.rollNo,
                    ) > -1
                  ) {
                    StudentNameRecord = StudentNameWiseResult.find(
                      (x) => x.rollNo === item.rollNo,
                    );
                    if (StudentNameRecord)
                      StudentNameRecord.data.push(item.studMark);
                  } else {
                    StudentNameWiseResult.push({
                      rollNo: item.rollNo,
                      studentName: item.studentName,
                      attendancePercentage: item.attendancePercentage,
                      average: item.average,
                      data: [item.studMark],
                    });
                  }
                });
              });

              //console.log(
              //  'StudentNameWiseResult=',
              //  JSON.stringify(StudentNameWiseResult, null, 4),
              //);
              //let FinalExam = [];
              ////  alert(JSON.stringify(this.state.GetSubjectWiseBlockBox));
              //var grpData2 = this.groupByHelper(
              //  this.state.GetSubjectWiseBlockBoxData,
              //  'examName',
              //);
              ////console.log('grpData2 = ', grpData2);
              //Object.keys(grpData2).forEach(function (key) {
              //  FinalExam = grpData2[key];
              //});
              ////console.log('FinalExam ==', FinalExam);
              this.setState({Loader2: false});
              //console.log('loader2 false ');
            },
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
          //console.log(error);
          alert(error);
        });
      });
  };
  onLoadGetSubjectList = () => {
    const url = config.baseUrl2 + 'staff/SubjectList';
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
        console.log('SubjectList = ' + JSON.stringify(responseJson));
        if (responseJson) {
          this.setState(
            {Loader: false, SubjectList: responseJson},
            function () {
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
              //this.onLoadGetSubjectWiseBlockBox();
            },
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
        //this.onLoadGetSubjectWiseBlockBox();
        this.setState({Loader: false}, function () {
          console.log('SubjectList = ', error);
          alert(error);
        });
      });
  };

  renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          let ShowSubjectIndex = this.state.ShowSubjectIndex;
          //let ShowSubjectIndex2 = this.state.ShowSubjectIndex2;
          if (ShowSubjectIndex.indexOf(item) > -1) {
            ShowSubjectIndex.splice(ShowSubjectIndex.indexOf(item), 1);
            this.setState({ShowSubjectIndex});
          } else {
            ShowSubjectIndex.push(item);
            //ShowSubjectIndex2.push(item);
            this.setState({ShowSubjectIndex});
            //if (ShowSubjectIndex2.indexOf(item) > -1) {
            //  //console.log('Already have data');
            //} else {
            this.onLoadGetSubjectWiseBlockBox(
              item.batchYear,
              item.degreeCode,
              item.semester,
              item.sections,
              item.subjectCode,
            );
            //}
          }
        }}
        style={{
          width: '98%',
          alignSelf: 'center',
          justifyContent: 'center',
          borderRadius: 10,
          padding: 5,
          marginBottom: 10,
          borderWidth: 0.5,
          borderColor: '#5182E9',
          backgroundColor:
            this.state.ShowSubjectIndex.indexOf(item) > -1
              ? '#E1EFF9'
              : 'transparent',
        }}>
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
            fontSize: ResponsiveSize(16),
            color: '#5182E9',
            padding: 10,
            fontWeight: 'bold',
          }}>
          {item.subjectName}
        </Text>
        <View
          style={{
            width: '97%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{width: '80%', justifyContent: 'center'}}>
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                fontSize: ResponsiveSize(config.AppAllTextSize),
                color: '#5182E9',
                padding: 10,
              }}>
              {item.batchYear +
                (item.course ? '-' : '') +
                item.course +
                (item.department ? '(' + item.department + ')' : '') +
                (item.semester ? '-Sem' : '') +
                item.semester +
                (item.sections ? '-Sec' : '') +
                item.sections}
              {/*202-BE(CSC)-Sem 4-Sec A*/}
            </Text>
          </View>
          {Object.keys(this.state.GetSubjectWiseBlockBox).length ? (
            <View style={{width: '20%', justifyContent: 'center'}}>
              <View
                style={{
                  width: 80,
                  height: 40,
                  borderRadius: 10,
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                  backgroundColor: '#BBE5E9',
                  flexDirection: 'row',
                }}>
                <CustomFastImage
                  resizeMode={'contain'}
                  style={{width: 20, height: 20}}
                  source={require('../../assets/library.png')}
                />
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    fontSize: ResponsiveSize(config.AppAllTextSize),
                    color: '#1D9EAD',
                    alignSelf: 'center',
                  }}>
                  {
                    Object.keys(this.state.GetSubjectWiseBlockBox).length ? (
                      //console.log('length for count'),
                      this.state.GetSubjectWiseBlockBox.count ? (
                        //console.log('count'),
                        this.state.GetSubjectWiseBlockBox.count
                      ) : (
                        ''
                      )
                    ) : (
                      <View
                        style={{
                          paddingTop: 7,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <ActivityIndicator size="small" color="gray" />
                      </View>
                    )
                    //  null
                  }
                </Text>
              </View>
            </View>
          ) : null}
        </View>
        {this.state.ShowSubjectIndex.indexOf(item) > -1 ? (
          !this.state.Loader2 &&
          !this.state.ShowSubjectIndex.indexOf(item) > -1 ? (
            <View style={{width: '100%'}}>
              <FlatList
                data={examNameWiseResult}
                keyExtractor={(item, index) => index.toString()}
                renderItem={this.renderMapFunction}
              />
              {/*<View style={{marginVertical: 10, width: '100%'}}>
                <CustomButton
                  width={'50%'}
                  color={'#5182E9'}
                  title={'View More'}
                  onPress={() => {
                    this.onScrollHandler2();
                  }}
                />
              </View>*/}
            </View>
          ) : (
            <View>
              {/*<Text style={{textAlign: 'center', alignSelf: 'center'}}>
              Fetching data Please wait...
            </Text>*/}
              <ActivityIndicator size="small" color="gray" />
            </View>
          )
        ) : null}
        {/*</TouchableOpacity>
             //</ScrollView>
          //  !this.state.Loader ? (
          //    <Text
          //      numberOfLines={2}
          //      style={{
          //        fontFamily: 'Poppins-Regular',
          //        fontSize: ResponsiveSize(config.AppAllTextSize),
          //        color: '#5182E9',
          //      }}>
          //      No data available
          //    </Text>
          //  ) : null)
          //: (//console.log('exit loader2'), (<ActivityIndicator />))}*/}
      </TouchableOpacity>
    );
  };
  renderMapFunction = ({item, index}) => {
    let data2 = [];
    let range40 = [];
    let range50 = [];
    let range65 = [];
    let range75 = [];
    let range90 = [];
    let range100 = [];
    var grpData = this.groupByHelper(item.data, 'studMark');

    Object.keys(grpData).forEach(function (key) {
      let nmbr = Number.parseInt(key);
      if (nmbr <= 40 && nmbr >= 0) {
        range40 = grpData[key];
      }
      ////console.log('range40 = ', range40);
      //alert(JSON.stringify(range40));
      if (nmbr > 40 && nmbr <= 50) {
        range50 = grpData[key];
      }
      ////console.log('range50 = ', range50);
      if (nmbr > 50 && nmbr <= 65) {
        range65 = grpData[key];
      }
      ////console.log('range65 = ', range65);
      if (nmbr > 65 && nmbr <= 75) {
        range75 = grpData[key];
      }
      ////console.log('range75 = ', range75);
      if (nmbr > 75 && nmbr <= 90) {
        range90 = grpData[key];
      }
      ////console.log('range90 = ', range90);
      if (nmbr > 90 && nmbr <= 100) {
        range100 = grpData[key];
      }

      ////console.log('range100 = ', range100);
    });

    data2.push(
      {data: 10, color: '#007AFF'},
      {data: 20, color: '#CB5B66'},
      {data: 30, color: '#627281'},
      {data: 40, color: '#F39800'},
      {data: 50, color: '#B033AB'},
      {
        data: 60,
        color: '#17B6FF',
      },
    );
    //data2.push(
    //  {data: range40.length, color: '#007AFF'},
    //  {data: range50.length, color: '#CB5B66'},
    //  {data: range65.length, color: '#627281'},
    //  {data: range75.length, color: '#F39800'},
    //  {data: range90.length, color: '#B033AB'},
    //  {
    //    data: range100.length,
    //    color: '#17B6FF',
    //  },
    //);
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          this.props.navigation.navigate('Performance', {
            //  chartType: index % 2 ? 'progress' : 'pie',
            chartType: 'pie',
            data: item.examName,
            filterredDataBelow40: range40,
            filterredDataBelow50: range50,
            filterredDataBelow65: range65,
            filterredDataBelow75: range75,
            filterredDataBelow90: range90,
            filterredDataBelow100: range100,
            StudentCount: this.state.StudentCount,
          });
        }}
        style={{
          width: '100%',
          alignSelf: 'center',
          borderColor: 'gray',
          justifyContent: 'center',
          borderRadius: 15,
          borderWidth: 0.5,
          marginTop: 15,
          paddingHorizontal: 10,
        }}>
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
            fontSize: ResponsiveSize(config.AppAllHeaderSize),
            color: '#5182E9',
            paddingHorizontal: 20,
            paddingTop: 10,
            fontWeight: 'bold',
            alignSelf: index % 2 ? 'flex-start' : 'flex-end',
          }}>
          {item.examName}
        </Text>
        <View
          style={{
            width: '100%',
            flexDirection: index % 2 ? 'row' : 'row-reverse',
            alignItems: 'center',
            marginVertical: 20,
          }}>
          <View
            style={{
              width: '40%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {/*<CustomFastImage
                                    resizeMode={'contain'}
                        style={{
                          width: 100,
                          height: 100,
                        }}
                        source={require('../../assets/graph.png')}
                      />*/}
            {/*{index % 2 ? (
            <ProgressChart
              data={data}
              count={6}
              width={150}
              height={150}
              strokeWidth={5}
              radius={35}
              backgroundColor={'transparent'}
              chartConfig={chartConfig}
              hideLegend={true}
            />
            ) : (*/}
            <Chart
              data={data2}
              width={150}
              height={150}
              chartConfig={chartConfig}
              //accessor={'population'}
              accessor={'data'}
              backgroundColor={'transparent'}
              paddingLeft={'35'}
              hasLegend={false}
              center={[10, 10]}
            />
            {/*)}*/}
          </View>
          <View
            style={{
              width: '60%',
              justifyContent: 'center',
            }}>
            <View style={styles.numberRangeView}>
              <View style={styles.rangeTextView}>
                <Text>00 - 40</Text>
              </View>
              <View
                style={[
                  styles.colorView,
                  //{backgroundColor: '#007AFF'},
                ]}>
                <CustomProgress
                  color={'#007AFF'}
                  progress={range40.length / this.state.StudentCount}
                  width={95}
                  count={range40.length}
                />
              </View>
              <View></View>
            </View>
            <View style={styles.numberRangeView}>
              <View style={styles.rangeTextView}>
                <Text>41 - 50</Text>
              </View>
              <View
                style={[
                  styles.colorView,
                  //{backgroundColor: '#CB5B66'},
                ]}>
                <CustomProgress
                  progress={range50.length / this.state.StudentCount}
                  width={95}
                  count={range50.length}
                  color={'#CB5B66'}
                />
              </View>
              <View></View>
            </View>
            <View style={styles.numberRangeView}>
              <View style={styles.rangeTextView}>
                <Text>51 - 65</Text>
              </View>
              <View
                style={[
                  styles.colorView,
                  //{backgroundColor: '#627281'},
                ]}>
                <CustomProgress
                  progress={range65.length / this.state.StudentCount}
                  width={95}
                  count={range65.length}
                  color={'#627281'}
                />
              </View>
              <View></View>
            </View>
            <View style={styles.numberRangeView}>
              <View style={styles.rangeTextView}>
                <Text>66 - 75</Text>
              </View>
              <View
                style={[
                  styles.colorView,
                  //{backgroundColor: '#F39800'},
                ]}>
                <CustomProgress
                  progress={range75.length / this.state.StudentCount}
                  color={'#F39800'}
                  width={95}
                  count={range75.length}
                />
              </View>
              <View></View>
            </View>
            <View style={styles.numberRangeView}>
              <View style={styles.rangeTextView}>
                <Text>76 - 90</Text>
              </View>
              <View
                style={[
                  styles.colorView,
                  //{backgroundColor: '#B033AB'},
                ]}>
                <CustomProgress
                  progress={range90.length / this.state.StudentCount}
                  color={'#B033AB'}
                  width={95}
                  count={range90.length}
                />
              </View>
              <View></View>
            </View>
            <View style={styles.numberRangeView}>
              <View style={styles.rangeTextView}>
                <Text>91 - 100</Text>
              </View>
              <View
                style={[
                  styles.colorView,
                  //{backgroundColor: '#17B6FF'},
                ]}>
                <CustomProgress
                  progress={range100.length / this.state.StudentCount}
                  //progress={filterredDataBelow100.length}
                  color={'#17B6FF'}
                  width={95}
                  count={range100.length}
                />
              </View>
              <View></View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
    //}))
    //  ) : !this.state.Loader ? (
    //    <Text
    //      numberOfLines={2}
    //      style={{
    //        fontFamily: 'Poppins-Regular',
    //        fontSize: ResponsiveSize(config.AppAllTextSize),
    //        color: '#5182E9',
    //      }}>
    //      No data available
    //    </Text>
    //  ) : null
    //) : (
    //  <ActivityIndicator />
    //)
    //null
    //  }
  };
  renderItem2 = ({item, index}) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            if (this.state.TempIndex == index) {
              this.setState({TempIndex: -1});
            } else {
              this.setState({TempIndex: index});
            }
          }}
          style={{
            width: '98%',
            alignSelf: 'center',
            //justifyContent: 'center',
            paddingBottom: 20,
            borderRadius: 10,
            borderWidth: 0.5,
            marginBottom: 15,
            borderColor: '#5182E9',
            //backgroundColor: 'red',
          }}>
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              height: 140,
              marginTop: 5,
            }}>
            <CustomFastImage
              resizeMode={'stretch'}
              style={{
                width: '105%',
                alignSelf: 'center',
                height: '120%',
                position: 'absolute',
              }}
              source={require('../../assets/blueBg12.png')}
            />
            <View
              style={{
                width: '95%',
                alignSelf: 'center',
                height: 140,
                justifyContent: 'space-evenly',
                //  backgroundColor: 'red',
                padding: 20,
              }}>
              <Text
                numberOfLines={2}
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontSize: ResponsiveSize(config.AppAllHeaderSize),
                  color: '#5182E9',
                  fontWeight: 'bold',
                }}>
                {item.subjectName}
              </Text>
              <Text
                numberOfLines={2}
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontSize: ResponsiveSize(config.AppAllTextSize),
                  color: '#5182E9',
                }}>
                {/*2020-BE(CSC)-Sem 4-Sec A (pending)*/}
                {item.batchYear +
                  (item.course ? '-' : '') +
                  item.course +
                  (item.department ? '(' + item.department + ')' : '') +
                  (item.semester ? '-Sem' : '') +
                  item.semester +
                  (item.sections ? '-Sec' : '') +
                  item.sections}
              </Text>
            </View>
          </View>

          {this.state.TempIndex == index ? (
            <View
              style={{
                width: '100%',
                marginVertical: 20,
                //  paddingVertical: 20,
                //  alignItems: 'flex-start',
              }}>
              <View
                style={{
                  width: '95%',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignSelf: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({Photo: !this.state.Photo});
                  }}
                  style={[styles.CheckBoxContainer]}>
                  <Checkbox
                    status={this.state.Photo ? 'checked' : 'unchecked'}
                    onPress={() => {
                      this.setState({Photo: !this.state.Photo});
                    }}
                    color={'#5182E9'}
                    uncheckedColor="silver"
                  />
                  <Text
                    style={{
                      color: this.state.Photo ? '#5182E9' : 'black',
                    }}>
                    Photo
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({RollNo: !this.state.RollNo});
                  }}
                  style={[styles.CheckBoxContainer]}>
                  <Checkbox
                    status={this.state.RollNo ? 'checked' : 'unchecked'}
                    onPress={() => {
                      this.setState({RollNo: !this.state.RollNo});
                    }}
                    color={'#5182E9'}
                    uncheckedColor="silver"
                  />
                  <Text
                    style={{
                      color: this.state.RollNo ? '#5182E9' : 'black',
                    }}>
                    Roll No
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    this.setState({Name: !this.state.Name});
                  }}
                  style={[styles.CheckBoxContainer]}>
                  <Checkbox
                    status={this.state.Name ? 'checked' : 'unchecked'}
                    onPress={() => {
                      this.setState({Name: !this.state.Name});
                    }}
                    color={'#5182E9'}
                    uncheckedColor="silver"
                  />
                  <Text
                    style={{
                      color: this.state.Name ? '#5182E9' : 'black',
                    }}>
                    Name
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({Att: !this.state.Att});
                  }}
                  style={[styles.CheckBoxContainer]}>
                  <Checkbox
                    status={this.state.Att ? 'checked' : 'unchecked'}
                    onPress={() => {
                      this.setState({Att: !this.state.Att});
                    }}
                    color={'#5182E9'}
                    uncheckedColor="silver"
                  />
                  <Text
                    style={{
                      color: this.state.Att ? '#5182E9' : 'black',
                    }}>
                    Att
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({Average: !this.state.Average});
                  }}
                  style={[styles.CheckBoxContainer]}>
                  <Checkbox
                    status={this.state.Average ? 'checked' : 'unchecked'}
                    onPress={() => {
                      this.setState({Average: !this.state.Average});
                    }}
                    color={'#5182E9'}
                    uncheckedColor="silver"
                  />
                  <Text
                    style={{
                      color: this.state.Att ? '#5182E9' : 'black',
                    }}>
                    Avg
                  </Text>
                </TouchableOpacity>
                {StudentNameWiseResult[0].data.map((item2, index2) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        let InternalExam = this.state.InternalExam;
                        if (InternalExam.indexOf(index2) > -1) {
                          InternalExam.splice(InternalExam.indexOf(index2), 1);
                          this.setState({InternalExam});
                        } else {
                          InternalExam.push(index2);
                          this.setState({InternalExam});
                        }
                      }}
                      style={[styles.CheckBoxContainer]}>
                      <Checkbox
                        status={
                          this.state.InternalExam.indexOf(index2) > -1
                            ? 'checked'
                            : 'unchecked'
                        }
                        onPress={() => {
                          let InternalExam = this.state.InternalExam;
                          if (InternalExam.indexOf(index2) > -1) {
                            InternalExam.splice(
                              InternalExam.indexOf(index2),
                              1,
                            );
                            this.setState({InternalExam});
                          } else {
                            InternalExam.push(index2);
                            this.setState({InternalExam});
                          }
                        }}
                        color={'#5182E9'}
                        uncheckedColor="silver"
                      />
                      <Text
                        style={{
                          color:
                            this.state.InternalExam.indexOf(index2) > -1
                              ? '#5182E9'
                              : 'black',
                        }}>
                        Internal - {index2 + 1}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {this.state.GetSubjectWiseBlockBoxData.length ? (
                <View
                  style={{
                    width: '90%',
                    alignSelf: 'center',
                    //flexGrow: 1,
                    //  height: '100%',
                    marginTop: 10,
                    backgroundColor: '#E0EAFB',
                    borderRadius: 10,
                    paddingBottom: 20,
                    marginBottom: 20,
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
                      backgroundColor: '#5182E9',
                    }}
                    key={Math.random()}>
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
                          //width: '20%',
                          flex: 1,
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

                    {this.state.Name ? (
                      <View
                        style={{
                          //width: '25%',
                          flex: 1,
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
                          Name
                        </Text>
                      </View>
                    ) : null}
                    {this.state.Att ? (
                      <View
                        style={{
                          //width: '10%',
                          flex: 1,
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
                          Att
                        </Text>
                      </View>
                    ) : null}
                    {this.state.Average ? (
                      <View
                        style={{
                          //width: '10%',
                          flex: 1,
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
                          Avg
                        </Text>
                      </View>
                    ) : null}

                    {StudentNameWiseResult[0].data.map((item2, index2) => {
                      return this.state.InternalExam.indexOf(index2) > -1 ? (
                        <View
                          style={{
                            //width: '10%',
                            flex: 1,
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
                            IT-{index2 + 1}
                          </Text>
                        </View>
                      ) : null;
                    })}

                    {/*{this.state.Internal2 ? (
                      <View
                        style={{
                          //width: '10%',
                          flex: 1,
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
                          IT-2
                        </Text>
                      </View>
                    ) : null}
                    {this.state.Internal3 ? (
                      <View
                        style={{
                          //width: '10%',
                          flex: 1,
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
                          IT-3
                        </Text>
                      </View>
                    ) : null}*/}
                  </View>
                  {StudentNameWiseResult.length ? (
                    //  <View
                    //    style={{
                    //      width: '100%',
                    //      paddingBottom: 10,
                    //    }}>
                    <FlatList
                      data={StudentNameWiseResult}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={this.renderItem3}
                      maxToRenderPerBatch={5}
                    />
                  ) : //  </View>
                  !this.state.Loader ? (
                    <View
                      key={Math.random()}
                      duration={400}
                      style={[
                        styles.header,
                        {width: '95%', alignSelf: 'center'},
                      ]}
                      transition="backgroundColor">
                      <Text
                        style={[styles.headerText, {textTransform: 'none'}]}>
                        No data available
                      </Text>
                    </View>
                  ) : null}
                </View>
              ) : !this.state.Loader ? (
                <View
                  key={Math.random()}
                  duration={400}
                  style={[styles.header, {width: '95%', alignSelf: 'center'}]}
                  transition="backgroundColor">
                  <Text style={[styles.headerText, {textTransform: 'none'}]}>
                    No Data Available
                  </Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </TouchableOpacity>
      </View>
    );
  };
  renderItem3 = ({item, index}) => {
    return (
      <TouchableOpacity
        disabled
        activeOpacity={1}
        style={{
          width: '95%',
          alignSelf: 'center',
          height: 50,
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginVertical: 8,
          marginTop: 5,
          alignItems: 'center',
          borderRadius: 10,
          backgroundColor: index % 2 ? 'white' : '#E0EAFB',
        }}>
        {this.state.Photo ? (
          <View
            style={{
              width: '15%',
              //flex: 1,
              //height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              //  paddingHorizontal: 10,
            }}>
            {/*{item.photo ? (
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
            ) : (*/}
            <CustomFastImage
              resizeMode={'cover'}
              style={{
                width: 30,
                height: 30,
                borderRadius: 30,
              }}
              source={require('../../assets/avatar.png')}
            />
            {/*)}*/}
          </View>
        ) : null}
        {this.state.RollNo ? (
          <View
            style={{
              //width: '20%',
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
                color: '#5182E9',
              }}>
              {/*{item.registrationNo}*/} {item.rollNo}
            </Text>
          </View>
        ) : null}

        {this.state.Name ? (
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
                color: '#5182E9',
              }}>
              {item.studentName}
            </Text>
          </View>
        ) : null}
        {this.state.Att ? (
          <View
            style={{
              //width: '10%',
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
                color: '#5182E9',
              }}>
              {parseInt(item.attendancePercentage).toFixed(1)}
            </Text>
          </View>
        ) : null}
        {this.state.Average ? (
          <View
            style={{
              //width: '10%',
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
                color: '#5182E9',
              }}>
              {parseInt(item.average).toFixed(1)}
            </Text>
          </View>
        ) : null}

        {item.data.map((item2, index2) => {
          return this.state.InternalExam.indexOf(index2) > -1 ? (
            <View
              style={{
                //width: '10%',
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
                  color: '#5182E9',
                }}>
                {/*{item.registrationNo}*/} {parseInt(item2).toFixed(1)}
              </Text>
            </View>
          ) : null;
        })}
        {/*{this.state.Internal2 ? (
          <View
            style={{
              //width: '10%',
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
                color: '#5182E9',
              }}>
              {item.test2}
            </Text>
          </View>
        ) : null}
        {this.state.Internal3 ? (
          <View
            style={{
              //width: '10%',
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
                color: '#5182E9',
              }}>
              {item.test2}
            </Text>
          </View>
        ) : null}*/}
      </TouchableOpacity>
    );
  };
  render() {
    return (
      <SafeAreaView
        style={{width: '100%', height: '100%', backgroundColor: 'white'}}>
        <Loader
          Loading={this.state.Loader ? true : false}
          onPressCancel={() => {
            this.setState({Loader: false});
          }}
        />
        {this.props?.children == 'MyPerformance' ? null : (
          <CustomHeader
            isHome={false}
            title={'My Performance'}
            navigation={this.props.navigation}
          />
        )}
        <View style={styles.SubjectMainContainer}>
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
              borderColor: '#5182E9',
            }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({Dashboard: true});
              }}
              style={{
                width: '50%',
                //height: '95%',
                marginLeft: 2,
                paddingVertical: 10,
                backgroundColor: this.state.Dashboard
                  ? '#5182E9'
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
                    color: !this.state.Dashboard ? '#5182E9' : 'white',
                  },
                ]}>
                Dashboard
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({Dashboard: false});
              }}
              style={{
                width: '50%',
                //height: '95%',
                marginRight: 2,
                paddingVertical: 10,
                backgroundColor: !this.state.Dashboard
                  ? '#5182E9'
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
                    color: this.state.Dashboard ? '#5182E9' : 'white',
                  },
                ]}>
                Details
              </Text>
            </TouchableOpacity>
          </View>
          {this.state.Dashboard && this.state.SubjectList.length ? (
            <FlatList
              data={this.state.SubjectList}
              extraData={this.state}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderItem}
            />
          ) : this.state.GetSubjectWiseBlockBoxData.length ? (
            <FlatList
              data={this.state.SubjectList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderItem2}
            />
          ) : !this.state.Loader2 && !this.state.Loader ? (
            <View
              key={Math.random()}
              duration={400}
              style={[styles.header, {width: '95%', alignSelf: 'center'}]}
              transition="backgroundColor">
              <Text
                style={[
                  styles.headerText,
                  {textTransform: 'none', paddingLeft: 10},
                ]}>
                No data available
              </Text>
            </View>
          ) : !this.state.Dashboard ? (
            <ActivityIndicator size="small" color="gray" />
          ) : null}
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  SubjectMainContainer: {
    width: '100%',
    //height: '90%',
    flex: 1,
    paddingBottom: 10,
  },
  FeedbackView: {
    width: '95%',
    alignSelf: 'center',
    //height: 190,
    justifyContent: 'space-evenly',
    borderRadius: 15,
    paddingVertical: 20,
  },
  MainTitle: {
    fontFamily: 'Poppins-Regular',
    color: 'white',
    fontWeight: 'bold',
    fontSize: ResponsiveSize(config.AppAllSubTitle),
  },
  partition: {
    width: '22%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRightWidth: 0.5,
    marginVertical: 10,
    borderColor: 'gray',
  },
  item: {
    borderRadius: 5,
    backgroundColor: '#f2f2f2',
    width: 150,
    height: 45,
    borderColor: '#8075EA',
    borderWidth: 1,
  },
  rangeView: {
    width: '100%',
    height: 300,
    backgroundColor: '#1D35A2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rangeView2: {
    width: '100%',
    //height: 200,
    marginBottom: 20,
    backgroundColor: 'white',
    marginTop: -20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  numberRangeView: {
    width: '100%',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  rangeTextView: {width: '35%'},
  colorView: {
    width: '65%',
    height: 15,
    borderRadius: 10,
    //paddingHorizontal: 20,
  },
  selectionTextStyle: {
    fontFamily: 'Poppins-Regular',
    fontWeight: '600',
    lineHeight: 25,
  },
  progressStyle: {
    height: 10,
    borderRadius: 10,
    backgroundColor: 'silver',
  },
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

  CheckBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderRadius: 5,
    height: 30,
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
});
