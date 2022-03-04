import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import CustomFastImage from './common/CustomFastImage';
import {CustomHeader} from './CustomHeader';
import {Overlay} from 'react-native-elements';
import Circular from '../Circular/Circular';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Loader} from './Loader';
import config from '../config/config';
import {Fab} from 'native-base';
import * as Progress from 'react-native-progress';
import Toast from 'react-native-tiny-toast';
import AntIcon from 'react-native-vector-icons/Ionicons';
import {CustomTabs} from './common/CustomTabs';
import {CustomButton} from './common/Button';
import MultiSelect from 'react-native-multiple-select';
import ResponsiveSize from '../config/ResponsiveSize';
import RBSheet from 'react-native-raw-bottom-sheet';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {AnimatedCheckBox} from './common/AnimatedCheckBox';
import CommonDatePicker from './common/CommonDatePicker';
const ThemeColor = '#6CCFDB';
const TabColor = '#7260E9';
const Color1 = '#7260E9';
const Color2 = '#23C4D7';
const Color3 = '#6397F2';
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};
class ChartModel extends Component {
  render() {
    return this.props.Arr.map((item, index) => {
      return (
        <View
          style={{
            width: '100%',
            backgroundColor: 'white',
            marginTop: 10,
          }}>
          <View
            style={{
              width: '100%',
              paddingHorizontal: 10,
              justifyContent: 'center',
              backgroundColor: 'white',
              elevation: 3,
              shadowColor: 'silver',
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 0.6,
            }}>
            <Text
              style={[
                styles.text,
                {color: ThemeColor, fontWeight: 'bold', lineHeight: 30},
              ]}>
              {item.heading}
            </Text>
          </View>
          {item.data.map((item, index) => {
            return (
              <View style={[styles.row, {height: 40, paddingHorizontal: 10}]}>
                <View style={{width: '50%'}}>
                  <Text style={[styles.text, {color: 'black', lineHeight: 30}]}>
                    {item.heading}
                  </Text>
                </View>
                <View
                  style={[
                    styles.row,
                    {width: '50%', flexDirection: 'row-reverse'},
                  ]}>
                  <View
                    style={{
                      width: '70%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Progress.Bar
                      progress={item.score / item.total / 10}
                      width={100}
                      height={20}
                      borderWidth={0}
                      color={
                        this.props.progressColor
                          ? index % 2
                            ? 'red'
                            : this.props.progressColor
                          : ThemeColor
                      }
                    />
                  </View>
                  <View
                    style={{
                      width: '30%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={[styles.text, {color: 'black', lineHeight: 30}]}>
                      {item.score}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      );
    });
  }
}
class Filter extends Component {
  constructor() {
    super();
    this.state = {
      selectedColleges: [],
      selectedBranches: [],
      selectedEducationLevel: [],
      selectedDegree: [],
      selectedDepartment: [],
      selectedSemester: [],
      selectedSection: [],
      selectedLedgers: [],
      selectedHeaders: [],
      selectedLibraries: [],
      selectedStaffCategories: [],
      selectedDesignations: [],
      selectedStaff: [],
      //Date: new Date(),
    };
  }
  render() {
    return (
      <SafeAreaView
        style={{
          backgroundColor: 'white',
          width: '100%',
          //height: '85%',
          flex: 1,
        }}>
        <CustomHeader
          isHome={null}
          title={'Filter'}
          navigation={this.props.navigation}
        />
        <ScrollView
          contentContainerStyle={{paddingBottom: 100}}
          ref={(scrollView) => (this.scrollView = scrollView)}>
          {this.props.College && (
            <View style={styles.DropdownCOntainer}>
              <MultiSelect
                styleMainWrapper={{
                  width: ScreenWidth - 100,
                }}
                items={this.props.College}
                uniqueKey="id"
                ref={(component) => {
                  this.multiSelect = component;
                }}
                onSelectedItemsChange={(selectedColleges) => {
                  this.setState({selectedColleges});
                }}
                selectedItems={this.state.selectedColleges}
                selectText="Search By College "
                searchInputPlaceholderText="Search By College "
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
              <View style={styles.checkBoxContainer}>
                <AnimatedCheckBox
                  size={25}
                  disableBuiltInState={true}
                  iconStyle={{
                    borderRadius: 5,
                    borderColor: Color3,
                  }}
                  textStyle={{fontFamily: 'Poppins-Regular'}}
                  isChecked={this.state.Checked13 ? true : false}
                  fillColor={Color3}
                  unfillColor={'white'}
                  onPress={() => {
                    //this.scrollView.scrollToEnd();
                    //this.scrollView.scrollTo({y: 300, animated: true});
                    this.setState({Checked13: !this.state.Checked13});
                    let Arr = [];
                    this.props.College.map((item, index) => {
                      Arr.push(item.id);
                      this.setState({selectedColleges: Arr}, function () {});
                    });
                    if (!this.state.Checked13) {
                      return this.setState({selectedColleges: Arr});
                    }
                    this.setState({selectedColleges: []});
                  }}
                />
              </View>
            </View>
          )}
          {this.props.BatchArr &&
            (this.props.activeTab == 'Student' ||
              this.props.activeTab == 'Block Box' ||
              this.props.activeTab == 'Hr' ||
              this.props.activeTab == 'Library' ||
              this.props.activeTab == 'Finance' ||
              this.props.activeTab == 'Attendance' ||
              (this.props.activeTab == 'E-Circular' &&
                this.props.ActiveEcircularTab == 'Student')) && (
              <View style={styles.DropdownCOntainer}>
                <MultiSelect
                  styleMainWrapper={{
                    width: ScreenWidth - 100,
                  }}
                  items={this.props.BatchArr}
                  uniqueKey="id"
                  ref={(component) => {
                    this.multiSelect = component;
                  }}
                  onSelectedItemsChange={(selectedBranches) => {
                    this.setState({selectedBranches});
                  }}
                  selectedItems={this.state.selectedBranches}
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
                <View style={styles.checkBoxContainer}>
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
                      //this.scrollView.scrollToEnd();
                      //this.scrollView.scrollTo({y: 300, animated: true});
                      ////console.log(this.multiSelect.props);
                      this.setState({Checked: !this.state.Checked});
                      let Arr = [];
                      this.props.BatchArr.map((item, index) => {
                        Arr.push(item.id);
                        this.setState({selectedBranches: Arr}, function () {});
                      });
                      if (!this.state.Checked) {
                        return this.setState({selectedBranches: Arr});
                      }
                      this.setState({selectedBranches: []});
                    }}
                  />
                </View>
              </View>
            )}

          {this.props.EducationArr &&
            (this.props.activeTab == 'Student' ||
              this.props.activeTab == 'Block Box' ||
              this.props.activeTab == 'Library' ||
              this.props.activeTab == 'Finance' ||
              this.props.activeTab == 'Attendance' ||
              (this.props.activeTab == 'E-Circular' &&
                this.props.ActiveEcircularTab == 'Student')) && (
              <View style={styles.DropdownCOntainer}>
                <MultiSelect
                  styleMainWrapper={{
                    width: ScreenWidth - 100,
                  }}
                  items={this.props.EducationArr}
                  uniqueKey="id"
                  ref={(component) => {
                    this.multiSelect = component;
                  }}
                  onSelectedItemsChange={(selectedEducationLevel) => {
                    this.setState({selectedEducationLevel});
                  }}
                  selectedItems={this.state.selectedEducationLevel}
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
                <View style={styles.checkBoxContainer}>
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
                      //this.scrollView.scrollToEnd();
                      ////console.log(this.multiSelect.items);
                      this.setState({Checked2: !this.state.Checked2});
                      let Arr = [];
                      this.props.EducationArr.map((item, index) => {
                        Arr.push(item.id);
                        this.setState(
                          {selectedEducationLevel: Arr},
                          function () {},
                        );
                      });
                      if (!this.state.Checked2) {
                        return this.setState({selectedEducationLevel: Arr});
                      }
                      this.setState({selectedEducationLevel: []});
                    }}
                  />
                </View>
              </View>
            )}
          {this.props.CourseArr &&
            (this.props.activeTab == 'Student' ||
              this.props.activeTab == 'Block Box' ||
              this.props.activeTab == 'Library' ||
              this.props.activeTab == 'Attendance' ||
              (this.props.activeTab == 'E-Circular' &&
                this.props.ActiveEcircularTab == 'Student')) && (
              <View style={styles.DropdownCOntainer}>
                <MultiSelect
                  styleMainWrapper={{
                    width: ScreenWidth - 100,
                  }}
                  items={this.props.CourseArr}
                  uniqueKey="id"
                  ref={(component) => {
                    this.multiSelectDegree = component;
                  }}
                  onSelectedItemsChange={(selectedDegree) => {
                    this.setState({selectedDegree});
                  }}
                  selectedItems={this.state.selectedDegree}
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
                <View style={styles.checkBoxContainer}>
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
                      //this.scrollView.scrollToEnd();
                      ////console.log(this.multiSelect.items);
                      this.setState({Checked3: !this.state.Checked3});
                      let Arr = [];
                      this.props.CourseArr.map((item, index) => {
                        Arr.push(item.id);
                        this.setState({selectedDegree: Arr}, function () {
                          //console.log(this.state.selectedDegree);
                        });
                      });
                      if (!this.state.Checked3) {
                        return this.setState({selectedDegree: Arr});
                      }
                      this.setState({selectedDegree: []});
                    }}
                  />
                </View>
              </View>
            )}
          {this.props.DepartmentArr &&
            (this.props.activeTab == 'Student' ||
              this.props.activeTab == 'Block Box' ||
              this.props.activeTab == 'Hr' ||
              this.props.activeTab == 'Hour Wise Free Staff' ||
              this.props.activeTab == 'Staff Wise Work Load' ||
              this.props.activeTab == 'Library' ||
              this.props.activeTab == 'Finance' ||
              this.props.activeTab == 'Attendance' ||
              this.props.activeTab == 'E-Circular') && (
              <View style={styles.DropdownCOntainer}>
                <MultiSelect
                  styleMainWrapper={{
                    width: ScreenWidth - 100,
                  }}
                  items={this.props.DepartmentArr}
                  uniqueKey="id"
                  ref={(component) => {
                    this.multiSelect = component;
                  }}
                  onSelectedItemsChange={(selectedDepartment) => {
                    this.setState({selectedDepartment});
                  }}
                  selectedItems={this.state.selectedDepartment}
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
                <View style={styles.checkBoxContainer}>
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
                      //this.scrollView.scrollToEnd();
                      ////console.log(this.multiSelect.items);
                      this.setState({Checked4: !this.state.Checked4});
                      let Arr = [];
                      this.props.DepartmentArr.map((item, index) => {
                        Arr.push(item.id);
                        this.setState(
                          {selectedDepartment: Arr},
                          function () {},
                        );
                      });
                      if (!this.state.Checked4) {
                        return this.setState({selectedDepartment: Arr});
                      }
                      this.setState({selectedDepartment: []});
                    }}
                  />
                </View>
              </View>
            )}

          {this.props.SemesterArr &&
            (this.props.activeTab == 'Student' ||
              this.props.activeTab == 'Block Box' ||
              (this.props.activeTab == 'E-Circular' &&
                this.props.ActiveEcircularTab == 'Student')) && (
              <View style={styles.DropdownCOntainer}>
                <MultiSelect
                  styleMainWrapper={{
                    width: ScreenWidth - 100,
                  }}
                  items={this.props.SemesterArr}
                  uniqueKey="id"
                  ref={(component) => {
                    this.multiSelect = component;
                  }}
                  onSelectedItemsChange={(selectedSemester) => {
                    this.setState({selectedSemester});
                  }}
                  selectedItems={this.state.selectedSemester}
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
                <View style={styles.checkBoxContainer}>
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
                      //this.scrollView.scrollToEnd();
                      ////console.log(this.multiSelect.items);
                      this.setState({Checked5: !this.state.Checked5});
                      let Arr = [];
                      this.props.SemesterArr.map((item, index) => {
                        Arr.push(item.id);
                        this.setState({selectedSemester: Arr}, function () {});
                      });
                      if (!this.state.Checked5) {
                        return this.setState({selectedSemester: Arr});
                      }
                      this.setState({selectedSemester: []});
                    }}
                  />
                </View>
              </View>
            )}
          {this.props.SectionArr &&
            (this.props.activeTab == 'Student' ||
              (this.props.activeTab == 'E-Circular' &&
                this.props.ActiveEcircularTab == 'Student')) && (
              <View style={styles.DropdownCOntainer}>
                <MultiSelect
                  styleMainWrapper={{
                    width: ScreenWidth - 100,
                  }}
                  items={this.props.SectionArr}
                  uniqueKey="id"
                  ref={(component) => {
                    this.multiSelect = component;
                  }}
                  onSelectedItemsChange={(selectedSection) => {
                    this.setState({selectedSection});
                  }}
                  selectedItems={this.state.selectedSection}
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
                <View style={styles.checkBoxContainer}>
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
                      //this.scrollView.scrollToEnd();
                      ////console.log(this.multiSelect.items);
                      this.setState({Checked6: !this.state.Checked6});
                      let Arr = [];
                      this.props.SectionArr.map((item, index) => {
                        Arr.push(item.id);
                        this.setState({selectedSection: Arr}, function () {});
                      });
                      if (!this.state.Checked6) {
                        return this.setState({selectedSection: Arr});
                      }
                      this.setState({selectedSection: []});
                    }}
                  />
                </View>
              </View>
            )}
          {this.props.HeadersArr && this.props.activeTab == 'Finance' && (
            <View style={styles.DropdownCOntainer}>
              <MultiSelect
                styleMainWrapper={{
                  width: ScreenWidth - 100,
                }}
                items={this.props.HeadersArr}
                uniqueKey="id"
                ref={(component) => {
                  this.multiSelect = component;
                }}
                onSelectedItemsChange={(selectedHeaders) => {
                  this.setState({selectedHeaders});
                }}
                selectedItems={this.state.selectedHeaders}
                selectText="Search By Header "
                searchInputPlaceholderText="Search By Header "
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
              <View style={styles.checkBoxContainer}>
                <AnimatedCheckBox
                  size={25}
                  disableBuiltInState={true}
                  iconStyle={{
                    borderRadius: 5,
                    borderColor: Color2,
                  }}
                  textStyle={{fontFamily: 'Poppins-Regular'}}
                  isChecked={this.state.Checked8 ? true : false}
                  fillColor={Color2}
                  unfillColor={'white'}
                  onPress={() => {
                    //this.scrollView.scrollToEnd();
                    ////console.log(this.multiSelect.items);
                    this.setState({Checked8: !this.state.Checked8});
                    let Arr = [];
                    this.props.HeadersArr.map((item, index) => {
                      Arr.push(item.id);
                      this.setState({selectedHeaders: Arr}, function () {});
                    });
                    if (!this.state.Checked8) {
                      return this.setState({selectedHeaders: Arr});
                    }
                    this.setState({selectedHeaders: []});
                  }}
                />
              </View>
            </View>
          )}
          {this.props.LedgersArr && this.props.activeTab == 'Finance' && (
            <View style={styles.DropdownCOntainer}>
              <MultiSelect
                styleMainWrapper={{
                  width: ScreenWidth - 100,
                }}
                items={this.props.LedgersArr}
                uniqueKey="id"
                ref={(component) => {
                  this.multiSelect = component;
                }}
                onSelectedItemsChange={(selectedLedgers) => {
                  this.setState({selectedLedgers});
                }}
                selectedItems={this.state.selectedLedgers}
                selectText="Search By Ledger "
                searchInputPlaceholderText="Search By Ledger "
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
              <View style={styles.checkBoxContainer}>
                <AnimatedCheckBox
                  size={25}
                  disableBuiltInState={true}
                  iconStyle={{
                    borderRadius: 5,
                    borderColor: Color1,
                  }}
                  textStyle={{fontFamily: 'Poppins-Regular'}}
                  isChecked={this.state.Checked7 ? true : false}
                  fillColor={Color1}
                  unfillColor={'white'}
                  onPress={() => {
                    //this.scrollView.scrollToEnd();
                    ////console.log(this.multiSelect.items);
                    this.setState({Checked7: !this.state.Checked7});
                    let Arr = [];
                    this.props.LedgersArr.map((item, index) => {
                      Arr.push(item.id);
                      this.setState({selectedLedgers: Arr}, function () {});
                    });
                    if (!this.state.Checked7) {
                      return this.setState({selectedLedgers: Arr});
                    }
                    this.setState({selectedLedgers: []});
                  }}
                />
              </View>
            </View>
          )}

          {this.props.LibraryArr && this.props.activeTab == 'Library' && (
            <View style={styles.DropdownCOntainer}>
              <MultiSelect
                styleMainWrapper={{
                  width: ScreenWidth - 100,
                }}
                items={this.props.LibraryArr}
                uniqueKey="id"
                ref={(component) => {
                  this.multiSelect = component;
                }}
                onSelectedItemsChange={(selectedLibraries) => {
                  this.setState({selectedLibraries});
                }}
                selectedItems={this.state.selectedLibraries}
                selectText="Search By Library "
                searchInputPlaceholderText="Search By Library "
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
              <View style={styles.checkBoxContainer}>
                <AnimatedCheckBox
                  size={25}
                  disableBuiltInState={true}
                  iconStyle={{
                    borderRadius: 5,
                    borderColor: Color3,
                  }}
                  textStyle={{fontFamily: 'Poppins-Regular'}}
                  isChecked={this.state.Checked9 ? true : false}
                  fillColor={Color3}
                  unfillColor={'white'}
                  onPress={() => {
                    //this.scrollView.scrollToEnd();
                    ////console.log(this.multiSelect.items);
                    this.setState({Checked9: !this.state.Checked9});
                    let Arr = [];
                    this.props.LibraryArr.map((item, index) => {
                      Arr.push(item.id);
                      this.setState({selectedLibraries: Arr}, function () {});
                    });
                    if (!this.state.Checked9) {
                      return this.setState({selectedLibraries: Arr});
                    }
                    this.setState({selectedLibraries: []});
                  }}
                />
              </View>
            </View>
          )}
          {this.props.StaffCategoryArr &&
            (this.props.activeTab == 'Hour Wise Free Staff' ||
              this.props.activeTab == 'Staff Wise Work Load') && (
              <View style={styles.DropdownCOntainer}>
                <MultiSelect
                  styleMainWrapper={{
                    width: ScreenWidth - 100,
                  }}
                  items={this.props.StaffCategoryArr}
                  uniqueKey="id"
                  ref={(component) => {
                    this.multiSelect = component;
                  }}
                  onSelectedItemsChange={(selectedStaffCategories) => {
                    this.setState({selectedStaffCategories});
                  }}
                  selectedItems={this.state.selectedStaffCategories}
                  selectText="Search By Staff Category "
                  searchInputPlaceholderText="Search By Staff Category "
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
                <View style={styles.checkBoxContainer}>
                  <AnimatedCheckBox
                    size={25}
                    disableBuiltInState={true}
                    iconStyle={{
                      borderRadius: 5,
                      borderColor: Color1,
                    }}
                    textStyle={{fontFamily: 'Poppins-Regular'}}
                    isChecked={this.state.Checked10 ? true : false}
                    fillColor={Color1}
                    unfillColor={'white'}
                    onPress={() => {
                      //this.scrollView.scrollToEnd();
                      ////console.log(this.multiSelect.items);
                      this.setState({Checked10: !this.state.Checked10});
                      let Arr = [];
                      this.props.StaffCategoryArr.map((item, index) => {
                        Arr.push(item.id);
                        this.setState(
                          {selectedStaffCategories: Arr},
                          function () {},
                        );
                      });
                      if (!this.state.Checked10) {
                        return this.setState({selectedStaffCategories: Arr});
                      }
                      this.setState({selectedStaffCategories: []});
                    }}
                  />
                </View>
              </View>
            )}
          {this.props.DesignationArr &&
            (this.props.activeTab == 'Hr' ||
              this.props.activeTab == 'Hour Wise Free Staff' ||
              this.props.activeTab == 'Staff Wise Work Load' ||
              (this.props.activeTab == 'E-Circular' &&
                this.props.ActiveEcircularTab == 'Staff')) && (
              <View style={styles.DropdownCOntainer}>
                <MultiSelect
                  styleMainWrapper={{
                    width: ScreenWidth - 100,
                  }}
                  items={this.props.DesignationArr}
                  uniqueKey="id"
                  ref={(component) => {
                    this.multiSelect = component;
                  }}
                  onSelectedItemsChange={(selectedDesignations) => {
                    this.setState({selectedDesignations});
                  }}
                  selectedItems={this.state.selectedDesignations}
                  selectText="Search By Designation "
                  searchInputPlaceholderText="Search By Designation "
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
                <View style={styles.checkBoxContainer}>
                  <AnimatedCheckBox
                    size={25}
                    disableBuiltInState={true}
                    iconStyle={{
                      borderRadius: 5,
                      borderColor: Color2,
                    }}
                    textStyle={{fontFamily: 'Poppins-Regular'}}
                    isChecked={this.state.Checked11 ? true : false}
                    fillColor={Color2}
                    unfillColor={'white'}
                    onPress={() => {
                      //this.scrollView.scrollToEnd();
                      ////console.log(this.multiSelect.items);
                      this.setState({Checked11: !this.state.Checked11});
                      let Arr = [];
                      this.props.DesignationArr.map((item, index) => {
                        Arr.push(item.id);
                        this.setState(
                          {selectedDesignations: Arr},
                          function () {},
                        );
                      });
                      if (!this.state.Checked11) {
                        return this.setState({selectedDesignations: Arr});
                      }
                      this.setState({selectedDesignations: []});
                    }}
                  />
                </View>
              </View>
            )}
          {this.props.StaffArr &&
            (this.props.activeTab == 'Block Box' ||
              this.props.activeTab == 'Hour Wise Free Staff' ||
              this.props.activeTab == 'Staff Wise Work Load' ||
              (this.props.activeTab == 'E-Circular' &&
                this.props.ActiveEcircularTab == 'Staff')) && (
              <View style={styles.DropdownCOntainer}>
                <MultiSelect
                  styleMainWrapper={{
                    width: ScreenWidth - 100,
                  }}
                  items={this.props.StaffArr}
                  uniqueKey="id"
                  ref={(component) => {
                    this.multiSelect = component;
                  }}
                  onSelectedItemsChange={(selectedStaff) => {
                    this.setState({selectedStaff});
                  }}
                  selectedItems={this.state.selectedStaff}
                  selectText="Search By Staff "
                  searchInputPlaceholderText="Search By Staff "
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
                <View style={styles.checkBoxContainer}>
                  <AnimatedCheckBox
                    size={25}
                    disableBuiltInState={true}
                    iconStyle={{
                      borderRadius: 5,
                      borderColor: Color3,
                    }}
                    textStyle={{fontFamily: 'Poppins-Regular'}}
                    isChecked={this.state.Checked12 ? true : false}
                    fillColor={Color3}
                    unfillColor={'white'}
                    onPress={() => {
                      //this.scrollView.scrollToEnd();
                      ////console.log(this.multiSelect.items);
                      this.setState({Checked12: !this.state.Checked12});
                      let Arr = [];
                      this.props.StaffArr.map((item, index) => {
                        Arr.push(item.id);
                        this.setState({selectedStaff: Arr}, function () {});
                      });
                      if (!this.state.Checked12) {
                        return this.setState({selectedStaff: Arr});
                      }
                      this.setState({selectedStaff: []});
                    }}
                  />
                </View>
              </View>
            )}

          {this.props.DateRequired &&
            (this.props.activeTab == 'Block Box' ||
              this.props.activeTab == 'Hour Wise Free Staff' ||
              this.props.activeTab == 'Library' ||
              this.props.activeTab == 'Attendance') && (
              <View
                style={[
                  styles.DropdownCOntainer,
                  {justifyContent: 'flex-start', marginLeft: 25},
                ]}>
                <CommonDatePicker
                  style={{width: ScreenWidth - 130}}
                  flexDirection={'row-reverse'}
                  borderColor={Color1}
                  date={this.state.Date}
                  mode="date"
                  placeholder={'Choose Date'}
                  format="YYYY-MM-DD"
                  //minDate="2020-01-01"
                  //maxDate={new Date()}
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  showIcon={false}
                  backgroundColor="white"
                  onDateChange={(date) => {
                    this.setState(
                      {
                        Date: date,
                      },
                      function () {
                        //this.state.fromDate != '' &&
                        //  this.state.toDate != '' &&
                        //this.onLoadGetHomework();
                      },
                    );
                  }}
                />
              </View>
            )}
        </ScrollView>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 10,
          }}>
          <CustomButton
            color={TabColor}
            title={'Apply'}
            onPress={() => {
              this.props.SelectedData(
                this.state.selectedBranches,
                this.state.selectedEducationLevel,
                this.state.selectedDegree,
                this.state.selectedDepartment,
                this.state.selectedSemester,
                this.state.selectedSection,
                this.state.selectedLedgers,
                this.state.selectedHeaders,
                this.state.selectedLibraries,
                this.state.selectedStaffCategories,
                this.state.selectedDesignations,
                this.state.selectedStaff,
                this.state.Date,
              );
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
}
export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      OverLayVisible: false,
      Loader: false,
      activeButton: 'Fee Alot Chart',
      activeTab: 'Attendance',
      //activeTab: 'Student',
    };
  }
  componentDidMount() {
    console.log('this.props = ', this.props);
    this.retrieveData();
  }
  retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        //console.log(value);
        this.setState({Token: value}, function () {
          //this.onPressGetAllFilter();
        });
      }
    } catch (error) {
      alert('Error retrieving data');
    }
    try {
      const value = await AsyncStorage.getItem('collegeCode');
      if (value !== null) {
        let college = [];
        college.push(value);
        this.setState({college});
      }
    } catch (error) {
      alert('Error retrieving data');
    }
    try {
      const value = await AsyncStorage.getItem('userId');
      //console.log('token = ', value);
      if (value !== null) {
        this.setState({userId: value});
      }
    } catch (error) {
      alert('Error retrieving data');
    }
    //try {
    //  const value = await AsyncStorage.getItem('desigName');
    //  alert('desigName = ', value);
    //  if (value !== null) {
    //    this.setState({desigName: value});
    //  }
    //} catch (error) {
    //  alert('Error retrieving data');
    //}
  };

  //onPressGetAllFilter = () => {
  //  //const url = config.baseUrl2 + 'dashboard/GetAllDashboard';
  //  const url = config.baseUrl2 + 'staff/GetAllFilters';
  //  //const url = config.baseUrl2 + 'dashboard/GetOverallChartData';
  //  let bodyData = JSON.stringify({
  //    //  collegeCode: this.state.college,
  //    //  departmentIds: this.state.departmentIds,
  //    //  designationIds: ['string'],
  //    //  categoriesId: ['string'],
  //    //  staffIds: ['string'],
  //    //  type: 0,
  //    //  fromDate: 'string',
  //    //  toDate: 'string',
  //    //  batchYearIds: this.state.batchYearIds,
  //    //  degreeCodeIds: this.state.degreeCodeIds,
  //    //  semIds: this.state.semIds,
  //    //  selectionIds: ['string'],
  //    //  courseIds: ['string'],
  //    //  isDefault: true,
  //    //  examIds: ['string'],
  //    //  userId: this.state.userId,
  //    //  eduIds: this.state.eduIds,
  //    //  sectionIds: this.state.sectionIds,
  //  });
  //  let headerData = {
  //    headers: {
  //      Accept: 'application/json',
  //      'Content-Type': 'application/json',
  //      Authorization: 'Bearer ' + this.state.Token,
  //    },
  //  };
  //  console.log(url);
  //  console.log('bodyData = ', bodyData);
  //  axios
  //    .post(url, bodyData, headerData)
  //    .then((response) => {
  //      //alert(JSON.stringify(response));
  //      console.log('response = ', response.data);
  //      if (response.data) {
  //        this.setState(
  //          {Loader: false, filteredData: response.data},
  //          function () {
  //            this.onPressGetAllDashboard();
  //          },
  //        );
  //      } else {
  //        this.setState({Loader: false}, function () {
  //          Toast.show(response.data.message, ToastData);
  //        });
  //      }
  //    })
  //    .catch((error) => {
  //      this.setState({Loader: false}, function () {
  //        alert(error);
  //        console.log('error = ', error);
  //      });
  //    });
  //};

  //onPressGetAllDashboard = () => {
  //  const url = config.baseUrl2 + 'dashboard/GetAllDashboard';
  //  let filteredData = this.state.filteredData;
  //  let bodyData = JSON.stringify({
  //    filteredData,
  //  });
  //  let headerData = {
  //    headers: {
  //      Accept: 'application/json',
  //      'Content-Type': 'application/json',
  //      Authorization: 'Bearer ' + this.state.Token,
  //    },
  //  };
  //  console.log(url);
  //  console.log('bodyData = ', bodyData);
  //  axios
  //    .post(url, bodyData, headerData)
  //    .then((response) => {
  //      //alert(JSON.stringify(response));
  //      console.log('response = ', JSON.stringify(response.data));
  //      if (response.data) {
  //        this.setState({Loader: false}, function () {});
  //      } else {
  //        this.setState({Loader: false}, function () {
  //          Toast.show(response.data.message, ToastData);
  //        });
  //      }
  //    })
  //    .catch((error) => {
  //      this.setState({Loader: false}, function () {
  //        alert(error);
  //        console.log('error = ', error);
  //      });
  //    });
  //};

  render() {
    return (
      <View style={styles.mainContainer}>
        <Loader
          Loading={this.state.Loader ? true : false}
          onPressCancel={() => {
            this.setState({Loader: false});
          }}
        />
        <CustomHeader
          isHome={true}
          title={'Dashboard'}
          navigation={this.props.navigation}
        />
        <View
          style={{
            backgroundColor: '#F5F5F5',
            width: '100%',
          }}>
          <View style={[styles.basicStyle, {backgroundColor: 'white'}]}>
            <CustomTabs
              borderRadius={0}
              height={50}
              width={'100%'}
              textSize={14}
              scroll
              color={TabColor}
              textColor={'white'}
              backgroundColor={'transparent'}
              borderBottomColor={TabColor}
              ActiveTab={this.state.activeTab}
              type="bottom"
              //tab1Width={'50%'}
              //tab2Width={'50%'}
              tab1="Student"
              tab2="Block Box"
              tab3="Hour Wise Free Staff"
              tab4="Staff Wise Work Load"
              tab5="Attendance"
              tab6="Internal Mark"
              tab7="Hr"
              tab8="Finance"
              tab9="Library"
              tab10="COE"
              tab11="IP Camera"
              tab11="E-Circular"
              //scroll
              onPress={(value) => {
                this.setState({activeTab: value}, () => {});
              }}
            />
          </View>
          <View style={{width: '100%', height: '87%'}}>
            <ScrollView>
              {this.state.activeTab == 'Student' && <ChartModel Arr={Arr} />}
              {this.state.activeTab == 'Block Box' && (
                <ChartModel Arr={BlockBoxArr} />
              )}
              {this.state.activeTab == 'Hour Wise Free Staff' && (
                <ChartModel Arr={HourWiseArr} />
              )}
              {this.state.activeTab == 'Staff Wise Work Load' && (
                <ChartModel Arr={StaffWiseWorkLoadArr} />
              )}
              {this.state.activeTab == 'Attendance' && (
                <ChartModel progressColor={'#45CC16'} Arr={AttendanceArr} />
              )}
              {this.state.activeTab == 'Internal Mark' && (
                <ChartModel Arr={Arr} />
              )}
              {this.state.activeTab == 'Hr' && <ChartModel Arr={HrArr} />}
              {this.state.activeTab == 'Finance' && (
                <View>
                  <View style={[styles.row, {paddingVertical: 10}]}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({activeButton: 'Fee Alot Chart'});
                      }}
                      style={[
                        styles.row,
                        {
                          width: '40%',
                          backgroundColor:
                            this.state.activeButton == 'Fee Alot Chart'
                              ? TabColor
                              : 'transparent',
                          height: 35,
                          borderRadius: 20,
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: 10,
                          borderColor: 'silver',
                          borderWidth:
                            this.state.activeButton == 'Fee Alot Chart' ? 0 : 1,
                        },
                      ]}>
                      <Text
                        style={[
                          styles.text,
                          {
                            color:
                              this.state.activeButton == 'Fee Alot Chart'
                                ? 'white'
                                : 'black',
                          },
                        ]}>
                        Fee Alot Chart
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          activeButton: 'Data Wise Fee Collection',
                        });
                      }}
                      style={[
                        styles.row,
                        {
                          width: '50%',
                          backgroundColor:
                            this.state.activeButton ==
                            'Data Wise Fee Collection'
                              ? TabColor
                              : 'transparent',
                          height: 35,
                          borderRadius: 20,
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: 10,
                          borderColor: 'silver',
                          borderWidth:
                            this.state.activeButton ==
                            'Data Wise Fee Collection'
                              ? 0
                              : 1,
                        },
                      ]}>
                      <Text
                        style={[
                          styles.text,
                          {
                            color:
                              this.state.activeButton ==
                              'Data Wise Fee Collection'
                                ? 'white'
                                : 'black',
                          },
                        ]}>
                        Data Wise Fee Collection
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={[
                      styles.row,
                      {
                        justifyContent: 'flex-end',
                        backgroundColor: 'white',
                        paddingVertical: 10,
                      },
                    ]}>
                    <CommonDatePicker
                      style={{width: 100}}
                      //flexDirection={'row-reverse'}
                      borderColor={'silver'}
                      date={this.state.Date2}
                      mode="date"
                      placeholder={'From Date'}
                      format="YYYY-MM-DD"
                      //minDate="2020-01-01"
                      //maxDate={new Date()}
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      showIcon={false}
                      backgroundColor="white"
                      onDateChange={(date) => {
                        this.setState(
                          {
                            Date2: date,
                          },
                          function () {
                            //this.state.fromDate != '' &&
                            //  this.state.toDate != '' &&
                            //this.onLoadGetHomework();
                          },
                        );
                      }}
                    />
                    <View style={{width: 20}}></View>
                    <CommonDatePicker
                      style={{width: 100}}
                      //flexDirection={'row-reverse'}
                      borderColor={'silver'}
                      date={this.state.Date3}
                      mode="date"
                      placeholder={'To Date'}
                      format="YYYY-MM-DD"
                      //minDate="2020-01-01"
                      //maxDate={new Date()}
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      showIcon={false}
                      backgroundColor="white"
                      onDateChange={(date) => {
                        this.setState(
                          {
                            Date3: date,
                          },
                          function () {
                            //this.state.fromDate != '' &&
                            //  this.state.toDate != '' &&
                            //this.onLoadGetHomework();
                          },
                        );
                      }}
                    />
                    <View style={{width: 20}}></View>
                  </View>
                  <ChartModel Arr={Arr} />
                </View>
              )}
              {this.state.activeTab == 'Library' && (
                <ChartModel Arr={LibraryArr} />
              )}
              {this.state.activeTab == 'COE' && <ChartModel Arr={Arr} />}
              {this.state.activeTab == 'IP Camera' && <ChartModel Arr={Arr} />}
              {this.state.activeTab == 'E-Circular' && <ChartModel Arr={Arr} />}
            </ScrollView>
            {this.props?.route?.name === 'BottomTabHomeScreen' ? (
              <Fab
                onPress={() => {
                  this.RBSheet.open();
                  //this.setState({OverLayVisible: true});
                }}
                renderInPortal={false}
                shadow={2}
                size="sm"
                backgroundColor={TabColor}
                icon={
                  <AntIcon name="md-filter-sharp" color={'white'} size={20} />
                }
              />
            ) : null}

            <RBSheet
              ref={(ref) => {
                this.RBSheet = ref;
              }}
              height={ScreenHeight - 60}
              openDuration={250}
              customStyles={{
                container: {
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              }}>
              <Filter
                activeTab={this.state.activeTab}
                College={[{id: 12, name: 'dfsdrgd'}]}
                BatchArr={[{id: 0, name: 'dfsdrgd'}]}
                EducationArr={[{id: 1, name: 'asdf'}]}
                CourseArr={[{id: 2, name: 'rgrb'}]}
                DepartmentArr={[{id: 3, name: 'ewer'}]}
                SemesterArr={[{id: 4, name: 'rgtb'}]}
                SectionArr={[{id: 5, name: 'jy'}]}
                StaffArr={[{id: 6, name: 'frv'}]}
                DesignationArr={[{id: 7, name: 'bgre'}]}
                StaffCategoryArr={[{id: 8, name: 'yht'}]}
                LibraryArr={[{id: 9, name: 'dcs'}]}
                HeadersArr={[{id: 10, name: 'ewfwe'}]}
                LedgersArr={[{id: 11, name: 'egr'}]}
                DateRequired={true}
                SelectedData={(
                  selectedBranches,
                  selectedEducationLevel,
                  selectedDegree,
                  selectedDepartment,
                  selectedSemester,
                  selectedSection,
                  selectedLedgers,
                  selectedHeaders,
                  selectedLibraries,
                  selectedStaffCategories,
                  selectedDesignations,
                  selectedStaff,
                  Date,
                ) =>
                  //console.log(
                  //  selectedBranches,
                  //  selectedEducationLevel,
                  //  selectedDegree,
                  //  selectedDepartment,
                  //  selectedSemester,
                  //  selectedSection,
                  //  selectedLedgers,
                  //  selectedHeaders,
                  //  selectedLibraries,
                  //  selectedStaffCategories,
                  //  selectedDesignations,
                  //  selectedStaff,
                  //  Date,
                  //)
                  {
                    this.setState(
                      {
                        selectedBranches,
                        selectedEducationLevel,
                        selectedDegree,
                        selectedDepartment,
                        selectedSemester,
                        selectedSection,
                        selectedLedgers,
                        selectedHeaders,
                        selectedLibraries,
                        selectedStaffCategories,
                        selectedDesignations,
                        selectedStaff,
                        Date,
                      },
                      () => {
                        this.RBSheet.close();
                      },
                    );
                  }
                }
              />
            </RBSheet>
          </View>
        </View>
      </View>
    );
  }
}

