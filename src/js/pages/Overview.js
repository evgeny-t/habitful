'use strict';

import React from 'react';

import Calendar from '../components/Calendar';

import {  
} from '../styles';


class Overview extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(/*nextProps, nextState*/) {
    return false;
  }

  render() {
    return (
      <div>
        <p>Overview</p>
        <Calendar tag='overview' />
      </div>
    );
  }
}

export default Overview;
