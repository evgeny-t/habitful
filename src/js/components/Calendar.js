'use strict';

import React from 'react';
// import _ from 'lodash';
// import moment from 'moment';

import Radium, { Style } from 'radium';

import {  
} from '../styles';

function getStyles(props) {
  return {
    day: {
      width: props.daySize,
      height: props.daySize,
    },

    ['day:hover']: {
      stroke: '#555',
      strokeWidth: 1,
      shapeRendering: 'crispedges',
    }
  };
}

class Calendar extends React.Component {
  static propTypes = {
    dayPadding: React.PropTypes.number,
    daySize: React.PropTypes.number,
    rows: React.PropTypes.number,
    cols: React.PropTypes.number,
    rowLabel: React.PropTypes.func,
    colLabel: React.PropTypes.func,
    showCell: React.PropTypes.func,
    tag: React.PropTypes.string,
    viewBoxX: React.PropTypes.number,
    viewBoxY: React.PropTypes.number,
  };

  static defaultProps = {
    dayPadding: 2,
    daySize: 7,
    rows: 90,
    cols: 51,
    rowLabel: (index) => index % 2 === 0 ? `${index}` : undefined,
    colLabel: (index) => 
      (index == 0 || (index + 1) % 5 === 0) ? `${index + 1}` : undefined,
    showCell: (row, col) => true || col,
    tag: '',
    viewBoxX: 0,
    viewBoxY: 0,
  };

  state = {}

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(/*nextProps, nextState*/) {
    return false;
  }

  render() {
    const styles = getStyles(this.props);
    const { 
      rows, cols, rowLabel, colLabel,
      viewBoxX, viewBoxY,
    } = this.props;
    const rects = [];

    const stepX = (styles.day.width + this.props.dayPadding);
    const stepY = (styles.day.height + this.props.dayPadding);

    for (let row = 0; row <= rows; ++row) {
      for (let col = 0; col <= cols; ++col) {
        if (this.props.showCell(row, col)) {
          rects.push((
            <rect key={`${row}_${col}`} className={`calendar-${this.props.tag}`}
              x={col * stepX + stepX * 1.5} 
              y={row * stepY + stepY} 
              fill='#eeeeee' />
          ));
        }
      }
    }

    for (let row = 0; row <= rows; row++) {
      const label = rowLabel(row);
      if (label) {
        rects.push((
          <text key={`row_${row}`} 
            style={{ fontSize: 9 }}
            textAnchor={'middle'}
            x={stepX / 2} 
            y={row * stepY + stepY + styles.day.height}>
            {`${label}`}
          </text>
          ));
      }
    }

    for (let col = 0; col <= cols; col++) {
      const label = colLabel(col);
      if (label) {
        rects.push((
          <text key={`col_${col}`} 
            style={{ fontSize: 9 }}
            x={stepX * 1.5 + styles.day.width / 2 + col * stepX} 
            y={stepY - 2}
            textAnchor={'middle'}>
            {`${label}`}
          </text>
          ));
      }
    }

    return (
      <div>
        <Style
          scopeSelector={`.calendar-${this.props.tag}`}
          rules={styles.day}
        />
        <Style
          scopeSelector={`.calendar-${this.props.tag}:hover`}
          rules={styles['day:hover']}
        />

        <svg width={(cols + 3) * stepX} height={(rows + 2) * stepY} 
          style={{ 
            // border: '1px solid black',
            // marginRight: 'auto',
            // marginLeft: 'auto',
            display: 'block' 
          }}
          viewBox={`${viewBoxX} ${viewBoxY} ${(cols + 3) * stepX} ${(rows + 2) * stepY}`}>
          {rects}
        </svg>
      </div>
    );
  }
}

export default Radium(Calendar);
