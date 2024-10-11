from app import create_app, db
from models import User, Expense, Income  # Import your models

app = create_app()

# Use the application context to create the database
with app.app_context():
    db.create_all()
    print("Database initialized!")
