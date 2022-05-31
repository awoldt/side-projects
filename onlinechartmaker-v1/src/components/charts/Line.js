import { Row, Col, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect, useRef } from "react";
import DownloadChart from "../DownloadChart";
import AlertDiv from "../AlertDiv";
import { Helmet } from "react-helmet-async";
import generateTemplate from "../../scripts/ChartTemplates";
import { DebounceInput } from "react-debounce-input";

const Line = () => {
  const [renderChart, setRenderChart] = useState(0);

  const [templateSet, setTemplateSet] = useState(false);
  const [startFromScratch, setStartFromScratch] = useState(true);

  const [chartTitle, setChartTitle] = useState("");
  const [xAxesLabel, setXAxesLabel] = useState("");
  const [yAxesLabel, setYAxesLabel] = useState("");

  const firstChartRender = decodeURI(
    "https://quickchart.io/chart?c=%7B%22type%22%3A%22line%22%2C%22data%22%3A%7B%22labels%22%3A%5B%22Q1%22%2C%22Q2%22%2C%22Q3%22%2C%22Q4%22%5D%2C%22datasets%22%3A%5B%7B%22data%22%3A%5B654%2C867%2C234%2C543%5D%2C%22label%22%3A%22Coke%22%7D%2C%7B%22data%22%3A%5B234%2C876%2C345%2C567%5D%2C%22label%22%3A%22Pepsi%22%7D%2C%7B%22data%22%3A%5B344%2C345%2C765%2C%22985%22%5D%2C%22label%22%3A%22Sprite%22%7D%5D%7D%2C%22options%22%3A%7B%22title%22%3A%7B%22display%22%3Atrue%2C%22text%22%3A%22Soda%20earnings%22%7D%2C%22scales%22%3A%7B%22xAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22Quarter%22%7D%7D%5D%2C%22yAxes%22%3A%5B%7B%22scaleLabel%22%3A%7B%22display%22%3Atrue%2C%22labelString%22%3A%22Earnings%20(%24)%22%7D%7D%5D%7D%7D%7D"
  );
  const [chartImg, setChartImg] = useState(firstChartRender);
  const [chartImgFormat, setChartImgFormat] = useState("png"); //default value is png file

  const [labels, setLabels] = useState([]);

  const [datasetTxt, setDatasetTxt] = useState(null); //name of dataset to be added
  const [datasets, setDatasets] = useState([]); //collection of all datasets

  const [alertTxt, setAlertTxt] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const datasetTxtRef = useRef();
  const removeDataSet = useRef();

  //takes the values of lables as string and splits into array with multiple values
  const commaArrayConvert = async (string) => {
    var values = string.split(",");

    var x = await Promise.all(
      values.map((item) => {
        if (item !== "") {
          return item;
        }
      })
    );
    //any value that is undfined will be removed for labels
    x = x.filter((y) => y !== undefined);
    setLabels(x);
    setRenderChart((x) => x + 1);
  };

  //sets alert div at top of page for 5 seconds
  const alertTimeout = () => {
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  //removes dataset at specific index
  const removeDataset = async (index) => {
    const x = [...datasets];
    x.splice(index, 1);
    setDatasets(x);
  };

  useEffect(() => {
    //creates quickchart GET url
    const constructChart = async () => {
      var urlOptions = {
        type: "line", // Show a line chart
        data: {
          labels: labels, // Set X-axis labels
          datasets: datasets,
        },
        options: {
          title: {
            display: true,
            text: chartTitle,
          },
          scales: {
            xAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: xAxesLabel,
                },
              },
            ],
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: yAxesLabel,
                },
              },
            ],
          },
        },
      };
      urlOptions = await JSON.stringify(urlOptions);
      setChartImg(
        "https://quickchart.io/chart?c=" + encodeURIComponent(urlOptions)
      );
    };

    //sets premade template for user to understand how to use it on first render
    const setTemplate = async () => {
      const x = await generateTemplate("line");
      setLabels(x[0]);
      setDatasets(x[1]);
      setChartTitle(x[2].title);
      setXAxesLabel(x[2].xAxis);
      setYAxesLabel(x[2].yAxis);

      setTemplateSet(true);
    };

    //only sets template on first render
    if (templateSet === false) {
      setTemplate();
      //every render after the initial render
    } else {
      constructChart();
    }
  }, [renderChart]);

  return (
    <div style={{ marginTop: "25px" }}>
      <Helmet>
        <title>Simple Line Chart Maker</title>
        <meta
          name="description"
          content="Generate a line chart with easy to use tools and high quality images. Save the chart as a JPG,PNG, or WEBP file."
        />
        <link rel="canonical" href="https://onlinechartmaker.com/#/line" />
      </Helmet>

      <h1 className="text-danger mb-5" style={{ fontSize: "50px" }}>
        Line chart
      </h1>

      {showAlert && <AlertDiv errorMsg={alertTxt} />}

      <div>
        <Row>
          <Col lg={6}>
            <label
              style={{ display: "inline-block", fontSize: "25px" }}
              htmlFor="chart-title"
            >
              Chart title{" "}
            </label>{" "}
            <DebounceInput
              minLength={1}
              debounceTimeout={1000}
              onChange={(e) => {
                setChartTitle(e.target.value);
                setRenderChart((x) => x + 1);
              }}
              maxLength="100"
              id="chart-title"
            />
            {chartTitle !== "" && <p>({chartTitle})</p>}
            <br></br>
            <br></br>
            <label
              style={{ display: "inline-block", fontSize: "25px" }}
              htmlFor="xaxis-name"
            >
              X axis name{" "}
            </label>{" "}
            <DebounceInput
              minLength={1}
              debounceTimeout={1000}
              onChange={(e) => {
                setXAxesLabel(e.target.value);
                setRenderChart((x) => x + 1);
              }}
              maxLength="50"
              id="xaxis-name"
            />
            {xAxesLabel !== "" && <p>({xAxesLabel})</p>}
            <br></br>
            <br></br>
            <label
              style={{ display: "inline-block", fontSize: "25px" }}
              htmlFor="yaxis-name"
            >
              Y axis name{" "}
            </label>{" "}
            <DebounceInput
              minLength={1}
              debounceTimeout={1000}
              onChange={(e) => {
                setYAxesLabel(e.target.value);
                setRenderChart((x) => x + 1);
              }}
              maxLength="50"
              id="yaxis-name"
            />
            {yAxesLabel !== "" && <p>({yAxesLabel})</p>}
            <br></br>
            <br></br>
          </Col>
          <Col lg={6}>
            <label
              style={{ display: "inline-block", fontSize: "25px" }}
              htmlFor="label-names"
            >
              Label names
            </label>{" "}
            <input
              type="text"
              onChange={(e) => {
                setDatasetTxt(e.target.value);
              }}
              onKeyUp={(e) => {
                if (datasetTxt !== null) {
                  if (e.code === "Enter") {
                    //make sure dataset name has not already been added
                    const pushedLabels = datasets.map((item) => {
                      return item.label.toLowerCase();
                    });
                    //there is a label with that name already
                    //DO NOT ADD
                    if (pushedLabels.indexOf(datasetTxt.toLowerCase()) !== -1) {
                      setAlertTxt(
                        'The label "' +
                          datasetTxt.toLowerCase() +
                          '" has already been added'
                      );
                      alertTimeout();
                      //label name does not exist
                      //ADD IT
                    } else {
                      setDatasets([
                        ...datasets,
                        { label: datasetTxt, data: new Array(labels.length) },
                      ]);
                      setDatasetTxt(null);
                      datasetTxtRef.current.value = ""; // sets dataset input to empty after adding one
                      setRenderChart((x) => x + 1);
                    }
                  }
                }
              }}
              ref={datasetTxtRef}
              id="label-names"
            />{" "}
            <Button
              onClick={() => {
                if (datasetTxt !== null) {
                  //make sure dataset name has not already been added
                  const pushedLabels = datasets.map((item) => {
                    return item.label.toLowerCase();
                  });

                  if (pushedLabels.indexOf(datasetTxt.toLowerCase()) !== -1) {
                    //there is a label with that name already
                    //DO NOT ADD
                    setAlertTxt(
                      'The label "' +
                        datasetTxt.toLowerCase() +
                        '" has already been added'
                    );
                    alertTimeout();
                  } else {
                    //label name does not exist
                    //ADD IT
                    setDatasets([
                      ...datasets,
                      { label: datasetTxt, data: new Array(labels.length) },
                    ]);
                    setDatasetTxt(null);
                    datasetTxtRef.current.value = ""; // sets dataset input to empty after adding one
                    setRenderChart((x) => x + 1);
                  }
                }
              }}
            >
              Add
            </Button>
            <br></br>
            {labels.length !== 0 && (
              <ul>
                {datasets.map((item, index) => {
                  return <li key={index}>{item.label}</li>;
                })}
              </ul>
            )}
            <br></br>
            <label
              style={{ display: "inline-block", fontSize: "25px" }}
              htmlFor="group-names"
            >
              Group names (seperate with commas){" "}
            </label>{" "}
            <DebounceInput
              minLength={1}
              debounceTimeout={1000}
              onChange={(e) => {
                commaArrayConvert(e.target.value);
              }}
              id="group-names"
            />
            <br></br>
            {labels.length !== 0 && (
              <ul>
                {labels.map((item, index) => {
                  return <li key={index}>{item}</li>;
                })}
              </ul>
            )}
          </Col>
        </Row>

        <br></br>
        <hr></hr>
        <br></br>
        {startFromScratch && (
          <div className="text-center mb-3">
            <Button
              variant="danger"
              onClick={() => {
                setLabels([]);
                setDatasets([]);
                setChartTitle("");
                setXAxesLabel("");
                setYAxesLabel("");

                setStartFromScratch(false);
                setRenderChart((x) => x + 1);
              }}
            >
              Start from scratch
            </Button>
          </div>
        )}
        <Row>
          <Col xl={6} xl="5">
            {datasets.length !== 0 && (
              <Row className="mt-3">
                {datasets.map((item, index1) => {
                  return (
                    <Col
                      style={{
                        backgroundColor: "#f2f2f2",
                        padding: "10px",
                        borderRadius: "10px",
                        marginBottom: "10px",
                        marginRight: "10px",
                      }}
                      key={index1}
                    >
                      <div className="text-center">
                        <p
                          style={{
                            display: "inline-block",
                            marginRight: "15px",
                            fontSize: "30px",
                          }}
                        >
                          {item.label}
                        </p>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="25"
                          height="25"
                          fill="#cc0000"
                          className="bi bi-x-circle-fill"
                          viewBox="0 0 16 16"
                          style={{ cursor: "pointer" }}
                          ref={removeDataSet}
                          //remove dataset from array
                          onClick={() => {
                            removeDataset(index1);
                            setRenderChart((x) => x + 1);
                          }}
                        >
                          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
                        </svg>
                      </div>

                      {labels.map((item2, index2) => {
                        return (
                          <>
                            <label
                              style={{
                                fontSize: "20px",
                              }}
                              htmlFor={
                                "data-label-" + item.label + "-value-" + index2
                              }
                            >
                              {item2 + " - "}
                            </label>{" "}
                            <DebounceInput
                              placeholder={item.data[index2]}
                              key={index2}
                              id={
                                "data-label-" + item.label + "-value-" + index2
                              }
                              minLength={1}
                              debounceTimeout={1000}
                              onChange={(e) => {
                                //user entered value that is not a number
                                //SHOW ERROR, SET DATA FOR LABEL TO 0
                                if (isNaN(e.target.value) === true) {
                                  setAlertTxt(
                                    "You must enter a number value for chart to display correctly"
                                  );
                                  alertTimeout();
                                  var data = [...datasets];
                                  data[index1].data[index2] = 0; //will make line look like it doesnt render
                                  setDatasets(data);
                                  setRenderChart((x) => x + 1);
                                } else {
                                  //user entered number
                                  //RE-RENDER CHART
                                  var data = [...datasets];
                                  data[index1].data[index2] = e.target.value;
                                  setDatasets(data);
                                  setRenderChart((x) => x + 1);
                                }
                              }}
                            />
                            <br></br>
                            <br></br>
                          </>
                        );
                      })}
                    </Col>
                  );
                })}
              </Row>
            )}
          </Col>
          <Col xl={6} xl="7">
            {chartImg && (
              <>
                <img src={chartImg} className="img-fluid" alt="line chart" />
                {datasets.length !== 0 && labels.length !== 0 && (
                  <DownloadChart
                    chartImg={chartImg} //url of chart to download
                    chartImgFormat={chartImgFormat} //format
                    setChartImgFormat={setChartImgFormat}
                    chartType={"line"}
                  />
                )}
              </>
            )}
          </Col>
        </Row>
      </div>

      <br></br>
      <br></br>
      <br></br>
    </div>
  );
};

export default Line;
