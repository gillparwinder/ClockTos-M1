import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  BackHandler,
  Text,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {SearchBar} from 'react-native-elements';
import ResponsiveSize from '../../config/ResponsiveSize';
import {CustomHeader} from '../../components/CustomHeader';
import {CustomButton} from '../../components/common/Button';
import {Loader} from '../../components/Loader';
import config from '../../config/config';
import PickerElement from '../components/Picker';
import CustomCheckBox from '../components/CustomCheckBox';
import DisplayCard from '../components/DisplayCard';

export default class StudentFace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      departments: [],
      designations: [],
      categories: [],
      staffs: [],
      GetAllStaffWiseWorkload: [],
      Selectedcategories: [],
      Selecteddepartments: [],
      Selecteddesignations: [],
      Selectedstaffs: [],
      Token: '',
      checked: true,
      checked1: true,
      checked2: true,
      //Loader: true,
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
  retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        //alert(value);
        //console.log(value);
        this.setState({Token: value}, function () {
          this.onPressGetAllStaffWiseFilters();
        });
      }
    } catch (error) {
      alert('Error retrieving data');
    }
    try {
      const value = await AsyncStorage.getItem('collegeCode');
      if (value !== null) {
        //alert(value);
        let collegeCode = [];
        collegeCode.push(value.toString());
        this.setState({collegeCode, collegeCodeString: value}, function () {
          ////console.log('collegeCode = ', this.state.collegeCode);
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

  onPressGetAllStaffWiseFilters = () => {
    const url = config.baseUrl2 + 'dashboard/GetAllStaffWiseFilters';
    //console.log(url);
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.state.Token,
      },
      body: JSON.stringify({}),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //console.log('GetAllStaffWiseFilters = ', responseJson);
        if (responseJson) {
          this.setState(
            {
              Loader: false,
              GetAllStaffWiseFilters: responseJson,
              departments: responseJson.departments,
              designations: responseJson.designations,
              categories: responseJson.categories,
              staffs: responseJson.staffs,
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
        });
      });
  };
  submitHandler = () => {
    if (
      !this.state.Selecteddepartments.length ||
      !this.state.Selecteddesignations.length ||
      !this.state.Selectedcategories.length ||
      !this.state.Selectedstaffs.length
    ) {
      return alert('Please select all the fields');
    } else {
      //alert('pressed');
      this.setState({Loader: true}, () => {
        const url = config.baseUrl2 + 'dashboard/GetAllStaffWiseWorkload';
        //console.log(url);
        //console.log(
        //  JSON.stringify({
        //    collegeCode: this.state.collegeCode,
        //    departmentIds: this.state.Selecteddepartments,
        //    designationIds: this.state.Selecteddesignations,
        //    categoriesId: this.state.Selectedcategories,
        //    staffIds: this.state.Selectedstaffs,
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
            departmentIds: this.state.Selecteddepartments,
            designationIds: this.state.Selecteddesignations,
            categoriesId: this.state.Selectedcategories,
            staffIds: this.state.Selectedstaffs,
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            console.log('GetAllStaffWiseWorkload = ', responseJson);
            if (responseJson) {
              this.setState(
                {
                  Loader: false,
                  GetAllStaffWiseWorkload: responseJson,
                  //GetAllStaffWiseWorkload: [
                  //  {
                  //    staffCode: '1016',
                  //    appNo: '113EHT01',
                  //    firstName: 'Test 1',
                  //    lastName: 'last name',
                  //    photoUrl: null,
                  //  },
                  //],
                },
                function () {
                  this.scrollView.scrollTo({
                    y: 600,
                    animated: true,
                  });
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
              alert(error);
            });
          });
      });
    }
  };

  changeHandler = (text) => {
    this.setState({search: text});
    const filteredData = this.state.filteredData.filter(
      (item) =>
        item.regNo.toLowerCase().includes(text.toLowerCase()) ||
        item.rollNo.toLowerCase().includes(text.toLowerCase()) ||
        item.studentName.toLowerCase().includes(text.toLowerCase()),
    );
    this.setState({...this.state, GetAllStaffWiseWorkload: filteredData});
  };
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <Loader
          Loading={this.state.Loader ? true : false}
          onPressCancel={() => {
            this.setState({Loader: false});
          }}
        />

        <CustomHeader
          isHome={false}
          title={'Face Register'}
          navigation={this.props.navigation}
          notification
        />
        <ScrollView
          nestedScrollEnabled={true}
          ref={(scrollView) => (this.scrollView = scrollView)}
          style={{flex: 1}}
          contentContainerStyle={{
            width: '95%',
            alignSelf: 'center',
            justifyContent: 'space-around',
            marginVertical: 2,
          }}>
          <View style={styles.picker1}>
            <PickerElement
              //enabled={this.state.batchYears.length > 0 ? true : false}
              title={'Departments'}
              selectedValue={this.state.Selecteddepartments}
              onValueChange={(value1) => {
                let Selecteddepartments = [];
                Selecteddepartments.push(value1.toString());
                this.setState({
                  Selecteddepartments,
                  Selecteddepartments2: value1,
                });
              }}
              options={this.state.departments}
              //options={options.batchYears}
            />
          </View>
          <View style={styles.picker1}>
            <PickerElement
              title={'Designations'}
              selectedValue={this.state.Selecteddesignations}
              onValueChange={(value2) => {
                let Selecteddesignations = [];
                Selecteddesignations.push(value2.toString());
                this.setState({Selecteddesignations, Loader: false});
              }}
              options={
                this.state.designations.length == 0
                  ? [{id: 1, itemName: 'Loading...'}]
                  : this.state.designations
              }
              //options={options.eduLevels}
            />
          </View>

          {/* {this.state.courseModels.length > 0 && ( */}
          <View style={styles.picker1}>
            <PickerElement
              title={'Categories'}
              selectedValue={this.state.Selectedcategories}
              onValueChange={(value3) => {
                let Selectedcategories = [];
                Selectedcategories.push(value3.toString());
                this.setState({
                  Selectedcategories,
                  Loader: false,
                });
              }}
              options={
                this.state.categories.length == 0
                  ? [{id: 1, itemName: 'Loading...'}]
                  : this.state.categories
              }
            />
          </View>
          {/* )} */}
          {/* {this.state.departmentModels.length > 0 && ( */}
          <View style={styles.picker1}>
            <PickerElement
              title={'Staff'}
              selectedValue={this.state.Selectedstaffs}
              onValueChange={(value4) => {
                let Selectedstaffs = [];
                Selectedstaffs.push(value4.toString());
                this.setState({
                  Selectedstaffs,
                  Loader: false,
                });
              }}
              options={
                this.state.staffs.length == 0
                  ? [{id: 1, itemName: 'Loading...'}]
                  : this.state.staffs
              }
            />
          </View>

          <View style={{marginVertical: 15}}>
            <CustomButton
              title="Submit"
              onPress={() => {
                this.submitHandler();
              }}
            />
          </View>
          {this.state.GetAllStaffWiseWorkload.length > 0 && (
            <View style={styles.checkContainer}>
              <CustomCheckBox
                width={'25%'}
                status={this.state.checked2 ? 'checked' : 'unchecked'}
                onPress={() => this.setState({checked2: !this.state.checked2})}
                text={'Name'}
              />
              <CustomCheckBox
                width={'33%'}
                status={this.state.checked ? 'checked' : 'unchecked'}
                onPress={() => this.setState({checked: !this.state.checked})}
                text={'Staff Code'}
              />
              <CustomCheckBox
                width={'30%'}
                status={this.state.checked1 ? 'checked' : 'unchecked'}
                onPress={() => this.setState({checked1: !this.state.checked1})}
                text={'App. No.'}
              />
            </View>
          )}
          {this.state.GetAllStaffWiseWorkload.length > 0 && (
            <SearchBar
              placeholder="Search..."
              onChangeText={() => {
                this.changeHandler();
              }}
              value={this.state.search}
              round
              onClear={() => {
                this.submitHandler();
              }}
              containerStyle={{
                backgroundColor: 'transparent',
                borderWidth: 0,
              }}
              inputContainerStyle={{backgroundColor: '#cdcdcd'}}
            />
          )}
          {this.state.GetAllStaffWiseWorkload.length > 0 &&
            this.state.GetAllStaffWiseWorkload.map((item, index) => (
              <View key={index}>
                <DisplayCard
                  // key={index.toString()}

                  index={index + 1}
                  name={item.staffName}
                  //number={item.appNo}
                  staffCode={item.staffCode}
                  showName={this.state.checked2}
                  imageURL={item.photoURL}
                  videoURL={item.videoUrl}
                  //showRoll={this.state.checked}
                  showStaff={this.state.checked}
                  showAppNo={this.state.checked1}
                  appNo={item.appNo}
                  //showReg={this.state.checked1}
                  onPress={() =>
                    this.props.navigation.push('CapturePhoto', {
                      item,
                      department: this.state.Selecteddepartments2,
                      values: {
                        isStudent: false,
                        collegeCode: this.state.collegeCodeString,
                        departmentIds: this.state.Selecteddepartments.toString(),
                        designationIds: this.state.Selecteddesignations,
                        categoriesId: this.state.Selectedcategories,
                        staffIds: this.state.Selectedstaffs,
                      },
                    })
                  }
                />
              </View>
            ))}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  picker1: {
    width: '100%',
    alignSelf: 'center',
    marginVertical: 8,
  },
  text: {
    fontFamily: config.fontFamily.regular,
    fontSize: ResponsiveSize(12),
    lineHeight: 19,
    fontWeight: '400',
    color: '#4D76F7',
  },
  checkContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 10,
    alignSelf: 'center',
    alignItems: 'center',
  },
});
