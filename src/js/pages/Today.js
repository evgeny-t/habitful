'use strict';

import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import moment from 'moment';

import { List, ListItem } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';

import {  
} from '../styles';

export default class Today extends React.Component {
  static propTypes = {
    habits: React.PropTypes.array,
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
    // sigh out from events
  }

  render() {
    const habitItems = _.map(this.props.habits, 
      habit => (
        <ListItem primaryText={habit.text} key={habit.text} 
           leftCheckbox={<Checkbox />} 
        />
        ));
    return (
      <div>
        <List>
          {habitItems}
          <ListItem primaryText={'123habit.text'}
           leftCheckbox={<Checkbox />} 
        />
        <ListItem primaryText={'567habit.text'}
           leftCheckbox={<Checkbox />} 
        />
        </List>
      </div>
    );
  }
}
