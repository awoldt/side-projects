package main

type Company_Profile struct {
	Symbol           string `json:"symbol"`
	SymbolLowerCase  string
	Market_cap       int64  `json:"mktCap"`
	Name             string `json:"companyName"`
	Exchange         string `json:"exchangeShortName"`
	Image            string `json:"image"`
	Website          string `json:"website"`
	WebsiteClean     string
	Description      string `json:"description"`
	Address          string `json:"address"`
	City             string `json:"city"`
	State            string `json:"state"`
	Ceo              string `json:"ceo"`
	Phone            string `json:"phone"`
	Num_of_employees string `json:"fullTimeEmployees"`
	Industry         string `json:"industry"`
	Sector           string `json:"sector"`
	InsiderPageLink  string //if a company has a insider page, link to it on tickerpage
}

type Chart_Data struct {
	Historical      []Historical
	DescriptionText string
}
type Historical struct {
	Date  string
	Close float32
}

type Page_data struct {
	CompanyProfile Company_Profile
	ChartData      Chart_Data
	KeyExecutives  []Key_executive
	CompanyQuote   Company_quote
	RelatedStocks  []Related_stocks
	StockNews      []Stock_news
}

type Key_executive struct {
	Title string
	Name  string
}

type Stock_news struct {
	Symbol string `json:"symbol"`
	Date   string `json:"publishedDate"`
	Title  string `json:"title"`
	Site   string `json:"site"`
	Text   string `json:"text"`
	Url    string `json:"url"`
}

type Company_quote struct {
	Price                 float32 `json:"price"`
	PriceClean            string
	ChangePercentage      float64 `json:"changesPercentage"`
	Change                float64 `json:"change"`
	ChangeClean           string
	ChangePercentageClean string
	DayLow                float32 `json:"dayLow"`
	DayHigh               float32 `json:"dayHigh"`
	YearLow               float32 `json:"yearLow"`
	YearHigh              float32 `json:"yearHigh"`
	Volume                int64   `json:"volume"`
	Open                  float32 `json:"open"`
	PrevClose             float32 `json:"previousClose"`
	EPS                   float32 `json:"eps"`
	SharesOutstanding     int64   `json:"sharesOutstanding"`
}

type Related_stocks struct {
	Name            string `json:"companyName"`
	Ticker          string `json:"symbol"`
	TickerLowerCase string
	Price           float32 `json:"price"`
	Logo            string  `json:"image"`
	Change          float64 `json:"changes"`
	ChangeClean     string
	Exchange        string `json:"exchangeShortName"`
}

type Insider_trade_data struct {
	FilingDate           string
	TransactionDate      string
	TransactionType      string
	Person               string `json:"reportingName"`
	PersonPosition       string `json:"typeOfOwner"`
	FormType             string
	SecuritiesOwned      float64
	SecuritiesTransacted float64
	SECLink              string `json:"link"`
	CompanyName          string
	CompanyLogo          string
	CompanySymbol        string
	Symbol               string `json:"symbol"`
	SymbolToLowerCase    string
	CompanyWebsite       string
}

type InsiderPageData struct {
	InsiderRecords []Insider_trade_data
	CompanyProfile Company_Profile
	UniqueTraders  []string
}

type Gainer_loser struct {
	Symbol                string
	SymbolLowerCase       string
	Name                  string
	Change                float64
	ChangeClean           string
	Price                 float64
	ChangePercentage      float64 `json:"changesPercentage"`
	ChangePercentageClean string
}

type GainLose struct {
	Gainers []Gainer_loser
	Losers  []Gainer_loser
}

type MarketPageData struct {
	GainerLoserData  GainLose
	SectorData       []Sector_data
	MostActiveStocks []Most_active
	MarketNews       []Market_news
}

type Sector_data struct {
	Sector                string
	ChangePercentage      string  `json:"changesPercentage"`
	ChangePercentageFloat float64 //the change percentage returned is type string for some reason, need to convert
}

type Most_active struct {
	Symbol           string
	Name             string
	Change           float64
	Price            float64
	ChangePercentage float64 `json:"changesPercentage"`
}

type Market_news struct {
	Symbol             string
	PublishedDate      string
	PublishedDateClean string
	Title              string
	Image              string
	Site               string
	Text               string
	Url                string
}
