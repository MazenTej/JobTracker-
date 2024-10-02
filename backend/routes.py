from flask import request, jsonify
from app import app, db
from models import User, JobApplication, JobApplicationStatusHistory, Reminder
from datetime import datetime

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Check if user already exists
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User already exists"}), 400

    # Create a new user
    new_user = User(email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    # Check if user exists and password matches
    if user and user.check_password(password):
        return jsonify({"message": "Login successful", "user_id": user.id}), 200

    return jsonify({"message": "Invalid credentials"}), 401

@app.route('/applications', methods=['POST'])
def add_application():
    data = request.json
    user_id = data.get('user_id')
    company = data.get('company')
    job_title = data.get('jobTitle')
    status_timeline = data.get('statusTimeline')  # Receive status timeline from frontend
    notes = data.get('notes', '')

    # Validate that the status timeline is provided
    if not status_timeline or len(status_timeline) == 0:
        return jsonify({"message": "Status timeline is required"}), 400

    # Get the latest status from the timeline
    latest_status = status_timeline[-1]  # The last entry in the timeline is the current status

    # Create the new job application record
    try:
        date_applied = datetime.strptime(latest_status['date_changed'], '%Y-%m-%d').date()  # Date of the latest status
    except ValueError:
        return jsonify({"message": "Invalid date format. Use YYYY-MM-DD."}), 400

    new_application = JobApplication(
        user_id=user_id,
        company=company,
        job_title=job_title,
        status=latest_status['status'],  # Current status
        date_applied=date_applied,  # Use the date of the latest status
        notes=notes
    )
    db.session.add(new_application)
    db.session.commit()  # Commit to get the application ID

    # Insert the status history into the JobApplicationStatusHistory table
    for entry in status_timeline:
        try:
            date_changed = datetime.strptime(entry['date_changed'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({"message": "Invalid date format in status timeline. Use YYYY-MM-DD."}), 400

        status_history = JobApplicationStatusHistory(
            application_id=new_application.id,
            status=entry['status'],
            date_changed=date_changed
        )
        db.session.add(status_history)

    db.session.commit()  # Commit the status history entries

    return jsonify({"message": "Job application added successfully"}), 201







@app.route('/applications/<int:user_id>', methods=['GET'])
def get_applications(user_id):
    # Get query parameters for pagination and filtering
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 5, type=int)
    status = request.args.get('status', None)
    company = request.args.get('company', None)
    job_title = request.args.get('job_title', None)

    # Base query
    query = JobApplication.query.filter_by(user_id=user_id)

    # Apply filters if provided
    if company:
        query = query.filter(JobApplication.company.ilike(f"%{company}%"))
    if job_title:
        query = query.filter(JobApplication.job_title.ilike(f"%{job_title}%"))

    # Filter based on latest status in status history
    if status:
        query = query.join(JobApplicationStatusHistory).filter(
            JobApplicationStatusHistory.status == status
        ).group_by(JobApplication.id).having(
            JobApplicationStatusHistory.date_changed == db.func.max(JobApplicationStatusHistory.date_changed)
        )

    # Paginate the query
    paginated_applications = query.paginate(page=page, per_page=per_page, error_out=False)

    # Prepare the response with pagination metadata
    result = {
        "applications": [
            {
                "id": app.id,
                "company": app.company,
                "job_title": app.job_title,
                "status": app.status,
                "date_applied": app.date_applied.strftime('%Y-%m-%d'),
                "notes": app.notes,
                "status_history": [
                    {
                        "status": sh.status,
                        "date_changed": sh.date_changed.strftime('%Y-%m-%d')
                    } for sh in JobApplicationStatusHistory.query.filter_by(application_id=app.id)
                ],
                # Include reminders
                "reminders": [
                    {
                        "id": r.id,
                        "reminder_type": r.reminder_type,
                        "reminder_date": r.reminder_date.strftime('%Y-%m-%d %H:%M:%S'),
                        "message": r.message
                    } for r in app.reminders  # Assuming JobApplication has a relationship to reminders
                ]
            } for app in paginated_applications.items
        ],
        "total": paginated_applications.total,
        "page": paginated_applications.page,
        "per_page": paginated_applications.per_page,
        "pages": paginated_applications.pages
    }

    return jsonify(result), 200



@app.route('/application/<int:application_id>', methods=['GET'])
@app.route('/application/<int:application_id>', methods=['GET'])
def get_application_by_id(application_id):
    application = JobApplication.query.get(application_id)
    if not application:
        return jsonify({"message": "Application not found"}), 404

    status_history = JobApplicationStatusHistory.query.filter_by(application_id=application_id).all()

    result = {
        'id': application.id,
        'company': application.company,
        'job_title': application.job_title,
        'status': application.status,
        'date_applied': application.date_applied.strftime('%Y-%m-%d'),
        'notes': application.notes,
        'status_history': [
            {
                'status': history.status,
                'date_changed': history.date_changed.strftime('%Y-%m-%d')
            }
            for history in status_history
        ]
    }
    return jsonify(result), 200



@app.route('/applications/<int:application_id>', methods=['PUT'])
def update_application(application_id):
    application = JobApplication.query.get(application_id)
    if not application:
        return jsonify({"message": "Application not found"}), 404

    data = request.json
    status_timeline = data.get('statusTimeline')  # The status timeline from the frontend

    if not status_timeline:
        return jsonify({"message": "Status timeline is required"}), 400

    # Update job application with the latest status and date from the timeline
    latest_status = status_timeline[-1]
    application.status = latest_status['status']
    application.date_applied = datetime.strptime(latest_status['date_changed'], '%Y-%m-%d').date()

    # Delete old status history for this application
    JobApplicationStatusHistory.query.filter_by(application_id=application_id).delete()

    # Insert the new status timeline into JobApplicationStatusHistory
    for entry in status_timeline:
        date_changed = datetime.strptime(entry['date_changed'], '%Y-%m-%d').date()
        status_history = JobApplicationStatusHistory(
            application_id=application_id,
            status=entry['status'],
            date_changed=date_changed
        )
        db.session.add(status_history)

    # Commit all changes
    db.session.commit()

    return jsonify({"message": "Application updated successfully"}), 200




@app.route('/applications/<int:application_id>', methods=['DELETE'])
def delete_application(application_id):
    application = JobApplication.query.get(application_id)
    if not application:
        return jsonify({"message": "Application not found"}), 404

    db.session.delete(application)
    db.session.commit()
    
    return jsonify({"message": "Application deleted successfully"}), 200



@app.route('/applications/<int:application_id>/reminders', methods=['POST'])
def add_reminder(application_id):
    data = request.json
    reminder_date = data.get('reminder_date')
    reminder_type = data.get('reminder_type')
    message = data.get('message', '')

    # Validate that the job application exists
    application = JobApplication.query.get(application_id)
    if not application:
        return jsonify({"message": "Application not found"}), 404

    # Validate and parse the reminder date
    try:
        reminder_date = datetime.strptime(reminder_date, '%Y-%m-%d %H:%M:%S')
    except ValueError:
        return jsonify({"message": "Invalid date format. Use YYYY-MM-DD HH:MM:SS"}), 400

    new_reminder = Reminder(
        application_id=application_id,
        reminder_date=reminder_date,
        reminder_type=reminder_type,
        message=message
    )

    db.session.add(new_reminder)
    db.session.commit()

    return jsonify({"message": "Reminder added successfully", "reminder": {
        "reminder_type": reminder_type,
        "reminder_date": reminder_date.strftime('%Y-%m-%d %H:%M:%S'),
        "message": message
    }}), 201

@app.route('/reminders/<int:reminder_id>', methods=['DELETE'])
def delete_reminder(reminder_id):
    reminder = Reminder.query.get(reminder_id)
    if not reminder:
        return jsonify({"message": "Reminder not found"}), 404

    db.session.delete(reminder)
    db.session.commit()

    return jsonify({"message": "Reminder deleted successfully"}), 200
