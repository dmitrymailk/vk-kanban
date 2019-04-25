import React, { Component } from "react";
import "./normalize.css";
import "./style.sass";
import Sortable from "sortablejs";

let cards = [
  {
    id: 1,
    text: "Пройти курс по React"
  },
  {
    id: 2,
    text: "Отметить день рождения"
  },
  {
    id: 3,
    text: "Записаться на курсы английского языка, чтобы уехать жить в Лондон"
  },
  {
    id: 4,
    text: "Сделать бекенд своего сайта на node.js"
  },
  {
    id: 5,
    text: "Собрать портфолио"
  },
  {
    id: 6,
    text: "Написать первую статью в блог"
  },
  {
    id: 7,
    text:
      "Записаться в мотошколу. Хотя немного страшновато, конечно. Друзья и родители против, но очень хочется. Но кого я обманываю, уже 2 года решаюсь на этот шаг 😢 Еще и друзья будут хрустиком называть. В общем, хотя бы подумать над этим."
  },
  {
    id: 8,
    text: "Нет, я серьезный человек, иду в мотошколу. Записываюсь!"
  }
];

class App extends Component {
  constructor() {
    super();
    this.state = {
      lists: [
        {
          listName: "План на месяц",
          id: 0,
          cards: [...cards]
        },
        {
          listName: "План на день",
          id: 1,
          cards: [
            {
              id: 0,
              text: "Записаться на курс по React"
            },
            {
              id: 1,
              text: "Забронировать тир на субботу"
            },
            {
              id: 2,
              text: "Накидать тем для статей в блог"
            }
          ]
        }
      ],
      addNew: false,
      idList: 0
    };

    this.addNewCard = this.addNewCard.bind(this);
    this.addTextCard = this.addTextCard.bind(this);
    this.addNewList = this.addNewList.bind(this);
    this.addNewListName = this.addNewListName.bind(this);
  }

  componentDidMount() {
    let example2Left = document.querySelectorAll(".list-cards__cards")[0],
      example2Right = document.querySelectorAll(".list-cards__cards")[1];
    new Sortable(example2Left, {
      group: "shared", 
      animation: 300
    });

    new Sortable(example2Right, {
      group: "shared",
      animation: 300
    });
  }

  addNewCard(e) {
    let parent = e.target.parentNode;
    this.setState({
      addNew: true
    });
    if ("list-cards__new" === parent.className) {
      parent = parent.parentNode;
    }
    if ("kanban__list-cards" === parent.className) {
      let listCards = parent.childNodes[1];
      let textarea = document.createElement("textarea");
      textarea.className = "list-cards__input";
      textarea.placeholder = "Введите название карточки";

      let addCard = document.createElement("div");
      let addCardButton = document.createElement("button");
      let addCardClose = document.createElement("img");
      addCardButton.textContent = "Добавить карточку";
      addCardClose.setAttribute(
        "src",
        "http://web-citizen.ru/game-is-work/api__v_2/vk/cross.png"
      );

      addCard.className = "list-cards__new-button";
      addCardButton.className = "new-button__accept";
      addCardClose.className = "new-button__close";

      addCard.appendChild(addCardButton);
      addCard.appendChild(addCardClose);
      parent.appendChild(addCard);

      this.setState({
        idList: parent.dataset.id
      });

      textarea.onkeypress = this.addTextCard;
      addCardButton.onclick = this.addTextCard;
      addCardClose.onclick = () => {
        let addButton = document.querySelector(".list-cards__new-button");
        let input = document.querySelector(".list-cards__input");
        addButton.remove();
        input.remove();
      };
      listCards.appendChild(textarea);
    }
  }

  addTextCard(e) {
    let input = document.querySelector(".list-cards__input");
    let inputText = `${document.querySelector(".list-cards__input").value}`;
    let id = this.state.idList;
    let addButton = document.querySelector(".list-cards__new-button");

    if (
      (e.key === "Enter" ||
        e.target.className.includes("new-button__accept")) &&
      inputText.replace(/\s/g, "").length > 0
    ) {
      let cards = this.state.lists;
      let idCard = cards[id].length + 1;
      cards[id].cards.push({
        text: inputText,
        id: idCard
      });

      input.remove();
      addButton.remove();
      this.setState({
        lists: cards
      });
    }
  }

