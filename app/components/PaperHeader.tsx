import React from 'react';
import { Platform } from 'react-native'
import { Appbar,Menu } from 'react-native-paper';
import { useStores } from '../models';
import Clipboard from '@react-native-clipboard/clipboard';
import { StackHeaderProps } from '@react-navigation/stack';
import { Header } from './Header';
const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

export function PaperHeader(props: StackHeaderProps) {
    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const {identity:{user:{_id}}} = useStores()

    const copyID = () => {
      console.log("copy identity",_id)
      Clipboard.setString(_id)
      props.navigation.navigate("QRCodeModal")
      closeMenu()
    }

    const newContact = ()=>{
      props.navigation.navigate("NewContact")
    }

  
    return (
      <Appbar.Header>
        {props.back ? <Appbar.BackAction onPress={props.navigation.goBack} /> : null}
        <Appbar.Content title={props.options.title} />
        {!props.back ? (
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <Appbar.Action icon={MORE_ICON} color="black" onPress={openMenu} />
            }>
            <Menu.Item onPress={copyID} title="ID" />
            <Menu.Item onPress={newContact} title="New Contact" />
          </Menu>
        ) : null}
      </Appbar.Header>
    );
  }