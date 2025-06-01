import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FormPage from "./pages/FormPage";
import TablePage from "./pages/TablePage";
import useItemStore from "./data/useItemStore";
import SidePanel from "./pages/SideMenu";

function App() {
  const itemStore = useItemStore();

  return (
    <Router>
      <SidePanel>
        <Routes>
          <Route path="/" element={<FormPage {...itemStore} />} />
          <Route path="/table" element={<TablePage {...itemStore} />} />
        </Routes>
      </SidePanel>
    </Router>
  );

}

export default App;