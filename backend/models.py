from datetime import datetime
from db import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)


class JobApplication(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    company = db.Column(db.String(120), nullable=False)
    job_title = db.Column(db.String(120), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    date_applied = db.Column(db.Date, nullable=False)
    notes = db.Column(db.Text)

    # Relationship to Reminder with cascade delete
    reminders = db.relationship('Reminder', backref='application', lazy=True, cascade="all, delete-orphan")

    # Relationship to status history with cascade delete
    status_history = db.relationship('JobApplicationStatusHistory', backref='application', cascade="all, delete-orphan")
    

class Reminder(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, db.ForeignKey('job_application.id', ondelete="CASCADE"), nullable=False)
    reminder_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)  # Default to current time if not provided
    reminder_type = db.Column(db.String(50), nullable=False)  # e.g., "Follow-up", "Interview"
    message = db.Column(db.Text, nullable=True)

class JobApplicationStatusHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, db.ForeignKey('job_application.id'), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    date_changed = db.Column(db.DateTime, default=datetime.utcnow)





