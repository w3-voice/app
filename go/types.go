package bridge


type Notification struct {
	title string
	text  string
}

func (n *Notification) GetTitle() string {
	return n.title
}

func (n *Notification) GetText() string {
	return n.text
}

func NewNotification(title string, text string) *Notification {
	return &Notification{title, text}
}
