package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
)

func GetRecentInsiderTrading(wg *sync.WaitGroup, channel chan<- []Insider_trade_data) {

	defer wg.Done()
	resp, err := http.Get("https://financialmodelingprep.com/api/v4/insider-trading?page=0&apikey=" + os.Getenv("STOCK_API_KEY"))
	if err != nil {
		log.Println(err)
	}

	defer resp.Body.Close()
	data, err2 := io.ReadAll(resp.Body)
	if err2 != nil {
		log.Println(err2)
	}

	var insiderTradingRecords []Insider_trade_data

	jsonErr := json.Unmarshal(data, &insiderTradingRecords)
	if jsonErr != nil {
		log.Println(jsonErr)
	}

	var uniqueSymbols []string
	for i := 0; i < len(insiderTradingRecords); i++ {
		if x := IndexOf(insiderTradingRecords[i].Symbol, uniqueSymbols); x == -1 {
			uniqueSymbols = append(uniqueSymbols, insiderTradingRecords[i].Symbol)

		}
		insiderTradingRecords[i].SymbolToLowerCase = strings.ToLower(insiderTradingRecords[i].Symbol)
	}

	//get the company profile data for each company
	companyProfiles, err := http.Get("https://financialmodelingprep.com/api/v3/profile/" + strings.Join(uniqueSymbols, ",") + "?apikey=" + os.Getenv("STOCK_API_KEY"))
	if err != nil {
		log.Println(err)
	}
	defer companyProfiles.Body.Close()
	companyProfileData, err2 := io.ReadAll(companyProfiles.Body)
	if err2 != nil {
		log.Println(err2)
	}

	var companyProfileJsonData []Company_Profile
	jsonErr2 := json.Unmarshal(companyProfileData, &companyProfileJsonData)
	if jsonErr2 != nil {
		log.Println(jsonErr2)
	}

	var returnData []Insider_trade_data

	//loop through all companies and match with 1 insider record
	for i := 0; i < len(companyProfileJsonData); i++ {
		for y := 0; y < len(insiderTradingRecords); y++ {
			if companyProfileJsonData[i].Symbol == insiderTradingRecords[y].Symbol {
				var x Insider_trade_data = insiderTradingRecords[y]
				x.CompanyName = companyProfileJsonData[i].Name
				x.CompanyLogo = companyProfileJsonData[i].Image

				returnData = append(returnData, x)
				break
			}
		}
	}

	channel <- returnData

}

func GetCompanyInsiderRecords(trades []Insider_trade_data, ticker string, wg *sync.WaitGroup, channel chan<- Company_Profile, channel2 chan<- []string) {

	defer wg.Done()

	//get all unique traders
	var uniqueTraders []string
	for i := 0; i < len(trades); i++ {
		if x := IndexOf(strings.ToUpper(trades[i].Person), uniqueTraders); x == -1 {
			uniqueTraders = append(uniqueTraders, strings.ToUpper(trades[i].Person))
		}
	}

	//get company profile information
	resp2, err3 := http.Get("https://financialmodelingprep.com/api/v3/profile/" + ticker + "?apikey=" + os.Getenv("STOCK_API_KEY"))
	if err3 != nil {
		log.Println(err3)
	}
	defer resp2.Body.Close()
	companyData, err4 := io.ReadAll(resp2.Body)
	if err4 != nil {
		log.Println(err4)
	}

	var companyJsonData []Company_Profile
	err5 := json.Unmarshal(companyData, &companyJsonData)
	if err5 != nil {
		log.Println(err5)
	}
	companyJsonData[0].SymbolLowerCase = strings.ToLower(companyJsonData[0].Symbol)

	channel <- companyJsonData[0]
	channel2 <- uniqueTraders
}
