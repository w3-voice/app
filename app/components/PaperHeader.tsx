import React from 'react';
import { Appbar,Menu } from 'react-native-paper';
import { useStores } from '../models';
import Clipboard from '@react-native-clipboard/clipboard';


export function PaperHeader({ navigation, back  }) {
    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const {identity:{user:{_id}}} = useStores()

    const copyID = () => {
      console.log("copy identity",_id)
      Clipboard.setString(_id)
      closeMenu()
    }

  
    return (
      <Appbar.Header>
        {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
        <Appbar.Content title="Hood" />
        {!back ? (
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <Appbar.Action icon="menu" color="white" onPress={openMenu} />
            }>
            <Menu.Item onPress={copyID} title="ID" />
          </Menu>
        ) : null}
      </Appbar.Header>
    );
  }