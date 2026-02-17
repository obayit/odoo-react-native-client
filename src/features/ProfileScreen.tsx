import React, { useEffect, useState } from 'react';
import { ScrollView, FlatList, View, StyleSheet, RefreshControl } from 'react-native';

import { FeatureContainer, ReusableStyles } from '../components';
import { emptyObject, injectQuery, odooApi } from '../common/store/reduxApi';
import { Text, List, Button, Card, Avatar, Searchbar, Icon, SegmentedButtons } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { ScreenNames } from '../navigation/navigation.constants';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import { SectionHeader } from '../components/Utils';
import colors from '../components/colors';
import useLogout from '../hooks/useLogout';

export default ({ navigation, route }) => {
  return (
    <FeatureContainer insets='top'>
      <ProfileView />
    </FeatureContainer>
  );
};

function ProfileView() {
  const profileQuery = odooApi.useProfileQuery({})
  const profile = profileQuery.data ?? emptyObject
  const navigation = useNavigation()
  const logoutHook = useLogout()
  return (
    <ScrollView refreshControl={<RefreshControl onRefresh={profileQuery.refetch} refreshing={profileQuery.isFetching} />}
      contentContainerStyle={{
        marginHorizontal: MARGIN_HORIZONTAL,
      }}
    >
      {/* {profileQuery.error ? <Text>{JSON.stringify(profileQuery.error, null, 2)}</Text> : null} */}
      {/* <Text>{JSON.stringify(profile, null, 2)}</Text> */}
      <SectionHeader title='Personal Information' />
      <List.Item
        title={profile.name}
        description="Name"
        left={props => <List.Icon {...props} icon="account" />}
      />
      <List.Item
        title={profile.email}
        description="Email"
        left={props => <List.Icon {...props} icon="email" />}
      />
      <List.Item
        title={profile.phone}
        description="Phone"
        left={props => <List.Icon {...props} icon="phone" />}
      />
      {profile.address ?
        <>
          <SectionHeader title='Address' />
          <AccountDetail
            value={profile.address.zip}
            label="ZIP Code/Postcode"
          />
          <AccountDetail
            value={profile.address.street}
            label="Street"
          />
          <AccountDetail
            value={profile.address.street2}
            label="Street2"
          />
          <List.Item
            title={profile.address.city}
            description="City"
            left={props => <List.Icon {...props} icon="map-marker" />}
          />
          <AccountDetail
            value={profile.address.state?.name}
            label="State"
          />
          <AccountDetail
            value={profile.address.country?.name}
            label="State"
          />
        </>
        : null}
      {/* <DebugView /> */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
      }}>
        <Button mode='outlined' onPress={() => navigation.navigate(ScreenNames.EditProfile)}
          icon='pencil'
        >Edit</Button>
      </View>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginVertical: 16,
      }}>
        <Button mode='outlined' onPress={logoutHook.logout}
          style={{
            borderColor: colors.color_danger_600,
          }}
          icon='logout'
          textColor={colors.color_danger_600}
        >Logout</Button>
      </View>
    </ScrollView>
  )
}

type AccountDetailProps = {
  value: string
  label: string
  icon?: IconSource
}

function AccountDetail({ value, label, icon = 'information-variant-circle' }: AccountDetailProps) {
  if (value) {
    return <List.Item
      title={value}
      description={label}
      left={props => <List.Icon {...props} icon={icon} />}
    />
  }
  return null
}

const styles = StyleSheet.create({
  categoryButton: {
    marginHorizontal: 4,
    marginVertical: 4,
  },
});

const MARGIN_HORIZONTAL = 8
