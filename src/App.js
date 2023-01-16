import Home from "./pages/Home";
import "../src/styles/App.scss"
import { Routes, Route } from "react-router-dom";
import Customers from "./pages/Customers";
import Customer from "./pages/Customer";
import Transfer from "./pages/Transfer";
import Transactions from "./pages/Transactions";



function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/customers" element={<Customers/>}/>
        <Route path="/customer/:name" element={<Customer/>}/>
        <Route path="/transfer" element={<Transfer/>}/>
        <Route path="/transactions" element={<Transactions/>}/>
      </Routes>
    </div>
  );
}

export default App;
