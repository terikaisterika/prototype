//массив дней недели
let week = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
//массив с перечислением всех месяцев
let months = [
  'январь',
  'февраль',
  'март',
  'апрель',
  'май',
  'июнь',
  'июль',
  'август',
  'сентябрь',
  'октябрь',
  'ноябрь',
  'декабрь',
];
//Массив событий, в которых не желательно брать отпуск
const events = [
  {
    partDate: ['01.13'],
    comment: 'Планерка',
  },
  { partDate: ['02.03'], comment: 'Подведение итогов' },
  {
    partDate: '03.01',
    comment: 'Планирование следующего квартала',
  },
];
/**Массив с объектами гос. праздников */
const publicHolidays = [
  {
    partDate: [
      '01.01',
      '01.02',
      '01.03',
      '01.04',
      '01.05',
      '01.06',
      '01.07',
      '01.08',
    ],
    comment: 'Выходные по случаю Нового года',
  },
  { partDate: ['02.23'], comment: '23 февраля' },
  {
    partDate: '03.08',
    comment: '8 марта',
  },
];
/**
 * Информация по офисам
 * numberOfJobs - количество рабочих мест
 * countDaysInOffice количество дней, которые сотрудник должен отходить в офис в течение месяца
 */
const offices = [
  {
    id: 0,
    name: 'Офис №1',
    numberOfJobs: 1,
    countDaysInOffice: 10,
  },
  {
    id: 1,
    name: 'Офис №2',
    numberOfJobs: 3,
    countDaysInOffice: 10,
  },
];
/**
 * Массив сотрудников
 */
const staff = [
  {
    id: 0,
    fio: {
      firstName: 'Иван',
      lastName: 'Иванов',
      patronymic: 'Тестович',
    },
    schedule: {
      work: [],
      vacation: ['2025.01.11', '2025.01.12', '2025.01.13'],
      restVacation: 28,
    },
    countDaysInOffice: 0,
    office: 'Офис №1',
    countVacationDays: 28,
    workDates: {
      dateEmployment: '2024.05.03',
      dateDismissal: '',
    },
  },
  {
    id: 1,
    fio: {
      firstName: 'Анна',
      lastName: 'Тестова',
      patronymic: 'Тестовна',
    },
    schedule: {
      work: [],
      vacation: [],
    },
    countDaysInOffice: 3,
    office: 'Офис №2',
    countVacationDays: 28,
    workDates: {
      dateEmployment: '2025.05.03',
      dateDismissal: '',
    },
  },
  {
    id: 2,
    fio: {
      firstName: 'Игорь',
      lastName: 'Копалов',
      patronymic: 'Тестович',
    },
    schedule: {
      work: [],
      vacation: [],
    },
    countDaysInOffice: 1,
    office: 'Офис №1',
    countVacationDays: 28,
    workDates: {
      dateEmployment: '2025.05.03',
      dateDismissal: '',
    },
  },
  {
    id: 3,
    fio: {
      firstName: 'Елена',
      lastName: 'Сидорова',
      patronymic: 'Александровна',
    },
    schedule: {
      work: [],
      vacation: [],
    },
    countDaysInOffice: 0,
    office: 'Офис №1',
    countVacationDays: 28,
    workDates: {
      dateEmployment: '2024.05.03',
      dateDismissal: '',
    },
  },
];
//---------------------Функции----------------------------
//--------------------Работа с интерфейсом-----------------
//Получение общего количества дней в месяце
function daysInMonth(month, year) {
  return new Date(parseInt(year), parseInt(month) + 1, 0).getDate();
}

//Работаем с данным html
const byId = (id) => document.getElementById(id);
const monthSelect = byId('month');
const yearSelect = byId('year');
const officeSelect = byId('office');
const creatingScheduleButton = byId('creatingSchedule');
// обновляем количество дней в месяце на html
const updateMessage = () => {
  byId('message').innerText = daysInMonth(monthSelect.value, yearSelect.value);
};
//const arrayWeekDay = updateMessage();
updateMessage();
/**
 * Вывод внизу сообщений о проблемах настроек выходов сотрудников
 * информация дублирует инфу из алертов
 * @param {string[]} arrayErrors Массив ошибок 
 * чтобы пользователь мог скопировать и найти сотрудника по фамилии
 * @param {Object} dataHtml данные для работы с элементами html
 * @param {string} dataHtml.id id html элемента, в который будет вставляться новый div
 * @param {string} dataHtml.createdId id html, которое нужно будет вставлять в данный элемент
 * @param {string} header Текст, который будет отображаться в заголовке
 
 */
