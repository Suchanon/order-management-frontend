import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import OrdersList from './pages/OrdersList';
// import OrderForm from './pages/OrderForm';
// import  OrdersComponent  from "./todo"
import  OrderList  from "./components/OrderList"
import  CreateOrder  from "./components/CreateOrder"
const App = () => {
  return (
    <div>
          <CreateOrder/>
          <div>-------------------------</div>
          <OrderList/>
    </div>

  );
};

export default App;