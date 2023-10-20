package entity

type Preference struct {
	ID              uint   `json:"id" db:"id"`
	Theme           string `json:"theme" db:"theme"`
	Language        string `json:"language" db:"language"`
	AutoCheckUpdate bool   `json:"auto_check_update" db:"auto_check_update"`
}
