import { NavLink, Switch, Route, useParams } from "react-router-dom";
import "./ContestDetails.css";
import ContestChallenges from "./ContestChallenges/ContestChallenges";
import ContestQuizzes from "./ContestQuizzes/ContestQuizzes";
import ContestStatictics from "./ContestStatictics/ContestStatictics";
import CreateContest from "../CreateContest/CreateContest";

import CreateChallenge from "../../Challenges/ChallengeDashboard/CreateChallenge/CreateChallenge";
const ContestDetails = (props) => {
  const { id } = useParams();

  return (
    <>
      <ul className="container-fluid list-group d-flex flex-row py-2 my-3 border">
        <li className="list-group-item user-group-pill">
          <NavLink
            exact
            className="edit-contest-li pr-3 pl-3 mt-2 mb-2"
            to={`/contests/${id}/edit`}
            activeClassName="box arrow-bottom"
          >
            <i className="fas fa-plus pr-1 pl-1"></i> Details
          </NavLink>
        </li>
        <li className="list-group-item user-group-pill">
          <NavLink
            exact
            className="edit-contest-li pr-3 pl-3 m-2"
            to={`/contests/${id}/quizzes`}
            activeClassName="box arrow-bottom"
          >
            <i className="fas fa-clipboard-list pr-2 pl-1"></i> Quizzes List
          </NavLink>
        </li>
        <li className="list-group-item user-group-pill">
          <NavLink
            exact
            className="edit-contest-li pr-3 pl-3 m-2"
            to={`/contests/${id}/challenges`}
            activeClassName="box arrow-bottom"
          >
            <i className="fas fa-clipboard-list pr-2 pl-1"></i>Challenges List
          </NavLink>
        </li>
        <li className="list-group-item user-group-pill">
          <NavLink
            exact
            className="edit-contest-li pr-3 pl-3 m-2"
            to={`/contests/${id}/statistics`}
            activeClassName="box arrow-bottom"
          >
            <i className="fas fa-clipboard-list pr-2 pl-1"></i>Statictics
          </NavLink>
        </li>
      </ul>
      <div>
        <Switch>
          <Route path={`/contests/:id/edit`} exact>
            <CreateContest title="Update Contest" snackBar={props.snackBar} />
          </Route>
          <Route path={`/contests/:id/quizzes`} exact>
            <ContestQuizzes snackBar={props.snackBar}/>
          </Route>
          <Route path={`/contests/:id/challenges`}>
            <Route path="/contests/:id/challenges" exact>
              <ContestChallenges snackBar={props.snackBar}/>
            </Route>
            <Route path="/contests/:id/challenges/create" exact>
              <CreateChallenge snackBar={props.snackBar} />
            </Route>
          </Route>
          <Route path={`/contests/:id/statistics`} exact>
            <ContestStatictics snackBar={props.snackBar}/>
          </Route>

          {/* <Route
            path={`/contests/:id`}
            render={() => <Redirect to={`/contests/${id}/edit`} />}
          /> */}
        </Switch>
      </div>
    </>
  );
};

export default ContestDetails;
