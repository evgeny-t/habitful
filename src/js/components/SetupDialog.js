import React, { Component } from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import DatePicker from 'material-ui/DatePicker';


export default class SetupDialog extends Component {
  state = {
    open: true,
  };

  constructor(props) {
    super(props);
  }

  handleClose = () => {
    this.props.onNext(this.state);
    this.setState({ open: false });
  };

  handleDateChange = (event, date) => {
    this.setState({ date });
  }

  render() {
    const actions = [
      <FlatButton
        label="next"
        primary={true}
        disabled={!this.state.date}
        onTouchTap={this.handleClose}
      />,
    ];

    return (
      <Dialog
        title="One thing before we start"
        actions={actions}
        modal={true}
        open={this.state.open}
      >
        <p>Please, let us know your date of birth in order
        for one feature to work properly:</p>
        <br></br>
        <DatePicker
          hintText="Your date of birth"
          mode="landscape"
          value={this.state.date}
          onChange={this.handleDateChange}
        />
      </Dialog>
    );
  }
}

