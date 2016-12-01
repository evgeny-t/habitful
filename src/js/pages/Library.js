'use strict';

import React from 'react';
// import _ from 'lodash';

import { GridList, GridTile } from 'material-ui/GridList';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import IconButton from 'material-ui/IconButton';

import {
} from '../styles';

const styles = {
  root: {
    width: '100%',
  },
};

export default class Library extends React.Component {
  static propTypes = {
    library: React.PropTypes.object,
    style: React.PropTypes.object,
    // onNewHabit: React.PropTypes.func,
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
    let { library, style } = this.props;

    // const tiles = _(this.props.habits)
    //   .filter(habit => !habit.deletedAt)
    //   .map((habit, i) => (
    //     <HabitProgress className="my-tile" key={i}
    //       habit={habit} {...other}
    //     />)).value();

    return (
      <div style={Object.assign({}, styles.root, style)}>
        <GridList>
        {library.items.map(x => (
          <GridTile key={x.name} title={x.name}
            actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
            subtitle={<a target="_blank" rel='external noopener '
              href={x.url}>Learn more</a>}
            >
            <img src={x.image} />
          </GridTile>))}
        </GridList>
      </div>
    );
  }
}
