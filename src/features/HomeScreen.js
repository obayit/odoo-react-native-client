import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { List, ListItem, Text, StyleService, useStyleSheet, Icon, Button, Input } from '@ui-kitten/components';

import { FeatureContainer, ReusableStyles } from '../components';
import { injectQuery } from '../common/store/reduxApi';

const Item = ({ item }) => {
  const rs = useStyleSheet(ReusableStyles)
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
  const rs = useStyleSheet(ReusableStyles);

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
        <List
          style={rs.list}
          data={data?.records}
          renderItem={props => <Item {...props} />}
        />
      </View>
    </FeatureContainer>
  );
};

const themedStyles = StyleService.create({

});
