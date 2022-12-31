import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps, ChatScreenProps } from "../navigators"
import { ListItem, Screen, Text, Button } from "../components"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../models"
import { spacing } from "../theme"
import { FAB } from 'react-native-paper';
import { List } from 'react-native-paper';


export const NewChatScreen: FC<StackScreenProps<ChatScreenProps<"NewChat">>> = observer(function NewChatScreen() {
 // Pull in one of our MST stores
 const { chatStore: {contacts, openPMChat} } = useStores()
 
 const navigation = useNavigation()
 const navigateItem = (id) => {
  return () => {
    openPMChat(id).then(()=>{
      navigation.navigate("Chat")
    }).catch((e)=>{
      console.log("open failed",e)
    })
  }
}

const newContact = () => {
  navigation.navigate("NewContact")
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
         data={contacts}
         renderItem={renderItem}
         keyExtractor={item => item._id}
       />
     </Screen>
     <View style={$fixedView}>
        <FAB
          icon="account-plus"
          style={$fab}
          onPress={newContact}
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