const generateTemplate = async (chart_type) => {
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

    return x;
  };

  switch (chart_type) {
    case "bar":
      const barTemplates = [
        //1st template
        [
          "Q1,Q2,Q3,Q4",
          [
            { data: [230, 200, 105, 160], label: "Coke" },
            { data: [140, 176, 190, 165], label: "Pepsi" },
            { data: [123, 243, 187, 143], label: "Sprite" },
          ],
          { title: "Soda earnings", xAxis: "Quarter", yAxis: "Earnings ($)" },
        ],
      ];

      return [
        await commaArrayConvert(barTemplates[0][0]),
        barTemplates[0][1],
        barTemplates[0][2],
      ];

    case "line":
      const lineTemplates = [
        //1st template
        [
          "Q1,Q2,Q3,Q4",
          [
            { data: [654, 867, 234, 543], label: "Coke" },
            { data: [234, 876, 345, 567], label: "Pepsi" },
            { data: [344, 345, 765, 985], label: "Sprite" },
          ],
          { title: "Soda earnings", xAxis: "Quarter", yAxis: "Earnings ($)" },
        ],
      ];

      return [
        await commaArrayConvert(lineTemplates[0][0]),
        lineTemplates[0][1],
        lineTemplates[0][2],
      ];

    case "radar":
      const radarTemplates = [
        //1st template
        [
          "Sweet, Salty, Crunchy, Bitter, Taste, Overall",
          [
            { data: [10, 5, 8, 3, 6, 9], label: "Hershey" },
            { data: [2, 2, 6, 5, 8, 9], label: "Twix" },
            { data: [10, 6, 7, 9, 6, 3], label: "Butterfinger" },
            { data: [4, 5, 5, 7, 8, 9], label: "Milky Way" },
          ],
          { title: "Chocolate Brands" },
        ],
      ];

      return [
        await commaArrayConvert(radarTemplates[0][0]),
        radarTemplates[0][1],
        radarTemplates[0][2],
      ];

    default:
      return null;
  }
};

export default generateTemplate;
