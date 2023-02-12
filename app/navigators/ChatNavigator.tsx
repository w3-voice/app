import React from "react"
import { CompositeScreenProps } from "@react-navigation/native"
import { createStackNavigator, StackScreenProps } from "@react-navigation/stack"
import {
  ChatListScreen,
  ChatScreen,
  ChatListHeaderMenu,
  NewContactScreenHeaderRight,
  NewGroupMembersScreen,
  NewGroupNameScreen
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
  NewGroupName: undefined,
  NewGroupMembers: undefined
}
const Stack = createStackNavigator<ChatNavigatorParamList>()
export const ChatNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{
      cardStyle: { backgroundColor: "white" },
      
    }}>
      <Stack.Group screenOptions={{
        headerShown: true,
        header: (props) => <PaperHeader {...props} /> }}>
        <Stack.Screen name="ChatList"
          component={ChatListScreen}
          options={{ title: 'Hello World', headerRight:ChatListHeaderMenu }}
        />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="NewChat" 
          component={NewChatScreen} 
          options={{ title: 'New Message' }}
        />
        <Stack.Screen name="NewContact"
          component={NewContactScreen}
          options={{ title: 'New Contact', headerRight:NewContactScreenHeaderRight }}
         />

        <Stack.Screen name="ScanNewContact"
         component={QRCodeScannerScreen} 
         options={{ title: 'Scan Contact' }}
         />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'modal',headerShown: false }}>
        <Stack.Screen name="QRCodeModal" component={QRCodeModalScreen} />
      </Stack.Group>
      <Stack.Group screenOptions={{
        headerShown: true,
        header: (props) => <PaperHeader {...props} /> }}>
        <Stack.Screen name="NewGroupMembers"
          component={NewGroupMembersScreen}
          options={{ title: 'New Group' }}
         />
        <Stack.Screen name="NewGroupName"
          component={NewGroupNameScreen}
          options={{ title: 'New Group' }}
         />
      </Stack.Group>
    </Stack.Navigator>
  )
}
