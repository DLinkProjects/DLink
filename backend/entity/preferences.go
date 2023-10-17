package entity

type Preferences struct {
	ID              uint   `db:"id"`
	Theme           string `db:"theme"`
	Language        string `db:"language"`
	AutoCheckUpdate bool   `db:"auto_check_update"`
}
