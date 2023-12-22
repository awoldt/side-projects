package main

import (
	"compress/gzip"
	"encoding/json"
	"html/template"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"

	"github.com/gorilla/mux"
)

func main() {
	SET_ENV()
	router := mux.NewRouter()
	// Serve static files
	router.PathPrefix("/public/").Handler(http.StripPrefix("/public/", http.FileServer(http.Dir("./public"))))

	//HOMEPAGE
	router.HandleFunc("/", func(res http.ResponseWriter, req *http.Request) {
		if strings.Contains(req.Header.Get("Accept-Encoding"), "gzip") {
			res.Header().Add("Content-Type", "text/html")
			res.Header().Add("Content-Encoding", "gzip")

			gzw := gzip.NewWriter(res)

			defer gzw.Close()

			t, _ := template.ParseFiles("views/homepage.html")
			t.Execute(gzw, nil)
		} else {
			t, _ := template.ParseFiles("views/homepage.html")
			t.Execute(res, nil)
		}

	}).Methods("GET")

	//ABOUT PAGE
	router.HandleFunc("/about", func(res http.ResponseWriter, req *http.Request) {
		if strings.Contains(req.Header.Get("Accept-Encoding"), "gzip") {
			res.Header().Add("Content-Type", "text/html")
			res.Header().Add("Content-Encoding", "gzip")

			gzw := gzip.NewWriter(res)

			defer gzw.Close()

			t, _ := template.ParseFiles("views/about.html")
			t.Execute(gzw, nil)
		} else {
			t, _ := template.ParseFiles("views/about.html")
			t.Execute(res, nil)
		}

	}).Methods("GET")

	//SITEMAP
	router.HandleFunc("/sitemap.xml", func(res http.ResponseWriter, req *http.Request) {
		http.ServeFile(res, req, "public/sitemap.xml")
	}).Methods("GET")

	//ROBOTS.TXT
	router.HandleFunc("/robots.txt", func(res http.ResponseWriter, req *http.Request) {
		http.ServeFile(res, req, "public/robots.txt")
	}).Methods("GET")

	//MARKET OVERVIEW PAGE
	router.HandleFunc("/stock", func(res http.ResponseWriter, req *http.Request) {

		if strings.Contains(req.Header.Get("Accept-Encoding"), "gzip") {
			res.Header().Add("Content-Type", "text/html")
			res.Header().Add("Content-Encoding", "gzip")

			gzw := gzip.NewWriter(res)

			defer gzw.Close()

			gainerLoserChannel := make(chan GainLose)
			sectorChannel := make(chan []Sector_data)
			mostActiveChannel := make(chan []Most_active)
			marketNewsChannel := make(chan []Market_news)
			wg := sync.WaitGroup{}
			wg.Add(4)
			go GetSectorPerformance(&wg, sectorChannel)
			go GetGainersAndLosers(&wg, gainerLoserChannel)
			go GetMostActiveStocks(&wg, mostActiveChannel)
			go GetMarketNews(&wg, marketNewsChannel)
			var page_data MarketPageData = MarketPageData{
				GainerLoserData:  <-gainerLoserChannel,
				SectorData:       <-sectorChannel,
				MostActiveStocks: <-mostActiveChannel,
				MarketNews:       <-marketNewsChannel,
			}
			close(sectorChannel)
			close(gainerLoserChannel)
			close(mostActiveChannel)
			close(marketNewsChannel)
			wg.Wait()

			t, _ := template.ParseFiles("views/marketPage.html")
			t.Execute(gzw, page_data)
		} else {
			t, _ := template.ParseFiles("views/marketPage.html")
			t.Execute(res, nil)
		}

	}).Methods("GET")

	//INSIDER HOMEPAGE
	router.HandleFunc("/insider", func(res http.ResponseWriter, req *http.Request) {

		if strings.Contains(req.Header.Get("Accept-Encoding"), "gzip") {
			res.Header().Add("Content-Type", "text/html")
			res.Header().Add("Content-Encoding", "gzip")

			gzw := gzip.NewWriter(res)

			defer gzw.Close()

			insiderDataChannel := make(chan []Insider_trade_data)
			wg := sync.WaitGroup{}
			wg.Add(1)
			go GetRecentInsiderTrading(&wg, insiderDataChannel)
			var page_data InsiderPageData = InsiderPageData{
				InsiderRecords: <-insiderDataChannel,
			}
			close(insiderDataChannel)
			wg.Wait()

			t, _ := template.ParseFiles("views/insiderHomepage.html")
			t.Execute(gzw, page_data)

		} else {
			t, _ := template.ParseFiles("views/insiderHomepage.html")
			t.Execute(res, nil)
		}

	}).Methods("GET")

	//COMPANY INSIDER RECORDS
	router.HandleFunc("/insider/{TICKER}", func(res http.ResponseWriter, req *http.Request) {

		if strings.Contains(req.Header.Get("Accept-Encoding"), "gzip") {
			res.Header().Add("Content-Type", "text/html")
			res.Header().Add("Content-Encoding", "gzip")

			gzw := gzip.NewWriter(res)

			defer gzw.Close()

			resp, err := http.Get("https://financialmodelingprep.com/api/v4/insider-trading?symbol=" + strings.ToUpper(mux.Vars(req)["TICKER"]) + "&page=0&apikey=" + os.Getenv("STOCK_API_KEY"))
			if err != nil {
				log.Println(err)
			}
			defer resp.Body.Close()
			data, err2 := io.ReadAll(resp.Body)
			if err2 != nil {
				log.Println(err2)
			}
			var jsonData []Insider_trade_data
			jsonErr := json.Unmarshal(data, &jsonData)
			if jsonErr != nil {
				log.Println(jsonErr)
			}

			//if insider trading data for company exists
			if len(jsonData) != 0 {
				companyProfileChannel := make(chan Company_Profile)
				uniqueTradersChannel := make(chan []string)
				wg := sync.WaitGroup{}
				wg.Add(1)
				go GetCompanyInsiderRecords(jsonData, strings.ToUpper(mux.Vars(req)["TICKER"]), &wg, companyProfileChannel, uniqueTradersChannel)

				var page_data InsiderPageData = InsiderPageData{
					InsiderRecords: jsonData,
					CompanyProfile: <-companyProfileChannel,
					UniqueTraders:  <-uniqueTradersChannel,
				}

				close(companyProfileChannel)
				close(uniqueTradersChannel)
				wg.Wait()

				t, _ := template.ParseFiles("views/insiderPage.html")
				t.Execute(gzw, page_data)

			} else {
				res.WriteHeader(404)
				res.Write([]byte("Cannot find insider data "))
			}
		} else {
			t, _ := template.ParseFiles("views/insiderPage.html")
			t.Execute(res, nil)
		}

	}).Methods("GET")

	router.HandleFunc("/stock/", func(res http.ResponseWriter, req *http.Request) {
		http.Redirect(res, req, "/", http.StatusMovedPermanently)
	})

	//TICKER PAGE
	router.HandleFunc("/stock/{TICKER}", func(res http.ResponseWriter, req *http.Request) {

		if strings.Contains(req.Header.Get("Accept-Encoding"), "gzip") {
			res.Header().Add("Content-Type", "text/html")
			res.Header().Add("Content-Encoding", "gzip")

			gzw := gzip.NewWriter(res)

			defer gzw.Close()

			chartDataChannel := make(chan Chart_Data)
			importantPeopleChannel := make(chan []Key_executive)
			companyQuoteChannel := make(chan Company_quote)
			stockNewsChannel := make(chan []Stock_news)
			relatedStocksChannel := make(chan []Related_stocks)

			company := GetCompanyProfile(strings.ToUpper(mux.Vars(req)["TICKER"]))
			//404 COMPANY DOES NOT EXIST
			if len(company) == 0 {
				res.WriteHeader(404)
				res.Write([]byte("Cannot find stock"))
			} else {
				wg := sync.WaitGroup{}
				wg.Add(5)
				go GetRelatedStocks(company[0].Sector, company[0].Exchange, &wg, relatedStocksChannel, company[0].Symbol)
				go GetChartData(strings.ToUpper(mux.Vars(req)["TICKER"]), &wg, chartDataChannel, company[0].Name)
				go GetImportantPeople(strings.ToUpper(mux.Vars(req)["TICKER"]), &wg, importantPeopleChannel)
				go GetCompanyQuote(strings.ToUpper(mux.Vars(req)["TICKER"]), &wg, companyQuoteChannel)
				go GetStockNews(strings.ToUpper(mux.Vars(req)["TICKER"]), &wg, stockNewsChannel)
				var p Page_data = Page_data{CompanyProfile: company[0], ChartData: <-chartDataChannel, KeyExecutives: <-importantPeopleChannel, CompanyQuote: <-companyQuoteChannel, StockNews: <-stockNewsChannel, RelatedStocks: <-relatedStocksChannel}
				close(chartDataChannel)
				close(importantPeopleChannel)
				close(companyQuoteChannel)
				close(stockNewsChannel)
				close(relatedStocksChannel)
				wg.Wait()

				t, _ := template.ParseFiles("views/tickerPage.html")
				t.Execute(gzw, p)

			}
		} else {
			t, _ := template.ParseFiles("views/tickerPage.html")
			t.Execute(res, nil)
		}

	}).Methods("GET")

	http.ListenAndServe(":8080", router)
}
