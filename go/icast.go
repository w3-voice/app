package bridge

import (
	"sync"
)

var (
	muBroadcaster           = sync.RWMutex{}
	broadcaster   BroadCaster = &icast{}
)

var _ BroadCaster = (*icast)(nil)

type icast struct{}

func (*icast) BroadCast(evt *Event) {
	log.DPanicf("boradcasting %d", &evt)
}

func SetBroadCast(n BroadCaster) {
	muBroadcaster.Lock()
	broadcaster = n
	muBroadcaster.Unlock()
}

func getBroadCast() (n BroadCaster) {
	muBroadcaster.RLock()
	n = broadcaster
	muBroadcaster.RUnlock()
	return
}
