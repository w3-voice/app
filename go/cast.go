package bridge

import (
	"encoding/json"
	"errors"

	"github.com/hood-chat/core/entity"
	"github.com/hood-chat/core/event"
)

func BMessageEventMarshal(evt event.MessageEvent) (*Event, error) {
	var payload string
	switch p := evt.GetPayload().(type) {
	case entity.ID:
		payload = p.String()
	case entity.Message:
		m, err := p.Json()
		if err != nil {
			return NewEvent("","","",""), err
		}
		payload = string(m)
	default:
		return NewEvent("","","",""), errors.New("no error")
	}
	return NewEvent(evt.GetName(), event.MessageGroup, event.MessagingEG.Actions[evt.GetAction()], payload), nil
}

func Marshal[e entity.JsonMessage](v e) (string, error) {
	bytes, err := v.Json()
	if err != nil {
		return "", err
	}
	return string(bytes), nil
}

func UnMarshal[e any](j string) (e, error) {
	b := []byte(j)
	i := new(e)
	err := json.Unmarshal(b, i)
	if err != nil {
		return *i, err
	}
	return *i, nil
}