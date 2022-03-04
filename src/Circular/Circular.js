import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Text,
  Image,
  BackHandler,
  LogBox,
} from 'react-native';
import {Container, Content} from 'native-base';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Toast from 'react-native-tiny-toast';
import ResponsiveSize from '../config/ResponsiveSize';
import MultiSelect from 'react-native-multiple-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Loader} from '../components/Loader';
import {CustomHeader} from '../components/CustomHeader';
import {SafeAreaView} from 'react-native';
import {CustomButton} from '../components/common/Button';
import config from '../config/config';
import {ScrollView} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {Checkbox} from 'react-native-paper';
import {Dimensions} from 'react-native';
import {AnimatedCheckBox} from '../components/common/AnimatedCheckBox';
const Color1 = '#7260E9';
const Color2 = '#23C4D7';
const Color3 = '#6397F2';
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;
export default class Circular extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCollages: [],
      selectedBranches: [],
      selectedEducationLevel: [],
      selectedDegree: [],
      selectedDepartment: [],
      selectedSemester: [],
      selectedSection: [],
      collages: [],
      batchYears: [],
      colleges: [],
      courseModels: [],
      departmentModels: [],
      eduLevels: [],
      periods: [],
      sectionModels: [],
      semesterModels: [],
      error_message: '',
      Loader: true,
      DeviceToken: '',
    };
  }
  componentDidMount() {
    console.log(this.props.route?.name);
    DeviceInfo.getAndroidId().then((androidId) => {
      //alert(androidId);
      this.setState({DeviceToken: androidId});
      // androidId here
    });
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
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
        //console.log(value);
        this.setState({Token: value}, function () {
          //this.onLoadGetAllFilters();
        });
      }
    } catch (error) {
      alert('Error retrieving data');
    }
    try {
      const value = await AsyncStorage.getItem('collegeCode');
      if (value !== null) {
        let collegeCode = [];
        collegeCode.push(value);
        this.setState({collegeCode}, function () {
          this.GetDependantFilter(
            2,
            this.state.collegeCode,
            'string',
            'string',
            'string',
            'string',
            'string',
            'string',
          );
        });
      }
    } catch (error) {
      alert('Error retrieving data');
    }
  };
  selectedCollages = (selectedCollages) => {
    //alert(JSON.stringify(selectedCollages));
    this.setState({selectedCollages}, function () {
      //this.GetDependantFilter(3,this.state.selectedBranches,this.state.collegeCode,"string","string","string","string","string","string");
    });
  };
  selectedBranches = (selectedBranches) => {
    //console.log('selectedBranches ==', selectedBranches);
    this.setState({selectedBranches}, function () {
      this.GetDependantFilter(
        3,
        this.state.collegeCode,
        this.state.selectedBranches,
        'string',
        'string',
        'string',
        'string',
        'string',
        'string',
      );
    });
  };
  selectedEducationLevel = (selectedEducationLevel) => {
    ////console.log('this.multiSelect -= ', this.multiSelect);

    this.setState({selectedEducationLevel}, function () {
      this.GetDependantFilter(
        4,
        this.state.collegeCode,
        this.state.selectedBranches,
        this.state.selectedEducationLevel,
        'string',
        'string',
        'string',
        'string',
        'string',
      );
    });
  };
  selectedDegree = (selectedDegree) => {
    //console.log('this.state.courseModels =', this.state.courseModels);
    //console.log('selectedDegree = ', selectedDegree);
    //let TempDegree = [];
    //this.state.courseModels.forEach((item) => {
    //  selectedDegree.forEach((i) => {
    //    if (item.name == i) {
    //      TempDegree.push(item.id);
    //    }
    //  });
    //});

    ////console.log('TempDegree = ', TempDegree);
    this.setState({selectedDegree}, function () {
      this.GetDependantFilter(
        5,
        this.state.collegeCode,
        this.state.selectedBranches,
        this.state.selectedEducationLevel,
        this.state.selectedDegree,
        //TempDegree,
        'string',
        'string',
        'string',
        'string',
      );
    });
  };
  selectedDepartment = (selectedDepartment) => {
    this.setState({selectedDepartment}, function () {
      this.GetDependantFilter(
        6,
        this.state.collegeCode,
        this.state.selectedBranches,
        this.state.selectedEducationLevel,
        this.state.selectedDegree,
        this.state.selectedDepartment,
        'string',
        'string',
        'string',
      );
    });
  };
  selectedSemester = (selectedSemester) => {
    this.setState({selectedSemester}, function () {
      this.GetDependantFilter(
        7,
        this.state.collegeCode,
        this.state.selectedBranches,
        this.state.selectedEducationLevel,
        this.state.selectedDegree,
        this.state.selectedDepartment,
        this.state.selectedSemester,
        'string',
        'string',
      );
    });
  };
  selectedSection = (selectedSection) => {
    this.setState({selectedSection}, function () {
      //this.GetDependantFilter(9,"string",this.state.collegeCode,"string","string","string","string","string","string");
    });
  };
  GetDependantFilter = (
    type,
    collegeCode,
    batchYears,
    eduLevels,
    courseModels,
    departmentModels,
    semesterModels,
    periods,
    sectionModels,
  ) => {
    this.setState({Loader: true});
    const url = config.baseUrl2 + 'staff/GetDependantFilter';
    //console.log(url);
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.state.Token,
      },
      body:
        type == 2
          ? JSON.stringify({
              type: type,
              isDefault: true,
              collegeCode: collegeCode,
              //periods: periods,
              //mobileDeviceToken: this.state.DeviceToken,
            })
          : type == 3
          ? JSON.stringify({
              type: type,
              isDefault: true,
              collegeCode: collegeCode,
              batchYearIds: batchYears,
            })
          : type == 4
          ? JSON.stringify({
              type: type,
              isDefault: true,
              collegeCode: collegeCode,
              batchYearIds: batchYears,
              eduIds: eduLevels,
            })
          : type == 5
          ? JSON.stringify({
              type: type,
              isDefault: true,
              collegeCode: collegeCode,
              batchYearIds: batchYears,
              eduIds: eduLevels,
              courseIds: courseModels,
            })
          : type == 6
          ? JSON.stringify({
              type: type,
              isDefault: true,
              collegeCode: collegeCode,
              batchYearIds: batchYears,
              eduIds: eduLevels,
              courseIds: courseModels,
              departmentIds: departmentModels,
            })
          : type == 7
          ? JSON.stringify({
              type: type,
              isDefault: true,
              collegeCode: collegeCode,
              batchYearIds: batchYears,
              eduIds: eduLevels,
              courseIds: courseModels,
              departmentIds: departmentModels,
              semIds: semesterModels,
            })
          : type == 0
          ? JSON.stringify({
              type: type,
              isDefault: true,
              collegeCode: collegeCode,
              batchYearIds: batchYears,
              eduIds: eduLevels,
              courseIds: courseModels,
              departmentIds: departmentModels,
              semIds: semesterModels,
              sectionIds: sectionModels,
              //periods: periods,
              //mobileDeviceToken: this.state.DeviceToken,
            })
          : null,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson) {
          //console.log('responseJson ==', responseJson);
          //alert(JSON.stringify(responseJson));
          let temparr2 = [];
          var currentArr = responseJson;
          this.setState({Loader: false});
          currentArr.map((item, index) => {
            var obj =
              //type == 4 || type == 5
              //  ? {
              //      id: item.id.toString(),
              //      name: item.id.toString(),
              //    }
              //  :
              {
                id: item.id.toString(),
                name: item.itemName,
              };
            temparr2.push(obj);
            this.scrollView.scrollToEnd();
            if (type == 2) {
              this.setState({batchYears: temparr2, Loader: false});
            } else if (type == 3) {
              this.setState({eduLevels: temparr2, Loader: false});
            } else if (type == 4) {
              this.setState({courseModels: temparr2, Loader: false});
            } else if (type == 5) {
              this.setState({departmentModels: temparr2, Loader: false});
            } else if (type == 6) {
              this.setState({semesterModels: temparr2, Loader: false});
            } else if (type == 7) {
              this.setState({sectionModels: temparr2, Loader: false});
            }
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
  goToCircularStep2 = () => {
    //if (this.state.selectedCollages.length) {
    if (this.state.selectedBranches.length) {
      if (this.state.selectedEducationLevel.length) {
        if (this.state.selectedDegree.length) {
          if (this.state.selectedDepartment.length) {
            if (this.state.selectedSemester.length) {
              //this.props.navigation.navigate('CircularStep2', {
              //  collage: this.state.selectedCollages,
              //  batch: this.state.selectedBranches,
              //  eduLevel: this.state.selectedEducationLevel,
              //  degree: this.state.selectedDegree,
              //  department: this.state.selectedDepartment,
              //  semester: this.state.selectedSemester,
              //  section: this.state.selectedSection,
              //});
              this.props.reUse
                ? this.props.onPress({
                    collage: this.state.selectedCollages,
                    batch: this.state.selectedBranches,
                    eduLevel: this.state.selectedEducationLevel,
                    degree: this.state.selectedDegree,
                    department: this.state.selectedDepartment,
                    semester: this.state.selectedSemester,
                    section: this.state.selectedSection,
                  })
                : this.props.navigation.navigate('CircularStep2', {
                    collage: this.state.selectedCollages,
                    batch: this.state.selectedBranches,
                    eduLevel: this.state.selectedEducationLevel,
                    degree: this.state.selectedDegree,
                    department: this.state.selectedDepartment,
                    semester: this.state.selectedSemester,
                    section: this.state.selectedSection,
                  });
            } else {
              Toast.show('Please Select Semester', ToastData);
            }
          } else {
            Toast.show('Please Select Department', ToastData);
          }
        } else {
          Toast.show('Please Select Degree', ToastData);
        }
      } else {
        Toast.show('Please Select Education Level', ToastData);
      }
    } else {
      Toast.show('Please Select Branch', ToastData);
    }
    //} else {
    //  Toast.show('Please Select College', ToastData);
    //}
  };

  render() {
    const {
      selectedCollages,
      selectedBranches,
      selectedEducationLevel,
      selectedDegree,
      selectedDepartment,
      selectedSemester,
      selectedSection,
    } = this.state;
    return (
      <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
        <Loader
          Loading={this.state.Loader ? true : false}
          onPressCancel={() => {
            this.setState({Loader: false});
          }}
        />
        {this.props?.children == 'Circular' || this.props.reUse ? null : (
          <CustomHeader
            title="E-Circular Step-1"
            isHome={false}
            navigation={this.props.navigation}
          />
        )}
        <ScrollView ref={(scrollView) => (this.scrollView = scrollView)}>
          <View style={styles.DropdownCOntainer}>
            <MultiSelect
              styleMainWrapper={{
                width: ScreenWidth - 100,
              }}
              items={this.state.batchYears}
              uniqueKey="id"
              ref={(component) => {
                this.multiSelect = component;
              }}
              onSelectedItemsChange={this.selectedBranches}
              selectedItems={selectedBranches}
              selectText="Search By Batch Year "
              searchInputPlaceholderText="Search By Batch Year "
              onChangeInput={(text) => {}}
              altFontFamily="Poppins-Regular"
              tagRemoveIconColor={Color1}
              textColor={Color1}
              tagBorderColor={Color1}
              tagTextColor={Color1}
              selectedItemTextColor={Color1}
              selectedItemIconColor={Color1}
              itemTextColor="#000"
              styleInputGroup={[
                styles.DropdownStyle,
                {paddingRight: 10, height: 40},
              ]}
              styleDropdownMenuSubsection={[
                styles.DropdownStyle,
                {borderColor: Color1},
              ]}
              //hideSubmitButton
              //hideTags
              //single
              submitButtonColor={Color1}
              itemFontSize={ResponsiveSize(config.AppAllTextSize)}
              styleTextDropdown={{
                paddingLeft: wp('2'),
                fontFamily: 'Poppins:Regular',
              }}
              styleTextDropdownSelected={{paddingLeft: wp('2')}}
              styleRowList={styles.innerTextDropdown}
            />
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 10,
                marginTop: 5,
                alignSelf: 'flex-start',
              }}>
              <AnimatedCheckBox
                size={25}
                disableBuiltInState={true}
                iconStyle={{
                  borderRadius: 5,
                  borderColor: Color1,
                }}
                textStyle={{fontFamily: 'Poppins-Regular'}}
                isChecked={this.state.Checked ? true : false}
                fillColor={Color1}
                unfillColor={'white'}
                onPress={() => {
                  //this.scrollView.scrollTo({y: 300, animated: true});
                  ////console.log(this.multiSelect.props);
                  this.setState({Checked: !this.state.Checked});
                  let Arr = [];
                  this.state.batchYears.map((item, index) => {
                    Arr.push(item.name);
                    this.setState({selectedBranches: Arr}, function () {});
                  });
                  if (!this.state.Checked) {
                    return this.selectedBranches(Arr);
                  }
                  this.selectedBranches([]);
                }}
              />
            </View>
          </View>
          {this.state.selectedBranches.length ? (
            <View style={styles.DropdownCOntainer}>
              <MultiSelect
                styleMainWrapper={{
                  width: ScreenWidth - 100,
                }}
                items={this.state.eduLevels}
                uniqueKey="id"
                ref={(component) => {
                  this.multiSelect = component;
                }}
                onSelectedItemsChange={this.selectedEducationLevel}
                selectedItems={selectedEducationLevel}
                selectText="Search By Education Level "
                searchInputPlaceholderText="Search By Education Level "
                onChangeInput={(text) => {}}
                altFontFamily="Poppins-Regular"
                tagRemoveIconColor={Color2}
                textColor={Color2}
                tagBorderColor={Color2}
                tagTextColor={Color2}
                selectedItemTextColor={Color2}
                selectedItemIconColor={Color2}
                itemTextColor="#000"
                styleInputGroup={[
                  styles.DropdownStyle,
                  {paddingRight: 10, height: 40},
                ]}
                styleDropdownMenuSubsection={[
                  styles.DropdownStyle,
                  {borderColor: Color2},
                ]}
                //hideSubmitButton
                //hideTags
                //single
                submitButtonColor={Color2}
                itemFontSize={ResponsiveSize(config.AppAllTextSize)}
                styleTextDropdown={{
                  paddingLeft: wp('2'),
                  fontFamily: 'Poppins:Regular',
                }}
                styleTextDropdownSelected={{paddingLeft: wp('2')}}
                styleRowList={styles.innerTextDropdown}
              />
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 10,
                  marginTop: 5,
                  alignSelf: 'flex-start',
                }}>
                <AnimatedCheckBox
                  size={25}
                  disableBuiltInState={true}
                  iconStyle={{
                    borderRadius: 5,
                    borderColor: Color2,
                  }}
                  textStyle={{fontFamily: 'Poppins-Regular'}}
                  isChecked={this.state.Checked2 ? true : false}
                  fillColor={Color2}
                  unfillColor={'white'}
                  onPress={() => {
                    ////console.log(this.multiSelect.items);
                    this.setState({Checked2: !this.state.Checked2});
                    let Arr = [];
                    this.state.eduLevels.map((item, index) => {
                      Arr.push(item.name);
                      this.setState(
                        {selectedEducationLevel: Arr},
                        function () {},
                      );
                    });
                    if (!this.state.Checked2) {
                      return this.selectedEducationLevel(Arr);
                    }
                    this.selectedEducationLevel([]);
                  }}
                />
              </View>
            </View>
          ) : null}
          {this.state.selectedEducationLevel.length ? (
            <View style={styles.DropdownCOntainer}>
              <MultiSelect
                styleMainWrapper={{
                  width: ScreenWidth - 100,
                }}
                items={this.state.courseModels}
                uniqueKey="id"
                ref={(component) => {
                  this.multiSelectDegree = component;
                }}
                onSelectedItemsChange={this.selectedDegree}
                selectedItems={selectedDegree}
                selectText="Search By Degree "
                searchInputPlaceholderText="Search By Degree "
                onChangeInput={(text) => {}}
                altFontFamily="Poppins-Regular"
                tagRemoveIconColor={Color3}
                textColor={Color3}
                tagBorderColor={Color3}
                tagTextColor={Color3}
                selectedItemTextColor={Color3}
                selectedItemIconColor={Color3}
                itemTextColor="#000"
                styleInputGroup={[
                  styles.DropdownStyle,
                  {paddingRight: 10, height: 40},
                ]}
                styleDropdownMenuSubsection={[
                  styles.DropdownStyle,
                  {borderColor: Color3},
                ]}
                //hideSubmitButton
                //hideTags
                //single
                submitButtonColor={Color1}
                itemFontSize={ResponsiveSize(config.AppAllTextSize)}
                styleTextDropdown={{
                  paddingLeft: wp('2'),
                  fontFamily: 'Poppins:Regular',
                }}
                styleTextDropdownSelected={{paddingLeft: wp('2')}}
                styleRowList={styles.innerTextDropdown}
              />
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 10,
                  marginTop: 5,
                  alignSelf: 'flex-start',
                }}>
                <AnimatedCheckBox
                  size={25}
                  disableBuiltInState={true}
                  iconStyle={{
                    borderRadius: 5,
                    borderColor: Color3,
                  }}
                  textStyle={{fontFamily: 'Poppins-Regular'}}
                  isChecked={this.state.Checked3 ? true : false}
                  fillColor={Color3}
                  unfillColor={'white'}
                  onPress={() => {
                    ////console.log(this.multiSelect.items);
                    this.setState({Checked3: !this.state.Checked3});
                    let Arr = [];
                    this.state.courseModels.map((item, index) => {
                      Arr.push(item.id);
                      this.setState({selectedDegree: Arr}, function () {
                        //console.log(this.state.selectedDegree);
                      });
                    });
                    if (!this.state.Checked3) {
                      return this.selectedDegree(Arr);
                    }
                    this.selectedDegree([]);
                  }}
                />
              </View>
            </View>
          ) : null}
          {this.state.selectedDegree.length ? (
            <View style={styles.DropdownCOntainer}>
              <MultiSelect
                styleMainWrapper={{
                  width: ScreenWidth - 100,
                }}
                items={this.state.departmentModels}
                uniqueKey="id"
                ref={(component) => {
                  this.multiSelect = component;
                }}
                onSelectedItemsChange={this.selectedDepartment}
                selectedItems={selectedDepartment}
                selectText="Search By Department "
                searchInputPlaceholderText="Search By Department "
                onChangeInput={(text) => {}}
                altFontFamily="Poppins-Regular"
                tagRemoveIconColor={Color1}
                textColor={Color1}
                tagBorderColor={Color1}
                tagTextColor={Color1}
                selectedItemTextColor={Color1}
                selectedItemIconColor={Color1}
                itemTextColor="#000"
                styleInputGroup={[
                  styles.DropdownStyle,
                  {paddingRight: 10, height: 40},
                ]}
                styleDropdownMenuSubsection={[
                  styles.DropdownStyle,
                  {borderColor: Color1},
                ]}
                //hideSubmitButton
                //hideTags
                //single
                submitButtonColor={Color1}
                itemFontSize={ResponsiveSize(config.AppAllTextSize)}
                styleTextDropdown={{
                  paddingLeft: wp('2'),
                  fontFamily: 'Poppins:Regular',
                }}
                styleTextDropdownSelected={{paddingLeft: wp('2')}}
                styleRowList={styles.innerTextDropdown}
              />
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 10,
                  marginTop: 5,
                  alignSelf: 'flex-start',
                }}>
                <AnimatedCheckBox
                  size={25}
                  disableBuiltInState={true}
                  iconStyle={{
                    borderRadius: 5,
                    borderColor: Color1,
                  }}
                  textStyle={{fontFamily: 'Poppins-Regular'}}
                  isChecked={this.state.Checked4 ? true : false}
                  fillColor={Color1}
                  unfillColor={'white'}
                  onPress={() => {
                    ////console.log(this.multiSelect.items);
                    this.setState({Checked4: !this.state.Checked4});
                    let Arr = [];
                    this.state.departmentModels.map((item, index) => {
                      Arr.push(item.id);
                      this.setState({selectedDepartment: Arr}, function () {});
                    });
                    if (!this.state.Checked4) {
                      return this.selectedDepartment(Arr);
                    }
                    this.selectedDepartment([]);
                  }}
                />
              </View>
            </View>
          ) : null}
          {this.state.selectedDepartment.length ? (
            <View style={styles.DropdownCOntainer}>
              <MultiSelect
                styleMainWrapper={{
                  width: ScreenWidth - 100,
                }}
                items={this.state.semesterModels}
                uniqueKey="id"
                ref={(component) => {
                  this.multiSelect = component;
                }}
                onSelectedItemsChange={this.selectedSemester}
                selectedItems={selectedSemester}
                selectText="Search By Semester "
                searchInputPlaceholderText="Search By Semester "
                onChangeInput={(text) => {}}
                altFontFamily="Poppins-Regular"
                tagRemoveIconColor={Color2}
                textColor={Color2}
                tagBorderColor={Color2}
                tagTextColor={Color2}
                selectedItemTextColor={Color2}
                selectedItemIconColor={Color2}
                itemTextColor="#000"
                styleInputGroup={[
                  styles.DropdownStyle,
                  {paddingRight: 10, height: 40},
                ]}
                styleDropdownMenuSubsection={[
                  styles.DropdownStyle,
                  {borderColor: Color2},
                ]}
                //hideSubmitButton
                //hideTags
                //single
                submitButtonColor={Color1}
                itemFontSize={ResponsiveSize(config.AppAllTextSize)}
                styleTextDropdown={{
                  paddingLeft: wp('2'),
                  fontFamily: 'Poppins:Regular',
                }}
                styleTextDropdownSelected={{paddingLeft: wp('2')}}
                styleRowList={styles.innerTextDropdown}
              />
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 10,
                  marginTop: 5,
                  alignSelf: 'flex-start',
                }}>
                <AnimatedCheckBox
                  size={25}
                  disableBuiltInState={true}
                  iconStyle={{
                    borderRadius: 5,
                    borderColor: Color2,
                  }}
                  textStyle={{fontFamily: 'Poppins-Regular'}}
                  isChecked={this.state.Checked5 ? true : false}
                  fillColor={Color2}
                  unfillColor={'white'}
                  onPress={() => {
                    ////console.log(this.multiSelect.items);
                    this.setState({Checked5: !this.state.Checked5});
                    let Arr = [];
                    this.state.semesterModels.map((item, index) => {
                      Arr.push(item.name);
                      this.setState({selectedSemester: Arr}, function () {});
                    });
                    if (!this.state.Checked5) {
                      return this.selectedSemester(Arr);
                    }
                    this.selectedSemester([]);
                  }}
                />
              </View>
            </View>
          ) : null}
          {this.state.selectedSemester.length ? (
            <View style={styles.DropdownCOntainer}>
              <MultiSelect
                styleMainWrapper={{
                  width: ScreenWidth - 100,
                }}
                items={this.state.sectionModels}
                uniqueKey="id"
                ref={(component) => {
                  this.multiSelect = component;
                }}
                onSelectedItemsChange={this.selectedSection}
                selectedItems={selectedSection}
                selectText="Search By Section "
                searchInputPlaceholderText="Search By Section "
                onChangeInput={(text) => {}}
                altFontFamily="Poppins-Regular"
                tagRemoveIconColor={Color3}
                textColor={Color3}
                tagBorderColor={Color3}
                tagTextColor={Color3}
                selectedItemTextColor={Color3}
                selectedItemIconColor={Color3}
                itemTextColor="#000"
                styleInputGroup={[
                  styles.DropdownStyle,
                  {paddingRight: 10, height: 40},
                ]}
                styleDropdownMenuSubsection={[
                  styles.DropdownStyle,
                  {borderColor: Color3},
                ]}
                //hideSubmitButton
                //hideTags
                //single
                submitButtonColor={Color3}
                itemFontSize={ResponsiveSize(config.AppAllTextSize)}
                styleTextDropdown={{
                  paddingLeft: wp('2'),
                  fontFamily: 'Poppins:Regular',
                }}
                styleTextDropdownSelected={{paddingLeft: wp('2')}}
                styleRowList={styles.innerTextDropdown}
              />
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 10,
                  marginTop: 5,
                  alignSelf: 'flex-start',
                }}>
                <AnimatedCheckBox
                  size={25}
                  disableBuiltInState={true}
                  iconStyle={{
                    borderRadius: 5,
                    borderColor: Color3,
                  }}
                  textStyle={{fontFamily: 'Poppins-Regular'}}
                  isChecked={this.state.Checked6 ? true : false}
                  fillColor={Color3}
                  unfillColor={'white'}
                  onPress={() => {
                    ////console.log(this.multiSelect.items);
                    this.setState({Checked6: !this.state.Checked6});
                    let Arr = [];
                    this.state.sectionModels.map((item, index) => {
                      Arr.push(item.name);
                      this.setState({selectedSection: Arr}, function () {});
                    });
                    if (!this.state.Checked6) {
                      return this.selectedSection(Arr);
                    }
                    this.selectedSection([]);
                  }}
                />
              </View>
            </View>
          ) : null}
        </ScrollView>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: hp('3'),
          }}>
          <CustomButton
            title={this.props.reUse ? 'Apply' : 'Next'}
            onPress={() => {
              this.goToCircularStep2();
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
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#f05760',
    borderRadius: 20,
    width: wp('35'),
    paddingRight: wp('7'),
    marginTop: '4%',
  },
  buttonText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#ffffff',
  },
  btImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  innerTextDropdown: {margin: '1%', height: 40},
  DropdownStyle: {
    elevation: 2,
    shadowColor: 'silver',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingLeft: 15,
    borderWidth: 1,
  },
  DropdownCOntainer: {
    marginTop: '4%',
    marginLeft: '4%',
    marginRight: '4%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});
