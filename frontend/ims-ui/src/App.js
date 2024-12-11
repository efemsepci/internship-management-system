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

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/std-documents" element={<FillDocuments />} />
          <Route path="/evaluation" element={<Evaluation />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/make-submission" element={<MakeSubmission />}></Route>
          <Route
            path="/submissions"
            element={<Submissions></Submissions>}
          ></Route>
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
