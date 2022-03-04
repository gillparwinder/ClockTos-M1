import React, {useCallback, useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import {CustomHeader} from '../components/CustomHeader';
import {Loader} from '../components/Loader';
import PickerElement from './components/Picker';
import DisplayCard from './components/DisplayCard';
import config from '../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ResponsiveSize from '../config/ResponsiveSize';
import CustomCheckBox from './components/CustomCheckBox';
import {CustomButton} from '../components/common/Button';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {SearchBar} from 'react-native-elements';

const StudentDetailScreen = (props) => {
  const [state, setState] = useState({
    title: (props.route.params && props.route.params.title) || '',
    loader: true,
    value: '',
    value1: '',
    value2: '',
    value3: '',
    value4: '',
    value5: '',
    value6: '',
    values: {},
    token: null,
    data: [],

    filteredData: [],
    colleges: [],
    departmentModels: [],
    sectionModels: [],
    batchYears: [],
    eduLevels: [],
    courseModels: [],
    semesterModels: [],
  });

  const [checked, setChecked] = useState(false);
  const [checked1, setChecked1] = useState(true);
  const [checked2, setChecked2] = useState(true);
  const [collegeCode, setCollegeCode] = useState('');
  const [search, setSearch] = useState('');

  const isFocused = useIsFocused();
  ////console.log('foccused ==>', isFocused);
  const scrollRef = useRef();

  useEffect(() => {
    //setTimeout(() => setState({...state, loader: false}), 2200);
    getCollegeCode();
    setState({...state, loader: true});
    getStudentFilters().then((json) => {
      console.log(json);
      const {colleges, batchYears, eduLevels} = json;
      setState({
        ...state,

        batchYears,
        colleges,
        eduLevels,
        loader: false,
      });
    });
    // props.navigation.addListener('focus', () => {
    //   submitHandler1();
    // });

    // return () => {
    //   props.navigation.removeListener('focus', () => {
    //     submitHandler1();
    //   });
    // };
    //AsyncStorage.getItem('token').then((token) => //console.log('token', token));
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      submitHandler1(isActive);

      return () => {
        isActive = false;
      };
      //submitHandler()
    }, [isFocused]),
  );

  const getCollegeCode = async () => {
    const collegeCode = await AsyncStorage.getItem('collegeCode');
    setCollegeCode(collegeCode);
  };

  const getStudentFilters = async () => {
    //setState({...state, loader: true});
    try {
      // const collegeCode = 'KCGERP';
      const token = await AsyncStorage.getItem('token');
      ////console.log(token);
      setState({...state, token});
      ////console.log('token', token);
      const response = await fetch(
        'https://insproplus.com/erpv2api/api/staff/GetAllFilters',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
          body: JSON.stringify({}),
        },
      );
      ////console.log(JSON.stringify(response, null, 4));

      const json = await response.json();
      return json;
    } catch (error) {
      //console.log('ERROR =>', error);
      setState({...state, loader: false});
    }
  };

  const options = {
    colleges: [
      {
        id: '13',
        itemName: 'BIT',
      },
    ],
  };

  ////console.log('DATA', data());

  const submitHandler = async () => {
    const token = await AsyncStorage.getItem('token');

    if (
      !state.value1 ||
      !state.value2 ||
      !state.value3 ||
      !state.value4 ||
      !state.value5
      // !state.value6
    ) {
      return alert('Please select all the fields');
    }
    const values = {
      collegeCode,
      batchYear: state.value1,
      educationLevel: state.value2,
      degreeCode: state.value3,
      department: state.value4,
      semester: state.value5,
      section: state.value6,
    };

    //console.log('values....', values);
    setState({...state, loader: true, values});
    try {
      const configurations = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },

        body: JSON.stringify({
          collegeCode: [`${collegeCode}`],
          departmentIds: [`${state.value4}`],
          designationIds: [''],
          categoriesId: [''],
          staffIds: [''],
          type: 0,
          fromDate: 'string',
          toDate: 'string',
          batchYearIds: [`${state.value1}`],
          degreeCodeIds: [`${state.value4}`],
          semIds: [`${state.value5}`],
          selectionIds: [''],
          courseIds: [''],
          isDefault: true,
          examIds: [''],
          userId: '',
          eduIds: [`${state.value2}`],
          sectionIds: [`${state.value6}`],
        }),
      };

      //console.log(
      //  'GetStudentDetailsForRegistration body===>',
      //  configurations.body,
      //);
      //console.log(
      //  "'https://insproplus.com/erpv2api/api/staff/GetStudentDetailsForRegistration'",
      //);
      const response = await fetch(
        'https://insproplus.com/erpv2api/api/staff/GetStudentDetailsForRegistration',
        configurations,
      );
      const json = await response.json();
      //console.log('res', json);
      setState({
        ...state,
        data: json,
        filteredData: json,
        loader: false,
      });
      scrollRef.current.scrollTo({y: 600, animated: true});
    } catch (e) {
      //console.log('e', e);
      setState({
        ...state,
        loader: false,
      });
    }
  };
  const submitHandler1 = async (isActive) => {
    if (state.value1 === '') {
      return;
    }
    const token = await AsyncStorage.getItem('token');
    const collegeCode = await AsyncStorage.getItem('collegeCode');
    const values = {
      collegeCode,
      batchYear: state.value1,
      educationLevel: state.value2,
      degreeCode: state.value3,
      department: state.value4,
      semester: state.value5,
      section: state.value6,
    };

    setState({...state, loader: true, values});

    try {
      const configurations = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },

        body: JSON.stringify({
          collegeCode: [`${collegeCode}`],
          departmentIds: [`${state.value4}`],
          designationIds: [''],
          categoriesId: [''],
          staffIds: [''],
          type: 0,
          fromDate: 'string',
          toDate: 'string',
          batchYearIds: [`${state.value1}`],
          degreeCodeIds: [`${state.value3}`],
          semIds: [`${state.value5}`],
          selectionIds: [''],
          courseIds: [''],
          isDefault: true,
          examIds: [''],
          userId: '',
          eduIds: [`${state.value2}`],
          sectionIds: [`${state.value6}`],
        }),
      };

      ////console.log('body===>', configurations.body);

      const response = await fetch(
        'https://insproplus.com/erpv2api/api/staff/GetStudentDetailsForRegistration',
        configurations,
      );
      const json = await response.json();
      ////console.log('res', json);
      if (isActive) {
        setState({
          ...state,
          data: json,
          loader: false,
        });
      }
    } catch (e) {
      //console.log('e', e);
      setState({
        ...state,
        loader: false,
      });
    }
  };

  const getOtherDepartments = async (val, type) => {
    //console.log('value ==>', val);
    setState({...state, loader: true});
    const url = 'https://insproplus.com/erpv2api/api/staff/GetDependantFilter';
    //console.log(url);
    try {
      const token = await AsyncStorage.getItem('token');
      const configs = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },

        body: JSON.stringify({
          collegeCode: [`${collegeCode}`],
          departmentIds: [type === 6 ? val : `${state.value4}`],
          designationIds: [''],
          categoriesId: [''],
          staffIds: [''],
          type: type,
          fromDate: 'string',
          toDate: 'string',
          batchYearIds: [`${state.value1}`],
          degreeCodeIds: [type === 5 ? val : `${state.value3}`],
          semIds: [type === 7 ? val : `${state.value5}`],
          selectionIds: [''],
          courseIds: [type === 5 ? val : `${state.value3}`],
          isDefault: true,
          examIds: [''],
          userId: '',
          eduIds: [type === 4 ? val : `${state.value2}`],
          sectionIds: [`${state.value6}`],
        }),
      };

      //console.log('body===>', configs.body);
      const response = await fetch(url, configs);
      const json = await response.json();

      //console.log('res', json);
      setState({...state, loader: false});
      return json;
    } catch (e) {
      //console.log('e', e);
      setState({
        ...state,
        loader: false,
      });
    }
  };

  const changeHandler = (text) => {
    setSearch(text);
    const filteredData = state.filteredData.filter(
      (item) =>
        item.regNo.toLowerCase().includes(text.toLowerCase()) ||
        item.rollNo.toLowerCase().includes(text.toLowerCase()) ||
        item.studentName.toLowerCase().includes(text.toLowerCase()),
    );
    setState({...state, data: filteredData});
  };

  const resetState = () => {
    setState({
      ...state,
      // value1: '',
      value2: '',
      value3: '',
      value4: '',
      value5: '',
      value6: '',
      // departmentModels: [],
      // sectionModels: [],
      // // batchYears: [],
      // eduLevels: [],
      // courseModels: [],
      // semesterModels: [],
    });
  };

  if (state.batchYears.length === 0) {
    return <Loader Loading={state.loader} />;
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <Loader Loading={state.loader ? true : false} />

      <CustomHeader
        isHome={false}
        title={'Face Register'}
        navigation={props.navigation}
        notification
      />
      <ScrollView
        nestedScrollEnabled={true}
        ref={scrollRef}
        style={{flex: 1}}
        contentContainerStyle={{
          width: '95%',
          alignSelf: 'center',
          justifyContent: 'space-around',
          marginVertical: 2,
        }}>
        <View style={styles.picker1}>
          <PickerElement
            //enabled={state.batchYears.length > 0 ? true : false}
            title={'Batch Year'}
            selectedValue={state.value1}
            onValueChange={(value1) => {
              setState({...state, value1, value2: ''});
              //resetState();
            }}
            options={
              state.batchYears.length == 0
                ? [{id: 1, itemName: 'Loading...'}]
                : state.batchYears
            }
            //options={options.batchYears}
          />
        </View>
        <View style={styles.picker1}>
          <PickerElement
            title={'Education Level'}
            selectedValue={state.value2}
            onValueChange={(value2) => {
              // setState({...state, value2});
              getOtherDepartments(value2, 4).then((json) => {
                setState({
                  ...state,
                  value2,
                  value3: '',
                  courseModels: json || state.courseModels,

                  loader: false,
                });
              });
            }}
            options={
              state.eduLevels.length == 0
                ? [{id: 1, itemName: 'Loading...'}]
                : state.eduLevels
            }
            //options={options.eduLevels}
          />
        </View>

        {/* {state.courseModels.length > 0 && ( */}
        <View style={styles.picker1}>
          <PickerElement
            title={'Degree'}
            selectedValue={state.value3}
            onValueChange={(value3) => {
              // setState({...state, value2});
              getOtherDepartments(value3, 5).then((json) => {
                setState({
                  ...state,
                  value3,
                  value4: '',
                  departmentModels: json || state.departmentModels,

                  loader: false,
                });
              });
            }}
            options={state.courseModels}
            //options={options.courseModels}
          />
        </View>
        {/* )} */}
        {/* {state.departmentModels.length > 0 && ( */}
        <View style={styles.picker1}>
          <PickerElement
            title={'Department'}
            selectedValue={state.value4}
            onValueChange={(value4) => {
              // setState({...state, value2});
              getOtherDepartments(value4, 6).then((json) => {
                setState({
                  ...state,
                  value4,
                  value5: '',
                  semesterModels: json || state.semesterModels,

                  loader: false,
                });
              });
            }}
            options={state.departmentModels}
            //options={options.departmentModels}
          />
        </View>
        {/* )} */}
        {/* {state.semesterModels.length > 0 && ( */}
        <View
          style={{
            ...styles.picker1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{width: '45%', justifyContent: 'center'}}>
            <PickerElement
              title={'Semester'}
              selectedValue={state.value5}
              onValueChange={(value5) => {
                // setState({...state, value2});
                getOtherDepartments(value5, 7).then((json) => {
                  setState({
                    ...state,
                    value5,
                    sectionModels: json || state.sectionModels,
                    // departmentModels: json || state.departmentModels,
                    // semesterModels: json || state.semesterModels,
                    // sectionModels: json,
                    loader: false,
                  });
                });
              }}
              options={state.semesterModels}
              //options={options.semesterModels}
            />
          </View>
          <View style={{width: '45%', justifyContent: 'center'}}>
            <PickerElement
              title={'Section'}
              selectedValue={state.value6}
              onValueChange={(value6) => setState({...state, value6})}
              options={state.sectionModels}
              //options={options.sectionModels}
            />
          </View>
        </View>
        {/* )} */}

        <View style={{marginVertical: 15}}>
          <CustomButton
            title="Submit"
            onPress={() => {
              submitHandler();
            }}
          />
        </View>
        <View style={styles.checkContainer}>
          <CustomCheckBox
            status={checked ? 'checked' : 'unchecked'}
            onPress={() => setChecked(!checked)}
            text={'Roll No.'}
          />
          <CustomCheckBox
            status={checked1 ? 'checked' : 'unchecked'}
            onPress={() => setChecked1(!checked1)}
            text={'Reg. No.'}
          />
          <CustomCheckBox
            status={checked2 ? 'checked' : 'unchecked'}
            onPress={() => setChecked2(!checked2)}
            text={'Name'}
          />
        </View>
        {state.data.length > 0 && (
          <SearchBar
            placeholder="Search..."
            onChangeText={changeHandler}
            value={search}
            round
            onClear={submitHandler}
            containerStyle={{
              backgroundColor: 'transparent',
              borderWidth: 0,
            }}
            inputContainerStyle={{backgroundColor: '#cdcdcd'}}
          />
        )}
        {state.data.length > 0 &&
          state.data.map((item, index) => (
            <View key={index}>
              <DisplayCard
                // key={index.toString()}
                index={index + 1}
                name={item.studentName}
                number={item.regNo}
                rollNumber={item.rollNo}
                showName={checked2}
                imageURL={item.photoUrl}
                showRoll={checked}
                showReg={checked1}
                onPress={() =>
                  props.navigation.navigate('CapturePhoto', {
                    item,
                    values: {
                      isStudent: true,
                      collegeCode,
                      batchYear: state.value1,
                      educationLevel: state.value2,
                      degreeCode: state.value3,
                      department: state.value4,
                      semester: state.value5,
                      section: state.value6,
                    },
                  })
                }
                //onPress={() => props.navigation.goBack()}
              />
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudentDetailScreen;

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
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    alignSelf: 'center',
    alignItems: 'center',
  },
});
