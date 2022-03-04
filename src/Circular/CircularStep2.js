import React, {Component} from 'react';
import {StyleSheet, Text, View, BackHandler} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CustomHeader} from '../components/CustomHeader';
import {Loader} from '../components/Loader';
import {Checkbox} from 'react-native-paper';
import {CustomButton} from '../components/common/Button';
import {SafeAreaView} from 'react-native';
import {ScrollView} from 'react-native';
import config from '../config/config';
import {TouchableOpacity} from 'react-native';
import Toast from 'react-native-tiny-toast';
import DeviceInfo from 'react-native-device-info';
import {AnimatedCheckBox} from '../components/common/AnimatedCheckBox';
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};
const Color1 = '#6397F2';
const Color2 = '#23C4D7';
export default class CircularStep2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      TempIndex: [],
      TempIndex2: [],
      TempIndex3: [],
      TempIndex4: [],
      TempIndex5: [],
      TempIndex6: [],
      dataSource: [],
      FinalStudentList: [],
      collegeCode: '',
      departmentIds: [],
      batchYearIds: [],
      degreeCodeIds: [],
      semIds: [],
      selectionIds: [],
      courseIds: [],
      eduIds: [],
      Loader: true,
      isLoading: true,
      text: '',
      bearer_token: '',
      error_message: '',
      DeviceToken: '',
    };
    this.arrayholder = [];
  }
  componentDidMount() {
    DeviceInfo.getAndroidId().then((androidId) => {
      //alert(androidId);
      this.setState({DeviceToken: androidId});
      // androidId here
    });
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
      const value = await AsyncStorage.getItem('collegeCode');
      if (value !== null) {
        let collegeCode = [];
        collegeCode.push(value);
        ////console.log(value);
        this.setState({collegeCode}, function () {
          //this.getData(bearer_token);
        });
      }
    } catch (error) {
      alert('Error retrieving data');
    }
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        //console.log(value);
        this.setState(
          {
            Token: value,
          },
          function () {
            this.getAllData();
          },
        );
      }
    } catch (error) {
      alert('Error retrieving data');
    }
  };
  getAllData = () => {
    //console.log('gettingData...');
    this.setState(
      {
        colleges: this.props.route.params
          ? this.props.route.params.collage
            ? this.props.route.params.collage
            : ''
          : '',
        batch: this.props.route.params
          ? this.props.route.params.batch
            ? this.props.route.params.batch
            : ''
          : '',
        eduLevel: this.props.route.params
          ? this.props.route.params.eduLevel
            ? this.props.route.params.eduLevel
            : ''
          : '',
        degree: this.props.route.params
          ? this.props.route.params.degree
            ? this.props.route.params.degree
            : ''
          : '',
        department: this.props.route.params
          ? this.props.route.params.department
            ? this.props.route.params.department
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
      },
      function () {
        //console.log(this.props.route.params);
        //console.log(this.state.collegeCode);
        //if (
        //  this.state.collegeCode &&
        //  this.state.department.length &&
        //  this.state.batch.length &&
        //  this.state.degree.length &&
        //  this.state.semester.length &&
        //  this.state.section.length &&
        //  this.state.colleges.length &&
        //  this.state.eduLevel.length
        //) {
        //console.log('Api calling...');
        this.GetStudenttFilterDataForECircular();
        //} else {
        //  Toast.show('All field required', ToastData);
        //}
      },
    );
  };
  GetStudenttFilterDataForECircular = () => {
    const url = config.baseUrl2 + 'staff/GetStudenttFilterDataForECircular';
    //console.log(url);
    ////console.log(
    //  'collegeCode = ',
    //  this.state.collegeCode,
    //  'departmentIds = ',
    //  this.state.department,
    //  'batchYearIds = ',
    //  this.state.batch,
    //  'degreeCodeIds = ',
    //  this.state.degree,
    //  'semIds = ',
    //  this.state.semester,
    //  'selectionIds = ',
    //  this.state.section,
    //  'courseIds = ',
    //  this.state.colleges,
    //  'eduIds = ',
    //  this.state.eduLevel,
    //);
    //console.log(
    //  JSON.stringify({
    //    collegeCode: this.state.collegeCode,
    //    departmentIds: this.state.degree,
    //    batchYearIds: this.state.batch,
    //    degreeCodeIds: this.state.department,
    //    semIds: this.state.semester,
    //    selectionIds: this.state.section,
    //    courseIds: [],
    //    eduIds: this.state.eduLevel,
    //    //mobileDeviceToken: this.state.DeviceToken,
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
        collegeCode: this.state.collegeCode,
        departmentIds: this.state.degree,
        batchYearIds: this.state.batch,
        degreeCodeIds: this.state.department,
        semIds: this.state.semester,
        selectionIds: this.state.section,
        courseIds: [],
        eduIds: this.state.eduLevel,
        //mobileDeviceToken: this.state.DeviceToken,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson) {
          ////console.log('responseJson.studentList ==', responseJson.studentList);
          //console.log('responseJson.response ==', responseJson);

          this.setState({
            dataSource: responseJson.response,
            Loader: false,
            studentList: responseJson.studentList,
            TempstudentList: responseJson.studentList,
          });
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
        //console.log('error==', error);
        this.setState({Loader: false}, function () {
          alert(error);
        });
      });
  };
  send = () => {
    if (this.state.FinalStudentList.length) {
      //console.log(
      //  'dataSource = ',
      //  JSON.stringify(this.state.dataSource),
      //  this.state.FinalStudentList,
      //  'studentList = ',
      //);
      this.props.navigation.navigate('CircularStep3', {
        data: this.state.dataSource,
        studentList: this.state.FinalStudentList,
      });
    } else {
      Toast.show('Nothing is selected yet!', ToastData);
    }
  };
  filterArr = (
    compareItem,
    filteredItem,
    batchYear,
    edu_level,
    course_name,
  ) => {
    //console.log(
    //  'compareItem = ',
    //  compareItem,
    //  ', filteredItem = ',
    //  filteredItem,
    //  'batchYear = ',
    //  batchYear,
    //  'edu_level = ',
    //  edu_level,
    //  'course_name = ',
    //  course_name,
    //);
    //const tempListItem = newArray[mainIndex].children[secondIndex].item;
    var tempList = this.state.studentList.filter(function (item) {
      if (filteredItem == 'batch_year') {
        return item.batch_year == compareItem;
      } else if (filteredItem == 'edu_level') {
        return item.edu_level == compareItem && item.batch_year == batchYear;
      } else if (filteredItem == 'dept_name') {
        return (
          item.course_name == compareItem &&
          item.batch_year == batchYear &&
          item.edu_level == edu_level
        );
      } else if (filteredItem == 'course_name') {
        return (
          item.dept_name == compareItem &&
          item.batch_year == batchYear &&
          item.edu_level == edu_level &&
          item.course_name == course_name
        );
      }
    });
    //console.log('tempList = ', tempList);
    let FinalStudentList = [...this.state.FinalStudentList];
    tempList.map((item) => {
      FinalStudentList.push(item);
    });
    this.setState({FinalStudentList}, () => {
      //console.log('FinalStudentList = ', this.state.FinalStudentList);
    });

    //this.setState({FinalStudentList: tempList}, function () {
    //});
  };
  RemoveFilterArr = (
    compareItem,
    filteredItem,
    batchYear,
    edu_level,
    course_name,
  ) => {
    //console.log(
    //  'compareItem = ',
    //  compareItem,
    //  ', filteredItem = ',
    //  filteredItem,
    //  'batchYear = ',
    //  batchYear,
    //  'edu_level = ',
    //  edu_level,
    //  'course_name = ',
    //  course_name,
    //);
    //const tempListItem = newArray[mainIndex].children[secondIndex].item;
    var FinalStudentList = this.state.FinalStudentList.filter(function (item) {
      if (filteredItem == 'batch_year') {
        return item.batch_year != compareItem;
      } else if (filteredItem == 'edu_level') {
        return item.edu_level != compareItem && item.batch_year != batchYear;
      } else if (filteredItem == 'dept_name') {
        return (
          item.course_name != compareItem &&
          item.batch_year != batchYear &&
          item.edu_level != edu_level
        );
      } else if (filteredItem == 'course_name') {
        return (
          item.dept_name != compareItem &&
          item.batch_year != batchYear &&
          item.edu_level != edu_level &&
          item.course_name != course_name
        );
      }
    });

    ////console.log('removeTempList = ', removeTempList);
    //let FinalStudentList = [...this.state.FinalStudentList];
    //removeTempList.map((item) => {
    //  FinalStudentList.push(item);
    //});
    this.setState({FinalStudentList}, () => {
      //console.log('FinalStudentList = ', this.state.FinalStudentList);
    });

    //tempList.map((item, index) => {
    //  //console.log('item = ', item);
    //  if (this.state.FinalStudentList.indexOf(item) > -1) {
    //    //console.log(
    //      'this.state.FinalStudentList.indexOf(item)>-1 = ',
    //      this.state.FinalStudentList.indexOf(item) > -1,
    //    );
    //    tempList2.splice(item, 1);
    //    var tempList2 = this.state.FinalStudentList;
    //    this.setState({FinalStudentList: tempList2}, function () {
    //      //console.log(
    //        'this.state.FinalStudentList = ',
    //        this.state.FinalStudentList,
    //      );
    //    });
    //  }
    //});

    //tempList.map((item, index) => {
    //  //this.findRegNo(item.reg_no)
    //});
    //this.setState({FinalStudentList: tempList}, function () {
    //  //console.log('FinalStudentList = ', this.state.FinalStudentList);
    //});
  };

  findRegNo = (itemName, status) => {
    let FinalStudentList = this.state.FinalStudentList;
    let res = itemName.item.split('-', 12);
    //console.log(res[1]);
    let TempArr = this.state.studentList;
    let filterred = TempArr.filter(function (item) {
      return item.reg_no == res[1];
    });
    //console.log('filterd = ', filterred);
    if (!status) {
      //console.log('add item');
      FinalStudentList.push(...filterred);
    } else {
      FinalStudentList = FinalStudentList.filter((item, index) => {
        //console.log('reoved_item ===>', item);
        //console.log('item.reg_no = ', item.reg_no, ' , res[1] = ', res[1]);
        return item.reg_no !== res[1];
      });
      //console.log('remove item', FinalStudentList);
    }
    this.setState({FinalStudentList}, function () {
      //console.log('FinalStudentList = ', FinalStudentList);
    });
  };
  handleCheckbox = (
    mainIndex,
    secondIndex,
    thirdIndex,
    fourthIndex,
    fifthIndex,
    sixthIndex,
    status,
    itemName,
  ) => {
    const newArray = [...this.state.dataSource];
    newArray[mainIndex].children[secondIndex].children[thirdIndex].children[
      fourthIndex
    ].children[fifthIndex].children[sixthIndex].isChecked = !status;
    this.setState(
      {
        dataSource: newArray,
      },
      function () {
        //if (!status) {
        ////console.log(
        //  'newArray[mainIndex].children[secondIndex].item = ',
        //  newArray[mainIndex].children[secondIndex].item,
        //);
        this.findRegNo(itemName, status);
        //} else {
        //  this.setState({FinalStudentList: []});
        //}
      },
    );
  };
  handleCheckbox0 = (mainIndex, status) => {
    //console.log('hit handleCheckbox0');
    const newArray = [...this.state.dataSource];
    newArray[mainIndex].isChecked = !status;
    var IndexDesigArr = newArray[mainIndex].children;
    IndexDesigArr.map((item0, index0) => {
      if (!status) {
        item0.isChecked = true;
      } else if (status) {
        item0.isChecked = false;
      }
      item0.children.map((item1, index1) => {
        if (!status) {
          item1.isChecked = true;
        } else if (status) {
          item1.isChecked = false;
        }

        item1.children.map((item2, index2) => {
          if (!status) {
            item2.isChecked = true;
          } else if (status) {
            item2.isChecked = false;
          }

          item2.children.map((item3, index3) => {
            if (!status) {
              item3.isChecked = true;
            } else if (status) {
              item3.isChecked = false;
            }

            item3.children.map((item4, index4) => {
              if (!status) {
                item4.isChecked = true;
              } else if (status) {
                item4.isChecked = false;
              }
            });
          });
        });
      });
    });
    this.setState(
      {
        dataSource: newArray,
      },
      function () {
        if (!status) {
          this.setState({FinalStudentList: this.state.studentList}, () => {
            //console.log('FinalStudentList = ', this.state.FinalStudentList);
          });
        } else {
          this.setState({FinalStudentList: []});
        }
      },
    );
  };
  handleCheckbox1 = (mainIndex, secondIndex, status) => {
    //console.log('hit handleCheckbox1');
    const newArray = [...this.state.dataSource];
    newArray[mainIndex].children[secondIndex].isChecked = !status;
    var IndexDesigArr = newArray[mainIndex].children[secondIndex].children;
    IndexDesigArr.map((item0, index0) => {
      if (!status) {
        //console.log('item0 false = ', item0);
        item0.isChecked = true;
      } else if (status) {
        //console.log('item0 = ', item0);
        item0.isChecked = false;
      }
      item0.children.map((item1, index1) => {
        if (!status) {
          item1.isChecked = true;
        } else if (status) {
          item1.isChecked = false;
        }

        item1.children.map((item2, index2) => {
          if (!status) {
            item2.isChecked = true;
          } else if (status) {
            item2.isChecked = false;
          }

          item2.children.map((item3, index3) => {
            if (!status) {
              item3.isChecked = true;
            } else if (status) {
              item3.isChecked = false;
            }
          });
        });
      });
    });
    this.setState(
      {
        dataSource: newArray,
      },
      function () {
        if (!status) {
          //console.log('newArray[mainIndex].item = ', newArray[mainIndex].item);
          this.filterArr(
            newArray[mainIndex].children[secondIndex].item,
            'batch_year',
          );
        } else {
          this.RemoveFilterArr(
            newArray[mainIndex].children[secondIndex].item,
            'batch_year',
          );

          ////console.log('emptyyyyyyyyyy');
          //this.setState({FinalStudentList: []});
        }
      },
    );
  };
  handleCheckbox2 = (mainIndex, secondIndex, thirdIndex, status) => {
    //console.log('hit handleCheckbox2');
    const newArray = [...this.state.dataSource];
    newArray[mainIndex].children[secondIndex].children[
      thirdIndex
    ].isChecked = !status;
    var IndexDesigArr =
      newArray[mainIndex].children[secondIndex].children[thirdIndex].children;
    IndexDesigArr.map((item0, index0) => {
      if (!status) {
        item0.isChecked = true;
      } else if (status) {
        item0.isChecked = false;
      }
      item0.children.map((item1, index1) => {
        if (!status) {
          item1.isChecked = true;
        } else if (status) {
          item1.isChecked = false;
        }

        item1.children.map((item2, index2) => {
          if (!status) {
            item2.isChecked = true;
          } else if (status) {
            item2.isChecked = false;
          }
        });
      });
    });
    this.setState(
      {
        dataSource: newArray,
      },
      function () {
        if (!status) {
          ////console.log(
          //  'newArray[mainIndex].children[secondIndex].item = ',
          //  newArray[mainIndex].children[secondIndex].item,
          //);
          this.filterArr(
            newArray[mainIndex].children[secondIndex].children[thirdIndex].item,
            'edu_level',
            newArray[mainIndex].children[secondIndex].item,
          );
        } else {
          this.RemoveFilterArr(
            newArray[mainIndex].children[secondIndex].children[thirdIndex].item,
            'edu_level',
            newArray[mainIndex].children[secondIndex].item,
          );
          //this.setState({FinalStudentList: []});
        }
      },
    );
  };
  handleCheckbox3 = (
    mainIndex,
    secondIndex,
    thirdIndex,
    fourthIndex,
    status,
  ) => {
    //console.log('hit handleCheckbox3');
    const newArray = [...this.state.dataSource];
    newArray[mainIndex].children[secondIndex].children[thirdIndex].children[
      fourthIndex
    ].isChecked = !status;
    var IndexDesigArr =
      newArray[mainIndex].children[secondIndex].children[thirdIndex].children[
        fourthIndex
      ].children;
    IndexDesigArr.map((item0, index0) => {
      if (!status) {
        item0.isChecked = true;
      } else if (status) {
        item0.isChecked = false;
      }
      item0.children.map((item1, index1) => {
        if (!status) {
          item1.isChecked = true;
        } else if (status) {
          item1.isChecked = false;
        }
      });
    });
    this.setState(
      {
        dataSource: newArray,
      },
      function () {
        if (!status) {
          ////console.log(
          //  'newArray[mainIndex].children[secondIndex].item = ',
          //  newArray[mainIndex].children[secondIndex].item,
          //);
          this.filterArr(
            newArray[mainIndex].children[secondIndex].children[thirdIndex]
              .children[fourthIndex].item,
            'dept_name',
            newArray[mainIndex].children[secondIndex].item,
            newArray[mainIndex].children[secondIndex].children[thirdIndex].item,
          );
        } else {
          this.RemoveFilterArr(
            newArray[mainIndex].children[secondIndex].children[thirdIndex]
              .children[fourthIndex].item,
            'dept_name',
            newArray[mainIndex].children[secondIndex].item,
            newArray[mainIndex].children[secondIndex].children[thirdIndex].item,
          );
          //this.setState({FinalStudentList: []});
        }
      },
    );
  };
  handleCheckbox4 = (
    mainIndex,
    secondIndex,
    thirdIndex,
    fourthIndex,
    fifthIndex,
    status,
  ) => {
    //console.log('hit handleCheckbox4');
    const newArray = [...this.state.dataSource];
    newArray[mainIndex].children[secondIndex].children[thirdIndex].children[
      fourthIndex
    ].children[fifthIndex].isChecked = !status;
    var IndexDesigArr =
      newArray[mainIndex].children[secondIndex].children[thirdIndex].children[
        fourthIndex
      ].children[fifthIndex].children;
    IndexDesigArr.map((item0, index0) => {
      if (!status) {
        item0.isChecked = true;
      } else if (status) {
        item0.isChecked = false;
      }
    });
    this.setState(
      {
        dataSource: newArray,
      },
      function () {
        if (!status) {
          ////console.log(
          //  'newArray[mainIndex].children[secondIndex].item = ',
          //  newArray[mainIndex].children[secondIndex].item,
          //);
          this.filterArr(
            newArray[mainIndex].children[secondIndex].children[thirdIndex]
              .children[fourthIndex].children[fifthIndex].item,
            'course_name',
            newArray[mainIndex].children[secondIndex].item,
            newArray[mainIndex].children[secondIndex].children[thirdIndex].item,
            newArray[mainIndex].children[secondIndex].children[thirdIndex]
              .children[fourthIndex].item,
          );
        } else {
          this.RemoveFilterArr(
            newArray[mainIndex].children[secondIndex].children[thirdIndex]
              .children[fourthIndex].children[fifthIndex].item,
            'course_name',
            newArray[mainIndex].children[secondIndex].item,
            newArray[mainIndex].children[secondIndex].children[thirdIndex].item,
            newArray[mainIndex].children[secondIndex].children[thirdIndex]
              .children[fourthIndex].item,
          );
        }
      },
    );
  };

  render() {
    return (
      <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
        <Loader
          onPressCancel={() => {
            this.setState({Loader: false});
          }}
          Loading={this.state.Loader ? true : false}
        />

        <CustomHeader
          title="E-Circular Step-2"
          isHome={false}
          navigation={this.props.navigation}
        />

        <View style={{width: '100%', height: '83%', backgroundColor: 'white'}}>
          <ScrollView>
            <View
              style={{
                marginTop: 15,
                backgroundColor: 'white',
                width: '95%',
                alignSelf: 'center',
              }}>
              {this.state.dataSource.map((item0, index0) => {
                return (
                  <View
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 5,
                      marginBottom: 10,
                      borderWidth: 1,
                      borderColor: index0 % 2 ? Color1 : Color2,
                    }}
                    key={index0}>
                    <TouchableOpacity
                      onPress={() => {
                        let TempIndex = this.state.TempIndex;
                        if (TempIndex.indexOf(item0) > -1) {
                          TempIndex.splice(TempIndex.indexOf(item0), 1);
                        } else {
                          TempIndex.push(item0);
                        }
                        this.setState({
                          TempIndex,
                        });
                      }}
                      style={styles.CheckboxContainer}>
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          alignItems: 'center',
                          //justifyContent: 'space-between',
                        }}>
                        <View
                          style={{
                            width: '90%',
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          {/*<Checkbox
                            status={item0.isChecked ? 'checked' : 'unchecked'}
                            onPress={() => {
                              this.handleCheckbox0(index0, item0.isChecked);
                            }}
                            color={index0 % 2 ? Color1 : Color2}
                            uncheckedColor={index0 % 2 ? Color1 : Color2}
                          />*/}
                          <AnimatedCheckBox
                            size={20}
                            disableBuiltInState={true}
                            isChecked={item0.isChecked ? true : false}
                            fillColor={index0 % 2 ? Color1 : Color2}
                            iconStyle={{
                              borderRadius: 5,
                              marginLeft: 5,
                            }}
                            textStyle={{fontFamily: 'Poppins-Regular'}}
                            onPress={() => {
                              this.handleCheckbox0(index0, item0.isChecked);
                            }}
                          />
                          <Text
                            style={{
                              fontFamily: 'Poppins-Regular',
                              fontSize: 14,
                              marginLeft: 3,
                              width: '85%',
                              color: index0 % 2 ? Color1 : Color2,
                            }}>
                            {item0.item}
                          </Text>
                        </View>
                        <Text
                          style={{
                            fontFamily: 'Poppins-Regular',
                            fontSize:
                              this.state.TempIndex.indexOf(item0) > -1
                                ? 35
                                : 25,
                            marginLeft: 3,
                            color: index0 % 2 ? Color1 : Color2,
                          }}>
                          {this.state.TempIndex.indexOf(item0) > -1 ? '-' : '+'}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {this.state.TempIndex.indexOf(item0) > -1
                      ? item0.children
                          .sort((e1, e2) => e1.item < e2.item)
                          .map((item1, index1) => {
                            return (
                              <View
                                style={[
                                  styles.SubContainerCheckbox,
                                  {
                                    backgroundColor:
                                      index1 % 2 ? Color1 : Color2,
                                    borderColor: index1 % 2 ? Color1 : Color2,
                                    borderRadius: 5,
                                    marginRight: 10,
                                    padding: 5,
                                    marginLeft: 10,
                                  },
                                ]}
                                key={index1}>
                                <TouchableOpacity
                                  onPress={() => {
                                    let TempIndex2 = this.state.TempIndex2;
                                    if (TempIndex2.indexOf(item1) > -1) {
                                      TempIndex2.splice(
                                        TempIndex2.indexOf(item1),
                                        1,
                                      );
                                    } else {
                                      TempIndex2.push(item1);
                                    }
                                    this.setState({
                                      TempIndex2,
                                      TempColor: index1 % 2 ? Color1 : Color2,
                                    });
                                  }}
                                  style={styles.CheckboxContainer}>
                                  <View
                                    style={{
                                      width: '100%',
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      //justifyContent: 'space-between',
                                    }}>
                                    <View
                                      style={{
                                        width: '90%',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                      }}>
                                      {/*<Checkbox
                                        status={
                                          item1.isChecked
                                            ? 'checked'
                                            : 'unchecked'
                                        }
                                        onPress={() => {
                                          this.handleCheckbox1(
                                            index0,
                                            index1,
                                            item1.isChecked,
                                          );
                                        }}
                                        color={'white'}
                                        uncheckedColor={'white'}
                                      />*/}
                                      <AnimatedCheckBox
                                        size={20}
                                        disableBuiltInState={true}
                                        isChecked={
                                          item1.isChecked ? true : false
                                        }
                                        fillColor={'white'}
                                        iconStyle={{
                                          borderRadius: 5,
                                          marginLeft: 5,
                                        }}
                                        textStyle={{
                                          fontFamily: 'Poppins-Regular',
                                        }}
                                        onPress={() => {
                                          this.handleCheckbox1(
                                            index0,
                                            index1,
                                            item1.isChecked,
                                          );
                                        }}
                                      />
                                      <Text
                                        style={{
                                          fontFamily: 'Poppins-Regular',
                                          fontSize: 14,
                                          width: '85%',
                                          marginLeft: 3,
                                          color: 'white',
                                        }}>
                                        {item1.item}
                                      </Text>
                                    </View>
                                    <Text
                                      style={{
                                        fontFamily: 'Poppins-Regular',
                                        fontSize:
                                          this.state.TempIndex2.indexOf(item1) >
                                          -1
                                            ? 35
                                            : 25,
                                        marginLeft: 3,
                                        color: 'white',
                                      }}>
                                      {this.state.TempIndex2.indexOf(item1) > -1
                                        ? '-'
                                        : '+'}
                                    </Text>
                                  </View>
                                </TouchableOpacity>

                                {this.state.TempIndex2.indexOf(item1) > -1
                                  ? item1.children.map((item2, index2) => {
                                      return (
                                        <View
                                          style={[
                                            styles.SubContainerCheckbox,
                                            {
                                              borderColor: this.state.TempColor,
                                              marginLeft: 1,
                                              marginBottom: 5,
                                            },
                                          ]}
                                          key={index2}>
                                          <TouchableOpacity
                                            onPress={() => {
                                              let TempIndex3 = this.state
                                                .TempIndex3;
                                              if (
                                                TempIndex3.indexOf(item2) > -1
                                              ) {
                                                TempIndex3.splice(
                                                  TempIndex3.indexOf(item2),
                                                  1,
                                                );
                                              } else {
                                                TempIndex3.push(item2);
                                              }
                                              this.setState({TempIndex3});
                                            }}
                                            style={styles.CheckboxContainer}>
                                            <View
                                              style={{
                                                width: '100%',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                //justifyContent: 'space-between',
                                              }}>
                                              <View
                                                style={{
                                                  width: '90%',
                                                  flexDirection: 'row',
                                                  alignItems: 'center',
                                                }}>
                                                {/*<Checkbox
                                                  status={
                                                    item2.isChecked
                                                      ? 'checked'
                                                      : 'unchecked'
                                                  }
                                                  onPress={() =>
                                                    this.handleCheckbox2(
                                                      index0,
                                                      index1,
                                                      index2,
                                                      item2.isChecked,
                                                    )
                                                  }
                                                  color={this.state.TempColor}
                                                  uncheckedColor={
                                                    this.state.TempColor
                                                  }
                                                />*/}
                                                <AnimatedCheckBox
                                                  size={20}
                                                  disableBuiltInState={true}
                                                  isChecked={
                                                    item2.isChecked
                                                      ? true
                                                      : false
                                                  }
                                                  fillColor={
                                                    this.state.TempColor
                                                  }
                                                  iconStyle={{
                                                    borderRadius: 5,
                                                    marginLeft: 5,
                                                  }}
                                                  textStyle={{
                                                    fontFamily:
                                                      'Poppins-Regular',
                                                  }}
                                                  onPress={() => {
                                                    this.handleCheckbox2(
                                                      index0,
                                                      index1,
                                                      index2,
                                                      item2.isChecked,
                                                    );
                                                  }}
                                                />
                                                <Text
                                                  style={{
                                                    fontFamily:
                                                      'Poppins-Regular',
                                                    fontSize: 12,
                                                    marginLeft: wp('2'),
                                                    color: this.state.TempColor,
                                                  }}>
                                                  {item2.item}
                                                </Text>
                                              </View>
                                              <Text
                                                style={{
                                                  fontFamily: 'Poppins-Regular',
                                                  fontSize:
                                                    this.state.TempIndex3.indexOf(
                                                      item2,
                                                    ) > -1
                                                      ? 35
                                                      : 25,
                                                  marginLeft: 3,
                                                  color: this.state.TempColor,
                                                }}>
                                                {this.state.TempIndex3.indexOf(
                                                  item2,
                                                ) > -1
                                                  ? '-'
                                                  : '+'}
                                              </Text>
                                            </View>
                                          </TouchableOpacity>
                                          {this.state.TempIndex3.indexOf(
                                            item2,
                                          ) > -1
                                            ? item2.children.map(
                                                (item3, index3) => {
                                                  return (
                                                    <View
                                                      style={[
                                                        styles.SubContainerCheckbox,
                                                        {
                                                          borderColor: this
                                                            .state.TempColor,
                                                          borderLeftWidth: 1,
                                                        },
                                                      ]}
                                                      key={index3}>
                                                      <TouchableOpacity
                                                        onPress={() => {
                                                          let TempIndex4 = this
                                                            .state.TempIndex4;
                                                          if (
                                                            TempIndex4.indexOf(
                                                              item3,
                                                            ) > -1
                                                          ) {
                                                            TempIndex4.splice(
                                                              TempIndex4.indexOf(
                                                                item3,
                                                              ),
                                                              1,
                                                            );
                                                          } else {
                                                            TempIndex4.push(
                                                              item3,
                                                            );
                                                          }
                                                          this.setState({
                                                            TempIndex4,
                                                          });
                                                        }}
                                                        style={
                                                          styles.CheckboxContainer
                                                        }>
                                                        <View
                                                          style={{
                                                            width: '100%',
                                                            flexDirection:
                                                              'row',
                                                            alignItems:
                                                              'center',
                                                            //justifyContent: 'space-between',
                                                          }}>
                                                          <View
                                                            style={{
                                                              width: '90%',
                                                              flexDirection:
                                                                'row',
                                                              alignItems:
                                                                'center',
                                                            }}>
                                                            {/*<Checkbox
                                                              status={
                                                                item3.isChecked
                                                                  ? 'checked'
                                                                  : 'unchecked'
                                                              }
                                                              onPress={() =>
                                                                this.handleCheckbox3(
                                                                  index0,
                                                                  index1,
                                                                  index2,
                                                                  index3,
                                                                  item3.isChecked,
                                                                )
                                                              }
                                                              color={
                                                                this.state
                                                                  .TempColor
                                                              }
                                                              uncheckedColor={
                                                                this.state
                                                                  .TempColor
                                                              }
                                                            />*/}
                                                            <AnimatedCheckBox
                                                              size={20}
                                                              disableBuiltInState={
                                                                true
                                                              }
                                                              isChecked={
                                                                item3.isChecked
                                                                  ? true
                                                                  : false
                                                              }
                                                              fillColor={
                                                                this.state
                                                                  .TempColor
                                                              }
                                                              iconStyle={{
                                                                borderRadius: 5,
                                                                marginLeft: 5,
                                                              }}
                                                              textStyle={{
                                                                fontFamily:
                                                                  'Poppins-Regular',
                                                              }}
                                                              onPress={() => {
                                                                this.handleCheckbox3(
                                                                  index0,
                                                                  index1,
                                                                  index2,
                                                                  index3,
                                                                  item3.isChecked,
                                                                );
                                                              }}
                                                            />
                                                            <Text
                                                              style={{
                                                                fontFamily:
                                                                  'Poppins-Regular',
                                                                fontSize: 12,
                                                                marginLeft: wp(
                                                                  '2',
                                                                ),
                                                                color: this
                                                                  .state
                                                                  .TempColor,
                                                              }}>
                                                              {item3.item}
                                                            </Text>
                                                          </View>
                                                          <Text
                                                            style={{
                                                              fontFamily:
                                                                'Poppins-Regular',
                                                              fontSize:
                                                                this.state.TempIndex4.indexOf(
                                                                  item3,
                                                                ) > -1
                                                                  ? 35
                                                                  : 25,
                                                              marginLeft: 3,
                                                              color: this.state
                                                                .TempColor,
                                                            }}>
                                                            {this.state.TempIndex4.indexOf(
                                                              item3,
                                                            ) > -1
                                                              ? '-'
                                                              : '+'}
                                                          </Text>
                                                        </View>
                                                      </TouchableOpacity>
                                                      {this.state.TempIndex4.indexOf(
                                                        item3,
                                                      ) > -1
                                                        ? item3.children.map(
                                                            (item4, index4) => {
                                                              return (
                                                                <View
                                                                  style={[
                                                                    styles.SubContainerCheckbox,
                                                                    {
                                                                      borderColor: this
                                                                        .state
                                                                        .TempColor,
                                                                      borderLeftWidth: 1,
                                                                    },
                                                                  ]}
                                                                  key={index4}>
                                                                  <TouchableOpacity
                                                                    onPress={() => {
                                                                      let TempIndex5 = this
                                                                        .state
                                                                        .TempIndex5;
                                                                      if (
                                                                        TempIndex5.indexOf(
                                                                          item4,
                                                                        ) > -1
                                                                      ) {
                                                                        TempIndex5.splice(
                                                                          TempIndex5.indexOf(
                                                                            item4,
                                                                          ),
                                                                          1,
                                                                        );
                                                                      } else {
                                                                        TempIndex5.push(
                                                                          item4,
                                                                        );
                                                                      }
                                                                      this.setState(
                                                                        {
                                                                          TempIndex5,
                                                                        },
                                                                      );
                                                                    }}
                                                                    style={
                                                                      styles.CheckboxContainer
                                                                    }>
                                                                    <View
                                                                      style={{
                                                                        width:
                                                                          '100%',
                                                                        flexDirection:
                                                                          'row',
                                                                        alignItems:
                                                                          'center',
                                                                        //justifyContent: 'space-between',
                                                                      }}>
                                                                      <View
                                                                        style={{
                                                                          width:
                                                                            '90%',
                                                                          flexDirection:
                                                                            'row',
                                                                          alignItems:
                                                                            'center',
                                                                        }}>
                                                                        {/*<Checkbox
                                                                          status={
                                                                            item4.isChecked
                                                                              ? 'checked'
                                                                              : 'unchecked'
                                                                          }
                                                                          onPress={() =>
                                                                            this.handleCheckbox4(
                                                                              index0,
                                                                              index1,
                                                                              index2,
                                                                              index3,
                                                                              index4,
                                                                              item4.isChecked,
                                                                            )
                                                                          }
                                                                          color={
                                                                            this
                                                                              .state
                                                                              .TempColor
                                                                          }
                                                                          uncheckedColor={
                                                                            this
                                                                              .state
                                                                              .TempColor
                                                                          }
                                                                        />*/}
                                                                        <AnimatedCheckBox
                                                                          size={
                                                                            20
                                                                          }
                                                                          disableBuiltInState={
                                                                            true
                                                                          }
                                                                          isChecked={
                                                                            item4.isChecked
                                                                              ? true
                                                                              : false
                                                                          }
                                                                          fillColor={
                                                                            this
                                                                              .state
                                                                              .TempColor
                                                                          }
                                                                          iconStyle={{
                                                                            borderRadius: 5,
                                                                            marginLeft: 5,
                                                                          }}
                                                                          textStyle={{
                                                                            fontFamily:
                                                                              'Poppins-Regular',
                                                                          }}
                                                                          onPress={() => {
                                                                            this.handleCheckbox4(
                                                                              index0,
                                                                              index1,
                                                                              index2,
                                                                              index3,
                                                                              index4,
                                                                              item4.isChecked,
                                                                            );
                                                                          }}
                                                                        />
                                                                        <Text
                                                                          style={{
                                                                            fontFamily:
                                                                              'Poppins-Regular',
                                                                            fontSize: 12,
                                                                            color: this
                                                                              .state
                                                                              .TempColor,
                                                                            marginLeft: wp(
                                                                              '2',
                                                                            ),
                                                                          }}>
                                                                          {
                                                                            item4.item
                                                                          }
                                                                        </Text>
                                                                      </View>
                                                                      <Text
                                                                        style={{
                                                                          fontFamily:
                                                                            'Poppins-Regular',
                                                                          fontSize:
                                                                            this.state.TempIndex5.indexOf(
                                                                              item4,
                                                                            ) >
                                                                            -1
                                                                              ? 35
                                                                              : 25,
                                                                          marginLeft: 3,
                                                                          color: this
                                                                            .state
                                                                            .TempColor,
                                                                        }}>
                                                                        {this.state.TempIndex5.indexOf(
                                                                          item4,
                                                                        ) > -1
                                                                          ? '-'
                                                                          : '+'}
                                                                      </Text>
                                                                    </View>
                                                                  </TouchableOpacity>
                                                                  {this.state.TempIndex5.indexOf(
                                                                    item4,
                                                                  ) > -1
                                                                    ? item4.children.map(
                                                                        (
                                                                          item5,
                                                                          index5,
                                                                        ) => {
                                                                          return (
                                                                            <View
                                                                              style={
                                                                                (styles.SubContainerCheckbox,
                                                                                {
                                                                                  marginBottom: 0,
                                                                                  marginLeft: 20,
                                                                                  borderColor: this
                                                                                    .state
                                                                                    .TempColor,
                                                                                  borderLeftWidth: 1,
                                                                                })
                                                                              }
                                                                              key={
                                                                                index5
                                                                              }>
                                                                              <TouchableOpacity
                                                                                onPress={() =>
                                                                                  this.handleCheckbox(
                                                                                    index0,
                                                                                    index1,
                                                                                    index2,
                                                                                    index3,
                                                                                    index4,
                                                                                    index5,
                                                                                    item5.isChecked,
                                                                                    item5,
                                                                                  )
                                                                                }
                                                                                style={
                                                                                  styles.CheckboxContainer
                                                                                }>
                                                                                {/*<Checkbox
                                                                                  status={
                                                                                    item5.isChecked
                                                                                      ? 'checked'
                                                                                      : 'unchecked'
                                                                                  }
                                                                                  onPress={() =>
                                                                                    this.handleCheckbox(
                                                                                      index0,
                                                                                      index1,
                                                                                      index2,
                                                                                      index3,
                                                                                      index4,
                                                                                      index5,
                                                                                      item5.isChecked,
                                                                                      item5,
                                                                                    )
                                                                                  }
                                                                                  color={
                                                                                    this
                                                                                      .state
                                                                                      .TempColor
                                                                                  }
                                                                                  uncheckedColor={
                                                                                    this
                                                                                      .state
                                                                                      .TempColor
                                                                                  }
                                                                                />*/}
                                                                                <AnimatedCheckBox
                                                                                  size={
                                                                                    20
                                                                                  }
                                                                                  disableBuiltInState={
                                                                                    true
                                                                                  }
                                                                                  isChecked={
                                                                                    item5.isChecked
                                                                                      ? true
                                                                                      : false
                                                                                  }
                                                                                  fillColor={
                                                                                    this
                                                                                      .state
                                                                                      .TempColor
                                                                                  }
                                                                                  iconStyle={{
                                                                                    borderRadius: 5,
                                                                                    marginLeft: 5,
                                                                                  }}
                                                                                  textStyle={{
                                                                                    fontFamily:
                                                                                      'Poppins-Regular',
                                                                                  }}
                                                                                  onPress={() => {
                                                                                    this.handleCheckbox(
                                                                                      index0,
                                                                                      index1,
                                                                                      index2,
                                                                                      index3,
                                                                                      index4,
                                                                                      index5,
                                                                                      item5.isChecked,
                                                                                      item5,
                                                                                    );
                                                                                  }}
                                                                                />
                                                                                <Text
                                                                                  style={{
                                                                                    fontFamily:
                                                                                      'Poppins-Regular',
                                                                                    fontSize: 12,
                                                                                    color: this
                                                                                      .state
                                                                                      .TempColor,
                                                                                    marginLeft: wp(
                                                                                      '2',
                                                                                    ),
                                                                                  }}>
                                                                                  {
                                                                                    item5.item
                                                                                  }
                                                                                </Text>
                                                                              </TouchableOpacity>
                                                                            </View>
                                                                          );
                                                                        },
                                                                      )
                                                                    : null}
                                                                </View>
                                                              );
                                                            },
                                                          )
                                                        : null}
                                                    </View>
                                                  );
                                                },
                                              )
                                            : null}
                                        </View>
                                      );
                                    })
                                  : null}
                              </View>
                            );
                          })
                      : null}
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: hp('3'),
          }}>
          <CustomButton
            title="Next"
            onPress={() => {
              this.send();
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  text: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    margin: '1%',
  },
  date: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12.5,
    margin: '1%',
    color: '#909090',
  },
  label: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#c9c3c5',
  },
  label1: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#c9c3c5',
    paddingLeft: wp('3'),
  },
  labelContainer: {
    margin: '1.5%',
  },
  input: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    backgroundColor: '#ffffff',
    paddingLeft: '5%',
    borderRadius: 10,
    borderColor: '#f1f1f1',
    borderWidth: 1,
    borderRightWidth: 0,
  },
  item: {
    borderRadius: 10,
    backgroundColor: '#ffffff',
    height: hp('7'),
    borderColor: '#f1f1f1',
    borderWidth: 1,
    elevation: 2,
  },
  footerText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    color: '#ffffff',
  },
  row: {
    flexDirection: 'row',
  },
  CheckboxContainer: {
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: '98%',
    alignSelf: 'flex-end',
    margin: 5,
    height: 45,
  },
  SubContainerCheckbox: {
    //margin: 10,
    marginLeft: 20,
    backgroundColor: 'white',
    //borderLeftWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
    //borderRadius: 5,
  },
});
