import {
    onSnapshot,
    applySnapshot,
    onPatch,
    applyPatch,
    onAction,
    applyAction,
    IAnyStateTreeNode
} from "mobx-state-tree"
import { EmitterSubscription } from "react-native"
import { api } from "../../services/core"
import { Filter } from "../../services/core/real"


export default function subScribeStore(store: IAnyStateTreeNode, action: string, filter: Filter) {
    let subscription: EmitterSubscription
    onEvent((event) => {
        applyAction(store, {name:action,args:[event.payload,event.action]})
    })

    let isHandlingMessage = false

    function onEvent(handler){
        subscription = api.beeCore.subscribe((event)=>{
            isHandlingMessage = true
            handler(event)
            isHandlingMessage = false
        }, filter)
    }

    return subscription
}


