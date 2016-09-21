'use strict';

import React from 'react';
import _ from 'lodash';

import { List, ListItem } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import Divider from 'material-ui/Divider';
import CircularProgress from 'material-ui/CircularProgress';
import { GridList, GridTile } from 'material-ui/GridList';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import Done from 'material-ui/svg-icons/action/done';


import {  
} from '../styles';

const HabitStatus = (/*props*/) => (
  <div>
     <CircularProgress mode="determinate" value={66} />
  </div>);

export default class Today extends React.Component {
  static propTypes = {
    habits: React.PropTypes.array,
    isActive: React.PropTypes.bool
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
    const tiles = _(this.props.habits)
      .map((habit, i) => (
        <GridTile key={i} title={habit.routine}
          actionIcon={<IconButton><Done color="white" /></IconButton>}
          >
          <HabitStatus habit={habit} />
        </GridTile>))
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
