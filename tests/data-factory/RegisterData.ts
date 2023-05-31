import Register from '../data-objects/Register';

class RegisterData {
  validRegisterData() {
    const registerData = Register;
    const x = Math.random() * 100;
    registerData.email = 'AutomationUser' + x + '@mailinator.com';
    registerData.userName = 'Automation User';
    registerData.password = 'automation@123';
    registerData.repeatPassword = 'automation@123';
    return registerData;
  }

  registerDataWithoutEmail() {
    const registerData = Register;
    registerData.email = '';
    registerData.userName = 'Automation User';
    registerData.password = 'automation@123';
    registerData.repeatPassword = 'automation@123';
    return registerData;
  }

  registerDataWithoutUserName() {
    const registerData = Register;
    registerData.email = 'AutomationUser@mailinator.com';
    registerData.userName = '';
    registerData.password = 'automation@123';
    registerData.repeatPassword = 'automation@123';
    return registerData;
  }

  registerDataWithoutPassword() {
    const registerData = Register;
    registerData.email = 'AutomationUser@mailinator.com';
    registerData.userName = 'Automation User';
    registerData.password = '';
    registerData.repeatPassword = 'automation@123';
    return registerData;
  }

  registrationDataWithoutRepeatPassword() {
    const registerData = Register;
    registerData.email = 'AutomationUser@mailinator.com';
    registerData.userName = 'Automation User';
    registerData.password = 'automation@123';
    registerData.repeatPassword = '';
    return registerData;
  }

  registerDataWithInvalidEmailFormat() {
    const registerData = Register;
    registerData.email = 'AutomationUser';
    registerData.userName = 'Automation User';
    registerData.password = 'automation@123';
    registerData.repeatPassword = 'automation@123';
    return registerData;
  }

  registerDataWithDiffPassAndRepeatPass() {
    const registerData = Register;
    registerData.email = 'AutomationUser@mailinator.com';
    registerData.userName = 'Automation User';
    registerData.password = 'tester';
    registerData.repeatPassword = 'automation@123';
    return registerData;
  }

  registerDataWithExistingUser() {
    const registerData = Register;
    registerData.email = 'AutomationUser@mailinator.com';
    registerData.userName = 'Automation User';
    registerData.password = 'automation1234';
    registerData.repeatPassword = 'automation1234';
    return registerData;
  }
}

export default new RegisterData();
