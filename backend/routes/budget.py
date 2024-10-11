from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Expense, Income, Budget
from datetime import datetime

budget_bp = Blueprint('budget', __name__)

# Route to add a new expense
@budget_bp.route('/expenses', methods=['POST'])
@jwt_required()
def add_expense():
    from app import db
    user_id = get_jwt_identity()
    data = request.get_json()

    if not all(key in data for key in ['category', 'amount', 'date']):
        return jsonify({"error": "Category, amount, and date are required"}), 400

    new_expense = Expense(
        user_id=user_id,
        category=data['category'],
        amount=data['amount'],
        date=datetime.strptime(data['date'], '%Y-%m-%d')
    )

    db.session.add(new_expense)
    db.session.commit()

    return jsonify({"message": "Expense added successfully!"}), 201

# Route to get all expenses for the authenticated user
@budget_bp.route('/expenses', methods=['GET'])
@jwt_required()
def get_expenses():
    user_id = get_jwt_identity()
    expenses = Expense.query.filter_by(user_id=user_id).all()

    expense_list = [{
        'id': expense.id,
        'category': expense.category,
        'amount': expense.amount,
        'date': expense.date.strftime('%Y-%m-%d')
    } for expense in expenses]

    return jsonify(expenses=expense_list), 200

# Route to add a new income
@budget_bp.route('/income', methods=['POST'])
@jwt_required()
def add_income():
    from app import db
    user_id = get_jwt_identity()
    data = request.get_json()

    if not all(key in data for key in ['source', 'amount', 'date']):
        return jsonify({"error": "Source, amount, and date are required"}), 400

    new_income = Income(
        user_id=user_id,
        source=data['source'],
        amount=data['amount'],
        date=datetime.strptime(data['date'], '%Y-%m-%d')
    )

    db.session.add(new_income)
    db.session.commit()

    return jsonify({"message": "Income added successfully!"}), 201

# Route to get all income records for the authenticated user
@budget_bp.route('/income', methods=['GET'])
@jwt_required()
def get_income():
    user_id = get_jwt_identity()
    income_records = Income.query.filter_by(user_id=user_id).all()

    income_list = [{
        'id': income.id,
        'source': income.source,
        'amount': income.amount,
        'date': income.date.strftime('%Y-%m-%d')
    } for income in income_records]

    return jsonify(income=income_list), 200

# Route to set a budget for a category in a particular month
@budget_bp.route('/budget', methods=['POST'])
@jwt_required()
def set_budget():
    from app import db
    user_id = get_jwt_identity()
    data = request.get_json()

    if not all(key in data for key in ['category', 'limit', 'month']):
        return jsonify({"error": "Category, limit, and month are required"}), 400

    new_budget = Budget(
        user_id=user_id,
        category=data['category'],
        limit=data['limit'],
        month=data['month']  # Store the month as YYYY-MM
    )

    db.session.add(new_budget)
    db.session.commit()

    return jsonify({"message": "Budget set successfully!"}), 201

@budget_bp.route('/total', methods=['GET'])
@jwt_required()
def get_total_budget():
    user_id = get_jwt_identity()
    budget = Budget.query.filter_by(user_id=user_id).first()  # Adjust if needed
    if budget:
        return jsonify({"total": budget.limit, "used": budget.used}), 200
    return jsonify({"total": 0, "used": 0}), 200
