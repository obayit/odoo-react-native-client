import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { List, ListItem, Text, StyleService, useStyleSheet, Icon, Button } from '@ui-kitten/components';

import { ReusableStyles, FeatureContainer  } from '../../components';

import useAPIError from '../../common/hooks/useAPIError';
import { useDispatch, useSelector } from 'react-redux';
import { logOut, selectAuth, setAuth } from '../../common/store/authSlice';
import { useGetPartnersQuery } from '../../common/store/reduxApi';

export const PersonIcon = (style) => (
  <Icon {...style} name='person' />
);

export default ({ navigation }) => {
  const auth = useSelector(selectAuth);
  // CONTINUE FROM HERE:
  // const partners = useGetPartnersQuery();
  const dispatch = useDispatch();
  const { addError } = useAPIError();

  const styles = useStyleSheet(themedStyles);
  const rs = useStyleSheet(ReusableStyles);

  const onLogout = () => dispatch(logOut());

  useEffect(() => {
    // setSavedLoginInfo();  // FIXME: activate this later
  }, []);

  return (
    <FeatureContainer>
      <View style={rs.listContainer}>
        <Text>Hello <Text status='primary'>{auth.name}</Text></Text>
        <Text>Successfully Logged in!</Text>
        <Text>Next, show a list of partners here...</Text>
        <Button onPress={onLogout}>Logout</Button>
      </View>
    </FeatureContainer>
  );
};

const themedStyles = StyleService.create({
});
