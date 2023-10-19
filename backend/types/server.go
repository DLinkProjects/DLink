package types

type CreateServerReq struct {
	LinkName string `json:"linkName"`
	ParentID uint   `json:"parentId"`
	Host     string `json:"host"`
	Port     uint16 `json:"port"`
	Username string `json:"username"`
	Password string `json:"password"`
}
