'use strict';

import React from 'react';
import _ from 'lodash';

import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';

const style = {
};

class TagsEditor extends React.Component {
  static propTypes = {
    habits: React.PropTypes.array,
    style: React.PropTypes.object,
    tags: React.PropTypes.array,
    allTags: React.PropTypes.array,

    // onHabitRemove: React.PropTypes.func,
  }

  state = {
  }

  render() {

    return (
      <Paper style={{...style.gridTile, ...this.props.style}}
        >
        <div>Label habit</div>
        <TextField hintText='Enter tag name' />
        <List>
        {
          _.map(this.props.allTags, t =>
            (<ListItem
                leftCheckbox={<Checkbox
                  defaultChecked={!!_.find(this.props.tags, tag => tag === t)} />}
                key={t} primaryText={t} />))
        }
        </List>
      </Paper>);
  }
}

export default TagsEditor;