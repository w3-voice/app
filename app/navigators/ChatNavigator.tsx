import React from "react"
import { CompositeScreenProps } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import {
  ChatListScreen,
  ChatScreen
} from "../screens"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import { NewChatScreen } from "../screens/NewChatScreen"
import { NewContactScreen } from "../screens/NewContactScreen"


export type ChatScreenProps<T extends keyof ChatNavigatorParamList> = AppStackScreenProps<keyof AppStackParamList>

export type ChatNavigatorParamList = {
  ChatList: undefined,
  Chat: undefined,
  NewChat: undefined,
  NewContact: undefined,
}

const Stack = createStackNavigator<ChatNavigatorParamList>()
export const ChatNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ cardStyle: { backgroundColor: "transparent" }, headerShown: false, }}>
          <Stack.Screen name="ChatList" component={ChatListScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="NewChat" component={NewChatScreen} />
          <Stack.Screen name="NewContact" component={NewContactScreen} />
    </Stack.Navigator>
  )
}
