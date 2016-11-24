'use strict';

import React from 'react';

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
// import FontIcon from 'material-ui/FontIcon';
import { List, ListItem } from 'material-ui/List';

import Footer from './Footer';


export default class Layout extends React.Component {
  static contextTypes = {
    muiTheme: React.PropTypes.object,
  }

  static propTypes = {
    children: React.PropTypes.any,
    onSignInClick: React.PropTypes.func,
    onNavigate: React.PropTypes.func,
    user: React.PropTypes.object,
  }

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

// TODO(ET): trigger sign in action (2)
    const signInButton = (
      <RaisedButton
        onClick={this.props.onSignInClick}
        label='Sign in'
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
      <div style={{
        display: 'flex',
      }}>
        <a href='#'
          style={{
            alignSelf: 'center',
            paddingRight: 10,
          }}>{this.props.user ? this.props.user.givenName : ''}</a>
        <IconMenu
          iconButtonElement={
            <IconButton style={{ padding: 0 }}>
              <Avatar src={this.props.user ? this.props.user.imageUrl : null} />
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
      </div>
    );

    return (
      <div style={{ height: '100%' }}>
        <AppBar
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
          }}
          title={this.state.title}
          iconElementRight={this.props.user ? avatar : signInButton}
          onLeftIconButtonTouchTap={this.handleBurgerClick}
          />

        <div style={{
          display: 'flex',
          marginTop: 64,
          marginLeft: this.state.drawer ? 200 : 0,
        }}>
          {this.props.children}
        </div>

        <Footer />
        <Drawer
          width={200}
          containerStyle={{ zIndex: this.context.muiTheme.zIndex.appBar - 100 }}
          onRequestChange={open => this.setState({drawer:open})}
          open={this.state.drawer}>
          <List style={{ marginTop: 64 }}>
            <ListItem primaryText="My Habits"
              onClick={this.props.onNavigate.bind(null, 'myhabits')} />
            <ListItem primaryText="Today"
              onClick={this.props.onNavigate.bind(null, 'today')}/>
            <ListItem primaryText="Overview"
              onClick={this.props.onNavigate.bind(null, 'overview')} />
          </List>
        </Drawer>
      </div>
    );
  }
}
