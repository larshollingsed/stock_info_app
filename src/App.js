import React, { useState } from 'react';
import 'antd/dist/antd.css'
import Chart from 'react-google-charts';
import { Alert } from 'antd';
import Search from './components/Search';
import chartOptions from './modules/chartOptions.js';
import './App.scss';

const App = () => {
  const [history, setHistory] = useState([]);
  const [stockName, setStockName] = useState('');
  const [error, setError] = useState();

  return (
    <div className='App container'>
      <Search
        setHistory={setHistory}
        setStockName={setStockName}
        setError={setError}
      />
      {error && <Alert message={error} type="error" className="error" />}
      {!!history.length && <Chart
        width="100%"
        height={350}
        chartType="CandlestickChart"
        loader={<div>Loading Chart</div>}
        data={[
          [
            { type: 'string', id: 'Date' },
            { type: 'number', label: 'Low' },
            { type: 'number', label: 'Close' },
            { type: 'number', label: 'Open' },
            { type: 'number', label: 'High'  },
            { type: 'string', label: 'Tooltip', role: 'tooltip', p: { html: true } },
          ],
          ...history,
        ]}
        options={{ ...chartOptions, title: stockName }}
        rootProps={{ 'data-testid': '1' }}
      />}
    </div>
  );
}

export default App;
