// all the logic necessary to view any page under /stock/{TICKER}

package main

import (
	"encoding/json"
	"io"
	"log"
	"math/rand"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"
)

func GetRelatedStocks(sector, exchange string, wg *sync.WaitGroup, channel chan<- []Related_stocks, companyTicker string) {
	defer wg.Done()
	sector = url.QueryEscape(sector)
	exchange = url.QueryEscape(exchange)

	resp, err := http.Get("https://financialmodelingprep.com/api/v3/stock-screener?sector=" + sector + "&exchange=" + exchange + "&limit=25&apikey=" + os.Getenv("STOCK_API_KEY"))
	if err != nil {
		log.Println("error in reltaed stocks err 1")
		log.Println(err)
	}
	defer resp.Body.Close()
	data, err2 := io.ReadAll(resp.Body)
	if err2 != nil {
		log.Println("error in reltaed stocks err 2")
		log.Println(err2)
	}

	jsonData := []Related_stocks{}
	err3 := json.Unmarshal(data, &jsonData)
	if err3 != nil {
		log.Println("error in reltaed stocks err 3")
		log.Println(err3)
	}

	//need to get 3 random stocks and their companyProfile data
	//generate 1 single index, and fetch the proceding 3 stocks
	//efficinet way of getting related stocks
	rand.Seed(time.Now().Unix()) // initialize global pseudo random generator
	randomIndex := rand.Intn(len(jsonData))
	randomIndexAddress := &randomIndex
	var symbols []string

	if len(jsonData) <= 3 {
		for i := 0; i < len(jsonData); i++ {
			//make sure company name is less than 35 chars long
			if len(jsonData[i].Name) < 35 && jsonData[i].Ticker != companyTicker {
				symbols = append(symbols, jsonData[i].Ticker)
			}
		}
	} else {
		for {
			//have to make sure random index grabbed will not overlap length of jsondata
			if len(jsonData)-randomIndex < 3 {
				//get new index, cant use current index
				*randomIndexAddress = rand.Intn(len(jsonData))
			} else {
				for i := randomIndex; i < randomIndex+3; i++ {
					//make sure company name is less than 35 chars long
					if len(jsonData[i].Name) < 35 && jsonData[i].Ticker != companyTicker {
						symbols = append(symbols, jsonData[i].Ticker)
					}
				}
				break
			}
		}
	}

	//fetch the companyProfile for all symbols extracted
	resp2, err4 := http.Get("https://financialmodelingprep.com/api/v3/profile/" + strings.Join(symbols[:], ",") + "?apikey=" + os.Getenv("STOCK_API_KEY"))
	if err4 != nil {
		log.Println("error in reltaed stocks err 4")
		log.Println(err4)
	}
	defer resp2.Body.Close()
	data2, err5 := io.ReadAll(resp2.Body)
	if err5 != nil {
		log.Println("error in reltaed stocks err 5")
		log.Println(err5)
	}

	jsonData2 := []Related_stocks{}
	err6 := json.Unmarshal(data2, &jsonData2)
	if err6 != nil {
		log.Println("\n error umarshiling related")
		log.Println(err6)
	}

	for i := 0; i < len(jsonData2); i++ {
		jsonData2[i].ChangeClean = strconv.FormatFloat(jsonData2[i].Change, 'f', 2, 64)
		jsonData2[i].TickerLowerCase = strings.ToLower(jsonData2[i].Ticker)
	}

	channel <- jsonData2

}

func GetStockNews(ticker string, wg *sync.WaitGroup, channel chan<- []Stock_news) {
	defer wg.Done()
	resp, err := http.Get("https://financialmodelingprep.com/api/v3/stock_news?tickers=" + ticker + "&limit=6&apikey=" + os.Getenv("STOCK_API_KEY"))
	if err != nil {
		log.Println("error in news err 1")
		log.Println(err)
	}
	defer resp.Body.Close()
	data, err2 := io.ReadAll(resp.Body)
	if err2 != nil {
		log.Println("error in news err 2")
		log.Println(err2)
	}
	jsonData := []Stock_news{}
	err3 := json.Unmarshal(data, &jsonData)
	if err3 != nil {
		log.Println("\n error umarshiling stocknews")
		log.Println(err3)
	}

	//change all the date formats
	for i := 0; i < len(jsonData); i++ {
		jsonData[i].Date = strings.Split(jsonData[i].Date, " ")[0]
	}

	channel <- jsonData
}

