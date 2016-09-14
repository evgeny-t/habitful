'use strict';

import React from 'react';
import _ from 'lodash';

import { List, ListItem } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import Divider from 'material-ui/Divider';

import {  
} from '../styles';

export default class Today extends React.Component {
  static propTypes = {
    today: React.PropTypes.array,
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
    const itemToReact = item => (
      <ListItem primaryText={item.text} key={item.text} 
        leftCheckbox={<Checkbox defaultChecked={item.done} />} 
      />);
    const today = _(this.props.today);
    const todo = today.filter(['done', false]).map(itemToReact).value();
    const done = today.filter('done').map(itemToReact).value();
    
    return (
      <div>
        <h3>TODO</h3>
        <Divider />

        <List>
          {todo}
        </List>

        <h3>DONE</h3>
        <Divider />

        <List>
          {done}
        </List>        
      </div>
    );
  }
}
