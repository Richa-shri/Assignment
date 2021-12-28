import React, { useEffect, useState, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {
  Box,
  Button,
  Divider,
  Typography,
  Paper,
  Tooltip,
  Fab,
  InputAdornment,
  InputLabel,
  TextField,
  MenuItem,
  FormControl,
  Select,
  DialogContentText,
  TablePagination,
  TableSortLabel,
  Dialog,
  IconButton,
  Avatar,
} from "@material-ui/core";
import PropTypes from "prop-types";

import axios from "axios";
import SearchRoundedIcon from "@material-ui/icons/SearchRounded";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import Layout from "../component/Layout";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { withStyles } from "@material-ui/core/styles";
import AddEmployee from "./AddEmployer";
import UpdateEmployee from "./Update";
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: "employee_name", numeric: true, label: "Employee Name" },
  { id: "employee_code", numeric: true, label: "Employee Code" },
  { id: "yearly_salary", numeric: true, label: "Yearly Salary" },
  { id: "monthly_salary", numeric: false, label: "Monthly Salary" },
  { id: "employee_image", numeric: true, label: "Employee Image" },
  { id: "birthdate", numeric: true, label: "Birthdate" },

  {
    id: "employee_license_date",
    numeric: true,
    label: "Employee License Date",
  },

  //   { id: "id", numeric: false, label: "id" },
];
const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});
const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);
function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell>Action</TableCell>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};
const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
  Tablecell: {
    minWidth: 80,
  },

  fab: {
    margin: theme.spacing(0, 0.5),
  },

  btn: {
    margin: theme.spacing(0.5, 1),
  },
  formControl: {
    width: 220,
    margin: theme.spacing(0.5, 1),
  },
  image: {
    height: "50px",
    width: "50px",
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  searchBar: {
    display: "flex",
    flexFlow: "column-reverse",
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
    },
  },
  searchItem: {
    [theme.breakpoints.up("sm")]: {
      flexGrow: 1,
    },
  },
}));

export default function Home() {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [open4, setOpen4] = React.useState(false);
  const [updateid, setUpdateId] = React.useState();

  const [id, setId] = React.useState();
  const [rows, setRows] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleClose1 = (_event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen1(false);
    window.location.reload();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClose2 = () => {
    setOpen2(false);
    setOpen3(false);
  };
  const handleClose4 = () => {
    setOpen4(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [alertName, setAlertName] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:3004/user`)
      .then((res) => {
        console.log(res.data);
        setRows(res.data);
      })
      .catch();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // filter and search
  const sortedDetail = useMemo(() => {
    const searchRegex = searchTerm && new RegExp(`${searchTerm}`, "gi");
    return rows.filter(
      (item) =>
        (!searchRegex || searchRegex.test(item.employee_name)) &&
        (!status || item.yearly_salary > status)
    );
  }, [rows, searchTerm, status]);

  // reset
  const handleReset = () => {
    setStatus("");

    // setSearchTerm('')
  };

  //  delete
  const handleDelete = () => {
    axios.delete(`http://localhost:3004/user/${id}`).then((res) => {
      console.log("sucess", res);
      setOpen1(true);
    });
  };

  return (
    <Layout>
      <div>
        <Typography variant="h6" align="center">
          Employee List
        </Typography>
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            className={classes.btn}
            onClick={handleClickOpen}
          >
            Add New{" "}
          </Button>
        </Box>

        <Paper className={classes.root}>
          <br />
          <div className={classes.searchBar}>
            <div className={classes.searchItem}>
              <FormControl
                variant="outlined"
                className={classes.formControl}
                margin="dense"
              >
                <InputLabel id="demo-simple-select-outlined-label">
                  Select
                </InputLabel>
                <Select
                  onChange={(event) => {
                    setStatus(event.target.value);
                  }}
                  label="Select "
                  value={status}
                >
                  <MenuItem value="">select</MenuItem>

                  <MenuItem value="120000">{"> 1,20,000"}</MenuItem>
                </Select>
              </FormControl>

              <Button
                onClick={handleReset}
                variant="contained"
                className={classes.btn}
                color="primary"
              >
                View All
              </Button>
            </div>
            <TextField
              id="outlined-basic"
              label="Search by Name"
              className={classes.formControl}
              variant="outlined"
              margin="dense"
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchRoundedIcon />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <br />
          <Divider />
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table" size="small">
              <EnhancedTableHead
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />

              <TableBody>
                {stableSort(sortedDetail, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        key={row.id}
                        tabIndex={-1}
                      >
                        <TableCell>{row.employee_name}</TableCell>
                        <TableCell>{row.employee_code}</TableCell>
                        <TableCell>{row.yearly_salary}</TableCell>
                        <TableCell>{row.monthly_salary}</TableCell>
                        <TableCell>
                          <Avatar
                            src={row.employee_image}
                            className={classes.image}
                          />
                        </TableCell>
                        <TableCell>{row.birthdate}</TableCell>
                        <TableCell>{row.employee_license_date}</TableCell>

                        <TableCell>
                          <Box display={"flex"}>
                            <Tooltip title="Edit" aria-label="Edit">
                              <Fab
                                color="primary"
                                size="small"
                                className={classes.fab}
                                onClick={() => {
                                  setUpdateId(row.id);
                                  setOpen4(true);
                                }}
                              >
                                <EditIcon />
                              </Fab>
                            </Tooltip>

                            <Tooltip title="Delete" aria-label="delete">
                              <Fab
                                color="secondary"
                                size="small"
                                className={classes.fab}
                                onClick={() => {
                                  setId(row.id);
                                  setOpen2(true);
                                }}
                              >
                                <DeleteIcon />
                              </Fab>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={12} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        {/* confirmation for delete */}
        <Dialog
          open={open2}
          onClose={handleClose2}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="alert-dialog-title">
            <Typography align="center" variant="h6" color="secondary">
              {"Confirm"}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are You Sure want to Delete
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              type="submit"
              variant="contained"
              className={classes.btn}
              onClick={handleDelete}
            >
              Delete
            </Button>
            <Button
              onClick={handleClose2}
              color="secondary"
              variant="contained"
              className={classes.btn}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        {/* for adding new data */}
        <AddEmployee open={open} onClose={handleClose} />
        <UpdateEmployee open={open4} onClose={handleClose4} id={updateid} />
        {/* sucess msg */}
        <Snackbar open={open1} autoHideDuration={1000} onClose={handleClose1}>
          <Alert onClose={handleClose1} severity="success">
            Deleted Successfully
          </Alert>
        </Snackbar>
      </div>
    </Layout>
  );
}
