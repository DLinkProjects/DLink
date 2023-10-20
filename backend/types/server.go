package types

import "github.com/DLinkProjects/DLink/backend/entity"

type ServerReq struct {
	LinkName string `json:"link_name"`
	NodeID   uint   `json:"node_id"`
	Host     string `json:"host"`
	Port     uint16 `json:"port"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type ServersResp struct {
	Nodes []entity.Node `json:"nodes,omitempty"`
}

type GroupReq struct {
	ParentID uint   `json:"parent_id"`
	Type     string `json:"type"`
	Name     string `json:"name"`
}

type GroupsResp struct {
	Groups []entity.Node `json:"groups,omitempty"`
}
