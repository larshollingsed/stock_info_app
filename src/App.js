import React, { useEffect, useState } from 'react';
import axios from 'axios';
import companyList from './modules/comanyList.js';
import createTooltip from './modules/createTooltip.js';
import './App.css';
import 'antd/dist/antd.css'
import { Alert } from 'antd';
import Search from './components/Search';
import Chart from 'react-google-charts';

const base = 'https://cloud.iexapis.com/stable/stock';
const token = '/chart/1m?token=pk_0b61d9bd2072480cb885c51c1a47f59d';
const generateUrl = (code) => `${base}/${code}${token}`;

const App = () => {
  const [search, setSearch] = useState('');
  const [options, setOptions] = useState([]);
  const [history, setHistory] = useState([]);
  const [stockName, setStockName] = useState('');
  const [error, setError] = useState();

  useEffect(() => {
    let matches = [];
    if (search.length) {
      matches = companyList.filter(
        company => company.lowerName.includes(search) ||
        company.lowerSymbol.includes(search)
      );
    }

    setOptions(matches);
  }, [search])

  const onSearch = (value) => {
    const searchInput = value.toLowerCase();
    setSearch(searchInput);
  };

  const onSelect = value => setSearch(value);

  const checkStock = async () => {
    setError(undefined);
    setHistory([]);
    try {
      const resp = await axios.get(generateUrl(search));
      setHistory(parseData(resp.data));
      const name = companyList.find(company => company.lowerSymbol === search).name;
      setStockName(name);
    }
    catch(err) {
      setError('Invalid Symbol');
    }
  }

  const parseData = (stocks) => (
    stocks.map((stock) => (
      [stock.date, stock.low, stock.close, stock.open, stock.high, createTooltip(stock)]
    ))
  );

  return (
    <div className='App container'>
      <Search
        search={search}
        onSearch={onSearch}
        onSelect={onSelect}
        options={options}
        checkStock={checkStock}
      />
      {error && <Alert message="This stock symbol does not exist" type="error" />}
      {!!history.length && <Chart
        width={'100%'}
        height={350}
        chartType='CandlestickChart'
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
        options={{
          legend: 'none',
          candlestick: {
            fallingColor: { strokeWidth: 0, fill: '#a52714' },
            risingColor: { strokeWidth: 0, fill: '#0f9d58' },
          },
          hAxis: {
            title: 'Date',
            titleTextStyle: {
              bold: true,
              italic: false,
            },
          },
          title: stockName,
          titleTextStyle: {
            bold: true,
            fontSize: 24,
          },
          tooltip: {
            isHtml: true,
          },
          vAxis: {
            title: 'Price',
            titleTextStyle: {
              bold: true,
              italic: false,
            },
          },
        }}
        rootProps={{ 'data-testid': '1' }}
      />}
    </div>
  );
}

export default App;
