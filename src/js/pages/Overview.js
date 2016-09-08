'use strict';

import React from 'react';
// import { Link } from 'react-router';
// import _ from 'lodash';
// import moment from 'moment';

import Radium from 'radium';

import {  
} from '../styles';

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
    const rectStyle = {
      width: 10,
      height: 10,
      ':hover': {
        stroke: '#555',
        strokeWidth: 1,
        shapeRendering: 'crispedges',
      }
    };
    return (
      <div>
        <p>Overview</p>
        <svg width={100} height={100} viewBox={"0 0 100 100"}>
          <rect key={1} style={rectStyle} y="0" x="0" fill="#d8d8d8" />
          <rect key={2} style={rectStyle} y="12" x="0" fill="#d8d8d8" />
          <rect key={3} style={rectStyle} y="24" x="0" fill="#d8d8d8" />
          <rect key={4} style={rectStyle} y="36" x="0" fill="#d8d8d8" />
          <rect key={5} style={rectStyle} y="48" x="0" fill="#d8d8d8" />
          <rect key={6} style={rectStyle} y="60" x="0" fill="#d8d8d8" />
          <rect key={7} style={rectStyle} y="72" x="0" fill="#d8d8d8" />
        </svg>
      </div>
    );
  }
}

export default Radium(Overview);
