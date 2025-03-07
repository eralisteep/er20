import React, { useContext } from 'react';
import { Card, Col, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { DEVICE_ROUTE } from "../utils/consts";
import { Context } from '..';

const DeviceItem = ({ device, brand }) => {
    const { user } = useContext(Context);
    const history = useHistory();

    const handleClick = () => {
        if (user.isAuth) {
            history.push(DEVICE_ROUTE + '/' + device.id);
        } else {
            alert("Не авторизован");
        }
    };

    return (
        <Col md={3} className={"mt-3"}>
            <Row>
                <Card 
                    style={{ cursor: 'pointer', display: 'inline' ,backgroundColor: '#c7d6d6'}} 
                    border={"light"} 
                    onClick={handleClick}
                >
                    <h2>{device.name}</h2>
                </Card>
            </Row>
        </Col>
    );
};

export default DeviceItem;
