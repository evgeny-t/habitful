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
import Delete from 'material-ui/svg-icons/action/delete';
import MoreVert from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import Popover from 'material-ui/Popover';

import Chip from './Chip';
import TagsEditor from './TagsEditor';

import Calendar from './Calendar';

const style = {
  gridTile: {
    // minHeight: 180,
    minWidth: 200,
    margin: 5,
    position: 'relative',
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
    marginBottom: 5,
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
  if (cols < 0) {
    throw new Error('Number of column should not be negative');
  }

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
    <div style={outterDivStyle}>
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

class HabitProgress extends React.Component {
  static propTypes = {
    allTags: React.PropTypes.array,
    today: React.PropTypes.object,
    habit: React.PropTypes.shape({
      _id: React.PropTypes.string,
      in: React.PropTypes.number,
      routine: React.PropTypes.string,
      goal: React.PropTypes.string,
      days: React.PropTypes.array,
      history: React.PropTypes.array,
      tags: React.PropTypes.array,
    }),
    style: React.PropTypes.object,
    className: React.PropTypes.string,

    onHabitRemove: React.PropTypes.func,
    onTagClick: React.PropTypes.func,
  }

  state = {
    removeDialogOpen: false,
    tagEditorOpen: false,
    tagEditorAnchor: null,
  }

  handleRemove = (/*event*/) => {
    this.props.onHabitRemove(this.props.habit._id);
    this.setState({ removeDialogOpen: false });
  }

  handleRemoveItemTap = () => {
    this.setState({ removeDialogOpen: true });
  }

  handleCancel = () => {
    this.setState({ removeDialogOpen: false });
  }

  handleEditHabit = () => {
    this.props.onEditHabit(this.props.habit);
  }

  renderTagsEditorPopover() {
    return (<Popover
      open={this.state.tagEditorOpen}
      anchorEl={this.state.tagEditorAnchor}
      anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
      targetOrigin={{horizontal: 'left', vertical: 'top'}}
      onRequestClose={() => this.setState({ tagEditorOpen: false })}
    >
      <TagsEditor
        allTags={this.props.allTags}
        tags={this.props.habit.tags} />
    </Popover>);
  }

  render() {
    const goalStyle = {
      margin: 10,
      overflow: 'hidden',
      fontSize: 'smaller',
    };

    const routineStyle = { ...goalStyle, fontSize: 'larger' };

    const menuButtonStyle = {
      position: 'absolute',
      top: 0,
      right: 0,
    };

    const tagContainerStyle = {
      display: 'flex',
      flexWrap: 'wrap',
      marginBottom: 5,
    };

// TODO(ET): avoid creating a modal dialog for each HabitProgress, see F12 > React (5)
    return (
      <Paper className={this.props.className}
        style={{...style.gridTile, ...this.props.style}}
        >

        <div style={routineStyle}>
          <p>{this.props.habit.routine}</p>
        </div>
        <div style={goalStyle}>
          <p>{this.props.habit.goal}</p>
        </div>
        <IconMenu
          iconButtonElement={<IconButton><MoreVert /></IconButton>}
          style={menuButtonStyle}>
          <MenuItem
            primaryText="Edit habit"
            onTouchTap={this.handleEditHabit}
          />
          {/*<MenuItem primaryText="Add label"
            onClick={(e) => this.setState({
              tagEditorOpen: true,
              tagEditorAnchor: e.currentTarget,
            })}
            />*/}
          <Divider />
          <MenuItem primaryText="Remove"
            rightIcon={<Delete />}
            onTouchTap={this.handleRemoveItemTap}
            />
        </IconMenu>
        <HabitStatus
          today={this.props.today}
          habit={this.props.habit}
        />
        <div style={tagContainerStyle}>
        {this.props.habit.tags && this.props.habit.tags.map(t =>
          (<Chip key={t} text={t}
            onClick={() => this.props.onTagClick(t)} />))}
        </div>
        <Dialog
          title={`Remove ${this.props.habit.routine}`}
          modal={true}
          open={this.state.removeDialogOpen}
          actions={[
            <FlatButton label="Cancel" primary={true}
              onTouchTap={this.handleCancel} />,
            <FlatButton label="Remove" primary={true}
              onTouchTap={this.handleRemove} />,]}>
          Habit {this.props.habit.routine} will be removed.
        </Dialog>
      </Paper>);
  }
}

export default HabitProgress;

