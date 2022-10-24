import React, { FC } from "react"
import { FlatList, TouchableOpacity, View } from 'react-native';
import { observer } from "mobx-react-lite"
import { TabBarIOSItem, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import { Button, Icon, ListItem, Screen, Text } from "../components"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useStores } from "../models"
import { spacing } from "../theme";

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `ChatList: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="ChatList" component={ChatListScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const ChatListScreen: FC<StackScreenProps<AppStackScreenProps, "ChatList">> = observer(function ChatListScreen() {
  // Pull in one of our MST stores
  const { chatStore } = useStores()

  const renderItem = ({ item }) => (
    <ListItem onPress={() => {
      navigation.navigate(
        "Chat", {
        chatId: item.id
      }
      )
    }
    }>
      <Text text={item.name} />
    </ListItem>
  )

  // Pull in navigation via hook
  const navigation = useNavigation()



  return (
    <>
      <Screen
        style={$root}
        preset="fixed"
        contentContainerStyle={$screenContentContainer}
      >
        <FlatList
          data={chatStore.list}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </Screen>
      <View style={$fixedView}>
        <Button
          style={$fab}
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