'use strict';

import React from 'react';
// import { Link } from 'react-router';
// import _ from 'lodash';
// import moment from 'moment';

import Radium, { Style } from 'radium';

import {  
} from '../styles';

const styles = {
  day: {
    width: 7,
    height: 7,
  },

  ['day:hover']: {
    stroke: '#555',
    strokeWidth: 1,
    shapeRendering: 'crispedges',
  }
};

const daysPadding = 2;
const MaxAge = 90;

class Overview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {
    // sign up for events
    this.setState({  });
  }

  componentWillUnmount() {
    // sigh out from events
  }

  render() {
    const rects = [];

    const stepX = (styles.day.width + daysPadding);
    const stepY = (styles.day.height + daysPadding);

    for (let age = 0; age <= MaxAge; ++age) {
      for (let week = 0; week <= 52; ++week) {
        rects.push((
          <rect key={`${age}_${week}`} className="overview_calendar_day"
            y={age * stepY + stepY} 
            x={week * stepX + stepX * 1.5} 
            fill="#d8d8d8" />
        ));
      }
    }

    for (let age = 0; age <= MaxAge; age += 2) {
      rects.push((
        <text key={`age_${age}`} 
          style={{ fontSize: 9 }}
          textAnchor={'middle'}
          x={stepX / 2} y={age * stepY + stepY * 2 - 2}>
          {`${age}`}
        </text>
        ));
    }

    for (let week = 5; week <= 52; week += 5) {
      rects.push((
        <text key={`week_${week}`} 
          style={{ fontSize: 9 }}
          x={(week - 0.5) * stepX + stepX * 1.5} y={stepY / 2}
          textAnchor={'middle'}
          >{`${week}`}</text>
        ));
    }

    return (
      <div>
        <Style
          scopeSelector=".overview_calendar_day"
          rules={styles.day}
        />
        <Style
          scopeSelector=".overview_calendar_day:hover"
          rules={styles['day:hover']}
        />

        <p>Overview</p>
        <svg width={54 * stepX} height={(MaxAge + 2) * stepY} 
          style={{ 
            marginRight: 'auto',
            marginLeft: 'auto',
            display: 'block' 
          }}
          viewBox={`0 -1 ${53 * stepX} ${(MaxAge + 2) * stepY}`}>
          {rects}
        </svg>
      </div>
    );
  }
}

export default Radium(Overview);
