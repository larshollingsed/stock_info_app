const chartOptions = {
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
};

export default chartOptions;
