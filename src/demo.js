import React, { useState, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TableSortLabel from "@material-ui/core/TableSortLabel";

import { SortableContainer, SortableElement } from "react-sortable-hoc";

const useStyles = makeStyles({
  table: {
    minWidth: 650
  }
});

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9)
];

const columns = [
  {
    text: "Dessert (100g serving)",
    align: "left",
    valKey: "name",
    sortFunc: (a, b) => a.localeCompare(b)
  },
  { text: "Calories", align: "right", valKey: "calories" },
  { text: "Fat (g)", align: "right", valKey: "fat" },
  { text: "Carbs (g)", align: "right", valKey: "carbs" },
  { text: "Protein (g)", align: "right", valKey: "protein" }
];

export default function SimpleTable() {
  const classes = useStyles();
  const [displayRows, setDisplayRows] = useState(rows);

  //So I always have an initial reference point, we'll just hang onto the order
  const [order, setOrder] = useState(
    new Array(rows.length).fill(null).map((n, i) => i)
  );

  const onReorderEnd = useCallback(
    ({ oldIndex, newIndex, collection, isKeySorting }, e) => {
      const newOrder = [...order];
      const moved = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, moved[0]);
      setOrder(newOrder);
    },
    [order, setOrder]
  );

  const [sort, setSort] = useState({ column: {}, dir: 1 });

  const onHeaderClick = (column) => () => {
    const dir = column.valKey === sort.column.valKey ? sort.dir * -1 : 1;
    setSort({ column, dir });
    setDisplayRows(handleSort(displayRows, sort.column, sort.dir));
  };

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <SortableHead axis="x" onSortEnd={onReorderEnd} distance={5}>
          {order.map((colIdx, i) => (
            //index needs to be CURRENT
            //key needs to be STATIC
            <SortableCell
              index={i}
              key={colIdx}
              value={
                <TableCell
                  onClick={onHeaderClick(columns[colIdx])}
                  align={columns[colIdx].align}
                >
                  <TableSortLabel
                    active={sort.column.valKey === columns[colIdx].valKey}
                    direction={sort.dir === 1 ? "asc" : "desc"}
                  >
                    {columns[colIdx].text}
                  </TableSortLabel>
                </TableCell>
              }
            />
          ))}
        </SortableHead>
        <TableBody>
          {displayRows.map((row) => (
            <TableRow key={row.name}>
              {order.map((colIdx, i) => (
                <TableCell
                  key={columns[colIdx].valKey}
                  component="th"
                  scope="row"
                  align={columns[colIdx].align}
                >
                  {row[columns[colIdx].valKey]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

//Use the react-sortable-hoc wrappers around the matui elements
const SortableHead = SortableContainer( ({ children }) => {
  return (
    <TableHead>
      <TableRow>{children}</TableRow>
    </TableHead>
  );
});

const SortableCell = SortableElement(({ value }) => {
  return <>{value}</>;
});

const handleSort = (rows, column, dir) => {
  return rows.sort((aRow, bRow) => {
    const a = aRow[column.valKey];
    const b = bRow[column.valKey];
    const f = column.sortFunc;
    return (f ? f(a, b) : a - b) * dir;
  });
};
