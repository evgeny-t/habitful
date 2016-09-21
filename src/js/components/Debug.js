'use strict';

import React from 'react';

export default class Debug extends React.Component {
  static propTypes = {
    params: React.PropTypes.shape({
      component: React.PropTypes.string,
    }),
  }

  state = {}
  
  render() {
    const Component = require(`./${this.props.params.component}`).default;
    return (
      <div>
        {<Component {...this.props} />}
      </div>
    );
  }
}
