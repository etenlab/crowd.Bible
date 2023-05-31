import Login from '../data-objects/Login';

class LoginData {
  validLoginData() {
    const logindata = Login;
    logindata.email = 'AutomationUser@mailinator.com';
    logindata.password = 'automation@123';
    return logindata;
  }
}

export default new LoginData();
