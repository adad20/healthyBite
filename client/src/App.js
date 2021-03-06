import React, { Fragment, useEffect } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Landing from './components/Landing/Landing';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Profile from './components/Profile/Profile';
import Checkout from './components/Checkout/Checkout';
import Alert from './components/Layout/Alert';
import PrivateRoute from './components/routing/PrivateRoute';
import CreateProfile from './components/profile-form/CreateProfile';
import EditProfile from './components/profile-form/EditProfile';
import AdminDashboard from './components/Admin/AdminDashboard/AdminDashboard';
import CreateProduct from './components/Admin/productForm/CreateProduct';
import EditProduct from './components/Admin/productForm/EditProduct';
import Success from './components/Checkout/Success/Success';
import ManageOrders from './components/Admin/ManageOrders/ManageOrders';
// Redux
import { Provider } from 'react-redux';
import store from './store';
import{ loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

if(localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
      <Fragment>
        <Navbar />
        <Route exact path='/' component={Landing} />
        <section>
          <Alert />
          <Switch>
            <Route exact path='/login' component={Login} />
            <Route exact path='/register' component= { Register } />
            <PrivateRoute exact path='/profile' component= { Profile } />
            <PrivateRoute exact path='/create-profile' component= { CreateProfile } />
            <PrivateRoute exact path='/edit-profile' component= { EditProfile } />
            <PrivateRoute exact path='/checkout' component= { Checkout } />
            <PrivateRoute exact path='/admin/dashboard' component ={ AdminDashboard } />
            <PrivateRoute exact path='/admin/createproduct' component={ CreateProduct } />
            <PrivateRoute exact path='/admin/editProduct' component={ EditProduct } />
            <PrivateRoute exact path='/admin/manageorders' component={ ManageOrders } />
            <PrivateRoute exact path='/payment/success' component={ Success } />
          </Switch>
        </section>
      </Fragment>
      </Router>
    </Provider>
    
    
  );
}

export default App;
