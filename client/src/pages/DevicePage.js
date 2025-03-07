import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button } from "react-bootstrap";
import { useParams } from 'react-router-dom';
import { fetchOneDevice } from "../http/deviceAPI";
import { createTestResult } from "../http/testResultAPI";
import { Context } from "../index";

const DevicePage = () => {
    const { id } = useParams();
    const { user } = useContext(Context);
    const [device, setDevice] = useState({ info: [] });
    const [answers, setAnswers] = useState({});
    const [results, setResults] = useState({});
    const [correctCount, setCorrectCount] = useState(0);
    const [yes, setYes] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOneDevice(id).then(data => setDevice(data));
    }, [id]);

    const handleAnswerChange = (index, value) => {
        setAnswers({ ...answers, [index]: value });
    };

    const handleMultipleAnswerChange = (index, value) => {
        const currentAnswers = answers[index] || [];
        if (currentAnswers.includes(value)) {
            setAnswers({ ...answers, [index]: currentAnswers.filter(answer => answer !== value) });
        } else {
            setAnswers({ ...answers, [index]: [...currentAnswers, value] });
        }
    };

    const checkAnswers = () => {
        const newResults = {};
        let correctCount = 0;

        device.info.forEach((info, index) => {
            const userAnswer = answers[index];
            const correctAnswer = info.rightAnswers; // Ожидаемый массив

            // Преобразуем одиночный ответ в массив для сравнения
            const userAnswerArray = Array.isArray(userAnswer) ? userAnswer : [userAnswer];

            // Сортируем и сравниваем массивы
            const isCorrect = userAnswerArray.sort().toString() === correctAnswer.sort().toString();
            newResults[index] = isCorrect;

            if (isCorrect) correctCount++;
        });

        setResults(newResults);
        setCorrectCount(correctCount);
    };

    const handleSubmit = () => {
        const userId = user.user.id;
        const unansweredQuestions = device.info.filter((info, index) => !answers.hasOwnProperty(index));

        if (unansweredQuestions.length > 0) {
            setError('Пожалуйста, ответьте на все вопросы.');
            return;
        }

        checkAnswers();

        createTestResult({ deviceId: id, userId, answers }).then(data => {
            console.log('Ответы сохранены', data);
            setYes(false);
            setError('');
        });
    };

    return (
        <Container className="mt-3">
            <Row className="d-flex flex-column m-3">
                <h1>{device.name}</h1>
                {device.info.map((info, index) => (
                    <Col key={info.id} className="mt-4">
                        <Row style={{ background: 'lightgray', padding: 10 }}>
                            {index + 1} {info.title}
                        </Row>
                        {info.count === 'один вариант ответа' ? (
                            <>
                                <Row>
                                    <input type='radio' name={index} value="description1" onChange={(e) => handleAnswerChange(index, e.target.value)} />
                                    {info.description1}
                                </Row>
                                <Row>
                                    <input type='radio' name={index} value="description2" onChange={(e) => handleAnswerChange(index, e.target.value)} />
                                    {info.description2}
                                </Row>
                                <Row>
                                    <input type='radio' name={index} value="description3" onChange={(e) => handleAnswerChange(index, e.target.value)} />
                                    {info.description3}
                                </Row>
                                <Row>
                                    <input type='radio' name={index} value="description4" onChange={(e) => handleAnswerChange(index, e.target.value)} />
                                    {info.description4}
                                </Row>
                            </>
                        ) : (
                            <>
                                <Row>
                                    <input type='checkbox' value="description1" onChange={(e) => handleMultipleAnswerChange(index, e.target.value)} />
                                    {info.description1}
                                </Row>
                                <Row>
                                    <input type='checkbox' value="description2" onChange={(e) => handleMultipleAnswerChange(index, e.target.value)} />
                                    {info.description2}
                                </Row>
                                <Row>
                                    <input type='checkbox' value="description3" onChange={(e) => handleMultipleAnswerChange(index, e.target.value)} />
                                    {info.description3}
                                </Row>
                                <Row>
                                    <input type='checkbox' value="description4" onChange={(e) => handleMultipleAnswerChange(index, e.target.value)} />
                                    {info.description4}
                                </Row>
                            </>
                        )}
                        {results.hasOwnProperty(index) && (
                            <Row>
                                <span style={{ color: results[index] ? 'green' : 'red' }}>
                                    {results[index] ? "✔️ Правильно" : "❌ Ошибка"}
                                </span>
                            </Row>
                        )}
                    </Col>
                ))}
            </Row>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {yes ? (
                <Button onClick={handleSubmit}>
                    Завершить опрос
                </Button>
            ) : (
                <h3 style={{ color: 'green' }}>
                    Правильных ответов: {correctCount}/{device.info.length} (
                    {((correctCount / device.info.length) * 100).toFixed(1)}%)
                </h3>
            )}
        </Container>
    );
};

export default DevicePage;
