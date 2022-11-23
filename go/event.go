package bridge

type BroadCaster interface {
	BroadCast(*Event)
}

type brd struct{}

func (b brd) BroadCast(evt *Event){
	log.DPanicf("panicted %d", &evt)
} 

type Event struct {
	MsgID  string
	Status string
}

func NewEvent(id string, status string) *Event {
	return &Event{id, status}
}