const AttendanceArr = [
  {
    heading: 'Attendance - 21/11/2021',
    data: [
      {heading: 'Present', total: '500', score: '400'},
      {heading: 'Absent', total: '500', score: '100'},
    ],
  },
  {
    heading: 'Attendance - 21/11/2021',
    data: [
      {heading: 'Present', total: '800', score: '700'},
      {heading: 'Absent', total: '800', score: '100'},
    ],
  },
];
const Arr = [
  {
    heading: 'Over All Chart',
    data: [
      {heading: 'Applied', total: '1000', score: '700'},
      {heading: 'Admitted', total: '1000', score: '300'},
    ],
  },
  {
    heading: 'Gender Chart',
    data: [
      {heading: 'Male', total: '1000', score: '700'},
      {heading: 'Female', total: '1000', score: '300'},
      {heading: 'Female', total: '1000', score: '10000'},
    ],
  },
];
const HrArr = [
  {
    heading: 'Category Type Chart',
    data: [
      {heading: 'Teaching', total: '1000', score: '700'},
      {heading: 'Non Teaching', total: '1000', score: '300'},
      {heading: 'Regular', total: '1000', score: '300'},
    ],
  },
  {
    heading: 'Gender Chart',
    data: [
      {heading: 'Male', total: '1000', score: '700'},
      {heading: 'Female', total: '1000', score: '300'},
    ],
  },
];
const StaffWiseWorkLoadArr = [
  {
    heading: 'Staff Wise Work Load',
    data: [
      {heading: 'Practical', total: '100', score: '90'},
      {heading: 'Theory', total: '100', score: '30'},
      {heading: 'Lab', total: '100', score: '60'},
      {heading: 'Project', total: '100', score: '20'},
      {heading: 'Others', total: '100', score: '40'},
      {heading: 'Visted Students', total: '100', score: '60'},
      {heading: 'Project Work', total: '100', score: '800'},
    ],
  },
];
const LibraryArr = [
  {
    heading: 'Library - 2',
    data: [
      {heading: 'Total Books', total: '1000', score: '1700'},
      {heading: 'Total Book Value', total: '1000', score: '1300'},
      {heading: 'Issued Books', total: '1000', score: '1600'},
      {heading: 'Due Books', total: '1000', score: '1200'},
      {heading: 'Lost Books', total: '1000', score: '1800'},
      {heading: 'Visted Students', total: '1000', score: '1900'},
      {heading: 'Total Staffs', total: '1000', score: '1100'},
    ],
  },
];
const BlockBoxArr = [
  {
    heading: 'Period Wise Chart',
    data: [
      {heading: 'Period - 1', total: '1000', score: '1700'},
      {heading: 'Period - 2', total: '1000', score: '1300'},
      {heading: 'Period - 3', total: '1000', score: '1600'},
      {heading: 'Period - 4', total: '1000', score: '1200'},
      {heading: 'Period - 5', total: '1000', score: '1800'},
      {heading: 'Period - 6', total: '1000', score: '1900'},
      {heading: 'Period - 7', total: '1000', score: '1100'},
      {heading: 'Period - 8', total: '1000', score: '1500'},
    ],
  },
];
const HourWiseArr = [
  {
    heading: 'Hour Wise Staff List - 21.12.2021',
    data: [
      {heading: 'Hour - 1', total: '1000', score: '1700'},
      {heading: 'Hour - 2', total: '1000', score: '1300'},
      {heading: 'Hour - 3', total: '1000', score: '1600'},
      {heading: 'Hour - 4', total: '1000', score: '1200'},
      {heading: 'Hour - 5', total: '1000', score: '1800'},
      {heading: 'Hour - 6', total: '1000', score: '1900'},
      {heading: 'Hour - 7', total: '1000', score: '1100'},
      {heading: 'Hour - 8', total: '1000', score: '1500'},
    ],
  },
];
const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  basicStyle: {width: '100%', justifyContent: 'center', alignItems: 'center'},

  row: {width: '100%', flexDirection: 'row', alignItems: 'center'},
  text: {
    fontFamily: 'Poppins:Regular',
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
    width: '100%',
    marginTop: '4%',
    //marginLeft: '4%',
    //marginRight: '4%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  checkBoxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 5,
    alignSelf: 'flex-start',
  },
});
const data2 = [{value: 80}, {value: 40}, {value: 60}, {value: 30}];
