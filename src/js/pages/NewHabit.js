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
import DatePicker from 'material-ui/DatePicker';

import DaysOfWeek from '../components/DaysOfWeek';

const styles = {
  stepActions: {
    margin: '12px 0',
    nextButton: {
      marginRight: 12,
    },
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
    checked: [true, true, true, true, true, true, true, true],
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
    newOne.days = this.state.checked;
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
              <br></br>
              <p>You would like to repeat the routine each:</p>
              <br></br>
              <DaysOfWeek
                defaultChecked={this.state.checked}
                onCheck={(e, index, checked) => {
                  const nextChecked = _.set(
                    _.clone(this.state.checked), index, checked);
                  this.setState({ checked: nextChecked });
                }}
              />
              <br></br>
              <p>starting from</p>
              <br></br>
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
