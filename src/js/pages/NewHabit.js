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

import {  
} from '../styles';


export default class Habits extends React.Component {
  static propTypes = {
  }

  constructor(props) {
    super(props);

    this.state = {
      stepIndex: 0
    };
  }

  componentDidMount() {
    // sign up for events
    this.setState({  });
  }

  componentWillUnmount() {
    // sigh out from events
  }

  renderStepActions(step) {
    return (
      <div style={{margin: '12px 0'}}>
        <RaisedButton
          label="Next"
          disableTouchRipple={true}
          disableFocusRipple={true}
          primary={true}
          onTouchTap={this.handleNext}
          style={{marginRight: 12}}
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
            </StepContent>
          </Step>
          <Step>
            <StepButton>Habit</StepButton>
            <StepContent>
              <p>Come up with a step that bring
                you a little bit closer to your goal:</p>
            </StepContent>
          </Step>
          <Step>
            <StepButton>Arrangement</StepButton>
            <StepContent>
              <p>Specify a time interval between steps:</p>
            </StepContent>
          </Step>
        </Stepper>
      </div>
    );
  }
}
