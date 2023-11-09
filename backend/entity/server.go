package entity

type Server struct {
	LinkName string `db:"-" json:"link_name"`
	ID       uint   `db:"id" json:"id"`
	Host     string `db:"host" json:"host"`
	Port     uint16 `db:"port" json:"port"`
	NodeID   uint   `db:"node_id" json:"node_id"`
	TlsID    uint   `db:"tls_id" json:"tls_id"`
}
