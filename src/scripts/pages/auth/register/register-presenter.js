import { userLogin, userRegister } from "../../../data/auth-api";


export default class RegisterPresenter {
  #model;
  #view;

  constructor({ view }) {
    // this.#model = AuthModel;
    this.#view = view;
  }

  async registerUser(userData) {
    try {
      const response = userRegister(userData);
      if (response.error) {
        this.#view.showRegisterError(response.message);
      } else {
        console.log('REGISTER BERHASIL!');
        userLogin();
      }
    } catch (error) {
      console.log('Error di Register Presenter');
    }
  }
}
