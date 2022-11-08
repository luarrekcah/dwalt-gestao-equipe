import React from 'react';
import {Text, View, Image, StyleSheet, ScrollView} from 'react-native';
import Colors from '../../global/colorScheme';
import {LoadingActivity, TextSection} from '../../global/Components';
import {getBusinessData} from '../../services/Database';

const Business = ({navigation}) => {
  const [business, setBusiness] = React.useState();
  const [loading, setLoading] = React.useState(true);

  const loadData = async () => {
    setLoading(true);
    setBusiness(await getBusinessData());
    setLoading(false);
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return <LoadingActivity />;
  } else {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Image
            style={styles.bussinessLogo}
            source={{
              uri: business.data.info.profile.logo,
            }}
          />
          <Text style={styles.bussinessName}>
            {business.data.info.documents.nome_fantasia}
          </Text>
          <TextSection value="Sobre a empresa" />
          <Text style={styles.bussinessDesc}>
            {business.data.info.profile.about}
          </Text>
        </ScrollView>
      </View>
    );
  }
};

const styles = new StyleSheet.create({
  container: {
    padding: 10,
  },
  bussinessLogo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    margin: 30,
  },
  bussinessName: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: Colors.whitetheme.primary,
  },
  bussinessDesc: {
    fontSize: 15,
    color: '#000000',
  },
});

export default Business;
