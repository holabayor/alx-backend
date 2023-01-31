#!/usr/bin/env python3
'''
Basic flask app with babel setup
'''
from flask import Flask, render_template, request
from flask_babel import Babel, _


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


@babel.localeselector
def get_locale():
    '''Gets best match locale according to request'''
    locale = request.args.get('locale')
    if locale and locale in app.config['LANGUAGES']:
        return locale
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route('/', strict_slashes=False)
def index() -> str:
    '''
        Index page
    '''
    return render_template('4-index.html')


if __name__ == '__main__':
    app.run(debug=True)
