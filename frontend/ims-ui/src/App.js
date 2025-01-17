import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen";
import Layout from "./components/Layout";
import Documents from "./components/Documents";
import FillDocuments from "./components/FillDocuments";
import Evaluation from "./components/Evaluation";
import MessagesPage from "./components/MessagesPage";
import MakeSubmission from "./components/MakeSubmission";
import Submissions from "./components/Submissions";
import SecretarySubmissions from "./components/SecretarySubmissions";
import EvaluationForm from "./components/EvaluationForm";
import Admin from "./components/Admin";
import Internships from "./components/Internships";
import SendEvaluationLink from "./components/SendEvaluationLink";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/evaluation-form" element={<EvaluationForm />} />
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<LoginScreen />} />
                <Route path="/register" element={<RegisterScreen />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/std-documents" element={<FillDocuments />} />
                <Route path="/evaluation" element={<Evaluation />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/make-submission" element={<MakeSubmission />} />
                <Route path="/submissions" element={<Submissions />} />
                <Route
                  path="/sec-submissions"
                  element={<SecretarySubmissions />}
                />
                <Route
                  path="/send-evaluation-form"
                  element={<SendEvaluationLink />}
                />
                <Route path="/users" element={<Admin />} />
                <Route path="/internships" element={<Internships />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
