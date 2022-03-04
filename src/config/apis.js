import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import config from './config';

export const setAsyncStorage = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    //console.log('ERROR_ASYNC_STORAGE', error);
  }
};

export const getAsyncStorage = async (key) => {
  //console.log('key', key);
  try {
    const value = await AsyncStorage.get(key);
    return value;
  } catch (error) {
    //console.log('ERROR_ASYNC_STORAGE', error);
    return null;
  }
};

export const retrieveDataStaffAttendance = async (key) => {
  //console.log(key, 'key');
  try {
    const value = await AsyncStorage.getItem('token');
    if (!value) {
      return;
    }
    console.log('url = ', config.baseUrl2 + 'staff/GetTodayClassDetails');
    console.log(
      'bodydata = ',
      JSON.stringify({
        fromDate: key
          ? moment(key).format('YYYY-MM-DD')
          : moment().format('YYYY-MM-DD'),
        toDate: key
          ? moment(key).format('YYYY-MM-DD')
          : moment().format('YYYY-MM-DD'),
      }),
    );
    const configs = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + value,
      },
      body: JSON.stringify({
        fromDate: key
          ? moment(key).format('YYYY-MM-DD')
          : moment().format('YYYY-MM-DD'),
        toDate: key
          ? moment(key).format('YYYY-MM-DD')
          : moment().format('YYYY-MM-DD'),
      }),
    };
    const response = await fetch(
      config.baseUrl2 + 'staff/GetTodayClassDetails',
      configs,
    );
    //console.log(config.baseUrl2 + 'staff/GetTodayClassDetails');
    //console.log({
    //  fromDate: key
    //    ? moment(key).format('YYYY-MM-DD')
    //    : moment().format('YYYY-MM-DD'),
    //  toDate: key
    //    ? moment(key).format('YYYY-MM-DD')
    //    : moment().format('YYYY-MM-DD'),
    //});
    const json = await response.json();
    return json;
  } catch (error) {
    alert(error);
    return error;
  }
};

export const retrieveStaffAttendanceDetail = async (item) => {
  //console.log('item', item);
  try {
    const value = await AsyncStorage.getItem('token');
    if (!value) {
      return;
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
        attDate: moment(item.date, 'MM/DD/YYYY h:mm:ss a').format('YYYY-MM-DD'),
        //attDate: new Date().toISOString(),
        hour: item.hour.toString(),
      }),
    };
    //console.log('body ==>', configs.body);
    const response = await fetch(
      config.baseUrl2 + 'staff/GetStudentDetails',
      configs,
    );
    const json = await response.json();
    //console.log('JSON ==>', json);
    let data = [];
    this.setState({AttendanceData: json, Loader: false});
    json.forEach((itemm) => {
      //console.log('attendaveValue', itemm.attval);
      data.push({
        //rollNo: itemm.rollNo,
        registratioNumber: itemm.registrationNo,
        //date: moment(item.date).format('YYYY-MM-DD'),
        date: moment(item.date, 'MM/DD/YYYY h:mm:ss a').format('YYYY-MM-DD'),
        hour: Number(item.hour),
        attVal: itemm.attval === '' ? '2' : itemm.attval,
      });
    });

    return [...data];
  } catch (error) {
    return error;
  }
};
