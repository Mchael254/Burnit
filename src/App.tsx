import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Landing from "./pages/landing";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Wallet from "./pages/wallet";
import VerticalTabs from "./pages/tabs";

const App = () => (
  <BrowserRouter>
    <Routes>
    
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      <Route path="/wallet" element={<Wallet/>} />
      <Route path="/tabs" element={<VerticalTabs/>}/>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
