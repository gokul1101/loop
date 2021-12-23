import React, { useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { green } from "@material-ui/core/colors";
import { Button, FormControlLabel } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import { withStyles } from "@material-ui/core/styles";
import { useState } from "react";
// import { Link } from "react-router-dom";
import InputReducer from "../../../../../Reducer/InputReducer";
import helperService from "../../../../../../services/helperService";
import { useContext } from "react";
import { AuthContext } from "../../../../../../contexts/AuthContext";
import "./TestCase.css";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    "&$checked": {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);
const TestCase = (props) => {
  const [authState] = useContext(AuthContext);
  const [testcases, setTestcases] = useState({
    sample: [],
    hidden: [],
  });
  const [testcase, setTestcase] = useState({
    input: "",
    output: "",
  });
  const [DBTestcase, setDBTestcase] = useState({
    sample: [],
    hidden: [],
  });
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const [checked, setChecked] = React.useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const addTestcase = () => {
    props.snackBar("Sucessfully added", "success");
    console.log(testcases, testcase);
    if (checked) {
      setTestcases({ ...testcases, hidden: [...testcases.hidden, testcase] });
      setDBTestcase({ ...DBTestcase, hidden: [testcase] });
    } else {
      setDBTestcase({ ...DBTestcase, sample: [testcase] });
      setTestcases({ ...testcases, sample: [...testcases.sample, testcase] });
    }
  };
  const createTestcase = async () => {
    props.snackBar("Sucessfully added", "success");
    try {
      const { data, status } = await helperService.createTestcase(
        { question_id: authState?.challenge?._id, testcase: DBTestcase },
        { headers: { Authorization: authState.user.token } }
      );
      if (status === 201) {
        if (data?.testcases) setTestcases(...data.testcases);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setDBTestcase({
        sample: [],
        hidden: [],
      });
    }
  };

//edit and delete the testcases
const sampleTestCaseEdit = () => {
  setOpen(true);
}
const sampleTestCaseDelete = () => {
  props.snackBar("Selected Sample Test case is deleted successfully ","success")
}

const hiddenTestCaseEdit = () => {
  setOpen(true);
}
const hiddenTestCaseDelete = () => {
  props.snackBar("Selected Hidden Test case is deleted successfully","success")
}





  useEffect(() => {
    setTestcases(
      authState?.challenge?.testcases?.testcases || {
        sample: [],
        hidden: [],
      }
    );
  }, [authState]);
  return (
    <div className="container">
      <div className="d-flex flex-column" style={{ marginTop: "40px" }}>
        <p className="text-left dash-title-category pb-2">Create Testcase</p>
        <span className="create-con-text mt-1">
          Add testcase to the challenge to the contest by selecting challenge
          from our library or create
        </span>
        <span className="create-con-text">
          of your own challenges here. To record your challenges, simply select
          the challenge and drag and
        </span>
      </div>
      <div className="create-con">
        {/* <Link to="/contests/create-contest"> */}
        <button className="p-2 mt-3" onClick={handleClickOpen}>
          <i className="fas fa-plus pr-2 pl-2"></i>ADD TESTCASE
        </button>
        {/* </Link> */}
      </div>
      <h4 className="m-2 p-2 text-uppercase text-center font-weight-bolder">Sample Test Cases</h4>
      {testcases?.sample?.length === 0 ? (
        <div className="alert alert-primary" role="alert">
       Till now No Sample test Case is added !!!!!
      </div>
      ) : (
        <div className="d-flex p-2 flex-wrap">
          {testcases?.sample?.map((testcase) => (
            <div className="p-2">
              <div
                class="card test-card p-3"
                style={{
                  height: "250px",
                  width: "300px",
                  borderBottom: "5px solid #21A366",
                  
                }}
              >
                <div className="edit-delete d-flex ml-auto p-2 m-2">
                  
                  <i class="fas fa-edit" onClick={sampleTestCaseEdit}></i>
                  <i class="fas fa-trash ml-2 " onClick={sampleTestCaseDelete}></i>
                </div>
                <div className="input">
                  <h4 className="font-weight-bolder text-highlight">Input</h4>
                  <h6>{testcase.input}</h6>
                </div>
                <div className="output">
                  <h4 className="font-weight-bolder text-highlight">Output</h4>
                  <h6>{testcase.output}</h6>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

<h4 className="m-2 p-2  text-uppercase text-center font-weight-bolder">Hidden Test Cases</h4>
      {testcases?.hidden.length === 0 ? (
        <div className="alert alert-primary" role="alert">
        Till now No Hidden test Case is added !!!!!
       </div>
      ) : (
        <div className="d-flex flex-wrap">
          {testcases?.hidden?.map((testcase) => (
           <div className="p-2">
           <div
             class="card test-card p-3"
             style={{
               height: "250px",
               width: "300px",
               borderBottom: "5px solid #21A366",
               
             }}
           >
             <div className="edit-delete d-flex ml-auto p-2 m-2">
               
               <i class="fas fa-edit" onClick={hiddenTestCaseEdit}></i>
               <i class="fas fa-trash ml-2 " onClick={hiddenTestCaseDelete}></i>
             </div>
             <div className="input">
               <h4 className="font-weight-bolder text-highlight">Input</h4>
               <h6>{testcase.input}</h6>
             </div>
             <div className="output">
               <h4 className="font-weight-bolder text-highlight">Output</h4>
               <h6>{testcase.output}</h6>
             </div>
           </div>
         </div>
          ))}
        </div>
      )}

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        fullWidth
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {"Create your own TestCase"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <InputReducer
              fullWidth
              id="outlined-multiline-static"
              label="Enter Input format"
              multiline
              rows={4}
              variant="outlined"
              onClickHandler={(value) =>
                setTestcase({ ...testcase, input: value })
              }
            />
          </DialogContentText>
          <DialogContentText id="alert-dialog-slide-description">
            <InputReducer
              fullWidth
              id="outlined-multiline-static"
              label="Enter Output format"
              multiline
              rows={4}
              variant="outlined"
              onClickHandler={(value) =>
                setTestcase({ ...testcase, output: value })
              }
            />
          </DialogContentText>
        </DialogContent>
        <DialogContentText id="alert-dialog-slide-description" className="pl-4">
          <FormControlLabel
            control={
              <GreenCheckbox
                checked={checked}
                onChange={handleChange}
                name="Hidden"
                color="primary"
              />
            }
            label="Enable Hidden"
          />
        </DialogContentText>
        <DialogActions>
          <Button onClick={addTestcase} color="primary" variant="contained">
            ADD TESTCASE
          </Button>
          <Button onClick={createTestcase} color="primary" variant="contained">
            SAVE TESTCASES
          </Button>
          <Button onClick={handleClose} color="primary">
            CLOSE
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TestCase;
