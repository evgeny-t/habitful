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
    maxWidth: 300,
  }
};

const HabitStatus = (props) => {
  let value = 100 / 7 * props.in;
  let progressColor;

  if (props.in == 0) {
    progressColor = 'grey';
    value = 100;
  } else if (props.in < 3) {
    progressColor = '#F44336';
  } else if (props.in < 6) {
    progressColor = '#FF9800';
  } else {
    progressColor = '#4CAF50';
  }

  return (
    <div>
    <div style={{ 
          position: 'absolute',
          top: 0,
          bottom: 48,
          // background: 'grey',
        }} >
           <CircularProgress 
            color={progressColor}
            mode="determinate" value={value} />
           <p>{props.in ? `in ${props.in} days` : 'TODAY'}</p>
           
        </div>
        <div style={{
          background: '#EEEEEE',
          position: 'absolute',
          top: 0,
          right: 0,
          left: 72,
          bottom: 48,
        }}>
        123
        </div>
        </div>);
};

HabitStatus.propTypes = {
  in: React.PropTypes.number
};

export default class HabitProgress extends React.Component {
  static propTypes = {
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

    if (!_.some(habit.days)) {
      return;
    }

    let nextDoW = today.day() + (today.isSame(lastTime) ? 1 : 0);
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
    return (
      <GridTile style={style.gridTile} 
        title={this.props.habit.routine}
        titleBackground={this.state.in === 0 ? '#00bcd4' : 'grey'}
        actionIcon={!this.state.in ?
          (<IconButton><Done color="white" /></IconButton>) : null}
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


// 09/04/2016 is Sunday

const inOneDay = {
  habit: {
    routine: 'in one day routine',
    goal: 'in one day goal',
    days: [true, true, true, true, true, true, true],
  },
  today: moment('20160904', 'YYYYMMDD'),
  lastTime: moment('20160904', 'YYYYMMDD'),
};

const inSixDays = {
  habit: {
    routine: 'in six days routine',
    goal: 'in six days goal',
    days: [true, false, false, false, false, false, true],
  },
  today: moment('20160904', 'YYYYMMDD'),
  lastTime: moment('20160904', 'YYYYMMDD'),
};

const today = {
  habit: {
    routine: 'today routine',
    goal: 'today goal',
    days: [true, false, true, true, true, true, true],
  },
  today: moment('20160904', 'YYYYMMDD'),
  lastTime: moment('20160903', 'YYYYMMDD'),
};

export const debug = () => (
  <div>
    <HabitProgress {...inOneDay} />
    <HabitProgress {...inSixDays} />
    <HabitProgress {...today} />
  </div>
  );

