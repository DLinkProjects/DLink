package exec

import (
	"golang.org/x/crypto/ssh"
	"strings"
)

type Adapter struct {
	output string
	err    error
	Client *ssh.Client
}

func New(client *ssh.Client) *Adapter {
	return &Adapter{
		Client: client,
	}
}

func (a *Adapter) Run(cmd string) *Adapter {
	session, err := a.Client.NewSession()
	if err != nil {
		a.output = ""
		a.err = err
		return a
	}
	defer func() {
		_ = session.Close()
	}()
	buf, err := session.CombinedOutput(cmd)
	a.output = string(buf)
	a.err = err
	return a
}

func (a *Adapter) Raw() (string, error) {
	return a.output, a.err
}

func (a *Adapter) Unwrap() string {
	if a.err != nil {
		return ""
	}
	a.output = strings.Trim(a.output, "\n")
	a.output = strings.TrimSpace(a.output)
	return a.output
}
