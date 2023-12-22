// all the logic necessary to view /stock route

package main

import (
	"encoding/json"
	"os"
	"strconv"
	"strings"
	"sync"

	"io"
	"log"
	"net/http"
)

func GetGainersAndLosers(wg *sync.WaitGroup, channel chan<- GainLose) {
	defer wg.Done()
	//get biggest gainers
	gainerResponse, err := http.Get("https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey=" + os.Getenv("STOCK_API_KEY"))
	if err != nil {
		log.Println(err)
	}
	defer gainerResponse.Body.Close()
	gainerData, err2 := io.ReadAll(gainerResponse.Body)
	if err2 != nil {
		log.Println(err2)
	}
	gainerJsonData := []Gainer_loser{}
	jsonErr := json.Unmarshal(gainerData, &gainerJsonData)
	if jsonErr != nil {
		log.Println(jsonErr)
	}

	//get biggest losers
	loserResponse, err := http.Get("https://financialmodelingprep.com/api/v3/stock_market/losers?apikey=" + os.Getenv("STOCK_API_KEY"))
	if err != nil {
		log.Println(err)
	}
	defer loserResponse.Body.Close()
	loserData, err2 := io.ReadAll(loserResponse.Body)
	if err2 != nil {
		log.Println(err2)
	}
	loserJsonData := []Gainer_loser{}
	jsonErr2 := json.Unmarshal(loserData, &loserJsonData)
	if jsonErr2 != nil {
		log.Println(jsonErr2)
	}

	var returnData GainLose = GainLose{
		Gainers: gainerJsonData[0:10],
		Losers:  loserJsonData[0:10],
	}

	for i := 0; i < len(returnData.Gainers); i++ {
		returnData.Gainers[i].SymbolLowerCase = strings.ToLower(returnData.Gainers[i].Symbol)
		returnData.Gainers[i].ChangeClean = strconv.FormatFloat(returnData.Gainers[i].Change, 'f', 2, 64)
		returnData.Gainers[i].ChangePercentageClean = strconv.FormatFloat(returnData.Gainers[i].ChangePercentage, 'f', 2, 64)
	}
	for i := 0; i < len(returnData.Losers); i++ {
		returnData.Losers[i].SymbolLowerCase = strings.ToLower(returnData.Losers[i].Symbol)
		returnData.Losers[i].ChangeClean = strconv.FormatFloat(returnData.Losers[i].Change, 'f', 2, 64)
		returnData.Losers[i].ChangePercentageClean = strconv.FormatFloat(returnData.Losers[i].ChangePercentage, 'f', 2, 64)
	}

	channel <- returnData

}

func GetSectorPerformance(wg *sync.WaitGroup, channel chan<- []Sector_data) {
	defer wg.Done()
	resp, err := http.Get("https://financialmodelingprep.com/api/v3/sector-performance?apikey=" + os.Getenv("STOCK_API_KEY"))
	if err != nil {
		log.Println(err)
	}
	defer resp.Body.Close()

	sectorData, err2 := io.ReadAll(resp.Body)
	if err2 != nil {
		log.Println(err2)
	}
	sectorJsonData := []Sector_data{}
	jsonErr := json.Unmarshal(sectorData, &sectorJsonData)
	if jsonErr != nil {
		log.Println(jsonErr)
	}

	for i := 0; i < len(sectorJsonData); i++ {
		s, err := strconv.ParseFloat(strings.Split(sectorJsonData[i].ChangePercentage, "%")[0], 64)
		if err != nil {
			log.Println(err)
		}
		sectorJsonData[i].ChangePercentageFloat = s
	}

	channel <- sectorJsonData

}

func GetMostActiveStocks(wg *sync.WaitGroup, channel chan<- []Most_active) {
	defer wg.Done()
	resp, err := http.Get("https://financialmodelingprep.com/api/v3/stock_market/actives?apikey=" + os.Getenv("STOCK_API_KEY"))
	if err != nil {
		log.Println(err)
	}
	defer resp.Body.Close()

	data, err2 := io.ReadAll(resp.Body)
	if err2 != nil {
		log.Println(err2)
	}

	jsonData := []Most_active{}
	err3 := json.Unmarshal(data, &jsonData)
	if err3 != nil {
		log.Println(err3)
	}

	if len(jsonData) >= 18 {
		jsonData = jsonData[0:18]
	}

	channel <- jsonData

}

func GetMarketNews(wg *sync.WaitGroup, channel chan<- []Market_news) {
	defer wg.Done()
	resp, err := http.Get("https://financialmodelingprep.com/api/v3/stock_news?limit=6&apikey=" + os.Getenv("STOCK_API_KEY"))
	if err != nil {
		log.Println(err)
	}
	defer resp.Body.Close()

	data, err2 := io.ReadAll(resp.Body)
	if err2 != nil {
		log.Println(err2)
	}

	jsonData := []Market_news{}
	err3 := json.Unmarshal(data, &jsonData)
	if err3 != nil {
		log.Println(err3)
	}

	for i := 0; i < len(jsonData); i++ {
		jsonData[i].PublishedDateClean = strings.Split(jsonData[i].PublishedDate, " ")[0]
	}

	channel <- jsonData
}
