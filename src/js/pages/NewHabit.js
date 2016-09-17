'use strict';

import React from 'react';
// import _ from 'lodash';
// import moment from 'moment';

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

import {
} from '../styles';


export default class Habits extends React.Component {
  static propTypes = {
  }

  constructor(props) {
    super(props);

    this.state = {
      stepIndex: 2
    };
  }

  componentDidMount() {
    // sign up for events
    this.setState({  });
  }

  componentWillUnmount() {
    // sigh out from events
  }

  handlePrev = () => {
    this.setState({ stepIndex: this.state.stepIndex - 1 });
  }

  handleNext = () => {
    this.setState({ stepIndex: this.state.stepIndex + 1 });
  }

  renderStepActions(step, nextProps) {
    return (
      <div style={{margin: '12px 0'}}>
        <RaisedButton
          label="Next"
          disableTouchRipple={true}
          disableFocusRipple={true}
          primary={true}
          onTouchTap={this.handleNext}
          style={{marginRight: 12}}
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
    const cstyle = {
      width: 20,
      paddingRight: 5,
      paddingLeft: 5,
      textAlign: 'middle',
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
                errorText={this.state.goalValue ? null : 'This field is required'}
                onChange={e => this.setState({ goalValue: e.target.value })}
                value={this.state.goalValue}>
                </TextField>
              {this.renderStepActions(0, { disabled: !this.state.goalValue })}
            </StepContent>
          </Step>
          <Step>
            <StepButton>Habit</StepButton>
            <StepContent>
              <p>Come up with a step that bring
                you a little bit closer to your goal:</p>
              <TextField hintText='Routine'
                errorText={this.state.routineValue ? null : 'This field is required'}
                onChange={e => this.setState({ routineValue: e.target.value })}
                value={this.state.routineValue}>
                </TextField>
              {this.renderStepActions(1, { disabled: !this.state.routineValue })}
            </StepContent>
          </Step>
          <Step>
            <StepButton>Arrangement</StepButton>
            <StepContent>
              <p>You would like to repeat the routine each:</p>
              <Table 
                style={{ width: 0 }}
                selectable={false}>
                <TableHeader
                  style={{ borderBottomStyle: 'none', height: 10 }}
                  displaySelectAll={false}
                  adjustForCheckbox={false}>
                  <TableRow
                    style={{ borderBottomStyle: 'none', height: 10 }}
                    >
                    <TableHeaderColumn style={cstyle}>Mon</TableHeaderColumn>
                    <TableHeaderColumn style={cstyle}>Tue</TableHeaderColumn>
                    <TableHeaderColumn style={cstyle}>Wed</TableHeaderColumn>
                    <TableHeaderColumn style={cstyle}>Thu</TableHeaderColumn>
                    <TableHeaderColumn style={cstyle}>Fri</TableHeaderColumn>
                    <TableHeaderColumn style={cstyle}>Sat</TableHeaderColumn>
                    <TableHeaderColumn style={cstyle}>Sun</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody
                  displayRowCheckbox={false}>
                  <TableRow>
                    <TableRowColumn style={cstyle}><Checkbox /></TableRowColumn>
                    <TableRowColumn style={cstyle}><Checkbox /></TableRowColumn>
                    <TableRowColumn style={cstyle}><Checkbox /></TableRowColumn>
                    <TableRowColumn style={cstyle}><Checkbox /></TableRowColumn>
                    <TableRowColumn style={cstyle}><Checkbox /></TableRowColumn>
                    <TableRowColumn style={cstyle}><Checkbox /></TableRowColumn>
                    <TableRowColumn style={cstyle}><Checkbox /></TableRowColumn>
                  </TableRow>
                </TableBody>
              </Table>
              <p>starting from</p>
              <DatePicker hintText='Start date' container='inline' />
              {this.renderStepActions(2, {
                label: 'Done'
              })}
            </StepContent>
          </Step>
        </Stepper>
      </div>
    );
  }
}
