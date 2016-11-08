'use strict';

import React from 'react';
import _ from 'lodash';

import Calendar from '../components/Calendar';

import {
} from '../styles';


const style = {
  root: {
    marginTop: 10,
    display: 'flex',
    justifyContent: 'center'
  },
};

class Overview extends React.Component {
  static propTypes = {
    lifetime: React.PropTypes.object,
  };

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps/*, nextState*/) {
    const should = !_.isEqual(this.props.lifetime, nextProps.lifetime);
    return should;
  }

  render() {
    return (
      <div style={style.root}>
        <Calendar rows={90} cols={51}
          showCell={(row, col) => this.props.lifetime[row * 52 + col] || 0}
          tag='overview' {...this.props}
          hash={this.props.lifetime.modified.toString()}
          />
      </div>
    );
  }
}

export default Overview;
