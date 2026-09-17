import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import SiteLayout from "./components/SiteLayout";
import Home from "./pages/Home";
import Programs from "./pages/Programs";
import ProgramDetail from "./pages/ProgramDetail";
import Camps from "./pages/Camps";
import About from "./pages/About";
import Quiz from "./pages/Quiz";
import LearningZone from "./pages/LearningZone";
import LearningGamePage from "./pages/LearningGamePage";
import LearningProgress from "./pages/LearningProgress";
import AuthPage from "./pages/Auth";
import AccountPage from "./pages/Account";
import WritingChallenge from "./pages/WritingChallenge";
import WritingHistory from "./pages/WritingHistory";
import AdminPage from "./pages/Admin";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

function Router() {
  return <SiteLayout><Switch>
    <Route path="/" component={Home} />
    <Route path="/programs" component={Programs} />
    <Route path="/programs/:slug" component={ProgramDetail} />
    <Route path="/camps" component={Camps} />
    <Route path="/quiz" component={Quiz} />
    <Route path="/learning-zone" component={LearningZone} />
    <Route path="/learning-zone/progress" component={LearningProgress} />
    <Route path="/learning-zone/writing" component={WritingChallenge} />
    <Route path="/learning-zone/writing/history" component={WritingHistory} />
    <Route path="/learning-zone/game/:gameId" component={LearningGamePage} />
    <Route path="/learning-zone/games/:gameId" component={LearningGamePage} />
    <Route path="/about" component={About} />
    <Route path="/contact" component={Contact} />
    <Route path="/login" component={AuthPage} />
    <Route path="/signup" component={AuthPage} />
    <Route path="/forgot-password" component={AuthPage} />
    <Route path="/account" component={AccountPage} />
    <Route path="/account/children" component={AccountPage} />
    <Route path="/admin" component={AdminPage} />
    <Route path="/admin/:section" component={AdminPage} />
    <Route path="/404" component={NotFound} />
    <Route component={NotFound} />
  </Switch></SiteLayout>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><Router /></ThemeProvider></ErrorBoundary>;
}
