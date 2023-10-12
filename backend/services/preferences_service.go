package services

import "runtime"

type Preferences struct{}

func NewPreferences() *Preferences {
	return &Preferences{}
}

func (p *Preferences) GetSysVersion() string {
	return runtime.GOOS
}
