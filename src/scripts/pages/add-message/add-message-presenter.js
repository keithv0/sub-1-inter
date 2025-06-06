import { addNewStory } from "../../data/story-api";

export default class AddMessagePresenter {
  #view;

  constructor({ view }) {
    this.#view = view;
  }

  async initializeCamera() {
    try {
      await this.#view.requestCameraAccess();
    } catch (error) {
      console.error('Error initializing camera: ', error);
      this.#handleCameraError(error);
    }
  }

  #handleCameraError(error) {
    let message = 'Akses kamera ditolak atau kamera tidak ditemukan.';
    if (
      error.name === 'NotFoundError' ||
      error.name === 'DevicesNotFoundError'
    ) {
      message = 'Tidak ada kamera yang ditemukan.';
    } else if (
      error.name === 'NotAllowedError' ||
      error.name === 'PermissionDeniedError'
    ) {
      message =
        'Akses ke kamera tidak diizinkan. Periksa pengaturan browser Anda.';
    }
    this.#view.showCameraError(message);
  }

  capturePhoto() {
    if (!this.#view.isCameraStreamActive()) {
      this.#view.showCameraError(
        'Stream kamera tidak aktif untuk mengambil foto.'
      );
      return null;
    }
    return this.#view.captureCameraFrame();
  }

  handleFileInput(file) {
    if (file) {
      this.#view.stopCameraStream();
    }
  }

  async getCurrentLocation() {
    try {
      const position = await this.#view.requestCurrentLocation();
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      
      let errorMessage = 'Tidak dapat mengambil lokasi saat ini';
      if (error.name === 'PermissionDeniedError' || error.code === 1) {
        errorMessage = 'Akses lokasi ditolak. Periksa pengaturan browser Anda.';
      } else if (error.name === 'PositionUnavailableError' || error.code === 2) {
        errorMessage = 'Lokasi tidak tersedia saat ini.';
      } else if (error.name === 'TimeoutError' || error.code === 3) {
        errorMessage = 'Waktu habis saat mencari lokasi.';
      }
      
      throw new Error(errorMessage);
    }
  }

  async submitStory(formData) {
    const description = formData.get('description');
    const photoFile = formData.get('photo');
    const lat = formData.get('lat');
    const lon = formData.get('lon');

    if (!description || !photoFile) {
      this.#view.showSubmitError('Deskripsi dan foto harus diisi!');
      this.#view.hideLoadingIndicatorForSubmit();
      return;
    }

    if (!lat || !lon) {
      this.#view.showSubmitError('Lokasi harus dipilih dari peta!');
      this.#view.hideLoadingIndicatorForSubmit();
      return;
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    
    if (isNaN(latitude) || isNaN(longitude)) {
      this.#view.showSubmitError('Koordinat lokasi tidak valid!');
      this.#view.hideLoadingIndicatorForSubmit();
      return;
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      this.#view.showSubmitError('Koordinat lokasi berada di luar jangkauan yang valid!');
      this.#view.hideLoadingIndicatorForSubmit();
      return;
    }

    const submitFormData = new FormData();
    submitFormData.append('description', description);
    submitFormData.append('photo', photoFile);
    submitFormData.append('lat', latitude.toString());
    submitFormData.append('lon', longitude.toString());

    console.log('Submitting story with coordinates:', { lat: latitude, lon: longitude });

    try {
      const response = await addNewStory(submitFormData);
      if (response.error) {
        this.#view.showSubmitError(response.message || 'Gagal mengunggah cerita.');
      } else {
        this.#view.showStoryAddedMessage();
        this.#view.stopCameraStream();
        this.#view.navigateToHomepage();
      }
    } catch (error) {
      console.error('Error submitting story:', error);
      this.#handleSubmitError(error);
    } finally {
      this.#view.hideLoadingIndicatorForSubmit();
    }
  }

  #handleSubmitError(error) {
    if (error.response && error.response.status === 413) {
      this.#view.showSubmitError(
        'Ukuran file masih terlalu besar untuk server.'
      );
    } else if (error.response && error.response.status === 401) {
      this.#view.showSubmitError(
        'Sesi login Anda telah berakhir. Silakan login kembali.'
      );
    } else if (error.response && error.response.status === 400) {
      this.#view.showSubmitError(
        'Data yang dikirim tidak valid. Periksa kembali form Anda.'
      );
    } else if (error.message && error.message.includes('network')) {
      this.#view.showSubmitError(
        'Masalah koneksi internet. Periksa koneksi Anda dan coba lagi.'
      );
    } else {
      this.#view.showSubmitError(
        'Terjadi kesalahan saat mengunggah cerita. Coba lagi.'
      );
    }
  }

  destroy() {
    this.#view.stopCameraStream();
  }
}