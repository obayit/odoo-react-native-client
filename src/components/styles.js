import { StyleService } from '@ui-kitten/components';
/* IMPORTANT NOTE:
You should really consider using the UiKitten/eva design theme mapper to apply styles to entire app instead of using this file.
obi advise: this saves a lot of time and effort, and ensures that your app have the same look in all pages,
 also you should get your styles from a professional UI/UX engineer
*/

export const ReusableStyles = StyleService.create({
  // put all common/reusable styles here
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 16,
    backgroundColor: 'background-basic-color-1',
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
});
