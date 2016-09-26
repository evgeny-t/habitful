'use strict';

import React from 'react';
import _ from 'lodash';
import Radium, { Style } from 'radium';

import { GridList, /*GridTile*/ } from 'material-ui/GridList';

import {  
} from '../styles';

import HabitProgress from '../components/HabitProgress';

@Radium
export default class Today extends React.Component {
  static propTypes = {
    history: React.PropTypes.array,
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

  componentWillReceiveProps(/*props*/) {
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    let { habits, isActive, history, ...other } = this.props;

    const remappedHistory = 
      _.reduce(this.props.history, (prev, next) => {
        prev[next.habit] = [...(prev[next.habit] || []), next.when];
        return prev;
      }, {});

    const tiles = _(this.props.habits)
      .map((habit, i) => {
        let history = remappedHistory[habit._id];
        history = history || [];
        history.sort();
        return (<HabitProgress key={i} habit={habit} 
          history={history} {...other} />);
      }).value();
    
    return (
      <div>
      {/*<Style
          scopeSelector={`.calendar-${this.props.tag}`}
          rules={styles.day}
        />*/}
      <GridList 
              style={{
                paddingTop: 30,
                paddingBottom: 30,
                paddingLeft: 75,
                paddingRight: 75,
                myStyle: 3,
              }}
              cols={3}
              cellHeight={200}>
              {tiles}
            </GridList></div>
    );
  }
}
