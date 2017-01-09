'use strict';

import _ from 'lodash';
import React from 'react';

import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';

import Folder from 'material-ui/svg-icons/file/folder';

import Footer from './Footer';
import Landing from './Landing';
import SetupDialog from './SetupDialog';

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
      height: '100%',
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
    onSignOutClick: React.PropTypes.func,
    onNavigate: React.PropTypes.func,
    user: React.PropTypes.object,
    title: React.PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      drawer: props.openDrawer,
    };
  }

  handleBurgerClick = () => {
    this.setState({ drawer: !this.state.drawer });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ drawer: nextProps.openDrawer });
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
            onClick={this.props.onSignOutClick}
          />
        </IconMenu>
      </div>
    );

    return (
      <div style={styles}>
        <AppBar
          style={_.cloneDeep(styles.appBar)}
          title={this.props.user ? this.props.title : 'Habitful'}
          iconElementRight={this.props.user ? avatar : signInButton}
          onLeftIconButtonTouchTap={this.handleBurgerClick}
          showMenuIconButton={!!this.props.user}
          />

        <div style={styles.container(this.state)}>
          {this.props.user ?
            this.props.children :
            (<Landing signInButton={signInButton} />)}
        </div>

        <Footer />
        <Drawer
          width={200}
          containerStyle={styles.drawer.containerStyle(this.state, this.context)}
          onRequestChange={open => this.setState({ drawer:open })}
          open={this.state.drawer}>
          <List style={styles.drawer.list}>
            <ListItem id="drawer__menu__my-habits" primaryText="My Habits"
              onClick={this.props.onNavigate.bind(null, '/myhabits')} />
            <ListItem id="drawer__menu__today" primaryText="Today"
              onClick={this.props.onNavigate.bind(null, '/today')} />
            <ListItem id="drawer__menu__overview" primaryText="Overview"
              onClick={this.props.onNavigate.bind(null, '/overview')} />
            <Divider />
            <ListItem id="drawer__menu__library" primaryText="Library"
              leftIcon={<Folder />}
              onClick={this.props.onNavigate.bind(null, '/library')} />
          </List>
        </Drawer>

        {this.props.showSetupDialog && (<SetupDialog {...this.props} />)}
      </div>
    );
  }
}
