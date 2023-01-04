import React, { FC, useEffect } from "react"
import { FlatList, Platform, View } from 'react-native';
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { ChatScreenProps } from "../navigators"
import { Screen } from "../components"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../models"
import { Appbar, FAB, Menu } from 'react-native-paper';
import { List } from 'react-native-paper';
import Clipboard from '@react-native-clipboard/clipboard';
import { HeaderButtonProps } from "@react-navigation/native-stack/lib/typescript/src/types";

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';


export const ChatListHeaderMenu = (_props: HeaderButtonProps) => {
  const navigation = useNavigation()
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const {identityStore} = useStores()

  const copyID = () => {
    Clipboard.setString(identityStore.user._id)
    navigation.navigate("QRCodeModal")
    closeMenu()
  }

  const newContact = ()=>{
    navigation.navigate("NewContact")
  }
  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <Appbar.Action icon={MORE_ICON} color="black" onPress={openMenu} />
      }>
      <Menu.Item onPress={copyID} title="ID" />
    </Menu>
  )
}

export const ChatListScreen: FC<StackScreenProps<ChatScreenProps<"ChatList">>> = observer(function ChatListScreen() {
  // Pull in one of our MST stores
  const { chatStore } = useStores()
  // Pull in navigation via hook
  const navigation = useNavigation()

  const navigateItem = (id) => {
    return () => {
      chatStore.selectChat(id)
      navigation.navigate("Chat")
    }
  }

  const newChat = () => {
    navigation.navigate("NewChat")
  }


  const renderItem = ({ item }) => (
    <List.Item
      title={item.name}
      onPress={navigateItem(item._id)} />
  )

  return (
    <>
      <Screen
        style={$root}
        preset="fixed"
        contentContainerStyle={$screenContentContainer}
      >
        <FlatList
          data={[...chatStore.chatList]}
          renderItem={renderItem}
          keyExtractor={item => item._id}
        />

      </Screen>
      <View style={$fixedView}>
        <FAB
          icon="pencil"
          style={$fab}
          onPress={newChat}
        />
      </View>
    </>

  )
})

const $root: ViewStyle = {
  flex: 1,
  height: 100
}

const $fab: ViewStyle = {
  margin: 40,
  right: 0,
  bottom: 0,
}
const $screenContentContainer: ViewStyle = {
  paddingVertical: 0,
  paddingHorizontal: 0,
}

const $fixedView: ViewStyle = {
  position: 'absolute',
  right: 0,
  bottom: 0,
  flexDirection: 'row',
  justifyContent: 'flex-end',
}