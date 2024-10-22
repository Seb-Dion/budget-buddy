from app import db
from datetime import datetime, date

# User model with explicit table name
class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    # Streaks and tracking fields
    daily_login_streak = db.Column(db.Integer, default=0)  # Daily login streak
    monthly_balance_streak = db.Column(db.Integer, default=0)  # Positive monthly balance streak
    monthly_budget_streak = db.Column(db.Integer, default=0)  # Monthly budget streak
    last_login = db.Column(db.Date, default=None)  # To track last login date for streak
    last_balance_check = db.Column(db.Date, default=None)  # To track last balance check for monthly streak

    # Relationships to link expenses, incomes, and savings goals to users
    expenses = db.relationship('Expense', backref='user', lazy=True)
    incomes = db.relationship('Income', backref='user', lazy=True)
    def check_daily_login_streak(self):
        today = date.today()
        if self.last_login == today:
            return
        elif self.last_login == today - timedelta(days=1):
            self.daily_login_streak += 1
        else:
            self.daily_login_streak = 1
        self.last_login = today

    def reset_daily_login_streak(self):
        self.daily_login_streak = 0

    def __repr__(self):
        return f"<User {self.username}, Email: {self.email}>"

# Expense model with foreign key reference to users
class Expense(db.Model):
    __tablename__ = 'expenses'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # ForeignKey to users
    category = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f"<Expense {self.category}, {self.amount}, {self.date}>"

# Income model with foreign key reference to users
class Income(db.Model):
    __tablename__ = 'incomes'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # ForeignKey to users
    source = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f"<Income {self.source}, {self.amount}, {self.date}>"

# Budget model to track spending limits
class Budget(db.Model):
    __tablename__ = 'budgets'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # ForeignKey to users
    category = db.Column(db.String(50), nullable=False)
    limit = db.Column(db.Float, nullable=False)
    month = db.Column(db.String(7), nullable=False)  # Store as YYYY-MM for month tracking

    def __repr__(self):
        return f"<Budget {self.category}, {self.limit}, {self.month}>"


