#!/usr/bin/env python3
'''
Basic flask app with basic babel setup
'''
from flask import Flask, render_template
from flask_babel import Babel


class Config(object):
    '''
        Config Class
    '''
    LANGUAGES = ['en', 'fr']
    BABEL_DEFAULT_LOCALE = 'en'
    BABEL_DEFAULT_TIMEZONE = 'UTC'


app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app)


@app.route('/')
def index() -> str:
    '''
        Index page
    '''
    return render_template('1-index.html')


if __name__ == '__main__':
    app.run()
