'use strict';

import React from 'react';
import _ from 'lodash';
import Radium, { Style } from 'radium';

import { /*GridList,*/ /*GridTile*/ } from 'material-ui/GridList';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import {
} from '../styles';

import HabitProgress from '../components/HabitProgress';

// workaround for floating button -- hides it when tab is not active.
const topics_addNew = {
  right: 0,
  bottom: 0,
  position: 'fixed',
  marginRight: 50,
  marginBottom: 50,
  //zIndex: 1,
};

const style = {
  root: {
    width: '100%',

    tilesContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      paddingTop: 30,
      paddingBottom: 30,
      paddingLeft: 75,
      paddingRight: 75,
    },
  },
};

@Radium
export default class MyHabits extends React.Component {
  static propTypes = {
    habits: React.PropTypes.array,
    today: React.PropTypes.object,
    onNewHabit: React.PropTypes.func,
  }

  static defaultProps = {
    onNewHabit: () => {},
  }

  state = {}

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // sign up for events
    this.setState({  });
  }

  componentWillUnmount() {
    // sigh out from events
  }

  componentWillReceiveProps(/*props*/) {
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    let { habits, ...other } = this.props;

    const tiles = _(this.props.habits)
      .filter(habit => !habit.deletedAt)
      .map((habit, i) => (
        <HabitProgress className="my-tile" key={i}
          habit={habit} {...other}
        />)).value();

    return (
      <div style={style.root}>
        <Style
          rules={{
            mediaQueries: {
              '(min-width: 320px)': {
                '.my-tile': {
                  width: 'calc(50% - 10px)',
                }
              },
              '(min-width: 768px)': {
                '.my-tile': {
                  width: 'calc(33% - 10px)',
                }
              },
              '(min-width: 1024px)': {
                '.my-tile': {
                  width: `calc(${100 / 5}% - 10px)`,
                }
              },
            }
          }}
        />

        <div style={style.root.tilesContainer}>
          {tiles}
        </div>
        <FloatingActionButton
          onClick={this.props.onNewHabit}
          zDepth={2}
          style={topics_addNew}
        >
          <ContentAdd />
        </FloatingActionButton>
      </div>
    );
  }
}
