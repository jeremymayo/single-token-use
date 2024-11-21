from flask import Flask, render_template, request, url_for, flash, redirect
from flask_wtf import FlaskForm
from wtforms import StringField, validators
import requests
import jwt
from datetime import datetime, timezone, timedelta
import uuid
import sqlite3
from werkzeug.exceptions import abort

app = Flask(__name__)

# initializing global variables
tableau_ticket_return = ''
username = ''
#CA TOKEN Secrets
ISSUER = '2f5243bb-681e-4d02-bd37-d5e720569de7'
SECRET = 'tMaRp27qsXQOrxdUwXzFZGZ0+hqJSRDh/RBbfaWVebg='
SECRET_ID = 'e0e04c2b-9374-478e-b77d-ed57a2e94a9c'

# this secret key is here a string just so we have forms working - if you want to know more google it ;-)
app.config['SECRET_KEY'] = 'somesecretkey'

# instance the form class - inheritance is from the FlaskForm.
# You can name the calss as you like - we named it "UserForm"
class UserForm(FlaskForm):
    # Below are the form fields we want to be able to capture and send (in our case just the username) to Tableau server.
    # These are used as form attributes in .html file
    # in the quotes is the text user will see when using the form
    username = StringField("Username:", validators=[validators.DataRequired()])

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/loading', methods=['GET','POST'])
def login():
    CA_SSO_token = jwt.encode(
        {
            "iss": ISSUER,
            "exp": datetime.now(timezone.utc) + timedelta(minutes=10),
            "jti": str(uuid.uuid4()),
            "aud": "tableau",
            "sub": 'jmayo@tableau.com',
            # "sub": user,
            "scp": ['tableau:content:read',
                    'tableau:views:embed']
        },
        SECRET,
        algorithm="HS256",
        headers={
            'kid': SECRET_ID,
            'iss': ISSUER
        }
    )
    print(CA_SSO_token)
    return render_template('loader.html', CA_SSO_token = CA_SSO_token, username = username)

@app.route('/dashboard')
def loadDashboard():
    return render_template('dashboard.html', username = username)


if __name__ == '__main__':
    app.run(debug=True)