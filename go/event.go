package bridge


type Emitter interface {
	Emit(*Event)
}

type brd struct{
	Emitter
}

type Event struct {
	Name    string
	Group   string
	Action  string
	Payload string
}

func (b brd) Emit(evt *Event) {
	log.DPanicf("panicted %d", &evt)
}

func NewEvent(n string, g string, a string, p string) *Event {
	return &Event{n, g, a, p}
}
