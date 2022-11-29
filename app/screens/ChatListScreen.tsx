import React, { FC, useEffect } from "react"
import { FlatList, TouchableOpacity, View } from 'react-native';
import { observer } from "mobx-react-lite"
import { TabBarIOSItem, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import { Button, Icon, ListItem, Screen, Text } from "../components"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useStores } from "../models"
import { spacing } from "../theme";


export const ChatListScreen: FC<StackScreenProps<AppStackScreenProps, "ChatList">> = observer(function ChatListScreen() {
  // Pull in one of our MST stores
  const { chatStore } = useStores()

  // Pull in navigation via hook
  const navigation = useNavigation()

  const renderItem = ({ item }) => (
    <ListItem onPress={() => {
      chatStore.clear()
      chatStore.selectChat(item._id)
      navigation.navigate("Chat")
    }}>
      <Text text={item.name} />
    </ListItem>
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
        <Button
          style={$fab}
          onPress={() => {
            navigation.navigate("NewChat")
          }}
        />
      </View>
    </>

  )
})

const $root: ViewStyle = {
  flex: 1,
  height: 100
}

const $fixedView: ViewStyle = {
  position: 'absolute',
  right: 0,
  bottom: 0,
  flexDirection: 'row',
  justifyContent: 'flex-end',
}

const $fab: ViewStyle = {
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: '#ee6e73',
  position: 'absolute',
  bottom: 15,
  right: 15,
}
const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.huge,
  paddingHorizontal: spacing.large,
}