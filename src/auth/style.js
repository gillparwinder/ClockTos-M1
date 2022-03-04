import {StyleSheet} from 'react-native';
import config from '../config/config';
import ResponsiveSize from '../config/ResponsiveSize';

export const styles = StyleSheet.create({
  // for content Background Image view
  BackgroundImageView: {
    width: '100%',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 15,
  },
  // for content background image style

  BackgroundImage: {
    width: '100%',
    height: 120,
    resizeMode: 'stretch',
    position: 'absolute',
  },
  // for content background image inner view style

  BackgroundImageInnerView: {
    width: '100%',
    height: 120,
    justifyContent: 'center',
    padding: 20,
  },

  // for normal size text
  text: {
    textAlign: 'center',
    color: 'white',
    fontSize: ResponsiveSize(config.AppAllHeaderSize),
    fontFamily: 'Poppins-Regular',
  },
  // for email whole container
  emailConatiner: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // code field outer view
  emailOuter: {
    width: '80%',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
  // for login button
  loginButton: {
    width: '50%',
    backgroundColor: config.themeColor,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    alignSelf: 'center',
  },
  // for code field root
  codeFieldRoot: {
    width: '80%',
    alignSelf: 'center',
  },
  // for each box in code filed
  cell: {
    width: 50,
    height: 50,
    lineHeight: 50,
    fontSize: ResponsiveSize(config.textSize),
    fontFamily: 'Poppins-Regular',
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#00000030',
    textAlign: 'center',
  },
  // for banner images
  ImageConatiner: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: '45%',
  },
  // for all maincontainer
  mainContainer: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    backgroundColor: config.bgColor,
  },
  // for all title container
  titleContainer: {
    width: '50%',
    minHeight: 55,
    maxHeight: 85,
    justifyContent: 'space-between',
  },
  // for all title style
  title: {
    color: 'black',
    fontSize: ResponsiveSize(config.AppAllTextSize),
    fontFamily: 'Poppins-Regular',
  },
  titleData: {
    color: 'white',
    fontSize: ResponsiveSize(config.AppAllHeaderSize),
    marginVertical: 5,
    fontWeight: '600',
    fontFamily: 'Poppins-Regular',
  },
  // logo container for college
  logoConatiner: {
    width: '100%',
    height: '35%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerLogoConatiner: {
    width: '100%',
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // for login button text
  loginText: {
    fontWeight: '600',
    fontSize: 35,
    fontFamily: 'Poppins-Regular',
  },
  emailConatiner2: {
    width: '100%',
    height: '50%',
    backgroundColor: config.SubThemeColor,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  emailOuter2: {
    width: '80%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 55,
    borderRadius: 5,
    marginTop: 20,
  },
  emailInput: {
    height: 55,
    width: '90%',
    fontSize: ResponsiveSize(config.AppAllHeaderSize),
    fontFamily: 'Poppins-Regular',
    paddingLeft: 10,
    backgroundColor: config.SubThemeColor,
    color: 'white',
    borderRadius: 35,
  },
  emailInputOuter: {
    height: 55,
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: config.SubThemeColor,
    borderRadius: 35,
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    height: 55,
  },
  buttonsContainer2: {
    marginTop: 20,
    alignSelf: 'center',
  },
  focusCell: {
    borderColor: config.themeColor,
  },
  //for signup screen email outer
  emailOuter2: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 55,
    borderRadius: 5,
  },

  // for homescreen

  //for homescreen student name
  headerNew: {
    padding: 10,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 5,
  },
  // for subject name in subject list
  headerTextNew: {
    width: '60%',
    color: 'white',
    fontSize: ResponsiveSize(config.AppAllHeaderSize),
    fontWeight: '400',
    lineHeight: 24,
    textTransform: 'uppercase',
    fontFamily: 'Poppins-Regular',
  },

  HomescreenNotificationIconView: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  HomescreenNotificationTextView: {
    width: '85%',
    justifyContent: 'center',
    height: '100%',
  },

  // for attendence screen

  // for  title
  TitleText: {
    fontFamily: 'Poppins-Regular',
    color: 'white',
    fontSize: ResponsiveSize(config.AppAllSubTitle),
  },
  // for  sub title
  SubTitleText: {
    fontFamily: 'Poppins-Regular',
    color: 'white',
    fontSize: ResponsiveSize(config.AppAllHeaderSize),
    fontWeight: '600',
  },
  // for image header title
  MainTitle: {
    fontFamily: 'Poppins-Regular',
    color: 'white',
    fontWeight: '600',
    textTransform: 'uppercase',
    fontSize: ResponsiveSize(config.buttonSize),
  },
  HotNotificationView: {
    width: '95%',
    alignSelf: 'center',
    alignItems: 'center',
    height: 50,
    flexDirection: 'row',
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: 'silver',
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 0},
  },
});
