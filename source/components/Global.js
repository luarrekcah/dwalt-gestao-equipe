import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../global/colorScheme';

export const TextSection = ({value}) => {
  return <Text style={styles.textSection}>{value}</Text>;
};

export const Divisor = () => {
  return <View style={styles.divisor}>{''}</View>;
};

export const MiniCard = ({
  iconName,
  iconSize = 40,
  iconColor = '#fff',
  content = ['Informe', 'Informe'],
}) => {
  return (
    <View style={styles.miniCard}>
      <Icon name={iconName} size={iconSize} color={iconColor} />
      <Divisor />
      <Text style={styles.textCardTitle}>{content[0]}</Text>
      <Divisor />
      <Text style={styles.textCardDesc}>{content[1]}</Text>
    </View>
  );
};

export const Button = ({
  icon = 'info',
  value,
  description,
  onPress,
  ...rest
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Icon name={icon} size={25} color={Colors.whitetheme.primary} />
      <View>
        <Text style={styles.buttonText}>{value}</Text>
        <Text style={styles.buttonDesc}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

export const LoadingActivity = () => {
  return (
    <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator size="large" color={Colors.whitetheme.primary} />
    </View>
  );
};

export const NoTeam = () => {
  return (
    <View style={[styles.container, styles.horizontal, {marginTop: '50%'}]}>
      <View style={{alignContent: 'center', alignItems: 'center'}}>
        <Icon name={'lock'} size={40} color={Colors.whitetheme.primary} />
        <Text style={{color: Colors.whitetheme.primary}}>
          Limitamos seu acesso porque você não está em uma equipe!
        </Text>
      </View>
    </View>
  );
};

export const NotConnected = () => {
  return (
    <View
      style={[
        styles.container,
        {alignContent: 'center', alignItems: 'center'},
      ]}>
      <View>
        <Text
          style={{
            color: '#000000',
            fontSize: 20,
            fontWeight: 'bold',
            margin: 20,
          }}>
          Sem conexão com internet...
        </Text>
        <ActivityIndicator size="large" color={Colors.whitetheme.danger} />
      </View>
    </View>
  );
};

export const DocumentCard = ({title, onPress, haveContent}) => {
  if (haveContent) {
    return (
      <View style={styles.documentsCard}>
        <Icon name="check" size={30} color="#fff" />
        <Text style={styles.documentsTitle}>{title}</Text>
        <TouchableOpacity style={styles.documentsButton} onPress={onPress}>
          <Text style={styles.documentsButtonText}>Ver</Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View
        style={[
          styles.documentsCard,
          {backgroundColor: Colors.whitetheme.warning},
        ]}>
        <Icon name="warning" size={30} color="#fff" />
        <Text style={styles.documentsTitle}>{title}</Text>
        <TouchableOpacity style={styles.documentsButton} onPress={onPress}>
          <Text
            style={[
              styles.documentsButtonText,
              {color: Colors.whitetheme.warning},
            ]}>
            Documentação{'\n'}em falta
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
};

export const SimpleButton = ({icon, onPress, value, type}) => {
  if (type === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.simplebutton,
          {backgroundColor: Colors.whitetheme.primary},
        ]}>
        {icon ? <Icon name={icon} size={25} color={'#fff'} /> : ''}
        <View>
          <Text style={{color: '#fff'}}>{value}</Text>
        </View>
      </TouchableOpacity>
    );
  } else if (type === 'warning') {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.simplebutton,
          {backgroundColor: Colors.whitetheme.warning},
        ]}>
        {icon ? <Icon name={icon} size={25} color={'#fff'} /> : ''}
        <View>
          <Text style={{color: '#fff'}}>{value}</Text>
        </View>
      </TouchableOpacity>
    );
  } else if (type === 'success') {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.simplebutton,
          {backgroundColor: Colors.whitetheme.success},
        ]}>
        {icon ? <Icon name={icon} size={25} color={'#fff'} /> : ''}
        <View>
          <Text style={{color: '#fff'}}>{value}</Text>
        </View>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.simplebutton,
          {backgroundColor: Colors.whitetheme.danger},
        ]}>
        {icon ? <Icon name={icon} size={25} color={'#fff'} /> : ''}
        <View>
          <Text style={{color: '#fff'}}>{value}</Text>
        </View>
      </TouchableOpacity>
    );
  }
};

const styles = new StyleSheet.create({
  /* SECTION */
  textSection: {
    color: Colors.whitetheme.gray,
    fontSize: 15,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  /* DIVISOR */
  divisor: {
    backgroundColor: '#fff',
    height: 1,
    width: 80,
    margin: 10,
  },
  /* MINI CARD */
  miniCard: {
    backgroundColor: Colors.whitetheme.primary,
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginRight: 10,
    width: 100,
  },
  textCardTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  textCardDesc: {
    color: '#fff',
    fontSize: 15,
    textTransform: 'uppercase',
  },
  /* BUTTON */
  button: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 15,
    marginVertical: 20,
  },
  buttonText: {
    color: Colors.whitetheme.primary,
    fontSize: 15,
    marginLeft: 20,
  },
  buttonDesc: {
    color: Colors.whitetheme.gray,
    fontSize: 12,
    marginLeft: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.whitetheme.backgroundColor,
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  /* DOCUMENTS CARD */
  documentsCard: {
    backgroundColor: Colors.whitetheme.primary,
    borderRadius: 10,
    padding: 40,
    alignContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  documentsTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  documentsButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderRadius: 10,
    marginTop: 20,
  },
  documentsButtonText: {
    color: Colors.whitetheme.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  /* SIMPLE BUTTON */
  simplebutton: {
    borderRadius: 20,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    margin: 10,
  },
});
