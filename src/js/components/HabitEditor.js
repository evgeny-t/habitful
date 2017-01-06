import React, { Component } from 'react';
import _ from 'lodash';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import DaysOfWeek from './DaysOfWeek';

export default class HabitEditor extends Component {
  static propTypes ={
    habit: React.PropTypes.object,
    onSubmitHabit: React.PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.state = {
      ...props,
    };
  }

  handleCancel = () => {
    this.setState({ open: false });
  }

  handleSubmit = () => {
    this.props.onSubmitHabit(this.state.habit);
    this.setState({ open: false });
  }

  handleDateChange = (event, date) => {
    this.setState({ date });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ ...nextProps });
  }

  render() {
    const actions = [
      <FlatButton
        label="cancel"
        primary={true}
        onTouchTap={this.handleCancel}
      />,
      <FlatButton
        label="edit"
        primary={true}
        onTouchTap={this.handleSubmit}
      />,
    ];

    return (
      <Dialog
        title="Edit Habit"
        actions={actions}
        modal={true}
        open={this.state.open}
      >
        { this.state.habit && <TextField
          name='goal'
          value={this.state.habit.goal}
          onChange={e =>
            this.setState({
              habit: _.set(_.clone(this.state.habit), 'goal', e.target.value)
            })
          }
        />}
        <br></br>

        {this.state.habit && <TextField
          name='routine'
          value={this.state.habit.routine}
          onChange={e =>
            this.setState({
              habit: _.set(_.clone(this.state.habit), 'routine', e.target.value)
            })
          }
        />}
        <br></br>

        <br></br>
        { this.state.habit && <DaysOfWeek
          defaultChecked={this.state.habit.days}
          onCheck={(e, index, checked) => {
            const nextChecked = _.set(
              _.clone(this.state.habit.days), index, checked);
            this.setState({
              habit: _.set(_.clone(this.state.habit),
                'days', nextChecked)
            });
          }}
        />}
        <br></br>

      </Dialog>
    );
  }
}

