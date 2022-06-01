export default class Login {
  constructor(container, server) {
    this.server = server;
    this.container = container;
    this.login = this.login.bind(this);
    this.showError = this.showError.bind(this);
    this.removeError = this.removeError.bind(this);
    this.sends = this.container.querySelector('[data-sends="modal"]');
    this.name = this.container.querySelector('[data-id="name"]');
  }

  connect() {
    this.sends.addEventListener('click', this.login);
  }

  login(e) {
    e.preventDefault();
    if (this.name.value === '') {
      this.showError({ reason: 'Укажите логин' });
      return;
    }

    this.socket = new WebSocket(this.server);

    this.socket.addEventListener('open', () => {
      this.socket.send(JSON.stringify({ event: 'login', message: this.name.value }));
    });

    this.socket.addEventListener('message', (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.event === 'connect') {
        this.clientsList = msg.message;
        this.container.dispatchEvent(new Event('connect'));
      }
    });

    this.socket.addEventListener('close', this.showError);

    this.socket.addEventListener('error', (evt) => {
      console.error(evt);
    });
  }

  showError(evt) {
    const error = document.createElement('div');
    error.classList.add('chat_login_error');
    error.innerText = evt.reason;
    this.container.append(error);
    error.style.left = `${this.name.offsetLeft + this.name.offsetWidth / 2 - error.offsetWidth / 2}px`;
    error.style.top = `${this.name.offsetTop + this.name.offsetHeight}px`;

    this.name.addEventListener('focus', this.removeError);
  }

  removeError() {
    this.name.value = '';
    const error = this.container.querySelector('.chat_login_error');
    if (error) {
      error.remove();
    }
  }

  closeForm() {
    this.container.remove();
  }
}
