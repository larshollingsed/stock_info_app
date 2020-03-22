import React from 'react';
import PropTypes from 'prop-types';
import { AutoComplete } from 'antd';

const propTypes = {};
const defaultProps = {};

const Search = ({
  search,
  onSearch,
  onSelect,
  options,
  checkStock,
}) => {
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
      <button onClick={checkStock}>Check Stock</button>
    </div>
  )
};

Search.propTypes = propTypes;
Search.defaultProps = defaultProps;

Search.fragments = {};

export default Search;
