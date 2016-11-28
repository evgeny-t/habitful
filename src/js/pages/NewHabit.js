'use strict';

import React from 'react';
import _ from 'lodash';
import moment from 'moment';

import {
  Step,
  Stepper,
  StepButton,
  StepContent,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {
  Table, TableBody, TableHeader, TableHeaderColumn,
  TableRow, TableRowColumn } from 'material-ui/Table';
import DatePicker from 'material-ui/DatePicker';
import Checkbox from 'material-ui/Checkbox';

const styles = {
  stepActions: {
    margin: '12px 0',
    nextButton: {
      marginRight: 12,
    },
  },

  arrangement: {
    table: {
      width: 0,

      header: {
        borderBottomStyle: 'none',
        height: 10,

        row: {
          column: {
            width: 24,
            paddingRight: 2,
            paddingLeft: 2,
            textAlign: 'middle',
            height: 0
          }
        }
      },
      body: {
        height: 0,
      }
    }
  },

};

export default class NewHabit extends React.Component {
  static propTypes = {
    onDone: React.PropTypes.func,
    defaultStartDate: React.PropTypes.object,
  }

  state = {
    stepIndex: 0,
    goal: '',
    routine: '',
    startDate: null,
    checked_0: true,
    checked_1: true,
    checked_2: true,
    checked_3: true,
    checked_4: true,
    checked_5: true,
    checked_6: true,
    checked_7: true,
  }

  constructor(props) {
    super(props);
  }

  handlePrev = () => {
    this.setState({ stepIndex: this.state.stepIndex - 1 });
  }

  handleNext = () => {
    this.setState({ stepIndex: this.state.stepIndex + 1 });
  }

  validateGoal = () =>
    this.state.goal ? null : 'This field is required';
  handleGoalChanged = e =>
    this.setState({ goal: e.target.value });

  validateRoutine = () =>
    this.state.routine ? null : 'This field is required'

  handleRoutineChanged = e =>
    this.setState({ routine: e.target.value })

  handleDoneClick = () => {
    let newOne = {};
    newOne.goal = this.state.goal;
    newOne.routine = this.state.routine;
    newOne.days = _.range(7).map(i => this.state[`checked_${i}`]);
    newOne.history = [];
    newOne.startsFrom = this.state.startDate;

    this.props.onDone(newOne);
  }

  handleDateChange = (e, date) =>
    this.setState({ startDate: moment(date) });

  renderStepActions(step, nextProps) {
    return (
      <div style={styles.stepActions}>
        <RaisedButton
          label="Next"
          disableTouchRipple={true}
          disableFocusRipple={true}
          primary={true}
          onTouchTap={this.handleNext}
          style={styles.stepActions.nextButton}
          {...nextProps}
        />
        {step > 0 && (
          <FlatButton
            label="Back"
            disableTouchRipple={true}
            disableFocusRipple={true}
            onTouchTap={this.handlePrev}
          />
        )}
      </div>
    );
  }

  render() {
    const { column } = styles.arrangement.table.header.row;
    const checkbox = index => {
      return {
        defaultChecked: this.state[`checked_${index}`],
        onCheck: (e, checked) =>
          this.setState({ [`checked_${index}`]: checked }),
      };
    };

    return (
      <div>
        <Stepper activeStep={this.state.stepIndex}
          linear={false} orientation='vertical'>
          <Step>
            <StepButton>Goal</StepButton>
            <StepContent>
              <p>Think up a goal you want to achieve
                              or a quality you want to obtain:</p>
              <TextField hintText='Your Goal'
                errorText={this.validateGoal()}
                onChange={this.handleGoalChanged}
                defaultValue={this.state.goal} />
              {this.renderStepActions(0, { disabled: !this.state.goal })}
            </StepContent>
          </Step>
          <Step>
            <StepButton>Habit</StepButton>
            <StepContent>
              <p>Come up with a step that bring
                you a little bit closer to your goal:</p>
              <TextField hintText='Routine'
                errorText={this.validateRoutine()}
                onChange={this.handleRoutineChanged}
                defaultValue={this.state.routine}>
                </TextField>
              {this.renderStepActions(1, { disabled: !this.state.routine })}
            </StepContent>
          </Step>
          <Step>
            <StepButton>Arrangement</StepButton>
            <StepContent>
              <p>You would like to repeat the routine each:</p>
              <Table
                style={styles.arrangement.table}
                selectable={false}>
                <TableHeader
                  style={styles.arrangement.table.header}
                  displaySelectAll={false}
                  adjustForCheckbox={false}>
                  <TableRow style={styles.arrangement.table.header}>
                    <TableHeaderColumn style={column}>Mon</TableHeaderColumn>
                    <TableHeaderColumn style={column}>Tue</TableHeaderColumn>
                    <TableHeaderColumn style={column}>Wed</TableHeaderColumn>
                    <TableHeaderColumn style={column}>Thu</TableHeaderColumn>
                    <TableHeaderColumn style={column}>Fri</TableHeaderColumn>
                    <TableHeaderColumn style={column}>Sat</TableHeaderColumn>
                    <TableHeaderColumn style={column}>Sun</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody
                  style={styles.arrangement.table.body}
                  displayRowCheckbox={false}>
                  <TableRow style={styles.arrangement.table.body}>
                    {
                      _.range(7).map(i => (
                        <TableRowColumn key={i} style={column}>
                          <Checkbox {...checkbox(i)} />
                        </TableRowColumn>))
                    }
                  </TableRow>
                </TableBody>
              </Table>
              <p>starting from</p>
              <DatePicker
                defaultDate={this.props.defaultStartDate.toDate()}
                hintText='Start date' container='inline'
                onChange={this.handleDateChange}
                />
              {this.renderStepActions(2, {
                label: 'Done',
                onClick: this.handleDoneClick,
              })}
            </StepContent>
          </Step>
        </Stepper>
      </div>
    );
  }
}
