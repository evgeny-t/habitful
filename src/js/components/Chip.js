'use strict';

import React from 'react';

const getStyle = props => {
  return Object.assign({
    userSelect: 'none',
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 5,
    paddingRight: 5,
    margin: '2px 5px',
    borderRadius: 2,
    fontSize: 11,
    writeSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    cursor: 'pointer',
    background: 'rgba(0, 0, 0, 0.1)',
  }, props.style);
};

const Chip = props => {
  return (
    <div style={getStyle(props)}
      onClick={props.onClick}>
      {props.text}
    </div>);
};

Chip.propTypes = {
  style: React.PropTypes.object,
  text: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func,
};

export default Chip;
