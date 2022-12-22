import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { View, Text, ViewStyle, TextStyle, RecursiveArray, RegisteredStyle } from 'react-native';
import Color from 'react-native-gifted-chat/lib/Color';
import { useStores } from '../../models';
interface Props {
 id : string
}
export const MessageStatus: FC<Props>= observer((props: Props) => {
    const { chatStore: { messages } } = useStores()
    const msg = messages.get(props.id)
    return(         
    <View style={$tickView}>
        {!!msg.sent && (
            <Text style={$tick}>✓</Text>
        )}
        {!!msg.received && (
            <Text style={$tick}>✓</Text>
        )}
        {!!msg.pending && (
            <Text style={$tick}>🕓</Text>
        )}
        {!!msg.failed && (
            <Text style={$tick}>X</Text>
        )}
    </View>)
})


const $tick: TextStyle = {
    fontSize: 10,
    backgroundColor: Color.backgroundTransparent,
    color: Color.white,
}
const $tickView: ViewStyle = {
    flexDirection: 'row',
    marginRight: 10,
}    