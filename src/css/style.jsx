import { StyleSheet, Dimensions } from 'react-native';
import Profile from '../pages/Profile';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
// const CARD_WIDTH = width * 0.7; // Adjust for two cards per screen
// const CARD_HEIGHT = 160;

export const styles = StyleSheet.create({
  section: {
    marginVertical: 10,
    width: "100%",
  },
  trending_section: {
    maxHeight: height * 0.25,
  },
  category_section: {
    maxHeight: height * 0.65,
    justifyContent: 'center',
  },
  section_heading: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // borderWidth: 4,
    // borderColor: 'green',
  },
  heading_text: {
    margin: 2,
    color: '#ffbc00',
    // color: '#555',
    // color: '#000',
    fontSize: 20,
    fontFamily: 'bernoru-blackultraexpanded',
    fontWeight: 'bold',
    textShadowColor: '#ffbc00',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
  swastik: {
    marginTop: 5,
    resizeMode: 'contain',
    // marginHorizontal: 2,
    height: 25,
    width: 25,
    // borderWidth: 4,
    // borderColor: 'green',
  },
  heading_underline: {
    marginBottom: 10,
    resizeMode: 'cover',
    maxWidth: '40%',
    maxHeight: 10,
    // borderWidth: 4,
    // borderColor: "yellow",
  },
  sideBar: {
    position: 'absolute',
    left: 0,
    zIndex: 4,
    paddingLeft: 4,
    overflow: 'hidden',
    paddingRight: 4,
    top: 25,
    minWidth: '70%',
    maxWidth: '71%',
    backgroundColor: 'white',
    minHeight: height * 0.9,
    // paddingTop:-10,
    borderTopEndRadius: 60,
    borderBottomEndRadius: 150,
  },
  bar11: {
    height: 6,
    width: '70%',
  },
  sideBarServices: {
    minWidth: '80%',
    marginTop: 15,
    minHeight: '2.4%',
    marginLeft: -25,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  blurEffect: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    backfaceVisibility: 'hidden', // Works only on web
    zIndex: 9,
  },
  puja_slider: {
    borderWidth: 4,
    borderColor: 'red',
  },
  listContainer: {
    paddingHorizontal: 5,
  },
  card: {
    // width: CARD_WIDTH,
    // height: CARD_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    marginHorizontal: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    position: 'relative',
    paddingBottom: 0,
  },
  text: {
    color: 'white',
    fontSize: 30,
    fontWeight: 600,
  },
  image: {
    width: '100%',
    height: '100%', // Reduced height to fit text
    resizeMode: 'cover',
  },
  catCard: {
    // width: CARD_WIDTH,
    // height: CARD_HEIGHT * 3,
    marginHorizontal: 12,
    position: 'relative',
    borderColor: 'black',
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderRadius: 10,

    // iOS Shadow
    shadowColor: 'blue',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  trending_card_image: {
    // height: CARD_HEIGHT * 0.7,
    // borderWidth: 3,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    // maxHeight: CARD_HEIGHT * 0.3,
    marginBottom: 0,
    // borderWidth: 3,
  },
  catCard_image: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
    // borderWidth: 5,
  },
  category_card_image: {
    height: '90%',
    // borderWidth: 2
  },
  bottomRowCategory: {
    maxHeight: '12%',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Fredoka-SemiBold',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    zIndex: 99,
  },
  specialTag: {
    position: 'absolute',
    marginTop: 15,
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#aa53d1',
    padding: 5,
    paddingLeft: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 12.5,
    fontWeight: 'bold',
    color: '#555555',
    fontFamily: 'Fredoka-SemiBold',
    marginVertical: 1,
    paddingVertical: 2,
  },
  bookNow: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    // fontFamily: 'Fredoka_Condensed-Bold',
    fontFamily: 'Fredoka-SemiBold',
  },
  bookNowContainer: {
    alignContent: 'center',
    justifyContent: 'center',
    marginVertical: 'auto',
    paddingVertical: 2,
    maxWidth: '40%',
    paddingHorizontal: 10,
    backgroundColor: '#ffbc00',
    borderRadius: 20,
    height: '80%',
    marginLeft: 10,
    marginRight: 0,
    flex: 1,
    // borderWidth: 2,
  },
  input: {
    height: 50,
    margin: 10,
    padding: 15,
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: 'grey',
    color: 'grey',
    borderRadius: 5,
    fontFamily: 'Fredoka-Regular',
    fontSize: 19,
  },
  signupForm: {
    // borderWidth: 2,
    padding: '5%',
    justifyContent: 'center',
    zIndex: 99
  },
  emailInput: {
    // borderWidth: 5,
    // borderColor: "red",
    width: '95%',
  },
  countryCode: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneNum: {
    // width: '70%',
    marginHorizontal: 5,
    flex: 1,
  },
  signup_title: {
    fontSize: 30,
    fontFamily: 'Fredoka-Regular',
    padding: 5,
  },

  IconBar: {
    padding: 5,
    maxHeight: height*0.25,
    width: '100%',
    // borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  IconContainer: {
    backgroundColor: '#fbc400',
    borderRadius: '50%',
    padding: 10,
  },

  ProfileIcon: {
    height: 25,
    width: 25,
  },
  
  ProfileMainSection: {
    minHeight: height*0.32,
    alignItems: "center",
    paddingVertical: 10,
    paddingTop: 20,
  },
  ProfileImg: {
    height: 130,
    width: 130,
  },
  ProfileNameContainer: {
    marginLeft: "12%",
    marginTop: "5%",
    alignItems: "center",
    // borderWidth: 4,
    // borderColor: "red",
    flexDirection: "row",
    width: "90%"
  },
  ProfileHeading: {
    // borderWidth: 2,
    alignItems: "center",
    flex: 1,

  },
  NameEditBtnContainer: {
    // borderWidth: 2,
    // borderColor: "green",
    width: "15%",
    alignItems: "flex-start",
  },
  NameEditBtn: {
    height: 35,
    width: 35,
  },
  ProfileName: {
    fontSize: 30,
    fontFamily: "Fredoka_Condensed-Bold"
  },
  NameUderline: {
    height: 5,
    width: '100%',
    backgroundColor: "#ff8731",
    borderRadius: "20",
  },
  ProfileEmail: {
    fontSize: 14,
    fontFamily: "Fredoka-Regular",
  },
  ProfileEditButton: {
    margin: 5,
    backgroundColor: "#000000", 
    padding: 10,
    borderRadius: 15,
    // borderWidth: 4,
    // borderColor: "green",
  },
  ProfileEditButtonText: {
    color: "#ffff",
    fontFamily: "Fredoka-SemiBold",
    fontSize: 18,
    // borderWidth: 2,
    // borderColor: "white",
    letterSpacing: 1.1,
  },
  DetailsSection: {
    maxHeight: height*0.30,
    // padding: 5,
  },
  DetailsSectionHeading: {
    marginLeft: 12,
    fontSize: 16,
    color: "#00000",
    fontWeight: 350,
    opacity: 0.8,
  },
  DetailsContainer: {
    backgroundColor: "rgba(255, 247, 234, 0.24)",
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.24)",
    marginVertical: 5,
    borderRadius: 20,
    gap: 10,
    marginBottom: 20,
    // opacity: 0.1,
    },
  DetailsTextContainer: {
    padding: 5,
    flexDirection: "row",
    // borderWidth: 2,
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 40,
  },
  DetailsHeadingText: {
    fontSize: 16,
    color: "#626262",
    opacity: 0.74,
  },
  DetailsSubText: {
    // left: "12%",
    padding: 4,
    // borderWidth: 2,
    fontSize: 14,
    color: "#aaaaaa",
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#aaaaaa",
  }




});
