'use strict';

import React from 'react';
import moment from 'moment';
import _ from 'lodash';

import CircularProgress from 'material-ui/CircularProgress';
import { GridTile } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Done from 'material-ui/svg-icons/action/done';

const style = {
  gridTile: {
    minHeight: 180,
  }
};

const HabitStatus = (props) => (
  <div style={{ 
    position: 'absolute',
    top: 0,
    bottom: 48,
    // background: 'grey',
  }} >
     <CircularProgress mode="determinate" value={66} />
     <p>{`in ${props.in} days`}</p>
  </div>);

HabitStatus.propTypes = {
  in: React.PropTypes.number
};

export default class HabitProgress extends React.Component {
  static propTypes = {
    key: React.PropTypes.any,
    today: React.PropTypes.object,
    lastTime: React.PropTypes.object,
    habit: React.PropTypes.shape({
      routine: React.PropTypes.string,
      goal: React.PropTypes.string,
      days: React.PropTypes.array,
    }),
  }

  state = {
    in: null
  }
  
  componentWillMount() {
    const { today, lastTime, habit } = this.props;

    console.log(habit.days, _.some(habit.days));
    if (!_.some(habit.days)) {
      return;
    }

    let nextDoW = today.day() + 1;
    while (!habit.days[nextDoW] && nextDoW < habit.days.length) {
      nextDoW++;
    }

    if (nextDoW >= habit.days.length) {
      nextDoW = 0;
      while (!habit.days[nextDoW] && nextDoW < habit.days.length) {
        nextDoW++;
      }
    }

    if (nextDoW >= habit.days.length) {
      // next time will be never
    } else {
      let daySpan = nextDoW - today.day();
      if (today == lastTime && daySpan === 0) {
        daySpan = 7;
      }
      this.setState({ 
        in: daySpan >= 0 ? daySpan : (7 + daySpan) });
    }
  }

  render() {
    const { key } = this.props;
    return (
      <GridTile style={style.gridTile} key={key} 
        title={this.props.habit.routine}
        actionIcon={!this.state.in && 
          (<IconButton><Done color="white" /></IconButton>)}
        >
          {<HabitStatus {...this.state}
            habit={this.props.habit} />}
      </GridTile>);
  }
}

export const dummy = {
  habit: {
    routine: 'routine routine',
    goal: 'goal goal',
    days: [true, true, true, true, true, true, true],
  },
  today: moment('20160921', 'YYYYMMDD'),
  lastTime: moment('20160921', 'YYYYMMDD'),
};
