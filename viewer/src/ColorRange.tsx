import React from 'react';

export const ColorRange: React.FC<{ colorFunction: (f: any) => number[], colorDomain: [number, number], property: string }> = ({ colorFunction, colorDomain, property }) => {
  const rangeIncrement = (colorDomain[1] - colorDomain[0]) / 9;
  const range = [colorDomain[0], ...(Array.from({ length: 9 }, (_, i) => colorDomain[0] + i * rangeIncrement))];
  return (

    <div style={{
      display: 'flex',
      flexDirection: 'row',
      fontSize: '.75rem'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        {range.map((r, i) => (
          <div key={i} style={{
            width: '10px',
            height: '10px',
            background: `rgb(${colorFunction({ properties: { [property]: r } }).join(',')})`
          }}></div>
        ))}
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        {range.map((r, i) => (
          (i === 0 || i % 2 === 0) ? <p key={i} style={{ margin: '0 .5em' }}>{formatNumber(r)}</p> : null
        ))
        }
      </div>
    </div>
  )

}
function formatNumber(number: number): string {
  const val = +number;
  if (isNaN(val)) return `${number}`;
  return new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 4,
    maximumSignificantDigits: 2,
    compactDisplay: "short"
  }).format(val);
}