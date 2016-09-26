'use strict';

import React from 'react';
import moment from 'moment';
import _ from 'lodash';

import MeasureIt from 'react-measure-it';

import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';
// import { GridTile } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Done from 'material-ui/svg-icons/action/done';

import Calendar from './Calendar';

const style = {
  gridTile: {
    minHeight: 180,
    // maxWidth: 300,
    // minWidth: 300,
    margin: 5,
  }
};

const HabitStatus = MeasureIt()((props) => {
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

  const outterDivStyle = {
    // position: 'absolute',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  };

  const divStyle = { 
    // position: 'absolute',
    // top: 0,
    // bottom: 48,
    width: 70,
    // float: 'left',
    display: 'inline-block',
  };

  const nextTimeInStyle = { 
    marginTop: 10,
    fontSize: 13,
    textAlign: 'center',
  };

  const inStyle = { 
    fontSize: 13,
    textAlign: 'center',
    marginTop: 0,
  };

  const todayStyle = { 
    fontSize: 20,
    textAlign: 'center',
    marginTop: 50,
  };

  const calendarDivStyle = {
    // float: 'right',
    // position: 'absolute',
    display: 'inline-block',
    // top: 0,
    // right: 0,
    // left: 72,
    // bottom: 48,
  };

  const dayOfWeek = props.today.day();
  
  // console.log(props.today);
  let startOfTheWeek = props.today.clone();
  startOfTheWeek.day(0);
  // console.log(dayOfWeek, startOfTheWeek);

  const dayOfWeekLabels = [ 
    undefined, 'Mon', undefined, 'Wed', undefined, 'Fri', undefined];

  const calendarWidth = props.containerWidth - divStyle.width;
  // size + padding
  const cols = Math.min(14, Math.trunc(calendarWidth / (10 + 3)) - 3); 

  const columnFirstDay = index => 
    startOfTheWeek.clone().subtract(7 * (cols - index), 'days');

  const columnLabel = (index) => {
    const day = columnFirstDay(index);
    return index % 2 === 0 ? `${day.date()}` : undefined;
  };

  const remapped = _.reduce(props.history, (prev, next) => {
    prev[next.format('YYYYMMDD')] = (prev[next.format('YYYYMMDD')] || 0) + 1;
    return prev;
  }, {});

  const showCell = (row, col) => {
    if (col === cols && row > dayOfWeek) {
      return undefined;
    }

    const day = columnFirstDay(col).add(row, 'days');
    return remapped[day.format('YYYYMMDD')] ? 5 : 0;
  };

  return (
    <div id='habitprogress__outter' style={outterDivStyle}>
      <div style={divStyle}>
        {props.in != 0 && (<div style={nextTimeInStyle}>next time in</div>)}
        {props.in != 0 && 
          <CircularProgress
            color={progressColor}
            mode="determinate" value={value} />
        }
        {props.in != 0 && <div style={inStyle}>{`${props.in} days`}</div>}
        {props.in == 0 && <div style={todayStyle}>TODAY</div>}
      </div>
      <div style={calendarDivStyle}>
        <Calendar
          hash={`${props.history.length}`}
          today={props.today}
          viewBoxX={-9}
          tag='progress'
          rows={6}
          cols={cols}
          daySize={10}
          dayPadding={3}
          rowLabel={(index) => dayOfWeekLabels[index]}
          colLabel={columnLabel}
          showCell={showCell}
          />
      </div>
      <div>
        <p>{props.habit.routine}</p>
        {!props.in ?
        (<IconButton onClick={props.handleRoutineDoneClick}>
            <Done color="black" />
          </IconButton>) : null}
      </div>
    </div>);
});

HabitStatus.propTypes = {
  in: React.PropTypes.number,
  today: React.PropTypes.object,
  history: React.PropTypes.array,
};

/*export default*/ class HabitProgress extends React.Component {
  static propTypes = {
    today: React.PropTypes.object,
    history: React.PropTypes.array,
    habit: React.PropTypes.shape({
      routine: React.PropTypes.string,
      goal: React.PropTypes.string,
      days: React.PropTypes.array,
    }),
    onMarkRoutineDone: React.PropTypes.func,
    style: React.PropTypes.object,
    className: React.PropTypes.string,
  }

  state = {
    in: null
  }
  
  _update(props) {
    const { today, history, habit } = props;
    const lastTime = _.last(history);

    history.sort();
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

  componentWillMount() {
    this._update(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this._update(nextProps);
  }

  handleRoutineDoneClick = event => {
    this.props.onMarkRoutineDone(event, this.props.habit);
  }

  render() {
    // /titleBackground={this.state.in === 0 ? '#00bcd4' : 'grey'}
    // title={this.props.habit.routine}
    return (
      <Paper className={this.props.className} 
        style={Object.assign({}, style.gridTile, this.props.style)}
        >
        <HabitStatus 
          handleRoutineDoneClick={this.handleRoutineDoneClick} 
          {...this.props} {...this.state} 
        />
      </Paper>);
  }
}

export default HabitProgress;

export const dummy = {
  habit: {
    routine: 'routine routine',
    goal: 'goal goal',
    days: [true, true, true, true, true, true, true],
  },
  today: moment('20160921', 'YYYYMMDD'),
  history: [
    moment('20160921', 'YYYYMMDD'),
  ],
};


// 09/04/2016 is Sunday

const inOneDay = {
  habit: {
    routine: 'in one day routine',
    goal: 'in one day goal',
    days: [true, true, true, true, true, true, true],
  },
  today: moment('20160904', 'YYYYMMDD'),
  history: [
    moment('20160904', 'YYYYMMDD'),
  ],
};

const inSixDays = {
  habit: {
    routine: 'in six days routine',
    goal: 'in six days goal',
    days: [true, false, false, false, false, false, true],
  },
  today: moment('20160904', 'YYYYMMDD'),
  history: [
    moment('20160904', 'YYYYMMDD'),
  ],
};

const today = {
  habit: {
    routine: 'today routine',
    goal: 'today goal',
    days: [true, false, true, true, true, true, true],
  },
  today: moment('20160904', 'YYYYMMDD'),
  history: [
    moment('20160903', 'YYYYMMDD'),
    moment('20160807', 'YYYYMMDD'),
    moment('20160813', 'YYYYMMDD'),
  ],
};

export const debug = () => (
  <div>
    <HabitProgress {...inOneDay} />
    <HabitProgress {...inSixDays} />
    <HabitProgress {...today} />
  </div>
  );

