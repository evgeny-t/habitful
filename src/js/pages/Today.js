'use strict';

import React from 'react';
import _ from 'lodash';
import moment from 'moment';

// import { List, ListItem } from 'material-ui/List';
// import Checkbox from 'material-ui/Checkbox';
// import Divider from 'material-ui/Divider';
// import CircularProgress from 'material-ui/CircularProgress';
import { GridList, /*GridTile*/ } from 'material-ui/GridList';
// import Subheader from 'material-ui/Subheader';
// import IconButton from 'material-ui/IconButton';
// import StarBorder from 'material-ui/svg-icons/toggle/star-border';
// import Done from 'material-ui/svg-icons/action/done';


import {  
} from '../styles';

import HabitProgress from '../components/HabitProgress';

export default class Today extends React.Component {
  static propTypes = {
    habits: React.PropTypes.array,
    isActive: React.PropTypes.bool,
    today: React.PropTypes.object,
  }

  state = {}

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // sign up for events
    this.setState({  });
  }

  componentWillUnmount() {
    // sigh out from events
  }

  render() {
    let { today } = this.props;
    const tiles = _(this.props.habits)
      .map((habit, i) => (
        <HabitProgress key={i} habit={habit} today={today} />))
      .value();
    
    return (
      <GridList 
        cols={3}
        cellHeight={200}>
        {tiles}
      </GridList>
    );
  }
}
