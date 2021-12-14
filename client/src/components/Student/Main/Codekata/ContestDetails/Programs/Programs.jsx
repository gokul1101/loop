import React, { useContext, useEffect, useState } from "react";
import "./Programs.css";
import { useHistory, useParams } from "react-router-dom";
import SelectReducer from "../../../../../Reducer/SelectReducer/SelectReducer";
import Editor from "../../../../../Reducer/Editor/Editor";
import { AuthContext } from "../../../../../../contexts/AuthContext";
import helperService from "../../../../../../services/helperService";
import Testcase from "./Testcase/Testcase";
import Timer from "../../Timer/Timer";
const Programs = (props) => {
  let history = useHistory();
  const { questionId } = useParams();
  const [authState] = useContext(AuthContext);
  const [challenge, setChallenge] = useState({});
  let [difficulty, setDifficulty] = useState("");
  let [testCases, setTestCases] = useState({});
  useEffect(() => {
    props.setSideToggle(true);
  });
  const findChallenge = () => {
    const problem = authState?.contest?.challenges?.find(
      (problem) => problem._id === questionId
    );
    setChallenge(problem);
    setDifficulty(problem?.difficulty_id.level);
  };
  const getTestCases = async () => {
    try{
      const {data : {message, testcases}} = await helperService.getTestCases(
        { questionId },
        { headers: { Authorization: authState.user.token } }
      );
      setTestCases(testcases?.testcases || {});
    } catch(err) {

    }
  }
  useEffect(() => {
    findChallenge();
    getTestCases();
  }, []);
  const [themeName, setThemeName] = React.useState("nord_dark");
  const [language, setLanguage] = React.useState("java");
  const handleChange = (event) => setThemeName(event.target.value);

  const handleLanguage = (event) => setLanguage(event.target.value);
  return (
    <>
      <div className="container-fluid" id={challenge?._id}>
        <div className="problem-header p-2 d-flex border-bottom border-left">
          <div className="problem-title d-flex">
            <div
              className="back-btn mt-2 ml-2 mr-2"
              onClick={() => history.goBack()}
            >
              <div className="triangle"></div>
              <div className="halfcircle"></div>
            </div>
          </div>
          <div className="timer mt-1 ml-2">
            <h6 className="timer-text" style = {{width : "230px"}}>
              <Timer />
            </h6>
          </div>
          <div className="w-100 d-flex flex-row-reverse mt-3 mb-2">
            <div className="w-25 mx-2">
              <SelectReducer
                array={["c", "java"]}
                name="Select language"
                handleSelect={handleLanguage}
                value={language}
                size="small"
                defaultValue={language}
                className="w-100"
              />
            </div>
            <div className="w-25 mx-2">
              <SelectReducer
                array={[
                  "xcode",
                  "monokai",
                  "github",
                  "nord_dark",
                  "textmate",
                  "one_dark",
                ]}
                name="Select theme"
                handleSelect={handleChange}
                value={themeName}
                size="small"
                className="w-100"
                defaultValue={themeName}
              />
            </div>
          </div>
        </div>
        <div className="problem-toggler">
          <div className="d-flex">
            <div className="col-md-4 p-0 border-left border-right border-bottom">
              <ul
                className="nav nav-pills program-pills p-3 border-bottom"
                id="pills-tab"
                role="tablist"
              >
                <li className="nav-item program-item" role="presentation">
                  <a
                    className="nav-link active program-link"
                    id="pills-problem-tab"
                    data-toggle="pill"
                    href="#pills-problem"
                    role="tab"
                    aria-controls="pills-problem"
                    aria-selected="true"
                  >
                    Problem
                  </a>
                </li>
                <li className="nav-item program-item" role="presentation">
                  <a
                    className="nav-link program-link"
                    id="pills-submissions-tab"
                    data-toggle="pill"
                    href="#pills-submissions"
                    role="tab"
                    aria-controls="pills-submissions"
                    aria-selected="false"
                  >
                    TestCase
                  </a>
                </li>
              </ul>
              <div className="tab-content p-2" id="pills-tabContent">
                <div
                  className="tab-pane fade show active p-2"
                  id="pills-problem"
                  role="tabpanel"
                  aria-labelledby="pills-problem-tab"
                >
                  <div className="d-flex mt-2">
                    <h5 className="problem-state mr-2">{challenge?.name}</h5>
                    <div
                      className={`problem-badge-${difficulty} d-flex align-items-center justify-content-center mr-2`}
                    >
                      <span className={`badge-${difficulty}`}>
                        {difficulty.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="problem-statement text-justify mt-3">
                    <p>{challenge?.statement}</p>
                  </div>
                  <div className="constraints mb-2">
                    <span className="constraints-title font-weight-bolder color-highlight">
                      Constraints :
                    </span>
                    <div className="constraints-content d-flex flex-column mt-2">
                      <span className="mt-2">
                        <i className="fas fa-circle constraints-dot mr-2"></i>
                        <span className="constraints-highlight pr-2 pl-2 mr-1">
                          {challenge?.constraints}
                        </span>
                      </span>
                      {/* <span className="mt-2">
                        <i className="fas fa-circle constraints-dot mr-2"></i>
                        <span className="constraints-highlight pr-2 pl-2 mr-1">
                          0 &lt; m &lt; 200,000
                        </span>{" "}
                        where m is the length of{" "}
                        <span className="constraints-highlight pr-2 pl-2 ml-1">
                          b
                        </span>
                      </span> */}
                    </div>
                  </div>
                  <div className="problem-input d-flex flex-column mt-4 mb-2">
                    <span className="constraints-title mb-2 font-weight-bolder color-highlight">
                      Example :
                    </span>
                    <div className="example-input mt-2">
                      <span className="font-weight-bolder color-highlight">
                        input_format :{" "}
                      </span>{" "}
                      <br />
                      <p className="mt-2 font-weight-bolder">
                        {challenge?.input_format}
                      </p>
                    </div>
                    <div className="example-output mt-2">
                      <span className="font-weight-bolder color-highlight">
                        output_format :{" "}
                      </span>{" "}
                      <br />
                      <p className="mt-2 font-weight-bolder">
                        {challenge?.output_format}
                      </p>
                    </div>
                  </div>
                  <div className="hints mt-2 d-flex flex-column">
                    <span className="constraints-title font-weight-bolder color-highlight">
                      Description :
                    </span>
                    <div className="problem-statement text-justify mt-2">
                      <p>{challenge?.description}</p>
                    </div>
                  </div>
                </div>
                  {/* /TESTCASE/ */}
                <div
                  className="tab-pane fade"
                  id="pills-submissions"
                  role="tabpanel"
                  aria-labelledby="pills-submissions-tab"
                >
                  <Testcase testcases={testCases}/>
                </div>
              </div>
            </div>
            <div className="col-md-8 p-0 d-flex flex-column">
              <Editor language={language} themeName={themeName} />
              <div className="mt-3 d-flex justify-content-end">
                <button className="btn-hover color-11 mr-2">
                  RUN CODE <i className="fas fa-code mr-2 ml-2"></i>
                </button>
                <button className="btn-hover color-11">
                  SUBMIT <i className="fas fa-rocket mr-2 ml-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Programs;
