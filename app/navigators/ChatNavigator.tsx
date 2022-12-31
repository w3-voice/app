import React from "react"
import { CompositeScreenProps } from "@react-navigation/native"
import { createStackNavigator, StackScreenProps } from "@react-navigation/stack"
import {
  ChatListScreen,
  ChatScreen
} from "../screens"
import {
  PaperHeader
} from "../components/PaperHeader"
import { NewChatScreen } from "../screens/NewChatScreen"
import { NewContactScreen } from "../screens/NewContactScreen"
import { QRCodeScannerScreen } from "../screens/QRCodeScannerScreen"
import { QRCodeModalScreen } from "../screens/QRCodeModalScreen"

export type ChatScreenProps<T extends keyof ChatNavigatorParamList> = StackScreenProps<
  ChatNavigatorParamList,
  T
>

export type ChatNavigatorParamList = {
  ChatList: undefined,
  Chat: undefined,
  NewChat: undefined,
  NewContact: undefined,
  ScanNewContact: undefined,
  QRCodeScanner: undefined
  QRCodeModal: undefined
}
const Stack = createStackNavigator<ChatNavigatorParamList>()
export const ChatNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{
      cardStyle: { backgroundColor: "transparent" },
      
    }}>
      <Stack.Group screenOptions={{
        headerShown: true,
        header: (props) => <PaperHeader {...props} /> }}>
        <Stack.Screen name="ChatList"
          component={ChatListScreen}
          options={{ title: 'Hood' }}
        />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="NewChat" component={NewChatScreen} />
        <Stack.Screen name="NewContact" component={NewContactScreen} />
        <Stack.Screen name="ScanNewContact" component={QRCodeScannerScreen} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'modal',headerShown: false }}>
        <Stack.Screen name="QRCodeModal" component={QRCodeModalScreen} />
      </Stack.Group>

    </Stack.Navigator>
  )
}
