import React from "react";
import Image from "next/image";
import { Row, Col } from "react-bootstrap";

const CastCard = ({ data }) => {
  return (
    <div style={{marginBottom: '25px'}}>
      <h2 style={{ fontWeight: "normal"}}>Cast</h2>
      {data.map((item, index) => {
        return (
          <Row
            style={{ display: "inline-block", marginRight: "10px" }}
            key={index}
          >
            <Col>
                <a style={{textDecoration: 'none'}} href={"/cast/" + data[index].cast_id}>
                  <Image
                    src={item.cast_profile_picture}
                    layout={"intrinsic"}
                    width={150}
                    height={150}
                    alt={item.cast_name}
                  />
                  <br></br>
                  <span style={{fontSize: '20px'}}>{item.cast_name}</span>
                </a>
            </Col>
          </Row>
        );
      })}
    </div>
  );
};

export default CastCard;
