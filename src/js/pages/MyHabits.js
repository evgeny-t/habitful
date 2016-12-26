'use strict';

import React from 'react';
import _ from 'lodash';
import Radium, { Style } from 'radium';

import { /*GridList,*/ /*GridTile*/ } from 'material-ui/GridList';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import {
  centerScreenLabel,
  centerScreenContainer,
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
    onNavigate: React.PropTypes.func,
    params: React.PropTypes.object,
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
    let { habits, params: { filter }, ...other } = this.props;

    const allTags = _.uniq(_.reduce(habits,
      (prev, curr) => prev.concat(curr.tags), []));

    let tiles = _(this.props.habits)
      .filter(habit =>
        !habit.deletedAt && (!filter ||
          _.find(habit.tags || [], tag => tag === filter)))
      .map((habit, i) => (
        <HabitProgress className="my-habits__tile" key={i}
          habit={habit}
          allTags={allTags}
          {...other}
        />))
      .value();

    let content;
    if (tiles.length) {
      content = (
        <div style={style.root.tilesContainer}>
          {tiles}
        </div>
      );
    } else {
      content = (
        <p style={centerScreenLabel}>
        Start from adding a habit you want to track using the button below or
        exploring the
        <a onClick={() => this.props.onNavigate('/library')}> habits library</a>.
        </p>
      );
    }

    return (
      <div style={Object.assign({}, style.root,
        tiles.length ? {} : centerScreenContainer)}>
        <Style
          rules={{
            mediaQueries: {
              '(min-width: 320px)': {
                '.my-habits__tile': {
                  width: 'calc(50% - 10px)',
                }
              },
              '(min-width: 768px)': {
                '.my-habits__tile': {
                  width: 'calc(33% - 10px)',
                }
              },
              '(min-width: 1024px)': {
                '.my-habits__tile': {
                  width: `calc(${100 / 5}% - 10px)`,
                }
              },
            }
          }}
        />

        {content}

        <FloatingActionButton
          id="my-habits__add-button"
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
