'use strict';

import React from 'react';
// import _ from 'lodash';

import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import MoreVert from 'material-ui/svg-icons/navigation/more-vert';

import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import Chip from '../components/Chip';

import {
} from '../styles';

const styles = {
  root: {
    width: '100%',
    // marginRight: '5%',
    // marginLeft: '5%',
    marginTop: '2.5%',
  },
};

// <img style={{
        //   height: '100%',
        //   position: 'absolute',
        //   top: 0,
        //   right: 0,
        // }} src={props.image} />

const Tile = props => {
  return (
    <Paper style={{
      marginRight: 10,
      marginTop: 10,
      display: 'inline-block',
      width: `calc(100% / ${props.columns} - 10px)`,
    }}>
      <div style={{
        width: '100%',
        paddingTop: '75%',
        position: 'relative',
        overflow: 'hidden',

        background: `
          linear-gradient(white, transparent , white 85%),
          url("${props.image}")`,
        backgroundSize: '100% 100%',
      }}>
        <div style={{
          width: '50%',
          height: '25%',
          position: 'absolute',
          top: 0,
          background: 'transparent',
        }}>
          {props.tags && props.tags.map(t => (
            <Chip style={{ display: 'inline-block' }} text={t} />
            ))}
        </div>
        <IconButton style={{
          position: 'absolute',
          right: 0,
          top: 0,
        }}>
          <MoreVert />
        </IconButton>
        <div style={{
          width: '100%',
          height: '25%',
          position: 'absolute',
          bottom: 0,
          background: 'transparent',
        }}>
          <div style={{
            position: 'absolute',
            marginLeft: 10,
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
          }}>
            <div style={{
            }}>
              {props.name}
            </div>
            <a rel='noopener noreferrer' target='_blank'
              href={props.url}
              style={{
                display: 'inline-block',
                fontSize: '12',
              }}>
              Learn more...
            </a>
          </div>
          <IconButton style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            marginTop: '-24px',
          }}>
            <StarBorder />
          </IconButton>
        </div>
      </div>
    </Paper>
    );
};


Tile.propTypes = {
  url: React.PropTypes.string,
  image: React.PropTypes.string,
  name: React.PropTypes.string,
  columns: React.PropTypes.number,
  tags: React.PropTypes.array,
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

    return (
      <div style={Object.assign({}, styles.root, style)}>
        {library.items.map(x => (
          <Tile key={x._id} {...x} columns={3} />)
        )}
      </div>);
  }
}
