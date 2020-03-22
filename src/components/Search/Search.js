import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import companyList from '../../modules/comanyList.js';
import createTooltip from '../../modules/createTooltip.js';
import { AutoComplete, Button } from 'antd';

const base = 'https://cloud.iexapis.com/stable/stock';
const token = '/chart/1m?token=pk_0b61d9bd2072480cb885c51c1a47f59d';
const generateUrl = (code) => `${base}/${code}${token}`;

const parseData = (stocks) => (
  stocks.map((stock) => (
    [stock.date, stock.low, stock.close, stock.open, stock.high, createTooltip(stock)]
  ))
);

const propTypes = {
//   search: PropTypes.string,
//   setSearch,
//   onSearch,
//   onSelect,
//   setHistory,
//   setStockName,
//   setError,
};
const defaultProps = {};

const Search = ({
  setHistory,
  setStockName,
  setError,
}) => {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState('');

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
    setLoading(true);
    setHistory([]);
    try {
      const resp = await axios.get(generateUrl(search));
      setHistory(parseData(resp.data));
      const name = companyList.find(company => company.lowerSymbol === search).name;
      setStockName(name);
    }
    catch(err) {
      setError(`Invalid Symbol - ${search.toUpperCase()}`);
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <AutoComplete
        onSearch={onSearch}
        value={search}
        style={{ width: '300px' }}
        onSelect={onSelect}
        placeholder="Search by stock symbol or company name"
      >
        {options.map(option => (
          <AutoComplete.Option key={option.lowerSymbol} value={option.lowerSymbol}>
            {`${option.symbol} - ${option.name}`}
          </AutoComplete.Option>
        ))}
      </AutoComplete>
      <Button
        onClick={checkStock}
        loading={loading}
      >
        Check Stock
      </Button>
    </div>
  )
};

Search.propTypes = propTypes;
Search.defaultProps = defaultProps;

Search.fragments = {};

export default Search;
