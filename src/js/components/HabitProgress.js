'use strict';

import React from 'react';
// import moment from 'moment';
import _ from 'lodash';

import MeasureIt from 'react-measure-it';

import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';
// import { GridTile } from 'material-ui/GridList';
// import IconButton from 'material-ui/IconButton';
// import Done from 'material-ui/svg-icons/action/done';
import TodayIcon from 'material-ui/svg-icons/action/today';
import IconButton from 'material-ui/IconButton';
import MoreVert from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import Calendar from './Calendar';

const style = {
  gridTile: {
    minHeight: 180,
    margin: 5,
  }
};

const HabitStatus = MeasureIt()((props) => {
  let value = 100 / 7 * props.habit.in;
  let progressColor;

  if (props.habit.in == 0) {
    progressColor = 'grey';
    value = 100;
  } else if (props.habit.in < 3) {
    progressColor = '#F44336';
  } else if (props.habit.in < 6) {
    progressColor = '#FF9800';
  } else {
    progressColor = '#4CAF50';
  }

  const outterDivStyle = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  };

  const divStyle = {
    width: 70,
    float: 'left',
    display: 'inline-block',
  };

  const nextTimeInStyle = {
    marginTop: 10,
    fontSize: 'x-small',
    textAlign: 'center',
  };

  const inStyle = {
    fontSize: 'x-small',
    textAlign: 'center',
    marginTop: 0,
  };

  const todayStyle = {
  };

  const todayIconStyle = {
    color: 'red',
    width: '100%',
    height: '100%',
    paddingTop: 20,
  };

  const calendarDivStyle = {
    float: 'right',
    marginRight: 10,
    display: 'inline-block',
  };

  const dayOfWeek = props.today.day();

  let startOfTheWeek = props.today.clone();
  startOfTheWeek.day(0);

  const dayOfWeekLabels = [
    undefined, 'Mon', undefined, 'Wed', undefined, 'Fri', undefined];

  const calendarWidth =
    props.containerWidth - divStyle.width - calendarDivStyle.marginRight;
  // day size + day padding - 4 cols
  const cols = Math.min(14, Math.trunc(calendarWidth / (10 + 3)) - 4);

  const columnFirstDay = index =>
    startOfTheWeek.clone().subtract(7 * (cols - index), 'days');

  const columnLabel = (index) => {
    const day = columnFirstDay(index);
    return index % 2 === 0 ? `${day.date()}` : undefined;
  };

  const remapped = _.reduce(props.habit.history, (prev, next) => {
    prev[next.when.format('YYYYMMDD')] =
      (prev[next.when.format('YYYYMMDD')] || 0) + 1;
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
        {props.habit.in != 0 && (<div style={nextTimeInStyle}>next time in</div>)}
        {props.habit.in != 0 &&
          <CircularProgress
            color={progressColor}
            mode="determinate" value={value} />
        }
        {props.habit.in != 0 && <div style={inStyle}>{`${props.habit.in} days`}</div>}
        {props.habit.in == 0 &&
          <div style={todayStyle}>
            <TodayIcon style={todayIconStyle} />
          </div>}
      </div>
      <div style={calendarDivStyle}>
        <Calendar
          hash={`${props.habit.history.length}`}
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
    </div>);
});

HabitStatus.propTypes = {
  today: React.PropTypes.object,
  habit: React.PropTypes.object,
};

/*export default*/ class HabitProgress extends React.Component {
  static propTypes = {
    today: React.PropTypes.object,
    habit: React.PropTypes.shape({
      in: React.PropTypes.number,
      routine: React.PropTypes.string,
      goal: React.PropTypes.string,
      days: React.PropTypes.array,
      history: React.PropTypes.array,
    }),
    style: React.PropTypes.object,
    className: React.PropTypes.string,
  }

  render() {
    const goalStyle = {
      margin: 10,
      overflow: 'hidden',
      fontSize: 'smaller',
    };

    const routineStyle = { ...goalStyle, fontSize: 'larger' };

    // /titleBackground={this.state.in === 0 ? '#00bcd4' : 'grey'}
    // title={this.props.habit.routine}
    return (
      <Paper className={this.props.className}
        style={Object.assign({}, style.gridTile, this.props.style)}
        >
        <div style={routineStyle}>
          <p>{this.props.habit.routine}</p>
        </div>
        <div style={goalStyle}>
          <p>{this.props.habit.goal}</p>
        </div>
        <IconMenu
          iconButtonElement={<IconButton><MoreVert /></IconButton>}
          style={{}}>
          <MenuItem primaryText="Go to habit page" />
          <MenuItem primaryText="Remove" />
        </IconMenu>
        <HabitStatus
          today={this.props.today}
          habit={this.props.habit}
        />
      </Paper>);
  }
}

export default HabitProgress;

// outdated

// export const dummy = {
//   habit: {
//     routine: 'routine routine',
//     goal: 'goal goal',
//     days: [true, true, true, true, true, true, true],
//   },
//   today: moment('20160921', 'YYYYMMDD'),
//   history: [
//     moment('20160921', 'YYYYMMDD'),
//   ],
// };


// // 09/04/2016 is Sunday

// const inOneDay = {
//   habit: {
//     routine: 'in one day routine',
//     goal: 'in one day goal',
//     days: [true, true, true, true, true, true, true],
//   },
//   today: moment('20160904', 'YYYYMMDD'),
//   history: [
//     moment('20160904', 'YYYYMMDD'),
//   ],
// };

// const inSixDays = {
//   habit: {
//     routine: 'in six days routine',
//     goal: 'in six days goal',
//     days: [true, false, false, false, false, false, true],
//   },
//   today: moment('20160904', 'YYYYMMDD'),
//   history: [
//     moment('20160904', 'YYYYMMDD'),
//   ],
// };

// const today = {
//   habit: {
//     routine: 'today routine',
//     goal: 'today goal',
//     days: [true, false, true, true, true, true, true],
//   },
//   today: moment('20160904', 'YYYYMMDD'),
//   history: [
//     moment('20160903', 'YYYYMMDD'),
//     moment('20160807', 'YYYYMMDD'),
//     moment('20160813', 'YYYYMMDD'),
//   ],
// };

// export const debug = () => (
//   <div>
//     <HabitProgress {...inOneDay} />
//     <HabitProgress {...inSixDays} />
//     <HabitProgress {...today} />
//   </div>
//   );

