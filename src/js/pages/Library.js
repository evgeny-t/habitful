'use strict';

import React from 'react';
import _ from 'lodash';

import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import MoreVert from 'material-ui/svg-icons/navigation/more-vert';

import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';

import Chip from '../components/Chip';

import {
} from '../styles';

const styles = {
  root: {
    width: '100%',
    marginTop: '2.5%',
  },
};

const HabitLink = props => (
  <a rel='noopener noreferrer' target='_blank'
    href={props.url}
    style={{
      display: 'inline-block',
      fontSize: 12,
    }}>
    Learn more...
  </a>
);

// TODO(ET): separate styles and markup (9)
const Tile = props => {
  return (
    <Paper style={{
      marginRight: 10,
      marginTop: 10,
      display: 'inline-block',
      width: `calc(100% / ${props.columns} - 10px)`,
    }}>
      <div
        onClick={props.onItemClick}
        style={{
          width: '100%',
          paddingTop: '75%',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',

          background: `
            linear-gradient(white, transparent , white 85%),
            url("${props.image}")`,
          backgroundSize: '100% 100%',
        }}
      >
        <div style={{
          width: '50%',
          height: '25%',
          position: 'absolute',
          top: 0,
          background: 'transparent',
        }}>
          {props.tags && props.tags.map(t => (
            <Chip style={{
              display: 'inline-block'
            }}
              key={t} text={t}
              onClick={props.onTagClick.bind(null, t)}/>
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
            <div style={{}}>
              {props.name}
            </div>
            <HabitLink url={props.url} />
          </div>
          <div style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
          }}>
            <IconButton style={{
              display: 'inline-block',
            }} onClick={props.onAddClick}>
              <StarBorder />
            </IconButton>
            {props.popularity && (
              <span style={{
                color: '#666',
                fontSize: 11,
                display: 'inline-block',
                marginRight: 10,
                marginLeft: -10,
                transform: 'translateY(-50%)',
              }}>
                {props.popularity}
              </span>)}
          </div>
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
  popularity: React.PropTypes.number,
  tags: React.PropTypes.array,

  onTagClick: React.PropTypes.func,
  onAddClick: React.PropTypes.func,
  onItemClick: React.PropTypes.func,
};

const HabitDialog = props => {
  return props.selected && (
    <Dialog
      title={props.selected.name}
      actions={[]}
      modal={false}
      {...props}
      >
      <div>
        {props.selected.description}
      </div>
      <HabitLink url={props.selected.url} />
    </Dialog>
  );
};

HabitDialog.propTypes = {
  name: React.PropTypes.string,
  description: React.PropTypes.string,
  url: React.PropTypes.string,
};

export default class Library extends React.Component {
  static propTypes = {
    library: React.PropTypes.object,
    style: React.PropTypes.object,
    params: React.PropTypes.object,
    onLibraryTagClick: React.PropTypes.func,
    onAddClick: React.PropTypes.func,
    onFilter: React.PropTypes.func,
  }

  static defaultProps = {
  }

  state = {
    open: false,
    selectedItem: null,
  }

  constructor(props) {
    super(props);
  }

  render() {
    let { library, style, params: { filter } } = this.props;

    return (
      <div style={Object.assign({}, styles.root, style)}>
        {_.filter(library.items, item =>
          _.find((item.tags || []), o => o === filter) || !filter)
          .map(item => (
            <Tile key={item._id} columns={3}
              {...item}
              onTagClick={this.props.onLibraryTagClick}
              onAddClick={this.props.onAddClick.bind(this, item._id)}
              onItemClick={this.handleItemClick.bind(this, item)}
              popularity={library.popularity[item._id]}
              />)
          )}
        <HabitDialog
          selected={this.state.selectedItem}
          open={this.state.open}
          onRequestClose={this.requestClose}
        />
      </div>);
  }

  handleItemClick = item => {
    this.setState({
      open: true,
      selectedItem: item,
    });
  }

  requestClose = () => this.setState({ open: false });
}
