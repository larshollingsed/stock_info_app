import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import companyList from '../../modules/comanyList.js';
import createTooltip from '../../modules/createTooltip.js';
import { AutoComplete, Button } from 'antd';
import './styles.scss';

const base = 'https://cloud.iexapis.com/stable/stock';
// obviously, I would never put a key inside of a github repo but this
// is just for demo purposes
const token = '/chart/1m?token=pk_0b61d9bd2072480cb885c51c1a47f59d';
const generateUrl = (code) => `${base}/${code}${token}`;

const parseData = (stocks) => (
  stocks.map((stock) => (
    [stock.date, stock.low, stock.close, stock.open, stock.high, createTooltip(stock)]
  ))
);

const propTypes = {
  setHistory: PropTypes.func.isRequired,
  setStockName: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
};
const defaultProps = {};

const initialState = {
  options: [],
  loading: false,
  search: '',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'setOptions':
      return {
        ...state,
        options: action.options,
      }
    case 'setSearch':
      return {
        ...state,
        search: action.search,
      }
    case 'beforeCheckStock':
      return {
        ...state,
        loading: true,
        history: [],
        error: undefined,
      }
    case 'setNotLoading':
    return {
      ...state,
      loading: false,
    }
    default:
      return initialState;
    }
  };

const Search = ({
  setHistory,
  setStockName,
  setError,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { loading, search, options } = state;

  useEffect(() => {
    let matches = [];
    if (search.length) {
      matches = companyList.filter(
        company => company.lowerName.includes(search) ||
        company.lowerSymbol.includes(search)
      );
    }

    dispatch({ type: 'setOptions', options: matches });
  }, [search])

  const onSearch = (value) => {
    dispatch({ type: 'setSearch', search: value.toLowerCase() })
  };

  const onSelect = value => dispatch({ type: 'setSearch', search: value });

  const checkStock = async () => {
    dispatch({ type: 'beforeCheckStock' });

    try {
      const resp = await axios.get(generateUrl(search));
      const name = companyList.find(company => company.lowerSymbol === search).name;

      setHistory(parseData(resp.data));
      setStockName(name);
    }
    catch(err) {
      const message = err.response ? `${err.response.data} - ${search.toUpperCase()}` : 'An error has occurred';
      setError(message);
    }
    finally {
      dispatch({ type: 'setNotLoading' });
    }
  }

  return (
    <div className="searchContainer">
      <AutoComplete
        className="searchInput"
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
        className="searchButton"
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
