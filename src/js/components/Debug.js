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
    const module = require(`./${this.props.params.component}`);
    const Component = module.default;
    return (
      <div>
        {<Component {...this.props} {...module.dummy} />}
      </div>
    );
  }
}