func GetCompanyQuote(ticker string, wg *sync.WaitGroup, channel chan<- Company_quote) {
	defer wg.Done()
	resp, err := http.Get("https://financialmodelingprep.com/api/v3/quote/" + ticker + "?apikey=" + os.Getenv("STOCK_API_KEY"))
	if err != nil {
		log.Println("error in quote err 1")
		log.Println(err)
	}
	defer resp.Body.Close()
	data, err2 := io.ReadAll(resp.Body)
	if err != nil {
		log.Println("error in quote err 2")
		log.Println(err2)
	}

	jsonData := []Company_quote{}
	err3 := json.Unmarshal(data, &jsonData)
	if err3 != nil {
		log.Println("\n error umarshiling copmany quote ")
		log.Println(err3)
	}

	jsonData[0].ChangeClean = strconv.FormatFloat(jsonData[0].Change, 'f', 2, 64)
	jsonData[0].ChangePercentageClean = strconv.FormatFloat(jsonData[0].ChangePercentage, 'f', 2, 64)
	jsonData[0].PriceClean = strconv.FormatFloat(float64(jsonData[0].Price), 'f', 2, 64)

	channel <- jsonData[0]
}

func GetImportantPeople(ticker string, wg *sync.WaitGroup, channel chan<- []Key_executive) {
	defer wg.Done()
	resp, err := http.Get("https://financialmodelingprep.com/api/v3/key-executives/" + ticker + "?apikey=" + os.Getenv("STOCK_API_KEY"))
	if err != nil {
		log.Println("error in important err 1")
		log.Println(err)
	}
	defer resp.Body.Close()
	data, err2 := io.ReadAll(resp.Body)
	if err2 != nil {
		log.Println("error in important err 2")
		log.Println(err2)
	}

	jsonData := []Key_executive{}
	err3 := json.Unmarshal(data, &jsonData)
	if err3 != nil {
		log.Println("\n key exec")
		log.Println(err3)
	}

	channel <- jsonData

}

func GetCompanyProfile(ticker string) []Company_Profile {
	resp, err := http.Get("https://financialmodelingprep.com/api/v3/profile/" + ticker + "?apikey=" + os.Getenv("STOCK_API_KEY"))
	if err != nil {
		log.Println("error in profile err 1")
		log.Println(err)
	}
	defer resp.Body.Close()

	data, err2 := io.ReadAll(resp.Body)
	if err2 != nil {
		log.Println("error in important err 2")
		log.Println(err2)
	}

	jsonData := []Company_Profile{}
	err3 := json.Unmarshal(data, &jsonData)
	if err3 != nil {
		log.Println("\n error umarshiling company profile ")
		log.Println(err3)
	}

	//if company profile exists
	if len(jsonData) != 0 {
		//make website displayed cleaner if possible
		if len(strings.Split(jsonData[0].Website, "/")) > 1 {
			jsonData[0].WebsiteClean = strings.Split(jsonData[0].Website, "/")[2]

			if len(strings.Split(jsonData[0].WebsiteClean, "www.")) > 1 {
				jsonData[0].WebsiteClean = strings.Split(jsonData[0].WebsiteClean, "www.")[1]
			}

		}

		//check to see if company has insider trading records
		insiderRequest, err4 := http.Get("https://financialmodelingprep.com/api/v4/insider-trading?symbol=" + ticker + "&page=0&apikey=" + os.Getenv("STOCK_API_KEY"))
		if err4 != nil {
			log.Println("\n error getting company insider records")
			log.Println(err4)
		}
		defer insiderRequest.Body.Close()

		jsonData[0].SymbolLowerCase = strings.ToLower(jsonData[0].Symbol)

		insiderData, err5 := io.ReadAll(insiderRequest.Body)
		if err5 != nil {
			log.Println("\n error reading insider records request")
			log.Println(err5)
		}
		var insiderJsonData []Insider_trade_data
		jsonErr := json.Unmarshal(insiderData, &insiderJsonData)
		if jsonErr != nil {
			log.Println("\n error unmarshaling json insider data")
			log.Println(jsonErr)
		}
		if len(insiderJsonData) == 0 {
			jsonData[0].InsiderPageLink = ""
		} else {
			jsonData[0].InsiderPageLink = jsonData[0].SymbolLowerCase
		}
	}

	return jsonData

}

func GetChartData(ticker string, wg *sync.WaitGroup, ch chan<- Chart_Data, companyName string) {
	defer wg.Done()
	resp, err := http.Get("https://financialmodelingprep.com/api/v3/historical-price-full/" + ticker + "?serietype=line&apikey=" + os.Getenv("STOCK_API_KEY"))
	if err != nil {
		log.Println("error in chart err 1")
		log.Println(err)
	}
	defer resp.Body.Close()

	data, err2 := io.ReadAll(resp.Body)

	if err2 != nil {
		log.Println("error in chart err 2")
		log.Println(err2)
	}

	jsonData := Chart_Data{}
	err3 := json.Unmarshal(data, &jsonData)
	if err3 != nil {
		log.Println("\n error umarshiling chartdata")
		log.Println(err3)
	}

	//only need the first 30 elements in slice
	if len(jsonData.Historical) > 30 {
		jsonData.Historical = jsonData.Historical[0:30]
	}

	jsonData.DescriptionText = GenerateChartDescription(jsonData.Historical, companyName)

	ch <- jsonData

}
