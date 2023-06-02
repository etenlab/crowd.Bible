import RegisterDto from '../data-objects/RegisterDto';

class RegisterData {
  validRegisterData() {
    const registerData = RegisterDto;
    const x = Math.random() * 100;
    registerData.email = 'AutomationUser' + x + '@mailinator.com';
    registerData.userName = 'Automation User';
    registerData.password = 'automation@123';
    registerData.repeatPassword = 'automation@123';
    return registerData;
  }

  registerDataWithoutEmail() {
    const registerData = RegisterDto;
    registerData.email = '';
    registerData.userName = 'Automation User';
    registerData.password = 'automation@123';
    registerData.repeatPassword = 'automation@123';
    return registerData;
  }

  registerDataWithoutUserName() {
    const registerData = RegisterDto;
    registerData.email = 'AutomationUser@mailinator.com';
    registerData.userName = '';
    registerData.password = 'automation@123';
    registerData.repeatPassword = 'automation@123';
    return registerData;
  }

  registerDataWithoutPassword() {
    const registerData = RegisterDto;
    registerData.email = 'AutomationUser@mailinator.com';
    registerData.userName = 'Automation User';
    registerData.password = '';
    registerData.repeatPassword = 'automation@123';
    return registerData;
  }

  registrationDataWithoutRepeatPassword() {
    const registerData = RegisterDto;
    registerData.email = 'AutomationUser@mailinator.com';
    registerData.userName = 'Automation User';
    registerData.password = 'automation@123';
    registerData.repeatPassword = '';
    return registerData;
  }

  registerDataWithInvalidEmailFormat() {
    const registerData = RegisterDto;
    registerData.email = 'AutomationUser';
    registerData.userName = 'Automation User';
    registerData.password = 'automation@123';
    registerData.repeatPassword = 'automation@123';
    return registerData;
  }

  registerDataWithDiffPassAndRepeatPass() {
    const registerData = RegisterDto;
    registerData.email = 'AutomationUser@mailinator.com';
    registerData.userName = 'Automation User';
    registerData.password = 'tester';
    registerData.repeatPassword = 'automation@123';
    return registerData;
  }

  registerDataWithExistingUser() {
    const registerData = RegisterDto;
    registerData.email = 'AutomationUser@mailinator.com';
    registerData.userName = 'Automation User';
    registerData.password = 'automation1234';
    registerData.repeatPassword = 'automation1234';
    return registerData;
  }
}

export default new RegisterData();