  addNewList() {
    let lists = document.querySelector(".kanban");
    let addList = document.createElement("div");
    let addListInput = document.createElement("textarea");
    let addListButton = document.createElement("div");
    let addListClose = document.createElement("img");
    addListButton.textContent = "Добавить колонку";
    addListClose.setAttribute(
      "src",
      "http://web-citizen.ru/game-is-work/api__v_2/vk/cross.png"
    );

    addList.className = "kanban__addList";
    addListInput.className = "kanban__addList-input";
    addListInput.placeholder = "Введите название колонки";
    addListButton.className = "kanban__addList-button";
    addListClose.className = "kanban__addList-close";

    addList.appendChild(addListInput);
    addList.appendChild(addListButton);
    addList.appendChild(addListClose);

    addListClose.onclick = () => addList.remove();
    addListButton.onclick = this.addNewListName;
    addListInput.onkeypress = this.addNewListName;

    let item = lists.lastChild;
    lists.insertBefore(addList, item);
  }

  addNewListName(e) {
    let addNewList = document.querySelector(".kanban__addList");
    let addListInput = `${
      document.querySelector(".kanban__addList-input").value
    }`;
    if (
      (e.key === "Enter" ||
        e.target.className.includes("kanban__addList-button")) &&
      addListInput.replace(/\s/g, "").length > 0
    ) {

      let lists = this.state.lists;
      let id = lists.length;
      lists.push({
        listName: addListInput,
        id: id,
        cards: []
      });
      addNewList.remove();
      this.setState({
        lists: lists
      });

      let list = document.querySelectorAll(".list-cards__cards");
      //  console.log(list);
      new Sortable(list[list.length - 1], {
        group: "shared",
        animation: 300
      });
    }
  }

  render() {
    return (
      <div className="kanban">
        {this.state.lists.map(item => {

          return (
            <div className="wrapper-list" key={item.id}>
              <div className="kanban__list-cards" data-id={item.id}>
                <div className="list-cards__title">
                  <span className="list-cards__title-text">
                    {item.listName}
                  </span>
                </div>

                <div className="list-cards__cards">
                  {item.cards.map(item => {
                    return (
                      <div
                        className="list-cards__cards-card"
                        key={item.id}
                        onDrag={this.stylingFantomCard}
                      >
                        <span className="card__title">{item.text}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="list-cards__new" onClick={this.addNewCard}>
                  <svg
                    className="list-cards__new-img"
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14.1412 6.64122H8.35878V0.858779C8.35878 0.400763 7.95802 0 7.5 0C7.04198 0 6.64122 0.400763 6.64122 0.858779V6.64122H0.858779C0.400763 6.64122 0 7.04198 0 7.5C0 7.95801 0.400763 8.35878 0.858779 8.35878H6.64122V14.1412C6.64122 14.5992 7.04198 15 7.5 15C7.95802 15 8.35878 14.5992 8.35878 14.1412V8.35878H14.1412C14.5992 8.35878 15 7.95801 15 7.5C15 7.04198 14.5992 6.64122 14.1412 6.64122Z"
                      fill="#6B808C"
                    />
                  </svg>
                  <span className="list-cards__new-text" src="" alt="">
                    Добавить еще одну карточку
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        <div className="wrapper-list">
          <div className="kanban__list-cards" onClick={this.addNewList}>
            <div className="list-cards__new">
              <svg
                className="list-cards__new-img"
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M14.1412 6.64122H8.35878V0.858779C8.35878 0.400763 7.95802 0 7.5 0C7.04198 0 6.64122 0.400763 6.64122 0.858779V6.64122H0.858779C0.400763 6.64122 0 7.04198 0 7.5C0 7.95801 0.400763 8.35878 0.858779 8.35878H6.64122V14.1412C6.64122 14.5992 7.04198 15 7.5 15C7.95802 15 8.35878 14.5992 8.35878 14.1412V8.35878H14.1412C14.5992 8.35878 15 7.95801 15 7.5C15 7.04198 14.5992 6.64122 14.1412 6.64122Z"
                  fill="#6B808C"
                />
              </svg>
              <span className="list-cards__new-text" src="" alt="">
                Добавить еще одну колонку
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
