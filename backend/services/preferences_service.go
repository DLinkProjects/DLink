package services

import (
	"github.com/DLinkProjects/DLink/backend/utils/base"
	"runtime"
)

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

func (p *Preferences) GetDLinkVersion() string {
	return base.Version
}
