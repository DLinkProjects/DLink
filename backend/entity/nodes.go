package entity

import "database/sql"

type Nodes struct {
	ID       int64         `db:"id"`
	ParentID sql.NullInt64 `db:"parent_id"`
	Type     string        `db:"type"`
	Name     string        `db:"name"`
}