const updateErrors = (
  arrayErrors,
  dataHtml = { id: 'errors', createdId: 'child' },
  header = 'Проблемы распределения графика'
) => {
  if (!arrayErrors.length) return;

  let container = byId(dataHtml.id);
  let child = byId(dataHtml.createdId);
  if (child) child.remove();

  let div = document.createElement('div');
  div.setAttribute('id', dataHtml.createdId);
  container.appendChild(div);
  div.innerHTML = `<h3>${header} (${months[monthSelect.value]})</h3>`;
  arrayErrors.forEach((el) => {
    let containerMessages = document.createElement('p');
    containerMessages.innerText = el;
    div.appendChild(containerMessages);
  });
};

//привязка слушателя событий к выпадающим спискам
[monthSelect, yearSelect].forEach((domNode) => {
  domNode.addEventListener('change', updateMessage);
});

//Привязываем событию клика создание таблицы с расписанием.
creatingScheduleButton.addEventListener('click', createScheduleTable);

//--------------------Работа с логикой --------------------//
/**
 * Фильтрация сотрудников по офису
 * @param {number} idOffice id офиса
 * @param {} staff массив сотрудников, в котором нужна фильтрация
 * @returns
 */
function employeeFiltering(idOffice = 0, staff) {
  return staff.filter((employee) => employee.office === offices[idOffice].name);
}
/**
 * Получение ФИО сотрудника в формате Иванов И. И. (фамилия и первые буквы имени и отчества)
 * @param {*} employee
 * @returns
 */
function getFIO(employee) {
  let fio = `${employee.fio.lastName} ${employee.fio.firstName.substring(
    0,
    1
  )}. ${
    employee.fio.patronymic ? employee.fio.patronymic.substring(0, 1) : ''
  }.`;
  return fio;
}
/**
 * Получение дней из рабочих недель для всех,
 * т.е. без учета отпусков
 * @param {*} calendar результат работы функции createCalender
 */
function getWorkingDaysEveryone(calendar) {
  //Рабочие дни из каждой отдельной недели
  let weekArr = [];
  let previousIndex = 0;
  calendar.days.forEach((el, ind) => {
    if (el.weekDay === 'Пт') {
      weekArr.push(
        calendar.days
          .slice(previousIndex, ind + 1)
          .filter((el) => !el.publicHoliday && !el.weekend)
      );
      previousIndex = ind + 1;
    } else if (el.weekDay === 'Пн' && !calendar.days[ind + 4]) {
      weekArr.push(
        calendar.days
          .slice(ind)
          .filter((el) => !el.publicHoliday && !el.weekend)
      );
    }
  });
  console.log('weekArr in func: ', weekArr);
  return weekArr;
}
//Добавление гос.праздников
function addPublicHolidays(arrHolidays, arrMonth) {
  arrMonth.forEach((el) => {
    arrHolidays.forEach((holiday) => {
      if (holiday.partDate.includes(el.date.substring(5))) {
        el.comment = holiday.comment;
        el.publicHoliday = true;
      }
    });
  });
}

//Добавление событий (мероприятий) в календарь из массива событий
function addEvents(arrEvents, arrMonth) {
  arrMonth.forEach((el) => {
    arrEvents.forEach((event) => {
      if (event.partDate.includes(el.date.substring(5))) {
        el.comment = event.comment;
        el.event = true;
      }
    });
  });
}

/**
 * Добавление 0 впереди для дней месяца, чтобы отображалось "01", "02" в календаре
 * @param {string|number} num число дня месяца.
 * @returns {string}
 */
function addZeroInFront(num) {
  let resultNum = '';
  typeof num === 'number' ? (resultNum = String(num)) : (resultNum = num);
  resultNum.length === 2 || (resultNum = resultNum.padStart(2, '0'));
  return resultNum;
}

