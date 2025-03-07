import React, { useContext, useState, useEffect } from 'react';
import Modal from "react-bootstrap/Modal";
import { Button, Dropdown, Form, Col, Row } from "react-bootstrap";
import { Context } from "../../index";
import { createDevice, fetchCounts } from "../../http/deviceAPI";
import { observer } from "mobx-react-lite";

const CreateDevice = observer(({ show, onHide }) => {
    const { device } = useContext(Context);
    const [name, setName] = useState('');
    const [info, setInfo] = useState([]);

    useEffect(() => {
        fetchCounts().then(data => device.setCounts(data));
    }, []);

    const addInfo = () => {
        setInfo([...info, { 
            title: '', 
            description1: '', 
            description2: '', 
            description3: '', 
            description4: '', 
            rightAnswers: [], 
            number: Date.now() 
        }]);
    };

    const removeInfo = (number) => {
        setInfo(info.filter(i => i.number !== number));
    };

    const changeInfo = (key, value, number) => {
        setInfo(info.map(i =>
            i.number === number
                ? { ...i, [key]: Array.isArray(i[key]) ? [value] : value }
                : i
        ));
    };

    const handleCheckboxChange = (value, number) => {
        setInfo(info.map(i => {
            if (i.number === number) {
                const newRightAnswers = i.rightAnswers.includes(value)
                    ? i.rightAnswers.filter(answer => answer !== value)
                    : [...i.rightAnswers, value];
                return { ...i, rightAnswers: newRightAnswers };
            }
            return i;
        }));
    };

    const addDevice = () => {
        const sanitizedInfo = info.map(q => ({
            ...q,
            rightAnswers: q.rightAnswers || []
        }));

        console.log("Отправляемые данные:",name,device.selectedBrand.id, sanitizedInfo);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('brandId', device.selectedBrand.id);
        formData.append('info', JSON.stringify(sanitizedInfo));

        createDevice(formData).then(() => onHide());
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Добавить опрос
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Dropdown className="mt-2 mb-2">
                        <Dropdown.Toggle>{device.selectedBrand.name || "Выберите категорию"}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {device.brands.map(brand =>
                                <Dropdown.Item
                                    onClick={() => device.setSelectedBrand(brand)}
                                    key={brand.id}
                                >
                                    {brand.name}
                                </Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Form.Control
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="mt-3"
                        placeholder="Введите название опроса"
                    />
                    <hr />
                    <Button variant={"outline-dark"} onClick={addInfo}>
                        Добавить новый вопрос
                    </Button>
                    {info.map((i, index) =>
                        <Col className="mt-4" key={i.number}>
                            <Col className="mt-2 mb-2">
                                <Dropdown className="mt-2 mb-2">
                                    <Dropdown.Toggle>{i.count || "Выберите тип"}</Dropdown.Toggle>
                                    <Dropdown.Menu>
                                    {device.counts.map(count => 
                                        <Dropdown.Item
                                            onClick={(e) => {
                                                device.setSelectedCount(count);
                                                changeInfo('count', count.name, i.number);
                                            }}
                                            key={count.id}
                                        >
                                            {count.name}
                                        </Dropdown.Item>
                                    )}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                            <Form.Control
                                value={i.title}
                                onChange={(e) => changeInfo('title', e.target.value, i.number)}
                                placeholder="Введите вопрос"
                            />
                            {[1, 2, 3, 4].map(num => (
                                <Row key={num} className="mt-2 mb-2">
                                    <input 
                                        type={i.count === 'несколько вариантов ответа' ? 'checkbox' : 'radio'} 
                                        name={index} 
                                        value={`description${num}`} 
                                        onChange={(e) => 
                                            i.count === 'несколько вариантов ответа' 
                                                ? handleCheckboxChange(`description${num}`, i.number) 
                                                : changeInfo('rightAnswers', `description${num}`, i.number)
                                        } 
                                    />
                                    <Form.Control
                                        value={i[`description${num}`]}
                                        onChange={(e) => changeInfo(`description${num}`, e.target.value, i.number)}
                                        placeholder={`Введите варинты ответа(${num})`}
                                    />
                                </Row>
                            ))}
                            <Button variant={"outline-danger"} onClick={() => removeInfo(i.number)}>
                                Удалить
                            </Button>
                        </Col>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
                <Button variant="outline-success" onClick={addDevice}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateDevice;
