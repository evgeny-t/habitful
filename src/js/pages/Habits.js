'use strict';

import React from 'react';
import { browserHistory } from 'react-router';
import { Link } from 'react-router';
import _ from 'lodash';
import moment from 'moment';

import {  
} from '../styles';

import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

const topics_addNew = {
  right: 0,
  bottom: 0,
  position: 'fixed',
  marginRight: 50,
  marginBottom: 50,
  //zIndex: 1,
};

export default class Habits extends React.Component {
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
      habit => (<ListItem primaryText={habit.routine} key={habit.goal} />));
    return (
      <div>
        <List>
          {habitItems}
        </List>
        <FloatingActionButton 
          onClick={this.handleNewHabit}
          zDepth={2}
          style={this.props.isActive ? topics_addNew : null}>
          <ContentAdd />
        </FloatingActionButton>
      </div>
    );
  }

  handleNewHabit = (/*event*/) => {
    browserHistory.push('habits/new');
  }
}
