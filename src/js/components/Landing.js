'use strict';

import React from 'react';

import * as colors from 'material-ui/styles/colors';

const logo = require('../../assets/logo.png');

const styles = {
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
};

export default class Layout extends React.Component {
  static contextTypes = {
    muiTheme: React.PropTypes.object,
  }

  static propTypes = {
    style: React.PropTypes.object,
    signInButton: React.PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      drawer: false,
    };
  }

  render() {
    return (
      <div style={{...styles, ...this.props.style}}>
        <div style={{
          backgroundImage: `url(${logo})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          width: 180,
          height: 180,
          // marginTop: 30,
        }}>
        </div>
        <div style={{
          fontSize: 30,
          marginTop: 15,
          color: colors.blue900,
        }}>
          <h1>Habitful</h1>
        </div>

        <div style={{
          marginTop: 15,
          color: colors.blue900,
        }}>
          <h3>Become better, become habitful.</h3>
        </div>
        <div style={{
          marginTop: 15,
        }}>
          {this.props.signInButton}
        </div>
      </div>
    );
  }
}
