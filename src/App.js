import { Navigate } from "react-router-dom";
import useAuthStore from "./useAuthStore";

import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import BankAuth from "./components/BankAuth/BankAuth";
import Callback from "./components/Callback/Callback";
import Accounts from "./components/Accounts/Accounts";
import Transactions from "./components/Transactions/Transactions";
import Beneficiaries from "./components/Beneficiaries/Beneficiaries";
import DirectDebits from "./components/DirectDebits/DirectDebits";
import StandingOrders from "./components/StandingOrders/StandingOrders";
import Product from "./components/Product/Product";
import ScheduledPayments from "./components/ScheduledPayments/ScheduledPayments";
import TransferMoney from "./components/TransferMoney/TransferMoney";
import Redirect from "./components/Redirection/Redirection";
import ProcessTransaction from "./components/ProcessTransaction/ProcessTransaction";
import PaymentStatus from "./components/PaymentStatus/PaymentStatus";
import TransactionDetails from "./components/Transactions/TransactionDetails/TransactionDetails";
import FundConfirmation from "./components/FundConfirmation/FundConfirmation";
import Balances from "./components/Balances/Balances";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/bank_auth" element={
          <RestrictedRoute>
            <BankAuth />
          </RestrictedRoute>
        } />
        <Route path="/callback" element={
          <RestrictedRoute>
            <Callback />
          </RestrictedRoute>
        }/>
        <Route path="/account/:bank" element={
          <RestrictedRoute>
            <Accounts />
          </RestrictedRoute>
        } />
        <Route path="/:bank/accounts/:account_id/transactions" element={
          <RestrictedRoute>
            <Transactions />
          </RestrictedRoute>
        } />
        <Route path="/:bank/accounts/:account_id/beneficiaries" element={
          <RestrictedRoute>
            <Beneficiaries />
          </RestrictedRoute>
        } />
        <Route path="/:bank/accounts/:account_id/balances" element={
          <RestrictedRoute>
            <Balances />
          </RestrictedRoute>
        } />
        <Route path="/:bank/accounts/:account_id/direct-debits" element={
          <RestrictedRoute>
            <DirectDebits />
          </RestrictedRoute>
        } />
        <Route path="/:bank/accounts/:account_id/standing-orders" element={
          <RestrictedRoute>
            <StandingOrders />
          </RestrictedRoute>
        } />
        <Route path="/:bank/accounts/:account_id/product" element={
          <RestrictedRoute>
            <Product />
          </RestrictedRoute>
        } />
        <Route path="/:bank/accounts/:account_id/scheduled-payments" element={
          <RestrictedRoute>
            <ScheduledPayments />
          </RestrictedRoute>
        } />
        <Route path="/transfer-money" element={
          <RestrictedRoute>
            <TransferMoney />
          </RestrictedRoute>
        } />
        <Route path="/redirect/:bank" element={
          <RestrictedRoute>
            <Redirect />
          </RestrictedRoute>
          } />
        <Route path="/process-transaction/:bank" element={<ProcessTransaction />} ></Route>
        <Route path="/payment-status/:bank/:payment_id" element={<PaymentStatus />}></Route>
        <Route path="/:bank/accounts/:account_id/transactions/:TransactionId" element={<TransactionDetails />} ></Route>
        <Route path="/fund-confirmation" element={<FundConfirmation />} ></Route>
      </Routes>
      
    </BrowserRouter>
  );
}

function RestrictedRoute(obj){
  const { isLoggedIn } = useAuthStore();

  if(isLoggedIn){
    return obj.children
  } else{
    return <Navigate to="../login" state={{link:obj.urlpath}} ></Navigate>
  }
}

export default App;
