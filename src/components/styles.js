import { StyleSheet } from 'react-native';
import colors from './colors';

export const ReusableStyles = StyleSheet.create({
  // put all common/reusable styles here
  formContainer: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 16,
    backgroundColor: '#EEEEEE',
  },

  mainButton: {
    borderRadius: 24,
    margin: 16,
  },
  listContainer: {
      flex: 1,
      justifyContent: 'flex-start',

      backgroundColor: 'white',
  },
  list: {
      backgroundColor: 'white',
  },
  listItem: {
      borderWidth: 2,
      borderColor: 'lightgrey',
      borderRadius: 15,
      margin: 5,
  },
  submitButton: {
      borderRadius: 15,
      margin: 5,
  },

  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  searchButton: {
    margin: 5,
    alignSelf: 'flex-end',
  },

  horizontalItem: {
    borderWidth: 0.5,
    borderRadius: 5,
    margin: 5,
    padding: 5,
  },

  containerRawSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
  },

  textTopRight: {
    marginRight: 2,
  },
  textDanger: {
    color: colors.color_danger_600,
    margin: 8,
    borderBottomWidth: 1,
    borderColor: colors.color_danger_600,
  },
});
