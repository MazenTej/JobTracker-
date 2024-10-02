from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from db import db  # Import the db from db.py

# Initialize Flask app
app = Flask(__name__)

# Configurations
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize CORS and Migrate
CORS(app)
migrate = Migrate(app, db)

# Initialize the database with the app
db.init_app(app)

# Import routes and models after db is initialized
from routes import *
from models import *

# Ensure the app runs correctly
if __name__ == '__main__':
    app.run(debug=True)
