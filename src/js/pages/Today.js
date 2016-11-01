'use strict';

import React from 'react';
// import { browserHistory } from 'react-router';
// import { Link } from 'react-router';
import _ from 'lodash';
// import moment from 'moment';

import {
} from '../styles';

// import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import MoreVert from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
// import FloatingActionButton from 'material-ui/FloatingActionButton';
// import ContentAdd from 'material-ui/svg-icons/content/add';


const styles = {
  root: {
    paddingLeft: 100,
    paddingRight: 100,
  },
};

class TodayItem extends React.Component {
  static defaultStyles = {
    root: {
      height: 50,
      marginBottom: 5,
      marginTop: 5,
      position: 'relative'
    },
    checkbox: {
      width: '50%',
      padding: 12
    },
    menuButton: {
      position: 'absolute',
      top: 0,
      right: 0
    }
  };

  static propTypes = {
    style: React.PropTypes.object,
    habit: React.PropTypes.shape({
      routine: React.PropTypes.string,
      goal: React.PropTypes.string,
      days: React.PropTypes.array,
    }),
    onCheck: React.PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  handleCheck = (event, isInputChecked) => {
    if (isInputChecked) {
      this.props.onCheck(event, this.props.habit);
    }
  }

  render() {
    return (
      <Paper style={{ ...TodayItem.defaultStyles.root, ...this.props.style }}>
        <Checkbox
          onCheck={this.handleCheck}
          label={this.props.habit.routine}
          style={TodayItem.defaultStyles.checkbox} />
        <IconMenu
          iconButtonElement={<IconButton><MoreVert /></IconButton>}
          style={TodayItem.defaultStyles.menuButton}>
          <MenuItem primaryText="Go to Habit page" />
          <MenuItem primaryText="some menu item" />
        </IconMenu>
      </Paper>
      );
  }
}

export default class Today extends React.Component {
  static propTypes = {
    habits: React.PropTypes.arrayOf(React.PropTypes.shape({
      routine: React.PropTypes.string,
      goal: React.PropTypes.string,
      days: React.PropTypes.array,
    })),
    isActive: React.PropTypes.bool,
    onGoToHabit: React.PropTypes.func,
    onCheck: React.PropTypes.func,
  }

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
    this.setState({ isActive: false });
    // sign out from events
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { habits, isActive, ...childProps } = this.props;
    const habitItems = _.map(this.props.habits,
      (habit, index) => (
        <TodayItem key={index}
          habit={habit}
          {...childProps}
        />
        ));
    return (
      <div style={styles.root}>
        {habitItems}
      </div>
    );
  }
}
