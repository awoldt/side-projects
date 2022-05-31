import { Row } from "react-bootstrap";
import { useRef } from "react";

const WordleSquareGrid = ({ rs, cr, w }) => {
  const gridPadding = useRef();

  return (
    <div ref={gridPadding} style={{ marginTop: "100px", marginBottom: "50px" }}>
      {rs.map((r, rIndex) => {
        //ROW IS NOT COMPLETED
        if (cr[rIndex] === false) {
          return (
            <Row
              key={rIndex}
              style={{ marginBottom: "10px" }}
              className="justify-content-center"
            >
              {r.map((y) => {
                return (
                  <div
                    style={{
                      color: "black",
                      backgroundColor: "white",
                      padding: "10px",
                      marginRight: "10px",
                      height: "50px",
                      width: "50px",
                      fontSize: "30px",
                      lineHeight: "25px",
                      fontWeight: "bold",
                      border: "1px solid grey",
                    }}
                    className="text-center"
                  >
                    {y}
                  </div>
                );
              })}
            </Row>
          );
          //ROW IS COMPLETED, GRADE ALL CHARS
        } else {
          return (
            <Row
              key={rIndex}
              style={{ marginBottom: "10px" }}
              className="justify-content-center"
            >
              {r.map((y, cIndex) => {
                if (y.toLowerCase() === w[cIndex]) {
                  //GREEN
                  return (
                    <div
                      style={{
                        color: "white",
                        backgroundColor: "#538d4e",
                        padding: "10px",
                        marginRight: "10px",
                        height: "50px",
                        width: "50px",
                        fontSize: "30px",
                        lineHeight: "25px",
                        fontWeight: "bold",
                      }}
                      className="text-center"
                    >
                      {y}
                    </div>
                  );
                } else {
                  //YELLOW
                  if (w.indexOf(y.toLowerCase()) !== -1) {
                    return (
                      <div
                        style={{
                          color: "white",
                          backgroundColor: "#b59f3b",
                          padding: "10px",
                          marginRight: "10px",
                          height: "50px",
                          width: "50px",
                          fontSize: "30px",
                          lineHeight: "25px",
                          fontWeight: "bold",
                        }}
                        className="text-center"
                      >
                        {y}
                      </div>
                    );
                  } else {
                    //BLACK
                    return (
                      <div
                        style={{
                          color: "white",
                          backgroundColor: "#3a3a3c",
                          padding: "10px",
                          marginRight: "10px",
                          height: "50px",
                          width: "50px",
                          fontSize: "30px",
                          lineHeight: "25px",
                          fontWeight: "bold",
                        }}
                        className="text-center"
                      >
                        {y}
                      </div>
                    );
                  }
                }
              })}
            </Row>
          );
        }
      })}
    </div>
  );
};

export default WordleSquareGrid;
