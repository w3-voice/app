import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import { ListItem, Screen, Text, Button } from "../components"
import { useNavigation } from "@react-navigation/native"
import { ChatStoreModel, useStores } from "../models"
import { spacing } from "../theme"



export const NewChatScreen: FC<StackScreenProps<AppStackScreenProps, "NewChat">> = observer(function NewChatScreen() {
 // Pull in one of our MST stores
 const { chatStore: {contacts, chats, openPMChat} } = useStores()
 
 const navigation = useNavigation()

 const renderItem = ({ item }) => (
   <ListItem onPress={() => {
    openPMChat(item._id).then(()=>{
      navigation.navigate("Chat")
    })
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
         data={contacts}
         renderItem={renderItem}
         keyExtractor={item => item._id}
       />
     </Screen>
     <View style={$fixedView}>
       <Button
         style={$fab}
         onPress={()=>{
          navigation.navigate("NewContact")
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