import React from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';

const Calls = () => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text>Chamados</Text>
      </ScrollView>
    </View>
  );
};

const styles = new StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default Calls;
