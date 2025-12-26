import React, { useEffect, useState } from 'react';
import { Text, FlatList, View, StyleSheet } from 'react-native';

import { FeatureContainer, ReusableStyles } from '../components';
import { injectQuery } from '../common/store/reduxApi';

const Item = ({ item }) => {
  const rs = ReusableStyles
  return (
    <View style={rs.listItem}>
      <View style={rs.containerRawSpaceBetween}>
        <Text>{item.name}</Text>
        {/* <Text>{JSON.stringify(item)}</Text> */}
      </View>
    </View>
  )
}

export default ({ navigation, route }) => {
  const rs = ReusableStyles;

  const { useQuery } = injectQuery('ir.ui.menu');
  const query = useQuery({
    args: {
      fields: [
        'id',
        'name',
        'parent_id',
        'sequence',
      ],
      domain: [
        ['parent_id', '=', false],
      ]
    },
  },
  );
  const { data, isLoading } = query


  useEffect(() => {
    // setSavedLoginInfo();  // FIXME: activate this later
  }, []);

  return (
    <FeatureContainer loading={isLoading}>
      <View style={rs.listContainer}>
        {/* refresh with pull down */}
        <FlatList
          style={rs.list}
          data={data?.records}
          renderItem={props => <Item {...props} />}
        />
      </View>
    </FeatureContainer>
  );
};

const styles = StyleSheet.create({

});
