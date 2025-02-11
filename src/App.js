import { BrowserRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/templatemo.css";
import Main from "./Main";
import { LanguageProvider } from "./LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="App">
          <Main />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
