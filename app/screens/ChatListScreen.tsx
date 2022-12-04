import React, { FC } from "react"
import { FlatList, View } from 'react-native';
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import { Screen } from "../components"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../models"
import { FAB } from 'react-native-paper';
import { List } from 'react-native-paper';



export const ChatListScreen: FC<StackScreenProps<AppStackScreenProps, "ChatList">> = observer(function ChatListScreen() {
  // Pull in one of our MST stores
  const { chatStore } = useStores()
  const navigateItem = (id) => {
    return () => {
      chatStore.clear()
      chatStore.selectChat(id)
      navigation.navigate("Chat")
    }
  }

  const newChat = () => {
    navigation.navigate("NewChat")
  }

  // Pull in navigation via hook
  const navigation = useNavigation()

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
          data={chatStore.chats.slice()}
          renderItem={renderItem}
          keyExtractor={item => item._id}
        />

      </Screen>
      <View style={$fixedView}>
        <FAB
          icon="plus"
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