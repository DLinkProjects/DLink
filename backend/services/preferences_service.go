package services

import "runtime"

type Preferences struct{}

func NewPreferences() *Preferences {
	return &Preferences{}
}

func (p *Preferences) Create() {

}

func (p *Preferences) Update() {

}

func (p *Preferences) RestoreDefault() {

}

func (p *Preferences) GetSysVersion() string {
	return runtime.GOOS
}
