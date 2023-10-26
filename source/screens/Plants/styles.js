import {StyleSheet} from 'react-native';
import Colors from '../../global/colorScheme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.whitetheme.backgroundColor,
    marginHorizontal: 20,
    paddingBottom: 150,
  },
  searchBar: {marginVertical: 20},
  nullProjectsWarn: {color: '#fff', fontSize: 20, fontWeight: 'bold'},
  emptyCard: {
    padding: 30,
    borderRadius: 20,
    height: 200,
    backgroundColor: Colors.whitetheme.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  projectCard: {
    padding: 30,
    borderRadius: 20,
  },
  marginCard: {marginVertical: 10},
  imageCard: {borderRadius: 20},
});
