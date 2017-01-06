import React from 'react';
import _ from 'lodash';

import {
  Table, TableBody, TableHeader, TableHeaderColumn,
  TableRow, TableRowColumn } from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';

const styles = {
  width: 0,

  header: {
    borderBottomStyle: 'none',
    height: 10,

    row: {
      column: {
        width: 24,
        paddingRight: 2,
        paddingLeft: 2,
        textAlign: 'middle',
        height: 0
      }
    }
  },
  body: {
    height: 0,
  }
};

const DaysOfWeek = (props) => {
  const column = {
    width: 24,
    paddingRight: 2,
    paddingLeft: 2,
    textAlign: 'middle',
    height: 0
  };

  return (
    <Table
      style={styles}
      selectable={false}>
      <TableHeader
        style={styles.header}
        displaySelectAll={false}
        adjustForCheckbox={false}>
        <TableRow style={styles.header}>
          <TableHeaderColumn style={column}>Sun</TableHeaderColumn>
          <TableHeaderColumn style={column}>Mon</TableHeaderColumn>
          <TableHeaderColumn style={column}>Tue</TableHeaderColumn>
          <TableHeaderColumn style={column}>Wed</TableHeaderColumn>
          <TableHeaderColumn style={column}>Thu</TableHeaderColumn>
          <TableHeaderColumn style={column}>Fri</TableHeaderColumn>
          <TableHeaderColumn style={column}>Sat</TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody
        style={styles.body}
        displayRowCheckbox={false}>
        <TableRow style={styles.body}>
          {
            _.range(7).map(i => (
              <TableRowColumn key={i} style={column}>
                <Checkbox
                  defaultChecked={props.defaultChecked[i]}
                  onCheck={(e, checked) =>
                    props.onCheck(e, i, checked)}
                />
              </TableRowColumn>))
          }
        </TableRow>
      </TableBody>
    </Table>
  );
};

DaysOfWeek.propTypes = {
  defaultChecked: React.PropTypes.array,
  onCheck: React.PropTypes.func,
};

export default DaysOfWeek;
