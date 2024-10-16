from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Expense, Income, Budget
from datetime import datetime
from app import db

budget_bp = Blueprint('budget', __name__)

# Route to add a new expense
@budget_bp.route('/expenses', methods=['POST'])
@jwt_required()
def add_expense():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not all(key in data for key in ['category', 'amount', 'date']):
        return jsonify({"error": "Category, amount, and date are required"}), 400

    try:
        new_expense = Expense(
            user_id=user_id,
            category=data['category'],
            amount=float(data['amount']),
            date=datetime.strptime(data['date'], '%Y-%m-%d')
        )
        db.session.add(new_expense)
        db.session.commit()

        return jsonify({"message": "Expense added successfully!"}), 201
    except ValueError:
        return jsonify({"error": "Invalid data format"}), 400

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

# Route to delete an expense
@budget_bp.route('/expenses/<int:expense_id>', methods=['DELETE'])
@jwt_required()
def delete_expense(expense_id):
    user_id = get_jwt_identity()
    expense = Expense.query.filter_by(id=expense_id, user_id=user_id).first()

    if expense:
        db.session.delete(expense)
        db.session.commit()
        return jsonify({"message": "Expense deleted successfully!"}), 200

    return jsonify({"error": "Expense not found."}), 404

# Route to add a new income
@budget_bp.route('/income', methods=['POST'])
@jwt_required()
def add_income():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not all(key in data for key in ['source', 'amount', 'date']):
        return jsonify({"error": "Source, amount, and date are required"}), 400

    try:
        new_income = Income(
            user_id=user_id,
            source=data['source'],
            amount=float(data['amount']),
            date=datetime.strptime(data['date'], '%Y-%m-%d')
        )
        db.session.add(new_income)
        db.session.commit()

        return jsonify({"message": "Income added successfully!"}), 201
    except ValueError:
        return jsonify({"error": "Invalid data format"}), 400

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

# Route to delete an income record
@budget_bp.route('/income/<int:income_id>', methods=['DELETE'])
@jwt_required()
def delete_income(income_id):
    user_id = get_jwt_identity()
    income = Income.query.filter_by(id=income_id, user_id=user_id).first()

    if income:
        db.session.delete(income)
        db.session.commit()
        return jsonify({"message": "Income deleted successfully!"}), 200

    return jsonify({"error": "Income not found."}), 404

# Route to set or update a budget for a category in a particular month
@budget_bp.route('/budget', methods=['POST'])
@jwt_required()
def set_budget():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not all(key in data for key in ['category', 'limit', 'month']):
        return jsonify({"error": "Category, limit, and month are required"}), 400

    try:
        # Check if a budget already exists for this user, category, and month
        existing_budget = Budget.query.filter_by(user_id=user_id, category=data['category'], month=data['month']).first()

        if existing_budget:
            # Update the existing budget limit
            existing_budget.limit = float(data['limit'])
            db.session.commit()
            return jsonify({"message": "Budget updated successfully!"}), 200
        else:
            new_budget = Budget(
                user_id=user_id,
                category=data['category'],
                limit=float(data['limit']),
                month=data['month']  # Store the month as YYYY-MM
            )
            db.session.add(new_budget)
            db.session.commit()
            return jsonify({"message": "Budget set successfully!"}), 201
    except ValueError:
        return jsonify({"error": "Invalid data format"}), 400

# Route to get all budgets for the authenticated user
@budget_bp.route('/budgets', methods=['GET'])
@jwt_required()
def get_budgets():
    user_id = get_jwt_identity()
    budgets = Budget.query.filter_by(user_id=user_id).all()

    budget_list = [{
        'id': budget.id,
        'category': budget.category,
        'limit': budget.limit,
        'month': budget.month
    } for budget in budgets]

    return jsonify(budgets=budget_list), 200

# Route to delete a budget
@budget_bp.route('/budget/<int:budget_id>', methods=['DELETE'])
@jwt_required()
def delete_budget(budget_id):
    user_id = get_jwt_identity()
    budget = Budget.query.filter_by(id=budget_id, user_id=user_id).first()

    if budget:
        db.session.delete(budget)
        db.session.commit()
        return jsonify({"message": "Budget deleted successfully!"}), 200

    return jsonify({"error": "Budget not found."}), 404

# Route to get total and used budget for the authenticated user
@budget_bp.route('/total', methods=['GET'])
@jwt_required()
def get_total_budget():
    user_id = get_jwt_identity()
    budgets = Budget.query.filter_by(user_id=user_id).all()

    total_limit = sum(budget.limit for budget in budgets)
    total_used = sum(expense.amount for expense in Expense.query.filter_by(user_id=user_id).all())

    return jsonify({"total": total_limit, "used": total_used}), 200
