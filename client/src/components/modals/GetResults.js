import React, { useContext, useEffect, useState } from 'react';
import { Modal, Dropdown, Button } from 'react-bootstrap';
import axios from 'axios';
import { Context } from '../..';

const GetResults = ({ show, onHide }) => {
  const [results, setResults] = useState([]);
  const [statistics, setStatistics] = useState({});
  const { device } = useContext(Context);

  useEffect(() => {
    if (device.selectedDevice.id) {
      axios.get(`http://localhost:5000/api/testResult?deviceId=${device.selectedDevice.id}`)
        .then(response => {
          const filteredResults = response.data.filter(result => result.deviceId === device.selectedDevice.id);
          console.log('Filtered Results:', filteredResults);
          setResults(filteredResults);
        })
        .catch(error => {
          console.error('There was an error fetching the survey results!', error);
        });
    }
  }, [device.selectedDevice]);

  const getStatistics = () => {
    const stats = {};

    if (results && Array.isArray(results)) {
      results.forEach(result => {
        console.log('Processing result:', result);
        if (result.answers && typeof result.answers === 'object') {
          Object.keys(result.answers).forEach((index) => {
            const answer = result.answers[index];
            if (Array.isArray(answer)) {
              // Если answer является массивом, обрабатываем каждый элемент отдельно
              answer.forEach(singleAnswer => {
                const answerText = `Вариант ответа ${singleAnswer.replace('description', '')}`;
                if (!stats[index]) {
                  stats[index] = {};
                }
                if (!stats[index][answerText]) {
                  stats[index][answerText] = 0;
                }
                stats[index][answerText]++;
              });
            } else {
              // Если answer не является массивом, обрабатываем его как строку
              const answerText = `Вариант ответа ${answer.replace('description', '')}`;
              if (!stats[index]) {
                stats[index] = {};
              }
              if (!stats[index][answerText]) {
                stats[index][answerText] = 0;
              }
              stats[index][answerText]++;
            }
          });
        } else {
          console.warn('Missing or invalid answers for result:', result);
        }
      });
    }

    setStatistics(stats);
  };
  
  useEffect(() => {
    console.log('Statistics:', statistics);
  }, [statistics]);

  return (
    <Modal show={show} onHide={onHide}>
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {device.selectedDevice.name || "Выберите устройство"}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {Array.isArray(device.devices) && device.devices.map(deviceItem =>
            <Dropdown.Item
              onClick={() => device.setSelectedDevice(deviceItem)}
              key={deviceItem.id}
            >
              {deviceItem.name}
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
        <Button variant="outline-success" onClick={getStatistics}>Посмотреть статистику</Button>
      </Modal.Footer>
      <div>
        {Object.keys(statistics).map(questionIndex => (
          <div key={questionIndex}>
            <h3>Вопрос {parseInt(questionIndex) + 1}</h3>
            {Object.keys(statistics[questionIndex]).map(answer => (
              <div key={answer}>
                - {answer} – {statistics[questionIndex][answer]} ответов
              </div>
            ))}
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default GetResults;