//Создание календаря. Предполагает разметку выходных и праздников
//Массив праздников нужно корректировать вручную согласно производственному календарю
function createCalender(month, year) {
  let countDaysInMonth = daysInMonth(month, year);

  //формирование данных для использования в функциях
  const daysOfMonth = {
    year: parseInt(year),
    month: addZeroInFront(String(parseInt(month) + 1)),
    monthInText: months[parseInt(month)],
    days: [],
  };

  // сбор массива с днями с расстановкой логических меток на выходных
  for (let i = 1; i <= countDaysInMonth; i++) {
    let dayInWeekend = new Date(parseInt(year), parseInt(month), i).getDay();
    let weekDay = week[dayInWeekend];
    day = {
      date: `${year}.${addZeroInFront(parseInt(month) + 1)}.${addZeroInFront(
        i
      )}`,
      weekDay: weekDay,
      weekend: dayInWeekend === 6 || dayInWeekend === 0 ? true : false,
      comment: '',
      publicHoliday: false,
      event: false,
      staff: [],
    };

    daysOfMonth.days.push(day);
  }
  //добавление гос. праздников
  addPublicHolidays(publicHolidays, daysOfMonth.days);
  addEvents(events, daysOfMonth.days);
  //добавление, сколько полных недель в месяце от понедельника до воскресенья
  daysOfMonth.fullWeeks = daysOfMonth.days
    .map((el) => el.weekDay)
    .filter((el) => el === 'Пн' || el === 'Вс')
    .join('')
    .match(/ПнВс/g).length;
  //добавление информации о количестве рабочих дней
  daysOfMonth.workDays = daysOfMonth.days.filter(
    (el) => !el.publicHoliday && !el.weekend
  ).length;
  return daysOfMonth;
}

// проверка сотрудников на отпуска и расставление отпусков todo
function vacationСheck(staff) {
  staff.forEach;
}

//------------------создание расписания сотрудников---------
/**
 * Фильтрация и создание расписания
 * @param {*} idOffice
 * @returns массив  сотрудников с расписанием, отфильтрованных по офису
 */
