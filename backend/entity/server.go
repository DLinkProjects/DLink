package entity

type Server struct {
	ID       uint   `json:"id" db:"id"`
	Host     string `json:"host" db:"host"`
	Port     uint16 `json:"port" db:"port"`
	Username string `json:"username" db:"username"`
	Password string `json:"password" db:"password"`
	NodeID   uint   `json:"node_id" db:"node_id"`
}
