import React, { useState, useRef } from 'react';
import { View, Text, Linking, StyleSheet, Animated, Easing } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

// Props for the ContactWidget
export interface ContactWidgetProps {
  title: string;
  name?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  mobile?: string;
  website?: string;
  email?: string;
  vat?: string;
  vatLabel?: string;
  fields?: string[];
  options?: {
    no_marker?: boolean;
    phone_icons?: boolean;
  };
}

const ANIMATION_DURATION = 250;

const ContactWidget: React.FC<ContactWidgetProps> = ({
  title,
  name,
  address,
  city,
  country,
  phone,
  mobile,
  website,
  email,
  vat,
  vatLabel = 'VAT',
  fields = [],
  options = {},
}) => {
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const summaryOpacity = useRef(new Animated.Value(1)).current;

  const showAddress = address && fields.includes('address');
  const showCity = city && fields.includes('city');
  const showPhone = phone && fields.includes('phone');
  const showMobile = mobile && fields.includes('mobile');
  const showWebsite = website && fields.includes('website');
  const showEmail = email && fields.includes('email');
  const showVat = vat && fields.includes('vat');
  const noMarker = options.no_marker;
  const phoneIcons = options.phone_icons;

  const heightPerLine = 24;
  let numberOfLines = 0;
  numberOfLines += showAddress ? 1 : 0;
  numberOfLines += showCity ? 1 : 0;
  numberOfLines += showPhone ? 1 : 0;
  numberOfLines += showMobile ? 1 : 0;
  numberOfLines += showWebsite ? 1 : 0;
  numberOfLines += showEmail ? 1 : 0;
  numberOfLines += showVat ? 1 : 0;
  const computedHeight = numberOfLines * heightPerLine;

  const handleExpand = () => {
    Animated.timing(summaryOpacity, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start(() => {
      setExpanded(true);
      Animated.timing(animation, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: false,
        easing: Easing.out(Easing.ease),
      }).start();
    });
  };

  const handleCollapse = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      useNativeDriver: false,
      easing: Easing.out(Easing.ease),
    }).start(() => {
      setExpanded(false);
      Animated.timing(summaryOpacity, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start();
    });
  };

  if (!expanded) {
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={styles.row}>
            {showAddress && !noMarker && <FontAwesome name="map-marker" size={16} color="#888" style={styles.icon} />}
            <Animated.Text style={[styles.text, { opacity: summaryOpacity }]}>{title}</Animated.Text>
          </View>
          <Text style={styles.expandBtn} onPress={handleExpand}>Show Details</Text>
        </View>
      </View>
    );
  }

  const detailsHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, computedHeight],
  });
  const detailsOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.expandBtn} onPress={handleCollapse}>Hide</Text>
      </View>
      <Animated.View style={{ height: detailsHeight, opacity: detailsOpacity, overflow: 'hidden' }}>
        <View style={styles.addressBlock}>
          {showAddress && (
            <View style={styles.row}>
              {!noMarker && <FontAwesome name="map-marker" size={16} color="#888" style={styles.icon} />}
              <Text style={styles.text}>{address}</Text>
            </View>
          )}
          {showCity && (
            <View style={styles.row}>
              {!noMarker && <FontAwesome name="map-marker" size={16} color="#888" style={styles.icon} />}
              <Text style={styles.text}>{city}{country ? `, ${country}` : ''}</Text>
            </View>
          )}
          {showPhone && (
            <View style={styles.row}>
              {(!noMarker || phoneIcons) && <FontAwesome name="phone" size={16} color="#888" style={styles.icon} />}
              <Text style={styles.text}>{phone}</Text>
            </View>
          )}
          {showMobile && (
            <View style={styles.row}>
              {(!noMarker || phoneIcons) && <FontAwesome name="mobile" size={16} color="#888" style={styles.icon} />}
              <Text style={styles.text}>{mobile}</Text>
            </View>
          )}
          {showWebsite && (
            <View style={styles.row}>
              {!noMarker && <FontAwesome name="globe" size={16} color="#888" style={styles.icon} />}
              <Text
                style={[styles.text, styles.link]}
                onPress={() => Linking.openURL(website.startsWith('http') ? website : `http://${website}`)}
              >
                {website}
              </Text>
            </View>
          )}
          {showEmail && (
            <View style={styles.row}>
              {!noMarker && <FontAwesome name="envelope" size={16} color="#888" style={styles.icon} />}
              <Text style={styles.text}>{email}</Text>
            </View>
          )}
          {showVat && (
            <View style={styles.row}>
              <Text style={styles.text}>{vatLabel}: {vat}</Text>
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    marginVertical: 8,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 6,
  },
  addressBlock: {
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: 15,
    color: '#222',
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  expandBtn: {
    color: '#007AFF',
    fontWeight: 'bold',
    marginLeft: 12,
    fontSize: 15,
  },
});

export default ContactWidget;
