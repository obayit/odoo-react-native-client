import React, { useEffect, useState } from 'react';
import { Text, FlatList, View, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { ReusableStyles } from '../components';
import { emptyList, injectQuery } from '../common/store/reduxApi';
import { deepCopy } from '../common/utils/commonComponentLogic';
import { Button, IconButton } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

const Item = ({ item, isChild }) => {
  const rs = ReusableStyles
  const [isExpanded, setIsExpanded] = useState(false)
  return (
    <View style={isChild ? styles.childMenuContainer : styles.rootMenuContainer }>
      <View style={styles.menuContainer}>
        {/* <Text>{JSON.stringify(item, null, 2)}</Text> */}
        <Text style={styles.menuName}>{item.name+''}</Text>
        {item.children?.length ? <ExpandButton isExpanded={isExpanded} onPress={() => setIsExpanded(!isExpanded)} /> : null}
        {/* <Text>{JSON.stringify(item)}</Text> */}
      </View>
      {isExpanded ?
        <Animated.View
          key={'uniqueKey'}
          entering={FadeIn.duration(400)}
          exiting={FadeOut.duration(400)}
        // exiting animation doesn't work, at least on debugging mode, maybe it will work in production
        >
          {item.children.length ? item.children.map(childMenu => <Item key={item.id} item={childMenu} isChild={true} />) : null}
        </Animated.View>
        : null}
    </View>
  )
}

function ExpandButton({ onPress, isExpanded }) {
  return <IconButton style={styles.expandCollapseButton} icon={() => <MaterialIcons name={isExpanded ? 'expand-less' : 'expand-more'} />} onPress={onPress} />
}

function MenuView({ navigation, route }) {
  const rs = ReusableStyles;

  const { useQuery } = injectQuery('ir.ui.menu');
  const [treeData, setTreeData] = useState({})

  const query = useQuery({
    kwargs: {
      fields: [
        'id',
        'name',
        'complete_name',
        'action',
        'parent_id',
        'sequence',
      ],
      domain: [
        // ['parent_id', '=', false],
      ]
    },
  },
  );
  const { data, isLoading } = query
  const records = data?.records ?? emptyList
  console.log('#query.error');
  console.log(query.error);

  useEffect(() => {
    constructTreeData()
  }, [records])

  function constructTreeData() {
    if (records?.length) {
      setTreeData(list_to_tree(records))
    }
  }

  useEffect(() => {
    // setSavedLoginInfo();  // FIXME: activate this later
  }, []);

  return (
    query.error ? <Text style={rs.textDanger}>{JSON.stringify(query.error)}</Text>
      :
      <FlatList
        onRefresh={query.refetch}
        refreshing={query.isLoading || query.isFetching}
        style={rs.list}
        data={Object.keys(treeData)}
        renderItem={({ item }) => (<View>
          <Item item={treeData[item]} />
        </View>)
        }
      />
  );
};

export default MenuView

// export function deepCopy(obj) {
//   return JSON.parse(JSON.stringify(obj))
// }
function list_to_tree(passedList) {
  // original version source: https://stackoverflow.com/a/18018037/3557761
  const list = deepCopy(passedList)
  var map = {}, node, roots = [], i;

  for (i = 0; i < list.length; i += 1) {
    map[list[i].id] = i; // initialize the map
    list[i].children = []; // initialize the children
  }

  for (i = 0; i < list.length; i += 1) {
    node = list[i];
    const parent_id = node.parent_id?.length ? node.parent_id[0] : false
    if (parent_id !== false) {
      if (list[map[parent_id]]) {  // we can have dangling branches, and must check that map[parent_id] exists
        list[map[parent_id]].children.push(node);
      }
    } else {
      roots.push(node);
    }
  }
  return roots;
}

// https://wzayef.net/jobs/saudi-arabia/jeddah/job-1538016

const styles = StyleSheet.create({
  menuName: {
    margin: 16,
  },
  expandCollapseButton: {
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
  },
  rootMenuContainer: {
    borderWidth: 2,
    borderColor: 'lightgrey',
    borderRadius: 15,
    margin: 5,
  },
  childMenuContainer: {
    borderWidth: 2,
    borderColor: 'purple',
    borderRadius: 15,
    margin: 5,
  },
});
