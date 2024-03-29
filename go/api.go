package bridge

import (
	"encoding/json"
	"errors"
	"strings"

	"github.com/hood-chat/core"
	"github.com/hood-chat/core/entity"
	"github.com/hood-chat/core/event"
	logging "github.com/ipfs/go-log/v2"
	manet "github.com/multiformats/go-multiaddr/net"
)

var log = logging.Logger("bridge")

type Bridge struct {
	core.MessengerAPI
}

func NewBridge(repoPath string, conf *HostConfig) (*Bridge, error) {
	if conf.emitter != nil {
		SetEmitter(conf.emitter)
	}
	hb := NewMobileNode(conf)
	if hb == nil {
		panic("new hb failed")
	}

	m := core.NewMessengerAPI(repoPath, Option(), hb)

	f := &Bridge{m}
	sub, err := m.EventBus().Subscribe([]interface{}{new(event.MessageEventObj)})
	if err != nil {
		panic("can not subscribe to bus")
	}
	go func() {
		defer sub.Close()

		for e := range sub.Out() {
			bevt, _ := BMessageEventMarshal(e.(event.MessageEventObj))
			getEmitter().Emit(bevt)
		}
	}()

	return f, nil
}

func (b *Bridge) IsLogin() bool {
	return b.IdentityAPI().IsLogin()
}

func (b *Bridge) GetInterfaces() (string, error) {
	adders, err := manet.InterfaceMultiaddrs()
	if err != nil {
		panic("manet not work")
	}
	// test dns and mdns diable for production
	// addr, err := ma.NewMultiaddr("/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN")
	// if err != nil {
	// 	panic("cant parse ma adder")
	// }
	// _, err = madns.Resolve(context.Background(), addr)
	// if err != nil {
	// 	log.Debugf("can not resolve host: %s", err.Error())
	// 	// panic("madns not work")
	// }
	sAdders := make([]string, 0)
	for _, val := range adders {
		sAdders = append(sAdders, val.String())
	}
	return strings.Join(sAdders, " , "), err

}

func (b *Bridge) GetIdentity() (string, error) {
	idn, err := b.IdentityAPI().Get()
	if err != nil {
		return "", err
	}

	return Marshal(&idn)
}

func (b *Bridge) NewIdentity(name string) (string, error) {
	idn, err := b.IdentityAPI().SignUp(name)
	if err != nil {
		return "", err
	}
	return Marshal(idn)
}

func (b *Bridge) GetChat(id string) (string, error) {
	chatId := entity.ID(id)
	ch, err := b.ChatAPI().ChatInfo(chatId)
	if err != nil {
		return "", err
	}
	return Marshal(&ch)
}

func (b *Bridge) GetChats(skip int, limit int) (string, error) {
	ch, err := b.ChatAPI().ChatInfos(skip, limit)
	if err != nil {
		return "", err
	}
	return Marshal(ch)
}

func (b *Bridge) GetMessages(chatID string, skip int, limit int) (string, error) {
	id := entity.ID(chatID)
	msgs, err := b.ChatAPI().Messages(id, skip, limit)
	if err != nil {
		return "", err
	}
	return Marshal(msgs)
}

func (b *Bridge) GetMessageNotification(msg string) (*Notification, error) {
	m := new(entity.Message)
	err := json.Unmarshal([]byte(msg), m)
	if err != nil {
		return nil, err
	}
	return NewNotification(m.Author.Name, m.Text), nil
}

func (b *Bridge) GetMessage(ID string) (string, error) {
	id := entity.ID(ID)
	msg, err := b.ChatAPI().Message(entity.ID(id))
	if err != nil {
		return "", err
	}
	return Marshal(&msg)
}

func (b *Bridge) SendMessage(chatId string, text string) (string, error) {
	msg, err := b.ChatAPI().Send(entity.ID(chatId), text)
	if err != nil {
		return "", err
	}
	return Marshal(msg)
}

func (b *Bridge) GetContacts(skip int, limit int) (string, error) {
	cs, err := b.ContactBookAPI().List(skip, limit)
	if err != nil {
		return "", err
	}
	return Marshal(cs)
}

func (b *Bridge) GetContact(id string) (string, error) {
	contactID := entity.ID(id)
	c, err := b.ContactBookAPI().Get(contactID)
	if err != nil {
		return "", err
	}
	return Marshal(&c)
}

func (b *Bridge) PutContact(id string, name string) error {
	err := b.ContactBookAPI().Put(entity.Contact{
		ID:   entity.ID(id),
		Name: name,
	})
	return err
}

func (b *Bridge) Seen(chatID string) error {
	return b.ChatAPI().Seen(entity.ID(chatID))
}

func (b Bridge) NewPMChat(contactID string) (string, error) {
	id := entity.ID(contactID)
	con, err := b.ContactBookAPI().Get(id)
	if err != nil {
		return "", err
	}
	pm, err := b.ChatAPI().New(core.NewPrivateChat(con))
	if err != nil {
		return "", err
	}
	return Marshal(&pm)
}

func (b Bridge) NewGPChat(opt []byte) ([]byte, error) {
	var o core.NewChatOpt
	o, err := UnMarshalByte[core.NewChatOpt](opt)
	if err != nil {
		return nil, err
	}
	ch, err := b.ChatAPI().New(o)
	if err != nil {
		return nil, err
	}
	err = b.ChatAPI().Invite(ch.ID, ch.Members)
	if err != nil {
		return nil, err
	}
	return ch.Json()
}

func (b Bridge) GetPMChat(contactID string) (string, error) {
	id := entity.ID(contactID)
	pm, err := b.ChatAPI().Find(core.WithPrivateChatContact(id))
	if err != nil {
		return "", err
	}
	if len(pm) == 0 {
		return "", errors.New("not found")
	}
	return Marshal(&pm[0])
}
