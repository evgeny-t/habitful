'use strict';

import React from 'react';
import { browserHistory } from 'react-router';

// import _ from 'lodash';
// import moment from 'moment';

import {Tabs, Tab} from 'material-ui/Tabs';

// TODO(ET): don't look like pages, should not be required from a component
import Habits from '../pages/Habits';
import Overview from '../pages/Overview';
import Today from '../pages/Today';

export default class TabbedContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabsValue: 'habits',
    };
  }

  handleTabChange = value => {
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
        value={this.state.tabs_value}
        onChange={this.handleTabChange}
      >
        <Tab label="habits" value="habits" >
          {<Habits />}
        </Tab>
        <Tab label="overview" value="overview">
          {<Overview />}
        </Tab>
        <Tab label="today" value="today">
          {<Today />}
        </Tab>
      </Tabs>
    );
  }
}
