import React from "react";
import { Route, Switch } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Surveys from "./components/Surveys";
import Profile from "./components/Profile";
import SurveyData from "./components/SurveyData";
import EditSurvey from './components/EditSurvey';
import SurveyMetaInfo from './components/SurveyMetaInfo';


const BaseRouter = () => (
  <Switch>

    <Route exact path="/" component={MainLayout} />
    <Route exact path="/profile" component={Profile} />
    <Route exact path="/surveys" component={Surveys} />
    <Route path="/survey/:surveyID" component={SurveyData} />
    <Route path="/survey-edit/:surveyID" component={EditSurvey} />
    <Route path="/survey-info/:surveyID" component={SurveyMetaInfo} />

    
  </Switch>
);

export default BaseRouter;
