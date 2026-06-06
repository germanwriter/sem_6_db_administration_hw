"""1. how many words a user memorized"""
# def (num_memorized_words)
    # create or replace view view_num_memorize_words as
    # select  u.gmail "user", null, count(m.word_id) "words" from memorize m
    # join users u using(user_id)
    # group by u.gmail;

"""2. which words a user memorized"""
# def ()
#     create or replace view view_list_memorize_words as
#     select u.gmail, w.words from memorize m
#     join users u
#     on (u.user_id = m.user_id)
#     join words w
#     on (w.words_id = m.word_id)
#     where u.user_id = &user_id
#     ;

#3
class which_movies_a_user_seen_at_which_date(): {
    #     create or replace view view_movie_user_seen as
        #     select distinct(u.gmail), mov.name, m.memorize_date from memorize m
        #     join users u
        #     on (u.user_id = m.user_id)
        #     join movie mov
        #     on (m.movie_id = mov.movie_id)
        #     where u.user_id = 1;
}

"""4. words used in a movies"""
# def ():
    # create or replace view view_words_in_movie as
    # select mov.name, w.words from words w
    # join movie_words m
    # on (m.words_id = w.words_id)
    # join movie mov
    # on (mov.movie_id = m.movie_id)
    # where m.movie_id = 1;


"""5. number of words used in a movie"""
# def ():
    #     create or replace view view_num_words_in_movie as
    #     select mov.name, count(w.words) from words w
    #     join movie_words m
    #     on (m.words_id = w.words_id)
    #     join movie mov
    #     on (mov.movie_id = m.movie_id)
    #     where m.movie_id = 1
    #     group by mov.name;

"""6. word, meaning, sentence and defination"""
# def ():
    # create or replace view view_words_specific as
    # select w.words, s.pronunciation, m.meaning, d.defination, sen.sentence from words w
    # join specefics s
    # on (w.words_id = s.word_id)
    # join meaning m
    # on (s.specific_id = m.specific_id)
    # join defination d
    # on (s.specific_id = d.specific_id)
    # join sentence sen
    # on (s.specific_id = sen.specific_id)
    # where w.words_id = 1

"""7. most trend movies"""
# def ():
#     create or replace view view_trend_movies as
#     select name, month, searches from (
#     select month, movie_id, searches, row_number() over(partition by month order by searches desc) as rank  from (
#         SELECT 
#             trunc(memorize_date, 'month') AS month,
#             movie_id,
#             COUNT(memorize_id) AS searches
#         FROM memorize
#         GROUP BY memorize_date, movie_id
#     )
#     )
#     join movie using(movie_id)
#     where rank = 1
#     ;

"""8. information about users """
# def ():
    # create or replace view view_user_info as 
    # select gmail, total_download, join_date from users;

"""9. info about movies """
# def ():
    # create or replace view view_movie_info as 
    # select name, season, episode, ranking, release_year from movie;

"""10. info about subtitles"""
# def ():
    # create or replace view view_subtitle_info as 
    # select language, path from subtitle;

"""1. top earners in each department"""
# def ():
    # create or replace view view_top_earners as
    # select max(e.salary), d.department_name from employees e
    # join departments d
    # on (d.department_id = e.department_id)
    # group by department_name;

"""2. employees with department name"""
# def ():
    # create or replace view view_user_department as
    # select e.first_name, d.department_name from employees e
    # join departments d
    # on (d.department_id = e.department_id)
    # ;

"""3. numb of employees in each department"""
# def ():
    # create or replace view view_department_employees as
    # select d.department_name, null as "null", count(e.first_name) as "employees" from employees e
    # join departments d
    # on (d.department_id = e.department_id)
    # group by d.department_name
    # ;

"""4. annual salary of each department"""
# def ():
    # create or replace view view_department_ann_salary as
    # select d.department_name, null as "null", sum(e.salary*12) as "employees" from employees e
    # join departments d
    # on (d.department_id = e.department_id)
    # group by d.department_name
    # ;

"""5. manager of each employee"""
# def ():
    # create or replace view view_mangers as
    # select e.first_name "employee", m.first_name "manager" from employees e
    # join employees m
    # on (m.employee_id = e.manager_id);