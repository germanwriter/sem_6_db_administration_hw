import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import OracleDB from 'oracledb';
import { error, info } from 'console';
import { connect } from 'http2';

const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const limit = 10;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(express.json());

app.get('/', async (req, res) => {
    const page = parseInt(req.query.page || 1);
    const offset = (page - 1) * limit
    var header = ['ID', "Email", 'Profile', 'Inform', 'Date', 'Downloads'];
    // only send 10 rows, so frontend can display it in a page
    // var body = [
    //     ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
    //     ['1', '2', '3', '4', '5', '6', '7', '8']
    // ];
    await logic(res, "select user_id, gmail, profile_path, how_inform, to_char(join_date, 'yy-mon-dd'), total_download from users order by user_id desc offset :offset rows fetch next :limit rows only", {offset, limit}, header, 'profile');
})

app.get('/watched', async (req, res) => {
    const page = parseInt(req.query.page || 1);
    const offset = (page - 1) * limit
    var header = ['Email', 'Movie'];
    await logic(res, "select * from view_movie_user_seen offset: offset rows fetch next :limit rows only", {offset, limit}, header, 'watched'); 
})

app.get('/memorize', async (req, res) => {
    const page = parseInt(req.query.page || 1);
    const offset = (page - 1) * limit
    var header = ['Email', 'Words'];
    await logic(res, "select * from view_list_memorize_words offset: offset rows fetch next :limit rows only", {offset, limit}, header, 'memorize'); 
})

app.get('/movie', async (req, res) => {
    const page = parseInt(req.query.page || 1);
    const offset = (page - 1) * limit
    var header = ['Movie', 'Season', 'Episode', 'Rank', 'Year'];
    await logic(res, "select name, season, episode, ranking, to_char(release_year, 'yyyy') from view_movie_info offset: offset rows fetch next :limit rows only", {offset, limit}, header, 'movie'); 
})

app.get('/trend', async (req, res) => {
    const page = parseInt(req.query.page || 1);
    const offset = (page - 1) * limit
     var header = ['Movie', 'Month', 'Searched'];
    await logic(res, "select name, to_char(month, 'yyyy-mon'), searches from view_trend_movies offset: offset rows fetch next :limit rows only", {offset, limit}, header, 'trend'); 
})

app.get('/score', async (req, res) => {
    const page = parseInt(req.query.page || 1);
    const offset = (page - 1) * limit
    var header = ['User', 'null', 'memorized'];
    await logic(res, "select * from view_num_memorize_words offset: offset rows fetch next :limit rows only", {offset, limit}, header, 'score'); 
})

app.post('/save', async (req, res) => {
    try {
        const path = req.body.path;

        if (path == '/') {
            const {path, gmail, how_inform} = req.body;
            const join_date = req.body.join_date;
            console.log(`path:  ${path}, gmail: ${gmail} inform: ${how_inform} date: ${join_date}`);
            saveLogic(res, `insert into users (user_id, gmail, how_inform, join_date) values (users_seq.nextval, :gmail, :how_inform, TO_DATE(:join_date, 'YYYY-MM-DD'))`, {gmail, how_inform, join_date}
            );

        } else if (path == '/watched') {
            const {path, gmail, movie} = req.body;
            console.log(`path: ${path}, gmail: ${gmail},, movie: ${movie}`);

        } else if (path == '/memorize') {
            const {path, gmail, word} = req.body;
            console.log(`path: ${path}, gmail: ${gmail}, word: ${word}`)

        } else if (path == '/movie') {
            const {path, movie, season, episode, rank, year} = req.body;
            console.log(`path: ${path}, movie: ${movie}, season: ${season}, episode: ${episode}, rank: ${rank}, year: ${year}`)

        } else if (path == '/trend') {
            const {path, movie, month, searched} = req.body;
            console.log(`path: ${path}, movie: ${movie}, month: ${month}, searched: ${searched}`);

        } else if (path == '/score') {
            const {path, gmail, memorized} = req.body;
            console.log(`path: ${path}, gmail: ${gmail}, memorized: ${memorized}`);
        
        }
        
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
})

app.delete('/items/:id', (req, res) => {
    try {
    const user_id = req.params.id;

    console.log('deleteing item: ', user_id);

    deleteLogic(res, 'delete from users where user_id = :user_id', {user_id});

    res.json({success: true, user_id}); 
    } catch(err) {
        console.error(err);
        res.status(500).json({error: err.message})
    }
});























app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
})

function oracleInstance() {
    try {
        return OracleDB.getConnection({
            user: 'emran',
            password: 'parwan',
            connectString: 'localhost:1521/seeloo_pdb'
        });
    } catch (err) {
        console.error('connection error: ', err);
        throw err;
    }
}

async function logic(res, command, offsetLimit, header, whichPage) {
    let connection;
    try {
        connection = await oracleInstance();
        const result =  await connection.execute(command, offsetLimit);
        res.render('index', {'header':header, 'body':result.rows.slice(0,limit), 'whichPage': whichPage});
    } catch(err) {
        console.error(err);
        res.status(500).json({error: err.message});
    } finally {
        if (connection) {
            try {
                 connection.close();
            } catch(err) {
                console.error(err);
            }
        }
    };
}

async function saveLogic(res, command, header) {
    let connection;
    try { 
        connection = await oracleInstance();
        const result = await connection.execute(command, header, {autoCommit: true});
    } catch(err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    } finally {
        if (connection) { 
            try {
                connection.close();
            } catch(err) {
                console.error(err);
            }
        }
    }
}


async function deleteLogic(res, command, header) {
    let connection;
    try { 
        connection = await oracleInstance();
        const result = await connection.execute(command, header,  {autoCommit: true});
    } finally {
        if (connection) { 
            try {
                connection.close();
            } catch(err) {
                console.error(err);
            }
        }
    }
}