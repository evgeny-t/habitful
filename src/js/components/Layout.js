'use strict';

import React from 'react';
import { browserHistory } from 'react-router';

// import _ from 'lodash';
// import moment from 'moment';

import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
// import FontIcon from 'material-ui/FontIcon';
import Avatar from 'material-ui/Avatar';
// import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import {Tabs, Tab} from 'material-ui/Tabs';

import Footer from './Footer';

export default class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'My Habits',
      drawer: false,
    };
  }

  handleBurgerClick = () => {
    this.setState({ drawer: !this.state.drawer });
  }

  render() {
// TODO(ET): move style to styles
// TODO(ET): correct auth
    const signInButton = (
      <RaisedButton 
        label='Sign in' 
        href='/auth/google'
        secondary={true}
        style={{
          marginTop: 5,
          marginRight: 5
        }}
      />
    );

// TODO(ET): move style to styles
// TODO(ET): correct sign-out
    const avatar = (
      <IconMenu 
        iconButtonElement={
          <IconButton style={{ padding: 0 }}>
            <Avatar src={this.state.avatar} />
          </IconButton>
        }
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        desktop={true}
      >
        <MenuItem primaryText='Sign out' 
          onClick={() => { console.error('not implemented'); }} 
        />
      </IconMenu>
    );

    return (
      <div>
        <AppBar 
          title={this.state.title} 
          iconElementRight={this.state.avatar ? avatar : signInButton}
          onLeftIconButtonTouchTap={this.handleBurgerClick}
          />
        {this.props.children}
        <Footer />
        <Drawer 
          docked={false}
          onRequestChange={open => this.setState({drawer:open})}
          open={this.state.drawer}>
        </Drawer>
      </div>
    );
  }
}
