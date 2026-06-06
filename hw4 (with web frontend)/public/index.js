let page = 1;

$('.next').on('click', () => {
    const urlParams = new URLSearchParams(window.location.search);

    let page = parseInt(urlParams.get('page') || 1);

    page ++ ;
    window.location.href = `?page=${page}`;
})


$('.previous').on('click', () => {
    const urlParams = new URLSearchParams(window.location.search);

    let page = parseInt(urlParams.get('page') || 1);

    page -- ;
    window.location.href = `?page=${page}`;
})


$('.add').on('click', (event) => {
    const path = window.location.pathname;
    if (path == '/') {
        $('tbody').append(profile);
    } else if (path == '/watched') {
        $('tbody').append(watched);
    } else if (path == '/memorize') {
        $('tbody').append(memorize);
    } else if (path == '/movie') {
        $('tbody').append(movie);
    } else if (path == '/trend') {
        $('tbody').append(trend);
    } else if (path == '/score') {
        $('tbody').append(score);
    }
    
});

$('tbody').on('click', '.save', function () {

    const row = $(this).closest('tr');
    const inputs = row.find('input, select');

    let valid = true;

    inputs.each(function () {
        if (!this.checkValidity()) {
            this.reportValidity();
            valid = false;
            return false;
        }
    }); 

    if (!valid) return;

    // collect values
    let data = {};

    inputs.each(function () {
        const name = $(this).attr('name');
        const value = $(this).val();

        data['path'] = window.location.pathname;
        data[name] = value;
    });

    console.log(data);

    fetch('/save', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(result => {console.log('saved: ', result);})
    .catch(err => console.error(err));

    $(this).closest('tr').remove();
    
    alert('Saved Successfully!');
});

$(document).on('click', '.trash', function () {
    const $row = $(this).closest('tr');
    const rowData = [];

    $row.find('td').each(function() {
        rowData.push($(this).text().trim());    
    })
    
    console.log(rowData[1]);

    fetch(`/items/${rowData[1]}`, {
        method: 'DELETE'
    }).then(res => res.json()).then(
        data => {
            console.log('deleted', data);
            $row.remove();
    }).catch(err => console.error(err));
} )






































const profile = `
    
    <tr>
            <td style="background-color: gray"></td>
            <td style="background-color: gray"></td>
            <td><input type="text" name='gmail' required></td>
            <td><button class="edit-btn"><i class="fa-solid fa-camera-retro"></i></button></td>
            <td>
                <select name='how_inform' required>
                <option value='brochure'>Brochure</option>
                <option value='friends'>Friends</option>
                <option value='social-media'>Social Media</option>
                </select>
            </td>
            <td><input type="date" name='join_date' required></td>
            <td style="background-color: gray"></td>
            <td><button class="edit-btn save" type='submit'>Save</button></td>
    </tr>
    
`

const watched =`
    
    <tr>
            <td style="background-color: gray"></td>
            <td><input type="text" name='gmail' required></td>
            <td><input type="text" name='movie' required></td>
            <td><button class="edit-btn save" type='submit'>Save</button></td>
    </tr>
    
`
const memorize =`
    
    <tr>
            <td style="background-color: gray"></td>
            <td><input type="text" name='gmail' required></td>
            <td><input type="text" name='word' required></td>
            <td><button class="edit-btn save" type='submit'>Save</button></td>
    </tr>
    
`

const movie =`
    
    <tr>
            <td style="background-color: gray"></td>
            <td><input type="text" name='movie' required></td>
            <td><input type="number" name='season' required></td>
            <td><input type="number" name='episode' required></td>
            <td><input type="number" name='rank' required></td>
            <td><input type="date" name='year' required></td>
            <td><button class="edit-btn save" type='submit'>Save</button></td>
    </tr>
    
`

const trend =`
    
    <tr>
            <td style="background-color: gray"></td>
            <td><input type="text" name='movie' required></td>
            <td><input type="date" name='month' required></td>
            <td><input type="number" name='searched' required></td>
            <td><button class="edit-btn save" type='submit'>Save</button></td>
    </tr>
    
`

const score =`
    
    <tr>
            <td style="background-color: gray"></td>
            <td><input type="text" name='gmail' required></td>
            <td style="background-color: gray"></td>
            <td><input type="number" name='memorized' required></td>
            <td><button class="edit-btn save" type='submit'>Save</button></td>
    </tr>
    
`
