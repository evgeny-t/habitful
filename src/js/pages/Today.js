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
// import FloatingActionButton from 'material-ui/FloatingActionButton';
// import ContentAdd from 'material-ui/svg-icons/content/add';

const HabitItem = (props) => {

};

export default class Today extends React.Component {
  static propTypes = {
    habits: React.PropTypes.arrayOf(React.PropTypes.shape({
      routine: React.PropTypes.string,
      goal: React.PropTypes.string,
      days: React.PropTypes.array,
    })),
    isActive: React.PropTypes.bool
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
    // sigh out from events
  }

  render() {
    const habitItems = _.map(this.props.habits,
      (habit, index) => (
        <Paper key={index}
          style={{ height: 50, marginBottom: 5, marginTop: 5 }}
        >{habit.routine}</Paper>
        ));
    return (
      <Paper style={{ padding: 15, margin: 5 }}>
        {habitItems}
      </Paper>
    );
  }
}
