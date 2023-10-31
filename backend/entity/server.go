package entity

type Server struct {
	LinkName string `db:"-" json:"link_name"`
	ID       uint   `db:"id" json:"id"`
	Host     string `db:"host" json:"host"`
	Port     uint16 `db:"port" json:"port"`
	Username string `db:"username" json:"username"`
	Password string `db:"password" json:"password"`
	NodeID   uint   `db:"node_id" json:"node_id"`
	PKeyID   uint   `db:"p_key_id" json:"p_key_id"`
}
