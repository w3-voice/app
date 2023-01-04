import React from 'react';
import { Platform } from 'react-native'
import { Appbar,Menu } from 'react-native-paper';
import { useStores } from '../models';
import { StackHeaderProps } from '@react-navigation/stack';
const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

export function PaperHeader(props: StackHeaderProps) {
    return (
      <Appbar.Header>
        {props.back ? <Appbar.BackAction onPress={props.navigation.goBack} /> : null}
        <Appbar.Content title={props.options.title} />
        {!!props.options.headerRight && props.options.headerRight({})}
      </Appbar.Header>
    );
  }