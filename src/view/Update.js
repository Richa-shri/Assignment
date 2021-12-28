import React, {useEffect} from "react";
import {
  Button,
  TextField,
  Typography,
  IconButton,
  Grid,
  Avatar
} from "@material-ui/core";
import { useForm } from "react-hook-form";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import Dialog from "@material-ui/core/Dialog";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import moment from 'moment'

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

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function UpdateEmployee(props) {
  const { open, onClose , id} = props;
  const { register, handleSubmit, errors , watch} = useForm();
  const [open1, setOpen1] = React.useState(false);
  const [image, setImage] = React.useState();
  const [EmpName, setEmpName] = React.useState();
  const [EmpCode, setEmpCode] = React.useState();
  const [EmpMothlySalary, setEmpMothlySalary] = React.useState();
  const [EmpBirthDate, setEmpBirthDate] = React.useState();
  const [EmpLicensedate, setEmpLicensedate] = React.useState();

 

  useEffect(() => {
    axios.get(`http://localhost:3004/user/${id}`).then((res) => {
      console.log(res.data);
      setEmpName(res.data.employee_name);
      setEmpCode(res.data.employee_code);
      setEmpMothlySalary(res.data.monthly_salary);
      setEmpBirthDate(res.data.birthdate);
      setEmpLicensedate(res.data.employee_license_date);
      setImage(res.data.employee_image)

    });
  }, [id]);

  const handleClose1 = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen1(false);
    window.location.reload();
  };

  const imageUpload = async(e) => {
    const file = e.target.files[0];
  getBase64(file).then(base64 => {
     setImage(base64);
      console.debug("file stored",base64);
    });
};
const getBase64 = (file) => {
    return new Promise((resolve,reject) => {
       const reader = new FileReader();
       reader.onload = () => resolve(reader.result);
       reader.onerror = error => reject(error);
       reader.readAsDataURL(file);
    });
  }
  const onSubmit = (data) => {
    let today = new Date();
    let today1 = moment(today)
    let bdate =  new Date(data.birthdate)
    let bdate1 =  moment(bdate)
 const diffrence = today1.diff(bdate1, 'year')
 if (diffrence < 18) {
  alert("No Eligible for License");
  window.location.reload(false)
} else {
    const details = {
      employee_name: data.employee_name,
      employee_code: data.employee_code,
      monthly_salary: data.monthly_salary,
      yearly_salary: data.monthly_salary * 12,
      employee_image: image,
      birthdate: data.birthdate,
      employee_license_date: data.employee_license_date,
    };
    axios.put(`http://localhost:3004/user/${id}`, details).then((res) => {
        console.log(res.data);
        setOpen1(true);
      });
    }
  };
  return (
    <div>
      <Dialog
        maxWidth="sm"
        fullWidth
        open={open}
        // onClose={onClose}
      >
        <DialogTitle id="customized-dialog-title" onClose={onClose}>
         Update Employee Detail
        </DialogTitle>
        <DialogContent dividers>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={1}>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  margin="dense"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  label="Employee Name"
                  name="employee_name"
                  value={EmpName}
                  onChange={(e)=>setEmpName(e.target.value)}
                  inputRef={register({
                    required: "This Field is required.",
                    pattern: {
                      value: /^[a-zA-Z0-9\s]+$/,
                      message:
                        "Please Enter alphanumeric values only.",
                    },
                  })}
                  error={Boolean(errors.employee_name)}
                  helperText={errors.employee_name?.message}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  margin="dense"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  label="Employee Code"
                  name="employee_code"
                  value={EmpCode}
                  onChange={(e)=>setEmpCode(e.target.value)}
                  inputRef={register({
                    required: "This Field is required.",
                    pattern: {
                      value: /^[a-zA-Z0-9\s]+$/,
                      message:
                        "Please Enter alphanumeric values only.",
                    },
                  })}
                  error={Boolean(errors.employee_code)}
                  helperText={errors.employee_code?.message}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  margin="dense"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  label="Monthly Salary"
                  name="monthly_salary"
                  value={EmpMothlySalary}
                  onChange={(e)=>setEmpMothlySalary(e.target.value)}
                 type={'number'}
                  inputRef={register({
                    required: "This Field is required.",
                    validate: (value) =>
                    value > 1000 ||
                    "Monthly salary will be Greater then 1000",
                    
                })}
                    
         
                  error={Boolean(errors.monthly_salary)}
                  helperText={errors.monthly_salary?.message}
                />
              </Grid>
              
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  margin="dense"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  label="Birth Date"
                  type={"date"}
                  value={EmpBirthDate}
                  onChange={(e)=>setEmpBirthDate(e.target.value)}
                  name="birthdate"
                  inputRef={register({
                    required: "This Field is required.",
                    validate:(value) => new Date(value) < new Date() || "Date should be past date"
                    
                   })}
                  error={Boolean(errors.birthdate)}
                  helperText={errors.birthdate?.message}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  margin="dense"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  label="Employee License Date"
                  type={"date"}
                  name="employee_license_date"
                  
                  value={EmpLicensedate}
                  onChange={(e)=>setEmpLicensedate(e.target.value)}
                  inputRef={register({
                    required: "This Field is required.",
                    validate: (value) =>
                      value > watch("birthdate") ||
                      "License Date should be grater then bithdate",
                  })}
                  error={Boolean(errors.employee_license_date)}
                  helperText={errors.employee_license_date?.message}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  margin="dense"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  label="Image"
                  type="file"
                  onChange={imageUpload}
                  
                  name="employee_image"
                  inputRef={register({
                    // required: "This Field is required.",
                  })}
                  error={Boolean(errors.employee_image)}
                  helperText={errors.employee_image?.message}
                />
              </Grid>
            </Grid>
            <Avatar src={image} style={{width: 70, height: 70}}/>

            <DialogActions>
              <Button color="primary" variant="contained" type="submit">
               Update
              </Button>
              <Button color="secondary" variant="contained" onClick={onClose}>
                Cancel
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      {/* sucess msg */}
      <Snackbar open={open1} autoHideDuration={1000} onClose={handleClose1}>
        <Alert onClose={handleClose1} severity="success">
          Successfully updated!
        </Alert>
      </Snackbar>
    </div>
  );
}
