package entity

type Preference struct {
	ID              uint   `db:"id" json:"id"`
	Theme           string `db:"theme" json:"theme"`
	Language        string `db:"language" json:"language"`
	AutoCheckUpdate bool   `db:"auto_check_update" json:"auto_check_update"`
}
