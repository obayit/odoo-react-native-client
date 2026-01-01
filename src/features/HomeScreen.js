import React, { useEffect, useState } from 'react';
import { Text, FlatList, View, StyleSheet } from 'react-native';

import { FeatureContainer, ReusableStyles } from '../components';
import { injectQuery } from '../common/store/reduxApi';
import MenuView from '../components/MenuView';
import DebugView from '../components/DebugView';

export default ({ navigation, route }) => {
  return (
    <FeatureContainer>
      <MenuView />
      <DebugView />
    </FeatureContainer>
  );
};

const styles = StyleSheet.create({

});
