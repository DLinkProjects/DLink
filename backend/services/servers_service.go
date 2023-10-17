package services

import "github.com/DLinkProjects/DLink/backend/global"

type Servers struct{}

func NewServers() *Servers {
	return &Servers{}
}

// CreateServer 添加服务器
func (s *Servers) CreateServer() {

}

// GetServerCount 统计服务器总数量
func (s *Servers) GetServerCount() (count uint, err error) {
	err = global.Database.Get(&count, "SELECT COUNT(*) FROM servers")
	return
}
