'use strict';

import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import moment from 'moment';

import {  
} from '../styles';

import { List, ListItem } from 'material-ui/List';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

const topics_addNew = {
  right: 0,
  bottom: 0,
  position: 'fixed',
  marginRight: 50,
  marginBottom: 50,
  zIndex: 1,
};

export default class A extends React.Component {
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
    return (
      <div>
        <List>
          <ListItem primaryText="Haya1" />
          <ListItem primaryText="Haya2" />
          <ListItem primaryText="Haya3" />
          <ListItem primaryText="Haya4" />
        </List>
        <FloatingActionButton 
          onClick={this.handleNewHabit}
          zDepth={2}
          style={topics_addNew}>
          <ContentAdd />
        </FloatingActionButton>
      </div>
    );
  }

  handleNewHabit = (event) => {
    console.log(event);
  }
}
