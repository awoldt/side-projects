package main

import (
	"math"
	"strconv"
)

// checks to see if specific element exists inside a slice
// returns -1 if not
func IndexOf(element string, data []string) int {
	for k, v := range data {
		if element == v {
			return k
		}
	}
	return -1 //not found.
}

// returns string to display above chart
func GenerateChartDescription(prices []Historical, companyName string) string {

	var str string
	var MAXPRICE float64 = float64(prices[0].Close)
	var MINPRICE float64 = float64(prices[0].Close)
	for i := range prices {
		if float64(prices[i].Close) > MAXPRICE {
			MAXPRICE = float64(prices[i].Close)
		}
	}
	for i := range prices {
		if float64(prices[i].Close) < MINPRICE {
			MINPRICE = float64(prices[i].Close)
		}
	}

	//stock has gone up
	if prices[0].Close > prices[len(prices)-1].Close {
		var percentIncrease float64 = math.Abs(float64((((prices[len(prices)-1].Close - prices[0].Close) / prices[len(prices)-1].Close) * 100)))

		str = companyName + " stock has gone up " + strconv.FormatFloat(float64(percentIncrease), 'f', 2, 64) + "% in the last " + strconv.Itoa(len(prices)) + " days, with the high being $" + strconv.FormatFloat(MAXPRICE, 'f', 2, 64) + " and the low being $" + strconv.FormatFloat(MINPRICE, 'f', 2, 64) + "."
	}

	//stock has gone down
	if prices[0].Close < prices[len(prices)-1].Close {
		var percentDecrease float64 = math.Abs(float64((((prices[len(prices)-1].Close - prices[0].Close) / prices[len(prices)-1].Close) * 100)))
		str = companyName + " stock has gone down " + strconv.FormatFloat(float64(percentDecrease), 'f', 2, 64) + "% in the last " + strconv.Itoa(len(prices)) + " days, with the high being $" + strconv.FormatFloat(MAXPRICE, 'f', 2, 64) + " and the low being $" + strconv.FormatFloat(MINPRICE, 'f', 2, 64) + "."
	}

	return str //will return "" if stock hasn't gone up or down in the past 30 days

}
