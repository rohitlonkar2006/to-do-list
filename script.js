document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todo-form');
    const input = document.getElementById('new-todo');
    const list = document.getElementById('todo-list');
    const clearBtn = document.getElementById('clear-completed');

    function saveState() {
        const items = Array.from(list.querySelectorAll('li')).map(li => {
            const chk = li.querySelector('input[type="checkbox"]');
            const lab = li.querySelector('label');
            return { text: lab.textContent.trim(), checked: !!chk.checked };
        });
        localStorage.setItem('todos', JSON.stringify(items));
    }

    function createTodo(text, checked = false, animate = true) {
        const li = document.createElement('li');
        if (animate) li.classList.add('fade-in-up');

        const id = 't-' + Date.now() + Math.floor(Math.random() * 1000);
        const chk = document.createElement('input');
        chk.type = 'checkbox';
        chk.id = id;
        chk.checked = checked;

        const label = document.createElement('label');
        label.htmlFor = id;
        label.textContent = text;
        if (checked) label.classList.add('completed');

        const del = document.createElement('button');
        del.className = 'delete-btn';
        del.title = 'Delete';
        del.textContent = '✕';

        chk.addEventListener('change', () => {
            label.classList.toggle('completed', chk.checked);
            saveState();
        });

        del.addEventListener('click', () => {
            li.classList.add('slide-out');
            li.addEventListener('animationend', () => { li.remove();
                saveState(); });
        });

        li.appendChild(chk);
        li.appendChild(label);
        li.appendChild(del);
        list.appendChild(li);
        saveState();
        return li;
    }

    function enhanceExisting() {
        // Convert existing static list items into interactive ones
        const existing = Array.from(list.querySelectorAll('li'));
        if (!existing.length) return;
        // If we have saved state, load that instead
        const data = JSON.parse(localStorage.getItem('todos') || 'null');
        if (data) {
            list.innerHTML = '';
            data.forEach(item => createTodo(item.text, item.checked, false));
            return;
        }

        existing.forEach(orig => {
            const chk = orig.querySelector('input[type="checkbox"]');
            const lab = orig.querySelector('label');
            const text = lab ? lab.textContent.trim() : orig.textContent.trim();
            const checked = !!(chk && chk.checked);
            const newLi = createTodo(text, checked, false);
            orig.replaceWith(newLi);
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = input.value.trim();
        if (!val) {
            input.classList.add('shake');
            input.addEventListener('animationend', () => input.classList.remove('shake'), { once: true });
            return;
        }
        createTodo(val, false, true);
        input.value = '';
        input.focus();
    });

    clearBtn.addEventListener('click', () => {
        const checked = Array.from(list.querySelectorAll('input[type="checkbox"]:checked'));
        if (!checked.length) {
            // gentle feedback
            form.classList.add('shake');
            form.addEventListener('animationend', () => form.classList.remove('shake'), { once: true });
            return;
        }
        checked.forEach(c => {
            const li = c.closest('li');
            if (li) {
                li.classList.add('slide-out');
                li.addEventListener('animationend', () => { li.remove();
                    saveState(); });
            }
        });
    });

    // load/enhance
    enhanceExisting();
});