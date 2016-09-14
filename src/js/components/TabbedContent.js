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

const HABITS_STUB = [
  {
    text: 'Running',
    description: 'it will help me to be more healty',
    period: {
      value: 1,
      type: 'day'
    }
  },

  {
    text: 'Writing Writing Writing Writing Writing Writing Writing Writing',
    description: 'it will help me to obtain the voice ;)',
    period: {
      value: 1,
      type: 'week'
    }
  },

  {
    text: 'Push-ups',
    description: 'it will help me to be more muscled',
    period: {
      value: 1,
      type: 'day'
    }
  },

];

const TODAY_ITEMS = [
  {
    text: 'Run',
    done: false,
  },
  {
    text: 'Run Run Run',
    done: false,
  },
  {
    text: 'Read',
    done: true,
  },
  {
    text: 'Write a book',
    done: true,
  }
];

export default class TabbedContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabsValue: props.params.q,
      habits: HABITS_STUB,
      today: TODAY_ITEMS
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
            habits={this.state.habits} />}
        </Tab>
        <Tab label="overview" value="overview">
          {<Overview isActive={this.state.tabsValue === 'overview'} />}
        </Tab>
        <Tab label="today" value="today">
          {<Today isActive={this.state.tabsValue === 'today'} 
            today={this.state.today}
          />}
        </Tab>
      </Tabs>
    );
  }
}
