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