class BaseComponent {
  constructor(selector, showLoader = true, showErorState = true) {
    this.showLoader = showLoader;
    this.showErorState = showErorState;
    this.selector = selector;
    }

  set selector(selector) {
    const element = document.getElementById(selector);
    if(!element) {
      if(this.showErorState)
        this.renderError('Не указан селектор');
      throw new ComponentError();
    } else {
      this._selector = element;
    }
  }

  get selector() {
    return this._selector;
  }

  /**
   * Функция запроса
   * @returns
   */
  async fetch() {
    const rand = Math.floor(Math.random() * 2);
    await wait(3000);
        return {
          status: [200, 400][rand],
          data: '<div style="margin: 36px;">Контент загружен</div>'
        };
  }

  /**
   * Функция получения и отрисовка контента
   */
  async getElement() {
    this.renderLoader(true);
    await this.fetch().then(response => {
      if(response.status === 200) {
        this.selector.innerHTML = response.data;
      } else if (response.status === 400) {
        if(this.showErorState)
          this.renderError('Ошибка загрузки, попробуйте еще раз', true);
        this.renderLoader(false);
        throw new ServerError();
      }
    });
    this.renderLoader(false);
  }

  /**
   * Отрисовка загрузчика
   * @param {*} status
   */
  renderLoader(status = false) {
    let loader = document.querySelector('.loader');
    if(!loader) {
      loader = document.createElement('div');
      const spiner = document.createElement('div');
      const body = document.querySelector('body');

      
      loader.classList.add('loader');
      spiner.classList.add('spinner-border');


      loader.style.position = 'absolute';
      loader.style.top = '50%';
      loader.style.left = '50%';


      loader.append(spiner);
      body.append(loader);
    }
    if(!status || !this.showLoader) {
      loader.style.display = "none";
    } else {
      loader.style.display = "block";
    }
  }

  /**
   * Отрисовка ошибки
   * @param {*} text
   * @param {*} btn
   */
  renderError(text, btn = false) {
    const body = document.querySelector('#error');
    const errorCard = document.createElement('div');
    const errorBox = document.createElement('div');
    const txt =  document.createElement('p');
    
    body.innerHTML = '';
    
    errorCard.classList.add('card', 'border-danger');
    errorBox.classList.add('card-body');
    txt.classList.add('card-text');


    txt.textContent = text;

    errorCard.append(errorBox);
    errorBox.append(txt);
    if(btn) {
      const button = document.createElement('a');

      button.classList.add('btn', 'btn-primary');

      button.textContent = 'Загрузить';

      errorBox.append(button);

      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.getElement();
        body.innerHTML = '';
      });
    }
    body.append(errorCard);
  }

  /**
   * Функция инициализации приложения
   * @param {} selector
   */
  static async initApp(selector, loader, error) {
    try {
      const App =  new BaseComponent(selector, loader, error);
      App.getElement();
    } catch (e) {
      console.log(e);
    }
  }
}

/**
 * Функция эмуляция запроса
 * @param {*} ms
 * @returns
 */
function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

/**
 * Класс ошибки селектора
 */
class ComponentError extends Error {
  constructor(fieldErrors) {
    super('Ошибка получения элемента по селектору');
    this.fieldErrors = fieldErrors;
  }
}

/**
 * Класс ошибки ответа сервера
 */
 class ServerError extends Error {
  constructor(fieldErrors) {
    super('Ошибка получения данных с сервера');
    this.fieldErrors = fieldErrors;
  }
}


class AddToCardComponent extends BaseComponent {
  constructor(selector, showLoader, showErorState) {
    super(selector, showLoader, showErorState);
    this.counter = 0;
  }


  set counter(counter) {
    if(counter<0) {
      this._counter = 0;
    } else {
      this._counter = Number(counter);
    }
  }

  get counter() {
    return this._counter;
  }

  /**
   * Функция инициализации приложения
   * @param {} selector
   */
   static async initApp(selector, loader, error) {
    try {
      const App =  new AddToCardComponent(selector, loader, error);
      App.getElement();
    } catch (e) {
      console.log(e);
    }
  }
  /**
 * Функция получения и отрисовка контента
 */
  async getElement() {
    this.renderLoader(true);
    await this.fetch().then(response => {
      if(response.status === 200) {
        this.counter = response.data;
        this.renderCounter(this.counter);
      } else if (response.status === 400) {
        if(this.showErorState)
          this.renderError('Ошибка загрузки счетчика, попробуйте еще раз', true);
        this.renderLoader(false);
        throw new ServerError();
      }
    });
    this.renderLoader(false);
  }

  /**
   * Функция запроса
   * @returns
   */
   async fetch() {
    const rand = Math.floor(Math.random() * 2);
    const num = Math.floor(Math.random() * 10) - 4;
    await wait(3000);
        return {
          status: [200, 400][rand],
          data: num,
        };
  }

  renderCounter() {
    const box = document.createElement('div');
    box.classList.add('btn-group');
    if(this.counter > 0) {
      for(let i=0; i<3; i++) {
        let inp = '';
        switch (i) {
          case 0:
            inp = this.createBtn('-');
            inp.addEventListener('click', (e) => {
              this.counter--;
              this.renderCounter();
            });
            break;
          case 1:
            inp = this.createInput(this.counter);
            break;
          case 2:
            inp = this.createBtn('+');
            inp.addEventListener('click', (e) => {
              this.counter++;
              this.renderCounter();
            });
            break;
        }

        box.append(inp);
      }
    } else {
      const btn = this.createBtn('Добавить в корзину');
      btn.addEventListener('click', e => {
        this.counter++;
        this.renderCounter();
      })
      box.append(btn);
    }

    const body = document.querySelector('body');
    this.selector.innerHTML = '';
    body.style.margin = '36px';
    this.selector.append(box);
    body.append(this.selector);
  }

  createBtn(text) {
    const btn =  document.createElement('button');
    btn.classList.add('btn', 'btn-primary');
    btn.textContent = text;
    return btn;
  }

  createInput(num) {
    const inp =  document.createElement('input');
    inp.value = num;
    return inp;
  }

}
