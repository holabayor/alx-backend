#!/usr/bin/env python3
'''
Basic flask app with babel setup
'''
from flask import Flask, render_template, request
from flask_babel import Babel


class Config(object):
    '''
        Config Class
    '''
    LANGUAGES = ['en', 'fr']
    BABEL_DEFAULT_LOCALE = 'en'
    BABEL_DEFAULT_TIMEZONE = 'UTC'


app = Flask(__name__)
babel = Babel(app)
app.config.from_object(Config)


@babel.localeselector
def get_locale():
    '''
     To determine the best match with our supported languages.
    '''
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route('/', strict_slashes=False)
def index() -> str:
    '''
        Index page
    '''
    return render_template('1-index.html')


if __name__ == '__main__':
    app.run()
