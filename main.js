const habits = document.querySelectorAll('.habit');
const themeBtm = document.querySelector('#theme');
const modalContainer = document.querySelector('.modal-container');
const habitContainer = document.querySelector('.habit-container');
const createHabitBnt = document.querySelector('.new-habit__add');
const newHabitTittle = document.querySelector('#title');
const icons = document.querySelectorAll('.icon');
const addBtn = document.querySelector('#add');
const cancelBtn = document.querySelector('#cancel');
const deletebtn = document.querySelector('#delete');
const contextMenu = document.querySelector('.context-menu');
let habitBeDeleted;

const storage = {
    saveTheme(value) {
        localStorage.setItem('habitsapp.theme', `${value}`);
    },
    checkTheme() {
        return localStorage.getItem('habitsapp.theme');
    },
    saveHabit(object) {
        const currentHabits = storage.getHabits();
        if (currentHabits === null || currentHabits === '') {
            localStorage.setItem('habitsapp.habits', JSON.stringify(object));
        }
        else {
            currentHabits.push(object);
            localStorage.setItem('habitsapp.habits', JSON.stringify(currentHabits));
        }
        // console.table(currentHabits);
    },
    getHabits() {
        let currentHabits;
        if (localStorage.getItem('habitsapp.habits') === null) {
            currentHabits = [];
        }
        else {
            currentHabits = JSON.parse(localStorage.getItem('habitsapp.habits'));
        }
        return currentHabits;

    },
    habitStatus(id) {
        const currentHabits = storage.getHabits();
        currentHabits.forEach(habit => {
            if (habit.id !== Number(id)) return;
            habit.completed === true ? habit.completed = false : habit.completed = true;
        });
        localStorage.setItem('habitsapp.habits', JSON.stringify(currentHabits));
    },
    deleteHabit(id) {
        const currentHabits = storage.getHabits();
        currentHabits.forEach((habit, index) => {
            if (habit.id === Number(id)) {
                currentHabits.splice(index, 1)
            }
            localStorage.setItem('habitsapp.habits', JSON.stringify(currentHabits));
        }
        )
    }
}
const ui = {
    theme() {
        themeBtm.classList.toggle('dark');
        const root = document.querySelector(':root');
        root.classList.toggle('dark');
        themeBtm.classList.contains('dark')
            ? storage.saveTheme('dark')
            : storage.saveTheme('light');
    },
    openModel() {
        modalContainer.classList.add('active');
        modalContainer.setAttribute('aria-hidden', 'false');
        newHabitTittle.focus();
    },
    CloseModel() {
        modalContainer.classList.remove('active');
        modalContainer.setAttribute('aria-hidden', 'true');
        newHabitTittle.value = '';
    },

    removeSelectedIcon() {
        icons.forEach(icon => {
            icon.classList.remove('selected');
        })
    },
    addNewHabit(title, icon, id, completed) {
        const habitDiv = document.createElement('div');
        habitDiv.classList.add('habit');
        habitDiv.innerHTML = `<button class="habit-btn ${completed === true ? 'completed ' : ''}" data-id="${id}" data-titile="${title}">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        ${icon}
        </svg> 
        </button>`;
        habitContainer.appendChild(habitDiv);
    },
    refreshHabits() {
        const uiHabits = document.querySelectorAll('.habit');
        uiHabits.forEach(habit => habit.remove());
        const currentHabits = storage.getHabits();

        currentHabits.forEach(function (habit) {
            ui.addNewHabit(habit.title, habit.icon, habit.id, habit.completed);
        });
        //console.table(currentHabits);
    },
    deleteHabit(id) {
        const habitToDelete = document.querySelector(`[data-id="${id}"]`);
        habitToDelete.remove();
        ui.refreshHabits();
    },
}
window.addEventListener('DOMContentLoaded', () => {
    const theme = storage.checkTheme();
    if (theme == 'dark') ui.theme();

    ui.refreshHabits();
});

themeBtm.addEventListener("click", ui.theme);

createHabitBnt.addEventListener('click', ui.openModel);
cancelBtn.addEventListener('click', ui.CloseModel);

icons.forEach((icon) => {
    icon.addEventListener('click', () => {
        ui.removeSelectedIcon();
        icon.classList.add('selected');
    });
});
addBtn.addEventListener('click', () => {
    const habitTitle = newHabitTittle.value;
    let habitIcon;
    icons.forEach(icon => {
        if (!icon.classList.contains('selected')) return;
        habitIcon = icon.querySelector('svg').innerHTML;
    });
    const habitID = Math.random();
    ui.addNewHabit(habitTitle, habitIcon, habitID);
    ui.CloseModel();
    const habit = {
        title: habitTitle,
        icon: habitIcon,
        id: habitID,
        completed: false,
    };
    storage.saveHabit(habit);
})

habitContainer.addEventListener('click', e => {
    if (!e.target.classList.contains('habit-btn')) return;
    e.target.classList.toggle('completed');
    storage.habitStatus(e.target.dataset.id);
})
habitContainer.addEventListener('contextmenu', e => {
    if (!e.target.classList.contains('habit-btn')) return;
    e.preventDefault();
    habitBeDeleted = e.target.dataset.id;
    const { clientX: mouseX, clientY: mouseY } = e;
    contextMenu.style.top = `${mouseY}px`;
    contextMenu.style.left = `${mouseX}px`;
    const contextTitle = document.querySelector('#habitTitle');
    contextTitle.textContent = e.target.dataset.title;
    contextMenu.classList.add('active');
});

deletebtn.addEventListener('click', () => {
    storage.deleteHabit(habitBeDeleted);
    ui.deleteHabit(habitBeDeleted);
    contextMenu.classList.remove('active');
});
