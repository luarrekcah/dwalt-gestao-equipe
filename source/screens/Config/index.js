import React from 'react';
import {StyleSheet, View} from 'react-native';
import {TextSection} from '../../global/Components';

const Config = () => {
  return (
    <View style={styles.container}>
      <TextSection value={'Sobre'} />
    </View>
  );
};

const styles = new StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eeeeee',
    padding: 20,
  },
});

export default Config;
