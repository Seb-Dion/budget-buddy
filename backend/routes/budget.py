from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Expense, Income, Budget
from datetime import datetime
from app import db
from calendar import monthrange
from sqlalchemy import func

budget_bp = Blueprint('budget', __name__)

# Route to add a new expense with budget tracking
@budget_bp.route('/expenses', methods=['POST'])
@jwt_required()
def add_expense():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not all(key in data for key in ['category', 'amount', 'date']):
        return jsonify({"error": "Category, amount, and date are required"}), 400

    try:
        expense_date = datetime.strptime(data['date'], '%Y-%m-%d')
        month = expense_date.strftime('%Y-%m')
        amount = float(data['amount'])

        # Create new expense
        new_expense = Expense(
            user_id=user_id,
            category=data['category'],
            amount=amount,
            date=expense_date
        )

        # Find the corresponding budget for this category and month
        budget = Budget.query.filter_by(
            user_id=user_id,
            category=data['category'],
            month=month
        ).first()

        if budget:
            # Calculate total expenses for this category and month
            start_date = f"{month}-01"
            _, last_day = monthrange(expense_date.year, expense_date.month)
            end_date = f"{month}-{last_day}"

            total_expenses = db.session.query(func.sum(Expense.amount)).filter(
                Expense.user_id == user_id,
                Expense.category == data['category'],
                Expense.date.between(start_date, end_date)
            ).scalar() or 0

            # Add the new expense amount
            total_expenses += amount

            # Check against budget limits and update status
            status = "ok"
            message = "Expense added successfully!"
            
            if total_expenses > budget.limit:
                status = "over_budget"
                message = "Expense added, but you have exceeded your budget!"
            elif total_expenses >= 0.8 * budget.limit:
                status = "close_to_budget"
                message = "Expense added. You are close to your budget limit!"

        db.session.add(new_expense)
        db.session.commit()

        # Return updated budget information along with the status
        response_data = {
            "message": message,
            "status": status if budget else "ok",
            "budget_info": None
        }

        if budget:
            response_data["budget_info"] = {
                "category": budget.category,
                "limit": budget.limit,
                "spent": total_expenses,
                "remaining": budget.limit - total_expenses
            }

        return jsonify(response_data), 201

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

    if not expense:
        return jsonify({"error": "Expense not found."}), 404

    try:
        # Get the month of the expense
        month = expense.date.strftime('%Y-%m')

        # Find the corresponding budget
        budget = Budget.query.filter_by(
            user_id=user_id,
            category=expense.category,
            month=month
        ).first()

        # Delete the expense
        db.session.delete(expense)
        db.session.commit()

        response_data = {"message": "Expense deleted successfully!"}

        # If there was a budget, calculate and return updated budget info
        if budget:
            # Calculate new total after deletion
            start_date = f"{month}-01"
            _, last_day = monthrange(expense.date.year, expense.date.month)
            end_date = f"{month}-{last_day}"

            total_expenses = db.session.query(func.sum(Expense.amount)).filter(
                Expense.user_id == user_id,
                Expense.category == expense.category,
                Expense.date.between(start_date, end_date)
            ).scalar() or 0

            response_data["budget_info"] = {
                "category": budget.category,
                "limit": budget.limit,
                "spent": total_expenses,
                "remaining": budget.limit - total_expenses
            }

        return jsonify(response_data), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete expense."}), 500

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

    budget_list = []
    for budget in budgets:
        # Calculate total expenses for this budget's month
        start_date = f"{budget.month}-01"
        month_date = datetime.strptime(budget.month, '%Y-%m')
        _, last_day = monthrange(month_date.year, month_date.month)
        end_date = f"{budget.month}-{last_day}"

        total_spent = db.session.query(func.sum(Expense.amount)).filter(
            Expense.user_id == user_id,
            Expense.category == budget.category,
            Expense.date.between(start_date, end_date)
        ).scalar() or 0

        budget_list.append({
            'id': budget.id,
            'category': budget.category,
            'limit': budget.limit,
            'month': budget.month,
            'spent': float(total_spent),
            'remaining': float(budget.limit - total_spent)
        })

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

# Route to get current month's cash flow
@budget_bp.route('/cash-flow', methods=['GET'])
@jwt_required()
def get_monthly_cash_flow():
    user_id = get_jwt_identity()
    today = datetime.today()
    month_start = today.replace(day=1).strftime('%Y-%m-%d')
    # Get last day of current month
    _, last_day = monthrange(today.year, today.month)
    month_end = today.replace(day=last_day).strftime('%Y-%m-%d')

    # Calculate total income and expenses for the current month
    total_income = sum(income.amount for income in Income.query.filter_by(user_id=user_id).filter(Income.date.between(month_start, month_end)).all())
    total_expenses = sum(expense.amount for expense in Expense.query.filter_by(user_id=user_id).filter(Expense.date.between(month_start, month_end)).all())

    cash_flow = total_income - total_expenses
    return jsonify({"cash_flow": cash_flow, "income": total_income, "expenses": total_expenses}), 200

