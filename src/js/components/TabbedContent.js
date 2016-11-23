'use strict';

import React from 'react';

// import _ from 'lodash';
// import moment from 'moment';

import { Tabs, Tab } from 'material-ui/Tabs';

// TODO(ET): don't look like pages, should not be required from a component
import Today from '../pages/Today';
import Overview from '../pages/Overview';
import MyHabits from '../pages/MyHabits';

export default class TabbedContent extends React.Component {
  static propTypes = {
    params: React.PropTypes.shape({
      q: React.PropTypes.string,
    }),
    habits: React.PropTypes.array,
    today: React.PropTypes.object,
    onTabChanged: React.PropTypes.func,
    onMarkRoutineDone: React.PropTypes.func,
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

    this.props.onTabChanged(`/${value}`);
  }

  componentDidMount() {
  }

  componentWillReceiveProps(props) {
    this.setState({ tabsValue: props.params.q });
  }

  render() {
    return (
      <div>

        <Tabs
          value={this.state.tabsValue}
          onChange={this.handleTabChange}
          contentContainerStyle={{
            border: '1px solid black',
            position: 'relative',
          }}
          // style={{
          //   marginTop: 50,
          // }}
          inkBarStyle={{
            //display: 'none',
          }}
          tabItemContainerStyle={{
            top: 64,
            position: 'fixed',
            border: '1px solid red',
            left: 0,
            right: 0,
          }}>
          <Tab label="my habits" value="myhabits">
            {<MyHabits
              isActive={this.state.tabsValue === 'myhabits'}
              {...this.props}
            />}
          </Tab>
          <Tab label="today" value="today" >
            {<Today
              isActive={this.state.tabsValue === 'today'}
              habits={this.props.habits}
              onCheck={this.props.onMarkRoutineDone}
              />}
          </Tab>
          <Tab label="overview" value="overview">
            {<Overview
              isActive={this.state.tabsValue === 'overview'}
              {...this.props}
              />}
          </Tab>
        </Tabs>
      </div>
    );
  }
}
