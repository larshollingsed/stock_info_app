const tooltipStyle = '"width: 150px; padding: 10px"';

const dateStyle = '"font-weight: bold; margin-bottom: 5px; border-bottom: 1px solid black"';

const createTooltip = ({ date, high, low, open, close }) => (
  `<div style=${tooltipStyle}>
    <div style=${dateStyle}>
      ${date}
    </div>
    <div>
      Open - ${open.toFixed(2)}
    </div>
    <div>
      Close - ${close.toFixed(2)}
    </div>
    <div>
      Low - ${low.toFixed(2)}
    </div>
    <div>
      High - ${high.toFixed(2)}
    </div>
  </div>`
);

export default createTooltip;
