package bridge

import (
	"github.com/hood-chat/core"
	"github.com/hood-chat/core/entity"
	logging "github.com/ipfs/go-log/v2"
)


var log = logging.Logger("bridge")

type Bridge struct {
	core core.Messenger
}

func NewBridge(repoPath string) (*Bridge, error) {
	err := logging.SetLogLevelRegex(".*", "DEBUG")
	if err != nil {
		panic("logger failed")
	}
	m := core.MessengerBuilder(repoPath)
	f := &Bridge{core: m}

	return f, nil
}

func (b *Bridge) IsLogin() bool {
	return b.core.IsLogin()
}

func (b *Bridge) GetIdentity() (string, error) {
	id, err := b.core.GetIdentity()
	if err != nil {
		return "", err
	}
	return Marshal(Identity{
		ID:   id.ID,
		Name: id.Name,
	})
}

func (b *Bridge) NewIdentity(name string) (string, error) {
	id, err := b.core.SignUp(name)
	if err != nil {
		return "", err
	}
	return Marshal(Identity{
		ID:   id.ID,
		Name: id.Name,
	})
}

func (b *Bridge) GetChat(id string) (string, error) {
	msgr := b.core
	ch, err := msgr.GetChat(id)
	if err != nil {
		return "", err
	}
	mids := []string{}
	for _,m := range ch.Members{
		mids = append(mids, m.ID)
	}
	return Marshal(Chat{
		ID:   ch.ID,
		Name: ch.Name,
		Members: mids,
	})
}

func (b *Bridge) GetChats() (string, error) {
	msgr := b.core
	ch, err := msgr.GetChats()
	if err != nil {
		return "", err
	}
	chs := make([]Chat,0)

	for _, c := range ch {
		mids := []string{}
		for _,m := range c.Members{
			mids = append(mids, m.ID)
		}
		chs = append(chs, Chat{
			ID:   c.ID,
			Name: c.Name,
			Members: mids,
		})
	}

	return Marshal(chs) 
}

func (b *Bridge) GetMessages(chatID string) (string, error) {
	msgr:= b.core
	res := make([]Message,0)


	msgs, err := msgr.GetMessages(chatID)
	if err != nil {
		return "", err
	}

	for _, msg := range msgs {
		res = append(res, Message{
			ID: msg.ID,
			Text: msg.Text,
			CreatedAt: msg.CreatedAt,
			ContactID: msg.Author.ID,
			Sent: msg.Status != entity.Pending,
			Received:  msg.Status == entity.Seen,
			Pending: msg.Status == entity.Pending,
		})
	}
	return Marshal(res)
}

func (b *Bridge) SendMessage(chatId string,text string)(string, error){
	msgr:= b.core
	enp, err := msgr.NewMessage(chatId, text)
	if err != nil {
		return "", err
	}
	msgr.SendMessage(*enp)
	return Marshal(Message{
		ID: enp.Msg.ID,
		Text: enp.Msg.Text,
		CreatedAt: enp.Msg.CreatedAt,
		ContactID: enp.Msg.Author.ID,
		Sent: enp.Msg.Status != entity.Pending,
		Received:  enp.Msg.Status == entity.Seen,
		Pending: enp.Msg.Status == entity.Pending,
	})
} 

func (b *Bridge) GetContacts() (string, error) {
	msgr:= b.core
	cs,err := msgr.GetContacts()
	if err != nil {
		return "", err
	}
	res := make([]Contact,0)
	for _, c := range cs {
		res = append(res, Contact(c))
	}
	return Marshal(res) 
} 

func (b *Bridge) GetContact(id string) (string, error) {
	msgr:= b.core
	c,err := msgr.GetContact(id)
	if err != nil {
		return "", err
	}
	return Marshal(Contact(c)) 
}

func (b *Bridge) AddContact(id string, name string) error{
	msgr:= b.core
	err := msgr.AddContact(entity.Contact{
		ID: id,
		Name: name,
	})
	return err
}

func (b Bridge) NewPMChat(contactID string) (string, error) {
	msgr:= b.core
	pm, err := msgr.CreatePMChat(contactID)
	if err != nil {
		return "", err
	}

	return Marshal(toChat(pm))
}

func (b Bridge) GetPMChat(contactID string) (string, error) {
	msgr:= b.core
	pm, err := msgr.GetPMChat(contactID)
	if err != nil {
		return "", err
	}
	return Marshal(toChat(pm))
}

func toChat(ch entity.ChatInfo) Chat{
	mids := []string{}
	for _,m := range ch.Members{
		mids = append(mids, m.ID)
	}
	return Chat{
		ID:   ch.ID,
		Name: ch.Name,
		Members: mids,
	}
}