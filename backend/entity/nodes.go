package entity

import "database/sql"

type Nodes struct {
	ID       uint          `db:"id"`
	ParentID sql.NullInt32 `db:"parent_id"`
	Type     string        `db:"type"`
	Name     string        `db:"name"`
}
