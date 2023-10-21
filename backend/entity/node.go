package entity

type Node struct {
	ID       uint   `db:"id" json:"id"`
	ParentID uint   `db:"parent_id" json:"parent_id"`
	Key      uint   `db:"key" json:"key"`
	Type     string `db:"type" json:"type"`
	Name     string `db:"name" json:"name"`
}
