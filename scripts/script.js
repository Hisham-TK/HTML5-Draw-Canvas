ヒシャム = new Date();
const $ = q => (s = document.querySelectorAll(q)).length - 1 && s.length ? [...s] : s[0],
    l = (...o) => console.log(...o);

addEventListener('load', () => {

    let // selectors
        brush_size = $('#brush_size'),
        canvas = $('#canvas'),
        user_color = $('#user_color'),
        download_anchor = $('#download'),
        circle = $('#circle'),
        square = $('#square'),
        user_name = $('#user_name'),
        toolbar = $('#toolbar'),
        popup = $('#popup'),
        current_user = $('#current_user'),
        old_users = $('#old_users'),

        // variables
        brush_size_code = +localStorage.getItem('brush_size') || (localStorage.setItem('brush_size', 13), 13),
        shape = localStorage.getItem('shape') || 'circle',
        mouseDown = 0,
        ctx = canvas.getContext('2d');

    for (let i = 1, l = +localStorage.getItem('users_counter') +1; i < l; i++) old_users.innerHTML += `<li><input type="radio" name="users" id="user_${i}"><label for="user_${i}">${localStorage.getItem('user_' + i)}</label></li>`;

    canvas.width = innerWidth;
    canvas.height = innerHeight;

    // Local storage
    if (localStorage.getItem('last_color')) {
        user_color.style.backgroundColor = localStorage.getItem('last_color');
        user_color.value = localStorage.getItem('last_color');
    }
    if (!localStorage.getItem('color_counter')) localStorage.setItem('color_counter', -1);
    if (localStorage.getItem('brush_size')) brush_size.innerText = +localStorage.getItem('brush_size');
    if (!localStorage.getItem('users_counter')) localStorage.setItem('users_counter', 0);
    localStorage.setItem('shape', shape);

    addEventListener('click', e => {
        switch (e.target.id) {
            case 'increment':
                brush_size_code = brush_size_code + 1 > 33 ? 33 : brush_size_code + 1;
                brush_size.innerText = brush_size_code;
                localStorage.setItem('brush_size', brush_size_code);
                break;
            case 'decrement':
                brush_size_code = brush_size_code - 1 < 10 ? 10 : brush_size_code - 1;
                brush_size.innerText = brush_size_code;
                localStorage.setItem('brush_size', brush_size_code);
                break;
            case 'clear_colors':
                // 'color_counter color_0 color_1 color_2 color_3 last_color brush_size'.split` `.forEach(e => localStorage.removeItem(e));
                user_color.style.backgroundColor = '#ff00ff';
                // localStorage.setItem('color_0', '#ff00ff');
                localStorage.setItem('last_color', '#ff00ff');
                break;
            case 'clear_screen':
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                break;
            case 'save':
                download_anchor.setAttribute('href', canvas.toDataURL('image/png'));
                download_anchor.setAttribute('download', 'my_draw.png');
                download_anchor.click();
                break;
            case 'circle':
                shape = 'circle';
                circle.className = 'shapes active';
                square.className = 'shapes';
                break;
            case 'square':
                shape = 'square';
                square.className = 'shapes active';
                circle.className = 'shapes';
                break;
            case 'add':
                // l(user_name.value)
                if (/\w+/gi.exec(user_name.value)) {
                    localStorage.setItem('users_counter', +localStorage.getItem('users_counter') + 1);
                    localStorage.setItem(`user_${localStorage.getItem('users_counter')}`, user_name.value);
                    localStorage.setItem('current_user_key', `user_${localStorage.getItem('users_counter')}`);
                    localStorage.setItem('current_user', user_name.value);
                    toolbar.style.display = 'unset';
                    popup.style.display = 'none';
                    current_user.innerText = user_name.value;
                }
                break;
            case 'select':
                let checked_user = $('[type=radio]:checked');
                if (checked_user) {
                    let selected_user_key = localStorage.getItem(checked_user.id);
                    localStorage.setItem('current_user_key', checked_user.id);
                    toolbar.style.display = 'unset';
                    popup.style.display = 'none';
                    current_user.innerText = selected_user_key;
                    // l('hello from select')
                }
                break;
        }
        l(e.target.id)
    });

    addEventListener('change', e => {
        if (e.target.id === 'user_color') {
            localStorage.setItem('last_color', e.target.value);
            user_color.style.backgroundColor = e.target.value;
            localStorage.setItem('color_counter', +localStorage.getItem('color_counter') + 1);
            localStorage.setItem(`color_${localStorage.getItem('color_counter') % 4}`, e.target.value);
            l(Array.from({length: 4}, (v, i) => localStorage.getItem(`color_${i}`)));
        }
        l(e.target.id)
    });

    // Drawing on canvas
    canvas.addEventListener('mousedown', () => mouseDown = 1);
    canvas.addEventListener('mouseup', () => mouseDown = 0);
    canvas.addEventListener('mousemove', e => {
        if (mouseDown) {
            ctx.fillStyle = localStorage.getItem('last_color') || '#ff00ff';
            ctx.beginPath();
            switch (shape) {
                case 'circle':
                    ctx.arc(e.clientX, e.clientY - 50, brush_size_code, 0, 8);
                    break;
                case 'square':
                    ctx.rect(e.clientX, e.clientY - 50, brush_size_code * 2, brush_size_code * 2);
                    break;
            }
            ctx.fill();
            ctx.closePath();
        }
    });
});

console.log(`${(new Date() - ヒシャム) / 1e3} second`);
