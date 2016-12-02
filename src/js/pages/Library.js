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

const Tile = props => {
  return (
    <div style={{
      // marginBottom: -4,
      marginRight: 5,
      marginLeft: 5,
      marginTop: 5,
      display: 'inline-block',
      width: `calc(100% / ${props.columns} - 10px)`,
    }}>
      <div style={{
        width: '100%',
        background: 'yellow',
        paddingTop: '75%',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <img style={{
          height: '100%',
          position: 'absolute',
          top: 0,
          right: 0,
        }} src={props.image} />
      </div>
    </div>
    );
};


Tile.propTypes = {
  url: React.PropTypes.string,
  image: React.PropTypes.string,
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
        {library.items.map(x => (
          <Tile key={x.name} {...x} columns={4} />)
        )}
      </div>);

    // return (
    //   <div style={Object.assign({}, styles.root, style)}>
    //     <GridList>
    //     {library.items.map(x => (
    //       <GridTile key={x.name} title={x.name}
    //         actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
    //         subtitle={<a target="_blank" rel='external noopener '
    //           href={x.url}>Learn more</a>}
    //         >
    //         <img src={x.image} />
    //       </GridTile>))}
    //     </GridList>
    //   </div>
    // );
  }
}
