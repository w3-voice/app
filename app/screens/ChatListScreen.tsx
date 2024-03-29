import React, { FC, useCallback, useEffect } from "react"
import { FlatList, Platform, TextStyle, View } from 'react-native';
import { Observer, observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { ChatScreenProps } from "../navigators"
import { Screen } from "../components"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { useStores } from "../models"
import { Appbar, Avatar, Badge, FAB, Menu } from 'react-native-paper';
import { List } from 'react-native-paper';
import Clipboard from '@react-native-clipboard/clipboard';
import { HeaderButtonProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import coreSync from "../models/helpers/coreSync";
import { spacing } from "../theme";
import { NewMessageFilter } from "../services/core/real/const";

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';


export const ChatListHeaderMenu = (_props: HeaderButtonProps) => {
  const navigation = useNavigation()
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const { identityStore } = useStores()

  const copyID = () => {
    Clipboard.setString(identityStore.user._id)
    navigation.navigate("QRCodeModal")
    closeMenu()
  }

  const newContact = () => {
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
  const { chatStore,messageStore } = useStores()
  // Pull in navigation via hook
  const navigation = useNavigation()


  useFocusEffect(useCallback(()=>{
    chatStore.load()
    const sub = coreSync(chatStore,"onNewMessage", NewMessageFilter)
    return () => sub.remove()
  },[]))

  const navigateItem = (id) => {
    return () => {
      // chatStore.select(id)
      messageStore.open(id)
      navigation.navigate("Chat")
    }
  }

  const newChat = () => {
    navigation.navigate("NewChat")
  }


  const renderItem = ({ item }) => (
    <List.Item
      borderless={true}
      title={item.name}
      titleStyle={$listItemTitle}
      description={item.latestText}
      onPress={navigateItem(item._id)}
      left={props => <Avatar.Text style={listItem} size={50} label={item.name}/> } 
      right={props => <Observer>{()=>item.unread>0&&<View style={$badgeContainer}><Badge>{item.unread}</Badge></View>}</Observer>} />
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

const listItem: ViewStyle = {
  marginLeft: spacing.small,
  marginRight: 0,
  paddingRight: 0,
}

const $listItemTitle: TextStyle = {
  fontSize:18
}

const $badgeContainer: ViewStyle = {
  display: "flex",
  justifyContent: "center"
}