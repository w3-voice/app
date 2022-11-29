package bridge

import (
	"sync"
)

var (
	muEmitter         = sync.RWMutex{}
	emitter   Emitter = &iem{}
)

var _ Emitter = (*iem)(nil)

type iem struct{}

func (*iem) Emit(evt *Event) {
	log.DPanicf("go emitter is calling %d", &evt)
}

func SetEmitter(n Emitter) {
	muEmitter.Lock()
	emitter = n
	muEmitter.Unlock()
}

func getEmitter() (n Emitter) {
	muEmitter.RLock()
	n = emitter
	muEmitter.RUnlock()
	return
}
