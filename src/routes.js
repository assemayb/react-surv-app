import React from "react";
import { Route, Switch } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Surveys from "./components/Surveys";
import Profile from "./components/Profile";
import SurveyData from "./components/SurveyData";

const BaseRouter = () => (
  <Switch>
    <Route exact path="/" component={MainLayout} />
    <Route exact path="/profile" component={Profile} />
    <Route exact path="/surveys" component={Surveys} />
    <Route path="/survey/:surveyID" component={SurveyData} />
  </Switch>
);

export default BaseRouter;
