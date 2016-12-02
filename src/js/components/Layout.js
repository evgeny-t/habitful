'use strict';

import React from 'react';

import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import { List, ListItem } from 'material-ui/List';

import Footer from './Footer';

const styles = {
  height: '100%',

  appBar: {
    position: 'fixed',
    top: 0,
    left: 0,

    avatar: {
      display: 'flex',

      menuLink: {
        alignSelf: 'center',
        paddingRight: 10,
      },

      iconButton: {
        padding: 0,
      },
    },

    signInButton: {
      marginTop: 5,
      marginRight: 5,
    },
  },

  container: state => {
    return {
      display: 'flex',
      marginTop: 64,
      marginLeft: state.drawer ? 200 : 0,
      width: `calc(100% - ${state.drawer ? 200 : 0}px)`,
    };
  },

  drawer: {
    containerStyle: (state, context) => {
      return {
        zIndex: context.muiTheme.zIndex.appBar - 100
      };
    },

    list: {
      marginTop: 64,
    },
  }

};

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
    const signInButton = (
      <RaisedButton
        onClick={this.props.onSignInClick}
        label='Sign in'
        secondary={true}
        style={styles.appBar.signInButton}
      />
    );

// TODO(ET): correct sign-out
    const avatar = (
      <div style={styles.appBar.avatar}>
        <a href='#'
          style={styles.appBar.avatar.menuLink}>
            {this.props.user ? this.props.user.givenName : ''}
        </a>
        <IconMenu
          iconButtonElement={
            <IconButton style={styles.appBar.avatar.iconButton}>
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
      <div style={styles}>
        <AppBar
          style={styles.appBar}
          title={this.state.title}
          iconElementRight={this.props.user ? avatar : signInButton}
          onLeftIconButtonTouchTap={this.handleBurgerClick}
          />

        <div style={styles.container(this.state)}>
          {this.props.children}
        </div>

        <Footer />
        <Drawer
          width={200}
          containerStyle={styles.drawer.containerStyle(this.state, this.context)}
          onRequestChange={open => this.setState({ drawer:open })}
          open={this.state.drawer}>
          <List style={styles.drawer.list}>
            <ListItem primaryText="My Habits"
              onClick={this.props.onNavigate.bind(null, '/myhabits')} />
            <ListItem primaryText="Today"
              onClick={this.props.onNavigate.bind(null, '/today')}/>
            <ListItem primaryText="Overview"
              onClick={this.props.onNavigate.bind(null, '/overview')} />
          </List>
        </Drawer>
      </div>
    );
  }
}