function createSchedule(idOffice = 0) {
  //вызов создание календаря на месяц
  let calendar = createCalender(monthSelect.value, yearSelect.value);
  // получаем общее количество недель без учета распределения по ПН - ВС
  let totalWeeksInMonth = Math.round(calendar.days.length / 7);
  //вычисляем сколько дней в неделю будет считаться
  // равномерным распределением для всех сотрудников.
  let workDaysInWeek = Math.round(
    offices[idOffice].countDaysInOffice / totalWeeksInMonth
  );
  //фильтрация сотрудников по офису
  let employeesAfterFilters = employeeFiltering(idOffice, staff);
  if (!employeesAfterFilters.length) {
    return 0;
  }
  // создание массива, который соберет сообщения о проблемах формирования графика

  let messages = [];
  //Рабочие дни из каждой отдельной недели
  let weekArr = getWorkingDaysEveryone(calendar);
  // получаем количество рабочих мест из офиса.
  let counterWorkPlace = offices[idOffice].numberOfJobs;
  // выставляем в начальное значение
  //  количество рабочих мест для дозаполнения
  let counterWorkPlaceRefilling = offices[idOffice].numberOfJobs;
  // Остатки для дозаполнения
  let leftoversReplenish = 0;
  employeesAfterFilters.forEach((employee, indEmployee) => {
    if (employee.countDaysInOffice > calendar.workDays) {
      messages.push(
        `Количество выходов в офис превышает количество рабочих дней у ${employee.fio.lastName} \n`
      );
    }

    // let officeDaysInWeek = Math.round(
    //   employee.countDaysInOffice / calendar.fullWeeks
    // );
    //--------------------

    // блок заполнения данных по сотруднику/
    //количество дней в офисе (уменьшаем, чтобы проверять
    // можно ли добавить определенному сотруднику еще один день в неделю.
    let counterDaysOffice = offices[idOffice].countDaysInOffice;
    for (let i = 0; i < weekArr.length; i++) {
      if (weekArr[i].length === 0) continue;

      for (let j = 0; j < weekArr[i].length; j++) {
        //if (weekArr[i][j].length === 0) continue;

        if (counterWorkPlace > 0 && counterDaysOffice > 0) {
          employee.schedule.work.push(weekArr[i][j].date);
          counterDaysOffice--;
          if (j === workDaysInWeek - 1) break;
        }
      }
    }
    counterWorkPlace--;

    if (
      counterDaysOffice > 0 &&
      employee.id > 0 &&
      counterWorkPlaceRefilling > 0
    ) {
      console.log('weekArr: ', weekArr);
      if (counterWorkPlaceRefilling === offices[idOffice].numberOfJobs) {
        leftoversReplenish = weekArr
          .flat()
          .flatMap((el) => el.date)
          .filter(
            (el) =>
              !employeesAfterFilters[indEmployee - 1].schedule.work.includes(el)
          );
      }
      console.log(
        'first value schedule.work: ',
        employeesAfterFilters[indEmployee - 1].schedule.work
      );
      console.log('leftoversReplenish: ', leftoversReplenish);
      leftoversReplenish.forEach((day) => {
        if (counterDaysOffice > 0) {
          employee.schedule.work.push(day);
          counterDaysOffice--;
        }
      });
      counterWorkPlaceRefilling--;
      counterDaysOffice > 0 &&
        messages.push(`Сотрудник ${getFIO(
          employee
        )} остался с нераспределенными офисными днями.
      Количество нераспределенных дней ${counterDaysOffice}. 
      Сотрудники по графику ниже (если есть) останутся без распределенных дней походов в офис`);
    }
  });
  //Проверка, нет ли еще среди отфильтрованных
  // Если есть сообщение о том, что у сотрудника недостаточно проставлено дней
  // для выхода в офис - создаем алерт
  if (messages.length > 0) {
    alert(messages);
    updateErrors(messages, { id: 'errors', createdId: 'messages' });
  }

  return employeesAfterFilters;
}
//-----------------создание расписание в виде таблицы---------
function createScheduleTable() {
  let errors = [];
  let office = offices.findIndex(
    (office) => office.id === Number(officeSelect.value)
  );

  let employeesAfterFilters = createSchedule(office);
  if (!employeesAfterFilters.length) {
    alert(
      `Сотрудники в офисе ${offices[office].name} не найдены. Проверьте данные`
    );
    return;
  }
  let calendar = createCalender(monthSelect.value, yearSelect.value);
  let table = document.createElement('table');
  table.createCaption().innerHTML = `График работы на месяц ${calendar.monthInText} ${calendar.year} года.</br> 
  Рабочие дни: ${calendar.workDays}. В месяце есть ${calendar.fullWeeks} недели с Пн по Вс.</br>
  Офис: ${offices[office].name}. Количество рабочих мест: ${offices[office].numberOfJobs}</br>
  Количество выходов в офис для каждого сотрудника: ${offices[office].countDaysInOffice}`;

  employeesAfterFilters.forEach((employee, indEmployee) => {
    let fio = getFIO(employee);
    let row;

    if (indEmployee === 0) {
      row = table.insertRow();
      row.insertCell().innerHTML = `ФИО сотрудника`; // добавим строку
    }
    let row2 = table.insertRow();
    row2.insertCell().innerHTML = fio;
    let cellTable;
    calendar.days.forEach((el, ind) => {
      if (indEmployee === 0) {
        row.insertCell().innerHTML = el.weekDay;
      }
      cellTable = row2.insertCell();

      cellTable.innerText = el.date.substring(8);
      if (el.publicHoliday) {
        cellTable.classList.add('holiday');
      } else if (el.event) {
        cellTable.classList.add('event');
        if (employee.schedule.work.includes(el.date)) {
          cellTable.classList.add('work_office');
          cellTable.innerText = cellTable.innerText + ' оф';
        }
      } else if (el.weekend) {
        cellTable.classList.add('weekend');
      } else {
        cellTable.classList.add('work');

        if (employee.schedule.work.includes(el.date)) {
          cellTable.classList.add('work_office');
          cellTable.innerText = cellTable.innerText + ' оф';
        }
      }
      if (employee.schedule.vacation.includes(el.date)) {
        if (el.event) {
          errors.push(
            `У сотрудника ${fio} отпуск в день мероприятия. Дата мероприятия ${el.date}`
          );
        }
        cellTable.classList.remove(
          'work_office',
          'weekend',
          'work',
          'event',
          'holiday'
        );
        if (cellTable.innerText.includes('оф')) {
          console.log('cellTable.innerText: ', cellTable.innerText);
          cellTable.innerText = cellTable.innerText.replace('оф', 'отп');
          console.log('cellTable.innerText: ', cellTable.innerText);
        } else {
          cellTable.innerText += ' отп';
        }
        cellTable.classList.add('vacation');
      }
      if (el.comment) {
        cellTable.setAttribute('title', el.comment);
      }
      cellTable.setAttribute('contenteditable', true);
    });
  });
  if (errors.length > 0) {
    alert(errors);
    updateErrors(
      errors,
      { id: 'vacation', createdId: 'childErrors' },
      'Проблема распределения отпусков'
    );
  }
  // Отобразим таблицу на странице
  document.body.appendChild(table);
  let container = byId('tables');
  let div = document.createElement('div');
  container.appendChild(div);
}
