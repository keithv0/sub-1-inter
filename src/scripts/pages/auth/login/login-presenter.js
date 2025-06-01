import { userLogin, userRegister } from "../../../data/auth-api";
import { setAuthData } from "../../../utils/auth";

export default class LoginPresenter {
  #model;
  #view;

  constructor({ view }) {
    this.#view = view;
  }

  async loginUser(userData) {
    try {
      const response = await userLogin(userData);
      if (response.error) {
        this.#view.showLoginError(response.message);
      } else {
        const loginResult = response.loginResult;
        setAuthData({
          token: loginResult.token,
        });
        console.log('LOGIN BERHASIL!');
        this.#view.navigateToHomepage();
      }
    } catch (error) {
      console.log(error);
      this.#view.showLoginError('Terjadi kesalahan saat login!');
    }
  }
}
