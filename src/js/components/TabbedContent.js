'use strict';

import React from 'react';
import { browserHistory } from 'react-router';

import { connect } from 'react-redux';

// import _ from 'lodash';
// import moment from 'moment';

import {Tabs, Tab} from 'material-ui/Tabs';

// TODO(ET): don't look like pages, should not be required from a component
import Habits from '../pages/Habits';
import Overview from '../pages/Overview';
import Today from '../pages/Today';

class TabbedContent extends React.Component {
  static propTypes = {
    params: React.PropTypes.shape({
      q: React.PropTypes.string,
    }),
    habits: React.PropTypes.array,
    today: React.PropTypes.array,
  }

  constructor(props) {
    super(props);
    this.state = {
      tabsValue: props.params.q,
    };
  }

  handleTabChange = value => {
    // a workaround for http://stackoverflow.com/questions/39493516/why-does-checkbox-fires-tabs-onchange-event-in-material-ui
    if (typeof value === 'object') {
      return;
    }

    browserHistory.push(`/${value}`);
  }

  componentDidMount() {
  }

  componentWillReceiveProps(props) {
    this.setState({ tabsValue: props.params.q });
  }

  render() {
    return (
      <Tabs
        value={this.state.tabsValue}
        onChange={this.handleTabChange}
      >
        <Tab label="habits" value="habits" >
          {<Habits isActive={this.state.tabsValue === 'habits'} 
            habits={this.props.habits} />}
        </Tab>
        <Tab label="overview" value="overview">
          {<Overview isActive={this.state.tabsValue === 'overview'} />}
        </Tab>
        <Tab label="today" value="today">
          {<Today isActive={this.state.tabsValue === 'today'} 
            today={this.props.today}
          />}
        </Tab>
      </Tabs>
    );
  }
}

export default connect(state => {
  return state;
})(TabbedContent);
