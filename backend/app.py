from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

# Define db, bcrypt, jwt at the top level without initializing with app yet
db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()
migrate = Migrate()

def create_app():
    app = Flask(__name__)

    # App configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'  # Set your secret key

    # Initialize the extensions with the app
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # Enable CORS for all routes
    CORS(app)

    # Import and register blueprints after the app is created
    from routes.auth import auth_bp
    from routes.budget import budget_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(budget_bp, url_prefix='/budget')

    return app

